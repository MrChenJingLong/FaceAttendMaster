<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item v-for="menu in menus" :key="menu.url" :item="menu" :base-path="menu.url"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenus } from '@/api/menu'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      menus: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'token'
    ]),
    routes() {
      return this.$router.options.routes
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      getMenus(this.token).then(response => {
        const data = response.content
        this.menus = data.menus
      })
    }
  }
}
</script>
