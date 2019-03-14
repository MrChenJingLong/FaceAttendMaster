import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/org',
    component: Layout,
    redirect: '/org/user',
    name: '组织结构',
    meta: { title: '组织结构', icon: 'example' },
    children: [
      {
        path: 'user',
        name: '人员管理',
        component: () => import('@/views/org/user/index'),
        meta: { title: '人员管理', icon: 'form' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/org/role/index'),
        meta: { title: '角色管理', icon: 'form' }
      },
      {
        path: 'depart',
        name: '部门管理',
        component: () => import('@/views/org/depart/index'),
        meta: { title: '部门管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/attend',
    component: Layout,
    redirect: '/attend/time',
    name: '我的考勤',
    meta: { title: '我的考勤', icon: 'my_attend' },
    children: [
      {
        path: 'time',
        name: '期间考勤',
        component: () => import('@/views/attend/time/index'),
        meta: { title: '期间考勤', icon: 'attend_time' }
      },
      {
        path: 'day',
        name: '考勤日历',
        component: () => import('@/views/attend/day/index'),
        meta: { title: '考勤日历', icon: 'attend_day' }
      },
      {
        path: 'month',
        name: '我的月报',
        component: () => import('@/views/attend/month/index'),
        meta: { title: '我的月报', icon: 'attend_month' }
      }
    ]
  },
  {
    path: '/attend_mgr',
    component: Layout,
    redirect: '/attend_mgr/classes',
    name: '考勤管理',
    meta: { title: '考勤管理', icon: 'example' },
    children: [
      {
        path: 'classes',
        name: '班次管理',
        component: () => import('@/views/attend_mgr/classes/index'),
        meta: { title: '班次管理', icon: 'form' }
      },
      {
        path: 'clock',
        name: '时段管理',
        component: () => import('@/views/attend_mgr/clock/index'),
        meta: { title: '时段管理', icon: 'form' }
      },
      {
        path: 'schedule',
        name: '智能排班',
        component: () => import('@/views/attend_mgr/schedule/index'),
        meta: { title: '智能排班', icon: 'form' }
      }
    ]
  },
  {
    path: '/terminal',
    component: Layout,
    redirect: '/terminal/device',
    name: '终端管理',
    meta: { title: '终端管理', icon: 'example' },
    children: [
      {
        path: 'device',
        name: '终端设备管理',
        component: () => import('@/views/terminal/device/index'),
        meta: { title: '终端设备管理', icon: 'form' }
      },
      {
        path: 'param',
        name: '终端参数管理',
        component: () => import('@/views/terminal/param/index'),
        meta: { title: '终端参数管理', icon: 'form' }
      },
      {
        path: 'upgrade',
        name: '终端升级管理',
        component: () => import('@/views/terminal/upgrade/index'),
        meta: { title: '终端升级管理', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
