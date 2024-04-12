<script setup lang="ts">
    import { ref } from 'vue'
    import { commentOrder } from '@/network/userApi'
    import { ElMessage } from 'element-plus'
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    const buttonDisable = ref(false)
    const { commentDialogVisible, commentingOrder } = storeToRefs(useUserStore())
    const { closeCommentDialog } = useUserStore()
    //上传图片暂时未做
    const commentForm = ref({
        rate: 0,
        content: ''
    })
    function handleCommit(){
        buttonDisable.value = true
        commentOrder(commentingOrder.value!.orderId!, commentForm.value, {
            onSucceed: comment => {
                ElMessage({
                    type: 'success',
                    message: '评论完成'
                })
                commentForm.value = {
                    rate: 0,
                    content: ''
                }
                commentingOrder.value!.commentId = comment.id
            },
            onFinally: () => {
                closeCommentDialog()
                buttonDisable.value = false
            }
        })
    }
</script>

<template>
    <el-dialog v-model="commentDialogVisible" title="评论订单">
        <el-form v-model="commentForm">
            <el-form-item label="评分">
                <el-rate v-model="commentForm.rate" />
            </el-form-item>
            <el-form-item label="评论内容">
                <el-input v-model="commentForm.content" type="textarea" show-word-limit maxlength="100" autosize />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeCommentDialog()" :disabled="buttonDisable" type="primary">取消</el-button>
                <el-button @click="handleCommit()" :disabled="buttonDisable">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>