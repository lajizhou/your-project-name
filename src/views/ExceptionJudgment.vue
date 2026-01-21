<template>
  <div class="exception-judgment">
    <!-- 列表页 -->
    <exception-list v-if="!showDetail" @view-detail="handleViewDetail" />

    <!-- 详情页 -->
    <HomeDetails v-else :detail-data="currentDetail" @back="handleBack" />
  </div>
</template>

<script>
import ExceptionList from "./ExceptionList.vue";
import HomeDetails from "./Home/components/details.vue";

export default {
  name: "ExceptionJudgment",
  components: {
    ExceptionList,
    HomeDetails,
  },
  props: {
    showDetail: Boolean,
    currentDetail: Object,
  },
  emits: ["view-detail", "back-to-list"],
  methods: {
    handleViewDetail(row) {
      this.$emit("view-detail", row);
    },

    handleBack() {
      this.$emit("back-to-list");
    },
  },
};
</script>
