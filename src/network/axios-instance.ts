import axios from "axios"
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ElMessage } from "element-plus"
import router from "@/router"

export interface MyApiHandler<T>{
    onSucceed?: (res: T) => void
    onFailed?: (msg: string) => void
    onError?: (err: any) => void
    onFinally?: () => void
}

export class MyApiHandlers<T> implements MyApiHandler<T>{
    onSucceed = (res?: T) => {}
    onFailed: (msg: string) => void = msg => ElMessage.error(msg)
    onError: (err: any) => void = err => {
        console.log(err)
        ElMessage.error('请检查网络或重新登录')
    }
    onFinally: () => void = () => {}
}

export const defaultHandlers: MyApiHandlers<any> = {
    onSucceed: () => {},
    onFailed: msg => ElMessage.error(msg),
    onError: err => {
        console.log(err)
        ElMessage.error('请检查网络或重新登录')
    },
    onFinally: () => {}
}

export const BASE_URL = import.meta.env.VITE_BASE_URL

const instance = axios.create({
    baseURL: BASE_URL, 
    timeout: 5000
})

instance.interceptors.request.use(config => {
    const { token } = storeToRefs(useUserStore())
    if(token.value){
        config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
})
instance.interceptors.response.use(response => {
    return response
}, error => {
    if(error.response){
        //token失效
        if(error.config.url === '/user/refresh') return Promise.reject(error)
        else if(error.response.status === 401){
            const { refreshToken } = storeToRefs(useUserStore())
            if(refreshToken.value){
                return instance.get('/user/refresh', {headers:{
                    Authorization: `Bearer ${refreshToken.value}`
                }}).then(res => {
                    if(res.status === 200){
                        const { setTokens } = useUserStore()
                        setTokens(res.data.data.token, res.data.data.refreshToken)
                        const config = error.config
                        const { token } = storeToRefs(useUserStore())
                        config.headers.Authorization = `Bearer ${token.value}`//使用新token再次请求
                        return instance.request(config)
                    }
                }).catch(err => {
                    const { logout } = useUserStore()
                    logout()
                    router.push({name: 'Login'})
                })
            }
            else{
                const { logout } = useUserStore()
                logout()
                router.push({name: 'Login'})
                return Promise.reject(error)
            }
        }
    }
})

export default instance