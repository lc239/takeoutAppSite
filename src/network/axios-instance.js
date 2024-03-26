import axios from "axios"
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export const defaultHandlers = {
    onSucceed: res => {}, //api的实现不一定是返回一个参数，也不一定返回哪个参数，具体看方法内部的调用
    onFailed: msg => ElMessage.error(msg),
    onError: err => {},
    onFinally: () => {}
}

export const devPrefix = '/api/' //测试使用，打包前换成下面的空白
// export const devPrefix = ''

const instance = axios.create({
    // baseURL: 'http://8.130.174.243:8080/',
    baseURL: devPrefix, //测试时跨域使用
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
        if(error.response.status === 401){
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
                    const router = useRouter()
                    router.push({name: 'Login'})
                })
            }
            else{
                const { logout } = useUserStore()
                logout()
                const router = useRouter()
                router.push({name: 'Login'})
                return Promise.reject(error)
            }
        }
    }
})

export default instance