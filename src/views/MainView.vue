<!-- 말랑보드의 메이페이지 -->
<!-- 말랑보드에서는 링크를 모아볼수 있습니다. -->
<!-- 오늘 할일 한일 기록 및 깃연동으로 인원별 커밋 내용을 확인할 수 있습니다. -->
<template>
  <div class="main-container">
    <div class="navigation-side-bar">
      <SideBar />
    </div>
    <div>

      <!-- 드래그엔 드랍이 가능한 칸반보드(할일, 보류, 한일, 칸반 추가 기능) -->
      <section>
        <KanbanBoard :boards="boards" />
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import KanbanBoard from "@/components/KanbanBoard.vue";
// import Today from "@/components/Today.vue";
// import Link from "@/components/Link.vue";
// import Github from "@/components/Github.vue";

import { ref } from "vue";
import { Board } from "@/types/KanbanBoard.ts";
import SideBar from "@/components/SideBar.vue";

// 목업 데이터
const boards = ref<Board[]>(
  [
    {
      id: 1,
      status: "todo",
      title: "할일",
      user_idx: 1
    },
    {
      id: 2,
      status: "pending",
      title: "보류",
      user_idx: 1
    },
    {
      id: 3,
      status: "done",
      title: "한일",
      user_idx: 1
    },
  ]
)


</script>
<style scoped lang="scss">
.main-container {
  display: flex;
  gap: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 100px;
  margin-bottom: 100px;

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

// 사이드 메뉴
.navigation-side-bar {
  // display: flex;
  top: 40px;
  left: 0;
  height: 100vh;
  z-index: 100;
  background-color: black;
  overflow-y: scroll;
  padding: 0px;
}
</style>
