<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import { useUserStore } from '@/stores/user'
    import { ref } from 'vue'
    import { useAreaIn } from '@/js/mouse'
    import { getInfo, modifyUsername } from '@/network/userApi'
    import { genFileId, ElUpload } from 'element-plus'
    import { BASE_URL } from '@/network/axios-instance'
    import { handleBeforeAvatarUpload } from '@/js/imageUpload'
    import { Edit, Check } from '@element-plus/icons-vue'

    const { avatarUrl, user, token } = storeToRefs(useUserStore())
    const avatarArea = ref<HTMLDivElement | null>(null)
    const inAvatarArea = useAreaIn(avatarArea)
    const editingUsername = ref(false)
    function clickEditUsername() {
        editingUsername.value = !editingUsername.value
    }
    //请求修改用户名会显示请求中
    const requestingUsername = ref(false)
    const updateUsernameSuccess = ref(false)
    let usernameTimer: number
    function submitUsername() {
        clearTimeout(usernameTimer)
        updateUsernameSuccess.value = false
        editingUsername.value = false
        requestingUsername.value = true
        modifyUsername(user.value!.username, {
            onSucceed: () => {
                updateUsernameSuccess.value = true
                usernameTimer = setTimeout(() => {
                    requestingUsername.value = false
                    updateUsernameSuccess.value = false
                }, 1000)
                oldUsername = user.value!.username
            },
            onFailed: () => {
                user.value!.username = oldUsername
            }
        })
    }
    let oldUsername = user.value!.username //响应是失败就把这个赋值回去
    const avatarUpload = ref<InstanceType<typeof ElUpload> | null>(null)
    function handleAvatarUploadSuccess(){
        getInfo()
    }
    function handleAvatarUploadExceed(files: any){
        avatarUpload.value!.clearFiles()
        const file = files[0]
        file.uid = genFileId()
        avatarUpload.value!.handleStart(file)
        avatarUpload.value!.submit()
    }
</script>

<template>
    <div class="user-view">
        <div class="user-view-content">
            <div class="user-header">
                <div class="avatar" ref="avatarArea">
                    <el-avatar :src="avatarUrl" :size="120" :style="{ filter: inAvatarArea ? 'blur(.5px)' : null, transition: 'filter .5s', verticalAlign: 'bottom' }" />
                    <Transition name="fade">
                        <div class="change-avatar" v-show="inAvatarArea"
                            :style="{ backgroundColor: inAvatarArea ? 'rgb(66,66,66,.5)' : '' }">
                            <el-upload ref="avatarUpload" style="display: flex;" :limit="1" name="avatar" :show-file-list="false"
                                :on-success="handleAvatarUploadSuccess"
                                :on-exceed="handleAvatarUploadExceed"
                                :before-upload="handleBeforeAvatarUpload"
                                :action="`${BASE_URL}user/upload/avatar`" method="put"
                                :headers="{ Authorization: `Bearer ${token}` }">
                                <el-button size="small" type="info" round>更改头像</el-button>
                            </el-upload>
                        </div>
                    </Transition>
                </div>
                <div class="username">
                    <template v-if="editingUsername">
                        <el-input v-model="user!.username" maxlength="10" show-word-limit type="text" clearable size="small"
                            :style="{ width: '240px' }" @keyup.enter="submitUsername" @blur="submitUsername"></el-input>
                    </template>
                    <template v-else>
                        {{ user!.username }}
                    </template>
                    <el-icon class="username-edit clickable-icon" title="修改用户名" size="1em" @click="clickEditUsername()">
                        <Edit />
                    </el-icon>
                    <div class="username-state" v-show="requestingUsername">
                        <div v-show="!updateUsernameSuccess" v-loading="requestingUsername" class="loading-icon"></div>
                        <div v-show="updateUsernameSuccess"><el-icon><Check /></el-icon></div>
                        {{ updateUsernameSuccess ? '修改成功' : '更新中...' }}
                    </div>
                </div>
            </div>
            <el-container class="user-main">
                <el-aside width="150px" class="user-aside">
                    <el-menu router default-active="/userCenter">
                        <el-menu-item index="/userCenter">个人信息</el-menu-item>
                        <el-sub-menu index="1">
                            <template #title>
                                <span>历史记录</span>
                            </template>
                            <el-menu-item index="/userCenter/completedOrders">已完成订单</el-menu-item>
                            <el-menu-item index="/userCenter/deliveringOrders">配送中订单</el-menu-item>
                            <!-- <el-menu-item :disabled="!isSeller" index="/userCenter/restaurantHistory">店铺记录</el-menu-item>
                            <el-menu-item :disabled="!isDeliveryMan" index="/userCenter/deliveryHistory">骑手记录</el-menu-item> -->
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <RouterView v-slot="{ Component }">
                        <KeepAlive include="CompletedOrdersView">
                            <component :is="Component"></component>
                        </KeepAlive>
                    </RouterView>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<style>
.user-view {
    width: 100%;
    padding: 0 20%;
}

.user-view-content {
    border-radius: 10px;
    padding: 20px;
    background-color: var(--el-color-primary-light-8);
}

.user-view-content > .user-header {
    display: flex;
    padding-bottom: 30px;
}

.user-header > .username {
    font-size: 18px;
    margin-left: 20px;
    align-self: flex-end;
    display: flex;
    align-items: center;
}

.username > .username-edit {
    margin-left: 7px;
}

.username > .username-state{
    margin-left: 4px;
    background-color: white;
    border-radius: 4px;
    display: flex;
}

.username > .username-state > .loading-icon {
    size: 20px;
}

.user-view-content > .user-header > .avatar {
    position: relative;
    width: max-content;
}

.user-view-content .change-avatar {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
}

.user-main > .user-aside{
    border-radius: 12px;
    user-select: none;
}
</style>