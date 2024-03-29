import { computed, ref } from 'vue'
import { aliUrlPrefix, defaultUserAvatarFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'
import router from '@/router'
import dayjs from 'dayjs'

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
        router.push({name: 'Login'})//登出时前往登录页
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
            msgs.value.push(msg)
        })
        ws.value.addEventListener('error', e => {
            console.log(e)
        })
        ws.value.addEventListener('close', e => {
            console.log(e)
        })
    }
    //0是用户下单时发，1是店铺接单时发
    function sendWs(type, targetId){
        const request = JSON.stringify({
            type,
            targetId
        })
        ws.value.send(request)
    }
    const msgs = ref([])
    const msgDrawer = ref(false)
    const showMsgDrawer = () => {msgDrawer.value = true;console.log(msgs.value)}
    function checkMsgs(){
        msgs.value = msgs.value.filter(msg => {
            if(msg.type === 0) return msg.time.diff(dayjs(), 'm', true) < 10 //订单要求10分钟内接
            else return true
        })
    }
    function removeMsg(index){
        msgs.value.splice(index, 1)
    }

    return {
        token, refreshToken, username, setUsername, id, phone, addresses, addAddress, setAddresses, hasAddress, isSeller, setSeller, isDeliveryMan, avatarUrl,
        isLogin, setTokens, setInfo, logout, ws, openWs, sendWs, msgs, msgDrawer, checkMsgs, removeMsg, showMsgDrawer
    }
}, {
    persist: {
        key: 'tokens',
        storage: localStorage,
        paths: ['token', 'refreshToken']
    }
})