<template>
  <!-- 드래그엔 드랍이 가능한 칸반보드 (한일, 보류, 할일) -->
  <div class="kanban-container">
    <div class="kanban-header">
      <h2 class="kanban-header__title">
        <!-- [그룹 > 프로젝트 > 팀] -->
        <!-- <span>{{ kanbanInfo.groupName }}</span>
        <el-icon>
          <ArrowRight />
        </el-icon> -->
        <span>{{ kanbanInfo.projectName }}</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
        <span>{{ kanbanInfo.teamName }}</span>

        <!-- 소켓 연결 여부 -->
        <!-- <el-tooltip class="item" effect="dark" content="실시간 연결됨" placement="top">
          <el-icon class="kanban-menu" :class="state.connected ? 'success' : 'error'">
            <el-icon v-if="state.connected" class="success" :icon="state.connected ? 'el-icon-success' : 'el-icon-error'"
              :class="{ 'socket-icon': true, 'is-connect': state.connected }">
              <Check />
            </el-icon>
          </el-icon>
        </el-tooltip> -->
      </h2>
      <!-- <el-divider direction="vertical" class="kanban-header__divider"></el-divider> -->
      <el-input class="kanban-search" v-model="searchValue" placeholder="티켓의 제목, 담당자, 태그를 생각나는거 있어요?" clearable>
        <!-- prefix 검색 아이콘 -->
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>
    <!-- 검색 -->
    <section class="kanban-action-menu-bar" @click="handleClickFilter(false)">
      <!-- filter setting (Flot Button) 필터 선택기능
    다른사람이 만들어둔 필터SET을 선택하거나, 현재 필터 세팅을 'filterName'을 받아 저장할 수 있다. -->
      <section class="kanban-action-btns">
        <div class="--left">
          <el-button type="primary" class="kanban-action-btn__item --table-view" round @click="isOpenFilterView = true">
            <el-icon>
              <Filter />
            </el-icon>
            <span>저장된 필터 보기</span>
          </el-button>
          <el-button text type="default" class="kanban-action-btn__item" :disabled="isOffFilter"
            @click="handleClickFilterReset" round>
            <el-icon class="filter" :class="{ '--is-off': isOffFilter }">
              <Filter />
            </el-icon>
            <span class="filter__text">필터 초기화</span>
          </el-button>
          <!-- 필터 숨기기 -->
          <el-button text type="default" round @click="handleClickFilter">
            <el-icon>
              <MoonNight />
            </el-icon>
            <span> {{ isOffFilter ? '필터 보이기' : '필터 숨기기' }}</span>
          </el-button>
          <!-- {{ selectedFilterView ? selectedFilterView.filterLabel : '' }} -->
        </div>

        <div class="--right">

          <el-button text type="default" class="kanban-action-btn__item" round @click="isOpenFilterView = true">
            <el-icon>
              <Grid />
            </el-icon>
            <span>표로 보기</span>
          </el-button>


        </div>
        <el-dialog title="저장된 필터 보기" v-model="isOpenFilterView" width="auto">
          <!-- 다른 사람이 만든 필터 -->
          <!-- <span>필터를 저장하거나 현재 선택된 필터를 등록할 수 있습니다.</span> -->
          <div class="filter-other-views">

            <el-select v-model="selectedFilterView" placeholder="필터 선택" class="select-user" value-key="filterLabel"
              :class="{ '--disabled': !!filterViewName }" :disabled="!filterOtherViews.length || !!filterViewName">
              <el-option v-for="filter in filterOtherViews" :key="filter.filterLabel" :label="filter.filterLabel"
                :value="filter">
              </el-option>
            </el-select>
          </div>

          <!-- 내 필터 이름 -->
          <el-input v-model="filterViewName" placeholder="내 필터 이름" clearable class="filter__input"
            @keypress.enter="handleClickViewSave"></el-input>
          <!-- 푸터 -->
          <template #footer>
            <el-button size="large" type="primary" @click="isOpenFilterView = false" :disabled="!filterViewName">
              <span class="save__text">내 필터 등록</span>
            </el-button>
            <el-button size="large" type="default" @click="handleClickViewSelect" v-if="!filterViewName.length"
              @keypress.enter="handleClickViewSelect">
              <span class="save__text">'{{ selectedFilterView?.filterLabel }}' 선택</span>
            </el-button>
          </template>
        </el-dialog>
      </section>
      <!-- <el-divider direction="horizontal" class="filter-divider--top"></el-divider> -->


      <section class="kanban-filter">
        <section class="kanban-action-menu-bar__container" :class="{ '--is-off': isOffFilter }">
          <el-form label-position="top" label-width="100px"
            style="display: flex; width: 100%; flex-wrap: wrap; align-items:flex-end; gap: 10px;">
            <el-form-item v-for="(filter, index) in selectedFilters" :key="filter.filterLabel" class="filter__item">
              <!-- <p class="filter__method-icon">
                담당자
              </p> -->
              <el-badge :is-dot="true" :value="filter.filterLabel + ': ' + filter.method"
                :type="filter.method === '일치' ? 'success' : filter.method === '포함' ? 'warning' : filter.method === '제외' ? 'danger' : 'info'">
                <el-select v-if="filter.method !== '비어있는' && filter.method !== '비어있지 않은'"
                  :placeholder="filter.filterLabel + ' 선택'" v-model="filter.value" multiple :disabled="isOffFilter"
                  class="filter__select">
                  <template #header>
                    <el-checkbox v-model="filter.checkAll" :indeterminate="filter.indeterminate"
                      @change="(e) => handleCheckAll(e, filter)">
                      전체 선택
                    </el-checkbox>
                  </template>
                  <!-- <el-option-group :label="filter.method + ': ' + filter.filterLabel"> -->
                  <el-option v-for="(op, index) in filter.option" :key="index" :label="op.label" :value="op.value">
                    {{ op.label }}
                  </el-option>
                  <template #tag>
                    <span class="filter__method" v-if="filter.value.length">
                      {{ filter.method }}</span>
                    <el-tag v-for="(value, index) in filter.value" :key="index">
                      {{ value }}
                    </el-tag>
                  </template>
                </el-select>
                <div v-else :placeholder="filter.filterLabel" :disabled="true" class="filter__select --text">
                  <span class="filter__method">{{ filter.method }}</span> {{ filter.filterLabel }}
                </div>
              </el-badge>
              <!-- select = 비어있는, 비어있지 않은 -->

            </el-form-item>

            <!-- [필터 추가 팝오버] 필터 추가 아이콘 버튼 선택시 -->
            <el-popover :visible="isVisiblePop" placement="bottom" width="auto" trigger="click"
              @blur="isVisiblePop = false">
              <div class="kanban-filter__popover">
                <div class="kanban-filter__popover__method">
                  <el-radio-group class="kanban-filter__popover__btns" v-model="selectedfilterMetnod">
                    <el-radio-button type="primary" class="filter__btn" label="일치" />
                    <el-radio-button type="primary" class="filter__btn" label="포함" />
                    <el-radio-button type="primary" class="filter__btn" label="제외" />
                    <el-radio-button type="primary" class="filter__btn" label="비어있는" />
                    <el-radio-button type="primary" class="filter__btn" label="비어있지 않은" />
                  </el-radio-group>
                </div>
                <el-select v-model="selectedFilter" placeholder="필터 선택" class="select-filter" value-key="filterLabel">
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
          </el-form>
        </section>



        <!-- 필터 추가버튼 popover -->
        <!-- 클릭하면 어떤조건으로 추가할지[button-group], 무엇을 필터링 할지 select -->

      </section>
    </section>


    <div class="kanban-container-boards">

      <div class="kanban-container-boards__panel" v-for="board in boards" :key="board.id"
        @drop.prevent="onDrop($event, board.id)" @dragenter.prevent @dragover.prevent>
        <!-- 칸반 카드 입니다. (드래그엔드랍기능) -->
        <header class="kanban-container-boards__panel-header">
          <h1 class="kanban-class">{{ board.title }}</h1>
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
          <el-button v-else-if="filterCards.filter(el => el.boardId === board.id).length > 0" size="large" class="add-btn"
            @click="handleClickToAdd(board)" text>
            <el-icon>
              <Plus />
            </el-icon>
            추가하기</el-button>
        </section>
      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-drawer size="55%" :title="modalKanban.boardTitle" v-model="modalKanban.dialogVisible" destroy-on-close>
      <ModalKanbanCardCreate :isOpen="modalKanban.dialogVisible" :form="form" @enter.self="handleSave(selectedBoardId)"
        :optinalField="getTemple" @update:form="updateForm" :type="modalKanban.openType" />
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
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
// computed 타입
import type { ComputedRef } from "vue";
import { Board, Card } from "@/types/Kanban.type";
import ModalKanbanCardCreate from "./ModalKanbanCardCreate.vue";
import KanbanBoardCard from "@/components/KanbanBoardCard.vue";
import EmptyKanbanCard from "@/components/EmptyKanbanCard.vue";
import { cloneDeep, orderBy } from "lodash";
import { useUserStore } from "@/stores/user";
import { useBoardStore } from "@/stores/board";
import { useCommonStore } from "@/stores/common";
import { ElMessageBox, ElNotification } from "element-plus"; // 메세지 박스

