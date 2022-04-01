<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://ram-framework.tech" target="_blank">https://ram-framework.tech</a>
      <a href="https://www.github.com/mbc3320/ram-rbac" target="_blank">Github</a>
      <a href="https://www.github.com/mbc3320/" target="_blank">@mbc3320</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
