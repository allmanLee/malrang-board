<template>
  <div class="kanban-container">
    <div class="kanban-header">
      <h2 class="kanban-header__title">
        <span>{{ kanbanInfo.projectName }}</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
        <span>{{ kanbanInfo.teamName }}</span>
      </h2>
      <el-input class="kanban-search" v-model="searchValue" placeholder="티켓의 제목, 담당자, 태그를 생각나는거 있어요?" clearable>
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <!-- 프로필 -->
      <article class="kanban-header__profiles">
        <!-- 본인 -->
        <el-tooltip class="item" effect="dark" content="내 프로필" placement="bottom">
          <el-skeleton v-if="user?.avatar" :loading="true" :avatar="true" :title="true" :row="1">
            <el-avatar class="kanban-header__avatar --me" :size="20" :src="user.avatar">
              <i class="el-icon-user-solid"></i>
            </el-avatar>
          </el-skeleton>
        </el-tooltip>
        <!-- 연결된 사용자 프로필 -->
        <div v-for="user in connectedUsers" class="kanban-header__profiles__item" :key="user.userName">
          <el-tooltip class="item" effect="dark" :content="user.userName" placement="bottom">
            <el-avatar class="kanban-header__avatar" :size="20" :src="user.avatar">
              <i class="el-icon-user-solid"></i>
            </el-avatar>
          </el-tooltip>
        </div>

        <!-- 나머지 +3 -->
        <div v-if="connectedUsers.length > 3" class="kanban-header__profiles__item">
          <span class="kanban-header__profiles__item__count">+3</span>
        </div>
      </article>
    </div>
    <!-- 검색 -->
    <section class="kanban-action-menu-bar" @click="handleClickFilter(false)">
      <section class="kanban-action-btns">
        <div class="--left">
          <el-button-group>
            <el-button type="primary" class="kanban-action-btn__item --table-view" @click="isOpenFilterView = true"
              :text="!selectedFilterView">
              <el-icon>
                <Filter />
              </el-icon>
              <span v-if="selectedFilterView">필터 뷰: {{ selectedFilterView.label }}
              </span>
              <span v-else>필터 뷰</span>
            </el-button>
            <el-button v-if="selectedFilterView" :disabled="!isChangingView" type="default"
              @click="handleClickViewUpdate" class="kanban-action-btn__item --table-view">
              <el-icon :color="isChangingView ? 'green' : ''">
                <Warning />
              </el-icon>
              <span>저장</span>
            </el-button>
            <!-- 뷰 끄기 -->
            <el-button v-if="selectedFilterView" type="default" class="kanban-action-btn__item --table-view"
              @click="handleClickViewClose()">
              <el-icon color="red">
                <Close />
              </el-icon>
              <span>닫기</span>
            </el-button>
          </el-button-group>
          <!-- 고급필터 설정 -->
          <el-tooltip class="item" effect="dark" content="준비중인 기능입니다." placement="bottom">
            <el-button text type="default" class="kanban-action-btn__item" round @click="isVisiblePop = true" disabled>
              <el-icon>
                <Filter />
              </el-icon>
              <span>고급 필터 추가</span>
            </el-button>
          </el-tooltip>
          <el-button text type="default" class="kanban-action-btn__item" :disabled="isOffFilter"
            @click="handleClickFilterReset" round>
            <el-icon class="filter" :class="{ '--is-off': isOffFilter }">
              <Filter />
            </el-icon>
            <span class="filter__text">필터 초기화</span>
          </el-button>
          <!-- 필터 숨기기 -->
          <el-button round @click.prevent="handleClickFilter" :color="'#8a2be2'" class="show-btn" :text="!isOffFilter"
            :class="{ '--is-off': isOffFilter }">
            <el-icon>
              <MoonNight />
            </el-icon>
            <span> {{ isOffFilter ? '필터 보이기' : '필터 숨기기' }}</span>
          </el-button>
        </div>

        <div class="--right">
          <section class="right-btns__wrap">

            <el-radio-group v-model="showTypeTable" size="large" class="kanban-action-btn__item">
              <el-radio-button label="table" class="kanban-action-btn__item">
                <el-icon>
                  <Postcard />
                </el-icon>
                <span>표</span>
              </el-radio-button>
              <el-radio-button label="kanban" class="kanban-action-btn__item">
                <el-icon>
                  <Expand />
                </el-icon>
                <span>칸반</span>
              </el-radio-button>
              <el-radio-button label="gantt" class="kanban-action-btn__item">
                <el-icon>
                  <Calendar />
                </el-icon>
                <span>캘린더</span>
              </el-radio-button>
            </el-radio-group>
            <!-- 설정 -->
            <div class="right-btns__wrap__item">
              <el-button text type="default" class="kanban-action-btn__item" round @click="isOpenSetting = true">
                <el-icon>
                  <Setting />
                </el-icon>
                <span>설정</span>
              </el-button>
            </div>
            <el-dialog title="설정" v-model="isOpenSetting" width="auto">
              <modal-board-setting />

              <template #footer>
                <el-button size="large" type="primary" @click="kanbanSettingSave">
                  <span class="save__text">저장</span>
                </el-button>
              </template>
            </el-dialog>
          </section>

        </div>
        <el-dialog title="저장된 필터 보기" v-model="isOpenFilterView" width="auto">
          <!-- 다른 사람이 만든 필터 -->
          <!-- <span>필터를 저장하거나 현재 선택된 필터를 등록할 수 있습니다.</span> -->
          <div class="filter-other-views">

            <el-select v-model="selectedFilterView" placeholder="필터 선택" class="select-user" value-key="_id"
              :class="{ '--disabled': !!filterViewName }" :disabled="!filterOtherViews.length || !!filterViewName">
              <el-option v-for="filter in filterOtherViews" :key="filter.key" :label="filter.label" :value="filter">
              </el-option>
            </el-select>
          </div>

          <!-- 내 필터 이름 -->
          <el-input v-model="filterViewName" placeholder="다른 이름으로 저장" clearable class="filter__input"
            @keypress.enter="handleClickViewSave"></el-input>
          <!-- 푸터 -->

          <template #footer>
            <el-button size="large" type="primary" @click="handleClickViewSave" :disabled="!filterViewName">
              <span class="save__text">내 필터 등록</span>
            </el-button>
            <el-button size="large" type="default" @click="handleClickViewSelect" v-if="!filterViewName.length"
              @keypress.enter="handleClickViewSelect">
              <span class="save__text">'{{ selectedFilterView?.label }}' 선택</span>
            </el-button>
          </template>
        </el-dialog>
      </section>

      <section class="kanban-filter">
        <section class="kanban-action-menu-bar__container" :class="{ '--is-off': isOffFilter }">
          <el-form label-position="top" label-width="100px"
            style="display: flex; width: 100%; flex-wrap: wrap; align-items:flex-end; gap: 10px;">
            <el-form-item v-for="(filter, index) in selectedFilters" :key="filter.key" class="filter__item">
              <el-badge :is-dot="true" :value="filter.key + ': ' + filter.method"
                :type="filter.method === '일치' ? 'success' : filter.method === '포함' ? 'warning' : filter.method === '제외' ? 'danger' : 'info'">
                <el-select v-if="filter.type === 'select'" :placeholder="filter.filterLabel + ' 선택'"
                  v-model="filter.value" multiple :disabled="isOffFilter" value-key="value" class="filter__select">

                  <template #header>
                    <div class="dropdown-header__container">
                      <el-checkbox v-model="filter.checkAll" :indeterminate="filter.indeterminate"
                        @change="(e) => handleCheckAll(e, filter)">
                        전체 선택
                      </el-checkbox>

                      <!-- 필터 지우기 -->
                      <el-button type="info" text @click="handleClickFilterRemove(index)" class="filter__remove-btn">
                        제거
                      </el-button>
                    </div>
                  </template>
                  <el-option v-for="(op, index) in filter.option" :key="index" :label="op.label" :value="op">
                    {{ op.label }}
                  </el-option>

                  <template #prefix>
                    <span class="filter__method">{{ filter.method }}</span>
                  </template>

                  <template #tag>
                    <el-tag v-for="(item, index) in filter.value" :key="index">
                      {{ item.label }}
                    </el-tag>
                  </template>
                </el-select>
                <el-input v-else-if="filter.type === 'input'" v-model="filter.value" :placeholder="filter.filterLabel"
                  :disabled="isOffFilter" class="filter__select --text">

                  <template #prepend>
                    <span class="filter__method --input">{{ filter.method }}</span>
                  </template>

                  <template #append>
                    <el-button @click="handleClickFilterRemove(index)" class="filter__remove-btn">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
                <div v-else-if="filter.type === 'date'" class="filter__select --date">
                  <el-date-picker type="date" v-model="filter.value" :placeholder="filter.filterLabel"
                    :disabled="isOffFilter" class="filter__select --text" :clearable="false">

                    <template #prepend>
                      <span class="filter__method --input">{{ filter.method }}</span>
                    </template>
                  </el-date-picker>
                  <el-button class="filter__remove-btn date" @click="handleClickFilterRemove(index)" type="text" circle
                    size="mini" style="position: absolute; right: 0; top: 0; z-index: 1;">
                    <el-icon>
                      <Close />
                    </el-icon>
                  </el-button>
                </div>
                <div v-else :placeholder="filter.filterLabel" :disabled="true" class="filter__select --text">
                  <span class="filter__method">{{ filter.method }}</span> {{ filter.filterLabel }}
                </div>
              </el-badge>
              <!-- AND 와 OR 중 선택 가능 -->
              <!-- <el-button class="filter__op-btn" text>AND</el-button> -->

              <template #reference>
                <el-button class="filter__op-btn" text>
                  {{ filterOperators[index] }}
                </el-button>
              </template>
              <!-- </el-popover> -->
            </el-form-item>

            <!-- [필터 추가 팝오버] 필터 추가 아이콘 버튼 선택시 -->
            <el-popover :visible="isVisiblePop" placement="bottom" width="auto" :persistent="false" ref="popoverRef">
              <div class="kanban-filter__popover" v-click-outside="onClickOutside">
                <div class="kanban-filter__popover__method">
                  <el-radio-group class="kanban-filter__popover__btns" v-model="selectedfilterMetnod">
                    <el-radio-button type="primary" class="filter__btn" label="일치" />
                    <el-radio-button type="primary" class="filter__btn" label="포함" />
                    <el-radio-button type="primary" class="filter__btn" label="제외" />
                  </el-radio-group>
                </div>
                <el-select v-model="selectedFilter" placeholder="필터 선택" class="select-filter" value-key="key">
                  <el-option v-for="filter in filters" :key="filter.filterLabel" :label="filter.filterLabel"
                    :value="filter">
                  </el-option>
                </el-select>
                <p class="help-text" v-if="!selectedFilter">
                  <el-icon>
                    <WarningFilled />
                  </el-icon>
                  필터를 선택해주세요.
                </p>

                <!-- 바로 필터링 하기 -->
                <div v-if="selectedFilter" class="kanban-filter__popover__select-value">
                  <el-select v-if="selectedFilter && selectedFilter.type === 'select'" v-model="selectedFilter.value"
                    placeholder="값 선택" multiple :disabled="!selectedFilter" value-key="value" class="filter__select">

                    <template #header>
                      <el-checkbox v-model="selectedFilter.checkAll" :indeterminate="selectedFilter.indeterminate"
                        @change="(e) => handleCheckAll(e, selectedFilter)">
                        전체 선택
                      </el-checkbox>
                    </template>
                    <el-option v-for="(op, index) in selectedFilter.option" :key="index" :label="op.label" :value="op">
                      {{ op.label }}
                    </el-option>
                  </el-select>
                  <el-input v-else-if="selectedFilter.type === 'input'" v-model="selectedFilter.value"
                    :placeholder="selectedFilter.filterLabel" class="filter__select --text"
                    @keydown="handleEnterFilter">
                  </el-input>
                  <!-- date -->
                  <el-date-picker v-else-if="selectedFilter.type === 'date'" type="date" v-model="selectedFilter.value"
                    placeholder="날짜 선택" class="filter__select --text">
                  </el-date-picker>
                </div>

                <div class="popover__footer">
                  <!-- 닫기 -->
                  <el-button @click="isVisiblePop = false" class="popover__confirm-btn">취소</el-button>
                  <el-button type="primary" class="popover__confirm-btn"
                    @click="handleClickFilterAdd(selectedFilter, selectedfilterMetnod)"
                    :disabled="!selectedFilter">확인</el-button>
                </div>
              </div>

              <template #reference>
                <!-- 검색필터 추가 아이콘 버튼 -->
                <el-button @click="isVisiblePop = !isVisiblePop" class="filter__add-btn">
                  <el-icon>
                    <Filter />
                  </el-icon>
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-button>
              </template>
            </el-popover>
            <div class="color-picker-container">
              <!-- 컬러 선택 -->
              <el-color-picker v-model="color" popper-class="color-picker" class="color-picker__btn"
                @active-change="handleChangeColor" ref="colorPicker" color-format="hex"
                :predefine="['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']"></el-color-picker>
              <!-- 끄기 버튼 -->
              <el-button text v-if="color" @click="color = null" class="color-picker__btn --close" size="small">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </el-form>
        </section>
      </section>
    </section>

    <div v-if="showTypeTable === 'table'" class=" kanban-container-table">
      <KanbanTable :cards="filterCards" :boards="boards" @select="handleSelectTable" :optionalField="getTemple" />
    </div>
    <div v-if="showTypeTable === 'gantt'" class="kanban-container-table">
      <GanttChart :cards="filterCards" :boards="boards" />
    </div>
    <div v-if="showTypeTable === 'kanban'" class="kanban-container-boards">

      <div class="kanban-container-boards__panel" v-for="board in boards" :key="board.id"
        @drop.prevent="onDrop($event, board.id)" @dragenter.prevent @dragover.prevent>
        <!-- 칸반 카드 입니다. (드래그엔드랍기능) -->
        <header class="kanban-container-boards__panel-header">
          <h1 class="kanban-class">{{ board.title }} <span
              v-if="filterCards.filter(el => el.boardId === board.id).length > 0" class="kanban-class__count">({{
          filterCards.filter(el => el.boardId === board.id).length
        }})</span></h1>
          <el-tooltip class="item" effect="dark" content="노트 추가" placement="top">
            <i @click="handleClickToAdd(board)"> <el-icon class="kanban-menu">
                <Edit />
              </el-icon>
            </i>
          </el-tooltip>
          <!-- 추가기능 아이콘 (추가하기) -->
        </header>
        <section class="kanban-container-boards__panel-body" @dragenter.prevent @dragover.prevent>
          <KanbanBoardCard @click="handleClickToUpdate(card, board.title)" ref="kanbanBoardCard" :id="card._id"
            v-for="card in filterCards.filter(el => el.boardId === board.id).sort((a, b) => a.order - b.order)"
            @delete="handleDeleteCard(card._id)" class="kanban-card" @dragleave.prevent="onDragLeave($event, card._id)"
            @dragstart="handleDragStart($event, card)" draggable="true" :key="card._id" :card="card">


            <!-- 드래그엔 드롭 -->
            <div class="card-drag-wrap">
              <!-- 위 -->
              <div class="card-drag-wrap__top" @drop.prevent.stop="onDropOrder($event, card.boardId, card.order - 1)"
                @dragover.prevent="onDragOver($event, card._id, 'top')">
                <div class="card-drag-wrap__top__inner"></div>
              </div>
              <!-- 아래 -->
              <div class="card-drag-wrap__bottom" @drop.prevent.stop="onDropOrder($event, card.boardId, card.order + 1)"
                @dragover.prevent="onDragOver($event, card._id, 'bottom')">
                <div class="card-drag-wrap__bottom__inner"></div>
              </div>
            </div>
          </KanbanBoardCard>
          <EmptyKanbanCard v-if="filterCards.filter(el => el.boardId === board.id).length === 0"
            @add="handleClickToAdd(board)" />
          <el-button v-else-if="filterCards.filter(el => el.boardId === board.id).length > 0" size="large"
            class="add-btn" @click="handleClickToAdd(board)" text>
            <el-icon>
              <Plus />
            </el-icon>
            추가하기
          </el-button>
        </section>
      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-drawer size="55%" :title="modalKanban.boardTitle" v-model="modalKanban.dialogVisible" destroy-on-close>
      <ModalKanbanCardCreate :isOpen="modalKanban.dialogVisible" :form="form" @enter.self="handleSave(selectedBoardId)"
        :optionalField="getTemple" @update:form="updateForm" :tags="tags" :type="modalKanban.openType" />

      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="default" @click="handleSave(selectedBoardId)">
            <span class="save__text">저장 후 계속하기</span>
            <el-icon>
              <DArrowRight />
            </el-icon>
          </el-button>
          <el-button size="large" type="primary" @click="handleSave(selectedBoardId)">
            <span class="save__text">저장</span>
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onUnmounted, unref } from "vue";
// computed 타입
import type { ComputedRef } from "vue";
import { Board, Card } from "@/types/Kanban.type";
import ModalKanbanCardCreate from "./ModalKanbanCardCreate.vue";
import KanbanBoardCard from "@/components/KanbanBoardCard.vue";
import KanbanTable from "@/components/KanbanTable.vue";
import EmptyKanbanCard from "@/components/EmptyKanbanCard.vue";
import { cloneDeep, orderBy } from "lodash";
import { useUserStore } from "@/stores/user";
import { useBoardStore } from "@/stores/board";
import { useCommonStore } from "@/stores/common";
import { ElMessageBox, ElNotification, valueEquals } from "element-plus"; // 메세지 박스
import { ClickOutside as vClickOutside } from 'element-plus'

