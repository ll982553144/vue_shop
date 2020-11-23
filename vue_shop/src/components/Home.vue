<template>
<el-container class="home-container">
    <!-- 主页布局开始,想要使用组件，先要导入到element.js，D2-1-->
    <!-- 头部区域-->
    <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域-->
    <el-container>
        <!-- 侧边栏-->
        <!-- 侧边栏折叠与展开，isCollapse判断侧边栏，D2-9-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <!-- 1.左侧菜单,3.绑定点击事件，D2-9-->
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 侧边栏菜单区域，D2-3-->
            <!-- 侧边栏组件Element中导航菜单的自定义颜色，用到的组件需要在element-ui中按需导入！！！，D2-3，
            1.unique-opened左边每次只能展开唯一的一项，D2-8
            5.布尔值加“ :”,动态数据绑定绑定，D2-9
            1.左侧菜单改造成路由模式，加router，D2-11
            1.default-active子列表高亮,动态保存，D2-13-->
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
                <!-- 一级菜单，D2-3-->
                <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
                    <!-- 一级菜单的模板区域，D2-3-->
                    <template slot="title">
                        <!-- 图标，动态绑定，每循环一次一个id，D2-3-->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本，D2-3,D2-6-->
                        <span>{{item.authName}}</span>
                    </template>

                    <!-- 二级菜单，D2-3-->
                    <!-- 2. index属性作为跳转地址，path前加'/'作为跳转拼接的地址，D2-11
                    2. 点击事件，保存导航链接的状态，D2-13-->
                    <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                        <!-- 二级菜单的模板区域，D2-3-->
                        <template slot="title">
                            <!-- 图标，D2-3-->
                            <i class="el-icon-menu"></i>
                            <!-- 文本，D2-3-->
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>
        <!-- 右侧内容主体-->
        <el-main>
            <!-- 路由占位符，D2-10-->
            <router-view> </router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
// 行为区域
export default {
    // 3.把getMenuList（）获取到的数据挂载到data（）中，D2-5
    data() {
        return {
            //左侧菜单数据
            menulist: [],
            // 定义个字体对象  ./assests/font/demo_fontclass，D2-7
            iconsObj: {
                '125': 'iconfont icon-user ',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 左侧菜单是否折叠，D2-9
            isCollapse: false,
            // Date中定义一个数据保存激活的链接地址，D2-13
            activePath: ''
        }
    },
    // 1.定义一个生命周期函数，D2-5
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        // 退出功能 D1-26
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        //2.获取所有的菜单，D2-5
        async getMenuList() {
            const {
                data: res
            } = await this.$http.get('menus')

            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            // console.log(res)
            // console.log(this.menulist)
        },
        // 4.点击按钮，切换菜单的折叠与展开， D2-9
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 3.保存链接的激活状态， D2-13
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }

}
</script>

<style lang="less" scoped>
// 主页布局，D2-1
.home-container {
    height: 100%;

}

.el-header {
    background-color: #373d41;
    // 添加flex布局，左右贴边对齐，D2-2
    display: flex;
    justify-content: space-between;
    // 清空左空白，按钮居中，字体白色，D2-2
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background: #333744;

    // 2.取消右边框，优化对不齐的效果，D2-8
    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #Eaedf1;

}

// 左侧导航栏图标与文本距离，D2-7
.iconfont {
    margin-right: 10px;
}

// 2.左侧菜单，D2-9
.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    // 间距
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
