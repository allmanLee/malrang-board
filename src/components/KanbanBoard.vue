<template>
  <!-- 드래그엔 드랍이 가능한 칸반보드 (한일, 보류, 할일) -->
  <div class="kanban-container">
    <!-- FAB 그룹 버튼 -->
    <el-button-group class="fab-buttons">
      <el-tooltip class="item" effect="dark" content="필터를 초기화합니다." placement="top">
        <el-button text type="primary" :disabled="isOffFilter" @click="handleClickFilterReset">
          <el-icon class="filter" :class="{ '--is-off': isOffFilter }">
            <Filter />
          </el-icon>
          <span class="filter__text">필터 초기화</span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="일시적으로 필터를 끕니다." placement="top">
        <el-button type="primary" @click="handleClickFilter" :disabled="isOffFilter">
          <i>
            <el-icon>
              <MoonNight />
            </el-icon>
          </i>
          <span class="filter__text">필터 숨기기</span>
        </el-button>
      </el-tooltip>
    </el-button-group>

    <div class="kanban-header">
      <h2 class="kanban-header__title">
        <!-- [그룹 > 프로젝트 > 팀] -->
        <span>{{ kanbanInfo.groupName }}</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
        <span>{{ kanbanInfo.projectName }}</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
        <span>{{ kanbanInfo.teamName }}</span>

        <!-- 소켓 연결 여부 -->
        <el-tooltip class="item" effect="dark" content="실시간 연결됨" placement="top">
          <el-icon class="kanban-menu" :class="state.connected ? 'success' : 'error'">
            <el-icon v-if="state.connected" class="success" :icon="state.connected ? 'el-icon-success' : 'el-icon-error'"
              :class="{ 'socket-icon': true, 'is-connect': state.connected }">
              <Check />
            </el-icon>
          </el-icon>
        </el-tooltip>
      </h2>

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
      <section class="kanban-filter">
        <section class="kanban-action-menu-bar__container" :class="{ '--is-off': isOffFilter }">
          <el-form label-position="top" label-width="100px" :model="test" style="max-width: 460px; display: flex;">
            <el-form-item v-for="(filter, index2) in filters.filter((f) => f.active)" :key="filter.filterLabel"
              :label="filter.filterLabel" class="filter__item">
              <el-select placeholder="" v-model="filter.selectedValue" multiple class="select-user">
                <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.name"></el-option>
                <template #tag> <span>{{ filter.method }}</span><el-tag v-for="(value, index) in filter.selectedValue"
                    :key="index">{{ value }}</el-tag>
                </template>
              </el-select>
            </el-form-item>
          </el-form>

        </section>



        <!-- 필터 추가버튼 popover -->
        <!-- 클릭하면 어떤조건으로 추가할지[button-group], 무엇을 필터링 할지 select -->
        <el-popover :visible="isVisiblePop" placement="bottom" width="auto" trigger="click" @blur="isVisiblePop = false">
          <!-- 컬럼 선택 -->
          <el-select v-model="selectedFilterLable" placeholder="필터 선택" class="select-user">
            <el-option v-for="filter in filters" :key="filter.filterLabel" :label="filter.filterLabel"
              :value="filter.filterLabel">
            </el-option>
          </el-select>
          <div class="kanban-filter__method">
            <h3 class="kanban-filter__popover__title">조건</h3>
            <el-radio-group class="kanban-filter__popover__btns" v-model="selectedfilterMetnod">
              <el-radio-button type="primary" class="filter__btn" label="동일한" />
              <el-radio-button type="primary" class="filter__btn" label="포함한" />
              <el-radio-button type="primary" class="filter__btn" label="제외한 나머지" />
              <el-radio-button type="primary" class="filter__btn" label="비어있는" />
              <el-radio-button type="primary" class="filter__btn" label="비어있지 않은" />
            </el-radio-group>
          </div>
          <div class="popover__footer">
            <!-- 닫기 -->
            <el-button type="text" @click="isVisiblePop = false" class="popover__confirm-btn">취소</el-button>
            <el-button type="primary" class="popover__confirm-btn"
              @click="handleClickFilterAdd(selectedFilterLable, selectedfilterMetnod, '동일한')">확인</el-button>
          </div>
          <template #reference>
            <!-- 검색필터 추가 아이콘 버튼 -->
            <el-button @click="isVisiblePop = !isVisiblePop" class="filter__add-btn">
              <el-icon>
                <Plus />
              </el-icon> 필터 추가
            </el-button>
          </template>
        </el-popover>
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
          text @click="handleClickToAdd(board)">추가하기</el-button>
      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-drawer class="dark" width="800" :title="modalKanban.boardTitle" v-model="modalKanban.dialogVisible">
      <ModalKanbanCardCreate :isOpen="modalKanban.dialogVisible" :form="form" @enter.self="handleSave(selectedBoardId)"
        @update:form="updateForm" :type="modalKanban.openType" />
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="primary" @click="handleSave(selectedBoardId)">
            <span class="save__text">저장</span>
          </el-button>
        </div>
      </template>
    </el-drawer>
    <!-- filter setting (Flot Button) 필터 선택기능
    다른사람이 만들어둔 필터SET을 선택하거나, 현재 필터 세팅을 'filterName'을 받아 저장할 수 있다. -->

    <el-button type="primary" class="fab-button" round @click="isOpenFilterView = true">
      <el-icon>
        <Filter />
      </el-icon>
      <span>저장된 필터 보기</span>
    </el-button>

    <el-dialog title="저장된 필터 보기" v-model="isOpenFilterView" width="auto">
      <!-- 다른 사람이 만든 필터 -->
      <div class="filter-other-views">
        <el-select v-model="selectedFilterLable" placeholder="필터 선택" class="select-user"
          :class="{ '--disabled': !!filterViewName }" :disabled="!filterOtherViews.length || !!filterViewName">
          <el-option v-for="filter in filterOtherViews" :key="filter.filterLabel" :label="filter.filterLabel"
            :value="filter.filterLabel">
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
        <el-button size="large" type="default" @click="handleClickViewSelect" v-if="filterViewName.length"
          @keypress.enter="handleClickViewSelect">
          <span class="save__text">'{{ selectedFilterLable }}' 선택</span>
        </el-button>
      </template>
    </el-dialog>


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


