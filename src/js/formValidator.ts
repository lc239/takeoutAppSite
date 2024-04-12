export function isPhoneNumber(rule: any, phone: string, callback: Function){
    const reg = /^1(3|4|7|5|8)([0-9]{9})/
    if(reg.test(phone)) return
    callback(new Error('请输入正确的手机号'))
}

export function notSpace(rule: any, str: string, callback: Function){
    if(!str?.trim()?.length) callback(new Error('该字段不能为空'))
}