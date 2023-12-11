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
            <i @click="handleClickNoteAdd"> <el-icon class="kanban-menu">
                <Edit />
              </el-icon>
            </i>
          </el-tooltip>
          <!-- 추가기능 아이콘 (추가하기) -->
        </header>
        <KanbanBoardCard ref="kanbanBoardCard" v-for="card in cards" :key="card.id" :card="card" />
      </div>
    </div>
    <!-- 팝업 메뉴 -->
    <el-dialog class="dark" :title="`노트 추가`" v-model="dialogVisible" :before-close="modalKanban.dialogVisible">
      <el-form>
        <el-form-item label="담당자">
          <el-input v-model="form.user" placeholder="담당자를 입력하세요"></el-input>
        </el-form-item>
        <el-form-item label="제목">
          <el-input v-model="form.title" placeholder="제목을 입력하세요"></el-input>
        </el-form-item>
        <el-form-item label="내용">
          <el-input v-model="form.description" :rows="12" class="form-textarea" type="textarea"
            placeholder="내용을 입력하세요"></el-input>
        </el-form-item>
        <el-form-item label="태그">

          <el-input class="tag__input" v-model="form.tag" placeholder="태그를 입력하세요" @keyup.enter="handleAddTag"></el-input>
          <div class="tag-container">
            <el-tag v-for="tag in form.tags" :key="tag.id" :type="tag.color" closable @close="handleCloseTag(tag)">
              {{ tag.title }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalKanban.dialogVisible = false">취소</el-button>
        <el-button type="primary" @click="handleSave">저장</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Board, Card } from "@/types/KanbanBoard.ts";

const props = defineProps<{
  boards: Board[];
}>();

const boards = props.boards

// 칸반 카드 데이터 (MOCKUP)
const cards = ref<Card[]>([
  {
    id: 1,
    title: "카드 제목",
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
        title: "fix: 말랑보드 칸반 만크업 완료",
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

// 저장
const handleSave = () => {
  cards.value.push({
    id: cards.value.length + 1,
    title: form.value.title,
    description: form.value.description,
    created_date: "2021-10-10",
    user_idx: 1,
    board_idx: 1,
    tags: form.value.tags,
    commit: [],
  });
  form.value.title = "";
  form.value.description = "";
  form.value.tags = [];
  form.value.tag = "";
  dialogVisible.value = false;
};


// 팝업 객체
const popup = class {
  dialogVisible = false;
  handleClose(done: any) {
    // this.$confirm("정말 취소하시겠습니까?").then(() => {
    //   done();
    // });
    console.log("닫힘")
    done();
  }
};

const modalKanban = new popup();
const dialogVisible = ref(false);


const handleClickNoteAdd = () => {
  dialogVisible.value = true;
};





// 사용한 컴포넌트
import KanbanBoardCard from "@/components/KanbanBoardCard.vue";

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
</style>