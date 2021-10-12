<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色编码">
              <a-input v-model="queryParam.roleCode" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.roleName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8 || 24" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="grantRoleTable"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :pageSize="5"
      showPagination="auto">
      <span slot="roleDefault" slot-scope="text">
        <a-badge :status="text ? 'success' : 'warning'" :text="text ? '是' : '否'" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a-popconfirm
            v-if="!record.checked"
            title="确定授权用户角色？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleGrant(record)"
          >
            <a href="#">授权</a>
          </a-popconfirm>
          <a-popconfirm
            v-if="record.checked"
            title="确定撤销用户角色授权？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleRevoke(record)"
          >
            <a href="#">撤权</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
  </div>
</template>
<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { authRolePage, grant, revoke } from '@/api/rbac/role'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    ellipsis: true
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
    title: '是否授权',
    dataIndex: 'checked',
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
    this.columns = columns
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
        this.$message.info('授权成功')
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
        this.$message.info('撤权成功')
        // 刷新表格
        this.$refs.grantRoleTable.refresh()
      })
    }
  }
}
</script>
