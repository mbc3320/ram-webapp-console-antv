<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="字典编码">
                <a-input v-model="queryParam.keyCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8 || 24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="loadTableData">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" v-action:fun_system_config_add>新建</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
      >

        <span slot="action" slot-scope="text, record">
          <template>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)" v-action:fun_system_config_edit>编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除？" ok-text="是" cancel-text="否" @confirm="handleRemove(record)" v-action:fun_system_config_remove>
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
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

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '字典编码',
    dataIndex: 'keyCode'
  },
  {
    title: '字典值',
    dataIndex: 'keyValue'
  },
  {
    title: '字典简介',
    dataIndex: 'keyDesc'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    CreateForm
  },
  data () {
    this.columns = columns
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
        showTotal: total => `总共 ${total} 条数据`
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

              this.$message.info('修改成功')
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

              this.$message.info('新增成功')
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
        this.$message.error('删除失败')
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
