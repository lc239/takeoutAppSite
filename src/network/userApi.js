import instance from "@/network/axios-instance"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import router from "@/router"

//未认证在onError里
export function getInfo(onFailed = msg => {}, onError = err => {}){
    const { setInfo } = useUserStore()
    instance.get('/user/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                setInfo(res.data.data) //获取用户信息写入store
            }
            else {
                //获取信息失败就去登录页
                router.push({name: 'Login'})
                onFailed(res.data.message)
            }
        }
    }).catch(err => {
        onError(err)
    })
}

export function login(loginInfo, onSucceed = () => {}, onFailed = msg => {}, onError = err => {}){
    const { setTokens } = useUserStore()
    instance.post('/user/login', loginInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                setTokens(res.data.data.token, res.data.data.refreshToken)
                getInfo() //登录成功获取一次用户信息
                onSucceed()
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(err => {
        onError(err)
    })
}

export function register(registerInfo, onSucceed = () => {}, onFailed = msg => {}, onError = err => {}){
    instance.post('/user/register', registerInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                setTokens(res.data.data.token, res.data.data.refreshToken)
                getInfo() //注册成功算作登录，获取用户信息
                onSucceed()
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(err => {
        onError(err)
    })
}

export function modifyUsername(newUsername, onSucceed = () => {}, onFailed = msg => {}, onError = err => {}){
    instance.put('/user/update/username', {username: newUsername}).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { username } = storeToRefs(useUserStore())
                username.value = newUsername //修改成功修改store
                onSucceed()
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(err => {
        onError(err)
    })
}

export function getOrders({pageOffset, pageSize}, onSucceed = orders => {}, onFailed = msg => {}, onError = err => {}) {
    instance.get(`/user/orders/${pageOffset}/${pageSize}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                onSucceed(res.data.data)
            }else{
                onFailed(res.data.message)
            }
        }
    }).catch(err => {
        onError(err)
    })
}