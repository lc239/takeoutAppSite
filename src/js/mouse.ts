import { ref, onUnmounted, watch } from "vue"

export function useAreaIn(el: any, inDelay = 0, outDelay = 0) {
    const inArea = ref(false)
    watch(el, newEl => {
        if (newEl) {
            let inTimer: number, outTimer: number
            function onMouseEnter() {
                clearTimeout(outTimer)
                inTimer = setTimeout(() => inArea.value = true, inDelay)//添加inDelay防止路过目标区域便弹出面板之类
            }
            function onMouseLeave(e: any) {
                if (!newEl.contains(e.relatedTarget)) {
                    clearTimeout(inTimer)
                    outTimer = setTimeout(() => inArea.value = false, outDelay)//添加outDelay防止移动到弹出面板过程中路过外部区域导致面板消失
                }
            }
            newEl.addEventListener('mouseenter', onMouseEnter)
            newEl.addEventListener('mouseleave', onMouseLeave)
            onUnmounted(() => {
                newEl.removeEventListener('mouseenter', onMouseEnter)
                newEl.removeEventListener('mouseleave', onMouseLeave)
            })
        }
    })

    return inArea
}