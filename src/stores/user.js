import { computed, ref } from 'vue'
import { aliUrlPrefix, defaultUserAvatarFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'
import router from '@/router'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'

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
    const ws = ref(null)
    function openWs(){
        ws.value = new WebSocket(`ws://localhost:8080/wsp?id=${id.value}`)
        ws.value.addEventListener('open', e => {
            console.log('成功')
            window.onbeforeunload = () => {
                ws.value.close()
            }
        })
        ws.value.addEventListener('message', e => {
            console.log(e)
            const msg = JSON.parse(e.data)
            msg.time = dayjs(msg.time)
            switch (msg.type) {
                case 0:
                    ElNotification({
                        title: '您有新订单'
                    })
                    newMsgNum.value++
                    msgs.value.push(msg) //根据类型展示之前先只展示这些消息；考虑换成unshift
                    break
                case 1:
                    ElNotification({
                        title: '商家已接单',
                        duration: 0
                    })
                    break
                case 2:
                    ElNotification({
                        title: '您的订单被拒绝了',
                        duration: 0
                    })
                    break
            
                default:
                    break;
            }
        })
        ws.value.addEventListener('error', e => {
            console.log(e)
        })
        ws.value.addEventListener('close', e => {
            console.log(e)
        })
    }
    // function sendWs(type, targetId){
    //     const request = JSON.stringify({
    //         type,
    //         targetId
    //     })
    //     ws.value.send(request)
    // }
    const msgs = ref([])
    const newMsgNum = ref(0)
    const resetNewMsg = () => newMsgNum.value = 0
    const msgDrawer = ref(false)
    const showMsgDrawer = () => {msgDrawer.value = true;console.log(msgs.value)}
    function checkMsgs(){
        msgs.value = msgs.value.filter(msg => {
            if(msg.type === 0) return msg.time.diff(dayjs(), 'm', true) < 10 //订单要求10分钟内接
            else return true
        })
    }
    const removeMsgAt = index => msgs.value.splice(index, 1)
    const removeCheckingMsg = () => removeMsgAt(checkingMsgIndex.value)
    const checkingMsgIndex = ref(0)

    const orderDialogVisible = ref(false)
    const showOrderDialog = () => orderDialogVisible.value = true
    const closeOrderDialog = () => orderDialogVisible.value = false
    const checkingOrderId = ref('')
    
    const setCheckingMsgIndex = i => checkingMsgIndex.value = i
    const setOrderId = id => checkingOrderId.value = id

    return {
        token, refreshToken, username, setUsername, id, phone, addresses, addAddress, setAddresses, hasAddress, isSeller, setSeller, isDeliveryMan, setDeliveryMan, avatarUrl,
        isLogin, setTokens, setInfo, logout, ws, openWs, msgs, newMsgNum, resetNewMsg, msgDrawer, checkMsgs, removeMsgAt, showMsgDrawer, removeCheckingMsg,
        checkingOrderId, setOrderId, orderDialogVisible, showOrderDialog, closeOrderDialog, checkingMsgIndex, setCheckingMsgIndex
    }
}, {
    persist: {
        key: 'tokens',
        storage: localStorage,
        paths: ['token', 'refreshToken']
    }
})