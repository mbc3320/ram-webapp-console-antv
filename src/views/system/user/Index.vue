<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.user.account')">
                <a-input v-model="queryParam.account" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.user.email')">
                <a-input v-model="queryParam.email" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.user.phoneNumber')">
                <a-input v-model="queryParam.phoneNumber" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('system.user.nickname')">
                <a-input v-model="queryParam.nickname" placeholder=""/>
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
        bordered
      >

        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="account" :title="$t('system.user.account')" data-index="account" />
        <a-table-column key="nickName" :title="$t('system.user.nickname')" data-index="nickName" />
        <a-table-column key="accountState" :title="$t('system.user.accountState')" data-index="accountState">
          <template slot-scope="text">
            <a-tag v-if="text === 0" color="green">
              {{ $t('system.user.accountState.normal') }}
            </a-tag>
            <a-tag v-if="text === 1" color="orange">
              {{ $t('system.user.accountState.locked') }}
            </a-tag>
            <a-tag v-if="text === 2" color="red">
              {{ $t('system.user.accountState.invalid') }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="email" :title="$t('system.user.email')" data-index="email" />
        <a-table-column key="phoneNumber" :title="$t('system.user.phoneNumber')" data-index="phoneNumber" />
        <a-table-column key="createTime" :title="$t('global.createTime')" data-index="createTime" :width="120" />
        <a-table-column key="updateTime" :title="$t('global.updateTime')" data-index="updateTime" :width="120" />
        <a-table-column key="action" :title="$t('global.action')">
          <template slot-scope="text, record">
            <a @click="handleGranted(record)">{{ $t('system.role.auth') }}</a>
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
        @listenToChildEvent="handleDone"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <a-modal
        ref="grantedDialog"
        :title="$t('system.role.roleGrant')"
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

export default {
  name: 'TableList',
  components: {
    CreateForm,
    RoleGrantPanel
  },
  data () {
    return {
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
      currentRecord: null,
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
