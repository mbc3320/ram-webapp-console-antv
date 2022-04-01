<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item :label="$t('system.role.roleCode')">
              <a-input v-model="queryParam.roleCode" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item :label="$t('system.role.roleName')">
              <a-input v-model="queryParam.roleName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8 || 24" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">{{ $t('global.query') }}</a-button>
              <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">{{ $t('global.reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="grantRoleTable"
      size="default"
      rowKey="id"
      :data="loadData"
      :pageSize="5"
      bordered
      showPagination="auto">

      <a-table-column key="id" title="ID" data-index="id" />
      <a-table-column key="roleCode" :title="$t('system.role.roleCode')" data-index="roleCode" />
      <a-table-column key="roleName" :title="$t('system.role.roleName')" data-index="roleName" :width="110" />
      <a-table-column key="roleDefault" :title="$t('system.role.roleDefault')" data-index="roleDefault">
        <template slot-scope="text">
          <a-badge :status="text ? 'success' : 'warning'" :text="text ? $t('global.yes') : $t('global.no')" />
        </template>
      </a-table-column>
      <a-table-column key="checked" :title="$t('system.role.auth.checked')" data-index="checked">
        <template slot-scope="text">
          <a-badge :status="text ? 'success' : 'warning'" :text="text ? $t('global.yes') : $t('global.no')" />
        </template>
      </a-table-column>
      <a-table-column key="roleDesc" :title="$t('system.role.roleDesc')" data-index="roleDesc" :width="160" />
      <a-table-column key="createTime" :title="$t('global.createTime')" data-index="createTime" :width="120" />
      <a-table-column key="updateTime" :title="$t('global.updateTime')" data-index="updateTime" :width="120" />
      <a-table-column key="action" :title="$t('global.action')">
        <template slot-scope="text, record">
          <a-popconfirm
            v-if="!record.checked"
            :title="$t('system.role.userAuth')"
            :ok-text="$t('global.yes')"
            :cancel-text="$t('global.no')"
            @confirm="handleGrant(record)"
          >
            <a href="#">{{ $t('system.role.auth') }}</a>
          </a-popconfirm>
          <a-popconfirm
            v-if="record.checked"
            :title="$t('system.role.userRevoke')"
            :ok-text="$t('global.yes')"
            :cancel-text="$t('global.no')"
            @confirm="handleRevoke(record)"
          >
            <a href="#">{{ $t('system.role.revoke') }}</a>
          </a-popconfirm>
        </template>
      </a-table-column>
    </s-table>
  </div>
</template>
<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { authRolePage, grant, revoke } from '@/api/rbac/role'

export default {
  name: 'RoleGrantTableList',
  props: {
    userId: {
      type: String,
      required: true,
      default: null
    }
  },
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {
        roleCode: null,
        roleName: null,
        userId: this.userId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, { params: this.queryParam })
        // console.log('loadData request parameters:', requestParameters)
        return authRolePage(requestParameters).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      showAuthDialog: false,
      currentRecordId: null,
      grantDialogTabKey: '0',
      grantedDialogLoading: false
    }
  },
  filters: {},
  computed: {},
  methods: {
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
      const params = {
        userId: this.userId,
        roleId: record.id
      }
      grant(params).then(() => {
        this.$message.info(this.$t('system.role.userAuth.success'))
        // 刷新表格
        this.$refs.grantRoleTable.refresh()
      })
    },
    handleRevoke (record) {
      const params = {
        userId: this.userId,
        roleId: record.id
      }
      revoke(params).then(() => {
        this.$message.info(this.$t('system.role.userRevoke.success'))
        // 刷新表格
        this.$refs.grantRoleTable.refresh()
      })
    }
  }
}
</script>
