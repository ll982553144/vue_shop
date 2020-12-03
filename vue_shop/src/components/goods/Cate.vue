<!-- 1. 商品分类包裹容器，D4-3-->
<template>
<div>
    <!-- 1. 面包屑导航区域，记得去element.js按需导入el-breadcrumb,D3-3-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>



    <!-- 2. 卡片视图, D3-3-->
    <el-card>
        <el-row>
            <el-col>
                <!-- 绑定 showAddCateDialog 事件，D4-10-->
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 表格 D4-4-->
        <!-- 去main.js 注册TreeTable 组件，D4-6 -->
        <!-- data导入商品分类的数据列表，columns为table指定列的定义，selection-type隐藏复选框，expand-type隐藏展开行效果，show-index显示索引列,index-text 表头放#号，boder纵向分割线，show-row-high 取消高亮效果
        ，D4-6 -->
        <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" boder>
            <!-- 是否有效，表格内部定义一个插槽 D4-6-->
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                <i class="el-icon-error" v-else style="color: red;"></i>
            </template>

            <!-- 排序，表格内部定义一个插槽,按需渲染 D4-8-->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 排序，表格内部定义一个插槽,按需渲染 D4-8-->
            <template slot="opt">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
        </tree-table>
        <!-- 分页区域 D4-9-->
        <!-- 分页区域,为事件到 methods 里定义 D4-9-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类的对话框，D4-10-->
    <!-- 去data里添加addCateDialogVisible为false值，D4-10-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
        <!-- 添加分类表单，form第一个,去data中定义 addCateForm -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <!-- 父级分类的表单 ，D4-10-->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">

            <el-form-item label="父级分类：">
                <!-- 记得去 element.js，设置Cascader ，D4-12-->
                <!-- options 用来指定数据源,props 的用来指定配置对象，v-model 必须绑定数组不能绑定值 ,parentCateChanged 去methods定义函数，clearable  清空，change-on-select允许选中任意一项，D4-12-->
                <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="parentCateList" :props=" cascaderProps" @change="parentCateChanged" clearable change-on-select></el-cascader>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<!-- 2. 组件行为区，D4-3-->

<script>
export default {
    // 私有数据节点
    data() {

        return {
            // 获取商品的分类数据涉及到分页，指定查询条件,D4-5
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            // 商品分类的数据列表，默认为空，D4-5
            catelist: [],
            // 总数据条数， D4-5
            total: 0,
            // 为table指定列的定义，D4-5
            columns: [{
                label: '分类名称',
                prop: 'cat_name',
            }, {
                label: '是否有效',
                // 将当前列定义为模板列，D4-6
                type: 'template',
                // 表示当前这一列使用模板名称，作用域插槽
                template: 'isok'
            }, {
                label: '排序',
                // 将当前列定义为模板列，D4-7
                type: 'template',
                // 表示当前这一列使用模板名称，作用域插槽
                template: 'order'
            }, {
                label: '操作',
                // 将当前列定义为模板列，D4-8
                type: 'template',
                // 表示当前这一列使用模板名称，作用域插槽
                template: 'opt'
            }],
            // 控制添加分类对话框的显示与隐藏，D4-10
            addCateDialogVisible: false,
            // 添加分类的表单数据对象，D4-10
            addCateForm: {
                // 将要添加的分类名称，不能为空 D4-10
                cat_name: '',
                // 父级分类的Id，不能为空D4-10
                cat_pid: 0,
                // 分类的等级，默认要添加的是1级分类，
                cat_level: 0,
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [{
                    required: true,
                    message: '请输入分类的名称',
                    trigger: 'blur'
                }]
            },
            // 父级分类的列表， D4-11
            parentCateList: [],
            // 指定级联选择器的配置对象 prop，value和Id相关，label父级名称，children和子级信息 D4-12
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 选中的父级分类的Id数组， D4-12
            selectedKeys: [],
        }
    },
    // 生命周期函数
    created() {
        // 定义一个方法在methods中做方法的定义，D4-5
        this.getCateList()
    },
    // 定义所有的事件处理函数
    methods: {
        // 获取商品的分类数据，D4-5
        async getCateList() {
            // 发起请求,异步简化
            const {
                data: res
            } = await this.$http.get('categories', {
                params: this.querInfo
            })

            // 判断请求是否成功， D4-5
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            // console.log(res.data)
            // 把数据列表，赋值给 return里的catelist, D4-5
            this.catelist = res.data.result
            // 为总数据条数赋值， D4-5 
            this.total = res.data.total

        },
        // 监听 pagesize 改变， D4-9
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize
            // 发起数据请求
            this.getCateList()
        },
        // 监听 pagenum 改变， D4-9
        handleCurrentChange(newPage) {
            this.querInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击按钮，展示添加分类的对话框， D4-10
        showAddCateDialog() {
            // 先获取父级分类的数据列表，4-11
            this.getParentCateList()
            // 再展示出对话框，D4-10
            this.addCateDialogVisible = true
        },

        // 获取父级分类的数据列表,去调用，D4-11
        async getParentCateList() {
            const {
                data: res
            } = await this.$http.get('categories', {
                params: {
                    type: 2
                }
            })

            if (res.meta.status !== 200) {
                return this.$message.error('获取父级数据失败')
            }
            // console.log+(res.data)
            // 赋值，保存到 parentCateList 
            this.parentCateList = res.data
        }

    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
        console.log(this.selectedKeys)
    }
}
</script>

<!-- 3. 美化当前组件的样式，D4-3-->

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}

// 级联选择器， D4-12
.el-cascader {
    width: 100%;
}
</style>
