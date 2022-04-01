<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.permission.permissionType')">
                <a-select v-model="queryParam.permissionType" allowClear >
                  <a-select-option value="0">
                    {{ $t('system.permission.api') }}
                  </a-select-option>
                  <a-select-option value="1">
                    {{ $t('system.permission.menu') }}
                  </a-select-option>
                  <a-select-option value="2">
                    {{ $t('system.permission.function') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.permission.permissionCode')">
                <a-input v-model="queryParam.permissionCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.permission.permissionName')">
                <a-input v-model="queryParam.permissionName" placeholder=""/>
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
        <a-button type="primary" icon="plus" @click="handleAdd">{{ $t('global.add') }}</a-button>
      </div>
      <a-table
        ref="table"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
      >

        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="permissionType" :title="$t('system.permission.permissionType')" data-index="permissionType">
          <template slot-scope="text">
            <a-badge
              :status="text === 0
                ? 'success' : text === 1
                  ? 'warning' : 'error'"
              :text="text === 0
                ? $t('system.permission.api') : text === 1
                  ? $t('system.permission.menu') : $t('system.permission.function')"
            />
          </template>
        </a-table-column>
        <a-table-column key="permissionCode" :title="$t('system.permission.permissionCode')" data-index="permissionCode" />
        <a-table-column key="permissionName" :title="$t('system.permission.permissionName')" data-index="permissionName" />
        <a-table-column key="createTime" :title="$t('global.createTime')" data-index="createTime" />
        <a-table-column key="updateTime" :title="$t('global.updateTime')" data-index="updateTime" />
        <a-table-column key="action" :title="$t('global.action')">
          <template slot-scope="text, record">
            <a @click="handleEdit(record)">{{ $t('global.edit') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm :title="$t('global.areYouSure')" :ok-text="$t('global.yes')" :cancel-text="$t('global.no')" @confirm="handleRemove(record)">
              <a href="#">{{ $t('global.remove') }}</a>
            </a-popconfirm>
          </template>
        </a-table-column>

      </a-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        @cancel="handleCancel"
        @ok="handleOk"
      />

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { page, save, update, get, remove } from '@/api/rbac/permission'

import CreateForm from './CreateForm'

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    return {
      // create model
      visible: false,
      confirmLoading: false,
      // 查询参数
      queryParam: {
        permissionType: null,
        permissionCode: null,
        permissionName: null
      },
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        total: 0,
        showTotal: total => this.$t('global.pagination.total', { total: total })
      },
      loading: false
    }
  },
  filters: {

  },
  created () {
    this.loadTableData()
  },
  methods: {
    handleAdd () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.createModal.$refs.customForm.resetFields()
        this.$refs.createModal.treeData = []
      })
    },
    handleEdit (record) {
      this.visible = true
      this.confirmLoading = true
      get({ id: record.id }).then(resp => {
        this.$refs.createModal.initData(resp.data)
        this.confirmLoading = false
      })
    },
    handleOk () {
      const form = this.$refs.createModal.$refs.customForm
      this.confirmLoading = true
      form.validate(valid => {
        if (valid) {
          if (form.model.id > 0) {
            // 修改 e.g.
            update(form.model).then(resp => {
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
            save(form.model).then(resp => {
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
      const form = this.$refs.createModal.$refs.customForm
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
    loadTableData () {
      this.loading = true
      const params = Object.assign(this.pagination, { params: this.queryParam })
      page(params).then(res => {
        this.data = res.data.records
        this.pagination.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
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
