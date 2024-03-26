<script setup>
    import { onMounted, onBeforeUnmount, ref } from 'vue'

    const props = defineProps({
        inDelay: {
            type: Number,
            default: 0
        },
        outDelay: {
            type: Number,
            default: 0
        }
    })
    const hoverArea = ref(null)
    const inArea = ref(false)
    let inTimer, outTimer
    
    function onMouseEnter() {
        clearTimeout(outTimer)
        inTimer = setTimeout(() => inArea.value = true, props.inDelay)//添加inDelay防止路过目标区域便弹出面板之类
    }
    function onMouseLeave(e) {
        if (!hoverArea.value.contains(e.relatedTarget)) {
            clearTimeout(inTimer)
            outTimer = setTimeout(() => inArea.value = false, props.outDelay)//添加outDelay防止移动到弹出面板过程中路过外部区域导致面板消失
        }
    }
    onBeforeUnmount(() => {
        hoverArea.value.removeEventListener('mouseenter', onMouseEnter)
        hoverArea.value.removeEventListener('mouseleave', onMouseLeave)
    })
    onMounted(() => {
        hoverArea.value.addEventListener('mouseenter', onMouseEnter)
        hoverArea.value.addEventListener('mouseleave', onMouseLeave)
    })
</script>

<template>
    <div class="hover-area" ref="hoverArea">
        <Transition name="fadedown">
            <div v-show="inArea" class="hover-area-wrapper">
                <slot class="aaa" name="hover-to-show"></slot>
            </div>
        </Transition>
        <slot></slot>
    </div>
</template>

<style>
.hover-area{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.hover-area > .hover-area-wrapper{
    position: absolute;
    top: 100%;
    padding: 8px;
}
</style>