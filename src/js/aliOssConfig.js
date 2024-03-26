const aliUrlPrefix = 'https://takeoutapp.oss-cn-beijing.aliyuncs.com/'
const defaultUserAvatarFilename = 'default_user_avatar.png'
const defaultRestaurantImgFilename = 'default_restaurant_img.png'
const defaultMenuImgFilename = 'default_menu_img.png'

const getAliUrl = filename => aliUrlPrefix + filename
const getAliUserAvatarUrl = filename => aliUrlPrefix + (filename ? filename : defaultUserAvatarFilename)
const getAliRestaurantImgUrl = filename => aliUrlPrefix + (filename ? filename : defaultRestaurantImgFilename)
const getAliMenuImgUrl = filename => aliUrlPrefix + (filename ? filename : defaultMenuImgFilename)

export {
    aliUrlPrefix,
    defaultUserAvatarFilename,
    defaultRestaurantImgFilename,
    defaultMenuImgFilename,
    getAliUrl,
    getAliUserAvatarUrl,
    getAliRestaurantImgUrl,
    getAliMenuImgUrl
}