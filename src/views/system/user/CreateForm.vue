<template>
  <a-modal
    :title="$t('system.user.detail')"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-model-item v-if="form && form.id !== null" label="ID" prop="id">
          <a-input v-model="form.id" disabled />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.user.account')" prop="account">
          <a-input v-model="form.account" :disabled="form && form.id !=null" :placeholder="$t('system.user.account.placeholder')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.user.nickName')" prop="nickName">
          <a-input v-model="form.nickName" :placeholder="$t('system.user.nickName.placeholder')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.user.password')" prop="password" v-if="form && form.id == null">
          <a-input type="password" v-model="form.password" :placeholder="$t('system.user.password.placeholder')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.user.email')" prop="email">
          <a-input type="email" v-model="form.email" placeholder="ex:mobinchao@hotmail.com" />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.user.phoneNumber')" prop="phoneNumber">
          <a-input type="phone" v-model="form.phoneNumber" placeholder="ex: 13800138000" />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.user.accountState')" prop="accountState">
          <a-radio-group v-model="form.accountState">
            <a-radio-button :value="0">
              {{ $t('system.user.accountState.normal') }}
            </a-radio-button>
            <a-radio-button :value="1">
              {{ $t('system.user.accountState.locked') }}
            </a-radio-button>
            <a-radio-button :value="2">
              {{ $t('system.user.accountState.invalid') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, update } from '@/api/rbac/user'

export default {
  props: {
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      loading: false,
      rules: {
        account: [
          { required: true, message: this.$t('system.user.account.required'), trigger: 'blur' },
          { min: 5, max: 40, message: this.$t('system.user.account.length'), trigger: 'blur' }
        ],
        password: [{ required: true, message: this.$t('system.user.password.required'), trigger: 'change' },
          { min: 5, max: 40, pattern: '^\\w{6,36}$', message: this.$t('system.user.password.length'), trigger: 'blur' }
        ],
        email: [{ required: false, type: 'email', message: this.$t('system.user.email.valid'), trigger: 'change' }],
        phoneNumber: [
          { required: false, message: this.$t('system.user.phoneNumber.valid'), trigger: 'change' }
        ],
        nickName: [{ required: true, message: this.$t('system.user.nickName.required'), trigger: 'blur' },
        { min: 2, max: 40, message: this.$t('system.user.nickName.length'), trigger: 'blur' }]
      },
      form: {
        id: null,
        account: null,
        password: null,
        email: null,
        phoneNumber: null,
        nickName: null,
        accountState: 0
      }
    }
  },
  created () {
  },
  methods: {
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        const ruleFormRef = this.$refs.ruleForm
        console.log(this.form)
        if (valid) {
          if (this.form.id !== null) {
            // 修改 e.g.
            update(this.form).then(resp => {
              this.visible = false
              this.loading = false
              // 重置表单数据
              ruleFormRef.resetFields()
              this.$message.info(this.$t('global.save.ok'))
              this.$emit('listenToChildEvent')
            }).catch(e => {
              this.loading = false
            })
          } else {
            // 新增
            save(this.form).then(resp => {
              this.visible = false
              this.loading = false
              // 重置表单数据
              ruleFormRef.resetFields()
              this.$message.info(this.$t('global.save.ok'))
              this.$emit('listenToChildEvent')
            }).catch(e => {
              this.loading = false
            })
          }
        } else {
          this.loading = false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.form.id = null
    }
  }
}
</script>
