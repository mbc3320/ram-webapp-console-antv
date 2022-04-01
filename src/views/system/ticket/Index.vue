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
                <a-button type="primary" @click="loadTableData">{{ $t('global.query') }}</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">{{ $t('global.reset') }}</a-button>
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
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
        bordered
      >

        <a-table-column key="id" title="ID" data-index="id" :ellipsis="true" />
        <a-table-column key="userId" :title="$t('system.ticket.userId')" data-index="userId" :ellipsis="true" />
        <a-table-column key="ticket" :title="$t('system.ticket')" data-index="ticket" />
        <a-table-column key="loginType" :title="$t('system.ticket.loginType')" data-index="loginType" :width="120">
          <template slot-scope="text">
            <a-tag v-if="text === 'normalLogin'" color="green">
              {{ $t('system.ticket.loginType.password') }}
            </a-tag>
            <a-tag v-else-if="text === 'smsCodeLogin'" color="orange">
              {{ $t('system.ticket.loginType.smsCode') }}
            </a-tag>
            <a-tag v-else-if="text === 'emailCodeLogin'" color="red">
              {{ $t('system.ticket.loginType.emailCode') }}
            </a-tag>
            <a-tag v-else-if="text === 'wxMpLogin'" color="cyan">
              {{ $t('system.ticket.loginType.wechatMp') }}
            </a-tag>
            <a-tag v-else-if="text === 'wxMaLogin'" color="orange">
              {{ $t('system.ticket.loginType.wechatMa') }}
            </a-tag>
            <a-tag v-else color="pink">
              {{ $t('system.ticket.loginType.others') }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="ipAddress" :title="$t('system.ticket.ipAddress')" data-index="ipAddress" />
        <a-table-column key="userAgent" :title="$t('system.ticket.userAgent')" data-index="userAgent" :ellipsis="true" :width="120" />
        <a-table-column key="account" :title="$t('system.user.account')" data-index="account" />
        <a-table-column key="nickName" :title="$t('system.user.nickname')" data-index="nickName" />
        <a-table-column key="email" :title="$t('system.user.email')" data-index="email" />
        <a-table-column key="phoneNumber" :title="$t('system.user.phoneNumber')" data-index="phoneNumber" />
        <a-table-column key="lastRefreshTime" :title="$t('system.ticket.lastRefreshTime')" data-index="lastRefreshTime" :width="120" />
        <a-table-column key="timeExpire" :title="$t('system.ticket.timeExpire')" data-index="timeExpire" :width="120">
          <template slot-scope="text, record">
            <a-alert :message="record.timeExpire" :type="new Date(Date.parse(record.timeExpire)) > new Date() ? 'success' : 'error'" />
          </template>
        </a-table-column>
        <a-table-column key="createTime" :title="$t('global.createTime')" data-index="createTime" :width="120" />
        <a-table-column key="updateTime" :title="$t('global.updateTime')" data-index="updateTime" :width="120" />
        <a-table-column key="action" :title="$t('global.action')">
          <template slot-scope="text, record">
            <a-popconfirm v-action:fun_system_ticket_kick placement="left" :ok-text="$t('global.yes')" :cancel-text="$t('global.no')" @confirm="kickOut(record)">
              <template slot="title">
                <p>{{ $t('system.ticket.expire.tips') }}</p>
              </template>
              <a v-if="new Date(Date.parse(record.timeExpire)) > new Date()">{{ $t('system.ticket.expire') }}</a>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { page, kick } from '@/api/rbac/ticket'

export default {
  name: 'TableList',
  components: {
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
