<script setup>
    import { onMounted, ref } from 'vue';

    const emit = defineEmits(['load'])
    const props = defineProps({
        threshold: {
            type: Number,
            default: 0.6
        },
        loading: {
            type: Boolean,
            default: false
        }
    })

    const loadDiv = ref(null)
    const loadDivObserver = new IntersectionObserver(e => {
        if(e[0].isIntersecting && !props.loading) emit('load')
    }, { threshold: props.threshold })

    const observing = ref(true)

    onMounted(() => {
        loadDivObserver.observe(loadDiv.value) //监听此组件是否进入视野足够大
    })

    function unobserve(){
        loadDivObserver.unobserve(loadDiv.value)
        observing.value = false
    }
    defineExpose({ unobserve })
</script>

<template>
    <div ref="loadDiv">
        <slot :observing="observing"></slot>
    </div>
</template>