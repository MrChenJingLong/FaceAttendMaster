<template>
  <div class="app-container">
    <el-form ref="classes" :model="query_classes" :inline="true" label-width="120px">
      <el-form-item style="">
        <el-button type="primary" @click="preAddClasses">新增班次</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query_classes.name" class="input-with-select" placeholder="请输入班次名称">
          <el-button slot="append" icon="el-icon-search" @click="getClasses"/>
        </el-input>
      </el-form-item>
    </el-form>
    <el-table ref="multipleClassesTable" :data="classes" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="class_name" label="班次名称" width="120"/>
      <el-table-column prop="attend_time" label="考勤时间" width="120"/>
      <el-table-column prop="total_hours" label="总工时" width="120"/>
      <el-table-column prop="attend_time" label="是否弹性" width="120"/>
      <el-table-column prop="option" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;float: right;margin-right: 20px">
      <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background layout="prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </div>
    <el-dialog :visible.sync="uploadClassesVisible" :title="classes_title">
      <el-form :model="class_clock" size="mini">
        <el-form-item label="班次名称">
          <el-input v-model="class_clock.name" auto-complete="off" style="width: 120px"/>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="class_clock.is_elastic" @change="culTotalHour">是否弹性</el-checkbox>
        </el-form-item>
        <el-form-item v-if="!class_clock.is_elastic">
          <label>设置时间段</label>
        </el-form-item>
        <el-form-item>
          <el-table v-if="!class_clock.is_elastic" ref="clockTable" :data="class_clock.clocks" tooltip-effect="dark" size="mini" style="width: 100%">
            <el-table-column prop="clock_name" label="时间段" />
            <el-table-column :formatter="genOnWorkTime" prop="clock_name" label="上班时间段" />
            <el-table-column :formatter="genOffWorkTime" label="下班时间段" />
            <el-table-column :formatter="allowLateTime" label="允许迟到时间" />
            <el-table-column :formatter="allowEarlyTime" label="允许早退时间" />
            <el-table-column prop="delete" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" @click="preUpdateClock(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteClock(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="总工时">
          <el-time-picker
            v-model="class_clock.total_hour"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            :disabled="!class_clock.is_elastic"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadClassesVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateClasses">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updateClockVisible" width="800px" title="添加时间段">
      <el-form :model="clock" size="mini" label-width="50px">
        <el-form-item label="时段">
          <el-select v-model="clock.clock_name" filterable disabled placeholder="请选择时段" style="width: 120px" @change="clockChange">
            <el-option v-for="clock in all_clocks" :key="clock" :label="clock.clock_name" :value="clock"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上班">
          <div class="agent-value">
            <el-time-picker
              v-model="clock.on_work_clock_date"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              size="mini"
              placeholder="开始时间"
              format="HH:mm:ss"
              style="width: 120px"/>
            <div class="agent-label">~</div>
            <el-time-picker
              v-model="clock.on_work_date"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              arrow-control
              size="mini"
              placeholder="结束时间"
              format="HH:mm:ss"
              style="width: 120px"/>
          </div>
          <div class="agent-label">
            允许迟到
            <el-input-number :min="0" :max="60" v-model="clock.allow_late_time" controls-position="right" @change="handleChange" />
            分钟
          </div>
          <div class="agent-label">
            <el-select v-model="clock.on_work_clock_state" filterable style="width: 80px">
              <el-option :value="1" label="必须"/>
              <el-option :value="0" label="不用"/>
            </el-select>
            打卡
          </div>
        </el-form-item>
        <el-form-item label="下班">
          <div class="agent-value">
            <el-time-picker
              v-model="clock.off_work_date"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="开始时间"
              format="HH:mm:ss"
              style="width: 120px"/>
            <span class="agent-label">~</span>
            <el-time-picker
              v-model="clock.off_work_clock_date"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              arrow-control
              placeholder="结束时间"
              format="HH:mm:ss"
              style="width: 120px"/>
          </div>
          <div class="agent-label">
            允许早退
            <el-input-number :min="0" :max="60" v-model="clock.allow_early_time" controls-position="right" @change="handleChange" />
            分钟
          </div>
          <div class="agent-label">
            <el-select v-model="clock.off_work_clock_state" filterable style="width: 80px">
              <el-option :value="1" label="必须"/>
              <el-option :value="0" label="不用"/>
            </el-select>
            打卡
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClockVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateClock">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addClasses, getClasses } from '@/api/classes'
import { getAllClock } from '@/api/clock'
export default {
  data() {
    return {
      query_classes: {
        name: null,
        page: null,
        size: null
      },
      clock: {
        clock_id: null,
        clock_name: null,
        on_work_clock_date: null,
        on_work_date: null,
        on_work_clock_state: null,
        off_work_date: null,
        off_work_clock_date: null,
        off_work_clock_state: null,
        allow_late_time: null,
        allow_early_time: null
      },
      classes_title: '新增',
      all_clocks: [],
      classes: [],
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      multipleSelection: [],
      uploadClassesVisible: false,
      updateClockVisible: false,
      class_clock: {
        id: null,
        name: null,
        is_elastic: null,
        total_hour: null,
        clocks: []
      }
    }
  },
  created() {
    this.getAllClocksTest()
    this.getClasses()
  },
  methods: {
    getAllClocksTest() {
      for (let i = 1; i <= 8; i++) {
        var clock = {}
        clock.clock_id = 1000 + i + ''
        clock.clock_name = '时段' + i
        clock.allow_early_time = 0
        clock.allow_late_time = 0
        clock.on_work_date = new Date()
        clock.on_work_clock_date = new Date()
        clock.on_work_clock_state = 1
        clock.off_work_date = new Date()
        clock.off_work_clock_date = new Date()
        clock.off_work_clock_state = 1
        this.all_clocks.push(clock)
      }
    },
    getAllClocks() {
      getAllClock().then(response => {
        if (response.result_code === 5000) {
          this.all_clocks = response.content
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getClasses() {
      this.query_classes.page = this.current_page - 1
      this.query_classes.size = this.page_rows
      getClasses(this.query_classes).then(response => {
        if (response.result_code === 5000) {
          if (response.content.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1
            this.getClasses()
          } else {
            this.classes = response.content.content
            this.total_rows = response.content.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    preAddClasses() {
      this.classes_title = '新增班次'
      this.class_clock.clocks = this.all_clocks
      this.culTotalHour()
      this.uploadClassesVisible = true
    },
    addClasses() {
      this.uploadClassesVisible = false
    },
    preUpdateClasses() {
      this.classes_title = '编辑班次'
      this.uploadClassesVisible = true
    },
    clearClock() {
      this.clock.clock_id = null
      this.clock.clock_name = null
      this.clock.on_work_clock_date = null
      this.clock.on_work_date = null
      this.clock.on_work_clock_state = null
      this.clock.off_work_date = null
      this.clock.off_work_clock_date = null
      this.clock.off_work_clock_state = null
      this.clock.allow_late_time = null
      this.clock.allow_early_time = null
    },
    updateClock() {
      // var new_clock = {}
      // new_clock.clock_id = this.clock.clock_id
      // new_clock.clock_name = this.clock.clock_name
      // new_clock.on_work_clock_date = this.clock.on_work_clock_date
      // new_clock.on_work_date = this.clock.on_work_date
      // new_clock.on_work_clock_state = this.clock.on_work_clock_state
      // new_clock.off_work_date = this.clock.off_work_date
      // new_clock.off_work_clock_date = this.clock.off_work_clock_date
      // new_clock.off_work_clock_state = this.clock.off_work_clock_state
      // new_clock.allow_late_time = this.clock.allow_late_time
      // new_clock.allow_early_time = this.clock.allow_early_time
      // this.class_clock.clocks.push(new_clock)
      // this.clearClock()
      this.culTotalHour()
      this.updateClockVisible = false
    },
    onOrOffWorkClockState(state) {
      return state === 1 ? '必须' : '不用'
    },
    updateClasses() {
      console.log(this.class_clock)
      this.uploadClassesVisible = false
    },
    formatTime(time) {
      return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
    },
    genOnWorkTime(row) {
      if (row.on_work_clock_state !== 1) {
        return ''
      }
      return this.formatTime(row.on_work_clock_date) + '~' + this.formatTime(row.on_work_date)
    },
    genOffWorkTime(row) {
      if (row.off_work_clock_state !== 1) {
        return ''
      }
      return this.formatTime(row.off_work_date) + '~' + this.formatTime(row.off_work_clock_date)
    },
    allowLateTime(row) {
      return row.allow_late_time + '分钟'
    },
    allowEarlyTime(row) {
      return row.allow_early_time + '分钟'
    },
    preUpdateClock(row) {
      this.clock = row
      // this.clock.clock_id = row.clock_id
      // this.clock.clock_name = row.clock_name
      // this.clock.on_work_clock_date = row.on_work_clock_date
      // this.clock.on_work_date = row.on_work_date
      // this.clock.on_work_clock_state = row.on_work_clock_state
      // this.clock.off_work_date = row.off_work_date
      // this.clock.off_work_clock_date = row.off_work_clock_date
      // this.clock.off_work_clock_state = row.off_work_clock_state
      // this.clock.allow_late_time = row.allow_late_time
      // this.clock.allow_early_time = row.allow_early_time
      this.updateClockVisible = true
    },
    deleteClock(index) {
      console.log(index)
      this.class_clock.clocks.splice(index, 1)
    },
    culTotalHour() {
      if (!this.class_clock.is_elastic) {
        var total_hour = 0
        this.class_clock.clocks.forEach(clock => {
          total_hour += clock.off_work_date.getTime() - clock.on_work_clock_date.getTime()
        })
        console.log('total_hour' + total_hour)
        this.class_clock.total_hour = new Date(0, 0, 0, 0, 0, 0, total_hour)
        return
      }
      this.class_clock.total_hour = new Date(2019, 3, 18, 7, 0)
    },
    clockChange(val) {
      console.log(val)
      this.clock.clock_id = val.clock_id
      this.clock.clock_name = val.clock_name
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
  .agent-label,.agent-value {
    display: inline;
    width: 50px;
    text-align: center;
  }
</style>

