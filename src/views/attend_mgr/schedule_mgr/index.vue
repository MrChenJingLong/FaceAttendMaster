<template>
  <div class="app-container">
    <el-form ref="schedule" :model="schedule" :inline="true" label-width="120px">
      <el-form-item style="">
        <el-button type="primary" @click="onSubmit">新增排班</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="schedule.name" class="input-with-select" placeholder="请输入班次名称">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      schedule: {
        name: ''
      }
    }
  },
  created() {
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

