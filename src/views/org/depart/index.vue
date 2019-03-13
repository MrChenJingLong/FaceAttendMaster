<template>
  <div class="app-container">
    <div class="depart-list">
      <div style="margin-bottom: 20px">
        <el-button type="primary" size="mini" plain @click="preAddDepart">增加</el-button>
        <el-dialog :visible.sync="addDepartVisible" title="添加部门">
          <el-form :model="depart">
            <el-form-item label="部门名称" label-width="120px">
              <el-input v-model="depart.depart_name" auto-complete="off"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAddDepart">取 消</el-button>
            <el-button type="primary" @click="addDepart">确 定</el-button>
          </div>
        </el-dialog>
        <el-button type="primary" size="mini" plain @click="preUpdateDepart">修改</el-button>
        <el-dialog :visible.sync="updateDepartVisible" title="修改部门">
          <el-form :model="depart">
            <el-form-item label="部门名称" label-width="120px">
              <el-input v-model="depart.depart_name" auto-complete="on"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelUpdateDepart">取 消</el-button>
            <el-button type="primary" @click="updateDepart">确 定</el-button>
          </div>
        </el-dialog>
        <el-button type="primary" size="mini" plain @click="deleteDepartById">删除</el-button>
      </div>
      <div>
        <el-tree
          :data="genFullDeparts"
          :props="departProps"
          :highlight-current="true"
          accordion
          @node-click="handleNodeClick"/>
      </div>
    </div>
    <div style="float:left;width: 1px;height: 500px; background: darkgray;"/>
    <div class="depart-detail">
      <div style="margin-bottom: 20px;margin-left: 20px">
        <el-button type="primary" size="mini" plain @click="addPostVisible=true">新增岗位</el-button>
        <el-dialog :visible.sync="addPostVisible" title="新增岗位">
          <el-form :model="post">
            <el-form-item label="岗位名称" label-width="120px">
              <el-input v-model="post.post_name" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="角色" label-width="120px">
              <el-select v-model="post.role_id" filterable placeholder="请选择">
                <el-option v-for="role in roles" :key="role.role_id" :label="role.role_name" :value="role.role_id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位权值" label-width="120px">
              <el-input-number v-model="post.post_value" :min="0" :max="10" label="值越大，权值越大" @change="handleChange"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAddPost">取 消</el-button>
            <el-button type="primary" @click="addPostByDepart">确 定</el-button>
          </div>
        </el-dialog>
        <el-button type="primary" size="mini" plain @click="deletePostBitch">批量删除</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-table ref="multiplePostsTable" :data="posts" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="post_name" label="岗位名称" width="120"/>
          <el-table-column prop="post-update" label="修改">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="preUpdatePost(scope.row)">修改</el-button>
              <el-dialog :visible.sync="updatePostVisible" title="修改岗位">
                <el-form :model="post">
                  <el-form-item label="岗位名称" label-width="120px">
                    <el-input v-model="post.post_name" auto-complete="on"/>
                  </el-form-item>
                  <el-form-item label="角色" label-width="120px">
                    <el-select v-model="post.role_id" filterable placeholder="请选择">
                      <el-option v-for="role in roles" :key="role.role_id" :label="role.role_name" :value="role.role_id"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="岗位权值" label-width="120px">
                    <el-input-number v-model="post.post_value" :min="0" :max="10" label="值越大，权值越大" @change="handleChange"/>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelUpdatePost">取 消</el-button>
                  <el-button type="primary" @click="updatePost">确 定</el-button>
                </div>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column prop="post-delete" label="删除">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deletePostById(scope.row.post_id)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="allot-users" label="分配人员">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="preAllotUser(scope.row)">分配人员</el-button>
              <el-dialog :visible.sync="allotUserVisible" title="分配人员">
                <el-form :model="userQuery" :inline="true">
                  <el-form-item label="部门">
                    <el-cascader
                      :value="selectDeparts"
                      :options="genFullDeparts"
                      :props="departCascaderProps"
                      placeholder="试试搜索：部门"
                      filterable
                      change-on-select
                      @change="departSelecedChange"
                    />
                  </el-form-item>
                  <el-form-item label="岗位">
                    <el-select v-model="userQuery.post_id" filterable placeholder="请选择">
                      <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name" :value="post.post_id"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="入职时间">
                    <el-date-picker
                      v-model="userQuery.hire_date"
                      type="date"
                      placeholder="选择日期"/>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model="userQuery.user_name" auto-complete="off"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getUsers">查询</el-button>
                  </el-form-item>
                </el-form>
                <el-transfer
                  v-loading="isLoading"
                  v-model="checked_users"
                  :props="userProps"
                  :data="query_users"
                  :titles="['未分配人员数据','已分配人员数据']"
                  @change="handleAllotUserChange"
                />
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelAllotUsers">取 消</el-button>
                  <el-button type="primary" @click="allotUsers">确 定</el-button>
                </div>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column prop="allot-users" label="权限设置">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="preSetGrant(scope.row)">权限设置</el-button>
              <el-dialog :visible.sync="setGrantVisible" title="权限设置">
                <el-tree :ref="'grantTree' + current_post.post_id" :data="menus" :default-expand-all="true" :props="menuProps" :check-strictly="true" highlight-current show-checkbox node-key="menu_id"/>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelAllotMenus">取 消</el-button>
                  <el-button type="primary" @click="allotMenus">确 定</el-button>
                </div>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px;float: right;margin-right: 20px">
        <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background layout="prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDeparts, addDepart, updateDepart, deleteDepart } from '@/api/depart'
