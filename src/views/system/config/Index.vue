<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.config.keyCode')">
                <a-input v-model="queryParam.keyCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8 || 24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="loadTableData">{{ $t('global.query') }}</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">{{ $t('global.reset') }}</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" v-action:fun_system_config_add>{{ $t('global.add') }}</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
      >

        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="keyCode" :title="$t('system.config.keyCode')" data-index="keyCode" />
        <a-table-column key="keyValue" :title="$t('system.config.keyValue')" data-index="keyValue" />
        <a-table-column key="keyDesc" :title="$t('system.config.keyDesc')" data-index="keyDesc" />
        <a-table-column key="createTime" :title="$t('global.createTime')" data-index="createTime" />
        <a-table-column key="updateTime" :title="$t('global.updateTime')" data-index="updateTime" />
        <a-table-column key="action" :title="$t('global.action')">
          <template slot-scope="text, record">
            <a-divider type="vertical" />
            <a @click="handleEdit(record)" v-action:fun_system_config_edit>{{ $t('global.edit') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm :title="$t('global.areYouSure')" :ok-text="$t('global.yes')" :cancel-text="$t('global.no')" @confirm="handleRemove(record)" v-action:fun_system_config_remove>
              <a href="#">{{ $t('global.remove') }}</a>
            </a-popconfirm>
          </template>
        </a-table-column>

      </a-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { page, save, update, get, remove } from '@/api/rbac/config'

import CreateForm from './CreateForm'

export default {
  name: 'TableList',
  components: {
    CreateForm
  },
  data () {
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {
        keyCode: null
      },
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        total: 0,
        showTotal: total => this.$t('global.pagination.total', { total: total })
      },
      selectedRowKeys: [],
      selectedRows: [],
      loading: false
    }
  },
  filters: {

  },
  computed: {
  },
  created () {
    this.loadTableData()
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.confirmLoading = true
      get({ id: record.id }).then(resp => {
        this.mdl = { ...resp.data }
        this.confirmLoading = false
      })
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            // 修改 e.g.
            update(values).then(resp => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.loadTableData()

              this.$message.info(this.$t('global.save.ok'))
            }).catch(e => {
              this.confirmLoading = false
            })
          } else {
            // 新增
            save(values).then(resp => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.loadTableData()

              this.$message.info(this.$t('global.save.ok'))
            }).catch(e => {
              this.confirmLoading = false
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleRemove (record) {
      remove({ id: record.id }).then(resp => {
        // 刷新表格
        this.loadTableData()
        this.$message.info(resp.msg)
      }).catch(e => {
        this.loadTableData()
        this.$message.error(this.$t('global.requestFailed'))
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    loadTableData () {
      const params = Object.assign(this.pagination, { params: this.queryParam })
      page(params).then(res => {
        this.data = res.data.records
        this.pagination.total = res.data.total
      })
    },
    tableChange (pagination, filters, sorter) {
      if (pagination.pageSize !== this.pagination.pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pagination.pageSize
      } else {
        this.pagination.current = pagination.current
      }
      this.loadTableData()
    }
  }
}
</script>
