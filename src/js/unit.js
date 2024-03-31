import dayjs from 'dayjs'

//0 -> 0.00 45 -> 0.45 100 -> 1.00
export function fenToYuan(fen){
    return (fen / 100).toFixed(2)
}

//1.01 -> 101 0.01 -> 1
export function yuanToFen(yuan){
    return (yuan * 100).toFixed(0)
}

//2024-03-08T11:10:27Z -> 2024/03/08/11:10:27
export function instantToFormat(instant, format = 'YYYY/MM/DD/HH:mm:ss'){
    if(!instant) return '无'
    return dayjs(instant).format(format)
}

export function dayjsToFormat1(date){
    return date.format('HH:mm:ss')
}

//13.2, 4, 1 -> 3.3
export function averageToFixed(numerator, denominator, fraction = 0){
    if(denominator === 0) return 0
    return Number((numerator / denominator).toFixed(fraction))
}