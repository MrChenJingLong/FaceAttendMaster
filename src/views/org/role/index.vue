<template>
  <div class="app-container">
    <el-form ref="multipleSelection" :inline="true" :model="role" label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="role.role_name" placeholder="Please input role name"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRoles">查询</el-button>
        <el-button type="success" @click="preAddRole">新增</el-button>
        <el-dialog :visible.sync="dialogOfAddRoleVisible" title="新增角色">
          <el-form :model="role">
            <el-form-item label="角色名称" label-width="120px">
              <el-input v-model="role.role_name" autocomplete="off"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAddRole">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </div>
        </el-dialog>
        <el-button type="danger" @click="delRoles">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleRolesTable" :data="roles" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="role_name" label="角色名称" width="120"/>
      <el-table-column prop="post-sel" label="岗位查询">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="findPostById(scope.row.role_id)">岗位查询</el-button>
          <el-dialog :visible.sync="dialogOfFindPostsVisible" title="岗位查询">
            <el-table :data="posts" tooltip-effect="dark" max-height="250" style="width: 100%">
              <el-table-column prop="depart_name" label="部门"/>
              <el-table-column prop="post_name" label="岗位"/>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogOfFindPostsVisible=false">取 消</el-button>
              <el-button type="primary" @click="dialogOfFindPostsVisible=false">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column prop="post-sel" label="节点查询">
        <template slot-scope="scope">
          <el-button type="text" size="small">节点查询</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="post-sel" label="修改">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="preUpdate(scope.row)">修改</el-button>
          <el-dialog :visible.sync="dialogOfUpdateRoleVisible" title="修改角色">
            <el-form :model="role">
              <el-form-item label="角色名称" label-width="120px">
                <el-input v-model="role.role_name" autocomplete="off"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelUpdateRole">取 消</el-button>
              <el-button type="primary" @click="updateRole">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column prop="post-sel" label="删除">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="delRoleById(scope.row.role_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;float: right;margin-right: 20px">
      <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background layout="prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </div>
  </div>
</template>

<script>
import { getRoles, addRole, delRole, delRoles, updateRole, findPostById } from '@/api/role'
export default {
  data() {
    return {
      role: {
        role_id: '',
        role_name: '',
        role_value: 0,
        role_sort: 0,
        page: 0,
        size: 0
      },
      post: {
        post_id: '',
        post_name: '',
        post_value: 0,
        post_sort: 0,
        page: 0,
        size: 0
      },
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      roles: [],
      dialogOfAddRoleVisible: false,
      dialogOfUpdateRoleVisible: false,
      dialogOfFindPostsVisible: false,
      posts: [],
      multipleSelection: []
    }
  },
  mounted() {
  },
  created() {
    this.getRoles()
  },
  methods: {
    getRoles() {
      this.role.page = this.current_page - 1
      this.role.size = this.page_rows
      console.log(this.role.page + '---' + this.role.size + '--' + this.role.role_id + '--' + this.role.role_name)
      getRoles(this.role).then(response => {
        console.log(response)
        if (response.result_code === 5000) {
          const data = response.content
          if (data.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1
            this.getRoles()
          } else {
            this.roles = []
            this.roles = data.content
            this.total_rows = data.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    resetRole() {
      this.role.role_id = ''
      this.role.role_name = ''
      this.role.role_sort = 0
      this.role.role_value = 0
    },
    preAddRole() {
      this.resetRole()
      this.dialogOfAddRoleVisible = true
    },
    cancelAddRole() {
      this.resetRole()
      this.dialogOfAddRoleVisible = false
    },
    addRole() {
      addRole(this.role).then(response => {
        if (response.result_code === 5000) {
          this.$message('添加成功!')
          // 重新加载数据
          this.resetRole()
          this.getRoles()
        } else {
          this.$message.error(response.result_desc)
        }
        this.dialogOfAddRoleVisible = false
      })
    },
    delRoleById(id) {
      delRole({ role_id: id }).then(response => {
        if (response.result_code === 5000) {
          this.$message('删除成功!')
          // 重新加载数据
          this.resetRole()
          this.getRoles()
        } else {
          this.$message.error('删除失败!')
        }
      })
    },
    delRoles() {
      var roleIds = []
      this.multipleSelection.forEach((role) => {
        roleIds.push(role.role_id)
      })
      if (roleIds.length === 0) {
        this.$message.warning('请选择角色删除!')
        return
      }
      delRoles({ role_ids: roleIds }).then(response => {
        if (response.result_code === 5000) {
          this.$message('批量删除成功!')
          // 重新加载数据
          this.resetRole()
          this.getRoles()
        } else {
          this.$message.error('批量删除失败!')
        }
      })
    },
    preUpdate(row) {
      this.role.role_id = row.role_id
      this.role.role_name = row.role_name
      this.role.role_sort = row.role_sort
      this.role.role_value = row.role_value
      this.dialogOfUpdateRoleVisible = true
    },
    updateRole() {
      updateRole(this.role).then(response => {
        if (response.result_code === 5000) {
          this.$message('更新成功!')
          // 重新加载数据
          this.resetRole()
          this.getRoles()
        } else {
          this.$message.error(response.result_desc)
        }
        this.dialogOfUpdateRoleVisible = false
      })
    },
    findPostById(roleId) {
      findPostById({ role_id: roleId }).then(response => {
        console.log(response)
        if (response.result_code === 5000) {
          this.posts = []
          this.posts = response.content.posts
          this.dialogOfFindPostsVisible = true
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    cancelUpdateRole() {
      this.resetRole()
      this.dialogOfUpdateRoleVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getRoles()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

