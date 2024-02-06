<template>
  <!-- 드래그엔 드랍이 가능한 칸반보드 (한일, 보류, 할일) -->
  <div class="kanban-container">
    <div class="kanban-header">
      <h2 class="kanban-header__title">
        <!-- [그룹 > 프로젝트 > 팀] -->
        <span>그룹</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
        <span>프로젝트</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
        <span>팀</span>
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
    <section class="kanban-action-menue-bar">
      <el-menu v-model="activeName" class="dashboard-filter" mode="horizontal" @select="el => handleClickNameActive(el)">
        <el-sub-menu index="담당자">
          <template #title>
            <span>{{ activeName ? activeName : '담당자' }}</span>
          </template>
          <el-menu-item index="전체">
            <span>전체</span>
          </el-menu-item>
          <el-menu-item v-for="user in users" :key="user.id" :index="user.name">
            <span>{{ user.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
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
        <KanbanBoardCard @click="handleClickToUpdate(card, board.title)" ref="kanbanBoardCard"
          @delete="handleDeleteCard(card.id)" v-for="card in filterCards.filter(el => el.boardIdx === board.id)"
          @dragstart="handleDragStart($event, card)" draggable="true" :key="card.id" :card="card" />
        <EmptyKanbanCard v-if="filterCards.filter(el => el.boardIdx === board.id).length === 0"
          @add="handleClickToAdd(board)" />
        <el-button v-else-if="filterCards.filter(el => el.boardIdx === board.id).length > 0" type="dashed" size="large"
          class="add-btn" text @click="handleClickToAdd(board)">추가하기</el-button>
      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-drawer class="dark" width="800" :title="modalKanban.boardTitle" v-model="modalKanban.dialogVisible"
      :before-close="modalKanban.beforeClose">
      <ModalKanbanCardCreate :isOpen="modalKanban.dialogVisible" :form="form" @enter.self="handleSave(selectedBoardId)"
        @update:form="updateForm" />
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="primary" @click="handleSave(selectedBoardId)">
            <span class="save__text">저장</span>
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { Board, Card } from "@/types/KanbanBoard.ts";
import ModalKanbanCardCreate from "./ModalKanbanCardCreate.vue";
import KanbanBoardCard from "@/components/KanbanBoardCard.vue";
import EmptyKanbanCard from "@/components/EmptyKanbanCard.vue";
import { cloneDeep } from "lodash";
import { useUserStore } from "@/stores/user";
import { useBoardStore } from "@/stores/board";

import "md-editor-v3/lib/style.css";


const users = computed(() => useUserStore().getMockUsers)

// const findUserNameById = useUserStore().findUserNameById

const boards = computed(() => useBoardStore().getBoards)
// const props = defineProps<{
//   boards: Board[];
// }>();

const selectedBoardId = ref(0);
const selectedWorker = ref(null);
const activeName = ref("전체 담당자");
const searchValue = ref("");
// const boards = ref<Board[]>(props.boards);
const cards = ref<Card[]>([
  {
    id: 1,
    title: "테스트 카드",
    description: "카드 내용",
    created_date: "2021-10-10",
    userIdx: 1,
    userName: '김말랑',
    boardIdx: 1,
    tags: [{
      id: 1,
      title: 'Commit',
      color: '#ffffff'
    }],
    commit: [],
  }
]);
const initForm = () => ({
  id: 1,
  title: "",
  description: "",
  created_date: "",
  userIdx: 1,
  userName: '김말랑',
  boardIdx: 1,
  tags: [],
  commit: [],
});
const handleClickNameActive = (name) => {
  activeName.value = name;
  selectedWorker.value = name;
}

class CardActions {
  create(cardId, boardId, form) {
    console.log(boardId);
    cards.value.push({
      ...form.value,
      id: cardId,
      boardIdx: boardId,
      created_date: new Date().toISOString().slice(0, 10),
    });

    // 만약 커밋에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드의 커밋에 추가
    this.addCommit(cardId, form.value);

  }



  update(cardId, form) {
    const cardIdx = cards.value.findIndex((card) => card.id === cardId);
    cards.value.splice(cardIdx, 1, {
      ...form.value,
    });
    // 만약 커밋에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드의 커밋에 추가
    this.addCommit(cardId, form.value);
  }

  delete(cardId) {
    const cardIdx = cards.value.findIndex((card) => card.id === cardId);
    cards.value.splice(cardIdx, 1);

    this.resetCommit(cards.value)
    this.addCommit(cardId, cards.value)
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
          const cardIdx = cards.value.findIndex((card) => card.id === Number(afterMb));
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
            userIdx: element.userIdx,
            card_idx: element.id,
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

  beforeClose(done) {
    const isClose = window.confirm("작성중인 내용이 있습니다. 정말 닫으시겠습니까?");
    if (isClose) {
      this.dialogVisible = false;
      done();
    }
  }
}


let cardActions = new CardActions();
const modalKanban = reactive(new ModalKanban());

let form = ref<Card>(initForm());

// 검색한 카드를 필터링하여 보여줍니다.
const filterCards = computed(() => {
  return cards.value.filter((card) => {
    return card.title.includes(searchValue.value);
  });
});

const handleClickToUpdate = (card: Card, boardTitle) => {
  form.value = cloneDeep(card);
  modalKanban.open("update", boardTitle);
};

const handleSave = (boardId) => {
  const modalType = modalKanban.openType;

  if (modalType === 'create') {
    cardActions.create(cards.value.length + 1, boardId, form);
  } else if (modalType === 'update') {
    cardActions.update(form.value.id, form);
  }
  console.log(boardId);
  modalKanban.close();
  form.value = initForm();
};


const handleClickToAdd = (board) => {
  const boardTitle = board.title;
  selectedBoardId.value = board.id;
  form.value = initForm();
  form.value.userIdx = selectedWorker.value;
  modalKanban.open("create", boardTitle)
};

const handleDeleteCard = (cardId) => {
  cardActions.delete(cardId);
};

/* -------------------------------- 드래그엔드랍기능 -------------------------------- */
// 카드 드래그 (다른 보드의 카드로 이동 가능)
const handleDragStart = (e, card) => {
  e.dataTransfer.setData("cardId", card.id);
  // e.dataTransfer.setData("cardBoardIdx", card.boardIdx);
};

// 카드 드랍 (다른 보드의 카드로 이동 가능)
const onDrop = (e, boardId) => {
  const cardId = e.dataTransfer.getData("cardId");
  // const cardBoardIdx = e.dataTransfer.getData("cardBoardIdx");

  const cardIdx = cards.value.findIndex((card) => card.id === Number(cardId));
  cards.value[cardIdx].boardIdx = boardId;

  // 만약 커밋에 #mb-1 이런식으로 카드 번호가 붙어있으면 해당 카드의 커밋에 추가
  cardActions.addCommit(cardId, cards.value)
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
    }

    .kanban-search {
      display: flex;
      width: 100%;
      // background-color: $dark-gray-100;
      border-radius: 6px;
      color: #ffffff;
    }
  }

  .kanban-action-menue-bar {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: flex-end;

    dashboard-filter {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      justify-content: flex-end;
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

  .el-form-item__content {}

  .el-form-item__content .el-input__inner {
    background-color: #2b2b2b;
  }

  // 첫번째 태그 마진 제거
  .el-form-item__content .el-tag:first-child {
    margin-left: 0;
  }

  .el-form-item__content .el-tag {
    // background-color: #2b2b2b;b
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
</style>