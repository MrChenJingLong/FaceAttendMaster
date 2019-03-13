<template>
  <div class="app-container">
    <el-form ref="dutyForm" :model="query_duty" :inline="true" label-width="120px">
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
        <el-button type="primary" @click="queryDuty">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query_duty: {
        start_time: null,
        end_time: null
      },
      defaultDate: [new Date(2019, 3, 12, 1, 1), new Date(2019, 3, 12, 12, 12)]
    }
  },
  created() {
  },
  methods: {
    queryDuty() {
      this.$message('submit!')
    },
    selectedDateChange(val) {
     console.log(val)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

