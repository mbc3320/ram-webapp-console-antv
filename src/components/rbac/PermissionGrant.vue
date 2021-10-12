<template>
  <div>
    <a-tree
      v-model="checkedKeys"
      checkable
      :expanded-keys="expandedKeys"
      :selected-keys="selectedKeys"
      :tree-data="permissinTree"
      checkStrictly
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
    />
  </div>
</template>
<script>
import { findAuthPermissionTree, permissionGrant } from '@/api/rbac/role'

export default {
  name: 'PermissionGrant',
  props: {
    roleId: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      permissinTree: [],
      autoExpandParent: true
    }
  },
  watch: {
  },
  created () {
    this.$nextTick(() => {
      this.findAuthPermissionTree()
    })
  },
  methods: {
    findAuthPermissionTree () {
      findAuthPermissionTree({ roleId: this.roleId, permissionType: this.type }).then(resp => {
        this.permissinTree = []
        this.permissinTree.push(resp.data)
        this.checkedKeys = resp.data.checkedList
      })
    },
    permissionGrant () {
      permissionGrant({ roleId: this.roleId, permissionType: this.type, permissionIds: this.checkedKeys.checked }).then(resp => {
        this.$notification.open({
          message: resp.code,
          description: resp.msg,
          icon: <a-icon type="smile" style="color: #108ee9" />
        })
        this.$emit('listenToChildEvent')
      }).catch(() => {
        this.$emit('listenToChildEvent')
      })
    },
    onExpand (expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    }
  }
}
</script>