import "md-editor-v3/lib/style.css";
import API from "@/apis";

// Socket IO (실시간 통신)
import { state, socket } from "@/socket";
import { FormTemplate } from "@/types/projects.type";
import {
  MoonNight, Close, Check, Postcard, Expand, Calendar
} from "@element-plus/icons-vue";
import { al } from "vitest/dist/reporters-5f784f42";

type FilterView = {
  filterLabel: string;
  _id: string;
  filters: Filter[];
};
const showTypeTable = ref('kanban');

const boards = computed(() => useBoardStore().getBoards)
const user = computed(() => useUserStore().getUserState)
const selectedTeamId = computed(() => useCommonStore().getSbSelectedTeamId)
const selectedTeamName = computed(() => useCommonStore().getSbSelectedTeamName)
const selectedProjectName = computed(() => useCommonStore().getSbSelectedProjectName)
const selectedProjectId = computed(() => useCommonStore().getSbSelectedProjectId)
const selectedGroupName = computed(() => useUserStore().getGroupName)
const users = computed(() => useUserStore().getUsers)

const selectedBoardId = ref('');
const selectedWorker = ref(null);
const selectedFilterView = ref<FilterView>(null); // 현재 선택된 필터뷰 [저장된 필터보기로 선택된]
const selectedFilter: Filter = ref(null);  // 현재 선택된 필터 아이템 [필터 추가]
const selectedFilters = ref<Filter[]>([]);  // 현재 선택된 필터 [필터 추가로 선택된 필터 아이템들]
const selectedFilterLable = ref(''); // 현재 선택된 필터 이름
const searchValue = ref("");
const popoverRef = ref()
const onClickOutside = () => {
  // .el-select-dropdown__dropdown
  if (event.target.closest('.el-select-dropdown__dropdown') || event.target.closest('.el-select-dropdown')
    || event.target.closest('.el-select-dropdown__item') || event.target.closest('.el-select-dropdown__wrap')
    || event.target.closest('.el-select-dropdown__list') || event.target.closest('.el-select-dropdown__item')
    || event.target.closest('.el-select-dropdown__empty') || event.target.closest('.el-select-dropdown__group')
    || event.target.closest('.el-select-dropdown__group-title') || event.target.closest('.el-select-dropdown__group')
  ) {
    return
  }
  isVisiblePop.value = false
}