import { addPost, updatePost, getPosts, deletePost, deletePosts, allotUsers, allotGrant, getPostsByDepartId } from '@/api/post'
import { findRoles } from '@/api/role'
import { getAllMenu, getMenusByPost } from '@/api/menu'
import { getUsers } from '@/api/user'
export default {
  data() {
    return {
      depart: {
        depart_id: null,
        parent_id: null,
        depart_name: null,
        tag: null,
        level: 0,
        is_private: 0,
        sort: 0,
        flag: 0
      },
      post: {
        post_id: null,
        depart_id: null,
        role_id: null,
        post_name: null,
        post_value: 0,
        post_sort: 0,
        page: 0,
        size: 0
      },
      userQuery: {
        card_num: null,
        user_name: null,
        depart_id: null,
        post_id: null,
        role_id: null,
        hire_date: null
      },
      selectDeparts: [],
      departs: [],
      departProps: {
        label: 'depart_name',
        children: 'children'
      },
      departCascaderProps: {
        value: 'depart_id',
        label: 'depart_name',
        children: 'children'
      },
      posts: [],
      current_depart: {
        depart_id: null,
        parent_id: null,
        depart_name: null,
        tag: null,
        level: 0,
        is_private: 0,
        sort: 0,
        flag: 0
      },
      multiplePostSelection: [],
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      addDepartVisible: false,
      updateDepartVisible: false,
      addPostVisible: false,
      updatePostVisible: false,
      setGrantVisible: false,
      allotUserVisible: false,
      roles: [],
      menus: [],
      default_checked_keys: [],
      current_post: {
        post_id: null
      },
      menuProps: {
        children: 'children',
        label: 'name'
      },
      query_users: [],
      userProps: {
        key: 'user_id',
        label: 'user_name'
      },
      checked_users: [],
      isLoading: true,
      hasPostsOfDepart: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    genFullDeparts() {
      var fullDepartList = []
      if (this.departs == null || this.departs.length <= 0) {
        return fullDepartList
      }
      this.departs.forEach(departDto => {
        if (departDto.parent_id == null) {
          var depart = {}
          depart.depart_id = departDto.depart_id
          depart.depart_name = departDto.depart_name
          depart.children = this.genChildrenDeparts(departDto.depart_id)
          fullDepartList.push(depart)
        }
      })
      return fullDepartList
    }
  },
  created() {
    this.getAllDepart()
    this.getAllRole()
    this.getAllMenu()
  },
  methods: {
    genChildrenDeparts(departId) {
      var fullDepartList = []
      if (this.departs == null || this.departs.length <= 0) {
        return fullDepartList
      }
      this.departs.forEach(departDto => {
        if (departId === departDto.parent_id) {
          var depart = {}
          depart.depart_id = departDto.depart_id
          depart.depart_name = departDto.depart_name
          depart.children = this.genChildrenDeparts(departDto.depart_id)
          fullDepartList.push(depart)
        }
      })
      return fullDepartList
    },
    getAllDepart() {
      getDeparts({}).then(response => {
        if (response.result_code === 5000) {
          const data = response.content
          this.departs = []
          this.departs = data.departs
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getAllMenu() {
      getAllMenu(this.token).then(response => {
        const data = response.content
        this.menus = data.menus
      })
    },
    getAllRole() {
      findRoles({}).then(response => {
        if (response.result_code === 5000) {
          const data = response.content
          this.roles = []
          this.roles = data.roles
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getMenusByPost(postId) {
      getMenusByPost({ post_id: postId }).then(response => {
        if (response.result_code === 5000) {
          const data = response.content
          this.$nextTick(() => {
            this.$refs['grantTree' + postId].setCheckedKeys(data.keys)
          })
        } else {
          this.$message.error(response.result_desc)
        }
        this.isLoading = false
      })
    },
    clearDepart() {
      this.depart.depart_id = null
      this.depart.parent_id = null
      this.depart.depart_name = null
      this.depart.tag = null
      this.depart.level = 0
      this.depart.is_private = 0
      this.depart.sort = 0
      this.depart.flag = 0
    },
    clearPost() {
      this.post.post_id = null
      this.post.depart_id = null
      this.post.role_id = null
      this.post.post_name = null
      this.post.post_value = 0
      this.post.post_sort = 0
    },
    clearUserQuery() {
      this.userQuery.card_num = null
      this.userQuery.user_name = null
      this.userQuery.depart_id = null
      this.userQuery.post_id = null
      this.userQuery.role_id = null
    },
    preAddDepart() {
      this.clearDepart()
      this.addDepartVisible = true
    },
    cancelAddDepart() {
      this.clearDepart()
      this.addDepartVisible = false
    },
    addDepart() {
      if (this.current_depart.depart_id !== null) {
        this.depart.parent_id = this.current_depart.depart_id
      }
      addDepart(this.depart).then(response => {
        if (response.result_code === 5000) {
          this.getAllDepart()
          this.$message('添加成功!')
        } else {
          this.$message.error(response.result_desc)
        }
        this.clearDepart()
        this.addDepartVisible = false
      })
    },
    preUpdateDepart() {
      if (this.current_depart.depart_id === null) {
        this.$message.warning('请选择部门')
        return
      }
      this.depart = this.current_depart
      this.updateDepartVisible = true
    },
    cancelUpdateDepart() {
      this.clearDepart()
      this.updateDepartVisible = false
    },
    updateDepart() {
      updateDepart(this.depart).then(response => {
        if (response.result_code === 5000) {
          this.getAllDepart()
          this.$message('跟新成功!')
        } else {
          this.$message.error(response.result_desc)
        }
        this.clearDepart()
        this.updateDepartVisible = false
      })
    },
    deleteDepartById() {
      if (this.current_depart.depart_id === null) {
        this.$message.warning('请选择部门')
        return
      }
      deleteDepart(this.current_depart).then(response => {
        if (response.result_code === 5000) {
          this.getAllDepart()
          this.$message('删除成功!')
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getPostsByDepart(departId) {
      this.clearPost()
      this.post.page = this.current_page - 1
      this.post.size = this.page_rows
      this.post.depart_id = departId
      getPosts(this.post).then(response => {
        if (response.result_code === 5000) {
          const data = response.content.posts
          if (data.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1
            this.getPostsByDepart(departId)
          } else {
            this.posts = []
            this.posts = data.content
            this.total_rows = data.totalElements
            this.clearPost()
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getAllPostsByDepart(departId) {
      getPostsByDepartId({ depart_id: departId }).then(response => {
        if (response.result_code === 5000) {
          this.hasPostsOfDepart = response.content.posts
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    handleNodeClick(data) {
      this.current_depart = data
      this.getPostsByDepart(this.current_depart.depart_id)
    },
    cancelAddPost() {
      this.clearPost()
      this.addPostVisible = false
    },
    addPostByDepart() {
      if (this.current_depart.depart_id == null) {
        this.$message.warning('请选择部门')
        return
      }
      this.post.depart_id = this.current_depart.depart_id
      addPost(this.post).then(response => {
        if (response.result_code === 5000) {
          this.getPostsByDepart(this.current_depart.depart_id)
          this.$message.success('添加成功!')
        } else {
          this.$message.error(response.result_desc)
        }
        this.addPostVisible = false
      })
    },
    preUpdatePost(row) {
      this.post.post_id = row.post_id
      this.post.post_name = row.post_name
      this.post.role_id = row.role_id
      this.post.depart_id = row.depart_id
      this.post.post_value = row.post_value
      this.post.post_sort = row.post_sort
      this.updatePostVisible = true
    },
    cancelUpdatePost() {
      this.clearPost()
      this.updatePostVisible = false
    },
    updatePost() {
      if (this.post.post_id === null) {
        this.$message.warning('请选择岗位')
        return
      }
      updatePost(this.post).then(response => {
        if (response.result_code === 5000) {
          this.getPostsByDepart(this.current_depart.depart_id)
          this.$message.success('更新成功!')
        } else {
          this.$message.error(response.result_desc)
        }
        this.updatePostVisible = false
      })
    },
    deletePostById(postId) {
      deletePost({ post_id: postId }).then(response => {
        if (response.result_code === 5000) {
          this.getPostsByDepart(this.current_depart.depart_id)
          this.$message.success('删除成功!')
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getUsers() {
      console.log(this.userQuery)
      getUsers(this.userQuery).then(response => {
        if (response.result_code === 5000) {
          this.query_users = response.content.users
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    setCheckedUsers(postId) {
      getUsers({ post_id: postId }).then(response => {
        if (response.result_code === 5000) {
          this.checked_users = []
          response.content.users.forEach(user => {
            this.checked_users.push(user.user_id)
          })
        } else {
          this.$message.error(response.result_desc)
        }
        this.isLoading = false
      })
    },
    preAllotUser(row) {
      this.allotUserVisible = true
      this.current_post = row
      this.clearUserQuery()
      this.getUsers()
      this.setCheckedUsers(this.current_post.post_id)
    },
    deletePostBitch() {
      if (this.multiplePostSelection.length <= 0) {
        this.$message.warning('请选择要删除的岗位')
        return
      }
      var postIds = []
      this.multiplePostSelection.forEach((post) => {
        postIds.push(post.post_id)
      })
      deletePosts({ post_ids: postIds }).then(response => {
        if (response.result_code === 5000) {
          this.getPostsByDepart(this.current_depart.depart_id)
          this.$message('批量删除成功!')
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    preSetGrant(row) {
      this.isLoading = true
      this.setGrantVisible = true
      this.current_post = row
      this.getMenusByPost(this.current_post.post_id)
    },
    cancelAllotMenus() {
      this.isLoading = false
      this.setGrantVisible = false
    },
    allotMenus() {
      this.isLoading = true
      var checked_keys = this.$refs['grantTree' + this.current_post.post_id].getCheckedKeys()
      allotGrant({ post_id: this.current_post.post_id, menu_ids: checked_keys }).then(response => {
        if (response.result_code === 5000) {
          this.$message.success('权限设置成功!')
        } else {
          this.$message.error(response.result_desc)
        }
        this.isLoading = false
        this.setGrantVisible = false
      })
    },
    handleSelectionChange(val) {
      this.multiplePostSelection = val
    },
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getPostsByDepart(this.current_depart.depart_id)
    },
    handleChange(value) {
    },
    departSelecedChange(value) {
      console.log(value)
      if (value == null) {
        return
      }
      console.log(value[value.length - 1])
      this.userQuery.depart_id = value[value.length - 1]
      this.getAllPostsByDepart(value[value.length - 1])
    },
    handleAllotUserChange(value, direction, movedKeys) {
      this.checked_users = value
    },
    cancelAllotUsers() {
      this.checked_users = []
      this.isLoading = false
      this.allotUserVisible = false
    },
    allotUsers() {
      this.isLoading = true
      allotUsers({ post_id: this.current_post.post_id, user_ids: this.checked_users }).then(response => {
        if (response.result_code === 5000) {
          this.$message.success('人员分配成功!')
        } else {
          this.$message.error(response.result_desc)
        }
        this.isLoading = false
        this.checked_users = []
        this.allotUserVisible = false
      })
    }
  }
}
</script>

<style scoped>
  .app-container .depart-list{
    width: 20%;
    min-height: 100%;
    float: left;
  }
  .app-container .depart-detail{
    width: 70%;
    min-height: 100%;
    float: left;
  }
</style>

