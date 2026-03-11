// echarts字体大小自适应
export const getFontSize = (size: number): number => {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return 16
  const fontSize = 16 * (clientWidth / 1920)
  return size * fontSize
}

// echarts元素宽度自适应
export const getItemWidth = (width: number): number => {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return width
  return width * (clientWidth / 1920)
}

// echarts地图大小
export const getMapZoom = (scope: number): number => {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return scope
  if (clientWidth < 1300) return scope * 0.8
  else if (clientWidth < 650) return scope * 0.6
  return scope
}
