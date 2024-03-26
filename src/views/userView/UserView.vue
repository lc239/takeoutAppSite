<script setup>
    import { storeToRefs } from 'pinia'
    import { useUserStore } from '@/stores/user'
    import { ref } from 'vue'
    import { useAreaIn } from '@/js/mouse'
    import { getInfo, modifyUsername } from '@/network/userApi'
    import { genFileId, ElMessage } from 'element-plus'
    import { devPrefix } from '@/network/axios-instance'
    const { avatarUrl, username, isSeller, isDeliveryMan, token } = storeToRefs(useUserStore())
    const avatarArea = ref(null)
    const inAvatarArea = useAreaIn(avatarArea)
    const editingUsername = ref(false)
    function clickEditUsername() {
        editingUsername.value = !editingUsername.value
    }
    //请求修改用户名会显示请求中
    const requestingUsername = ref(false)
    const updateUsernameSuccess = ref(false)
    let usernameTimer
    function submitUsername() {
        clearTimeout(usernameTimer)
        updateUsernameSuccess.value = false
        editingUsername.value = false
        requestingUsername.value = true
        modifyUsername(username.value, {
            onSucceed: res => {
                updateUsernameSuccess.value = true
                usernameTimer = setTimeout(() => {
                    requestingUsername.value = false
                    updateUsernameSuccess.value = false
                }, 500)
                oldUsername = username.value
            },
            onFailed: msg => {
                username.value = oldUsername
            }
        })
    }
    let oldUsername = username.value //响应是失败就把这个赋值回去
    const avatarUpload = ref(null)
    function handleAvatarUploadSuccess(){
        getInfo()
    }
    function handleAvatarUploadExceed(files){
        avatarUpload.value.clearFiles()
        const file = files[0]
        file.uid = genFileId()
        avatarUpload.value.handleStart(file)
        avatarUpload.value.submit()
    }
    function handleBeforeAvatarUpload(rawFile) {
        if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/webp') {
            ElMessage.error('必须上传图片哦')
            return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
            ElMessage.error('请上传2mb以下的图片')
            return false
        }
        return true
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
                            :style="{ backgroundColor: inAvatarArea ? 'rgb(66,66,66,.5)' : null }">
                            <el-upload ref="avatarUpload" style="display: flex;" :limit="1" name="avatar" :show-file-list="false"
                                :on-success="handleAvatarUploadSuccess"
                                :on-exceed="handleAvatarUploadExceed"
                                :before-upload="handleBeforeAvatarUpload"
                                :action="`${devPrefix}/user/upload/avatar`" method="put"
                                :headers="{ Authorization: `Bearer ${token}` }">
                                <el-button size="small" type="info" round>更改头像</el-button>
                            </el-upload>
                        </div>
                    </Transition>
                </div>
                <div class="username">
                    <template v-if="editingUsername">
                        <el-input v-model="username" maxlength="10" show-word-limit type="text" clearable size="small"
                            :style="{ width: '240px' }" @keyup.enter="submitUsername" @blur="submitUsername"></el-input>
                    </template>
                    <template v-else>
                        {{ username }}
                    </template>
                    <el-icon class="username-edit clickable-icon" title="修改用户名" size="1em" @click="clickEditUsername">
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
                    <el-menu router>
                        <el-menu-item index="/userCenter">个人信息</el-menu-item>
                        <el-sub-menu>
                            <template #title>
                                <span>历史记录</span>
                            </template>
                            <el-menu-item index="/userCenter/userHistory">我的订单</el-menu-item>
                            <el-menu-item :disabled="!isSeller" index="/userCenter/restaurantHistory">店铺记录</el-menu-item>
                            <el-menu-item :disabled="!isDeliveryMan" index="/userCenter/deliveryHistory">骑手记录</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <RouterView v-slot="{ Component }">
                        <KeepAlive include="UserHistoryView">
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
}
</style>