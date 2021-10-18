<template>
  <div style="background:#ECECEC; padding:30px">
    <a-card title="系统全局设定" :bordered="false" style="width: 100%;">
      <a slot="extra" href="#" @click="saveOrUpdateConfig">保存设置</a>
      <a-descriptions title="登录图形校验码">
        <a-descriptions-item label="是否启用">
          <a-radio-group v-model="config.consoleCaptcha">
            <a-radio-button :value="true">
              启用
            </a-radio-button>
            <a-radio-button :value="false">
              禁用
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="config.consoleCaptcha" label="校验码类型">
          <a-radio-group v-model="config.captchaType">
            <a-radio-button :value="0">
              字母表
            </a-radio-button>
            <a-radio-button :value="1">
              算术式
            </a-radio-button>
            <a-radio-button :value="2">
              随机中文
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="期限类设定">
        <a-descriptions-item label="Ticket有效期">
          <a-radio-group v-model="config.ticketTimeout">
            <a-radio-button :value="120">
              2小时
            </a-radio-button>
            <a-radio-button :value="300">
              5小时
            </a-radio-button>
            <a-radio-button :value="1440">
              1天
            </a-radio-button>
            <a-radio-button :value="10080">
              7天
            </a-radio-button>
            <a-radio-button :value="43200">
              30天
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item label="密码错误事件有效期">
          <a-radio-group v-model="config.passwordErrorExpireTime">
            <a-radio-button :value="1">
              1小时
            </a-radio-button>
            <a-radio-button :value="5">
              5小时
            </a-radio-button>
            <a-radio-button :value="24">
              24小时
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="登录方式设定">
        <a-descriptions-item label="账号密码">
          <a-checkbox v-model="config.normalLogin" />
        </a-descriptions-item>
        <a-descriptions-item label="短信验证码">
          <a-checkbox v-model="config.smsCodeLogin" @change="showTip" />
        </a-descriptions-item>
        <a-descriptions-item label="邮箱验证码">
          <a-checkbox v-model="config.emailCodeLogin" @change="showTip" />
        </a-descriptions-item>
        <a-descriptions-item label="微信公众号">
          <a-checkbox v-model="config.wxMpLogin" @change="showTip" />
        </a-descriptions-item>
        <a-descriptions-item label="微信小程序">
          <a-checkbox v-model="config.wxMaLogin" @change="showTip" />
        </a-descriptions-item>
        <a-descriptions-item label="自定义">
          <a-checkbox v-model="config.customLogin" />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>
<script>
import { getGlobalConfig, saveOrUpdateGlobalConfig } from '@/api/rbac/config'

export default {
  data () {
    return {
      id: null,
      config: {
        consoleCaptcha: false,
        captchaType: null,
        normalLogin: true,
        smsCodeLogin: false,
        emailCodeLogin: false,
        wxMpLogin: false,
        wxMaLogin: false,
        customLogin: false,
        ticketTimeout: 120,
        passwordErrorExpireTime: 5
      }
    }
  },
  created () {
    this.loadConfig()
  },
  methods: {
    loadConfig () {
      getGlobalConfig().then(resp => {
        this.id = resp.data.id
        this.config = JSON.parse(resp.data.keyValue)
      })
    },
    saveOrUpdateConfig () {
      this.$confirm({
        title: '确定对系统全局设置进行修改吗?',
        content: '一旦确定，错误的设定有可能使系统无法正常使用，请谨慎操作！！！',
        onOk: () => {
            const params = {
                id: this.id,
                keyValue: JSON.stringify(this.config)
            }
          saveOrUpdateGlobalConfig(params).then(resp => {
            this.$notification.info({
              message: '系统设置保存成功',
              description: '原Ticket有效期不变、下次ticket刷新将会按新设置延期'
            })
          })
        }
      })
    },
    showTip () {
      this.$notification.info({
        message: '提示',
        description: '当前仅实现了账号密码的登录方式，其他登录方式将会在后续支持'
      })
    }
  }
}
</script>
