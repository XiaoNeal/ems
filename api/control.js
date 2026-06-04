import request from '@/utils/request.js'

// 发送0x3401命令帧
export const sendCommandFrame = (data) => {
  return request.post('/api/homeCommunity/quickControl/commandFrame', data)
}
