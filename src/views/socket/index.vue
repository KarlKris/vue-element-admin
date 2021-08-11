<template>
  <div>
    <button @click="send">发消息</button>
    <button @click="create">创建账号</button>
    <button @click="login">登录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: 'ws://192.168.11.65:8088',
      socket: '',
      sn: 0n
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
      const data = new DataView(new Int8Array(msg.data).buffer)
      const protocolHeader = data.getInt16()
      console.log(protocolHeader)
      const length = data.getInt32(2)
      console.log(length)
      const sn = data.getBigInt64(6)
      console.log(sn)
      const type = data.getInt8(14)
      console.log(type)
    },
    send: function() {
      const buffer = new ArrayBuffer(15)
      const dataView = new DataView(buffer)
      dataView.setInt16(0, 8)
      dataView.setInt32(2, 9)
      dataView.setBigInt64(6, 0n)
      dataView.setInt8(14, 0)
      this.socket.send(buffer)
    },
    create: function() {
      const data = {
        account: 'yuanwen',
        timestamp: 1628676236,
        serverId: 10,
        channel: 1,
        sign: '10deeef2435cf9365b15e61ceea433c2'
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
      dataView.setInt8(17, 1)
      dataView.setInt16(18, bodyLength)
      for (var i = 0; i < bodyLength; i++) {
        const j = 20 + i
        dataView.setUint8(j, bytes[i])
      }
      this.socket.send(buffer)
    },
    login: function() {
      const data = {
        account: 'yuanwen',
        timestamp: 1628676236,
        serverId: 10,
        channel: 1,
        sign: '10deeef2435cf9365b15e61ceea433c2'
      }
      const bytes = this.toUTF8(JSON.stringify(data))
      const bodyLength = bytes.length

      console.log(bytes)

      const totalLength = 18 + 2 + bodyLength
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
