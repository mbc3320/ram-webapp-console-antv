<template>
  <a-modal
    title="用户信息"
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
        <a-form-model-item v-if="form && form.id !== null" label="主键ID" prop="id">
          <a-input v-model="form.id" disabled />
        </a-form-model-item>
        <a-form-model-item label="账号" prop="account">
          <a-input v-model="form.account" :disabled="form && form.id !=null" placeholder="请输入账号" />
        </a-form-model-item>
        <a-form-model-item label="昵称" prop="nickName">
          <a-input v-model="form.nickName" placeholder="请输入昵称" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password" v-if="form && form.id == null">
          <a-input type="password" v-model="form.password" placeholder="请输入密码" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input type="email" v-model="form.email" placeholder="请输入邮箱" />
        </a-form-model-item>
        <a-form-model-item label="手机号码" prop="phoneNumber">
          <a-input type="phone" v-model="form.phoneNumber" placeholder="请输入手机号" />
        </a-form-model-item>
        <a-form-model-item label="账号状态" prop="accountState">
          <a-radio-group v-model="form.accountState">
            <a-radio-button :value="0">
              正常
            </a-radio-button>
            <a-radio-button :value="1">
              锁定
            </a-radio-button>
            <a-radio-button :value="2">
              注销
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
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 40, message: '长度介于5~40之间', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' },
          { min: 5, max: 40, pattern: '^\\w{6,36}$', message: '长度介于5~40之间, 或不满足复杂度要求', trigger: 'blur' }
        ],
        email: [{ required: false, type: 'email', message: '请输入邮箱', trigger: 'change' }],
        phoneNumber: [
          { required: false, message: '请输入电话号码', trigger: 'change' }
        ],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 40, message: '长度介于2~40之间', trigger: 'blur' }]
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
              this.$message.info('修改成功')
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
              this.$message.info('新增成功')
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