// 필터가 변경되는 경우를 감지하여 '뷰 업데이트' 버튼이 활성화 됩니다.
const isChangingView = ref(false);
const cards = ref<Card[]>([]);
const initForm = ref<Card>({
  _id: '',
  title: "",
  description: "",
  created_date: "",
  userId: "",
  userName: '',
  userAvatar: '',
  teamId: selectedTeamId.value,
  boardId: '',
  projectId: '',
  order: 0,
  tags: [],
  commit: [],
  optionalData: {},
});
// team에 formTemplate가 있음
const selectedTemplate = ref({});

//선택한 팀에 따라서 폼이 달라짐
const handleSelectTable = (row) => {
  console.log('row', row)

  // 모달 열기 수정
  handleClickToUpdate(row, row.boardTitle)

}

const kanbanInfo = computed(() => {
  return {
    groupName: selectedGroupName.value,
    projectName: selectedProjectName.value,
    teamName: selectedTeamName.value,
  }
});

const isOffFilter = ref(false);
const isVisiblePop = ref(false);
const filters = ref<Filter[]>([]);
const selectedfilterMetnod = ref('일치');
const filterOperators = ref([]);
const isOpenFilterView = ref(false);
const filterOtherViews = ref([]);
const filterViewName = ref('');
const handleClickViewUpdate = async () => {
  try {
    const id = selectedFilterView.value._id;
    const result = await API.updateFilterView(id, { filters: selectedFilters.value });
    isOpenFilterView.value = false
    ElMessageBox.alert("내 필터가 업데이트 되었습니다.", "알림", {
      confirmButtonText: "확인",
    });
    //  TODO 동기화 되어 필터가 싱크 떠야함
    isChangingView.value = false;
  } catch (error) {
    console.log(error)
  }
}


