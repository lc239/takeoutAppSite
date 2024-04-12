import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Order } from '@/type/class'

export const useHistoryStore = defineStore('history', () => {

    const deliveringOrders: Ref<Order[]> = ref([])
    const setOrders = (newOrders: Order[]) => deliveringOrders.value = newOrders
    const completeOrder = (orderId: string) => deliveringOrders.value.splice(deliveringOrders.value.findIndex(e => e.orderId === orderId), 1)
    //只有在历史界面待着有效，否则订单还没刷新，没有该订单
    const setTaken = (orderId: string) => {
        const order = deliveringOrders.value.find(e => e.orderId === orderId)
        if(order) order.taken = true
    }
    
    return{
        deliveringOrders, setOrders, setTaken, completeOrder
    }
})