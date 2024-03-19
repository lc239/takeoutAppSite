import instance from "@/network/axios-instance"

export function getMenuByRestaurantId(restaurantId, onSucceed = menu => {}, onFailed = msg => {}, onError = err => {}){
    instance.get(`/menu/info/${restaurantId}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                onSucceed(res.data.data)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(err => onError(err))
}