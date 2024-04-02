<script setup>
    import { instantToFormat } from '@/js/unit'

    const props = defineProps(['comment'])
</script>

<template>
    <div class="comment-card">
        <div class="comment-card-header">
            <span>{{ props.comment.username }}</span>
            <el-rate v-model="props.comment.rate" disabled />
        </div>
        <div class="horizon-divider"></div>
        <div class="comment-card-content">{{ props.comment.content }}</div>
        <div class="horizon-divider"></div>
        <div class="comment-card-footer">{{ instantToFormat(props.comment.createTime) }}</div>
    </div>
</template>

<style>
.comment-card{
    height: 100%;
    width: 100%;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    display: flex;
    flex-direction: column;
    --comment-card-padding: 4px;
    --divider-color: #9e9e99fa;
}
.comment-card > .comment-card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--comment-card-padding);
}
.comment-card > .comment-card-content{
    padding: var(--comment-card-padding);
    overflow: hidden;
    flex: 1;
}
.comment-card > .comment-card-footer{
    padding: var(--comment-card-padding);
    align-self: flex-end;
}
</style>