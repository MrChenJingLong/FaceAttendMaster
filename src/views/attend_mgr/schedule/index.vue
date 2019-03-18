<template>
  <div class="app-container">
    <el-form ref="schedule" :model="query_schedule" :inline="true" label-width="120px">
      <el-form-item style="">
        <el-button type="primary" @click="addSchedule">新增排班</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query_schedule.name" class="input-with-select" placeholder="请输入排班名称">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>
    <el-table :data="schedules" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="schedule_name" label="排班名称" width="120"/>
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
  </div>
</template>

<script>
import { getSchedules, addSchedules } from '@/api/schedule'
export default {
  data() {
    return {
      query_schedule: {
        name: null,
        page: null,
        size: null
      },
      schedules: [],
      current_page: 1,
      page_rows: 5,
      total_rows: 0
    }
  },
  created() {
  },
  methods: {
    getSchedules() {
      this.query_schedule.page = this.current_page - 1
      this.query_schedule.size = this.page_rows
      getSchedules(this.query_schedule).then(response => {
        if (response.result_code === 5000) {
          if (response.content.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1
            this.getSchedules()
          } else {
            this.schedules = response.content.content
            this.total_rows = response.content.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    preAddSchedule() {},
    addSchedule() {
      this.$router.push({ path: '/attend_mgr/schedule_modify' })
    },
    preUpdateSchedule() {},
    updateSchedule() {},
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getSchedules()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

