<template>
  <a-modal
    :title="$t('system.role.detail')"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item :label="$t('system.role.roleCode')">
          <a-input
            v-decorator="['roleCode', {rules: [{required: true, min: 4, message: this.$t('system.role.roleCode.required')}]}]"
            :disabled="model && model.id > 0"
            :placeholder="$t('system.role.roleCode.placeholder')"
          />
        </a-form-item>
        <a-form-item :label="$t('system.role.roleName')">
          <a-input
            v-decorator="['roleName', {rules: [{required: true, min: 2, message: this.$t('system.role.roleName.required')}]}]"
            :placeholder="$t('system.role.roleName.placeholder')"
          />
        </a-form-item>
        <a-form-item :label="$t('system.role.roleDefault')">
          <a-checkbox v-decorator="['roleDefault', {valuePropName: 'checked', initialValue: false}]" />
          <span style="color: red;">&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('system.role.roleDefault.alt') }}</span>
        </a-form-item>
        <a-form-item :label="$t('system.role.roleDesc')">
          <a-textarea
            :placeholder="$t('system.role.roleDesc.placeholder')"
            :rows="4"
            v-decorator="['roleDesc', {}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'roleCode', 'roleName', 'roleDefault', 'roleDesc']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
