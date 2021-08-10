<template>
  <div>
    <button @click="send">发消息</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: 'wss://192.168.11.65:8088',
      socket: ''
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
    close: function() {
      console.log('socket已经关闭')
    }
  }
}
</script>

<style>

</style>