/* ---------------------------------- 설정 모달 --------------------------------- */
const isOpenSetting = ref(false);
const kanbanSettingSave = () => {
  isOpenSetting.value = false;
}


// 필터뷰 닫기
const handleClickViewClose = () => {
  isOpenFilterView.value = false
  selectedFilterView.value = null;
  selectedFilters.value = [];
  filterViewName.value = '';
  isChangingView.value = false;
  localStorage.removeItem('filterViewId')
}


//필터 오포레이터 추가
const setFilterOperator = (firstIndex, operator) => {
  filterOperators.value.splice(firstIndex, 0, operator);
};

// user 필터를 세팅합니다.
const setUserOptions = () => {
  return users.value.map((user) => {
    return {
      label: user.name,
      value: user.id,
    };
  });
}

const handleEnterFilter = (e) => {
  if (e.key === 'Enter') {
    handleClickFilterAdd(selectedFilter.value, selectedfilterMetnod.value)
  }
}

// 필터 뷰 생성
const handleClickViewSave = async () => {
  try {
    const result = await API.createFilterView({ teamId: selectedTeamId.value, label: filterViewName.value, filters: selectedFilters.value });
    isOpenFilterView.value = false
    ElMessageBox.alert("내 필터가 저장되었습니다.", "알림", {
      confirmButtonText: "확인",
    });

    //저장한 필터뷰로 변경
    selectedFilterView.value = result;
  } catch (error) {
    console.log(error)
  }
}

// 필터 옵션을 추가합니다.
const setFilters = async () => {
  try {

    let isConfirm = null
    // 만약 필터가 있고 선택한 필터뷰가 있다면 초기화 물어보기
    if (selectedFilters.value.length > 0 && selectedFilterView.value) {

      // isConfirm = await ElMessageBox.confirm("필터를 초기화 하시겠습니까?", "알림", {
      //   confirmButtonText: "확인",
      //   cancelButtonText: "취소",
      // });
    } else { isConfirm = true; }



    if (isConfirm) {
      filters.value = [
        // 제목  
        {
          filterLabel: '제목', key: 'title',
          option: [], method: '일치', value: '', type: 'input', active: false, checkAll: true, indeterminate: false
        },
        {
          filterLabel: '담당자', key: 'userId', option: [...setUserOptions()],
          method: '일치', value: [...setUserOptions()], active: false, type: 'select', checkAll: true, indeterminate: false
        },
        {
          filterLabel: '태그', key: 'tags', option: [...setTagsOptions(tags)],
          method: '포함', value: [...setTagsOptions(tags)], active: false, type: 'select', checkAll: true, indeterminate: false
        },
      ];
    }


    const optionalField = getTemple.value.cols.map((el) => {
      return {
        filterLabel: el.label, key: el.key, option: [], method: '일치', value: '', type: el.type, active: false, checkAll: true, indeterminate: false
      }
    })

    filters.value = filters.value.concat(optionalField)



  } catch (error) {
    console.log('error', error)
  }
};

const handleClickFilterRemove = (index) => {
  console.log('handleClickFilterRemove')
  selectedFilters.value.splice(index, 1);
}

// 필터 추가 Select
watch(selectedFilters, (val, oldVla) => {
  // 필터뷰가 변경되면 뷰 업데이트 버튼이 활성화 됩니다.

  if (oldVla.length === 0 || !val) {
    return
  }
  isChangingView.value = true;


  selectedFilters.value.forEach((el, idx) => {
    //필터 라벨과 일치하는 필터를 찾아서 값을 비교합니다. (select, input, date)
    const sameLabelOption = filters.value.filter((filter) => filter.key === selectedFilters.value[idx].key)[0].option.map((el) => el.value);



    //type 이 select 일때
    // if (selectedFilters.value[idx].type === 'select') {
    if (selectedFilters.value[idx].type !== 'date') {
      if (selectedFilters.value[idx].value.length === 0) {
        el.checkAll = false
        el.indeterminate = false
      } else if (sameLabelOption.length === selectedFilters.value[idx].value.length) {
        el.checkAll = true
        el.indeterminate = false
      } else {
        el.indeterminate = true
      }
    }
  })
}, { deep: true })

const handleCheckAll = (e, filter) => {
  filter.value = e ? filter.option.map((el) => el) : [];
  filter.indeterminate = false;
};


/** function 필터뷰 가져오기
 * @returns void
 */
const fetchFilterViews = async () => {
  try {
    // API 호출
    const result = await API.getFilterViews({ teamId: selectedTeamId.value });
    filterOtherViews.value = result;
    console.log('filterOtherViews', filterOtherViews.value)
  } catch (error) {
    console.log('error', error)
  }
};


/** @function 카드필터링
 * @param val filters
 * @param cards cards
 * @description 
 */
const filterCardsByAction = (filters, cards) => {

  let filterCards = cloneDeep(cards);

  if (isOffFilter.value) return filterCards;

  filters.forEach((filter) => {
    // if (filter.active) {
    filterCards = filterCards.filter((card) => {
      if (filter.type === 'select') {
        // 값이 없으면 패스
        // if (filter.value.length === 0) {
        //   return true;
        // }
        if (filter.method === '일치') {
          //card[filter.key]가 배열이 경우
          if (Array.isArray(card[filter.key]) && filter.type !== 'date') {
            console.log('card[filter.key]', card[filter.key], filter.value)
            return filter.value.every(objA => card[filter.key].some(objB => objB.label === objA.value));
          }
          else {
            return filter.value.some((el) => el.value === card[filter.key]);
          }
        } else if (filter.method === '포함') {
          if (Array.isArray(card[filter.key])) {
            return filter.value.some(objA => card[filter.key].some(objB => objB.label.includes(objA.value)));
          } else {
            return filter.value.some((el) => card[filter.key].includes(el.value));
          }
        } else if (filter.method === '제외') {
          if (Array.isArray(card[filter.key])) {
            return filter.value.every(objA => card[filter.key].some(objB => !objB.label.includes(objA.value)));
          } else {
            return filter.value.every((el) => !card[filter.key].includes(el.value));
          }
        }



      } else if (filter.type === 'input') {
        // 값이 없으면 패스
        if (filter.value === '') {
          return true;
        }
        if (filter.method === '일치') {
          return card[filter.key] === filter.value;
        } else if (filter.method === '포함') {
          return card[filter.key].includes(filter.value);
        } else if (filter.method === '제외') {
          return !card[filter.key].includes(filter.value);
        }
      }
    });
  });

  console.log('filterCards', filterCards)
  return filterCards;
};

