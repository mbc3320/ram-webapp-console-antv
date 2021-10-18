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
            <a-col :md="8" :sm="24">
              <a-form-item label="Ticket">
                <a-input v-model="queryParam.ticket" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="IP">
                <a-input v-model="queryParam.ipAddress" placeholder=""/>
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

        <span slot="loginType" slot-scope="loginType">
          <a-tag v-if="loginType === 'normalLogin'" color="green">
            帐号密码
          </a-tag>
          <a-tag v-else-if="loginType === 'smsCodeLogin'" color="orange">
            手机验证码
          </a-tag>
          <a-tag v-else-if="loginType === 'emailCodeLogin'" color="red">
            邮箱验证码
          </a-tag>
          <a-tag v-else-if="loginType === 'wxMpLogin'" color="cyan">
            微信公众号
          </a-tag>
          <a-tag v-else-if="loginType === 'wxMaLogin'" color="orange">
            微信小程序
          </a-tag>
          <a-tag v-else color="pink">
            其他
          </a-tag>
        </span>

        <span slot="timeExpire" slot-scope="text, record">
          <template>
            <a-alert :message="record.timeExpire" :type="new Date(Date.parse(record.timeExpire)) > new Date() ? 'success' : 'error'" />
          </template>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-popconfirm v-action:fun_system_ticket_kick placement="left" ok-text="是" cancel-text="否" @confirm="kickOut(record)">
              <template slot="title">
                <p>确定踢出此Ticket？成功后此用户需重新登录！请谨慎操作！</p>
              </template>
              <a v-if="new Date(Date.parse(record.timeExpire)) > new Date()">踢出</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { page, kick } from '@/api/rbac/ticket'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    ellipsis: true
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    ellipsis: true
  },
  {
    title: 'Ticket',
    dataIndex: 'ticket'
  },
  {
    title: '登录方式',
    dataIndex: 'loginType',
    scopedSlots: { customRender: 'loginType' }
  },
  {
    title: 'ip地址',
    dataIndex: 'ipAddress'
  },
  {
    title: '用户UA',
    dataIndex: 'userAgent',
    ellipsis: true
  },
  {
    title: '账号',
    dataIndex: 'account'
  },
  {
    title: 'Email',
    dataIndex: 'email'
  },
  {
    title: '昵称',
    dataIndex: 'nickName'
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber'
  },
  {
    title: '上次刷新时间',
    dataIndex: 'lastRefreshTime'
  },
  {
    title: '预估失效时间',
    dataIndex: 'timeExpire',
    scopedSlots: { customRender: 'timeExpire' }
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
    },
    kickOut (record) {
      kick({ id: record.id }).then(resp => {
        this.$message.info('踢出成功')
        this.loadTableData()
      })
    }
  }
}
</script>
