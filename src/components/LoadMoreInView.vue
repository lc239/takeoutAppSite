<script setup>
    import { onMounted, ref } from 'vue';

    const emit = defineEmits(['load'])
    const props = defineProps({
        threshold: {
            type: Number,
            default: 0.6
        }
    })

    const loadDiv = ref(null)
    const loadDivObserver = new IntersectionObserver(e => {
        emit('load')
    }, { threshold: props.threshold })

    onMounted(() => {
        loadDivObserver.observe(loadDiv.value) //监听此组件是否进入视野足够大
    })

    function unobserve(){
        loadDivObserver.unobserve(loadDiv.value)
    }
    defineExpose({ unobserve })
</script>

<template>
    <div ref="loadDiv">
        <slot></slot>
    </div>
</template>

<style>

</style>