const setTagsOptions = (tags) => {
  console.log('하핫', tags.value)
  if (!tags.value) return []
  return tags.value.map((tag) => {
    return {
      label: tag.label,
      value: tag.label,
    };
  });
};

const handleClickViewSelect = async () => {

  // 만약 내 필터가 한개라도 세팅되어있으면
  // 내가 설정한 필터에서 해당 필터뷰로 변경됩니다. 문구 표시
  const isConfirm = await ElMessageBox.confirm("선택한 필터로 변경하시겠습니까?"
    , {
      confirmButtonText: "변경",
      cancelButtonText: "취소",
    });

  if (isConfirm) {
    selectedFilters.value = selectedFilterView.value.filters;
  }

  isOpenFilterView.value = false;
};

type Filter = {
  value: string | string[];
  filterLabel: string;
  key: string;
  option: FilterOption[];
  method: string;
  active: boolean;
  type: string; // input, select, date
  checkAll: boolean;
  indeterminate: boolean;
};
type FilterOption = {
  label: string;
  value: string;
};


/* ---------------------------------- 컬러 필터 --------------------------------- */
const color = ref(null);
const colorPicker = ref(null);
const handleChangeColor = (color22) => {
  color.value = color22
  console.log(color)
  console.log(color.value)
  // 닫기
  colorPicker.value.hide();
}

// 버튼에 호버했을 경우
const isHoverColor = ref(false);
const handleHoverColor = () => {
  isHoverColor.value = !isHoverColor.value;
}

document.addEventListener('mouseup', (e) => {
  if (colorPicker.value && !colorPicker.value.$el.contains(e.target)) {
    handleHoverColor()
  }
});

/* ------------------------------------ - ----------------------------------- */


/* ---------------------------- TODO 팀에 옵셔널데이터 추가 --------------------------- */

// type InfoColumn = {
//   id: string;
//   title: string;
//   options: string[];
//   required: boolean;
// };

// const InfoColumns = ref<InfoColumn[]>(null);
// const params = {
//   teamId: selectedTeamId.value,
// }
// const getInfoColumns = async () => {
//   const result = await API.getInfoColumns(params);
//   InfoColumns.value = result;
// };
// getInfoColumns

/* ------------------------------------------------------------------------ */


/** @function 필터 추가
 * @param filter 필터
 * @param method 필터 메소드
 */
const handleClickFilterAdd = (filter, method) => {
  // selectedFilter 에 추가기능
  selectedFilters.value.push({
    ...filter,
    method: method,
  });


  setFilterOperator(selectedFilters.value.length - 1, 'AND');
  isVisiblePop.value = false;
};

// [필터 보기/숨기기]
const handleClickFilter = (isBtn) => {
  if (isBtn) {
    isOffFilter.value = !isOffFilter.value;
    ElNotification({
      title: isOffFilter.value ? "숨김" : "보임",
      message: isOffFilter.value ? "필터가 숨겨졌습니다." : "필터가 보여집니다.",
      icon: isOffFilter.value ? MoonNight : MoonNight,
      customClass: isOffFilter.value ? "moon-notification--off" : "moon-notification--on",
    });
  }
};

const handleClickFilterReset = () => {
  selectedFilters.value = [];

  // 필터 오퍼레이터 초기화
  filterOperators.value = [];

  // 필터 초기화
  setFilters();
};

const connectedUsers = ref([]);

// 유저 접속
const handleUserConnected = (data) => {
  const user = connectedUsers.value.find((el) => el.userId === data.userId);
  if (!user) {
    connectedUsers.value.push(data);
  }
};

// 필터 로컬 스토리지에 저장
const setFilterLocal = () => {
  localStorage.setItem('filters', JSON.stringify(selectedFilters.value));
  // 필터뷰 저장
  // localStorage.setItem('selectedFilterView', JSON.stringify(selectedFilterView.value));

  //필터 _id 를 저장
  localStorage.setItem('filterViewId', selectedFilterView.value._id);
};

// 필터 로컬 스토리지에서 가져오기
const getFilterViewLocal = () => {
  const filter = localStorage.getItem('filters');


  const viewId = localStorage.getItem('filterViewId');


  if (viewId) {
    selectedFilterView.value = filterOtherViews.value.find((el) => el._id === viewId);
    if (selectedFilterView.value) {
      selectedFilters.value = selectedFilterView.value.filters;
    }
    // selectedFilters.value = selectedFilterView.value.filters;
    console.log('오 정말 대단한걸', viewId, selectedFilterView.value, filterOtherViews.value)
  }
  else {
    console.log('selectedFilterView4', selectedFilterView.value)
    selectedFilters.value = JSON.parse(filter);
  }
};

onMounted(() => {
  // 접속 또는 접속 종료시 누가 접속했는지 누가 나갔는지 알 수 있음
  socket.on("users:connected", (data) => {
    handleUserConnected(data);
  });

  // 브라우저의 탭이 닫히거나 새로고침할때
  window.addEventListener('beforeunload', setFilterLocal);


  // remove any existing listeners (after a hot module replacement)
  socket.on("cards:created", (data) => {
    const card = data?.card
    console.log('cards:created', card)
    cards.value.push(card);
  });

  socket.on("cards:moved", (data) => {
    const card = data?.card;
    console.log('cards:moved', card)

    // 보드 Id 만 변경
    const cardIdx = cards.value.findIndex((el) => el._id === card._id);
    cards.value[cardIdx].boardId = card.boardId;

    // 순서 변경
    cards.value
      .filter(el => el.boardId === card.boardId)
      .forEach((el, idx) => {
        if (el.order >= card.order) {
          el.order = el.order + 1;
        }
      });

    cards.value[cardIdx].order = card.order;
  });

  // 수정
  socket.on("cards:updated", (data) => {
    const card = data?.card;
    console.log('cards:updated', card)

    const cardIdx = cards.value.findIndex((el) => el._id === card._id);
    cards.value[cardIdx] = card;
  });

  socket.on("cards:deleted", (data) => {
    const cardId = data?.cardId;
    console.log('cards:deleted', cardId)

    const cardIdx = cards.value.findIndex((el) => el._id === cardId);
    cards.value.splice(cardIdx, 1);
  });

})

onUnmounted(() => {

  // 접속 또는 접속 종료시 누가 접속했는지 누가 나갔는지 알려줍니다.
  // socket.emit("users:connected", { userId: useUserStore().getUserState.id, userName: useUserStore().getUserState.name }, (result: any) => {
  //   console.log('users:connected', result)
  // });

  socket.off();
  state.connected = false;
  setFilterLocal();


})


// [드래그 기능]위에 있을떄 드래그오버 이벤트
// TODO 드래그 이후 마우스 커서 스타일 변경
const onDragOver = (e, cardId, type) => {
  const dom = document.getElementById(cardId);

  // 위
  if (type === 'top') {
    const top = dom.querySelector('.card-drag-wrap__top__inner');
    top.classList.add('active');
  }

  // 아래
  if (type === 'bottom') {
    const bottom = dom.querySelector('.card-drag-wrap__bottom__inner');
    bottom.classList.add('active');
  }


};

