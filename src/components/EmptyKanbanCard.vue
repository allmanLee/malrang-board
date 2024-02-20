<template>
  <div class="emptyKanbanCard" @click="handleClickToAdd">
    <div class="emptyKanbanCard__body">
      <div class="emptyKanbanCard__icon">
        <el-icon class="kanban-menu menu-icon">
          <Plus />
        </el-icon>
      </div>
      <div class="emptyKanbanCard__text">새 카드 추가</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import { ElIcon } from "element-plus";

const emit = defineEmits(["add"]);

const handleClickToAdd = () => {
  emit("add");
};

</script>

<style scoped lang="scss">
.emptyKanbanCard {
  width: 100%;
  height: 120px;
  // border: 1px dashed $gray-300;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;

  .emptyKanbanCard__body {
    display: flex;
    flex-direction: column;
    align-items: center;

    .emptyKanbanCard__icon {
      font-size: 20px;
      color: $gray-300;
    }

    .emptyKanbanCard__text {
      font-size: 14px;
      color: $gray-700;
      margin-top: 10px;
    }
  }
}

html.dark {
  border: 1px dashed $dark-gray-300;
}


/* -------------------------------- Hover 스타일 ------------------------------- */
.emptyKanbanCard:hover {
  // background-color: $background-transparent-secondary;
  border: 1px dashed $primary;
  cursor: pointer;
}

// 다크모드
</style>