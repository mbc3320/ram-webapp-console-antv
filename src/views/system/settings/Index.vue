<template>
  <div style="background:#ECECEC; padding:30px">
    <a-card title="系统全局设定" :bordered="false" style="width: 100%;">
      <a slot="extra" href="#" @click="saveOrUpdateConfig">保存设置</a>
      <a-descriptions title="登录图形校验码">
        <a-descriptions-item label="">
          <a-radio-group v-model="config.consoleCaptcha">
            <a-radio-button :value="true">
              启用
            </a-radio-button>
            <a-radio-button :value="false">
              禁用
            </a-radio-button>
            <br><br>
            <a-form-model
              v-if="config.consoleCaptcha"
              ref="captchaMetaForm"
              layout="inline"
              :model="captchaMetaForm"
              v-bind="formItemLayoutWithOutLabel"
            >
              <a-row
                :gutter="24"
                v-for="(meta, index) in captchaMetaForm.metaList"
                :key="'captchaType_' + index"
              >
                <a-col :span="24">

                  <span>{{ meta.captchaMetaName === null ? '验证码类型名称' : meta.captchaMetaName }}</span>
                  <a-divider type="vertical" />
                  <br>
                  <a-form-model-item
                    label="启用"
                    :prop="'metaList.' + index + '.enable'"
                  >
                    <a-checkbox v-model="meta.enable" @change="captchaTypeEnableEvent(meta)" />
                  </a-form-model-item>
                  <a-form-model-item
                    label="服务名"
                    :prop="'metaList.' + index + '.captchaServiceName'"
                    :rules="{
                      required: true,
                      message: '验证码服务名必填且只能为字母组合(首字母小写)',
                      pattern: '^[a-z][a-zA-Z]*$',
                      trigger: 'blur',
                    }"
                  >
                    <a-input
                      v-model="meta.captchaServiceName"
                      placeholder="请输入验证码服务名称"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    label="名称"
                    :prop="'metaList.' + index + '.captchaMetaName'"
                    :rules="{
                      required: true,
                      message: '验证码类型名称必填',
                      trigger: 'blur',
                    }"
                  >
                    <a-input
                      v-model="meta.captchaMetaName"
                      placeholder="请输入验证码类型名称"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    label="宽度"
                    :prop="'metaList.' + index + '.width'"
                    :rules="{
                      required: true,
                      message: '验证码宽度必填',
                      trigger: 'blur',
                    }"
                  >
                    <a-input-number
                      v-model="meta.width"
                      :min="20"
                      placeholder="请输入验证码宽度"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    label="高度"
                    :prop="'metaList.' + index + '.height'"
                    :rules="{
                      required: true,
                      message: '验证码高度必填',
                      trigger: 'blur',
                    }"
                  >
                    <a-input-number
                      v-model="meta.height"
                      :min="10"
                      placeholder="请输入验证码高度"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    label="验证码配置"
                    :prop="'metaList.' + index + '.extJson'"
                  >
                    <a-input
                      v-model="meta.extJson"
                      placeholder="请输入其他配置信息"
                    >
                      <a-icon
                        slot="suffix"
                        v-if="index !== 0"
                        class="dynamic-delete-button"
                        type="minus-circle-o"
                        @click="removeCaptchaType(meta)"
                      />
                    </a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-form-model-item v-bind="formItemLayoutWithOutLabel">
                <a-button type="dashed" @click="addCaptchaType">
                  <a-icon type="plus" /> 添加验证码方式
                </a-button>
              </a-form-model-item>
            </a-form-model>
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
      <a-descriptions title="登录方式设定" :column="1">
        <a-descriptions-item label="">
          <a-form-model
            ref="loginTypeForm"
            layout="inline"
            :model="loginTypeForm"
            v-bind="formItemLayoutWithOutLabel"
          >
            <a-row
              :gutter="24"
              v-for="(meta, index) in loginTypeForm.typeList"
              :key="'loginType_' + index"
            >
              <a-col :span="24">

                <span>{{ meta.typeName === null ? '登录方式' : meta.typeName }}</span>
                <a-divider type="vertical" />
                <br>
                <a-form-model-item
                  label="启用"
                  :prop="'typeList.' + index + '.enable'"
                >
                  <a-checkbox v-model="meta.enable" />
                </a-form-model-item>
                <a-form-model-item
                  label="编码"
                  :prop="'typeList.' + index + '.loginType'"
                  :rules="{
                    required: true,
                    message: '登录方式编码必填且只能为字母组合(首字母小写)',
                    pattern: '^[a-z][a-zA-Z]*$',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="meta.loginType"
                    placeholder="请输入登录方式编码"
                  />
                </a-form-model-item>

                <a-form-model-item
                  label="名称"
                  :prop="'typeList.' + index + '.typeName'"
                  :rules="{
                    required: true,
                    message: '登录方式名称必填',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="meta.typeName"
                    placeholder="请输入登录方式名称"
                  />
                </a-form-model-item>

                <a-form-model-item
                  label="工厂服务名"
                  :prop="'typeList.' + index + '.loginFactoryServiceName'"
                  :rules="{
                    required: true,
                    message: '登录方式工厂服务名必填且只能为字母组合(首字母小写)',
                    pattern: '^[a-z][a-zA-Z]*$',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="meta.loginFactoryServiceName"
                    placeholder="请输入登录方式工厂服务名"
                  >
                    <a-icon
                      slot="suffix"
                      v-if="index !== 0"
                      class="dynamic-delete-button"
                      type="minus-circle-o"
                      @click="removeLoginType(meta)"
                    />
                  </a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="dashed" @click="addLoginType">
                <a-icon type="plus" /> 添加登录方式
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>
<script>
import { getGlobalConfig, saveOrUpdateGlobalConfig } from '@/api/rbac/config'

