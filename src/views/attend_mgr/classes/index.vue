<template>
  <div class="app-container">
    <el-form ref="classes" :model="query_classes" :inline="true" label-width="120px">
      <el-form-item style="">
        <el-button type="primary" @click="preAddClasses">新增班次</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query_classes.name" class="input-with-select" placeholder="请输入班次名称">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>
    <el-table ref="multipleClassesTable" :data="roles" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="role_name" label="角色名称" width="120"/>
      <el-table-column prop="post-sel" label="岗位查询"/>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query_classes: {
        name: '',
        time: ''
      },
      classes: []
    }
  },
  created() {
  },
  methods: {
    preAddClasses() {
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