import { ElMessageBox } from "element-plus"; // 메세지 박스

import "md-editor-v3/lib/style.css";
import API from "@/apis";

// Socket IO (실시간 통신)
import { state, socket } from "@/socket";

const users = computed(() => useUserStore().getMockUsers)
const boards = computed(() => useBoardStore().getBoards)
const selectedTeamId = computed(() => useCommonStore().getSbSelectedTeamId)
const selectedTeamName = computed(() => useCommonStore().getSbSelectedTeamName)
const selectedProjectName = computed(() => useCommonStore().getSbSelectedProjectName)
const selectedProjectId = computed(() => useCommonStore().getSbSelectedProjectId)
const selectedGroupName = computed(() => useUserStore().getGroupName)

const selectedBoardId = ref('');
const selectedWorker = ref(null);
const selectedFilterLable = ref("");
const searchValue = ref("");

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
const selectedfilterMetnod = ref('동일한');


const isOpenFilterView = ref(false);
const selectedFilterView = ref(null);
const filterOtherViews = ref([]);
const filterViewName = ref('');

const getSelectedFilterView = () => {
  // API 호출
  // const result = await API.getFilterView();
  // filterOtherViews.value = result;
  filterOtherViews.value = [
    {
      filterLabel: '내가 만든 필터1', _id: '12asdfasd2334', filters: [
        { filterLabel: '담당자', method: '동일한', selectedValue: '', option: [{ label: '전체 담당자', value: '전체 담당자' }], active: false },
        { filterLabel: '프리픽스', method: '동일한', selectedValue: '', option: [{ label: '전체 프리픽스', value: '전체 프리픽스' }], active: false },
      ]
    },
  ];
};

getSelectedFilterView();

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

  }

  isOpenFilterView.value = false;
};


// 기본 필터 세팅
filters.value.push({
  filterLabel: '담당자',
  method: '동일한',
  selectedValue: '',
  option: [
    { label: '전체 담당자', value: '전체 담당자' },
  ],
  active: false,
},
  {
    filterLabel: '프리픽스',
    method: '동일한',
    selectedValue: '',
    option: [
      { label: '전체 프리픽스', value: '전체 프리픽스' },
    ],
    active: false,
  },
);

type Filter = {
  selectedValue: string | string[];
  filterLabel: string;
  option: FilterOption[];
  method: string;
  active: boolean
};
type FilterOption = {
  label: string;
  value: string;
};

const handleClickFilterAdd = (label, option, method) => {

  // active 상태 변경
  filters.value.forEach((el) => {
    if (el.filterLabel === label) {
      el.active = true;
      el.method = method;
    }
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
    el.selectedValue = '';
  });
  isOffFilter.value = false;
};



// const boards = ref<Board[]>(props.boards);
const cards = ref<Card[]>([]);
const initForm = (): Card => ({
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
});

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


