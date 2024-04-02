<script setup>
    import { useRestaurantStore } from '@/stores/restaurant';
    import { storeToRefs } from 'pinia';
    import { inject, ref } from 'vue';
    import MenuCard from "@/components/restaurantCenter/MenuCard.vue";
    import { addCategory, deleteCategory, updateCategory, addMenu, deleteMenu, updateMenu } from '@/network/restaurantApi';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { fenToYuan, yuanToFen } from '@/js/unit';

    const { categories } = storeToRefs(useRestaurantStore())
    const { checkMenuName } = useRestaurantStore()
    function handleAddCategory(){
        ElMessageBox.prompt('请输入分类名', '提示', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            inputPattern: /^\S{1,10}$/,
            inputErrorMessage: '请输入10个字以内(不能使用空白符)'
        }).then(({value}) => {
            addCategory(value,{
                onSucceed: res => ElMessage({
                    type: 'success',
                    message: '添加成功'
                })
            })
        })
    }
    function handleDeleteCategory(index){
        ElMessageBox.confirm('确定删除此分类吗', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteCategory(index, {
                onSucceed: res => ElMessage({
                    type: 'success',
                    message: '删除成功'
                })
            })
        })
    }
    function handleUpdateCategoryName(index){
        ElMessageBox.prompt('请输入新的分类名', '提示', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
        }).then(({value}) => {
            updateCategory(index, value, {
                onSucceed: res => ElMessage({
                    type: 'success',
                    message: '修改成功'
                })
            })
        })
    }
    let add = true //如果是添加菜单就是true，是修改就是false
    const menuDialogVisible = ref(false)
    const menuForm = ref({
        name: '',
        price: 0,
        description: '',
        categoryIndex: 0,
        menuIndex: 0
    })
    function handleAddMenu(index){
        menuForm.value.categoryIndex = index
        add = true
        menuDialogVisible.value = true
    }
    function handleMenuSubmit(){
        const {categoryIndex, menuIndex, ...menu} = menuForm.value
        menu.price = yuanToFen(menu.price)
        if (add) {
            if (!checkMenuName(menu.name, categoryIndex)) ElMessage('名称不能重复或为空')
            addMenu(menu, categoryIndex,{
                onSucceed: res => {
                    ElMessage({
                        type: 'success',
                        message: '添加成功'
                    })
                    menuDialogVisible.value = false
                }
            })
        } else {
            updateMenu(menu, categoryIndex, menuIndex, {
                onSucceed: res => {
                    ElMessage({
                        type: 'success',
                        message: '修改成功'
                    })
                    menuDialogVisible.value = false
                }
            })
        }
    }
    function handleDeleteMenu(categoryIndex, menuIndex){
        ElMessageBox.confirm('确定删除此菜品吗', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteMenu(categoryIndex, menuIndex,{
                onSucceed: res => ElMessage({
                    type: 'success',
                    message: '删除成功'
                })
            })
        })
    }
    function handleUpdateMenu(menu, categoryIndex, menuIndex){
        add = false
        menuForm.value = {...menu, categoryIndex, menuIndex, price: fenToYuan(menu.price)}
        menuDialogVisible.value = true
    }
</script>

<template>
    <el-button @click="handleAddCategory()" style="margin-bottom: 10px;" type="primary">添加分类</el-button>
    <div v-if="!categories?.length" style="margin-top: 10px;">还没有分类哦，点击上方按钮添加一个吧</div>
    <el-collapse v-else>
        <el-collapse-item v-for="(category, categoryIndex) in categories" :key="category.name">
            <template #title>
                <div class="category-title">
                    <span>{{ category.name }} <el-icon title="编辑分类名" class="clickable-icon"
                            @click.stop="handleUpdateCategoryName(categoryIndex)">
                            <Edit />
                        </el-icon></span>
                    <span>
                        <el-button @click.stop="handleAddMenu(categoryIndex)" type="primary">添加菜品</el-button>
                        <el-button @click.stop="handleDeleteCategory(categoryIndex)" type="danger">删除分类</el-button>
                    </span>
                </div>
            </template>
            <div class="menu-grid">
                <MenuCard v-for="(menu, menuIndex) of category.menus" :key="menu.name" :category-index="categoryIndex"
                    :menu-index="menuIndex">
                    <template #footer>
                        <div class="menu-card-footer">
                            <el-button type="primary"
                                @click="() => handleUpdateMenu(menu, categoryIndex, menuIndex)">修改菜品信息</el-button>
                            <el-button type="danger"
                                @click="() => handleDeleteMenu(categoryIndex, menuIndex)">删除此菜品</el-button>
                        </div>
                    </template>
                </MenuCard>
            </div>
        </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="menuDialogVisible" width="500">
        <el-form v-model="menuForm">
            <el-form-item label="菜名">
                <el-input v-model="menuForm.name" max-length="15" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="价格/元">
                <el-input-number v-model="menuForm.price" :precision="2" :step="1" :min="0"
                    :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="menuForm.description" autosize></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="() => menuDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="() => handleMenuSubmit()">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style>
.category-title{
    width: 100%;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.menu-grid{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 10px;
}
.menu-card-footer{
    display: flex;
    justify-content: space-around;
}
</style>