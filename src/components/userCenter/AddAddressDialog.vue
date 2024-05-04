<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { notSpace, isPhoneNumber } from '@/js/formValidator'
    import type { FormRules, FormInstance } from 'element-plus';

    const emits = defineEmits<{
       addAddress: [form: {name: string, address: string, phone: string}]
    }>()
    const dialogVisible = defineModel<boolean>()

    interface AddressRuleForm{
        name: string
        phone: string
        address: string
    }

    const ruleFormRef = ref<FormInstance>()

    const addressForm = reactive<AddressRuleForm>({
        name: '',
        address: '',
        phone: ''
    })
    const addressRules = reactive<FormRules<AddressRuleForm>>({
        name: [{ validator: notSpace, trigger: 'blur' }],
        phone: [{ validator: isPhoneNumber, trigger: 'blur' }],
        address: [{ validator: notSpace, trigger: 'blur' }]
    })
    function submitForm(formEl?: FormInstance){
        if(!formEl) return
        formEl.validate(valid => {
            if(valid){
                emits('addAddress', addressForm)
            }else{
                return false
            }
        })
    }
</script>

<template>
    <el-dialog v-model="dialogVisible" title="添加新地址" append-to-body>
        <el-form :model="addressForm" :rules="addressRules" ref="ruleFormRef">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="addressForm.name" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="addressForm.phone" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="addressForm.address" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="submitForm(ruleFormRef)">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>