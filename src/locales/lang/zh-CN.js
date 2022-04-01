import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'
import global from './zh-CN/global'

import menu from './zh-CN/menu'
import setting from './zh-CN/setting'
import user from './zh-CN/user'
import dashboard from './zh-CN/dashboard'
import form from './zh-CN/form'
import result from './zh-CN/result'
import account from './zh-CN/account'
import utils from './zh-CN/utils'
import login from './zh-CN/login'
import systemConfig from './zh-CN/system/config'
import systemPermission from './zh-CN/system/permission'
import systemRole from './zh-CN/system/role'
import systemUser from './zh-CN/system/user'
import systemTicket from './zh-CN/system/ticket'
import systemSettings from './zh-CN/system/settings'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': '信息',
  'layouts.usermenu.dialog.content': '您确定要注销吗？',
  'layouts.userLayout.title': '简单、易用、易扩展',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account,
  ...utils,
  ...login,
  ...systemConfig,
  ...systemPermission,
  ...systemRole,
  ...systemUser,
  ...systemTicket,
  ...systemSettings
}
