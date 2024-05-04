import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { Order } from '@/type/class'

export const useDeliveryStore = defineStore('delivery', () => {

    const deliveringOrders = ref<Order[]>([])
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

    const order = ref<Order | null>(null)
    function showOrderDialog(showOrder: Order){
        order.value = showOrder
        orderDialogVisible.value = true
    }
    function closeOrderDialog(){
        order.value = null
        orderDialogVisible.value = false
    }
    const orderDialogVisible = ref(false)
    
    return{
        deliveringOrders, setDeliveringOrders, pushOrder, deliveringCount, completeCount, completeOrder, setStore,
        order, showOrderDialog, closeOrderDialog, orderDialogVisible
    }
})