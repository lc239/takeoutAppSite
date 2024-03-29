<script setup>
    import { addAddress } from '@/network/userApi'
    import { ElMessage } from 'element-plus'
    import { ref } from 'vue'

    const dialogVisible = defineModel()
    const addressForm = ref({
        name: '',
        address: '',
        phone: ''
    })
    function handleAddAddress(){
        ElMessage("正在提交，请稍等")
        addAddress(addressForm.value, { onSucceed: () => dialogVisible.value = false })
    }
</script>

<template>
    <el-dialog v-model="dialogVisible">
        <el-form v-model="addressForm">
            <el-form-item label="姓名">
                <el-input v-model="addressForm.name" />
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="addressForm.phone" />
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="addressForm.address" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="handleAddAddress()">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>