<!-- 칸반 테이블로 보기 -->
<!-- element ui plus 사용 -->

<template>
  <!-- 간트 차트로 보기 -->
  <div class="kanban-table-header">
    <h5>총 {{ cards.length }} 개</h5>
    <div class="gantt-select">
      <!-- <el-button text type="default" class="kanban-action-btn__item" round @click="handleClickGantt">
        <el-icon>
          <Postcard v-if="!isGantt" />
          <Calendar v-else />
        </el-icon>
        <span> {{ isGantt ? '표 보기' : '간트 차트 보기' }}</span>
      </el-button> -->

      <el-select v-if="isGantt" v-model="ganttType" placeholder="간트 차트" style="width: 100px"
        @change="handleSelectGantt">
        <el-option v-for="item in ganttColsOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
  <el-table :data="cards" table-layout="auto" @row-click="handleSelect" :border="!isGantt">
    <!-- 제목 -->
    <el-table-column fixed label="제목" prop="title">
    </el-table-column>

    <!-- 담당자 -->
    <el-table-column fixed label="담당자" prop="userName" width="180" sortable>

      <template v-slot="{ row }">
        <div class="profile-flex">
          <el-avatar :src="row.userAvatar" size="small" />
          <span>{{ row.userName }}</span>
        </div>
      </template>
    </el-table-column>

    <!-- 내용 -->
    <el-table-column v-if="!isGantt" label="내용" prop="description" width="180" sortable>

      <template v-slot="{ row }">
        <span>{{ row.description }}</span>
      </template>
    </el-table-column>
    <!-- 상태 -->
    <el-table-column v-if="!isGantt" label="보드" prop="boardId" width="180" sortable>

      <template v-slot="{ row }">
        <!-- 보드 제목 -->
        <span>{{ boardTitle(row) }}</span>

      </template>
    </el-table-column>

    <!-- 태그 -->
    <el-table-column v-if="!isGantt" label="태그" prop="tags" width="180" sortable>

      <template v-slot="{ row }">
        <div class="tags">
          <el-tag v-for="tag in row.tags" :key="tag" :type="tag.type">{{ tag.label }}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-for="col in customField" :key="col.key" :label="col.label" width="180" sortable>

      <template v-slot="{ row }">
        <span v-if="col">{{ row.optionalData[col.key] }}</span>
      </template>
    </el-table-column>


    <!-- 간트 차트 -->
    <el-table-column v-for="col in ganttCols" :key="col.key" :label="col.label" width="180" class-name="gantt-col">

      <template v-slot="{ row }">
        <div class="test">
          <!-- 7일  -->
        </div>
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


/* -------------------------------- 간트 차트 ------------------------------- */
const isGantt = ref(false);
const handleClickGantt = () => {
  // ElNotification({
  //   title: "준비중인 기능입니다.",
  //   message: "간트 차트 기능은 준비중입니다.",
  //   type: "warning",
  // });

  isGantt.value = !isGantt.value;
  // 처음은 주단위로 설정
  handleSelectGantt('Week')
  ganttType.value = 'Week'
}

// 좌우 스크롤 시 일정이 있는데 보이지 않을 경우 왼쪽 또는 오른쪽에 고정하여 화살표로 표시
window.addEventListener('scroll', () => {
  const table = document.querySelector('.el-table__body-wrapper')
  if (table) {
    const scrollLeft = table.scrollLeft
    const scrollWidth = table.scrollWidth
    const clientWidth = table.clientWidth
    if (scrollLeft > 0) {
      // 왼쪽 화살표 표시
      table.classList.add('scroll-left')
    } else {
      table.classList.remove('scroll-left')
    }
    if (scrollLeft + clientWidth < scrollWidth) {
      // 오른쪽 화살표 표시
      table.classList.add('scroll-right')
    } else {
      table.classList.remove('scroll-right')
    }
  }
})


const customField = computed(() => {
  return isGantt.value ?
    [] :
    props.optionalField.cols.map((col) => {
      return {
        label: col.label,
        key: col.key,
      }
    })
})
const boardTitle = (row) => {
  const board = props.boards.find((board) => board.id === row.boardId)
  return board.title
}

const ganttCols = ref([])
const ganttType = ref('Day')


// 간트 차트 컬럼 변경

// ganttCols 는 기본 'Day' 이며, week, month, year 등으로 변경 가능
const ganttColsOptions = [
  {
    label: 'Week',
    value: 'Week',
  },
  {
    label: 'Month',
    value: 'Month',
  },
  {
    label: 'Year',
    value: 'Year',
  },
]

const handleSelectGantt = (val) => {
  console.log(val)
  ganttCols.value = []
  if (val === 'Week') {
    // 주차만큼 생성합니다. (1년치)
    for (let i = 0; i < 52; i++) {
      ganttCols.value.push({
        key: i,
        label: i + 1,
      })
    }
  } else if (val === 'Month') {
    // 월만큼 생성합니다. (1년치)
    for (let i = 0; i < 12; i++) {
      ganttCols.value.push({
        key: i,
        label: i + 1,
      })
    }
  } else if (val === 'Year') {
    // 년만큼 생성합니다. (1년치)
    for (let i = 0; i < 1; i++) {
      ganttCols.value.push({
        key: i,
        label: i + 1,
      })
    }
  }
}

const handleSelect = (selection: any[]) => {
  console.log(selection)
  emit('select', selection)
}

</script>

<style scoped lang="scss">
.kanban-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

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

/* ---------------------------------- 간트 차트 --------------------------------- */
.test {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px;
  background-color: $primary;
}
</style>

<style lang="scss"></style>
