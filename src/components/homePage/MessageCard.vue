<script setup lang="ts">
    import { dayjsToFormat1 } from '@/js/unit'
    import { useUserStore } from '@/stores/user'
    import { Delete } from '@element-plus/icons-vue'
    import { rejectOrder } from '@/network/restaurantApi'
    import { ElMessageBox } from 'element-plus';
    import type { WebSocketMsg } from '@/type/class';
    import type { CSSProperties } from 'vue';

    const props = defineProps<{
        msg: WebSocketMsg
    }>()

    const { removeMsg, showOrderDialog } = useUserStore()

    const bodyStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
    let text = ''
    let handleClickCard = () => {}
    let handleDeleteMsg: () => void = () => removeMsg(props.msg)

    switch (props.msg.type) {
        case 0:
            text = dayjsToFormat1(props.msg.time) + ' 新订单'
            bodyStyle.cursor = 'pointer'
            handleClickCard = () => {
                showOrderDialog(props.msg.data)
            }
            handleDeleteMsg = () => {
                ElMessageBox.confirm('拒绝此订单？').then(() => {
                    rejectOrder(props.msg.data)
                    removeMsg(props.msg)
                })
            }
            break;
        case 1:
            text = dayjsToFormat1(props.msg.time) + '您的订单已被接单'
        default:
            break;
    }
</script>

<template>
    <el-card class="message-card" :body-style="bodyStyle" shadow="hover" @click="handleClickCard()">
        <span>{{ text }}</span>
        <el-button :icon="Delete" @click="handleDeleteMsg()"></el-button>
    </el-card>
</template>