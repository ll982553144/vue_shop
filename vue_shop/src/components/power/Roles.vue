<template>
<div>
    <!-- 1. 面包屑导航区域，记得去element.js按需导入el-breadcrumb,D3-8-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2. 卡片视图, D3-8-->
    <el-card>
        <!-- 添加角色按钮区域, D3-8-->
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区域, D3-9-->
        <el-table :data="rolelist" border stripe>
            <!-- 展开列-->
            <el-table-column type="expand">
                <!-- 作用域插槽最方便,D3-11-->
                <!-- for循环,每一次往第一列里添加标签,D3-12-->
                <template slot-scope="scope">
                    <!-- 三元表达式,添加上下底线,D3-13-->
                    <el-row :class=" ['bdbottom',i1 === 0 ? 'bdtop': '', 'vcenter'] " v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限-->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限-->
                        <el-col :span="19">
                            <!-- 通过for循环渲染嵌套二级权限,三元表达式,判断索引是否为0添加顶线,D3-14-->
                            <el-row :class="[i2 === 0 ? '': 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                <!-- 二级权限-->
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 三级权限, 
                                1.tag标签可移除标签closable
                                2.绑定事件,methods行为区定义
                                ,D3-17 -->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="smallitem in item2.children" :key="smallitem.id" closable @close="removeRightById(scope.row, smallitem.id)">
                                        {{smallitem.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列-->
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <!-- 到element-ui找到带图标的按钮,scope !!!!! D3-9-->
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>

                </template>
            </el-table-column>

        </el-table>
    </el-card>

    <!-- 1.分配权限的，
    2.去data定义 setRightDialogVisible
    3.
    , D3-19-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
        <!-- 1.树形控件，
        到element-ui找到tree树形控件,然后一定要去element.js 按需导入！！！
        2. 去data数据绑定rightslist,
        3. props指定属性绑定对象实现绑定数据绑定的字段完成父子间嵌套，去data 绑定treeProps
        D3-20-->
        <!-- 1. 复选框，添加show-checkbox属性，
        2. node-key，每一个节点绑定一个Id 的值，
        3. default-expand-all，默认展开所有节点，
        D3-21-->
        <!-- default-checked-keys 默认选中
        2. 记得去data defKeys
        D3-22-->
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="  id" default-expand-all :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据,D3-8
            rolelist: [],
            // 2.控制分配权限对话框的显示与隐藏，D3-19
            setRightDialogVisible: false,
            // 所有权限的数据，默认为空,D3-19
            rightslist: [],
            // 2.树形控件的属性绑定对象,D3-20
            treeProps: {
                // 看到的是哪个属性对应的值
                label: 'authName',
                // 父子节点通过哪个属性嵌套
                children: 'children'
            },
            // 默认选中的节点Id值数组，D3-22
            // 1.实现已有权限的勾选功能，清空defKeys数组保证原装性，2.定义一个递归函数，通过递归形式，把三级节点全都保存到defKeys ，D3-23
            defKeys: []
        }
    },
    // 定义函数 
    created() {
        this.getRolesList()

    },
    // 定义节点
    methods: {
        // 获取所有角色列表,D3-8
        async getRolesList() {
            const {
                data: res
            } = await this.$http.get('roles')

            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败!')
            }
            // 保存数据
            this.rolelist = res.data
            // console.log(this.rolelist)
        },
        // 根据Id 删除对应的权限, D3-17
        async removeRightById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') {
                return this.$message.info('取消了删除!')
            }

            const {
                data: res
            } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

            // 判断状态码是否为200
            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败！')
            }

            // 刷新数据列表
            // this.getRolesList()
            // 删除完以后会刷新到主页面，不会留在本页面，以上函数会发生页面的完整渲染，不建议调用，D3-18
            // 把服务器返回到当前页面，提升用户体验，D3-18
            role.children = res.data
        },
        // 展示分配权限的对话框，D3-19
        async showSetRightDialog(role) {
            // 3，点击分配权限按钮时，重置为true,获取所有权限的数据， D3-19
            const {
                data: res
            } = await this.$http.get('rights/tree')
            console.log(res)
            // 判断请求
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败')
            }

            // 把获取到的数据保存到data，D3-19
            this.rightslist = res.data
            // console.log(this.rightslist)

            //递归获取三级节点的Id 
            // this.getLeafKeys(role, this.defKeys)

            this.setRightDialogVisible = true
        }

    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys数组中, D3-23
    // node 节点，arr数组
    getLeafKeys(node, arr) {
        // 如果当前 node 节点不包含chidren 属性，则是三级节点
        if (!node.children) {
            return arr.push(node.id)
        }
        // 递归，循环当前数组
        node.children.forEach(item => this.getLeafKeys(item, arr))
    }

}
</script>

<style lang="less" scoped>
// 美化一级权限,D2-13
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eeeeee
}

.bdbottom {
    border-bottom: 1px solid #eeeeee
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