// const loginServiceMetaList = [{
//         loginType: 'normalLogin',
//         typeName: '账号密码',
//         enable: true,
//         loginFactoryServiceName: 'normalLoginFactory'
//       }, {
//         loginType: 'smsCodeLogin',
//         typeName: '短信验证码',
//         enable: false,
//         loginFactoryServiceName: 'smsCodeLoginFactory'
//       }, {
//         loginType: 'emailCodeLogin',
//         typeName: '邮箱验证码',
//         enable: false,
//         loginFactoryServiceName: 'emailCodeLoginFactory'
//       }, {
//         loginType: 'wxMpLogin',
//         typeName: '微信公众号',
//         enable: false,
//         loginFactoryServiceName: 'wxMpLoginFactory'
//       }, {
//         loginType: 'wxMaLogin',
//         typeName: '微信小程序',
//         enable: false,
//         loginFactoryServiceName: 'wxMaLoginFactory'
//       }]
export default {
  data () {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      id: null,
      config: {
        consoleCaptcha: false,
        captchaMetaList: [],
        loginServiceMetaList: [],
        ticketTimeout: 120,
        passwordErrorExpireTime: 5
      },
      loginTypeForm: {
        typeList: []
      },
      captchaMetaForm: {
        metaList: []
      }
    }
  },
  watch: {
    'config.consoleCaptcha' (val) {
      if (val) {
        let hasEnable = false
        this.captchaMetaForm.metaList.forEach(meta => {
          if (meta.enable) {
            hasEnable = true
          }
        })
        if (!hasEnable) {
          this.captchaMetaForm.metaList[0].enable = true
        }
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
        this.captchaMetaForm.metaList = this.config.captchaMetaList
        this.loginTypeForm.typeList = this.config.loginServiceMetaList
      })
    },
    saveOrUpdateConfig () {
      this.$refs['loginTypeForm'].validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定对系统全局设置进行修改吗?',
            content: '一旦确定，错误的设定有可能使系统无法正常使用，请谨慎操作！！！',
            onOk: () => {
              this.config.captchaMetaList = this.captchaMetaForm.metaList
              this.config.loginServiceMetaList = this.loginTypeForm.typeList
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
        } else {
          this.$message.error('请填写表单必填内容，再保存')
        }
      })
    },
    showTip () {
      this.$notification.info({
        message: '提示',
        description: '当前仅实现了账号密码的登录方式，其他登录方式将会在后续支持'
      })
    },
    removeLoginType (item) {
      const index = this.loginTypeForm.typeList.indexOf(item)
      if (index !== -1) {
        this.loginTypeForm.typeList.splice(index, 1)
      }
    },
    addLoginType () {
      this.loginTypeForm.typeList.push({
        loginType: null,
        typeName: null,
        enable: false,
        loginFactoryServiceName: null
      })
    },
    removeCaptchaType (item) {
      const index = this.captchaMetaForm.metaList.indexOf(item)
      if (index !== -1) {
        this.captchaMetaForm.metaList.splice(index, 1)
      }
    },
    addCaptchaType () {
      this.captchaMetaForm.metaList.push({
        enable: false,
        captchaServiceName: null,
        captchaMetaName: null,
        width: 100,
        height: 36,
        extJson: null
      })
    },
    captchaTypeEnableEvent (meta) {
      if (!meta.enable) {
        this.$message.warning('必须保留一种方式或者通过禁用关闭功能')
        meta.enable = true
      } else {
        this.captchaMetaForm.metaList.forEach(otherMeta => {
          if (meta.captchaServiceName !== otherMeta.name) {
            otherMeta.enable = false
            meta.enable = true
          }
        })
      }
    }
  }
}
</script>
