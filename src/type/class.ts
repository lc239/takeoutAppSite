import type dayjs from "dayjs"

//可以细分一下属性继承减少!的使用

export class User{
    id: number
    username: string
    phone: string
    addresses: Address[]
    isSeller: boolean
    isDeliveryMan: boolean
    avatarFilename: string

    constructor(id: number, username: string, phone: string, addresses: any[], isSeller: boolean, isDeliveryMan: boolean, avatarFilename: string){
        this.id = id
        this.username = username
        this.phone = phone
        this.addresses = addresses
        this.isSeller = isSeller
        this.isDeliveryMan = isDeliveryMan
        this.avatarFilename = avatarFilename
    }
}

export class Address{
    name: string
    phone: string
    address: string

    constructor(name: string, phone: string, address: string){
        this.name = name
        this.phone = phone
        this.address = address
    }
}

export class WebSocketMsg{
    type: number
    time: dayjs.Dayjs
    data: any

    constructor(type: number, time: dayjs.Dayjs, data: any){
        this.type = type
        this.time = time
        this.data = data
    }
}

export class Restaurant{
    id: number
    name: string
    introduction: string
    imageFilename: string
    saleNum: number
    rate: number
    rateCount: number
    categories: Category[]
    deliveryPrice: number

    constructor(id: number,name: string,introduction: string,imageFilename: string,saleNum: number,rate: number,rateCount: number,categories: any[],deliveryPrice: number){
        this.id = id
        this.name = name
        this.introduction = introduction
        this.imageFilename = imageFilename
        this.saleNum = saleNum
        this.rate = rate
        this.rateCount = rateCount
        this.categories = categories
        this.deliveryPrice = deliveryPrice
    }
}

export class RestaurantPreview{
    id: number
    name: string
    saleNum: number
    imageFilename: string
    rate: number
    rateCount: number
    deliveryPrice: number

    constructor(id: number, name: string, saleNum: number, imageFilename: string, rate: number, rateCount: number, deliveryPrice: number){
        this.id = id
        this.name = name
        this.saleNum = saleNum
        this.imageFilename = imageFilename
        this.rate = rate
        this.rateCount = rateCount
        this.deliveryPrice = deliveryPrice
    }
}

export class Category{
    name: string
    menus: Menu[] = []

    constructor(name: string){
        this.name = name
    }
}

export class Menu{
    name: string
    description: string
    price: number
    imageFilename?: string
    categoryIndex?: number //额外添加
    num?: number //额外添加

    constructor(name: string, description: string, price: number){
        this.name = name
        this.price = price
        this.description = description
    }
}

export class OrderedMenu{
    name: string
    num: number
    price: number
    categoryIndex: number

    constructor(name: string, num: number, price: number, categoryIndex: number){
        this.name = name
        this.price = price
        this.num = num
        this.categoryIndex = categoryIndex
    }
}

export class Order{
    orderId?: string
    userId?: number
    restaurantId?: number
    deliveringManId?: number
    commentId?: number
    menus: OrderedMenu[] = []
    packPrice?: number
    deliveryPrice?: number
    price?: number
    address: Address
    createTime?: string
    completeTime?: string
    taken?: boolean

    constructor(packPrice: number, deliveryPrice: number, price: number, address: Address){
        this.packPrice = packPrice
        this.deliveryPrice = deliveryPrice
        this.price = price
        this.address = address
    }
}

export class RestaurantComment{
    id?: number
    userId?: number
    username?: string
    restaurantId?: number
    content: string
    rate: number
    images?: string[]
    createTime?: string | dayjs.Dayjs

    constructor(content: string, rate: number){
        this.content = content
        this.rate = rate
    }
}