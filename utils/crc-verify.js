export function crcVerify(cmd){
  let crcCode = 0xFFFF;
  const crcPolynomial = 0xA001;
  let input = cmd.split(' ');
  let gLength = input.length;

  if (gLength > 0) {
    for (let i = 0; i < gLength; i++) {
      if (input[i] === undefined || input[i] === "") {
        continue;
      }
      let currentCode = parseInt(input[i], 16);
      if (currentCode === undefined) {
        continue;
      }
      crcCode = crcCode ^ currentCode;

      for (let j = 0; j < 8; j++) {
        if ((crcCode & 0x0001) > 0) {
          crcCode = crcCode >> 1;
          crcCode = crcCode ^ crcPolynomial;
        }
        else {
          crcCode = crcCode >> 1;
        }
      }
    }
  }

  return addZeroInFront(crcCode.toString(16), 4);
}

export function addZeroInFront(value, targetLength){//字符串前添加零补全，并且每两个16进制数间添加空格
  let stringWithZero = "";
  let count = 0;//用于计算stringWithZero中push了几个数字，等于2时加一个空格，然后count清零
  for (let i = targetLength - 1; i > value.length - 1; i--) {//先补零，同时加空格
    stringWithZero += "0";
    count++;
    if(count == 2) {
      stringWithZero += " ";
      count = 0;
    }
  }
  for (let i = 0; i < value.length; i++) {//再把原先的字符串push进stringWithZero中，同时加空格
    stringWithZero += value[i];
    count++;
    if(count == 2 && i != value.length - 1) {
      stringWithZero += " ";
      count = 0;
    }
  } 
  return stringWithZero.toUpperCase();
}

// module.exports = {
//   crcVerify,
//   addZeroInFront
// }
