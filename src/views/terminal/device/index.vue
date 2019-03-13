<template>
  <div class="app-container">
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
          @change="departSelectedChangeOfTm"
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
        <el-button type="primary" @click="preAddTerminal">新增</el-button>
        <el-dialog :visible.sync="addDeviceVisible" title="添加设备">
          <el-form ref="addDeviceForm" :label-position="labelPosition" :model="device" status-icon size="mini" label-width="120px" class="form">
            <el-form-item
              :rules="[
                { required: true, message: '设备名不能为空', trigger: 'blur' }
              ]"
              prop="name"
              label="名称">
              <el-input v-model="device.name" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '部门不能为空', trigger: 'blur' }
              ]"
              prop="depart_id"
              label="部门">
              <el-cascader
                :value="selectDeparts2"
                :options="genFullDeparts"
                :props="departCascaderProps"
                placeholder="请选择部门"
                filterable
                change-on-select
                @change="departSelectedChangeOfAddTm"
              />
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '机器码/序列号不能为空', trigger: 'blur' }
              ]"
              prop="mac_addr"
              label="机器码/序列号">
              <el-input v-model="device.mac_addr" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '终端IP地址不能为空', trigger: 'blur' }
              ]"
              prop="ip"
              label="终端IP地址">
              <el-input v-model="device.ip" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '端口号不能为空'},
                { type: 'number', message: '端口号必须为数字值'}
              ]"
              prop="port"
              label="端口号">
              <el-input v-model.number="device.port" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: '允许注册人数不能为空'},
                { type: 'number', message: '允许注册人数必须为数字值'}
              ]"
              prop="allow_user_num"
              label="允许注册人数">
              <el-input v-model.number="device.allow_user_num" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { type: 'number', message: '终端存储空间必须为数字值'}
              ]"
              prop="total_cap"
              label="终端存储空间">
              <el-input v-model.number="device.total_cap" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              :rules="[
                { type: 'number', message: '已使用容量必须为数字值'}
              ]"
              prop="usag_cap"
              label="已使用容量">
              <el-input v-model.number="device.usag_cap" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              prop="version"
              label="版本号">
              <el-input v-model="device.version" auto-complete="off"/>
            </el-form-item>
            <el-form-item
              prop="isAutoTrans"
              label="是否自动转发">
              <el-select v-model="device.isAutoTrans" auto-complete="on" placeholder="请选择">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="isAutoAccept"
              label="是否自动接收">
              <el-select v-model="device.isAutoAccept" auto-complete="on" placeholder="请选择">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDeviceVisible=false">取 消</el-button>
            <el-button type="primary" @click="addDevice('addDeviceForm')">确 定</el-button>
          </div>
        </el-dialog>
        <el-button type="primary" @click="preAllotUsers">批量分配人员</el-button>
        <el-button type="primary" @click="deleteSelectedTerminals">批量删除</el-button>
        <el-button type="primary" @click="preUploadData">手动上传数据</el-button>
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
        <el-table-column prop="port" label="端口" width="50px"/>
        <el-table-column prop="allow_user_num" label="允许注册个数" width="50px"/>
        <el-table-column prop="reg_user_num" label="注册个数" width="50px"/>
        <el-table-column
          prop="autoTrans"
          label="是否自动转发"
          width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.autoTrans ? 'primary' : 'warning'"
              disable-transitions>{{ isOk(scope.row.autoTrans) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="autoAccept"
          label="是否自动接收"
          width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.autoAccept ? 'primary' : 'warning'"
              disable-transitions>{{ isOk(scope.row.autoAccept) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="修改">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="preUpdateTerminal(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="此设备人员">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="preMgrTerminalUsers(scope.row.id)">此设备人员</el-button>
          </template>
        </el-table-column>
        <el-table-column label="升级">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="upgradeApp(scope.row.id)">升级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteTerminalById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;float: right;margin-right: 20px">
        <el-pagination :total="tm_total_rows" :page-size="tm_page_rows" :current-page="tm_current_page" background layout="prev, pager, next" @current-change="handleTmCurrentChange" @size-change="handleTmSizeChange"/>
      </div>
    </div>
    <el-dialog :visible.sync="updateDeviceVisible" title="修改设备">
      <el-form ref="updateDeviceForm" :label-position="labelPosition" :model="device" status-icon size="mini" label-width="120px" class="form">
        <el-form-item
          :rules="[
            { required: true, message: '设备名不能为空', trigger: 'blur' }
          ]"
          prop="name"
          label="名称">
          <el-input v-model="device.name" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '部门不能为空', trigger: 'blur' }
          ]"
          prop="depart_id"
          label="部门">
          <el-cascader
            :value="selectDeparts2"
            :options="genFullDeparts"
            :props="departCascaderProps"
            placeholder="请选择部门"
            filterable
            change-on-select
            @change="departSelectedChangeOfAddTm"
          />
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '机器码/序列号不能为空', trigger: 'blur' }
          ]"
          prop="mac_addr"
          label="机器码/序列号">
          <el-input v-model="device.mac_addr" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '终端IP地址不能为空', trigger: 'blur' }
          ]"
          prop="ip"
          label="终端IP地址">
          <el-input v-model="device.ip" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '端口号不能为空'},
            { type: 'number', message: '端口号必须为数字值'}
          ]"
          prop="port"
          label="端口号">
          <el-input v-model.number="device.port" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '允许注册人数不能为空'},
            { type: 'number', message: '允许注册人数必须为数字值'}
          ]"
          prop="allow_user_num"
          label="允许注册人数">
          <el-input v-model.number="device.allow_user_num" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { type: 'number', message: '终端存储空间必须为数字值'}
          ]"
          prop="total_cap"
          label="终端存储空间">
          <el-input v-model.number="device.total_cap" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { type: 'number', message: '已使用容量必须为数字值'}
          ]"
          prop="usag_cap"
          label="已使用容量">
          <el-input v-model.number="device.usag_cap" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          prop="version"
          label="版本号">
          <el-input v-model="device.version" auto-complete="on"/>
        </el-form-item>
        <el-form-item
          prop="isAutoTrans"
          label="是否自动转发">
          <el-select v-model="device.isAutoTrans" auto-complete="on" placeholder="请选择">
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否"/>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="isAutoAccept"
          label="是否自动接收">
          <el-select v-model="device.isAutoAccept" auto-complete="on" placeholder="请选择">
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDeviceVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateTerminal('updateDeviceForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="terminalUsersVisible" title="此设备人员">
      <el-form :model="query_user" :inline="true" size="mini">
        <el-form-item label="部门">
          <el-cascader
            :value="selectDeparts2"
            :options="genFullDeparts"
            :props="departCascaderProps"
            :clearable="true"
            placeholder="试试搜索：部门"
            filterable
            change-on-select
            @change="departChange"
          />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="query_user.card_num" placeholder="工号" size="mini"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteSelectedUsers">批量删除</el-button>
          <el-button type="primary" @click="clearTerminalUsers">一键清空</el-button>
          <el-button type="primary" @click="preCopyUsers">从其他设备拷贝人员</el-button>
          <el-button type="primary" @click="dispatchAllUser">同步所有分配人员到终端</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 20px">
        <el-table ref="multipleUsersTable" :data="query_users" size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionUserChange">
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
          <el-table-column prop="user-delete" label="删除">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteTerminalUser(scope.row.user_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px;float: right;margin-right: 20px">
          <el-pagination :total="user_total_rows" :page-size="user_page_rows" :current-page="user_current_page" background layout="prev, pager, next" @current-change="handleUserCurrentChange" @size-change="handleUserSizeChange"/>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="copyUsersVisible" title="拷贝人员">
      <el-form :model="copy_terminal">
        <el-form-item label="其他设备" label-width="150px">
          <el-select v-model="copy_terminal.id" filterable placeholder="请选择">
            <el-option v-for="tm in all_terminal" :key="tm.id" :label="tm.name" :value="tm.id"/>
          </el-select>
          <el-button type="primary" @click="copyUsersFromTerminal">拷 贝</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="allotUsersVisible" title="批量分配人员">
      <el-form :model="query_user" :inline="true" size="mini">
        <el-form-item label="部门">
          <el-cascader
            :value="selectDeparts2"
            :options="genFullDeparts"
            :props="departCascaderProps"
            placeholder="请选择部门"
            filterable
            change-on-select
            @change="departChange"
          />
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="query_user.post_id" filterable placeholder="请选择">
            <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name" :value="post.post_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="query_user.card_num" placeholder="工号"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-transfer
            v-model="select_users"
            :props="{
              key: 'user_id',
              label: 'user_name'
            }"
            :titles="['待选择人员', '已选择人员']"
            :data="allot_users"/>
        </el-form-item>
        <el-form-item>
          <el-transfer
            v-model="select_terminal"
            :props="{
              key: 'id',
              label: 'name'
            }"
            :titles="['待选择设备', '已选择设备']"
            :data="allot_terminal"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="allotUsers">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="uploadDataVisible" title="手动上传数据">
      <el-form :model="query_up" :inline="true" size="mini">
        <el-form-item label="部门">
          <el-cascader
            :value="selectDeparts2"
            :options="genFullDeparts"
            :props="departCascaderProps"
            :clearable="true"
            placeholder="试试搜索：部门"
            filterable
            change-on-select
            @change="departSelectedChangeOfUp"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query_up.status" auto-complete="off" placeholder="请选择" style="width: 100px">
            <el-option value="" label=""/>
            <el-option value="1" label="在线" />
            <el-option value="0" label="离线"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="query_up.name" auto-complete="off" style="width: 120px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findUps">查询</el-button>
          <el-button type="primary" @click="getFile('1001')">手动上传人员数据文件</el-button>
          <el-button type="primary" @click="getFile('1002')">手动上传考勤记录文件</el-button>
          <el-button type="primary" @click="getFile('1003')">手动上传陌生人文件</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 20px">
        <el-table ref="multipleUpTerminalsTable" :data="up_terminals" size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionUpChange">
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
          <el-pagination :total="up_total_rows" :page-size="up_page_rows" :current-page="up_current_page" background layout="prev, pager, next" @current-change="handleUpCurrentChange" @size-change="handleUpSizeChange"/>
        </div>
      </div>
    </el-dialog>
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
import { getPostsByDepartId } from '@/api/post'
import { getTerminals, findAllTerminal, modifyTerminal, deleteTerminals, allotUsers, getFile, deleteUsersByTerminal, copyUserFromTerminals, dispatchUsers } from '@/api/terminal'
import { findUsers, getUsers } from '@/api/user'
export default {
  data() {
    return {
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
      query_up: {
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
      device: {
        id: null,
        user_id: null,
        depart_id: null,
        depart_name: null,
        name: null,
        mac_addr: null,
        status: null,
        ip: null,
        port: null,
        allow_user_num: null,
        reg_user_num: null,
        total_cap: null,
        usag_cap: null,
        version: null,
        isAutoTrans: null,
        isAutoAccept: null
      },
      terminals: [],
      multipleTerminalsSelection: [],
      tm_current_page: 1,
      tm_page_rows: 7,
      tm_total_rows: 0,
      departs: [],
      selectDeparts: [],
      departCascaderProps: {
        value: 'depart_id',
        label: 'depart_name',
        children: 'children'
      },
      addDeviceVisible: false,
      selectDeparts2: [],
      labelPosition: 'right',
      updateDeviceVisible: false,
      query_user: {
        tm_id: null,
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
      terminalUsersVisible: false,
      hasPostsOfDepart: [],
      query_users: [],
      user_current_page: 1,
      user_page_rows: 7,
      user_total_rows: 0,
      multipleUsersSelection: [],
      copyUsersVisible: false,
      all_terminal: [],
      copy_terminal: {
        id: null,
        name: null
      },
      allotUsersVisible: false,
      allot_users: [],
      select_users: [],
      allot_terminal: [],
      select_terminal: [],
      up_terminals: [],
      multipleUpSelection: [],
      up_current_page: 1,
      up_page_rows: 7,
      up_total_rows: 0,
      uploadDataVisible: false
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
    this.findTerminals()
    this.getUsers()
    this.findAllTerminal()
  },
  methods: {
    initDeviceInfo() {
      this.device.id = null
      this.device.user_id = null
      this.device.depart_id = null
      this.device.depart_name = null
      this.device.name = null
      this.device.mac_addr = null
      this.device.status = 0
      this.device.ip = null
      this.device.port = null
      this.device.allow_user_num = 0
      this.device.reg_user_num = 0
      this.device.total_cap = 0
      this.device.usag_cap = 0
      this.device.version = null
      this.device.isAutoTrans = false
      this.device.isAutoAccept = false
    },
    clearQueryUser() {
      this.query_user.tm_id = null
      this.query_user.card_num = null
      this.query_user.user_name = null
      this.query_user.user_sex = null
      this.query_user.depart_id = null
      this.query_user.post_id = null
      this.query_user.role_id = null
      this.query_user.reg_state = null
      this.query_user.work_state = null
      this.query_user.page = null
      this.query_user.size = null
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
    getAllPostsByDepart(departId) {
      getPostsByDepartId({ depart_id: departId }).then(response => {
        if (response.result_code === 5000) {
          this.hasPostsOfDepart = response.content.posts
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
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
    findTerminals() {
      this.query_terminal.page = this.tm_current_page - 1
      this.query_terminal.size = this.tm_page_rows
      getTerminals(this.query_terminal).then(response => {
        this.terminals = []
        if (response.result_code === 5000) {
          if (response.content.terminals.content.length <= 0 && this.tm_current_page > 1) {
            this.tm_current_page -= 1
            this.findTerminals()
          } else {
            this.terminals = response.content.terminals.content
            this.tm_total_rows = response.content.terminals.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    findUps() {
      this.query_up.page = this.up_current_page - 1
      this.query_up.size = this.up_page_rows
      getTerminals(this.query_up).then(response => {
        this.up_terminals = []
        if (response.result_code === 5000) {
          if (response.content.terminals.content.length <= 0 && this.tm_current_page > 1) {
            this.up_current_page -= 1
            this.findUps()
          } else {
            this.up_terminals = response.content.terminals.content
            this.up_total_rows = response.content.terminals.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getFile(type) {
      if (this.multipleUpSelection.length <= 0) {
        this.$message.warning('请选择终端')
        return
      }
      var tmIds = []
      this.multipleUpSelection.forEach(tm => {
        tmIds.push(tm.id)
      })
      getFile({ terminal_ids: tmIds, file_type: type}).then(response => {
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
    isOk(status) {
      return status === true ? '是' : '否'
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
    isRegister(isReg) {
      return (isReg === 1 || isReg === '1') ? '已注册' : '未注册'
    },
    preAddTerminal() {
      this.selectDeparts2 = []
      this.initDeviceInfo()
      this.addDeviceVisible = true
    },
    addDevice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyTerminal(this.device).then(response => {
            if (response.result_code === 5000) {
              this.findTerminals()
              this.findAllTerminal()
              this.$message.success('设备添加成功')
            } else {
              this.$message.error(response.result_desc)
            }
            this.addDeviceVisible = false
          })
        } else {
          return false
        }
      })
    },
    deleteTerminalById(tmId) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTerminals({ terminal_ids: [tmId] }).then(response => {
          if (response.result_code === 5000) {
            this.findTerminals()
            this.findAllTerminal()
            this.$message.success('设备删除成功')
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    preAllotUsers() {
      this.clearQueryUser()
      this.select_users = []
      this.select_terminal = []
      this.allotUsersVisible = true
    },
    allotUsers() {
      if (this.select_users.length <= 0) {
        this.$message.warning('请选择要分配的人员')
        return
      }
      if (this.select_terminal.length <= 0) {
        this.$message.warning('请选择要分配的终端')
        return
      }
      allotUsers({ user_ids: this.select_users, terminal_ids: this.select_terminal }).then(response => {
        if (response.result_code === 5000) {
          this.$message.success('批量分配人员成功')
        } else {
          this.$message.error(response.result_desc)
        }
        this.allotUsersVisible = false
      })
    },
    deleteSelectedTerminals() {
      if (this.multipleTerminalsSelection.length <= 0) {
        this.$message.warning('请选择终端')
        return
      }
      this.$confirm('此操作将永久删除选中的终端, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var tmIds = []
        this.multipleTerminalsSelection.forEach(tm => {
          tmIds.push(tm.id)
        })
        deleteTerminals({ terminal_ids: tmIds }).then(response => {
          if (response.result_code === 5000) {
            this.findTerminals()
            this.findAllTerminal()
            this.$message.success('设备删除成功')
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    preUploadData() {
      this.selectDeparts2 = []
      this.findUps()
      this.uploadDataVisible = true
    },
    preUpdateTerminal(tm) {
      this.device.id = tm.id
      this.device.user_id = tm.user_id
      this.device.depart_id = tm.depart_id
      this.device.depart_name = tm.depart_name
      this.device.name = tm.name
      this.device.mac_addr = tm.mac_addr
      this.device.status = tm.status
      this.device.ip = tm.ip
      this.device.port = tm.port
      this.device.allow_user_num = tm.allow_user_num
      this.device.reg_user_num = tm.reg_user_num
      this.device.total_cap = tm.total_cap
      this.device.usag_cap = tm.usag_cap
      this.device.version = tm.version
      this.device.isAutoTrans = tm.autoTrans
      this.device.isAutoAccept = tm.autoAccept
      this.selectDeparts2 = []
      this.updateDeviceVisible = true
    },
    updateTerminal(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyTerminal(this.device).then(response => {
            if (response.result_code === 5000) {
              this.findTerminals()
              this.findAllTerminal()
              this.$message.success('设备修改成功')
            } else {
              this.$message.error(response.result_desc)
            }
            this.updateDeviceVisible = false
          })
        } else {
          return false
        }
      })
    },
    queryUsers() {
      this.query_user.page = this.user_current_page - 1
      this.query_user.size = this.user_page_rows
      findUsers(this.query_user).then(response => {
        if (response.result_code === 5000) {
          const data = response.content.users
          if (data.length <= 0 && this.user_current_page > 1) {
            this.user_current_page -= 1
            this.queryUsers()
          } else {
            this.query_users = []
            this.query_users = data.content
            this.user_total_rows = data.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getUsers() {
      getUsers(this.query_user).then(response => {
        if (response.result_code === 5000) {
          this.allot_users = response.content.users
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    preMgrTerminalUsers(tmId) {
      this.query_user.tm_id = tmId
      this.queryUsers()
      this.terminalUsersVisible = true
    },
    upgradeApp(tmId) {
      this.$confirm('确定要升级此设备吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('升级成功')
      })
    },
    findOtherTerminals() {
      this.all_terminal = []
      if (this.allot_terminal.length > 0) {
        this.allot_terminal.forEach(tm => {
          if (this.query_user.tm_id !== tm.id) {
            this.all_terminal.push(tm)
          }
        })
        return
      }
      findAllTerminal({}).then(response => {
        if (response.result_code === 5000) {
          this.allot_terminal = response.content
          response.content.forEach((tm, index) => {
            if (this.query_user.tm_id !== tm.id) {
              this.all_terminal.push(tm)
            }
          })
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    findAllTerminal() {
      findAllTerminal({}).then(response => {
        if (response.result_code === 5000) {
          this.allot_terminal = response.content
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    copyUsersFromTerminal() {
      copyUserFromTerminals({ source: this.query_user.tm_id, others: [this.copy_terminal.id] }).then(response => {
        if (response.result_code === 5000) {
          this.$message.success('成功拷贝人员')
          this.queryUsers()
        } else {
          this.$message.error(response.result_desc)
        }
        this.copyUsersVisible = false
      })
    },
    deleteTerminalUser(userId) {
      this.$confirm('确定要从设备中删除此用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsersByTerminal({ terminal_id: this.query_user.tm_id, user_ids: [userId] }).then(response => {
          if (response.result_code === 5000) {
            this.$message.success('删除成功')
            this.queryUsers()
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    deleteSelectedUsers() {
      if (this.multipleUsersSelection.length <= 0) {
        this.$message.warning('请选择要删除的用户')
        return
      }
      this.$confirm('确定要从设备中删除选中的用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var userIds = []
        this.multipleUsersSelection.forEach(user => {
          userIds.push(user.user_id)
        })
        deleteUsersByTerminal({ terminal_id: this.query_user.tm_id, user_ids: userIds }).then(response => {
          if (response.result_code === 5000) {
            this.$message.success('删除成功')
            this.queryUsers()
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    clearTerminalUsers() {
      this.$confirm('确定要清空该设备的所有人员数据吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsersByTerminal({ terminal_id: this.query_user.tm_id, user_ids: [], is_clear: true }).then(response => {
          if (response.result_code === 5000) {
            this.$message.success('清空设备上人员成功')
            this.terminalUsersVisible = false
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    preCopyUsers() {
      this.findOtherTerminals()
      this.copyUsersVisible = true
    },
    dispatchAllUser() {
      this.$confirm('确定要下发同步所有分配人员到终端吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dispatchUsers({ terminal_id: this.query_user.tm_id }).then(response => {
          if (response.result_code === 5000) {
            this.$message.success('下发同步所有分配人员到终端命令已成功发送')
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    handleSelectionTmChange(val) {
      this.multipleTerminalsSelection = val
    },
    handleSelectionUpChange(val) {
      this.multipleUpSelection = val
    },
    handleSelectionUserChange(val) {
      this.multipleUsersSelection = val
    },
    handleTmSizeChange(val) {
      this.tm_page_rows = val
    },
    handleTmCurrentChange(val) {
      this.tm_current_page = val
      this.findTerminals()
    },
    handleUpSizeChange(val) {
      this.up_page_rows = val
    },
    handleUpCurrentChange(val) {
      this.up_current_page = val
      this.findUps()
    },
    handleUserSizeChange(val) {
      this.user_page_rows = val
    },
    handleUserCurrentChange(val) {
      this.user_current_page = val
      this.queryUsers()
    },
    departSelectedChangeOfTm(value) {
      if (value == null) {
        return
      }
      this.query_terminal.depart_id = value[value.length - 1]
    },
    departSelectedChangeOfAddTm(value) {
      if (value == null) {
        return
      }
      this.device.depart_id = value[value.length - 1]
    },
    departChange(value) {
      if (value == null) {
        return
      }
      this.query_user.depart_id = value[value.length - 1]
      this.getAllPostsByDepart(value[value.length - 1])
    },
    departSelectedChangeOfUp(value) {
      if (value == null) {
        return
      }
      this.query_up.depart_id = value[value.length - 1]
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

