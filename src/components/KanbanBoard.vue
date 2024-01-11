<template>
  <!-- 드래그엔 드랍이 가능한 칸반보드 (한일, 보류, 할일) -->
  <div class="kanban-container">
    <h1 class="kanban-class">칸반보드</h1>

    <!-- 검색 -->
    <el-input class="kanban-search" v-model="searchValue" placeholder="검색어를 입력하세요" prefix-icon="el-icon-search"
      clearable />
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
          @delete="handleDeleteCard(card.id)" v-for="card in filterCards.filter(el => el.board_idx === board.id)"
          @dragstart="handleDragStart($event, card)" draggable="true" :key="card.id" :card="card" />

        <EmptyKanbanCard v-if="filterCards.filter(el => el.board_idx === board.id).length === 0"
          @add="handleClickToAdd(board)" />
      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-dialog class="dark" width="800" :title="modalKanban.boardTitle" v-model="modalKanban.dialogVisible"
      :before-close="modalKanban.beforeClose">
      <ModalKanbanCardCreate :isOpen="modalKanban.dialogVisible" :form="form" @enter.self="handleSave(selectedBoardId)"
        @update:form="updateForm" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="modalKanban.close()">취소</el-button>
          <el-button type="primary" @click="handleSave(selectedBoardId)">저장</el-button>
        </div>
      </template>
    </el-dialog>
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

import "md-editor-v3/lib/style.css";


const users = useUserStore().getMockUsers;

const findUserNameById = useUserStore().findUserNameById


const props = defineProps<{
  boards: Board[];
}>();

const selectedBoardId = ref(0);
const selectedWorker = ref(null);
const activeName = ref("전체 담당자");
const searchValue = ref("");
const boards = props.boards;
const cards = ref<Card[]>([
  {
    id: 1,
    title: "테스트 카드",
    description: "카드 내용",
    created_date: "2021-10-10",
    user_idx: 1,
    user_name: '김말랑',
    board_idx: 1,
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
  user_idx: 1,
  user_name: '김말랑',
  board_idx: 1,
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
      board_idx: boardId,
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
            user_idx: element.user_idx,
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
  form.value.user_idx = selectedWorker.value;
  modalKanban.open("create", boardTitle)
};

const handleDeleteCard = (cardId) => {
  cardActions.delete(cardId);
};

const handleSaveToEmit = {

}

/* -------------------------------- 드래그엔드랍기능 -------------------------------- */
// 카드 드래그 (다른 보드의 카드로 이동 가능)
const handleDragStart = (e, card) => {
  e.dataTransfer.setData("cardId", card.id);
  // e.dataTransfer.setData("cardBoardIdx", card.board_idx);
};

// 카드 드랍 (다른 보드의 카드로 이동 가능)
const onDrop = (e, boardId) => {
  const cardId = e.dataTransfer.getData("cardId");
  // const cardBoardIdx = e.dataTransfer.getData("cardBoardIdx");

  const cardIdx = cards.value.findIndex((card) => card.id === Number(cardId));
  cards.value[cardIdx].board_idx = boardId;

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
  margin-top: 0px;
  margin-bottom: 100px;
  width: 100%;
  height: 100%;

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

  .kanban-search {
    width: 100%;
    height: 50px;
    color: #ffffff;
    padding: 0 0px;

  }

  .kanban-container-boards {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 100%;
    height: 500px;
  }

  .kanban-container-boards__panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 300px;
    min-height: 60%;
    background-color: black;
    padding: 4px;
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
    // font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }


  // 폼
  .form-wrap {
    padding: 0 20px;
    border-radius: 10px;
  }

  .el-form-item__content {
    color: #ffffff;
  }

  .el-form-item__content .el-input__inner {
    background-color: #2b2b2b;
    color: #ffffff;
  }

  // 첫번째 태그 마진 제거
  .el-form-item__content .el-tag:first-child {
    margin-left: 0;
  }

  .el-form-item__content .el-tag {
    background-color: #2b2b2b;
    margin-left: 10px;
    color: #ffffff;
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
  height: 30px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.md-editor {
  width: 100%;
  height: 300px;
  background-color: black;
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
  color: white;
  font-size: 20px;
  font-weight: 700;
}
</style>