import "md-editor-v3/lib/style.css";
import API from "@/apis";

// Socket IO (실시간 통신)
import { state, socket } from "@/socket";
import { FormTemplate } from "@/types/projects.type";

type FilterView = {
  filterLabel: string;
  _id: string;
  filters: Filter[];
};

const users = computed(() => useUserStore().getMockUsers)
const boards = computed(() => useBoardStore().getBoards)
const selectedTeamId = computed(() => useCommonStore().getSbSelectedTeamId)
const selectedTeamName = computed(() => useCommonStore().getSbSelectedTeamName)
const selectedProjectName = computed(() => useCommonStore().getSbSelectedProjectName)
const selectedProjectId = computed(() => useCommonStore().getSbSelectedProjectId)
const selectedGroupName = computed(() => useUserStore().getGroupName)

const selectedBoardId = ref('');
const selectedWorker = ref(null);
const selectedFilterView = ref<FilterView>(null); // 현재 선택된 필터뷰 [저장된 필터보기로 선택된]
const selectedFilter: Filter = ref(null);  // 현재 선택된 필터 아이템 [필터 추가]
const selectedFilters = ref<Filter[]>([]);  // 현재 선택된 필터 [필터 추가로 선택된 필터 아이템들]
const selectedFilterLable = ref(''); // 현재 선택된 필터 이름
const searchValue = ref("");
const selectedForm: FormTemplate = ref(null);

