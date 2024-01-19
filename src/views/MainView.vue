<!-- 말랑보드의 메이페이지 -->
<!-- 말랑보드에서는 링크를 모아볼수 있습니다. -->
<!-- 오늘 할일 한일 기록 및 깃연동으로 인원별 커밋 내용을 확인할 수 있습니다. -->
<template>
  <div class="main-container">
    <div class="navigation-side">

    </div>

    <!-- 드래그엔 드랍이 가능한 칸반보드(할일, 보류, 한일, 칸반 추가 기능) -->
    <section class="container">
      <board-empty v-if="!boards.length"></board-empty>
      <KanbanBoard v-else :boards="boards" />
    </section>
  </div>
</template>
<script setup lang="ts">
import KanbanBoard from "@/components/KanbanBoard.vue";
import BoardEmpty from "@/components/BoardEmpty.vue";
// import Today from "@/components/Today.vue";
// import Link from "@/components/Link.vue";
// import Github from "@/components/Github.vue";

import { ref } from "vue";
import type { Board } from "@/types/KanbanBoard.ts";

// 목업 데이터
// const boards = ref([])
const boards = ref<Board[]>(
  [
    {
      id: 1,
      status: "todo",
      title: "할일",
      kanbanId: 'asdfasvd',
      permission: "admin",
      order: 1,
      teamId: 'asdf',
    },
    {
      id: 2,
      status: "pending",
      title: "보류",
      kanbanId: 'asdfasvd',
      permission: "admin",
      order: 2,
      teamId: 'asdf',
    },
    {
      id: 3,
      status: "done",
      title: "한일",
      kanbanId: 'asdfasvd',
      permission: "admin",
      order: 3,
      teamId: 'asdf',
    },
  ]
)


</script>
<style scoped lang="scss">
.main-container {
  display: flex;
  width: 100%;
  padding: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  section {
    width: 100%;
  }

  h1 {
    font-size: 40px;
    font-weight: 700;
  }

  p {
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
