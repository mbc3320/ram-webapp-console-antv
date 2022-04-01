<template>
  <a-modal
    :title="$t('system.permission.permissionDetail')"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form-model ref="customForm" :model="formData" :rules="formRules" v-bind="formLayout">
        <!-- 检查是否有 id, ID存在是修改。其他是新增，新增不显示主键ID -->
        <a-form-model-item v-show="formData && formData.id !== null" label="ID" prop="id">
          <a-input v-model="formData.id" disabled />
        </a-form-model-item>
        <a-form-model-item ref="permissionType" :label="$t('system.permission.permissionType')" prop="permissionType">
          <a-radio-group v-model="formData.permissionType" @change="permissionTypeChange" :disabled="formData && formData.id !== null">
            <a-radio-button :value="0">
              {{ $t('system.permission.api') }}
            </a-radio-button>
            <a-radio-button :value="1">
              {{ $t('system.permission.menu') }}
            </a-radio-button>
            <a-radio-button :value="2">
              {{ $t('system.permission.function') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('system.permission.parentNode')" prop="pid">
          <a-tree-select
            ref="simpleTree"
            v-model="formData.pid"
            tree-data-simple-mode
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :placeholder="$t('system.permission.parentNode.placeholder')"
            @change="parentNodeChange"
            :disabled="formData && formData.id !== null"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('system.permission.permissionName')" prop="permissionName">
          <a-input v-model="formData.permissionName" :placeholder="$t('system.permission.permissionName.placeholder')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('system.permission.permissionCode')" prop="permissionCode">
          <a-input v-model="formData.permissionCode" :disabled="formData && formData.id !== null" :placeholder="$t('system.permission.permissionCode.placeholder')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'
import { simpleTree } from '@/api/rbac/permission'

// 表单字段
// const fields = ['id', 'permissionCode', 'permissionName', 'pid', 'permissionType']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
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
      treeData: [],
      listParam: {
        permissionType: null
      },
      formRules: {
        permissionType: [
          { required: true, message: this.$t('system.permission.permissionType.required') }
        ],
        pid: [{ required: true, message: this.$t('system.permission.parentNode.required') }],
        permissionName: [
          { required: true, min: 2, message: this.$t('system.permission.permissionName.required') }
        ],
        permissionCode: [
          { required: true, min: 2, message: this.$t('system.permission.permissionCode.required') }
        ]
      },
      formData: {
        id: null,
        permissionType: null,
        permissionCode: null,
        permissionName: null,
        pid: null
      }
    }
  },
  created () {
  },
  methods: {
    loadList (permissionType) {
      const params = {
        permissionType: permissionType
      }
      simpleTree(params).then(resp => {
        this.treeData = resp.data
      })
    },
    permissionTypeChange () {
      this.formData.pid = null
      this.formData.permissionCode = null
      this.loadList(this.formData.permissionType)
    },
    initData (formData) {
      this.loadList(formData.permissionType)
      this.formData = formData
    },
    parentNodeChange (value, label, extra) {
      this.formData.permissionCode = extra.triggerNode.dataRef.extra + '_'
    }
  }
}
</script>