const cards = ref<Card[]>([]);
const initForm = ref<Card>({
  _id: '',
  title: "",
  description: "",
  created_date: "",
  userId: "",
  userName: '',
  teamId: selectedTeamId.value,
  boardId: '',
  projectId: '',
  order: 0,
  tags: [],
  commit: [],
  optionalData: {},
});
// const initForm = computed(() => {
//   // const templateCols = getTemple.value.cols;

//   const default3: Card = {
//     _id: '',
//     title: "",
//     description: "",
//     created_date: "",
//     userId: "",
//     userName: '',
//     teamId: selectedTeamId.value,
//     boardId: '',
//     projectId: '',
//     order: 0,
//     tags: [],
//     commit: [],
//   }
//   const templateField = {}

//   // templateCols.forEach((el) => {
//   //   templateField[el.id] = null;
//   // });

//   return {
//     ...default3,
//     ...templateField,
//   }
// });
// team에 formTemplate가 있음
const selectedTemplate = ref({});
//선택한 팀에 따라서 폼이 달라짐

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


const isOpenFilterView = ref(false);
const filterOtherViews = ref([]);
const filterViewName = ref('');



// 필터 추가 Select
watch(selectedFilters, (val) => {
  selectedFilters.value.forEach((el, idx) => {
    //필터 라벨과 일치하는 필터를 찾아서 값을 비교합니다.
    const sameLabelOption = filters.value.filter((filter) => filter.filterLabel === selectedFilters.value[idx].filterLabel)[0].option.map((el) => el.value);
    if (selectedFilters.value[idx].value.length === 0) {
      el.checkAll = false
      el.indeterminate = false
    } else if (sameLabelOption.length === selectedFilters.value[idx].value.length) {
      el.checkAll = true
      el.indeterminate = false
    } else {
      el.indeterminate = true
    }
  })
}, { deep: true })


const handleCheckAll = (e, filter) => {
  filter.value = e ? filter.option.map((el) => el.value) : [];
  filter.indeterminate = false;
};


/** function 필터뷰 가져오기
 * @returns void
 */
const fetchFilterViews = () => {
  // API 호출
  // const result = await API.getFilterView();
  // filterOtherViews.value = result;
  filterOtherViews.value = [
    {
      filterLabel: '내가 만든 필터1', _id: '12asdfasd2334', filters: [
        { filterLabel: '담당자', method: '일치', value: '', option: [{ label: '이유준', value: '이유준' }], active: false },
        { filterLabel: '프리픽스', method: '일치', value: '', option: [{ label: '전체 프리픽스', value: '전체 프리픽스' }], active: false },
      ]
    },
    {
      filterLabel: '내가 만든 필터2', _id: '12asdfasd2334', filters: [
        { filterLabel: '담당자', method: '일치', value: '', option: [{ label: '전체 담당자', value: '전체 담당자' }], active: false },
        { filterLabel: '프리픽스', method: '일치', value: '', option: [{ label: '전체 프리픽스', value: '전체 프리픽스' }], active: false },
      ]
    },
    {
      filterLabel: '내가 만든 필터3', _id: '12asdfasd2334', filters: [
        { filterLabel: '담당자', method: '일치', value: '', option: [{ label: '전체 담당자', value: '전체 담당자' }], active: false },
        { filterLabel: '프리픽스', method: '일치', value: '', option: [{ label: '전체 프리픽스', value: '전체 프리픽스' }], active: false },
      ]
    },
  ];
};


