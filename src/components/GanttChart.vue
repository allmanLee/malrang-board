<template>
  <div class="gantt-header">
    <div class="yeads-text_wrapper">
      <!-- 연도 변경(왼쪽 화살표 버튼) -->
      <div class="years-text">
        <el-button type="text" @click="handleSelectGantt('Week')" class="text-year-button">2023년</el-button>
      </div>

      <div class="years-text">
        2024년
      </div>
      <!-- 연도 변경(오른쪽 화살표 버튼) -->
      <div class="years-text">
        <el-button type="text" @click="handleSelectGantt('Week')" class="text-year-button">2025년</el-button>
      </div>
    </div>

    <!-- 보기(주, 월) 스위치 -->
    <div class="view-btns-wrapper">
      <el-button type="text" @click="handleSelectGantt('Week')" class="text-year-button">주</el-button>
      <el-button type="text" @click="handleSelectGantt('Month')" class="text-year-button">월</el-button>
    </div>
  </div>
  <el-table :data="cards" table-layout="auto" @row-click="handleSelect" :border="false" class="gantt-left">
    <!-- 제목 -->
    <el-table-column fixed label="제목" prop="title" width="300">
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


    <!-- 간트 차트 -->
    <!-- label은 일수로 표현 (몇월 몇일로 표현) -->
    <el-table-column v-for="(col, index) in  ganttCols " :key="col.date" :label="formatDate(col.date)" width=" 180"
      class-name="gantt-col">
      <!-- 마감일 (endDate) 만큼만 표시 색칠 -->
      <template v-slot="{ row }">
        <div class="gantt-chart">
          <div
            v-if="(row.endDate && row.startDate) && (new Date(row.endDate) >= col.date && new Date(row.startDate) <= col.date)"
            class="gantt-chart-content-item" :style="{ width: '100%', background: '#409EFF' }">
            {{ row.title }}
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'


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

// 날짜 포맷 (MM월 DD일(요일))
const formatDate = (date: string) => {
  const newDate = new Date(date)
  const month = newDate.getMonth() + 1
  const day = newDate.getDate()
  const week = newDate.getDay()
  const weekList = ['일', '월', '화', '수', '목', '금', '토']
  return `${month}월 ${day}일(${weekList[week]})`
}


const ganttCols = ref([])



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

const ganttType = ref('Day')


const handleSelectGantt = (val) => {
  console.log(val)

  // 2024년 1월 1일부터 1년치 날짜를 생성합니다.
  const key = new Date('2024-01-01')
  // ganttCols.value = []
  if (val === 'Week') {
    // 주차만큼 생성합니다. (1년치)
    Array.from({ length: 52 }, (_, i) => {
      ganttCols.value.push({
        key: i + 1,
        date: new Date(key.setDate(key.getDate() + 7)),
        label: i + 1,
      })
    })
  }
}

// 간트 차크 초기 설정
handleSelectGantt('Week')
ganttType.value = 'Week'

const handleSelect = (selection: any[]) => {
  console.log(selection)
  emit('select', selection)
}

</script>

<style lang="scss" scoped>
.gantt-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  // border: 1px solid red;

  .yeads-text_wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 400px;
    padding: 20px;
    // border: 1px solid red;

    .text-year-button {
      font-size: 20px;
      font-weight: bold;
      opacity: 0.5;
    }
  }

  .view-btns-wrapper {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}

.gantt-chart {
  display: flex;
  width: 100%;
  // padding: 20px;
  // border: 1px solid red;
  overflow: scroll;
}
</style>

<style lang="scss">
.el-table__row {
  cursor: pointer;
  border-radius: 50%;
  // background-color: red;
}

.gantt-col {
  .cell {
    display: flex;
    align-items: center;
    padding: 0px !important;

    .gantt-chart-content-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0px;
      background-color: #409eff;
      color: white;
      // border-radius: 5px;
      margin: 0px;
    }
  }
}

.years-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}
</style>
```