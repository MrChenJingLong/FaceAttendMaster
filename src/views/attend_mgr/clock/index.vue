<template>
  <div class="app-container">
    <el-form ref="clock" :model="query_clock" :inline="true" label-width="120px">
      <el-form-item style="">
        <el-button type="primary" @click="preAddClock">新增时段</el-button>
        <el-dialog :visible.sync="addClockVisible" title="新增时段">
          <el-form :model="current_clock">
            <el-form-item label="时段名称" >
              <el-input v-model="current_clock.clo_name" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="时段权值" >
              <el-input-number v-model="current_clock.clo_sort" :min="0" :max="10" label="值越大，时段越靠后" @change="handleChange"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addClockVisible=false">取 消</el-button>
            <el-button type="primary" @click="addClock">确 定</el-button>
          </div>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query_clock.name" class="input-with-select" placeholder="请输入时段名称">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>
    <el-table ref="multipleClocksTable" :data="clocks" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="clock_name" label="时段名称" width="120"/>
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
import { addClock } from '@/api/clock'
export default {
  data() {
    return {
      query_clock: {
        name: null
      },
      current_clock: {
        clo_id: null,
        clo_name: null,
        clo_sort: null
      },
      addClockVisible: false,
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      clocks: [],
      multipleSelection: []
    }
  },
  created() {
  },
  methods: {
    clearCurrentClock() {
      this.current_clock.clo_id = null
      this.current_clock.clo_name = null
      this.current_clock.clo_sort = null
    },
    preAddClock() {
      this.clearCurrentClock()
      this.addClockVisible = true
    },
    addClock() {
      addClock(this.current_clock).then(response => {
        console.log(response)
        if (response.result_code === 5000) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(response.result_desc)
        }
        this.addClockVisible = false
      })
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

