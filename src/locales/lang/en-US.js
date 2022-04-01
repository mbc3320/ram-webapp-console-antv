import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'
import global from './en-US/global'

import menu from './en-US/menu'
import setting from './en-US/setting'
import user from './en-US/user'
import dashboard from './en-US/dashboard'
import form from './en-US/form'
import result from './en-US/result'
import account from './en-US/account'
import utils from './en-US/utils'
import login from './en-US/login'
import systemConfig from './en-US/system/config'
import systemPermission from './en-US/system/permission'
import systemRole from './en-US/system/role'
import systemUser from './en-US/system/user'
import systemTicket from './en-US/system/ticket'
import systemSettings from './en-US/system/settings'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Are you sure you would like to logout?',
  'layouts.userLayout.title': 'Simple, easy to use, easy to scale',
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
