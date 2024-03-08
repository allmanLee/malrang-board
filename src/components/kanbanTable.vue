<!-- 칸반 테이블로 보기 -->
<!-- element ui plus 사용 -->

<template>
  <el-table :data="cards" border table-layout="auto" @row-click="handleSelect">
    <!-- 제목 -->
    <el-table-column label="제목" prop="title">
    </el-table-column>
    <!-- 내용 -->
    <el-table-column label="내용" prop="description" width="180" sortable>
      <template v-slot="{ row }">
        <span>{{ row.description }}</span>
      </template>
    </el-table-column>
    <!-- 담당자 -->
    <el-table-column label="담당자" prop="userName" width="180" sortable>

      <template v-slot="{ row }">
        <div class="profile-flex">
          <el-avatar :src="row.userAvatar" size="small" />
          <span>{{ row.userName }}</span>
        </div>
      </template>
    </el-table-column>
    <!-- 상태 -->
    <el-table-column label="보드" prop="boardId" width="180" sortable>

      <template v-slot="{ row }">
        <!-- 보드 제목 -->
        <span>{{ boardTitle(row) }}</span>

      </template>
    </el-table-column>

    <!-- 태그 -->
    <el-table-column label="태그" prop="tags" width="180" sortable>

      <template v-slot="{ row }">
        <div class="tags">
          <el-tag v-for="tag in row.tags" :key="tag" :type="tag.type">{{ tag.label }}</el-tag>
        </div>
      </template>
    </el-table-column>

    <el-table-column v-for="col in optionalField.cols" :key="col.key" :label="col.label" width="180" sortable>

      <template v-slot="{ row }">
        <span>{{ row.optionalData[col.key] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, computed, defineEmits, defineProps } from 'vue'


const emit = defineEmits(['select'])

const props = defineProps({
  cards: {
    type: Array,
    required: true,
  },
  boards: {
    type: Array,
    required: true,
  },
  optionalField: {
    type: Object,
    required: true,
  },
})

console.log(props.optionalField)
const boardTitle = (row) => {
  const board = props.boards.find((board) => board.id === row.boardId)
  return board.title
}

const handleSelect = (selection: any[]) => {
  console.log(selection)
  emit('select', selection)
}
</script>

<style scoped lagn="scss">
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.profile-flex {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
