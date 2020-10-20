<!--1.用户列表开发,2.打开路由文件router.js,D2-12-->
<template>
<div>
    <!-- 1. 面包屑导航区域，记得去element.js按需导入el-breadcrumb,D2-14-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2. 卡片视图区域，记得按需导入,3. global.css中优化格式，D2-14-->
    <el-card>
        <!-- 4.搜索与添加区域，D2-14-->

        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 1.数据双向绑定，3.clearable可清空属性，绑定一个clear事件把下面清空，D2-22-->
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                    <!-- 2.搜索事件绑定到getUserList，D2-22-->
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 1. 用户列表区域，记得按需导入， D2-16-->
        <el-table :data="userlist" border stripe>
            <!-- 1. 索引列， D2-17-->
            <el-table-column type="index"></el-table-column>
            <!-- 2. 数据列， D2-16-->
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
                <!-- 1. 改造状态栏显示效果，去elemen-ui引用switch开关， D2-18 
                1. 用户状态的改变，开关的events中的change，D2-21-->
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="180px">
                <!-- 1. 操作列插槽自定义渲染，去elemen-ui引用button图标按钮， D2-19-->
                <template slot-scope="scope">
                    <!-- 修改按钮，D2-19-->
                    <el-button type="primary" icon="el-icon-edit" size="mini" v-model="scope.row" @click="showEditDialog(scope.row.id)"></el-button>
                    <!-- 删除按钮，D2-19-->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                    <!-- 分配角色按钮,引用文字提示，D2-19-->
                    <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>
        <!-- 1. 分页区域，记得按需导入pagination， D2-20-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>

    <!-- 1. 添加用户的对话框，去data添加事件，D2-23-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域，D2-23-->
        <!-- 1. 添加用户验证表单，D2-24-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>

        <!-- 底部区域区域，D2-23-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 1. 修改用户的对话框，去data添加事件,
    2.去data 控制修改用户对话框的显示与隐藏,
    3.editDialogVisible 点击事件时重发为true,D2-29-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
        <!-- 1. 添加表单验证，去data添加事件，
        :model 数据绑定对象, :rules验证规则对象, ref表单的引用
        ,D2-31-->
        <!-- 不需要校验规则prop ，
        绑定到editForm才能保存数据
        ,D2-31-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
        </el-form>

        <!-- 需要校验规则prop ，D2-31-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model=" editForm.email">
                </el-input>
            </el-form-item>
        </el-form>
        <!-- 需要校验规则prop ，D2-31-->

        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    // 1. 获取用户列表数据，固定data（），created（）。methods:，D2-15
    data() {
        // 1. 验证邮箱的自定义规则，用正则实现D2-25
        var checkEmail = (rule, value, cb) => {
            // 2.验证邮箱的正则表达式，D2-25
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

            if (regEmail.test(value)) {
                // 合法的邮箱,true就通过
                return cb()
            }
            // 没有return，就是非法的邮箱，调用cb()回调函数
            cb(new Error("请输入合法的邮箱！"))
        }
        // 1. 验证手机号的自定义规则，D2-25
        var checkMobile = (rule, value, cb) => {
            // 2.验证手机号的的正则表达式，D2-25
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error("请输入合法的手机号！"))
        }

        return {
            // 4. 获取用户列表的参数对象，D2-15
            queryInfo: {
                query: '',
                // 当前的页数，D2-15，D2-20
                pagenum: 1,
                // 当前每页显示多少条数据，D2-15，D2-20
                pagesize: 2
            },
            // 4. 数据保存,D2-15
            userlist: [],
            total: 0,
            // 2. 控制添加用户对话框的显示与隐藏，D2-23
            addDialogVisible: false,
            // 2. 添加用户的表单数据，D2-24
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 3. 添加表单的验证规则对象，D2-24
            addFormRules: {
                username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '用户名的长度在3~10个字符',
                        trigger: 'blur'
                    }
                ],
                password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '密码的长度在6~15个字符',
                        trigger: 'blur'
                    },
                ],
                email: [{
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                }, {
                    // 3. 添加验证规则，D2-25 
                    validator: checkEmail,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '请输入手机',
                    trigger: 'blur'
                }, {
                    validator: checkMobile,
                    trigger: 'blur'
                }]
            },
            // 2.控制修改用户对话框的显示与隐藏。D2-29
            editDialogVisible: false,
            // 查询到的用户信息对象. D2-29
            editForm: {},
            // 修改表单的验证规则对象, D2-31
            editFormRules: {
                email: [{
                        required: true,
                        message: '请输入用户邮箱',
                        triggle: 'blur'
                    },
                    {
                        validator: checkEmail,
                        triggle: 'blur'
                    }
                ],
                mobile: [{
                        required: true,
                        message: '请输入手机号',
                        triggle: 'blur'
                    },
                    {
                        validator: checkMobile,
                        triggle: 'blur'
                    }
                ]
            }
        }

    },
    created() {
        // 2. 访问或调用一个函数，D2-15
        this.getUserList()
    },
    methods: {
        // 3. 定义函数，发起axios定义请求， D2-15
        async getUserList() {
            const {
                data: res
            } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
            // 5.获取数据，D2-15
            this.userlist = res.data.users
            this.total = res.data.total
            // console.log(res)
        },
        //  2. 监听pagesize 改变的事件， D2-20
        handleSizeChange(newSize) {
            // console.log(newSize)
            // 5， 拿到pagesize监听的值保存到queryInfo.pagesize，调用getUserList D2-20
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //  3. 监听 页码值 改变的事件， D2-20
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 2. 监听 switch 开关状态的改变，D2-21
        async userStateChanged(userinfo) {
            // console.log(userinfo)
            const {
                data: res
            } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                // 如果操作失败，将userinfo.mg_state 取反返回
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        },
        // 监听添加用户对话框的关闭事件，实现重置功能，D2-26
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮，添加新用户，D2-27
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                // 可以发起添加用户的网络请求， POST返回promise，D2-28
                const {
                    data: res
                } = await this.$http.post('users', this.addForm)

                if (res.meta.status !== 201) {
                    this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
                // 隐藏添加用户的对话框，D2-28
                this.addDialogVisible = false
                // 刷新，重新获取用户列表数据 ，D2-28
                this.getUserList()
            })
        },
        // 展示编辑用户的对话框，D2-29
        async showEditDialog(id) {
            // console.log(id)
            const {
                data: res
            } = await this.$http.get('users/' + id)

            if (res.meta.status !== 200)
                return this.$message.error('查询用户信息失败!')

            // 要先在data 里设置
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件,引用editFormRef调用resetFields, D2-32
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交, D2-33
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                // 发起修改用户信息的数据请求,D2-34
                const {
                    data: res
                } = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if (res.meta.status !== 200)
                    return this.$message.error('更新用户信息失败!')

                // 关闭对话框
                this.editDialogVisible = false
                // 刷新数据列表
                this.getUserList()
                // 提示修改成功
                this.$message.success('更新用户信息成功!')
            })
        },
        // 根据Id删除对应的用户信息, D2-35  
        async removeUserById(id) {
            //弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 如果用户确认删除,则返回值为字符串 confirm
            // 如果用户取消了删除.则返回值为字符串 cancel
            // console.log(res)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const {
                data: res
            } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功!')
            this.getUserList()
        }
    }
}
</script>

<style lang="less" scoped>

</style>
