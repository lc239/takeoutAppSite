import { computed, ref } from 'vue'
import { aliUrlPrefix, defaultUserAvatarFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'
import router from '@/router'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'
import { useHistoryStore } from './history'

export const useUserStore = defineStore('user', () => {

    const token = ref(null)
    const refreshToken = ref(null)
    const username = ref(null)
    const setUsername = newUsername => username.value = newUsername
    const id = ref(null)
    const phone = ref(null)
    const addresses = ref(null)
    function setAddresses(newAddresses){
        addresses.value = newAddresses.slice()
    }
    function addAddress(address){
        addresses.value?.push(address)
    }
    const hasAddress = computed(() => addresses.value?.length > 0)
    const isSeller = ref(false)
    const setSeller = aBoolean => isSeller.value = aBoolean
    const isDeliveryMan = ref(false)
    const setDeliveryMan = aBoolean => isDeliveryMan.value = aBoolean
    const avatarFilename = ref(null)

    const avatarUrl = computed(() => aliUrlPrefix.concat(avatarFilename.value ? avatarFilename.value : defaultUserAvatarFilename))
    const isLogin = computed(() => token.value ? true : false)
    
    function setInfo(info){
        username.value = info.username
        id.value = info.id
        phone.value = info.phone
        addresses.value = info.addresses
        isSeller.value = info.isSeller
        isDeliveryMan.value = info.isDeliveryMan
        avatarFilename.value = info.avatarFilename
    }
    function setTokens(newToken, newRefreshToken){
        token.value = newToken
        refreshToken.value = newRefreshToken
    }
    function logout(){
        token.value = null
        refreshToken.value = null
        username.value = null
        id.value = null
        phone.value = null
        addresses.value = null
        isSeller.value = null
        isDeliveryMan.value = null
        avatarFilename.value = null
        router.push({name: 'Login'}) //登出时前往登录页
        if(ws.value) ws.value.close() //关闭websocket
    }

    const heartCheck = {
        timeout: 50000,        // 50秒心跳，nginx是60秒
        serverTimeoutObj: null,
        reset: function(){
            clearInterval(this.serverTimeoutObj)
            return this
        },
        start: function(){
            this.serverTimeoutObj = setInterval(function(){
                if(ws.value.readyState == 1){
                    console.log("心跳")
                    ws.value.send(JSON.stringify("ping"))
                }else{
                    console.log("断开状态，尝试重连")
                    openWs()
                }
            }, this.timeout)
        }
    }
    //待改为SSE
    const ws = ref(null)
    function openWs(){
        ws.value = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}?id=${id.value}`)
        ws.value.addEventListener('open', e => {
            console.log('成功')
            heartCheck.reset().start()
            window.onbeforeunload = () => {
                ws.value.close()
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

    const msgs = ref([])
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
    const removeMsg = msg => msgs.value.splice(msgs.value.indexOf(msg), 1)
    const checkingMsgIndex = ref(0)
    const removeCheckingMsg = () => msgs.value.splice(checkingMsgIndex, 1)
    function pushMsgs(...newMsgs){
        msgs.value.push(...newMsgs)
    }

    const orderDialogVisible = ref(false)
    const showOrderDialog = orderId => {
        checkingOrderId.value = orderId
        orderDialogVisible.value = true
    }
    const closeOrderDialog = () => orderDialogVisible.value = false
    const checkingOrderId = ref('')

    const commentingOrder = ref(null)
    const commentDialogVisible = ref(false)
    const showCommentDialog = order => {
        commentingOrder.value = order
        commentDialogVisible.value = true
    }
    const closeCommentDialog = () => commentDialogVisible.value = false

    return {
        token, refreshToken, username, setUsername, id, phone, addresses, addAddress, setAddresses, hasAddress, isSeller, setSeller, isDeliveryMan, setDeliveryMan, avatarUrl,
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