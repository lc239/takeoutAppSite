<script setup>
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import { ref } from 'vue';
    import { ElMessageBox, ElMessage } from 'element-plus';
    import AddAddressDialog from '@/components/userCenter/AddAddressDialog.vue'
    import { setAddresses } from '@/network/userApi'

    const { phone, addresses, hasAddress } = storeToRefs(useUserStore())
    const { setAddresses: setStoreAddresses, addAddress } = useUserStore()
    const addressesDialogVisible = ref(false)
    const addAddressDialogVisible = ref(false)
    let originAddresses
    function openAddressesEditDialog(){
        addressesDialogVisible.value = true
        //打开时先记录原数组
        originAddresses = addresses.value.slice()
    }
    const handleClose = (done) => {
        ElMessageBox.confirm('还没保存，您确定要关闭吗?').then(() => {
            done()
        })
    }
    function handleDeleteAddress(index){
        ElMessageBox.confirm('您确定要删除这一项吗？').then(() => {
            addresses.value.splice(index, 1)
        })
    }
    function cancelAddressModify(){
        //取消修改把数组赋值回store
        setStoreAddresses(originAddresses)
    }
    function setDefaultAddress(index){
        [addresses.value[0], addresses.value[index]] = [addresses.value[index], addresses.value[0]]
    }
    //添加地址会直接发送请求
    function handleAddAddress(){
        if(addresses.value.length === 6){
            ElMessage('最多设置6个地址')
        }else{
            addAddressDialogVisible.value = true
        }
    }
    function handleCommitAddresses(){
        setAddresses(addresses.value, {
            onSucceed: () => {
                ElMessage({
                    type: 'success',
                    message: '提交成功'
                })
            },
            onFinally: () => {
                addressesDialogVisible.value = false
            }
        })
    }
    function handleAddAddressEmit(address){
        addAddress(address)
        addAddressDialogVisible.value = false
    }
</script>

<template>
    <el-descriptions title="个人信息" border :column="2">
        <el-descriptions-item label="绑定手机号">
            {{ phone }}
        </el-descriptions-item>
        <el-descriptions-item label="默认地址">
            <div class="addresses-description">
                <!-- 数据暂时先这么表示 -->
                <span>{{ hasAddress ? Object.values(addresses[0]).join(', ') : '未设置' }}</span>
                <el-icon class="addresses-edit clickable-icon" title="修改地址" size="1.3em" @click="openAddressesEditDialog">
                    <Edit />
                </el-icon>
            </div>
        </el-descriptions-item>
    </el-descriptions>
    <el-dialog v-model="addressesDialogVisible" title="我的地址" width="600" :before-close="handleClose">
        <div class="addresses-content">
            <template v-if="hasAddress">
                <div v-for="(address, index) in addresses" class="address-item">
                    <div class="data">
                        <span class="item-index">{{ index + 1 }}</span>
                        <span>{{ Object.values(address).join(', ') }}</span>
                    </div>
                    <div class="operations">
                        <el-button :style="{visibility: index === 0 ? 'hidden' : null}" circle size="small" title="设为默认地址" @click="setDefaultAddress(index)"><el-icon><Top/></el-icon></el-button>
                        <el-button circle size="small" title="删除此地址" @click="handleDeleteAddress(index)"><el-icon><Close/></el-icon></el-button>
                    </div>
                </div>
            </template>
            <div v-else class="default-address-item">
                还没有设置过地址，快设置一个吧
            </div>
            <div class="footer">
                <el-button @click="handleAddAddress()">添加地址</el-button>
                <el-button @click="handleCommitAddresses()">提交更改</el-button>
                <el-button @click="cancelAddressModify()">取消更改</el-button>
            </div>
        </div>
        <AddAddressDialog v-model="addAddressDialogVisible" @add-address="handleAddAddressEmit" width="600"/>
    </el-dialog>
</template>

<style>
.addresses-description{
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 6px;
}
.address-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 8px;
    margin: 10px;
    padding: 8px;
    border-radius: 4px;
    background-color: var(--el-color-primary-light-8);
    --icon-size: 24px;
}
.default-address-item{
    margin: 10px;
}
.address-item > .operations{
    flex-shrink: 0;
}
.address-item > .data{
    display: flex;
    align-items: center;
    column-gap: 6px;
}
.address-item > .data > .item-index{
    color: var(--el-color-primary-light-3);
    margin: 0 6px;
}
.addresses-content .footer{
    display: flex;
    justify-content: center;
    margin-top: 14px;
}
</style>@/js/formValidator