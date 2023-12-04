<template>
  <div class="kanban-board-card">
    <div class="kanban-board-card-header">
      <div class="kanban-board-card-header-title">
        카드 제목
      </div>
    </div>
    <div class="kanban-board-card-body">
      카드 내용
    </div>
    <div class="kanban-board-card-tags">
      <div class="kanban-board-card-tags-tag">
        태그
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

// const props = defineProps<{
//   board: Board;
// }>();

// const board = props.board;
</script>
<style scoped lang="scss">
.kanban-board-card {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 600px;
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 20px;

  .kanban-board-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    padding: 20px;

    .kanban-board-card-header-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }
  }

  .kanban-board-card-body {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 50px;
    background-color: #2b2b2b;
    padding: 20px;

    .kanban-board-card-body-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }
  }

  .kanban-board-card-tags {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 50px;
    background-color: #2b2b2b;
    padding: 20px;

    .kanban-board-card-tags-tag {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }
  }
}
</style>