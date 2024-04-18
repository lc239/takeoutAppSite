import { ref, onUnmounted, type Ref, onMounted } from "vue"

// export function useAreaIn(el: any, inDelay = 0, outDelay = 0) {
//     const inArea = ref(false)
//     watch(el, newEl => {
//         if (newEl) {
//             let inTimer: number, outTimer: number
//             function onMouseEnter() {
//                 clearTimeout(outTimer)
//                 inTimer = setTimeout(() => inArea.value = true, inDelay)//添加inDelay防止路过目标区域便弹出面板之类
//             }
//             function onMouseLeave(e: any) {
//                 if (!newEl.contains(e.relatedTarget)) {
//                     clearTimeout(inTimer)
//                     outTimer = setTimeout(() => inArea.value = false, outDelay)//添加outDelay防止移动到弹出面板过程中路过外部区域导致面板消失
//                 }
//             }
//             newEl.addEventListener('mouseenter', onMouseEnter)
//             newEl.addEventListener('mouseleave', onMouseLeave)
//             onUnmounted(() => {
//                 newEl.removeEventListener('mouseenter', onMouseEnter)
//                 newEl.removeEventListener('mouseleave', onMouseLeave)
//             })
//         }
//     })


//     return inArea
// }

export function useAreaIn(el: Ref<HTMLElement | null>, inDelay = 0, outDelay = 0) {
    const inArea = ref(false)
    let inTimer: number, outTimer: number
    function onMouseEnter() {
        clearTimeout(outTimer)
        inTimer = setTimeout(() => inArea.value = true, inDelay)//添加inDelay防止路过目标区域便弹出面板之类
    }
    function onMouseLeave(e: any) {
        if (!el.value!.contains(e.relatedTarget)) {
            clearTimeout(inTimer)
            outTimer = setTimeout(() => inArea.value = false, outDelay)//添加outDelay防止移动到弹出面板过程中路过外部区域导致面板消失
        }
    }
    onMounted(() => {
        el.value!.addEventListener('mouseenter', onMouseEnter)
        el.value!.addEventListener('mouseleave', onMouseLeave)
    })
    onUnmounted(() => {
        el.value!.removeEventListener('mouseenter', onMouseEnter)
        el.value!.removeEventListener('mouseleave', onMouseLeave)
    })
    return inArea
}

export function useDraggable(
    el: Ref<HTMLElement | null>,
    verticalInit: {top?: string, bottom?: string} = {top: '0px'},
    horizontalInit: {left?: string, right?: string} = {left: '0px'}
){
    let startClientX: number, startClientY: number
    let xOffset = 0, yOffset = 0
    function handleDragStart(e: DragEvent){
        e.dataTransfer?.setDragImage(document.createElement('div'), 0, 0)
        startClientX = e.clientX
        startClientY = e.clientY
    }
    const setVertical = (() => {
        if(verticalInit.top){
            return (e: DragEvent) => {
                el.value!.style.setProperty('top', `calc(${verticalInit.top} + ${e.clientY - startClientY + yOffset}px)`)
            }
        }else{
            return (e: DragEvent) => {
                el.value!.style.setProperty('bottom', `calc(${verticalInit.bottom} - ${e.clientY - startClientY + yOffset}px)`)
            }
        }
    })()
    const setHorizontal = (() => {
        if(horizontalInit.left){
            return (e: DragEvent) => {
                el.value!.style.setProperty('left', `calc(${horizontalInit.left} + ${e.clientX - startClientX + xOffset}px)`)
            }
        }else{
            return (e: DragEvent) => {
                el.value!.style.setProperty('right', `calc(${horizontalInit.right} - ${e.clientX - startClientX + xOffset}px)`)
            }
        }
    })()
    function handleDrag(e: DragEvent){
        setVertical(e)
        setHorizontal(e)
    }
    function handleDragEnd(e: DragEvent){
        xOffset += e.clientX - startClientX
        yOffset += e.clientY - startClientY
        if(e.clientX >= document.documentElement.clientWidth || e.clientX <= 0 || e.clientY >= document.documentElement.clientHeight || e.clientY <= 0){
            xOffset = 0
            yOffset = 0
            init()
        }
    }
    function init(){
        if(verticalInit.top){
            el.value!.style.setProperty('top', verticalInit.top)
        }else if(verticalInit.bottom){
            el.value!.style.setProperty('bottom', verticalInit.bottom)
        }
        if(horizontalInit.left){
            el.value!.style.setProperty('left', horizontalInit.left)
        }else if(horizontalInit.right){
            el.value!.style.setProperty('right', horizontalInit.right)
        }
    }
    onMounted(() => {
        init()
        el.value!.addEventListener('dragstart', handleDragStart)
        el.value!.addEventListener('drag', handleDrag)
        el.value!.addEventListener('dragend', handleDragEnd)
    })
    onUnmounted(() => {
        el.value!.removeEventListener('dragstart', handleDragStart)
        el.value!.removeEventListener('drag', handleDrag)
        el.value!.removeEventListener('dragend', handleDragEnd)
    })
}