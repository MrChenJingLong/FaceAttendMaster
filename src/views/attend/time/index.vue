<template>
  <div class="app-container">
    <el-form ref="dutyForm" :model="query_duty" :inline="true" label-width="80px">
      <el-form-item label="考勤时间">
        <el-date-picker
          :clearable="true"
          v-model="defaultDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectedDateChange"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDutys">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="DutyTable" :data="dutys" tooltip-effect="dark">
      <el-table-column prop="user_name" label="用户名" />
      <el-table-column prop="tm_name" label="设备名" />
      <el-table-column prop="compare_score" label="比对分数"/>
      <el-table-column prop="attend_date" label="打卡日期"/>
      <el-table-column prop="attend_time" label="打卡时间"/>
    </el-table>
    <div style="margin-top: 20px;float: right;margin-right: 20px">
      <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background layout="prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </div>
  </div>
</template>

<script>
import { getMyDutys } from '@/api/duty'
export default {
  data() {
    return {
      query_duty: {
        start_time: null,
        end_time: null,
        page: null,
        size: null
      },
      defaultDate: [new Date(2019, 3, 12, 1, 1), new Date(2019, 3, 12, 12, 12)],
      dutys: [],
      current_page: 1,
      page_rows: 5,
      total_rows: 0
    }
  },
  created() {
    this.queryDutys()
  },
  methods: {
    queryDutys() {
      this.query_duty.page = this.current_page - 1
      this.query_duty.size = this.page_rows
      getMyDutys(this.query_duty).then(response => {
        if (response.result_code === 5000) {
          if (response.content.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1
            this.queryDutys()
          } else {
            this.dutys = response.content.content
            this.total_rows = response.content.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    selectedDateChange(val) {
      console.log(val)
    },
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.queryDutys()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

