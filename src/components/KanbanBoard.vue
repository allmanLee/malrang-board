<template>
  <!-- 드래그엔 드랍이 가능한 칸반보드 (한일, 보류, 할일) -->
  <div class="kanban-container">
    <section class="kanban-action-menue-bar">
      <!-- 칸반 추가 버튼 -->
      <!-- 필터 버튼 -->
    </section>
    <div class="kanban-container-boards">

      <div class="kanban-container-boards__panel" v-for="board in boards" :key="board.id">
        <!-- 칸반 카드 입니다. (드래그엔드랍기능) -->
        <header class="kanban-container-boards__panel-header">
          <h1 class="kanban-class">{{ board.title }}</h1>
          <el-tooltip class="item" effect="dark" content="노트 추가" placement="top">
            <i @click="handleClickNoteAdd(board.id)"> <el-icon class="kanban-menu">
                <Edit />
              </el-icon>
            </i>
          </el-tooltip>
          <!-- 추가기능 아이콘 (추가하기) -->
        </header>
        <KanbanBoardCard ref="kanbanBoardCard" v-for="card in cards.filter(el => el.board_idx === board.id)"
          :key="card.id" :card="card" />


      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-dialog class="dark" :title="`노트 추가`" v-model="modalKanban.dialogVisible" :before-close="modalKanban.beforeClose">
      <!-- <el-form class="form-wrap">
        <el-form-item label-width="60px" size="large" label="담당자">
          <el-input v-model="form.user" placeholder="담당자를 입력하세요"></el-input>
        </el-form-item>
        <el-form-item label-width="60px" size="large" label="제목">
          <el-input v-model="form.title" placeholder="제목을 입력하세요"></el-input>
        </el-form-item>
        <el-form-item label-width="60px" label="태그">
          <el-input class="tag__input" v-model="form.tag" placeholder="태그를 입력하세요" @keyup.enter="handleAddTag"></el-input>
          <div class="tag-co∂ntainer">
            <el-tag v-for="tag in form.tags" :key="tag.id" :type="tag.color" closable @close="handleCloseTag(tag)">
              {{ tag.title }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div class="tool-bar">
            <el-tooltip class="item" effect="dark" content="전체화면" placement="top">
              <i @click="editorRef.togglePageFullscreen(true)">
                <el-icon>
                  <FullScreen />
                </el-icon>
              </i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="미리보기" placement="top">
              <i @click="editorRef.togglePreview()">
                <el-icon>
                  <View />
                </el-icon>
              </i>
            </el-tooltip>
          </div>
          <div class="md-editor">
            <md-editor ref="editorRef" language="en-US" :scrollAuto="true" theme="dark" v-model="form.description" />
          </div>
        </el-form-item>

      </el-form> -->
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalKanban.close()">취소</el-button>
        <el-button type="primary" @click="handleSave(selectedBoardId)">저장</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { Board, Card } from "@/types/KanbanBoard.ts";

// MD 에디터
// import { MdPreview, MdCatalog } from 'md-editor-v3';
// import 'md-editor-v3/lib/preview.css';

import { MdEditor } from 'md-editor-v3';
import "md-editor-v3/lib/style.css";


const props = defineProps<{
  boards: Board[];
}>();

const boards = props.boards
const selectedBoardId = ref(0)


// 전체화면
const editorRef = ref(null)
// const isFullScreen = ref(false)

nextTick(() => {
  console.log(editorRef.value)
})

// 칸반 카드 데이터 (MOCKUP)
const cards = ref<Card[]>([
  {
    id: 1,
    title: "테스트 카드",
    description: "카드 내용",
    created_date: "2021-10-10",
    user_idx: 1,
    board_idx: 1,
    tags: [{
      id: 1,
      title: 'Commit',
      color: '#ffffff'
    }],
    commit: [
      {
        id: 1,
        title: "fix: 말랑보드 칸반 크업 완료",
        created_date: "2021-10-10",
        user_idx: 1,
        card_idx: 2,
      },
    ],
  },

]);

// 칸반 카드 데이터 (MOCKUP)
const form = ref({
  user: "",
  title: "",
  description: "",
  tags: [],
  tag: "",
});


// 태그 추가
const handleAddTag = () => {
  if (form.value.tag) {
    form.value.tags.push({
      id: form.value.tags.length + 1,
      title: form.value.tag,
      color: "#ffffff",
    });
    form.value.tag = "";
  }
};

// 태그 삭제
const handleCloseTag = (tag: any) => {
  form.value.tags.splice(form.value.tags.indexOf(tag), 1);
};

// 저장 boardId를 받아서 Form 데이터를 가진 카드를 저장
const handleSave = (boardId) => {
  console.log(boardId);
  const card = {
    id: cards.value.length + 1,
    title: form.value.title,
    description: form.value.description,
    created_date: "2021-10-10",
    user_idx: 1,
    board_idx: boardId,
    tags: form.value.tags,
    commit: [],
  };
  cards.value.push(card);
  modalKanban.close();
};




// 팝업 클래스 (모달) 상태, 열기, 닫기
class ModalKanban {
  dialogVisible: boolean = false;
  open() {
    this.dialogVisible = true;
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


const modalKanban = reactive(new ModalKanban());



const handleClickNoteAdd = (boardId) => {
  selectedBoardId.value = boardId
  modalKanban.open();
};





// 사용한 컴포넌트
import KanbanBoardCard from "@/components/KanbanBoardCard.vue";
import { is } from "cypress/types/bluebird";
import { watch } from "fs";
import { nextTick } from "process";

// 드래그 앤 드랍 기능


</script>
<style scoped lang="scss">
.kanban-container {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 100px;
  margin-bottom: 100px;
  width: 100%;
  height: 100%;

  .kanban-container-boards {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 100%;
    height: 500px;
    border: 1px solid red;
  }

  .kanban-container-boards__panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    width: 300px;
    height: 100%;
    background-color: #2b2b2b;
    padding: 4px;
  }

  .kanban-container-boards__panel-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 50px;
    background-color: #2b2b2b;
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
    padding: 20px;
    border-radius: 10px;
    background-color: #1f1f1f;
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
  height: 50px;
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