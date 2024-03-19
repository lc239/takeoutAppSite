import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia'

const LoginView = () => import('@/views/LoginView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const UserView = () => import('@/views/userView/UserView.vue')
const UserInformationView = () => import('@/views/userView/UserInformationView.vue')
const UserHistoryView = () => import('@/views/userView/UserHistoryView.vue')
const RestaurantHistoryView = () => import('@/views/userView/RestaurantHistoryView.vue')
const DeliveryHistoryView = () => import('@/views/userView/DeliveryHistoryView.vue')
const RestaurantView = () => import('@/views/restaurantView/RestaurantView.vue')
const RestaurantInformationView = () => import('@/views/restaurantView/RestaurantInformationView.vue')
const MenuManagementView = () => import('@/views/restaurantView/MenuManagementView.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/userCenter',
      name: 'UserCenter',
      component: UserView,
      children: [
        {
          path: '',
          name: 'UserInformation',
          component: UserInformationView
        },
        {
          path: 'userHistory',
          name: 'UserHistory',
          component: UserHistoryView
        },
        {
          path: 'restaurantHistory',
          name: 'RestaurantHistory',
          component: RestaurantHistoryView
        },
        {
          path: 'deliveryHistory',
          name: 'DeliveryHistory',
          component: DeliveryHistoryView
        }
      ]
    },
    {
      path: '/restaurantCenter',
      name: 'RestaurantCenter',
      component: RestaurantView,
      children: [
        {
          path: '',
          name: 'RestaurantInformation',
          component: RestaurantInformationView
        },
        {
          path: 'menuManagement',
          name: 'MenuManagement',
          component: MenuManagementView
        }
      ]
    }
  ]
})

//未登录强制前往登录页面
router.beforeEach((to, from) => {
  const { isLogin } = storeToRefs(useUserStore())
  if(to.name === 'Login') return true
  if(!isLogin.value) return {name: 'Login'}
})

export default router