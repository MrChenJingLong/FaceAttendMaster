<template>
  <div class="app-container">
    <div class="depart-list">
      <div>
        <el-tree
          :data="genFullDeparts"
          :props="departProps"
          :highlight-current="true"
          accordion
          @node-click="handleNodeClick"/>
      </div>
    </div>
    <div style="float:left;width: 2px;height: 700px; background: darkgray;"/>
    <div class="depart-detail">
      <div style="margin-bottom: 20px;margin-left: 20px">
        <el-form :inline="true" :model="userQuery" size="mini">
          <el-form-item label="工号">
            <el-input v-model="userQuery.card_num" placeholder="工号" size="mini"/>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="userQuery.user_name" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="岗位">
            <el-select v-model="userQuery.post_id" filterable placeholder="请选择" style="width: 100px">
              <el-option label="" value=""/>
              <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name" :value="post.post_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="userQuery.role_id" filterable placeholder="请选择" style="width: 100px">
              <el-option label="" value=""/>
              <el-option v-for="role in allRoles" :key="role.role_id" :label="role.role_name" :value="role.role_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="userQuery.user_sex" placeholder="请选择" style="width: 100px">
              <el-option label="" value=""/>
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否注册">
            <el-select v-model="userQuery.reg_state" placeholder="请选择" style="width: 100px">
              <el-option label="" value=""/>
              <el-option label="已注册" value="1"/>
              <el-option label="未注册" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否在职">
            <el-select v-model="userQuery.work_state" placeholder="请选择" style="width: 100px">
              <el-option label="" value=""/>
              <el-option label="在职" value="1"/>
              <el-option label="离职" value="0"/>
              <el-option label="休长假" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUsersByDepartId(current_depart.depart_id)">查询</el-button>
            <el-button type="primary" @click="preAddUserInfo()">新增</el-button>
            <el-button type="primary" @click="resetPwdSelectedUsers(current_depart.depart_id)">批量密码重置</el-button>
            <el-button type="primary" @click="deleteSelectedUsers()">批量删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-left: 20px">
        <el-table ref="multipleUsersTable" :data="query_users" size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="user_name" label="姓名" />
          <el-table-column prop="user_sex" label="性别" />
          <el-table-column prop="card_num" label="工号" width="120px"/>
          <el-table-column
            prop="work_state"
            label="是否在职"
            width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.work_state === 1 ? 'primary' : 'warning'"
                disable-transitions>{{ isWorking(scope.row.work_state) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="reg_time"
            label="是否注册"
            width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.reg_state === 1 ? 'primary' : 'warning'"
                disable-transitions>{{ isRegister(scope.row.reg_state) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="agent.user_name" label="代理人" />
          <el-table-column prop="user-post" label="分配岗位">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="preAllotPost(scope.row.user_id)">分配岗位</el-button>
              <!--<el-dialog :visible.sync="dialogOfFindPostsVisible" title="分配岗位">-->
                <!--<el-table :data="userPosts" tooltip-effect="dark" max-height="250" style="width: 100%">-->
                  <!--<el-table-column prop="depart_name" label="部门" min-width="200px"/>-->
                  <!--<el-table-column prop="post_name" label="岗位"/>-->
                  <!--<el-table-column prop="role_name" label="角色"/>-->
                <!--</el-table>-->
                <!--<div slot="footer" class="dialog-footer">-->
                  <!--<el-button @click="dialogOfFindPostsVisible=false">取 消</el-button>-->
                  <!--<el-button type="primary" @click="dialogOfFindPostsVisible=false">确 定</el-button>-->
                <!--</div>-->
              <!--</el-dialog>-->
            </template>
          </el-table-column>
          <el-table-column prop="user-relate" label="关联终端">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="preRelateTerminal(scope.row)">关联终端</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="user-update" label="修改">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="preUpdateUser(scope.row)">修改</el-button>
              <el-dialog :visible.sync="dialogOfUpdateUserVisible" title="人员修改">
                <el-form :ref="'updateUserForm' + current_user.user_id" :label-position="labelPosition" :model="current_user" status-icon size="mini" label-width="120px" class="form">
                  <el-form-item
                    :rules="[
                      { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ]"
                    prop="user_name"
                    label="姓名">
                    <el-input v-model="current_user.user_name" auto-complete="on" style="width: 150px"/>
                  </el-form-item>
                  <div style="position: absolute;right: 150px;top: 86px;">
                    <img :src="showHeadImg(current_user.user_img)" width="170" height="213" class="head_pic">
                  </div>
                  <el-form-item
                    label="工号">
                    <el-input v-model="current_user.card_num" :disabled="true" auto-complete="on" style="width: 150px"/>
                  </el-form-item>
                  <el-form-item
                    :rules="[
                      { required: true, message: '身份证不能为空', trigger: 'blur' },
                      { min: 18, max: 18, message: '请输入18位身份证长度', trigger: 'blur' }
                    ]"
                    :label="genIDCard(current_user.ic_card)"
                    prop="ic_card">
                    <el-input v-model="current_user.ic_card" auto-complete="on" style="width: 150px"/>
                  </el-form-item>
                  <el-form-item
                    :rules="[
                      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ]"
                    prop="born_date"
                    label="出生日期">
                    <el-date-picker
                      v-model="current_user.born_date"
                      type="date"
                      placeholder="选择日期"/>
                  </el-form-item>
                  <el-form-item
                    :rules="[
                      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ]"
                    prop="hire_date"
                    label="入职日期">
                    <el-date-picker
                      v-model="current_user.hire_date"
                      type="date"
                      placeholder="选择日期"/>
                  </el-form-item>
                  <el-form-item label="在职状态">
                    <el-select v-model="current_user.work_state" auto-complete="on" placeholder="请选择" style="width: 100px">
                      <el-option label="" value=""/>
                      <el-option :value="1" label="在职"/>
                      <el-option :value="0" label="离职"/>
                      <el-option :value="2" label="休长假"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :rules="[
                      { required: true, message: '性别不能为空', trigger: 'change' }
                    ]"
                    prop="user_sex"
                    label="性别">
                    <el-select v-model="current_user.user_sex" placeholder="请选择" style="width: 100px">
                      <el-option label="男" value="男"/>
                      <el-option label="女" value="女"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="代理人工号">
                    <el-input v-model="current_user.agent.card_num" auto-complete="on" style="width: 150px"/>
                  </el-form-item>
                  <el-form-item
                    label="密码"
                    prop="password">
                    <el-input v-model="current_user.password" auto-complete="on" style="width: 150px"/>
                  </el-form-item>
                  <el-form-item label="是否为考勤人员">
                    <el-select v-model="current_user.is_attendancer" auto-complete="on" placeholder="请选择" style="width: 100px">
                      <el-option :value="1" label="是" />
                      <el-option :value="0" label="否"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="dialogOfUpdateUserVisible=false">取 消</el-button>
                    <el-button type="primary" @click="updateUserInfo('updateUserForm' + current_user.user_id)">确 定</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column prop="user-reset-pwd" label="密码重置">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="resetPwdById(scope.row.user_id)">密码重置</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="user-delete" label="删除">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteUserById(scope.row.user_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;float: right;margin-right: 20px">
          <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background layout="prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
        </div>
        <el-dialog :visible.sync="dialogOfAddUserVisible" title="新增人员">
          <el-form ref="addUserForm" :label-position="labelPosition" :model="current_user" status-icon size="mini" label-width="120px" class="form">
            <el-form-item
              :rules="[
                { required: true, message: '姓名不能为空', trigger: 'blur' }
              ]"
              prop="user_name"
              label="姓名">
              <el-input v-model="current_user.user_name" auto-complete="off" style="width: 150px"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '工号不能为空', trigger: 'blur' }
              ]"
              prop="card_num"
              label="工号">
              <el-input v-model="current_user.card_num" auto-complete="off" style="width: 150px"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '身份证不能为空', trigger: 'blur' },
                { min: 18, max: 18, message: '请输入18位身份证长度', trigger: 'blur' }
              ]"
              :label="genIDCard(current_user.ic_card)"
              prop="ic_card">
              <el-input v-model="current_user.ic_card" auto-complete="off" style="width: 150px"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ]"
              prop="born_date"
              label="出生日期">
              <el-date-picker
                v-model="current_user.born_date"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ]"
              prop="hire_date"
              label="入职日期">
              <el-date-picker
                v-model="current_user.hire_date"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="在职状态">
              <el-select v-model="current_user.work_state" auto-complete="off" placeholder="请选择" style="width: 100px">
                <el-option label="" value=""/>
                <el-option :value="1" label="在职"/>
                <el-option :value="0" label="离职"/>
                <el-option :value="2" label="休长假"/>
              </el-select>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '性别不能为空', trigger: 'change' }
              ]"
              prop="user_sex"
              label="性别">
              <el-select v-model="current_user.user_sex" placeholder="请选择" style="width: 100px">
                <el-option label="男" value="男"/>
                <el-option label="女" value="女"/>
              </el-select>
            </el-form-item>
            <el-form-item label="代理人工号">
              <el-input v-model="current_user.agent.card_num" auto-complete="off" style="width: 150px"/>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password">
              <el-input v-model="current_user.password" auto-complete="off" style="width: 150px"/>
            </el-form-item>
            <el-form-item label="是否为考勤人员">
              <el-select v-model="current_user.is_attendancer" auto-complete="off" placeholder="请选择" style="width: 100px">
                <el-option :value="1" label="是" />
                <el-option :value="0" label="否"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogOfAddUserVisible=false">取 消</el-button>
              <el-button type="primary" @click="addUserInfo('addUserForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :visible.sync="allotPostVisible" title="分配人员">
          <el-form :model="postQuery" :inline="true">
            <el-form-item label="部门">
              <el-cascader
                :value="selectDeparts"
                :options="genFullDeparts"
                :props="departCascaderProps"
                :clearable="true"
                placeholder="试试搜索：部门"
                filterable
                change-on-select
                @change="departSelecedChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="findPostsByDepart(postQuery.depart_id)">查询</el-button>
            </el-form-item>
          </el-form>
          <el-transfer
            v-loading="isLoading"
            v-model="checked_posts"
            :props="postProps"
            :data="query_posts"
            :titles="['未分配岗位','已分配岗位']"
            @change="handleAllotPostChange"
          />
          <div slot="footer" class="dialog-footer">
            <el-button @click="allotPostVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotPosts(postQuery.user_id)">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogOfTerminalVisible" title="关联终端">
          <el-form :model="query_terminal" :inline="true" size="mini">
            <el-form-item label="部门">
              <el-cascader
                :value="selectDeparts"
                :options="genFullDeparts"
                :props="departCascaderProps"
                :clearable="true"
                placeholder="试试搜索：部门"
                filterable
                change-on-select
                @change="departSelecedChangeOfTm"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query_terminal.status" auto-complete="off" placeholder="请选择" style="width: 100px">
                <el-option value="" label=""/>
                <el-option value="1" label="在线" />
                <el-option value="0" label="离线"/>
              </el-select>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="query_terminal.name" auto-complete="off" style="width: 120px"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="findTerminals">查询</el-button>
              <el-button type="primary" @click="allotTerminalsByUser()">关联</el-button>
            </el-form-item>
          </el-form>
          <div style="margin-bottom: 20px">
            <el-table ref="multipleTerminalsTable" :data="terminals" size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionTmChange">
              <el-table-column type="selection" width="55"/>
              <el-table-column prop="depart_name" label="所属单位" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="version" label="版本号" />
              <el-table-column
                prop="status"
                label="状态"
                width="100">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.status === 1 ? 'primary' : 'warning'"
                    disable-transitions>{{ isOnline(scope.row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="ip" label="终端IP地址" />
              <el-table-column prop="port" label="端口" />
            </el-table>
            <div style="margin-top: 10px;float: right;margin-right: 20px">
              <el-pagination :total="tm_total_rows" :page-size="tm_page_rows" :current-page="tm_current_page" background layout="prev, pager, next" @current-change="handleTmCurrentChange" @size-change="handleTmSizeChange"/>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .form {
    min-height: 300px;
  }
  .form .el-input{
    width: 150px;
  }
</style>
<script>
import { getDeparts } from '@/api/depart'
import { getPostsByDepartId, getPostsByUserId } from '@/api/post'
import { getRoles } from '@/api/role'
import { findUsers, modifyUser, deleteUsers, resetPwds, allotTerminals, allotPostsByUser } from '@/api/user'
import { getTerminals } from '@/api/terminal'
export default {
  data() {
    return {
      userQuery: {
        card_num: null,
        user_name: null,
        user_sex: null,
        depart_id: null,
        post_id: null,
        role_id: null,
        reg_state: null,
        work_state: null,
        page: null,
        size: null
      },
      agentQuery: {
        card_num: null,
        user_name: null,
        user_sex: null,
        depart_id: null,
        post_id: null,
        role_id: null,
        reg_state: null,
        work_state: null,
        page: null,
        size: null
      },
      departs: [],
      departProps: {
        label: 'depart_name',
        children: 'children'
      },
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
      multipleUsersSelection: [],
      current_page: 1,
      page_rows: 10,
      total_rows: 0,
      query_users: [],
      hasPostsOfDepart: [],
      allRoles: [],
      dialogOfFindPostsVisible: false,
      dialogOfUpdateUserVisible: false,
      dialogOfAddUserVisible: false,
      allotPostVisible: false,
      dialogOfTerminalVisible: false,
      userPosts: [],
      labelPosition: 'right',
      current_user: {
        user_id: null,
        user_name: null,
        user_img: null,
        card_num: null,
        ic_card: null,
        born_date: null,
        agent: {
          user_id: null,
          user_name: null,
          card_num: null
        },
        hire_date: null,
        work_state: null,
        user_sex: null,
        password: null,
        is_attendancer: null
      },
      selectDeparts: [],
      postQuery: {
        depart_id: null,
        user_id: null
      },
      departCascaderProps: {
        value: 'depart_id',
        label: 'depart_name',
        children: 'children'
      },
      query_posts: [],
      postProps: {
        key: 'post_id',
        label: 'post_name'
      },
      checked_posts: [],
      isLoading: true,
      query_terminal: {
        id: null,
        user_id: null,
        depart_id: null,
        depart_name: null,
        name: null,
        status: null,
        ip: null,
        port: null,
        allow_user_num: null,
        reg_user_num: null,
        version: null,
        isAutoTrans: null,
        isAutoAccept: null,
        page: null,
        size: null
      },
      terminals: [],
      multipleTerminalsSelection: [],
      tm_current_page: 1,
      tm_page_rows: 5,
      tm_total_rows: 0
    }
  },
  computed: {
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
    this.getUsersByDepartId(null)
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
    isWorking(workState) {
      if (workState === 0 || workState === '0') {
        return '离职'
      }
      if (workState === 1 || workState === '1') {
        return '在职'
      }
      if (workState === 2 || workState === '2') {
        return '长休假'
      }
      return workState
    },
    isAttendancer(state) {
      return (state === 1 || state === '1') ? '是' : '否'
    },
    isRegister(isReg) {
      return (isReg === 1 || isReg === '1') ? '已注册' : '未注册'
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
    getAllRole() {
      getRoles({}).then(response => {
        if (response.result_code === 5000) {
          const data = response.content
          this.allRoles = []
          this.allRoles = data.content
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getUsersByDepartId(departId) {
      this.userQuery.page = this.current_page - 1
      this.userQuery.size = this.page_rows
      this.userQuery.depart_id = departId
      findUsers(this.userQuery).then(response => {
        if (response.result_code === 5000) {
          const data = response.content.users
          this.query_users = []
          this.query_users = data.content
          this.total_rows = data.totalElements
        } else {
          this.$message.error(response.result_desc)
        }
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
    clearUserQuery() {
      this.userQuery.card_num = null
      this.userQuery.user_name = null
      this.userQuery.depart_id = null
      this.userQuery.post_id = null
      this.userQuery.role_id = null
    },
    clearCurrentUser() {
      this.current_user.user_id = null
      this.current_user.user_name = null
      this.current_user.user_img = null
      this.current_user.card_num = null
      this.current_user.ic_card = null
      this.current_user.born_date = null
      this.current_user.agent.user_id = null
      this.current_user.agent.user_name = null
      this.current_user.agent.card_num = null
      this.current_user.hire_date = null
      this.current_user.work_state = null
      this.current_user.user_sex = null
      this.current_user.password = null
      this.current_user.is_attendancer = null
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
    findPostsByDepart(departId) {
      getPostsByDepartId({ depart_id: departId }).then(response => {
        if (response.result_code === 5000) {
          this.query_posts = response.content.posts
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    selectPostById(userId) {
      this.dialogOfFindPostsVisible = true
      // this.userPosts = []
      getPostsByUserId({ user_id: userId }).then(response => {
        if (response.result_code === 5000) {
          // this.userPosts = response.content.posts
          this.checked_posts = []
          if (response.content.posts) {
            response.content.posts.forEach(post => {
              this.checked_posts.push(post.post_id)
            })
          }
        } else {
          this.$message.error(response.result_desc)
        }
        this.isLoading = false
      })
    },
    genIDCard(card) {
      var len = 0
      if (card) {
        len = card.length
      }
      return '身份证[' + len + '位]'
    },
    showHeadImg(userImg) {
      if (!userImg || userImg === undefined || userImg.trim().length <= 0) {
        return './../../../static/img/img.jpg'
      }
      userImg = userImg.replace(/\\n/g, ' \n ')
      return userImg
    },
    addUserInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.current_user.agent.card_num && this.current_user.agent.card_num.trim().length > 0) {
            findUsers({ card_num: this.current_user.agent.card_num, page: 0, size: 1 }).then(response => {
              if (response.result_code === 5000 && response.content.users.content.length > 0) {
                this.current_user.agent = response.content.users.content[0]
                modifyUser(this.current_user).then(response => {
                  if (response.result_code === 5000) {
                    this.$message.success('新增成功')
                    this.dialogOfAddUserVisible = false
                  } else {
                    this.$message.error(response.result_desc)
                  }
                })
              } else {
                this.$message.error('代理人工号不正确')
                return false
              }
            })
          } else {
            modifyUser(this.current_user).then(response => {
              if (response.result_code === 5000) {
                this.$message.success('新增成功')
                this.dialogOfAddUserVisible = false
              } else {
                this.$message.error(response.result_desc)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    preUpdateUser(userInfo) {
      this.current_user.user_id = userInfo.user_id
      this.current_user.user_name = userInfo.user_name
      this.current_user.user_img = userInfo.user_img
      this.current_user.card_num = userInfo.card_num
      this.current_user.ic_card = userInfo.ic_card
      this.current_user.born_date = userInfo.born_date
      this.current_user.hire_date = userInfo.hire_date
      this.current_user.work_state = userInfo.work_state
      this.current_user.user_sex = userInfo.user_sex
      this.current_user.password = userInfo.password
      this.current_user.is_attendancer = userInfo.is_attendancer
      if (userInfo.agent != null && userInfo.agent !== undefined) {
        this.current_user.agent = userInfo.agent
      } else {
        this.current_user.agent.user_id = null
        this.current_user.agent.card_num = null
      }
      this.dialogOfUpdateUserVisible = true
    },
    preSelectAgent() {
      // this.dialogOfUpdateUserVisible = false
      this.dialogOfSelectAgentVisible = true
    },
    updateUserInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果代理人工号不为空，需验证代理人工号是否存在
          if (this.current_user.agent.card_num && this.current_user.agent.card_num.trim().length > 0) {
            findUsers({ card_num: this.current_user.agent.card_num, page: 0, size: 1 }).then(response => {
              if (response.result_code === 5000 && response.content.users.content.length > 0) {
                this.current_user.agent = response.content.users.content[0]
                modifyUser(this.current_user).then(response => {
                  if (response.result_code === 5000) {
                    this.$message.success('修改成功')
                    this.getUsersByDepartId(this.current_depart.depart_id)
                  } else {
                    this.$message.error('修改失败')
                  }
                  this.dialogOfUpdateUserVisible = false
                })
              } else {
                this.$message.error('代理人工号不正确')
                return false
              }
            })
          } else {
            modifyUser(this.current_user).then(response => {
              if (response.result_code === 5000) {
                this.$message.success('修改成功')
                this.getUsersByDepartId(this.current_depart.depart_id)
              } else {
                this.$message.error('修改失败')
              }
              this.dialogOfUpdateUserVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    deleteSelectedUsers() {
      if (this.multipleUsersSelection.length <= 0) {
        this.$message.warning('请选择用户')
        return
      }
      this.$confirm('此操作将永久删除选中的用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var userIds = []
        this.multipleUsersSelection.forEach(user => {
          userIds.push(user.user_id)
        })
        deleteUsers({ user_ids: userIds }).then(response => {
          if (response.result_code === 5000) {
            this.$message.success('删除成功')
            this.getUsersByDepartId(this.current_depart.depart_id)
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    deleteUserById(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers({ user_ids: [userId] }).then(response => {
          if (response.result_code === 5000) {
            this.$message.success('删除成功')
            this.getUsersByDepartId(this.current_depart.depart_id)
            this.dialogOfUpdateUserVisible = false
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    preAddUserInfo() {
      this.clearCurrentUser()
      this.dialogOfAddUserVisible = true
    },
    resetPwdSelectedUsers() {
      if (this.multipleUsersSelection.length <= 0) {
        this.$message.warning('请选择用户')
        return
      }
      this.$confirm('确定要重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var userIds = []
        this.multipleUsersSelection.forEach(user => {
          userIds.push(user.user_id)
        })
        resetPwds({ user_ids: userIds }).then(response => {
          if (response.result_code === 5000) {
            this.getUsersByDepartId(this.current_depart.depart_id)
            this.$alert('密码重置成功，初始密码为[' + response.content.default_pwd + ']', '提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    resetPwdById(userId) {
      this.$confirm('确定要重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwds({ user_ids: [userId] }).then(response => {
          if (response.result_code === 5000) {
            this.$alert('密码重置成功，初始密码为[' + response.content.default_pwd + ']', '提示', {
              confirmButtonText: '确定'
            })
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    preAllotPost(userId) {
      this.postQuery.user_id = userId
      this.postQuery.depart_id = null
      this.allotPostVisible = true
      this.findPostsByDepart(this.postQuery.depart_id)
      this.selectPostById(userId)
    },
    departSelecedChange(value) {
      if (value == null) {
        return
      }
      this.postQuery.depart_id = value[value.length - 1]
      this.getAllPostsByDepart(value[value.length - 1])
    },
    departSelecedChangeOfTm(value) {
      if (value == null) {
        return
      }
      this.query_terminal.depart_id = value[value.length - 1]
    },
    handleAllotPostChange(value, direction, movedKeys) {
      this.checked_posts = value
    },
    allotPosts(userId) {
      allotPostsByUser({ user_id: userId, post_ids: this.checked_posts }).then(response => {
        if (response.result_code === 5000) {
          this.$message.success('岗位分配成功')
        } else {
          this.$message.error(response.result_desc)
        }
        this.allotPostVisible = false
      })
    },
    preRelateTerminal(user) {
      this.dialogOfTerminalVisible = true
      this.query_terminal.user_id = user.user_id
      this.findTerminals()
    },
    findTerminals() {
      this.query_terminal.page = this.tm_current_page - 1
      this.query_terminal.size = this.tm_page_rows
      getTerminals(this.query_terminal).then(response => {
        this.terminals = []
        if (response.result_code === 5000) {
          this.terminals = response.content.terminals.content
          this.tm_total_rows = response.content.terminals.totalElements
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    allotTerminalsByUser() {
      if (!this.multipleTerminalsSelection || this.multipleTerminalsSelection.length <= 0) {
        this.$message.warning('请选择关联终端')
        return
      }
      var tmIds = []
      this.multipleTerminalsSelection.forEach(terminal => {
        tmIds.push(terminal.id)
      })
      console.log('user_id:' + this.query_terminal.user_id)
      console.log('terminal_ids:' + tmIds)
      allotTerminals({ user_id: this.query_terminal.user_id, terminal_ids: tmIds }).then(response => {
        if (response.result_code === 5000) {
          this.$message.success(response.result_desc)
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    isOnline(status) {
      return (status === 1 || status === '1') ? '在线' : '离线'
    },
    handleNodeClick(data) {
      this.current_depart = data
      this.getAllPostsByDepart(this.current_depart.depart_id)
      this.getUsersByDepartId(this.current_depart.depart_id)
    },
    handleSelectionChange(val) {
      this.multipleUsersSelection = val
    },
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getUsersByDepartId(this.current_depart.depart_id)
    },
    handleSelectionTmChange(val) {
      this.multipleTerminalsSelection = val
    },
    handleTmSizeChange(val) {
      this.tm_page_rows = val
    },
    handleTmCurrentChange(val) {
      this.tm_current_page = val
      this.findTerminals()
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
    width: 79%;
    min-height: 100%;
    float: left;
  }
</style>

