<template>
  <div class="exception-list">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form
        ref="searchForm"
        :model="searchForm"
        inline
        @submit.prevent="handleSearch"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户名称">
              <el-input
                v-model="searchForm.userName"
                placeholder="输入用户名称"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户编号">
              <el-input
                v-model="searchForm.userId"
                placeholder="输入用户编号"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="电压等级">
              <el-select
                v-model="searchForm.voltageLevel"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in voltageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="日期">
              <el-date-picker
                v-model="searchForm.date"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <el-tabs v-model="activeTab" @tab-click="handleTabChange">
            <el-tab-pane label="电量异常研判" name="power" />
            <el-tab-pane label="电费异常研判" name="fee" />
          </el-tabs>
        </div>
      </template>

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        @sort-change="handleSortChange"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          prop="mgtOrgName"
          label="供电单位"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column prop="chkCalcPic" label="核算包编号" width="120" />
        <el-table-column prop="userId" label="用户编号" width="150" />
        <el-table-column
          prop="name"
          label="用户名称"
          width="100"
          align="center"
        />
        <el-table-column
          prop="ruleTriggered"
          label="触发审核规则"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="abnormal"
          label="研判结果"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ruleName"
          label="规则名称"
          width="200"
          show-overflow-tooltip
        />

        <!-- 动态列（根据tab切换） -->
        <template v-if="activeTab === 'power'">
          <el-table-column
            prop="thisMonthQty"
            label="本月电量"
            width="120"
            align="right"
          />
          <el-table-column
            prop="lastMonthQty"
            label="上月电量"
            width="120"
            align="right"
          />
          <el-table-column
            prop="lastMonusQty"
            label="增减量"
            width="120"
            align="right"
          >
            <template #default="{ row }">
              <span :class="getChangeClass(row.lastMonusQty)">
                {{ formatNumber(row.lastMonusQty) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastMonthRate"
            label="波动率"
            width="120"
            align="right"
          >
            <template #default="{ row }">
              <span :class="getChangeClass(row.lastMonthRate)">
                {{ row.lastMonthRate }}
              </span>
            </template>
          </el-table-column>
        </template>

        <template v-else>
          <el-table-column
            prop="thisMonthQty"
            label="本月电费"
            width="120"
            align="right"
          />
          <el-table-column
            prop="lastMonthQty"
            label="上月电费"
            width="120"
            align="right"
          />
          <el-table-column
            prop="lastMonusQty"
            label="增减量"
            width="120"
            align="right"
          >
            <template #default="{ row }">
              <span :class="getChangeClass(row.lastMonusQty)">
                ¥{{ formatNumber(row.lastMonusQty) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastMonthRate"
            label="波动率"
            width="120"
            align="right"
          >
            <template #default="{ row }">
              <span :class="getChangeClass(row.lastMonthRate)">
                {{ row.lastMonthRate }}
              </span>
            </template>
          </el-table-column>
        </template>

        <!-- 操作列 -->
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleViewDetail(row)"
              :disabled="row.abnormal === '无异常'"
            >
              研判
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { mockTableData } from "@/utils/mockData";
export default {
  name: "ExceptionList",
  emits: ["view-detail"],
  data() {
    return {
      activeTab: "power",
      searchForm: {
        userName: "",
        userId: "",
        voltageLevel: "",
        date: "",
      },
      voltageOptions: [
        { value: "220V", label: "220V" },
        { value: "380V", label: "380V" },
        { value: "10kV", label: "10kV" },
        { value: "35kV", label: "35kV" },
        { value: "110kV", label: "110kV" },
      ],
      tableData: [],
      loading: false,
      pagination: {
        current: 1,
        size: 20,
        total: 0,
      },
      sortParams: {},
    };
  },
  mounted() {
    this.fetchTableData();
  },
  methods: {
    /**
     * 获取表格数据
     */
    async fetchTableData() {
      this.loading = true;
      try {
        // 模拟API调用
        const { data, total } = await mockTableData({
          ...this.searchForm,
          ...this.sortParams,
          page: this.pagination.current,
          size: this.pagination.size,
          type: this.activeTab,
        });
        data.map((item) => {
          if (item.abnormal == "1") {
            item.abnormal = "真异常";
          } else {
            item.abnormal = "假异常";
          }
        });
        this.tableData = data;
        this.pagination.total = total;
      } catch (error) {
        console.error("获取数据失败:", error);
        this.$message.error("获取数据失败");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 处理搜索
     */
    handleSearch() {
      this.pagination.current = 1;
      this.fetchTableData();
    },

    /**
     * 处理重置
     */
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.sortParams = {};
      this.handleSearch();
    },

    /**
     * 处理标签页切换
     */
    handleTabChange() {
      this.fetchTableData();
    },

    /**
     * 处理排序
     */
    handleSortChange({ prop, order }) {
      this.sortParams = {
        sortField: prop,
        sortOrder: order,
      };
      this.fetchTableData();
    },

    /**
     * 处理分页大小变化
     */
    handleSizeChange(size) {
      this.pagination.size = size;
      this.fetchTableData();
    },

    /**
     * 处理页码变化
     */
    handleCurrentChange(page) {
      this.pagination.current = page;
      this.fetchTableData();
    },

    /**
     * 查看详情
     */
    handleViewDetail(row) {
      this.$emit("view-detail", row);
    },

    /**
     * 获取变化样式类
     */
    getChangeClass(value) {
      if (typeof value === "string") {
        return value.startsWith("-") ? "negative" : "positive";
      }
      return value < 0 ? "negative" : "positive";
    },

    /**
     * 格式化数字
     */
    formatNumber(num) {
      if (isNaN(num)) return num;
      return Number(num).toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.exception-list {
  .search-card {
    margin-bottom: 20px;

    .form-actions {
      text-align: right;
      padding-top: 10px;
    }
  }

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .positive {
    color: #f56c6c;
  }

  .negative {
    color: #67c23a;
  }
}
</style>
