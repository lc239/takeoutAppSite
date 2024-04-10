import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {

    const deliveringOrders = ref([])
    const setOrders = newOrders => deliveringOrders.value = newOrders
    const completeOrder = orderId => deliveringOrders.value.splice(deliveringOrders.value.findIndex(e => e.orderId === orderId), 1)
    const setTaken = orderId => deliveringOrders.value.find(e => e.orderId === orderId).taken = true
    
    return{
        deliveringOrders, setOrders, setTaken, completeOrder
    }
})