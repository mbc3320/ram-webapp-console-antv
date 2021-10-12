<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="账号">
                <a-input v-model="queryParam.account" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="邮箱">
                <a-input v-model="queryParam.email" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.phoneNumber" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="昵称">
                <a-input v-model="queryParam.nickName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8 || 24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
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
        size="default"
        rowKey="id"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        @change="tableChange"
      >

        <span slot="accountState" slot-scope="accountState">
          <a-tag v-if="accountState === 0" color="green">
            正常
          </a-tag>
          <a-tag v-if="accountState === 1" color="orange">
            锁定
          </a-tag>
          <a-tag v-if="accountState === 2" color="red">
            注销
          </a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleGranted(record)">授权</a>
            <a-divider type="vertical" />
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
        @listenToChildEvent="handleDone"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <a-modal
        ref="grantedDialog"
        title="角色授权"
        :maskClosable="false"
        v-model="showAuthDialog"
        :footer="null"
        width="60%"
        @cancel="handleGrantClose"
      >
        <RoleGrantPanel v-if="currentRecord !== null" :userId="currentRecord.id" />
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { page, get, remove } from '@/api/rbac/user'

import CreateForm from './CreateForm'
import RoleGrantPanel from './RoleGrantPanel.vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '账号',
    dataIndex: 'account'
  },
  {
    title: '昵称',
    dataIndex: 'nickName'
  },
  {
    title: '账号状态',
    dataIndex: 'accountState',
    scopedSlots: { customRender: 'accountState' }
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber'
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
    CreateForm,
    RoleGrantPanel
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
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
      showAuthDialog: false,
      currentRecord: null

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
      const createModal = this.$refs.createModal
      createModal.visible = true
      this.resetCreateForm()
    },
    handleEdit (record) {
      this.resetCreateForm()
      const createModal = this.$refs.createModal
      createModal.visible = true
      createModal.loading = true
      get({ id: record.id }).then(resp => {
        this.$refs.createModal.form = { ...resp.data }
        createModal.loading = false
      })
    },
    handleOk () {
      const createModal = this.$refs.createModal
      createModal.loading = true
      createModal.onSubmit()
    },
    handleDone () {
      // 刷新表格
      this.loadTableData()
    },
    handleCancel () {
      const createModal = this.$refs.createModal
      createModal.visible = false
    },
    handleRemove (record) {
      remove({ id: record.id }).then(resp => {
        // 刷新表格
        this.loadTableData()
        this.$message.info(resp.msg)
      }).catch(e => {
        this.$refs.table.refresh()
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
    resetCreateForm () {
      this.$nextTick(() => {
        const createModal = this.$refs.createModal
        createModal.resetForm()
      })
    },
    handleGranted (record) {
      this.currentRecord = record
      this.showAuthDialog = true
    },
    handleGrantClose () {
      this.currentRecord = null
      this.showAuthDialog = false
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
