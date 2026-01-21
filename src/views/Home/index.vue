<template>
  <el-container class="layout-container">
    <!-- 侧边栏导航 -->
    <app-sidebar
      :active-index="activeMenuIndex"
      @menu-change="handleMenuChange"
    />

    <!-- 主内容区域 -->
    <el-main class="main-content">
      <!-- 异常研判页面 -->
      <exception-judgment
        v-if="activeMenuIndex === '1'"
        :show-detail="showDetail"
        :current-detail="currentDetail"
        @view-detail="handleViewDetail"
        @back-to-list="handleBackToList"
      />
    </el-main>
  </el-container>
</template>

<script>
import AppSidebar from "./components/AppSidebar.vue";
import ExceptionJudgment from "../ExceptionJudgment.vue";

export default {
  name: "MainLayout",
  components: {
    AppSidebar,
    ExceptionJudgment,
  },
  data() {
    return {
      activeMenuIndex: "1", // 当前激活的菜单项
      showDetail: false, // 是否显示详情页
      currentDetail: {}, // 当前查看的详情数据
    };
  },
  methods: {
    /**
     * 处理菜单切换
     */
    handleMenuChange(index) {
      this.activeMenuIndex = index;
      // 切换菜单时返回列表页
      this.showDetail = false;
    },

    /**
     * 查看详情
     */
    handleViewDetail(row) {
      console.log(row);

      this.currentDetail = row;
      this.showDetail = true;
    },

    /**
     * 返回列表
     */
    handleBackToList() {
      this.showDetail = false;
      this.currentDetail = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  padding: 20px;
  background-color: #fff;
  overflow-y: auto;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style>
