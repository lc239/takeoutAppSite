import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useDeliveryStore = defineStore('delivery', () => {

    const deliveringOrders = ref([])
    const setDeliveringOrders = orders => deliveringOrders.value = orders
    const pushOrder = order => deliveringOrders.value.push(order)
    const deliveringCount = computed(() => deliveringOrders.value.length)
    const completeCount = ref(0)
    function completeOrder(orderId){
        completeCount.value++
        deliveringOrders.value.splice(deliveringOrders.value.findIndex(e => e.id === orderId), 1)
    }
    function setStore(response){
        completeCount.value = response.completeCount
    }
    
    return{
        deliveringOrders, setDeliveringOrders, pushOrder, deliveringCount, completeCount, completeOrder, setStore
    }
})