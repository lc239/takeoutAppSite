import dayjs from 'dayjs'

//0 -> 0.00 45 -> 0.45 100 -> 1.00
export function fenToYuan(fen){
    const t = Array.from(fen.toString())
    while(t.length < 3){
        t.unshift(0)
    }
    return t.toSpliced(-2, 0, '.').join('')
}

//1.01 -> 101 0.01 -> 1
export function yuanToFen(yuan){
    return (Number(yuan) * 100).toString()
}

//2024-03-08T11:10:27Z -> 2024/03/08/11:10:27
export function instantToFormat(instant, format = 'YYYY/MM/DD/HH:mm:ss'){
    return dayjs(instant).format(format)
}