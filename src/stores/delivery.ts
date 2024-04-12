import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Order } from '@/type/class'

export const useDeliveryStore = defineStore('delivery', () => {

    const deliveringOrders: Ref<Order[]> = ref([])
    const setDeliveringOrders = (orders: Order[]) => deliveringOrders.value = orders
    const pushOrder = (order: Order) => deliveringOrders.value.push(order)
    const deliveringCount = computed(() => deliveringOrders.value.length)
    const completeCount = ref(0)
    function completeOrder(orderId: string){
        completeCount.value++
        deliveringOrders.value.splice(deliveringOrders.value.findIndex(e => e.orderId === orderId), 1)
    }
    function setStore(response: any){
        completeCount.value = response.completeCount
    }
    
    return{
        deliveringOrders, setDeliveringOrders, pushOrder, deliveringCount, completeCount, completeOrder, setStore
    }
})