<template>
  <div>
    <el-input v-model="msg" placeholder="请输入内容" />
    <button @click="send">发消息</button>
    <el-input v-model="newAccount" placeholder="请输入要创建的账号" />
    <button @click="create">创建账号</button>
    <el-input v-model="oldAccount" placeholder="请输入要登录的账号" />
    <button @click="login">登录</button>
    <el-input v-model="chatMsg" type="textarea" autosize />
  </div>
</template>

<script>
import md5 from 'js-md5'

export default {
  data() {
    return {
      path: 'ws://192.168.11.65:8088',
      socket: '',
      sn: 0n,
      msg: '',
      newAccount: '',
      oldAccount: '',
      key: 'GAME-FRAMEWORK-GATEWAY',
      chatMsg: '',
      receive: undefined,
      receiveIndex: 0,
      protocolHeader: new DataView(new ArrayBuffer(6)),
      protocolHeaderIndex: 0
    }
  },
  mounted() {
    // 初始化
    this.init()
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close
  },
  methods: {
    init: function() {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
        this.socket.binaryType = 'arraybuffer'
      }
    },
    open: function() {
      console.log('socket连接成功')
    },
    error: function() {
      console.log('连接错误')
    },
    getMessage: function(msg) {
      // 本次接收的数据
      const data = new DataView(new Uint8Array(msg.data).buffer)
      // 本次接收的数据长度
      const dataLength = data.byteLength
      console.log('本次接收的数据长度->' + dataLength)
      // 上次接收的协议头数据下标
      console.log('上次接收的协议头数据下标->' + this.protocolHeaderIndex)
      // 上次接收协议头数据
      const protocolLength = this.protocolHeader.byteLength
      console.log('协议头数据长度->' + protocolLength)
      var dataIndex = 0
      while (dataIndex < dataLength - 1) {
        if (this.protocolHeaderIndex < protocolLength - 1) {
          const end = Math.min(dataLength - dataIndex, protocolLength - this.protocolHeaderIndex)
          for (; dataIndex < end; dataIndex += 1) {
            this.protocolHeader.setUint8(this.protocolHeaderIndex + dataIndex, data.getUint8(dataIndex))
          }
          // 修正
          this.protocolHeaderIndex += end
          console.log('修正接收的协议头数据下标->' + this.protocolHeaderIndex)
        }

        console.log('协议头过后接收的数据下标->' + dataIndex)

        // 判断数据是否接收完成
        if (dataIndex >= dataLength) {
          return
        }

        console.log('上次接收的数据下标->' + this.receiveIndex)
        if (!this.receive) {
        // 未生成接收数据载体,读取长度
          const msgLength = this.protocolHeader.getInt32(2)
          console.log('消息长度->' + msgLength)
          this.receive = new DataView(new ArrayBuffer(msgLength))
        }
        // 数据长度
        const lastReceiveLength = this.receive.byteLength
        console.log('上次接收的消息长度->' + lastReceiveLength)
        // 剩余数据长度
        const dataEnd = Math.min(lastReceiveLength - this.receiveIndex, dataLength - dataIndex)
        console.log('本次接收的数据长度->' + dataEnd)
        for (var j = 0; j < dataEnd; j++) {
          this.receive.setUint8(this.receiveIndex + j, data.getUint8(dataIndex))
          dataIndex += 1
        }
        this.receiveIndex += dataEnd
        console.log('修正上次接收的数据下标->' + this.receiveIndex)
        console.log('本次接收的数据下标->' + dataIndex)

        // 判断数据是否完整
        if (lastReceiveLength <= this.receiveIndex) {
          this.handle()
          this.protocolHeaderIndex = 0
          this.receiveIndex = 0
          this.receive = undefined
        }
      }
      console.log('---------------------------')
    },
    handle: function() {
      var i = 0
      const data = this.receive
      console.log('本次消费的消息长度->' + data.byteLength)
      const sn = data.getBigInt64(i)
      console.log(sn)
      i += 8
      const type = data.getInt8(i)
      console.log(type)
      i += 1
      const hasCommand = (type & 8) > 0
      if (hasCommand) {
        const module = data.getInt16(i)
        i += 2
        const command = data.getInt8(i)
        i += 1
        console.log('收到模块号：' + module + ',命令号：' + command)
        if (data.byteLength > i && command === -1) {
          const bodyLength = data.getInt16(i)
          i += 2
          const body = new Uint8Array(bodyLength)
          for (var j = 0; j < bodyLength; j++) {
            body[j] = data.getUint8(i++)
          }

          const str = String.fromCharCode.apply(null, body)
          const json = JSON.stringify(str)
          console.log(json)
          const data = json.content
          this.chatMsg.concat(data.senderId + ':' + data.content + '\n')
        }
      }
    },
    send: function() {
      const msg = this.msg
      const data = {
        params: {
          msg: msg
        }
      }
      const bytes = this.toUTF8(JSON.stringify(data))
      const bodyLength = bytes.length

      const totalLength = 18 + 2 + bodyLength
      const buffer = new ArrayBuffer(totalLength)
      const dataView = new DataView(buffer)

      dataView.setInt16(0, 8)
      dataView.setInt32(2, totalLength - 6)
      dataView.setBigInt64(6, this.getAndInc())
      dataView.setInt8(14, 24)
      dataView.setInt16(15, 3)
      dataView.setInt8(17, 1)
      dataView.setInt16(18, bodyLength)
      for (var i = 0; i < bodyLength; i++) {
        const j = 20 + i
        dataView.setUint8(j, bytes[i])
      }
      this.socket.send(buffer)
    },
    create: function() {
      const account = this.newAccount
      if (!account) {
        alert('要创建的账号不可为空')
        return
      }
      const timestamp = 1628676236
      const str = account + timestamp + this.key
      const sign = md5(str)
      const data = {
        params: {
          account: account,
          timestamp: timestamp,
          serverId: 10,
          channel: 1,
          sign: sign
        }
      }
      const bytes = this.toUTF8(JSON.stringify(data))
      const bodyLength = bytes.length

      const totalLength = 18 + 2 + bodyLength
      alert(totalLength)
      const buffer = new ArrayBuffer(totalLength)
      const dataView = new DataView(buffer)

      dataView.setInt16(0, 8)
      dataView.setInt32(2, totalLength - 6)
      dataView.setBigInt64(6, this.getAndInc())
      dataView.setInt8(14, 24)
      dataView.setInt16(15, 1)
      dataView.setInt8(17, 1)
      dataView.setInt16(18, bodyLength)
      for (var i = 0; i < bodyLength; i++) {
        const j = 20 + i
        dataView.setUint8(j, bytes[i])
      }
      this.socket.send(buffer)
    },
    login: function() {
      const account = this.oldAccount
      if (!account) {
        alert('要登录的账号不可为空')
        return
      }
      const timestamp = 1628676236
      const sign = md5(account + timestamp + this.key)
      const data = {
        params: {
          account: account,
          timestamp: timestamp,
          serverId: 10,
          channel: 1,
          sign: sign
        }
      }
      const bytes = this.toUTF8(JSON.stringify(data))
      const bodyLength = bytes.length

      const totalLength = 18 + 2 + bodyLength
      const buffer = new ArrayBuffer(totalLength)
      const dataView = new DataView(buffer)

      dataView.setInt16(0, 8)
      dataView.setInt32(2, totalLength - 6)
      dataView.setBigInt64(6, this.getAndInc())
      dataView.setInt8(14, 24)
      dataView.setInt16(15, 1)
      dataView.setInt8(17, 2)
      dataView.setInt16(18, bodyLength)
      for (var i = 0; i < bodyLength; i++) {
        const j = 20 + i
        dataView.setUint8(j, bytes[i])
      }
      this.socket.send(buffer)
    },
    close: function() {
      console.log('socket已经关闭')
    },
    toUTF8: function(str) {
      var result = []
      var k = 0
      for (var i = 0; i < str.length; i++) {
        var j = encodeURI(str[i])
        if (j.length === 1) {
          // 未转换的字符
          result[k++] = j.charCodeAt(0)
        } else {
          // 转换成%XX形式的字符
          var bytes = j.split('%')
          for (var l = 1; l < bytes.length; l++) {
            result[k++] = parseInt('0x' + bytes[l])
          }
        }
      }
      return result
    },
    getAndInc: function() {
      this.sn++
      return this.sn
    }
  }
}
</script>

<style>

</style>