/** @function 카드필터링
 * @param val filters
 * @param cards cards
 * @description 
 */
const filterCardsByAction = (val, cards) => {
  const filterCards = cards.filter((card) => {
    return val.every((el) => {
      if (el.method === '일치') {
        return el.value.includes(card[el.filterLabel]);
      } else if (el.method === '포함') {
        return el.value.some((value) => card[el.filterLabel].includes(value));
      } else if (el.method === '제외') {
        return !el.value.includes(card[el.filterLabel]);
      } else if (el.method === '비어있는') {
        return card[el.filterLabel] === '';
      } else if (el.method === '비어있지 않은') {
        return card[el.filterLabel] !== '';
      }
    });
  });

  return filterCards;
};

fetchFilterViews();

const handleClickViewSave = () => {
  // 만약 내 필터 이름이 중복되면
  // 중복된다는 문구 표시
  // 중복되지 않으면
  // 내가 설정한 필터가 저장됩니다. 문구 표시
  ElMessageBox.alert("내 필터가 저장되었습니다.", "알림", {
    confirmButtonText: "확인",
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
  option: FilterOption[];
  method: string;
  active: boolean;
  checkAll: boolean;
  indeterminate: boolean;
};
type FilterOption = {
  label: string;
  value: string;
};



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

/* ------------------------------------ - ----------------------------------- */


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

  isVisiblePop.value = false;
};

// 필터 보기
const handleClickFilter = (isBtn) => {
  if (isBtn) {
    isOffFilter.value = !isOffFilter.value;
    console.log('isOffFilter', isOffFilter.value)
  } else {
    isOffFilter.value = false;
  }
};

const handleClickFilterReset = () => {
  filters.value.forEach((el) => {
    el.active = false;
    el.value = '';
  });
  isOffFilter.value = false;
};

// Socket IO (실시간 통신)
// const boardStore = useBoardStore();
onMounted(() => {
  // remove any existing listeners (after a hot module replacement)
  // boardStore.bindEvent();
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

  socket.on("cards:deleted", (data) => {
    const cardId = data?.cardId;
    console.log('cards:deleted', cardId)

    const cardIdx = cards.value.findIndex((el) => el._id === cardId);
    cards.value.splice(cardIdx, 1);
  });

})

onUnmounted(() => {
  socket.off();
  state.connected = false;
})


// 위에 있을떄 드래그오버 이벤트
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

// 카드 조회 API 호출
const getCards = async () => {
  console.log(selectedTeamId.value)
  const query = {
    teamId: selectedTeamId.value,
  }
  const result: Card[] = await API.getCards(query);
  cards.value = result;
};


// selectedTeamId 변경시 카드 조회
watch(selectedTeamId, () => {
  getCards();
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



  update(cardId, form) {
    const cardIdx = cards.value.findIndex((card) => card._id === cardId);
    cards.value.splice(cardIdx, 1, {
      ...form.value,
    });
    // 만약 커밋에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드의 커밋에 추가
    this.addCommit(cardId, form.value);
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
          // const cardTag = element?.tags[0]?.title || 'chore';

          // const commitMessage =
          //   ` ${cardTag}: ${cardTitle}`

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

      .kanban-action-btn__item {
        border: none;
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

        // 글씨는 천천히 보여지고, 크기는 빠르게
        &::v-deep(sup) {
          font-size: 12px;
          color: $gray-100;
        }
      }

      .kanban-action-menu-bar__container {
        display: flex;
        // 넘어가면 아래로
        flex-wrap: wrap;
        // width: 400px;

        .filter__item {
          display: flex;
          flex-direction: column;


          &::v-deep(.el-form-item__content) {
            display: flex;
            flex-direction: row;
            align-items: center;
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
        margin-left: 10px;
        color: $primary;
      }

      .filter__select {
        flex: 1;
        min-width: 140px;


        &.--text {
          display: flex;
          align-items: center;
          width: 100%;
          height: 32px;
          border-radius: 6px;
          margin-right: 10px;
          box-sizing: border-box;
          display: flex;
          gap: 4px;
          border: 2px dashed $gray-300;
          color: $primary;
        }
      }


    }
  }

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

  .--text {
    border: 2px dashed $dark-gray-100 !important;
  }

  .add-btn:hover {
    background-color: $dark-gray-100;
  }


}
</style>