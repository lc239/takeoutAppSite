<script setup lang="ts">
    import { ref } from 'vue'
    import { notSpace, isPhoneNumber } from '@/js/formValidator'

    defineEmits<{
       addAddress: [form: {name: string, address: string, phone: string}]
    }>()
    const dialogVisible = defineModel<boolean>()

    const addressForm = ref({
        name: '',
        address: '',
        phone: ''
    })
    const addressRules = {
        name: [{ validator: notSpace, trigger: 'blur' }],
        phone: [{ validator: isPhoneNumber, trigger: 'blur' }],
        address: [{ validator: notSpace, trigger: 'blur' }]
    }
</script>

<template>
    <el-dialog v-model="dialogVisible" title="添加新地址" append-to-body>
        <el-form v-model="addressForm" :rules="addressRules">
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
                <el-button @click="$emit('addAddress', addressForm)">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>