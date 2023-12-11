<template>
  <div class="kanban-board-card">
    <div class="kanban-board-card-header">
      <div class="kanban-board-card-header-title">

        <span class="title-text">카드 제목</span>
        <!-- <el-tag type="info" effect="dark">Cmit</el-tag> -->
      </div>

      <div class="kanban-board-card-header__menu">
        <el-icon class="kanban-delete menu-icon">
          <Delete />
        </el-icon>
        <el-icon class="kanban-menu menu-icon">
          <MoreFilled />
        </el-icon>
      </div>

    </div>
    <div class="kanban-board-card-tags">
      <el-tag type="info" effect="dark">Commit</el-tag>
    </div>
    <div class="kanban-board-card-body">
      카드 내용 (원하는 항목을 추가해주세요.)
    </div>

    <!-- <div class="solid"></div> -->
    <div class="commit">
      <span class="commit__body">
        fix: 말랑보드 칸반 만크업 완료
      </span>
      <el-badge value="1"></el-badge>
    </div>

  </div>
</template>
<script setup lang="ts">

// const props = defineProps<{
//   board: Board;
// }>();

// const board = props.board;
</script>
<style scoped lang="scss">
.kanban-board-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 600px;
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 0 20px;

  .kanban-board-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;

    .kanban-board-card-header-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
    }

    .title-text {
      margin-right: 10px;
    }

    .kanban-board-card-header__menu {
      position: absolute;
      right: 6px;
      top: 6px;
      display: flex;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;


      border-radius: 12px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
      background-color: #1b1b1b;
    }

    .kanban-board-card-header__menu {
      display: none;
    }

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 12px;
      cursor: pointer;

      .kanban-delete {
        color: #ffffff;
        border-radius: 0 12px 12px 0;
      }

      .kanban-menu {
        color: #ffffff;
        border-radius: 12px 0 0 12px;
      }
    }

    // 칸반 카드 메뉴 아이콘 호버했을때
    .menu-icon:hover {
      background-color: #2b2b2b;
    }



  }


  .kanban-board-card-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-height: 200px;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
    // background-color: #2b2b2b;

    .kanban-board-card-body-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }
  }

  .kanban-board-card-tags {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 20px;
  }
}

.kanban-board-card-body {
  font-size: 14px;
}

// 구분선
div.solid {
  width: 100%;
  border-top: 1px solid #ffffff;
}

.commit {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .commit__header {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }

  .commit__body {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 30px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    justify-content: space-between;
  }

  .el-badge {
    display: flex;
    margin-top: px;
  }

}



// hover

.kanban-board-card:hover .kanban-board-card-header__menu {
  display: flex;
}

.kanban-board-card:hover {
  background-color: #4b4b4b;
}

.commit__body:hover {
  text-decoration: underline;
}
</style>