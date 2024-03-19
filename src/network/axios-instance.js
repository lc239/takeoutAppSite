import axios from "axios"
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const instance = axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: '/api', //测试时跨域使用
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
                    //还是未认证就退出登录去登录页面
                    const { logout } = useUserStore()
                    logout()
                    const router = useRouter()
                    router.push({name: 'login'})
                })
            }
            else{
                return Promise.reject(error)
            }
        }
    }
})

export default instance