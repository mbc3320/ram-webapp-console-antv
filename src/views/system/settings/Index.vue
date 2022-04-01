<template>
  <div style="background:#ECECEC; padding:30px">
    <a-card :title="$t('system.setting.global')" :bordered="false" style="width: 100%;">
      <a slot="extra" href="#" @click="saveOrUpdateConfig">{{ $t('global.save') }}</a>
      <a-descriptions :title="$t('system.setting.loginCaptcha')">
        <a-descriptions-item label="">
          <a-radio-group v-model="config.consoleCaptcha">
            <a-radio-button :value="true">
              {{ $t('global.enable') }}
            </a-radio-button>
            <a-radio-button :value="false">
              {{ $t('global.disable') }}
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

                  <span>{{ meta.captchaMetaName === null ? $t('system.setting.loginCaptcha.name') : meta.captchaMetaName }}</span>
                  <a-divider type="vertical" />
                  <br>
                  <a-form-model-item
                    :label="$t('global.enable')"
                    :prop="'metaList.' + index + '.enable'"
                  >
                    <a-checkbox v-model="meta.enable" @change="captchaTypeEnableEvent(meta)" />
                  </a-form-model-item>
                  <a-form-model-item
                    :label="$t('global.service.name')"
                    :prop="'metaList.' + index + '.captchaServiceName'"
                    :rules="{
                      required: true,
                      message: $t('system.setting.loginCaptcha.serviceName.required'),
                      pattern: '^[a-z][a-zA-Z]*$',
                      trigger: 'blur',
                    }"
                  >
                    <a-input
                      v-model="meta.captchaServiceName"
                      :placeholder="$t('system.setting.loginCaptcha.serviceName.placeholder')"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    :label="$t('global.name')"
                    :prop="'metaList.' + index + '.captchaMetaName'"
                    :rules="{
                      required: true,
                      message: $t('system.setting.loginCaptcha.name.required'),
                      trigger: 'blur',
                    }"
                  >
                    <a-input
                      v-model="meta.captchaMetaName"
                      :placeholder="$t('system.setting.loginCaptcha.name.placeholder')"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    :label="$t('global.height')"
                    :prop="'metaList.' + index + '.width'"
                    :rules="{
                      required: true,
                      message: $t('system.setting.loginCaptcha.width.required'),
                      trigger: 'blur',
                    }"
                  >
                    <a-input-number
                      v-model="meta.width"
                      :min="20"
                      placeholder="100"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    :label="$t('global.width')"
                    :prop="'metaList.' + index + '.height'"
                    :rules="{
                      required: true,
                      message: $t('system.setting.loginCaptcha.height.required'),
                      trigger: 'blur',
                    }"
                  >
                    <a-input-number
                      v-model="meta.height"
                      :min="10"
                      placeholder="36"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    :label="$t('system.setting.loginCaptcha.config')"
                    :prop="'metaList.' + index + '.extJson'"
                  >
                    <a-input
                      v-model="meta.extJson"
                      :placeholder="$t('system.setting.loginCaptcha.extJson.placeholder')"
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
                  <a-icon type="plus" /> {{ $t('system.setting.addAnother') }}
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :title="$t('system.setting.time')">
        <a-descriptions-item :label="$t('system.setting.ticketExpire')">
          <a-radio-group v-model="config.ticketTimeout">
            <a-radio-button :value="120">
              2 {{ $t('global.unit.hours') }}
            </a-radio-button>
            <a-radio-button :value="300">
              5 {{ $t('global.unit.hours') }}
            </a-radio-button>
            <a-radio-button :value="1440">
              1 {{ $t('global.unit.days') }}
            </a-radio-button>
            <a-radio-button :value="10080">
              7 {{ $t('global.unit.days') }}
            </a-radio-button>
            <a-radio-button :value="43200">
              30 {{ $t('global.unit.days') }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.setting.passwordErrEventExpire')">
          <a-radio-group v-model="config.passwordErrorExpireTime">
            <a-radio-button :value="1">
              1 {{ $t('global.unit.hours') }}
            </a-radio-button>
            <a-radio-button :value="5">
              5 {{ $t('global.unit.hours') }}
            </a-radio-button>
            <a-radio-button :value="24">
              24 {{ $t('global.unit.hours') }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :title="$t('system.setting.loginType.setting')" :column="1">
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

                <span>{{ meta.typeName === null ? $t('system.setting.loginType') : meta.typeName }}</span>
                <a-divider type="vertical" />
                <br>
                <a-form-model-item
                  :label="$t('global.enable')"
                  :prop="'typeList.' + index + '.enable'"
                >
                  <a-checkbox v-model="meta.enable" />
                </a-form-model-item>
                <a-form-model-item
                  :label="$t('system.setting.loginType.code')"
                  :prop="'typeList.' + index + '.loginType'"
                  :rules="{
                    required: true,
                    message: $t('system.setting.loginType.code.required'),
                    pattern: '^[a-z][a-zA-Z]*$',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="meta.loginType"
                    :placeholder="$t('system.setting.loginType.code.placeholder')"
                  />
                </a-form-model-item>

                <a-form-model-item
                  :label="$t('global.name')"
                  :prop="'typeList.' + index + '.typeName'"
                  :rules="{
                    required: true,
                    message: $t('system.setting.loginType.name.required'),
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="meta.typeName"
                    :placeholder="$t('system.setting.loginType.name.placeholder')"
                  />
                </a-form-model-item>

                <a-form-model-item
                  :label="$t('system.setting.loginType.factoryName')"
                  :prop="'typeList.' + index + '.loginFactoryServiceName'"
                  :rules="{
                    required: true,
                    message: $t('system.setting.loginType.factoryName.required'),
                    pattern: '^[a-z][a-zA-Z]*$',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="meta.loginFactoryServiceName"
                    :placeholder="$t('system.setting.loginType.factoryName.placeholder')"
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
                <a-icon type="plus" /> {{ $t('system.setting.addAnother') }}
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
            title: this.$t('system.setting.saveOrUpdateDialogTitle'),
            content: this.$t('system.setting.saveOrUpdateDialogContent'),
            onOk: () => {
              this.config.captchaMetaList = this.captchaMetaForm.metaList
              this.config.loginServiceMetaList = this.loginTypeForm.typeList
                const params = {
                    id: this.id,
                    keyValue: JSON.stringify(this.config)
                }
              saveOrUpdateGlobalConfig(params).then(resp => {
                this.$notification.info({
                  message: this.$t('global.success'),
                  description: this.$t('system.setting.saveOrUpdate.result')
                })
              })
            }
          })
        } else {
          this.$message.error(this.$t('system.setting.saveOrUpdate.validErr'))
        }
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
        this.$message.warning(this.$t('system.setting.captchaType.warning'))
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
