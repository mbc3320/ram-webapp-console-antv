<template>
  <a-modal
    :title="$t('system.config.keyInfo')"
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
        <a-form-item :label="$t('system.config.keyCode')">
          <a-input
            v-decorator="['keyCode', {rules: [{required: true, min: 4, message: () => this.$t('system.config.keyCodeInputPlaceholder')}]}]"
            :disabled="model && model.id > 0"
            :placeholder="$t('system.config.keyCodeInputPlaceholder')"
          />
        </a-form-item>
        <a-form-item :label="$t('system.config.keyValue')">
          <a-textarea
            :rows="4"
            v-decorator="['keyValue', {rules: [{required: true, min: 2, message: ()=> this.$t('system.config.keyValueInputPlaceholder')}]}]"
            :placeholder="$t('system.config.keyValueInputPlaceholder')"
          />
        </a-form-item>
        <a-form-item :label="$t('system.config.keyDesc')">
          <a-textarea
            :placeholder="$t('system.config.keyDescInputPlaceholder')"
            :rows="4"
            v-decorator="['keyDesc', {}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'keyCode', 'keyValue', 'keyDesc']

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
  },
  methods: {
  }
}
</script>
