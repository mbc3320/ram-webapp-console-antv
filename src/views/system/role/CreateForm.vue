<template>
  <a-modal
    title="角色信息"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="角色编码">
          <a-input v-decorator="['roleCode', {rules: [{required: true, min: 4, message: '请输入角色编码'}]}]" :disabled="model && model.id > 0" />
        </a-form-item>
        <a-form-item label="角色名称">
          <a-input v-decorator="['roleName', {rules: [{required: true, min: 2, message: '请输入角色名称'}]}]" />
        </a-form-item>
        <a-form-item label="默认角色">
          <a-checkbox v-decorator="['roleDefault', {valuePropName: 'checked', initialValue: false}]" />
        </a-form-item>
        <a-form-item label="角色简介">
          <a-textarea
            placeholder="请输入角色简介"
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
