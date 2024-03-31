import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useDeliveryStore = defineStore('delivery', () => {

    const deliveringOrders = ref([])
    const pushOrder = order => deliveringOrders.value.push(order)
    const deliveringCount = computed(() => deliveringOrders.value.length)
    const completeCount = ref(0)
    function setStore(response){
        deliveringOrders.value = response.deliveringOrders
        completeCount.value = response.completeCount
    }
    
    return{
        deliveringOrders, pushOrder, deliveringCount, completeCount, setStore
    }
})