import dayjs from 'dayjs'

//0 -> 0.00 45 -> 0.45 100 -> 1.00
export function fenToYuan(fen: number){
    return (fen / 100).toFixed(2)
}

//1.01 -> 101 0.01 -> 1
export function yuanToFen(yuan: number){
    return parseInt((yuan * 100).toFixed(0))
}

//2024-03-08T11:10:27Z -> 2024/03/08/11:10:27
export function instantToFormat(instant: string | dayjs.Dayjs, format = 'YYYY/MM/DD/HH:mm:ss'){
    if(!instant) return '无'
    return dayjs(instant).format(format)
}

export function dayjsToFormat1(date: dayjs.Dayjs){
    return date.format('HH:mm:ss')
}

//29 -> 00:29 61 -> 01:01
export function secondsToFormat1(seconds: number){
    if(!(typeof seconds === 'number') || seconds <= 0) return '00:00'
    if(seconds >= 3600) return '59:59'
    const s = seconds % 60
    const m = Math.floor(seconds / 60)
    const a = []
    if(m < 10) a.push(0)
    a.push(m)
    a.push(':')
    if(s < 10) a.push(0)
    a.push(s)
    return a.join('')
}

//13.2, 4, 1 -> 3.3
export function averageToFixed(numerator: number, denominator: number, fraction = 0){
    if(denominator === 0) return 0
    return Number((numerator / denominator).toFixed(fraction))
}