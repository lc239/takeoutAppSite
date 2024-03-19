export function isPhoneNumber(rule, phone, callback){
    const reg = /^1(3|4|7|5|8)([0-9]{9})/
    if(reg.test(phone)) return
    callback(new Error('请输入正确的手机号'))
}

export function notSpace(rule, str, callback){
    if(str.trim().length === 0) callback(new Error('该字段不能为空'))
}