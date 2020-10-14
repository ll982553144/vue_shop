<!-- 权限管理, D3-2-->
<template>
<div>
    <!-- 1. 面包屑导航区域，记得去element.js按需导入el-breadcrumb,D3-3-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2. 卡片视图, D3-3-->
    <el-card>
        <el-table :data="rightsList" border stripe>
            <!-- 2. 指定索引列, D3-5-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop=" level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

</div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表. D3-4
            rightsList: []
        }
    },
    // 生命周期函数,D3-4
    created() {
        // 获取所有权限,记得定义, D3-4
        this.getRightsList()
    },
    // 定义方法
    methods: {
        // 获取权限列表
        async getRightsList() {
            // 结构赋值
            const {
                data: res
            } = await this.$http.get('rights/list')
            if (res.meta.status !== 200) {
                return this.$message / error('获取权限列表失败!')
            }
            // 没有失败,就把数据挂载到 rightsList, 供页面的模板结构使用
            this.rightsList = res.data
            console.log(this.rightsList)
        }
    }
}
</script>

<style lang="less" scoped>

</style>
