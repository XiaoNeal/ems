import system from "../service/config/system";

function URL(url) {
    return system.SPRINGBOOT_URL + url
}

//接口的数据格式规范，是多一个data的，注意数据规范
function DATA(toData) {
    return { data: toData }
}

function FORMDATA(toData) {
    // let formdata = JSON.stringify({
    //     areaInfoId: toData.areaInfoId,
    //     barCode: toData.barCode,
    //     address: toData.address,
    //     types: toData.types,
    // })
    let formdata = new FormData();
    for (const key in toData) {
        formdata.append(key, toData[key])
    }
    // console.log(formdata,'formdata')
    return formdata
}

export { URL, DATA, FORMDATA }