// 없어짐
const onDragLeave = (e, cardId) => {
  const dom = document.getElementById(cardId);

  // 위
  const top = dom.querySelector('.card-drag-wrap__top__inner');
  top.classList.remove('active');

  // 아래
  const bottom = dom.querySelector('.card-drag-wrap__bottom__inner');
  bottom.classList.remove('active');
};


const tags = ref([]);
const setTagsFromCards = (cards) => {
  // 태그에서 타이틀이 중복된 태그만 가져옵니다. (가져온 태그는 title, color 정보가 있습니다.)\
  const _tag = cards.map((card) => card.tags).flat()

  // label이 중복된 값 제거
  const uniqueTags = _tag.filter((tag, index, self) =>
    index === self.findIndex((t) => (
      t.label === tag.label
    ))
  )

  // 태그를 배열로 변경합니다.
  tags.value = uniqueTags;
};
// 카드 조회 API 호출
const getCards = async () => {
  console.log(selectedTeamId.value)
  const query = {
    teamId: selectedTeamId.value,
  }
  const result: Card[] = await API.getCards(query);
  cards.value = result;

  //카드에서 태그모으기
  setTagsFromCards(result);

};


// selectedTeamId 변경시 카드 조회
watch(selectedTeamId, async () => {
  await getCards();
  await fetchFilterViews();
  setFilters();

  // localStorage 에 존재하는 필터뷰 가져오기
  getFilterViewLocal();
}, { immediate: true })

const getTemple = computed(() => {
  const selectedTeamId2 = selectedTeamId.value
  return selectedTemplate.value = useUserStore().fetchTemplate(selectedTeamId2)
})


class CardActions {
  /** @function 카드 추가기능
   * @param cardId 카드 아이디
   * @param boardId 보드 아이디
   * @param form 카드 폼
   * 
   * @returns void
   */
  async create(order, boardId, form) {
    try {
      const card: Card = {
        ...form.value,
        order,
        teamId: selectedTeamId.value,
        boardId: boardId,
        projectId: selectedProjectId.value,
        created_date: new Date().toISOString().slice(0, 10),
      };



      // API 호출
      const result = await API.createCard(card);


      cards.value.push(result);


      socket.emit("cards:created", { card: result }, (result: any) => {
        console.log('cards:created', result)
      });

      // 만약 커밋에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드의 커밋에 추가
      this.addCommit(form._id, form.value);

    } catch (error) {
      console.error(error);
      ElNotification({
        title: "카드 추가 실패",
        message: "카드 추가에 실패했습니다.",
        type: "error",
      });
      throw error;
    }
  }



  async update(cardId, form) {
    try {
      const cardIdx = cards.value.findIndex((card) => card._id === cardId);


      this.resetCommit(cards.value)
      this.addCommit(cardId, cards.value)

      // API 호출
      const result = await API.updateCard(form.value);
      console.log(result)
      cards.value[cardIdx] = result;

      socket.emit("cards:updated", { card: result }, (result: any) => {
        console.log('cards:updated', result)
      });
    } catch (error) {
      console.error(error);
    }
  }

  async delete(cardId) {
    try {
      const cardIdx = cards.value.findIndex((card) => card._id === cardId);
      cards.value.splice(cardIdx, 1);

      this.resetCommit(cards.value)
      this.addCommit(cardId, cards.value)

      // API 호출
      await API.deleteCard(cardId);
      socket.emit("cards:deleted", { cardId }, (result: any) => {
        console.log('cards:deleted', result)
      });

    } catch (error) {
      console.error(error);
    }

  }

  resetCommit(cards) {
    cards.forEach(card => {
      card.commit = []
    })
  }

  // title에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드 번호의 카드를 찾아서 커밋에 추가
  addCommit(cardId, form) {
    this.resetCommit(cards.value)

    cards.value
      .forEach(element => {
        if (element.title.includes(`#mb-`)) {
          // 띄어쓰기나 괄호까지
          const afterMb = element.title.split(`#mb-`)[1].split(' ')[0].split(')')[0].split(']')[0];
          const cardIdx = cards.value.findIndex((card) => card._id === afterMb);
          const cardTitle = element.title;

          const commitMessage =
            `${cardTitle}`

          cards.value[cardIdx].commit.push({
            id: modalKanban.openType === 'create' ? cards.value[cardIdx].commit.length + 1 : form.id,
            title: commitMessage,
            created_date: new Date().toISOString().slice(0, 10),
            card_idx: element._id,
          });
        }
      });
  }
}

watch(selectedTeamId, () => {
  console.log('selectedTeamId 가 변경', selectedTeamId.value)
  form.value = cloneDeep(initForm.value);

  setTimeout(() => {
    socket.emit("users:connected", { userId: user.value.id, userName: user.value.name, avater: user.value.avatar }, (result: any) => {
    });
  }, 1000);

  fetchFilterViews();

})

const updateForm = (newForm) => {
  form.value = cloneDeep(newForm);
};



type ModalOpenType = "create" | "update" | "none";

class ModalKanban {
  dialogVisible = false;
  boardTitle = "";
  openType: ModalOpenType = "none";
  open(type: ModalOpenType = "create", boardTitle = "") {
    this.dialogVisible = true;
    this.openType = type;
    this.boardTitle = boardTitle;
  }
  close() {
    this.dialogVisible = false;
  }

  // async beforeClose(done) { // TODO 사용성이 떨어짐 (노션도 물어보지 않습니다.)

  //   const isClose = await ElMessageBox.confirm("작성중인 내용이 있습니다. 정말 닫으시겠습니까?"
  //     , {
  //       confirmButtonText: "닫기",
  //       cancelButtonText: "취소",
  //     });

  //   if(isClose) {
  //     this.dialogVisible = false;
  //     done();
  //   }

}


let cardActions = new CardActions();
const modalKanban = reactive(new ModalKanban());

let form = ref<Card>(null);



// 검색한 카드를 필터링하여 보여줍니다.
const filterCards: ComputedRef<Card[]>
  = computed(() => {

    const searchedCards = cards.value.filter((card) => {
      return card.title.includes(searchValue.value);
    });

    const filteredCards = filterCardsByAction(selectedFilters.value, searchedCards);

    return filteredCards;
  });

const handleClickToUpdate = (card: Card, boardTitle) => {
  form.value = cloneDeep(card);
  modalKanban.open("update", boardTitle);
};

/** function 카드 저장
 * @param boardId 보드 아이디
 * @returns void
 * @description 카드를 생성, 수정합니다.
 */
const handleSave = async (boardId) => {
  try {
    const modalType = modalKanban.openType;

    // startDate가 endDate보다 늦을 수 없습니다.
    if (form.value.startDate > form.value.endDate) {
      ElNotification({
        title: "날짜 오류",
        message: "시작일은 종료일보다 늦을 수 없습니다.",
        type: "error",
      });
      return;
    }

    if (modalType === 'create') {
      delete form.value._id;
      const order = filterCards.value.filter(el => el.boardId === boardId).length
      await cardActions.create(order + 1, boardId, form);
    } else if (modalType === 'update') {
      await cardActions.update(form.value._id, form);
    }
    modalKanban.close();
    form.value = cloneDeep(initForm.value);
  } catch (error) {
    console.error(error);
  }
};

