import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem} from 'element-ui'
// import { Input} from 'element-ui'
// // 首先，导入弹框提示组件D1-23
// import { Message} from 'element-ui'

//优化element-ui的按需组件的导入格式，D1-28,D2-3
import { 
    Button, 
    Form, 
    FormItem, 
    Input, 
    Message,
    Container, 
    Header, 
    Aside, 
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch, 
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)


// 然后，Message需要全局挂载，框组件挂载到vue的原形上去.D1-23
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm