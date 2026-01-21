<template>
  <el-aside width="200px" class="sidebar">
    <div class="sidebar-header">
      <h3>管理系统</h3>
    </div>
    <el-menu
      :default-active="activeIndex"
      :unique-opened="true"
      class="sidebar-menu"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span>异常研判</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-user"></i>
        <span>员工管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-office-building"></i>
        <span>部门管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template #title>
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item index="4-1">基础配置</el-menu-item>
        <el-menu-item index="4-2">权限管理</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "AppSidebar",
  props: {
    activeIndex: {
      type: String,
      default: "1",
    },
  },
  methods: {
    handleSelect(index) {
      this.$emit("menu-change", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: #2e3b4e;
  color: #fff;

  &-header {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #3a4a5f;

    h3 {
      margin: 0;
      color: #fff;
      font-size: 18px;
    }
  }

  &-menu {
    border-right: none;
    background-color: #2e3b4e;

    :deep(.el-menu-item),
    :deep(.el-submenu__title) {
      color: #fff;

      &:hover {
        background-color: #3a4a5f;
      }

      &.is-active {
        color: #ffd04b;
        background-color: #3a4a5f;
      }
    }
  }
}
</style>
