<script setup>
    import { dayjsToFormat1 } from '@/js/unit'
    import { Delete } from '@element-plus/icons-vue'

    const props = defineProps(['msg'])
    const emits = defineEmits('delete')

    const bodyStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
    }
    let text = ''
    let handleClickCard = () => {}

    (() => {
        switch (props.msg.type) {
            case 0:
                text = dayjsToFormat1(props.msg.time) + ' 新订单'
                handleClickCard = () => {}
                break;
        
            default:
                break;
        }
    })()
</script>

<template>
    <el-card class="message-card" :body-style="bodyStyle" shadow="hover" @click="handleClickCard()">
        <span>{{ text }}</span>
        <el-button @click.stop="$emit('delete')" :icon="Delete"></el-button>
    </el-card>
</template>