const handleClickToAdd = (board) => {
  const boardTitle = board.title;
  selectedBoardId.value = board.id;
  form.value = cloneDeep(initForm.value);
  form.value.userId = selectedWorker.value;
  modalKanban.open("create", boardTitle)
};

const handleDeleteCard = (cardId) => {
  cardActions.delete(cardId);
};

/* -------------------------------- 드래그엔드랍기능 -------------------------------- */
// 카드 드래그 (다른 보드의 카드로 이동 가능)
const handleDragStart = (e, card) => {
  e.dataTransfer.setData("cardId", card._id);
  // e.dataTransfer.setData("cardboardId", card.boardId);
};

const onDropOrder = async (e, boardId, toOrder) => {
  const cardId = e.dataTransfer.getData("cardId");
  console.log('toOrder', toOrder)

  const cardIdx = cards.value.findIndex((card) => card._id === cardId);

  // 만약 카드가 다른 보드로 이동했을때
  if (cards.value[cardIdx].boardId !== boardId) {
    cards.value[cardIdx].boardId = boardId;
  }

  // 한 보드에서 카드 순서 변경
  if (cards.value.filter(el => el.boardId === boardId).length === 0) {
    cards.value[cardIdx].order = 1;
  } else {

    cards.value
      .filter(el => el.boardId === boardId)
      .forEach((el, idx) => {
        if (el.order >= toOrder) {
          el.order = el.order + 1;
        }
      });
    cards.value[cardIdx].order = toOrder;
  }




  // moveCard API 호출 (순서 변경)
  await API.moveCard({
    cardId: cardId,
    boardId: boardId,
    order: toOrder
  });

  // 모든 카드 line 요소 active 상태 제거
  const cardDom = document.querySelectorAll('.card-drag-wrap__top__inner, .card-drag-wrap__bottom__inner');
  cardDom.forEach(el => {
    el.classList.remove('active');
  });


  socket.emit("cards:moved", {
    card: cards.value[cardIdx],
  }, (result: any) => {
    console.log('cards:moved', result)
  });
};

// 카드 드랍 (다른 보드의 카드로 이동 가능)
const onDrop = async (e, boardId) => {
  const cardId = e.dataTransfer.getData("cardId");

  console.log('onDrop', e)
  // const cardboardId = e.dataTransfer.getData("cardboardId");

  const cardIdx = cards.value.findIndex((card) => card._id === cardId);
  cards.value[cardIdx].boardId = boardId;

  // moveCard API 호출
  await API.moveCard({
    cardId: cardId,
    boardId: boardId,
  });

  socket.emit("cards:moved", {
    card: cards.value[cardIdx],
  }, (result: any) => {
    console.log('cards:moved', result)
  });

  // 만약 커밋에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드의 커밋에 추가
  cardActions.addCommit(cardId, cards.value);


  // 간트 차트 보기
  const isGanttChart = ref(false);
};



</script>

<style scoped lang="scss">
.kanban-container {
  position: relative;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  // gap: 20px;
  width: 100%;
  height: 100%;
  // background-color: $background-transparent-secondary;
  // padding-top: 10px;

  .kanban-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0px 20px;

    .kanban-header__title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      // border-right: 2px solid $dark-gray-100;
      padding-right: 10px;
      gap: 4px;

      span {
        white-space: nowrap;
        font-weight: 700;
        // color: $gray-200;
      }

      // 소켓
      .socket-icon {
        width: 20px;
        height: 20px;
        padding: 4px;
        margin-left: 12px;
        border-radius: 50%;
        font-size: 20px;
        background-color: $background-transparent;

        &.is-connect {
          color: $success;
        }
      }
    }

    .kanban-header__profiles {
      display: flex;
      align-items: center;
      gap: 0px;

      .kanban-header__avatar.--me {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: $background-transparent;
        font-size: 14px;
        border: 2.4px solid $primary;
        box-sizing: content-box;
        color: $gray-600;
      }

      .kanban-header__profiles__item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: $background-transparent;
        font-size: 14px;
        color: $gray-600;
        transition: all 0.2s ease-in-out;

        // 호버 했을경우
        &:hover {
          cursor: pointer;
          transform: scale(1.2);
        }
      }



    }

    .kanban-header__divider {
      display: flex;
      height: 100%;
    }

    .kanban-search {
      display: flex;
      width: 100%;
      height: 40px;
      margin: 10px;
      // background-color: $dark-gray-100;
      // border-radius: 6px;
      // color: #ffffff;
    }
  }

  // 칸반보드 필터
  .kanban-action-menu-bar {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    // padding: 10px;

    border-radius: 10px;
    margin-right: 10px;
    width: 100%;

    .filter-divider--top {
      margin: 10px 0;
      margin-top: 0px;
    }


    .kanban-action-btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 10px 24px;

      .--right {
        display: flex;

        .right-btns__wrap {
          display: flex;
          align-items: center;
          gap: 10px;

          .kanban-action-btn__item {
            display: flex;
          }
        }

        .color-systems-icon {
          display: flex;
          align-items: center;
          gap: 10px;

          .color-systems-icon__item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: $background-transparent;
            font-size: 14px;
            color: $gray-600;
            transition: all 0.2s ease-in-out;

            &:hover {
              cursor: pointer;
              transform: scale(1.2);
            }
          }
        }
      }
    }


    .kanban-filter {
      display: flex;
      align-items: flex-end;
      width: 100%;
      height: 100%;
      // background-color: $dark-gray-100;
      border-top: 1px solid $gray-100;
      padding: 12px 20px;

      .el-badge {
        width: 100%;
        display: flex;


        &::v-deep(sup) {
          font-size: 12px;
          color: $gray-100;
        }
      }

      .el-button {
        padding-left: 6px !important;
        padding-right: 6px !important;
      }

      .kanban-action-menu-bar__container {
        display: flex;
        flex-wrap: wrap;

        .filter__item {
          display: flex;
          flex-direction: column;


          &::v-deep(.el-form-item__content) {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: auto;
            flex-wrap: nowrap;
            justify-content: flex-start;
          }

          .filter__method-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            height: 32px;
            border-radius: 6px;
            background-color: $background-transparent;
            padding-right: 10px;
            padding-left: 6px;
            margin-right: 2px;

            .icon--method {
              display: flex;
              font-size: 16px;
            }

            .label--method {
              display: none;
            }

            &:hover .label--method {
              display: inline-block;
              font-size: 12px;
            }
          }
        }

        &::v-deep(.el-form-item__label) {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        &.--is-off {
          opacity: 0.2;
        }

        .filter__item {
          margin: 0px;
        }

        .filter__op-btn {
          margin-left: 10px;
        }
      }

    }

    // 메뉴 아이콘
    .kanban-filter__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      // background-color: $dark-gray-200;
      font-size: 20px;
      color: $gray-600;
      margin-right: 0px;
      transition: all 0.02s ease-in-out;

      &.--is-off {
        color: $gray-600;
        background-color: $gray-200;
      }


      &.filter {
        margin-right: 20px;
      }

      &:hover {
        cursor: pointer;
        color: $primary;
        background-color: $gray-200;
      }
    }

    .kanban-action-menu-bar__container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;

      .el-select {
        &::v-deep(.el-input__wrapper) {
          border-radius: 6px;
          background-color: $dark-gray-100;
        }
      }

      .filter__method {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: $primary;

        &.--input {}
      }

      .filter__operator {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: $gray-700;
        margin-left: 10px;
      }

      .--text {
        gap: 0px !important;
      }

      .filter__select {
        flex: 1;
        min-width: 140px;


        &.--text {
          display: flex;
          align-items: center;
          height: 32px;
          border-radius: 6px;
          margin-right: 10px;
          box-sizing: border-box;
          display: flex;
          gap: 4px;
          // border: 2px dashed $gray-300;
          color: $primary;
        }
      }


    }
  }

  // 표로보기
  .kanban-container-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow-y: scroll;
  }


  // 칸반으로 보기
  .kanban-container-boards {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 100%;
    padding-left: 20px;
    height: 100%;
    overflow-x: scroll;
    margin-top: 20px;
    margin-bottom: 20px;

    .add-btn {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
      width: 100%;
      height: 36px;
      opacity: 0.8;
      padding: 0px 10px;
      flex-shrink: 0;

      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .kanban-container-boards__panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    // margin-top: 20px;
    gap: 10px;
    width: 280px;
    height: 100%;
    background-color: $background-transparent;





    // 넓이 고정
    flex-shrink: 0;
    min-height: 60%;
    padding: 4px 10px;
    padding-bottom: 16px;
    border-radius: 8px;
  }

  .kanban-container-boards__panel-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 700;
    padding: 0 6px;
  }

  .kanban-container-boards__panel-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 6px;

    overflow-y: scroll;
  }

  .kanban-card {
    // transition: all 1s ease-in-out;
    box-sizing: border-box;
  }

  .kanban-class {
    font-size: 16px;
    font-weight: 700;
    color: $gray-500;
  }

  // 확장 메뉴 버튼
  .kanban-menu {
    font-weight: 700;
  }


  // 폼
  .form-wrap {
    padding: 0 20px;
    border-radius: 10px;
  }

  // 첫번째 태그 마진 제거
  .el-form-item__content .el-tag:first-child {
    margin-left: 0;
  }

  .tag-container {
    margin-bottom: 10px;
  }
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  font-size: 20px;
  padding-top: 20px;
  font-weight: 700;

  .save__text {
    font-size: 16px;
    font-weight: 700;
  }

  .el-button {
    display: flex;
    width: 100%;
  }
}

