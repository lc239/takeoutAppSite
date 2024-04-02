import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia'
import { useShoppingStore } from '@/stores/shopping'
import { getRestaurantById } from '@/network/restaurantApi'

const LoginView = () => import('@/views/LoginView.vue')
const HomeView = () => import('@/views/HomeView.vue')

const UserView = () => import('@/views/userView/UserView.vue')
const UserInformationView = () => import('@/views/userView/UserInformationView.vue')
const UserHistoryView = () => import('@/views/userView/UserHistoryView.vue')

const RestaurantHistoryView = () => import('@/views/userView/RestaurantHistoryView.vue')
const RestaurantManageView = () => import('@/views/restaurantManageView/RestaurantManageView.vue')
const RestaurantInformationView = () => import('@/views/restaurantManageView/RestaurantInformationView.vue')
const MenuManagementView = () => import('@/views/restaurantManageView/MenuManagementView.vue')
const OrderManageView = () => import('@/views/restaurantManageView/OrderManageView.vue')

const RestaurantView = () => import('@/views/restaurant/RestaurantView.vue')
const CategoryView = () => import('@/views/restaurant/CategoryView.vue')
const CommentView = () => import('@/views/restaurant/CommentView.vue')

const DeliveryManageView = () => import('@/views/delivery/DeliveryManageView.vue')
const DeliveryInformationView = () => import('@/views/delivery/DeliveryInformationView.vue')
const DeliveryHistoryView = () => import('@/views/delivery/DeliveryHistoryView.vue')
const TakeOrderView = () => import('@/views/delivery/TakeOrderView.vue')

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
        }
      ]
    },
    {
      path: '/restaurantCenter',
      name: 'RestaurantCenter',
      component: RestaurantManageView,
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
        },
        {
          path: 'orderManagement',
          name: 'OrderManagement',
          component: OrderManageView
        }
      ]
    },
    {
      path: '/deliveryCenter',
      name: 'DeliveryCenter',
      component: DeliveryManageView,
      children: [
        {
          path: '',
          name: 'DeliveryInformation',
          component: DeliveryInformationView
        },
        {
          path: 'order',
          name: 'DeliveryTakeOrder',
          component: TakeOrderView
        },
        {
          path: 'history',
          name: 'DeliveryHistory',
          component: DeliveryHistoryView
        }
      ]
    },
    {
      path: '/restaurant/:id',
      name: 'Restaurant',
      component: RestaurantView,
      children: [
        {
          path: '',
          name: 'RestaurantWithCategory',
          component: CategoryView
        },
        {
          path: 'comment',
          name: 'RestaurantComment',
          component: CommentView
        }
      ],
      beforeEnter: (to, from) => {
        const { setRestaurant } = useShoppingStore()
        getRestaurantById(to.params.id, {
          onSucceed: res => setRestaurant(res)
        })
      }
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