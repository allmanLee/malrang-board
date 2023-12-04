<template>
  <!-- 드래그엔 드랍이 가능한 칸반보드 (한일, 보류, 할일) -->
  <div class="kanban-container">
    <section class="kanban-action-menue-bar">
      <!-- 칸반 추가 버튼 -->
      <!-- 필터 버튼 -->
    </section>
    <div class="kanban-container-boards">

      <div class="kanban-container-boards__panel">
        <!-- 칸반 카드 입니다. (드래그엔드랍기능) -->
        <header class="kanban-container-boards__panel-header">
          <h1 class="kanban-class">할일</h1>
          <menu class="kanban-menu">메뉴</menu>
        </header>
        <KanbanBoardCard ref="kanbanBoardCard" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";



// 사용한 컴포넌트
import KanbanBoardCard from "@/components/KanbanBoardCard.vue";

// 드래그 앤 드랍 기능


</script>
<style scoped lang="scss">
.kanban-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 100px;
  margin-bottom: 100px;
  width: 100%;
  height: 100%;

  .kanban-container-boards {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 100%;
    height: 500px;
    border: 1px solid red;
  }

  .kanban-container-boards__panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 300px;
    height: 100%;
    background-color: #2b2b2b;
  }

  .kanban-container-boards__panel-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 50px;
    background-color: #2b2b2b;
    color: white;
    font-size: 20px;
    font-weight: 700;
    padding: 0 10px;
  }

  .kanban-class {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
  }

  // 확장 메뉴 버튼
  .kanban-menu {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }

}
</style>