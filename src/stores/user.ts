import { type Ref, computed, ref } from 'vue'
import { aliUrlPrefix, defaultUserAvatarFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'
import router from '@/router'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'
import { useHistoryStore } from './history'
import type { User, Address, Order, WebSocketMsg } from '@/type/class'

export const useUserStore = defineStore('user', () => {

    const user: Ref<User | null> = ref(null)

    const token: Ref<string | null> = ref(null)
    const refreshToken: Ref<string | null> = ref(null)
    const setUsername = (newUsername: string) => user.value!.username = newUsername
    function setAddresses(newAddresses: Address[]){
        user.value!.addresses = newAddresses.slice()
    }
    function addAddress(address: Address){
        user.value!.addresses.push(address)
    }
    function deleteAddress(index: number){
        user.value!.addresses.splice(index, 1)
    }
    const hasAddress = computed(() => user.value?.addresses?.length as number > 0)
    const setSeller = (aBoolean: boolean) => user.value!.isSeller = aBoolean
    const setDeliveryMan = (aBoolean: boolean) => user.value!.isDeliveryMan = aBoolean

    const avatarUrl = computed(() => aliUrlPrefix.concat(user.value?.avatarFilename || defaultUserAvatarFilename))
    const isLogin = computed(() => token.value ? true : false)
    
    function setInfo(info: User){
        user.value = info
    }
    function setTokens(newToken: string, newRefreshToken: string){
        token.value = newToken
        refreshToken.value = newRefreshToken
    }
    function logout(){
        token.value = null
        refreshToken.value = null
        user.value = null
        router.push({name: 'Login'}) //登出时前往登录页
        if(ws.value) ws.value.close() //关闭websocket
    }

    const heartCheck: {
        timeout: number
        serverTimeoutObj?: number
        reset: () => any
        start: () => void
    } = {
        timeout: 50000,        // 50秒心跳，nginx是60秒
        serverTimeoutObj: undefined,
        reset: function(){
            clearInterval(this.serverTimeoutObj)
            return this
        },
        start: function(){
            this.serverTimeoutObj = setInterval(function(){
                if(ws.value!.readyState == 1){
                    console.log("心跳")
                    ws.value!.send(JSON.stringify("ping"))
                }else{
                    console.log("断开状态，尝试重连")
                    openWs()
                }
            }, this.timeout)
        }
    }
    //待改为SSE
    const ws: Ref<WebSocket | null> = ref(null)
    function openWs(){
        if(user.value === null) return
        ws.value = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}?id=${user.value.id}`)
        ws.value.addEventListener('open', e => {
            console.log('成功')
            heartCheck.reset().start()
            window.onbeforeunload = () => {
                ws.value?.close()
            }
        })
        ws.value.addEventListener('message', e => {
            heartCheck.reset().start() //重启心跳计时
            console.log(e)
            if(e.data === "\"ping\"") return
            const msg = JSON.parse(e.data)
            msg.time = dayjs(msg.time)
            switch (msg.type) {
                case 0:
                    ElNotification({
                        title: '您有新订单'
                    })
                    newMsgNum.value++
                    pushMsgs(msg) //根据类型展示之前先只展示这些消息；考虑换成unshift
                    break
                case 1:
                    ElNotification({
                        title: '商家已接单',
                        duration: 0
                    })
                    const { setTaken } = useHistoryStore()
                    setTaken(msg.data)
                    break
                case 2:
                    ElNotification({
                        title: '您的订单被拒绝了',
                        duration: 0
                    })
                    break
                case 4:
                    ElNotification({
                        title: '您的订单已送达',
                        duration: 0
                    })
                    const { completeOrder } = useHistoryStore()
                    completeOrder(msg.data)
                    break
                default:
                    break
            }
        })
        ws.value.addEventListener('error', e => {
            console.log(e)
        })
        ws.value.addEventListener('close', e => {
            console.log(e)
        })
    }

    const msgs: Ref<WebSocketMsg[]> = ref([])
    const orderMsgs = computed(() => msgs.value.filter(msg => msg.type === 0))
    const newMsgNum = ref(0)
    const resetNewMsg = () => newMsgNum.value = 0
    const msgDrawer = ref(false)
    const showMsgDrawer = () => msgDrawer.value = true
    function checkMsgs(){
        msgs.value = msgs.value.filter(msg => {
            if(msg.type === 0) return dayjs().diff(msg.time, 'm', true) < 10 //订单要求10分钟内接
            else return true
        })
    }
    const removeMsg = (msg: WebSocketMsg) => msgs.value.splice(msgs.value.indexOf(msg), 1)
    const checkingMsgIndex = ref(0)
    const removeCheckingMsg = () => msgs.value.splice(checkingMsgIndex.value, 1)
    function pushMsgs(...newMsgs: WebSocketMsg[]){
        msgs.value.push(...newMsgs)
    }

    const orderDialogVisible = ref(false)
    const showOrderDialog = (orderId: string) => {
        checkingOrderId.value = orderId
        orderDialogVisible.value = true
    }
    const closeOrderDialog = () => orderDialogVisible.value = false
    const checkingOrderId = ref('')

    const commentingOrder: Ref<Order | null> = ref(null)
    const commentDialogVisible = ref(false)
    const showCommentDialog = (order: Order) => {
        commentingOrder.value = order
        commentDialogVisible.value = true
    }
    const closeCommentDialog = () => commentDialogVisible.value = false

    return {
        user, token, refreshToken, setUsername, addAddress, setAddresses, hasAddress, deleteAddress, setSeller, setDeliveryMan, avatarUrl,
        isLogin, setTokens, setInfo, logout, ws, openWs, msgs, newMsgNum, resetNewMsg, msgDrawer, checkMsgs, removeMsg, showMsgDrawer, orderMsgs, pushMsgs,
        orderDialogVisible, showOrderDialog, closeOrderDialog, checkingMsgIndex, removeCheckingMsg, checkingOrderId,
        commentingOrder, commentDialogVisible, showCommentDialog, closeCommentDialog
    }
}, {
    persist: {
        key: 'tokens',
        storage: localStorage,
        paths: ['token', 'refreshToken']
    }
})