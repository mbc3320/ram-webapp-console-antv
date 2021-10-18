<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="权限类型">
                <a-select v-model="queryParam.permissionType" allowClear >
                  <a-select-option value="0">
                    接口
                  </a-select-option>
                  <a-select-option value="1">
                    菜单
                  </a-select-option>
                  <a-select-option value="2">
                    功能
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="权限编码">
                <a-input v-model="queryParam.permissionCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="权限名称">
                <a-input v-model="queryParam.permissionName" placeholder=""/>
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
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table
        ref="table"
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
      >
        <span slot="permissionType" slot-scope="text">
          <a-badge :status="text === 0 ? 'success' : text === 1 ? 'warning' : 'error'" :text="text === 0 ? '接口' : text === 1 ? '菜单' : '功能'" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除？" ok-text="是" cancel-text="否" @confirm="handleRemove(record)">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
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

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '权限类型',
    dataIndex: 'permissionType',
    scopedSlots: {
      customRender: 'permissionType'
    }
  },
  {
    title: '权限编码',
    dataIndex: 'permissionCode'
  },
  {
    title: '权限名称',
    dataIndex: 'permissionName'
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
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    return {
      columns,
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
        showTotal: total => `总共 ${total} 条数据`
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

              this.$message.info('修改成功')
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
        this.$message.error('删除失败')
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
