<template>
<div class="login_container">
    <div class="login_box">
        <!-- 头像区域D1-15-->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="" />
        </div>

        <!-- 登录表单区域D1-16-->
        <!-- 第一步，ref就是表单的重置对象D1-20，model-->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户名D1-17-->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码D1-17-->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域-->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="reserLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        // 这是登录表单的数据绑定对象D1-18
        return {
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            // 这是表单的验证规则对象D1-19
            loginFormRules: {
                // 验证用户名是否合法
                username: [{
                        required: true,
                        message: '请输入登录名称',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                // 验证密码是否合法
                password: [{
                        required: true,
                        message: '请输入登录密码',
                        trigger: 'blur',
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '长度在 6 到 15 个字符',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    // 调用ref，method，然后绑定一个单机事件，D1-20
    methods: {
        // 点击重置按钮，重置登录表单，D1-20
        reserLoginForm() {
            // 通过this访问$refs,然后点出表单对象，直接调用方法D1-20
            this.$refs.loginFormRef.resetFields();
        },
        // 调用login按钮，D1-21
        login() {
            // validate回调函数接收valid形参一般是bolean值,判断表单是否通过，D1-21
            this.$refs.loginFormRef.validate(async (valid) => {
                // valid是否为false
                if (!valid) return;
                // 1.想调用去main.js 调用axios包，D1-22
                // 2.发起post请求服务器（启动mysql的api接口 ，启动素材/app.js输入node .\app.js）地址参数，data中的参数.D1-22
                // 3.await 在前面使用个异步async方法，输出axoios帮我们封装好的，D1-22
                //！！！接口接受不到后台数据，就打不开！！！D1-22
                const {
                    data: res
                } = await this.$http.post('login', this.loginForm);
                // console.log(res);
                // 3.登录组件弹窗提示，D1-23
                if (res.meta.status !== 200) return this.$message.error('登录失败');
                this.$message.success('登录成功');
                // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中,D1-24
                //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                window.sessionStorage.setItem('token', res.data.token);
                // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                this.$router.push('/home');
            });
        },
    },
};
</script>

<!--scoped当前生效，没有则全局生效-->

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

// 头像外盒子
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    // 头像D1-15
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        //头像盒子圆角
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            //头像圆角
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    //居右对齐
    justify-content: flex-end;
}
</style>
