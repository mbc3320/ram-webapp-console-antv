<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色编码">
                <a-input v-model="queryParam.roleCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名称">
                <a-input v-model="queryParam.roleName" placeholder=""/>
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
        size="default"
        rowKey="id"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
      >

        <span slot="roleDefault" slot-scope="text">
          <a-badge :status="text ? 'success' : 'warning'" :text="text ? '是' : '否'" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleGrant(record)">授权</a>
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
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <a-modal
        ref="grantedDialog"
        title="角色授权"
        :maskClosable="false"
        v-model="showAuthDialog"
      >
        <template slot="footer">
          <a-button key="back" @click="onAuthDialogClose">
            关闭
          </a-button>
          <a-button key="submit" type="danger" :loading="grantedDialogLoading" @click="doGranted">
            授权
          </a-button>
        </template>

        <a-tabs v-if="currentRecordId" :activeKey="grantDialogTabKey" @change="swithGrantedPanel">
          <!-- <a-tab-pane key="0" tab="用户授权">
            <p>用户授权</p>
          </a-tab-pane> -->
          <a-tab-pane key="1" tab="接口授权">
            <PermissionGrant ref="apiGrantRef" :roleId="currentRecordId" :type="0" @listenToChildEvent="grantedDone" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="菜单授权">
            <PermissionGrant ref="menuGrantRef" :roleId="currentRecordId" :type="1" @listenToChildEvent="grantedDone" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="功能授权">
            <PermissionGrant ref="funGrantRef" :roleId="currentRecordId" :type="2" @listenToChildEvent="grantedDone" />
          </a-tab-pane>
        </a-tabs>
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { page, save, update, get, remove } from '@/api/rbac/role'
import PermissionGrant from '@/components/rbac/PermissionGrant.vue'

import CreateForm from './CreateForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName'
  },
  {
    title: '默认角色',
    dataIndex: 'roleDefault',
    scopedSlots: { customRender: 'roleDefault' }
  },
  {
    title: '角色简介',
    dataIndex: 'roleDesc'
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
    PermissionGrant
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
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
      currentRecordId: null,
      grantDialogTabKey: '1',
      grantedDialogLoading: false,
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
        this.$refs.table.refresh()
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
    handleGrant (record) {
      this.showAuthDialog = true
      this.currentRecordId = record.id
    },
    doGranted () {
      this.$confirm({
        title: '确定变更授权信息?',
        content: '一旦确定，将即时更新系统所有涉及授权的用户的权限信息',
        onOk: () => {
          this.grantedDialogLoading = true
          switch (this.grantDialogTabKey) {
            case '1':
              this.$refs.apiGrantRef.permissionGrant()
              break
              case '2':
                this.$refs.menuGrantRef.permissionGrant()
                break
                case '3':
                  this.$refs.funGrantRef.permissionGrant()
                  break
          }
        }
      })
    },
    onAuthDialogClose () {
      this.showAuthDialog = false
      this.currentRecordId = null
      this.grantDialogTabKey = '1'
    },
    swithGrantedPanel (activeKey) {
      this.grantDialogTabKey = activeKey
    },
    grantedDone () {
      this.grantedDialogLoading = false
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
