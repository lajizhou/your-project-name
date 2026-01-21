<template>
  <el-main style="background: #fff; padding: 20px">
    <div class="details-container">
      <!-- 用户信息卡片 -->
      <el-card class="user-info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">📊 用户信息</span>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名称" label-class-name="desc-label">
            <span class="user-name">{{ detailData.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="电压等级" label-class-name="desc-label">
            {{ detailData.mgtOrgName || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="用户编号" label-class-name="desc-label">
            <el-tag type="info" size="small">{{ detailData.userId }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            label="核算包编号"
            label-class-name="desc-label"
          >
            <el-tag type="success" size="small">{{
              detailData.chkCalcPic || "--"
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="行业类别" label-class-name="desc-label">
            {{ detailData.position || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="分析状态" label-class-name="desc-label">
            <el-tag
              :type="reportList.result == '1' ? 'danger' : 'success'"
              size="small"
            >
              {{ reportList.result == "1" ? "真异常" : "假异常" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 分析过程区域 -->
      <div class="analysis-process-section">
        <div class="section-header" @click="toggleAnalysisProcess">
          <div class="header-title">
            <i
              :class="
                borderShow === '2'
                  ? 'el-icon-arrow-down'
                  : 'el-icon-arrow-right'
              "
            ></i>
            <span class="title-text">🔍 分析过程</span>
            <el-tag v-if="reportList.procedure?.length" size="mini" type="info">
              {{ reportList.procedure.length }} 步
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button
              type="text"
              size="small"
              @click.stop="toggleAnalysisProcess"
            >
              {{ borderShow === "2" ? "收起" : "展开" }}
            </el-button>
          </div>
        </div>

        <!-- 展开的内容 -->
        <transition name="el-zoom-in-top">
          <div v-show="borderShow === '2'" class="process-content">
            <!-- 步骤时间线 -->
            <div v-if="procedureSteps.length" class="process-timeline">
              <div class="timeline-header">
                <span class="timeline-title">📈 分析步骤时间线</span>
                <el-tag size="small" effect="dark" type="primary"
                  >共 {{ procedureSteps.length }} 步</el-tag
                >
                <el-button
                  v-if="activeStepIndex !== 0"
                  type="text"
                  size="small"
                  @click="jumpToStep(0)"
                >
                  回到第一步
                </el-button>
              </div>

              <div class="timeline-steps">
                <div
                  v-for="(step, index) in procedureSteps"
                  :key="index"
                  class="timeline-step"
                  :class="{ 'active-step': activeStepIndex === index }"
                  @click="jumpToStep(index)"
                >
                  <div class="step-marker">
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-icon" :class="step.iconClass"></div>
                  </div>
                  <div class="step-content">
                    <div class="step-title">{{ step.title }}</div>
                    <div class="step-time">{{ step.time }}</div>
                    <div class="step-action">{{ step.action }}</div>
                    <div
                      v-if="activeStepIndex === index"
                      class="step-indicator"
                    >
                      <i class="el-icon-position"></i> 当前选中
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 详细分析过程 -->
            <div class="analysis-details">
              <!-- 步骤导航 -->
              <div v-if="procedureSteps.length > 1" class="step-navigation">
                <el-button
                  :disabled="activeStepIndex === 0"
                  size="small"
                  @click="prevStep"
                >
                  <i class="el-icon-arrow-left"></i> 上一步
                </el-button>

                <div class="step-info">
                  当前步骤: <strong>{{ activeStepIndex + 1 }}</strong> /
                  {{ procedureSteps.length }}
                  <span class="step-action-info">{{
                    procedureSteps[activeStepIndex]?.action
                  }}</span>
                </div>

                <el-button
                  :disabled="activeStepIndex === procedureSteps.length - 1"
                  size="small"
                  @click="nextStep"
                >
                  下一步 <i class="el-icon-arrow-right"></i>
                </el-button>
              </div>

              <!-- 合并的对话和工具记录 -->
              <div class="details-section">
                <div class="section-title">
                  <i class="el-icon-chat-dot-round"></i>
                  <span>分析过程记录</span>
                  <el-tag v-if="mergedContent.length" size="mini" type="info">
                    {{ mergedContent.length }} 条记录
                  </el-tag>
                </div>
                <div class="merged-container" v-if="mergedContent.length">
                  <div
                    v-for="(item, index) in mergedContent"
                    :key="index"
                    class="merged-item"
                    :class="{ 'active-item': isItemActive(index) }"
                  >
                    <div class="item-time">{{ formatTime(item.time) }}</div>
                    <div
                      class="item-content"
                      :class="{
                        'tool-item': item.type === 'tool',
                        'user-dialog': item.type === 'user',
                        'system-dialog': item.type === 'system',
                      }"
                    >
                      <div class="content-header">
                        <i
                          :class="
                            item.type === 'tool'
                              ? 'el-icon-cpu'
                              : item.type === 'user'
                              ? 'el-icon-user'
                              : 'el-icon-chat-line-round'
                          "
                        ></i>
                        <span class="content-type">{{
                          item.type === "tool"
                            ? "工具调用"
                            : item.type === "user"
                            ? "用户"
                            : "系统"
                        }}</span>
                        <el-tag
                          size="mini"
                          :type="
                            item.type === 'tool'
                              ? 'warning'
                              : item.type === 'user'
                              ? 'primary'
                              : 'success'
                          "
                        >
                          {{ item.type }}
                        </el-tag>
                        <span class="item-action">{{ item.action }}</span>
                      </div>
                      <div class="content-body">
                        <!-- 工具内容 -->
                        <div v-if="item.type === 'tool'" class="tool-details">
                          <div class="tool-name">
                            <strong>工具名称：</strong>{{ item.name }}
                          </div>
                        </div>
                        <!-- 对话内容 -->
                        <div v-else class="dialog-content">
                          <pre v-if="isJSON(item.content)">{{
                            formatJSON(item.content)
                          }}</pre>
                          <span v-else>{{ item.content }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="el-icon-chat-line-square"></i>
                  <span>暂无分析过程记录</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 分析结果区域 -->
      <el-card class="result-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">🎯 分析结果</span>
            <el-tag v-if="reportList.result == '1'" type="danger" effect="dark">
              ⚠️ 发现异常
            </el-tag>
            <el-tag v-else type="success" effect="dark"> ✓ 正常 </el-tag>
          </div>
        </template>

        <div class="markdown-content" v-html="renderedMarkdown"></div>

        <div v-if="reportList.result == '1'" class="result-warning">
          <i class="el-icon-warning"></i>
          <span>检测到异常情况，建议下发异常工单进行进一步处理</span>
        </div>
        <div v-else class="result-success">
          <i class="el-icon-success"></i>
          <span>分析结果正常，无需下发工单</span>
        </div>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          v-if="reportList.result == '1'"
          type="primary"
          size="large"
          @click="submitted"
          class="action-btn"
          icon="el-icon-s-promotion"
        >
          下发异常工单
        </el-button>
        <el-button
          type="info"
          size="large"
          @click="back"
          class="action-btn"
          plain
          icon="el-icon-back"
        >
          返回列表
        </el-button>
      </div>
    </div>
  </el-main>
</template>

<script>
import { marked } from "marked";
import hljs from "highlight.js";
import { getReportById } from "@/utils/index";

export default {
  name: "HomeDetails",
  props: {
    detailData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      borderShow: "1",
      markdownSource: "",
      renderedMarkdown: "",
      reportList: {},
      mergedContent: [], // 合并的对话和工具记录
      procedureSteps: [],
      activeStepIndex: 0,
      originalProcedureData: [], // 保存原始数据用于映射
    };
  },
  mounted() {
    this.exportFn();
  },
  methods: {
    async exportFn() {
      try {
        const response = await getReportById(this.detailData.userId);
        if (response.code === 200) {
          this.reportList = response.data;
          this.originalProcedureData = this.reportList.procedure || [];
          this.processProcedureData();
          this.markdownSource = this.reportList.report || "";
          this.renderMarkdownContent();
        } else {
          this.$message.warning(response.message);
          this.reportList = {};
        }
      } catch (error) {
        console.error("获取报告详情失败:", error);
        this.$message.error("获取报告详情失败");
      }
    },

    processProcedureData() {
      this.mergedContent = [];
      this.procedureSteps = [];

      if (
        !this.reportList.procedure ||
        !Array.isArray(this.reportList.procedure)
      ) {
        return;
      }

      this.reportList.procedure.forEach((item, index) => {
        let contentObj;
        try {
          contentObj =
            typeof item.content === "string"
              ? JSON.parse(item.content)
              : item.content;
        } catch (e) {
          contentObj = item.content;
        }

        // 创建步骤时间线数据
        const step = {
          time: this.formatTime(item.time),
          action: item.action,
          title: contentObj?.name || `步骤 ${index + 1}`,
          iconClass: contentObj?.name ? "tool-step" : "dialog-step",
          originalIndex: index, // 保存原始索引
          isTool: !!contentObj?.name,
        };

        this.procedureSteps.push(step);

        // 合并处理所有内容（工具和对话一起）
        if (contentObj && typeof contentObj === "object" && contentObj.name) {
          // 工具内容
          this.mergedContent.push({
            type: "tool",
            time: item.time,
            action: item.action,
            name: contentObj.name,
            arguments: contentObj.arguments,
            originalIndex: index,
          });
        } else {
          // 对话内容，区分用户和系统
          const dialogType = item.action === "user" ? "user" : "system";
          this.mergedContent.push({
            type: dialogType,
            time: item.time,
            action: item.action,
            content:
              typeof contentObj === "object"
                ? JSON.stringify(contentObj, null, 2)
                : contentObj,
            originalIndex: index,
          });
        }
      });
    },

    // 跳转到指定步骤
    jumpToStep(index) {
      if (index >= 0 && index < this.procedureSteps.length) {
        this.activeStepIndex = index;

        // 滚动到对应的内容
        this.$nextTick(() => {
          const item = document.querySelector(
            `.merged-item:nth-child(${index + 1})`
          );
          if (item) {
            item.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    },

    // 判断项目是否激活
    isItemActive(index) {
      return this.activeStepIndex === index;
    },

    // 上一步
    prevStep() {
      if (this.activeStepIndex > 0) {
        this.jumpToStep(this.activeStepIndex - 1);
      }
    },

    // 下一步
    nextStep() {
      if (this.activeStepIndex < this.procedureSteps.length - 1) {
        this.jumpToStep(this.activeStepIndex + 1);
      }
    },

    renderMarkdownContent() {
      marked.setOptions({
        highlight: (code, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
              console.error("代码高亮错误:", err);
            }
          }
          return hljs.highlightAuto(code).value;
        },
        gfm: true,
        breaks: true,
        sanitize: true,
        tables: true,
        headerIds: true,
      });

      try {
        this.renderedMarkdown = marked.parse(
          this.markdownSource || "暂无分析结果"
        );
      } catch (error) {
        console.error("Markdown解析错误:", error);
        this.renderedMarkdown = `<div class="error-content">分析结果解析失败</div>`;
      }
    },

    toggleAnalysisProcess() {
      this.borderShow = this.borderShow === "1" ? "2" : "1";
    },

    formatTime(timeString) {
      if (!timeString) return "--";
      try {
        const date = new Date(timeString);
        return date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch (e) {
        return timeString;
      }
    },

    isJSON(str) {
      if (typeof str !== "string") return false;
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    },

    formatJSON(jsonStr) {
      try {
        const obj = JSON.parse(jsonStr);
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return jsonStr;
      }
    },

    formatArguments(args) {
      if (!args) return "无参数";
      if (typeof args === "string") return args;
      return JSON.stringify(args, null, 2);
    },

    submitted() {
      this.$confirm("确定要下发异常工单吗？", "确认下发", {
        confirmButtonText: "确认下发",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "el-button--danger",
        center: true,
      })
        .then(() => {
          // 这里添加下发工单的实际逻辑
          this.$message.success("工单下发成功！");
        })
        .catch(() => {
          this.$message.info("已取消下发");
        });
    },

    back() {
      this.$emit("back", "1");
    },
  },
};
</script>

<style scoped>
.details-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 卡片样式 */
.user-info-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.user-name {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
}

:deep(.desc-label) {
  font-weight: 600;
  color: #606266;
  background-color: #f5f7fa !important;
}

/* 分析过程区域 */
.analysis-process-section {
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
  background: #fff;
}

.analysis-process-section:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
}

.section-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.section-header:hover {
  background: linear-gradient(135deg, #e4e7ed 0%, #d3d6de 100%);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-text {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 时间线样式 */
.process-timeline {
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.timeline-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.timeline-steps {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding: 10px 0;
}

.timeline-step {
  flex: 0 0 auto;
  width: 200px;
  padding: 15px;
  border-radius: 8px;
  background: #fff;
  border: 2px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.timeline-step:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.timeline-step.active-step {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  animation: pulse-active 2s infinite;
}

.step-marker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.timeline-step.active-step .step-number {
  background: #ff6b6b;
  transform: scale(1.1);
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.step-icon.tool-step {
  background: #67c23a;
  position: relative;
}

.step-icon.tool-step::before {
  content: "⚙️";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

.step-icon.dialog-step {
  background: #e6a23c;
  position: relative;
}

.step-icon.dialog-step::before {
  content: "💬";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-time,
.step-action {
  font-size: 11px;
  color: #909399;
}

.step-indicator {
  margin-top: 6px;
  padding: 3px 8px;
  background: #409eff;
  color: white;
  border-radius: 4px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: fadeIn 0.3s ease;
}

/* 步骤导航 */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.step-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.step-action-info {
  padding: 2px 8px;
  background: #e4e7ed;
  border-radius: 4px;
  font-size: 12px;
  color: #303133;
}

/* 详细分析过程 */
.analysis-details {
  padding: 20px;
  background: #fff;
}

.details-section {
  margin-bottom: 30px;
}

.details-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

/* 合并的记录容器 */
.merged-container {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.merged-item {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px;
}

.merged-item.active-item {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border: 2px solid #409eff;
  padding: 10px;
  animation: highlight-item 2s ease-in-out;
}

.item-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-time::before {
  content: "🕒";
  font-size: 10px;
}

/* 内容样式 */
.item-content {
  padding: 16px;
  border-radius: 10px;
  position: relative;
  animation: fadeIn 0.3s ease;
  border-left: 4px solid;
}

.tool-item {
  background: linear-gradient(135deg, #fff7e6 0%, #fff1cc 100%);
  border-color: #e6a23c;
  border: 1px solid #ffe7ba;
}

.user-dialog {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #409eff;
  border: 1px solid #b3d8ff;
}

.system-dialog {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #67c23a;
  border: 1px solid #c2e7b0;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.content-type {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.item-action {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

/* 工具详情样式 */
.tool-details {
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px solid #ffe7ba;
}

.tool-name {
  margin-bottom: 8px;
  font-size: 14px;
  color: #e6a23c;
}

.tool-name strong {
  color: #606266;
}

.tool-arguments {
  margin-top: 8px;
}

.tool-arguments strong {
  color: #606266;
  font-size: 13px;
}

.tool-arguments pre {
  margin: 8px 0 0 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  max-height: 150px;
  overflow: auto;
  border: 1px solid #dcdfe6;
}

/* 对话内容样式 */
.dialog-content {
  font-size: 13px;
  line-height: 1.6;
  padding: 8px;
}

.dialog-content pre {
  margin: 0;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #fafafa;
  border-radius: 8px;
  color: #909399;
  gap: 10px;
}

.empty-state i {
  font-size: 40px;
  color: #c0c4cc;
}

/* 分析结果卡片 */
.result-card {
  margin: 20px 0;
  border-radius: 12px;
}

.markdown-content {
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.7;
}

:deep(.markdown-content h1) {
  font-size: 18px;
  color: #303133;
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.markdown-content h2) {
  font-size: 16px;
  color: #303133;
  margin: 18px 0 12px;
}

:deep(.markdown-content h3) {
  font-size: 15px;
  color: #303133;
  margin: 16px 0 10px;
}

:deep(.markdown-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

:deep(.markdown-content th) {
  background: #f5f7fa;
  font-weight: 600;
  padding: 10px;
  border: 1px solid #dcdfe6;
}

:deep(.markdown-content td) {
  padding: 10px;
  border: 1px solid #dcdfe6;
}

:deep(.markdown-content code) {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
}

:deep(.markdown-content pre) {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
  margin: 12px 0;
}

.result-warning {
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f56c6c;
  font-weight: 500;
  animation: pulse 2s infinite;
}

.result-success {
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #67c23a;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.action-btn {
  min-width: 150px;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulse-active {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(64, 158, 255, 0);
  }
}

@keyframes highlight-item {
  0%,
  100% {
    background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  }
  50% {
    background: linear-gradient(135deg, #d9ecff 0%, #c6e2ff 100%);
  }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .details-container {
    padding: 0 10px;
  }

  .timeline-steps {
    flex-direction: column;
    overflow-x: visible;
  }

  .timeline-step {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .step-navigation {
    flex-direction: column;
    gap: 12px;
  }

  .content-header {
    flex-wrap: wrap;
    gap: 6px;
  }

  .item-action {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