const handleClickNameActive = (name) => {
  // activeName.value = name;
  selectedWorker.value = name;
}

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

const updateForm = (newForm) => {
  form.value = newForm;
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

let form = ref<Card>(initForm());

// 검색한 카드를 필터링하여 보여줍니다.
const filterCards: ComputedRef<Card[]>
  = computed(() => {
    return cards.value.filter((card) => {
      return card.title.includes(searchValue.value);
    });
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
const handleSave = (boardId) => {
  const modalType = modalKanban.openType;

  if (modalType === 'create') {
    delete form.value._id;
    const order = filterCards.value.filter(el => el.boardId === boardId).length
    cardActions.create(order + 1, boardId, form);
  } else if (modalType === 'update') {
    cardActions.update(form.value._id, form);
  }
  modalKanban.close();
  form.value = initForm();
};


const handleClickToAdd = (board) => {
  const boardTitle = board.title;
  selectedBoardId.value = board.id;
  form.value = initForm();
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
  gap: 20px;
  width: 100%;
  height: 100%;
  background-color: $dark-gray-500;
  padding: 20px;

  .kanban-header {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .kanban-header__title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      border-right: 2px solid $dark-gray-100;
      margin-right: 20px;
      padding-right: 20px;
      gap: 4px;

      span {
        white-space: nowrap;
        font-weight: 700;
        color: $gray-200;
      }

      // 소켓
      .socket-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        padding: 4px;
        border-radius: 50%;
        background-color: $dark-gray-100;

        margin-left: 12px;

        &.is-connect {
          color: $success;
        }
      }
    }

    .kanban-search {
      display: flex;
      width: 100%;
      height: 40px;
      // background-color: $dark-gray-100;
      border-radius: 6px;
      color: #ffffff;
    }
  }

  // 칸반보드 필터
  .kanban-action-menu-bar {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    padding: 10px;
    border-radius: 10px;
    // margin-left: 10px;
    margin-right: 10px;
    width: 100%;

    .kanban-filter {
      display: flex;
      align-items: flex-end;

      .kanban-action-menu-bar__container {
        // margin-left: 20px;

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

      .select-user {
        border-radius: 12px;
        margin-right: 10px;
        width: 200px;
      }
    }
  }



  .kanban-container-boards {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    height: 100%;
    overflow-x: scroll;

    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      margin-top: 10px;
      border: 1px dashed $gray-700; // color: #ffffff;
    }
  }

  .kanban-container-boards__panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    // background-color: $gray-600;
    gap: 10px;
    width: 280px;



    // 넓이 고정
    flex-shrink: 0;
    min-height: 60%;
    // background-color: black;
    padding: 4px 10px;
    padding-bottom: 16px;
    border-radius: 10px;
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
    padding: 0 10px;
  }

  .kanban-card {
    transition: all 1s ease-in-out;
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

  .el-form-item__content .el-input__inner {
    background-color: #2b2b2b;
  }

  // 첫번째 태그 마진 제거
  .el-form-item__content .el-tag:first-child {
    margin-left: 0;
  }

  .el-form-item__content .el-tag {
    margin-left: 10px;
    // color: #ffffff;
  }

  .tag-container {
    margin-bottom: 10px;
  }
}

.dialog-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  height: 30px;
  font-size: 20px;
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
  border: none;
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
      background-color: $primary;
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
      background-color: $primary;
      z-index: 3;
      opacity: 0;

      &.active {
        opacity: 1;
      }
    }
  }
}


.kanban-filter__method {
  margin-top: 10px;

  .kanban-filter__popover__title {
    font-size: 14px;
    font-weight: 700;
    color: $gray-500;
  }

  // 칸반보드 검색필터 추가 팝오버
  .kanban-filter__popover__btns {
    align-items: center;
    margin-top: 6px;
    margin-bottom: 20px;
    width: 100%;

    .filter__btn {
      padding: 0px;
      border: none;
    }
  }
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

  .popover__confirm-btn {
    width: 50%;
    height: 40px;
    margin-top: 10px;
  }
}

.fab-buttons {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  // gap: 10px;
  right: 20px;
  top: 20px;
  z-index: 10;
  transition: all 0.1s ease-in-out;

  .el-button {
    height: 40px;
    border: none;
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

.fab-button {
  position: absolute;
  border: none;
  // width: 40px;
  // height: 40px;
  right: 20px;
  bottom: 20px;
}



// <!-- 다른 사람이 만든 필터 -->
.filter-other-views {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  width: 240px;
  height: 40px;
  font-size: 20px;
  font-weight: 700;
}

.--disabled {
  opacity: 0.2;
  pointer-events: none;
}
</style>