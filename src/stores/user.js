import { computed, ref } from 'vue'
import { aliUrlPrefix, defaultUserAvatarFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'
import router from '@/router'

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
    return {
        token, refreshToken, username, setUsername, id, phone, addresses, setAddresses, hasAddress, isSeller, setSeller, isDeliveryMan, avatarUrl,
        isLogin, setTokens, setInfo, logout
    }
}, {
    persist: {
        key: 'tokens',
        storage: localStorage,
        paths: ['token', 'refreshToken']
    }
})