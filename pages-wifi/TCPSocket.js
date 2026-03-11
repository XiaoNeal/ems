class socket {
  constructor() {
    this.connection = {};
  }
  // 创建一个TCP实例
  establish(monitor) {
    this.connection = wx.createTCPSocket();
    this.connection.connect({ address: "000.000.0.0", port: 6800 });
  }
  // 发送消息
  connect(message) {
    this.connection.onConnect(() => {
      this.connection.write(message);
    });
  }
  // 监听端口函数
  onMessage(success, failure) {
    this.connection.onMessage((res) => {
      success(res)
    });
    this.connection.onError((err) => {
      failure(err);
    });
  }
 
  // 关闭搜索事件
  TCPclose() {
    setTimeout(() => {
      // 3S后，关闭socket
      this.connection.close(() => {
        console.log("TCP关闭");
      });
    }, 3000);
  }
}
const TCPSocket = new socket();
export default TCPSocket;