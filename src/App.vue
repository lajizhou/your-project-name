<template>
  <div id="app">
    <!-- 路由出口 - 这里会渲染 Home 等页面 -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {},
  created() {
    // 应用初始化逻辑
    console.log("应用启动");
  },
};
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 应用根样式 */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
header {
  background: #f8f9fa;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  gap: 1rem;
}

.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}

/* 主内容区 */
main {
  flex: 1;
  /* padding: 2rem; */
}

/* 页脚样式 */
footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}

/* 全局链接样式 */
a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
