<template>
  <div v-if="item.children" class="menu-wrapper">

    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children)">
      <app-link :to="resolvePath(onlyOneChild.url)">
        <el-menu-item :index="resolvePath(onlyOneChild.url)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.icon||item.icon" :title="onlyOneChild.name" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(item.url)">
      <template slot="title">
        <item :icon="item.icon" :title="item.name" />
      </template>

      <template v-for="child in item.children">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.url"
          :base-path="resolvePath(child.url)"
          class="nest-menu" />
        <app-link v-else :to="resolvePath(child.url)" :key="child.name">
          <el-menu-item :index="resolvePath(child.url)">
            <item :icon="child.icon" :title="child.name" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter(item => {
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    }
  }
}
</script>