.md-editor {
  width: 100%;
  height: 300px;
  border-radius: 10px;
  padding: 10px;
}

.tool-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: 700;
}

.card-drag-wrap {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
  transition: all 0.1s ease-in-out;

  .card-drag-wrap__top {
    position: absolute;
    width: 100%;
    height: 50%;
    top: 0;
    left: 0;
    z-index: 3;

    .card-drag-wrap__top__inner {
      position: absolute;
      width: 100%;
      height: 8px;
      top: 0;
      left: 0;
      background-color: $primary-300;
      z-index: 3;
      opacity: 0;

      &.active {
        opacity: 1;
      }
    }
  }

  .card-drag-wrap__bottom {
    position: absolute;
    width: 100%;
    height: 50%;
    bottom: 0;
    left: 0;
    z-index: 3;

    .card-drag-wrap__bottom__inner {
      position: absolute;
      width: 100%;
      height: 6px;
      bottom: 0;
      left: 0;
      background-color: $primary-300;
      z-index: 3;
      opacity: 0;

      &.active {
        opacity: 1;
      }
    }
  }
}

// [필터 팝오버] 필터 추가
.kanban-filter__popover {
  .kanban-filter__popover__method {
    .el-button {
      width: 50%;
      height: 40px;
      border: none;
    }
  }

  .select-filter {
    margin-top: 20px;
  }


  //select-value
  &__select-value {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40px;
    font-size: 20px;
    font-weight: 700;
    margin-top: 10px;
  }

  .help-text {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-top: 6px;
    margin-left: 12px;
    font-size: 12px;
    color: $warning;
  }

  .popover__footer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 40px;
    font-size: 20px;
    font-weight: 700;

    margin-top: 20px;

    .popover__confirm-btn {
      width: 50%;
      height: 40px;
      margin-top: 10px;
    }
  }
}

// FAB 버튼 필터 뷰 세팅
.filter-views-popover {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;

  z-index: 10;
  transition: all 0.1s ease-in-out;

  .el-button {
    height: 40px;
    border: none;
  }
}





// <!-- 다른 사람이 만든 필터 -->
.filter-other-views {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  width: auto;
  height: 40px;
  font-size: 20px;
  font-weight: 700;
}

.filter__input {
  min-width: 300px;
}

.--disabled {
  opacity: 0.2;
  pointer-events: none;
}

html.dark {
  .kanban-container-boards__panel {
    background-color: $dark-gray-300;
  }

  // border-top
  .kanban-action-menu-bar {
    border-top: 1px solid $dark-gray-100;
  }

  .kanban-filter {
    border-top: 1px solid $dark-gray-100 !important;
  }

  .add-btn:hover {
    background-color: $dark-gray-100;
  }


}
</style>

<style lang="scss">
.moon-notification {
  // 보라색

  &--off {
    background-color: #8a2be2;

    svg {
      color: #8a2be2 !important;
    }
  }

  &--on {
    background-color: #8a2be2;

    // 타이틀
    .el-notification__title {
      opacity: 0.6;
    }

    svg {
      color: $gray-500 !important;
      opacity: 0.6;
    }
  }
}

.dropdown-header__container {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  .filter__remove-btn {
    display: flex !important;
    font-weight: 200;
  }
}

.show-btn {
  &.--is-off {
    background-color: #892be257;
  }
}

.filter__select.--date {
  display: flex;
  border: 0px;
  width: 200px;
  flex: 1 0;


  // .el-input {
  //   border-radius: 8px 0 0 8px;
  // }

  .el-input__wrapper {
    border: 0px;
    // width: 200px;
  }

  .filter__remove-btn {

    // 날짜
    &.date {
      width: 40px;
      position: relative;
      padding: 0px;
      margin: 0px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: $gray-500;
      border: 1px solid #4C4D4F;
      background-color: #262727;
      // border-left: 0px;
      border-radius: 0 8px 8px 0;
    }
  }
}

//  Color Picker
.color-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  height: 40px;
  font-size: 20px;
  font-weight: 700;
  margin-top: 10px;


  // 컬리 픽커 팔레트 안보이게
  .el-color-dropdown__main-wrapper {
    display: none;
  }

  .el-color-alpha-slider {
    display: none;
  }

  .el-color-dropdown__btns {
    display: none;
  }

  .color-picker__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $background-transparent;
    font-size: 14px;
    color: $gray-600;
    transition: all 0.2s ease-in-out;



    &:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
}

.color-picker-container {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  font-size: 20px;
  font-weight: 700;

  .el-color-picker__trigger {
    padding: 0px;
  }

  .el-color-picker__color {
    border: none;
    border-radius: 6px;
    overflow: hidden;
  }

  // 닫기 버튼
  .el-color-picker__close {
    display: none;
  }
}
</style>
