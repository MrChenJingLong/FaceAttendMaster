<template>
  <div class="app-container">
    <el-form :model="current_schedule" label-width="120px" size="mini">
      <el-form-item
        :rules="[
          { required: true, message: '排班名称不能为空', trigger: 'change' }
        ]"
        prop="name"
        label="排班名称:">
        <el-input v-model="current_schedule.name" placeholder="请输入排班名称" style="width: 160px"/>
      </el-form-item>
      <el-form-item label="参与考勤人员:">
        <el-button plain @click="preAllotUsers">{{ culUserNum }}</el-button>
      </el-form-item>
      <el-form-item label="考勤类型:">
        <div>
          <el-radio v-model="current_schedule.type" label="1">固定班制(每天考勤一样)</el-radio>
          <p class="p_desc">适用于：IT、金融、文化传媒、政府/事业单位、教育培训等行业</p>
        </div>
        <div style="margin-top: 20px">
          <el-radio v-model="current_schedule.type" label="2" size="medium">排班制(自定义设置考勤时间)</el-radio>
          <p class="p_desc">适用于：餐饮、制造、物流贸易、客户服务、医院等行业</p>
        </div>
        <div style="margin-top: 20px">
          <el-radio v-model="current_schedule.type" label="3" size="medium">自由工时(不设置班次，随时打卡)</el-radio>
          <p class="p_desc">适用于：班次没有规律、装修、家政、物流等计算工作时长的行业</p>
        </div>
      </el-form-item>
      <el-form-item v-if="current_schedule.type == 1" label="工作日设置:">
        <span>快捷设置班次: 休息</span> <el-button type="text" size="mini">更改班次</el-button>
        <el-table ref="workTable" :data="work_classes" size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="class_name" label="工作日" width="120"/>
          <el-table-column prop="attend_time" label="工作时间段" width="120"/>
          <el-table-column prop="option" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateClasses">更改班次</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-radio v-model="current_schedule.is_holiday" label="1" size="medium">法定节假日自动排休</el-radio>
        </div>
      </el-form-item>
      <el-form-item v-if="current_schedule.type == 1" label="特殊日期:">
        <el-button plain size="mini" @click="addNeedClockDate" >添加</el-button>
        <span>必须打卡的日期</span>
        <div>
          <el-table v-if="current_schedule.need_classes.length > 0" :data="current_schedule.need_classes" size="mini" tooltip-effect="dark">
            <el-table-column prop="class_name" label="日期" width="120"/>
            <el-table-column prop="attend_time" label="考勤时间" width="120"/>
            <el-table-column prop="option" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini">编辑</el-button> |
                <el-button type="text" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width: 100%;height: 25px"></div>
        <el-button plain size="mini" @click="addUnNeedClockDate">添加</el-button>
        <span>不用打卡的日期</span>
        <div>
          <el-table v-if="current_schedule.un_need_classes.length > 0" :data="current_schedule.un_need_classes" size="mini" tooltip-effect="dark">
            <el-table-column prop="class_name" label="日期" width="120"/>
            <el-table-column prop="attend_time" label="考勤时间" width="120"/>
            <el-table-column prop="option" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small">编辑</el-button> |
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item v-if="current_schedule.type == 2" label="考勤班次">
        <el-button v-if="class_tags.length <= 0" plain size="mini" @click="selectClasses">选择班次</el-button>
        <el-button v-if="class_tags.length > 0" plain size="mini" @click="selectClasses">
          <el-tag
            v-for="tag in class_tags"
            :key="tag.class_name"
            :type="tag.type"
            :disable-transitions="false"
            closable
            style="margin-right: 5px"
            @close="closeTag(tag)">
            {{ tag.class_name + ':' + tag.attend_time }}
          </el-tag>
        </el-button>
        <el-dialog :visible.sync="selectClassesVisible" title="选择班次">
          <el-form ref="classes" :model="query_classes" :inline="true" label-width="120px">
            <el-form-item style="float: right">
              <el-input
                v-model="query_classes.name"
                size="medium"
                placeholder="请输入班次名称">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="getClasses"></i>
              </el-input>
            </el-form-item>
          </el-form>
          <el-table ref="multipleClassesTable" :data="classes" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelClassChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="class_name" label="班次名称" width="120"/>
            <el-table-column prop="attend_time" label="考勤时间" width="200"/>
            <el-table-column prop="total_hours" label="总工时" width="120"/>
            <el-table-column
              prop="is_elastic"
              label="是否弹性"
              width="100">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.is_elastic === 1 ? 'primary' : 'warning'"
                  disable-transitions>{{ isElastic(scope.row.is_elastic) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="selectClassesVisible=false">取 消</el-button>
            <el-button type="primary" @click="allotClasses">确 定</el-button>
          </div>
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="current_schedule.type == 2" label="排班周期:">
        <el-button plain size="mini" @click="preSetSchedule">请设置排班周期</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="saveSchedule">保存设置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="allotUserVisible" title="参与考勤人员">
      <el-form :model="userQuery" :inline="true" size="mini">
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
  </div>
</template>

<script>
import { getDeparts } from '@/api/depart'
import { getUsers } from '@/api/user'
import { getPostsByDepartId } from '@/api/post'
import { getClasses } from '@/api/classes'
export default {
  data() {
    return {
      current_schedule: {
        name: null,
        type: '1',
        start_date: null,
        loop_time: null,
        is_holiday: null,
        is_blend: null,
        classess: [],
        users: [],
        need_classes: [],
        un_need_classes: []
      },
      allotUserVisible: false,
      departs: [],
      selectDeparts: [],
      userQuery: {
        card_num: null,
        user_name: null,
        depart_id: null,
        post_id: null,
        role_id: null,
        hire_date: null
      },
      departCascaderProps: {
        value: 'depart_id',
        label: 'depart_name',
        children: 'children'
      },
      hasPostsOfDepart: [],
      query_users: [],
      userProps: {
        key: 'user_id',
        label: 'user_name'
      },
      checked_users: [],
      work_classes: [],
      classes: [],
      selectClassesVisible: false,
      query_classes: {
        name: null,
        page: 0,
        size: 0
      },
      selectedClasses: [],
      class_tags: []
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
    },
    culUserNum() {
      return this.current_schedule.users.length <= 0 ? '请选择' : this.current_schedule.users.length + '人'
    }
  },
  created() {
    this.getAllDepart()
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
    getAllPostsByDepart(departId) {
      getPostsByDepartId({ depart_id: departId }).then(response => {
        if (response.result_code === 5000) {
          this.hasPostsOfDepart = response.content.posts
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    departSelecedChange(value) {
      if (value == null) {
        return
      }
      this.userQuery.depart_id = value[value.length - 1]
      this.getAllPostsByDepart(value[value.length - 1])
    },
    getUsers() {
      getUsers(this.userQuery).then(response => {
        if (response.result_code === 5000) {
          this.query_users = response.content.users
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    preAllotUsers() {
      this.checked_users = []
      this.getUsers()
      this.allotUserVisible = true
    },
    updateClasses() {},
    addNeedClockDate() {},
    addUnNeedClockDate() {},
    selectClasses() {
      // this.getClasses()
      this.classes = []
      for (var i = 1; i <= 3; i++) {
        var cla = {}
        cla.class_id = 1000 + i + ''
        cla.class_name = '班次' + i
        cla.attend_time = '09:00:00~12:00:00'
        cla.total_hours = 3
        cla.is_elastic = 0
        this.classes.push(cla)
      }
      this.selectClassesVisible = true
    },
    closeTag(tag) {
      console.log(tag)
      this.class_tags.splice(this.class_tags.indexOf(tag), 1)
    },
    isElastic(state) {
      return (state === 1 || state === '1') ? '是' : '否'
    },
    getClasses() {
      console.log(this.query_classes)
      this.query_classes.page = -1
      this.query_classes.size = -1
      getClasses(this.query_classes).then(response => {
        if (response.result_code === 5000) {
          this.classes = response.content.content
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    allotClasses() {
      this.class_tags = []
      var tagType = ['', 'success', 'info', 'warning', 'danger']
      this.selectedClasses.forEach((cla, index) => {
        var tag = {}
        tag.class_name = cla.class_name
        tag.attend_time = cla.attend_time
        tag.type = tagType[index % tagType.length]
        this.class_tags.push(tag)
      })
      this.selectClassesVisible = false
    },
    handleAllotUserChange(value, direction, movedKeys) {
      this.checked_users = value
    },
    cancelAllotUsers() {
      this.checked_users = []
      this.allotUserVisible = false
    },
    handleSelClassChange(val) {
      this.selectedClasses = val
    },
    allotUsers() {
      this.current_schedule.users = this.checked_users
      this.allotUserVisible = false
    },
    saveSchedule() {
      this.$router.push({ path: '/attend_mgr/schedule' })
    }
  }
}
</script>

<style scoped>
  .p_desc {
    line-height: 8px;
    color: #B0B0B0;
  }
</style>
