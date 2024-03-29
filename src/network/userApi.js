import instance from "@/network/axios-instance"
import { defaultHandlers } from "@/network/axios-instance"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import router from "@/router"

//未认证在onError里
export function getInfo(handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/user/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setInfo } = useUserStore()
                setInfo(res.data.data) //获取用户信息写入store
                curHandlers.onSucceed(res.data.data)
            }
            else {
                //获取信息失败就去登录页
                router.push({name: 'Login'})
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function login(loginInfo, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.post('/user/login', loginInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setTokens } = useUserStore()
                setTokens(res.data.data.token, res.data.data.refreshToken)
                getInfo({ onSucceed: () => router.push('/') }) //登录成功获取一次用户信息
                handlers.onSucceed()
            }
            else {
                handlers.onFailed(res.data.message)
            }
        }
    }).catch(handlers.onError).finally(handlers.onFinally)
}

export function register(registerInfo, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.post('/user/register', registerInfo).then(res => {
        console.log(res)
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setTokens } = useUserStore()
                setTokens(res.data.data.token, res.data.data.refreshToken)
                getInfo({ onSucceed: () => router.push('/') }) //注册成功登录，获取用户信息
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function modifyUsername(newUsername, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put('/user/update/username', {username: newUsername}).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { username } = storeToRefs(useUserStore())
                username.value = newUsername //修改成功修改store
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getOrders({pageOffset, pageSize}, handlers = {}) {
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/user/orders/${pageOffset}/${pageSize}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}