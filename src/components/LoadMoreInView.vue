<script setup>
//测试加载时已经在视口的情况
    import { onMounted, ref } from 'vue'

    const emit = defineEmits(['load'])
    const props = defineProps({
        threshold: {
            type: Number,
            default: 0.6
        },
        marginTop: {
            type: String,
            default: '0'
        }
    })

    const loading = ref(false)
    const loadDiv = ref(null)
    const loadDivObserver = new IntersectionObserver(e => {
        if(e[0].isIntersecting && !loading.value){
            loading.value = true
            emit('load')
        }
    }, { threshold: props.threshold })

    const observing = ref(true)

    onMounted(() => {
        loadDivObserver.observe(loadDiv.value) //监听此组件是否进入视野足够大
    })

    function unobserve(){
        loadDivObserver.unobserve(loadDiv.value)
        observing.value = false
        loading.value = false
    }
    function waitNext(){
        loading.value = false
    }
    defineExpose({ unobserve, waitNext })
</script>

<template>
    <div ref="loadDiv" v-loading="loading" :style="{marginTop: props.marginTop}">
        <slot :observing="observing"></slot>
    </div>
</template>