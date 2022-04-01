<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.role.roleCode')">
                <a-input v-model="queryParam.roleCode" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.role.roleName')">
                <a-input v-model="queryParam.roleName" placeholder=""/>
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
        size="default"
        rowKey="id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
      >

        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="roleCode" :title="$t('system.role.roleCode')" data-index="roleCode" />
        <a-table-column key="roleName" :title="$t('system.role.roleName')" data-index="roleName" />
        <a-table-column key="roleDefault" :title="$t('system.role.roleDefault')" data-index="roleDefault">
          <template slot-scope="text">
            <a-badge :status="text ? 'success' : 'warning'" :text="text ? this.$t('global.yes') : this.$t('global.no')" />
          </template>
        </a-table-column>
        <a-table-column key="roleDesc" :title="$t('system.role.roleDesc')" data-index="roleDesc" />
        <a-table-column key="createTime" :title="$t('global.createTime')" data-index="createTime" />
        <a-table-column key="updateTime" :title="$t('global.updateTime')" data-index="updateTime" />
        <a-table-column key="action" :title="$t('global.action')">
          <template slot-scope="text, record">
            <a @click="handleGrant(record)">{{ $t('system.role.auth') }}</a>
            <a-divider type="vertical" />
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
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <a-modal
        ref="grantedDialog"
        :title="$t('system.role.roleGrant')"
        :maskClosable="false"
        v-model="showAuthDialog"
      >
        <template slot="footer">
          <a-button key="back" @click="onAuthDialogClose">
            {{ $t('global.close') }}
          </a-button>
          <a-button key="submit" type="danger" :loading="grantedDialogLoading" @click="doGranted">
            {{ $t('system.role.auth') }}
          </a-button>
        </template>

        <a-tabs v-if="currentRecordId" :activeKey="grantDialogTabKey" @change="swithGrantedPanel">
          <!-- <a-tab-pane key="0" tab="用户授权">
            <p>用户授权</p>
          </a-tab-pane> -->
          <a-tab-pane key="1" :tab="$t('system.role.apiGrant')">
            <PermissionGrant ref="apiGrantRef" :roleId="currentRecordId" :type="0" @listenToChildEvent="grantedDone" />
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('system.role.menuGrant')">
            <PermissionGrant ref="menuGrantRef" :roleId="currentRecordId" :type="1" @listenToChildEvent="grantedDone" />
          </a-tab-pane>
          <a-tab-pane key="3" :tab="$t('system.role.functionGrant')">
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

export default {
  name: 'TableList',
  components: {
    CreateForm,
    PermissionGrant
  },
  data () {
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
        showTotal: total => this.$t('global.pagination.total', { total: total })
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
        this.$refs.table.refresh()
        this.$message.info(resp.msg)
      }).catch(e => {
        this.$refs.table.refresh()
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
    handleGrant (record) {
      this.showAuthDialog = true
      this.currentRecordId = record.id
    },
    doGranted () {
      this.$confirm({
        title: this.$t('system.role.doGrant.title'),
        content: this.$t('system.role.doGrant.content'),
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
