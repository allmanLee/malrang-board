<template>
  <div class="kanban-board-card">
    <div class="kanban-board-card--num">
      <span class="header__card-num">
        #mb-{{ card.id }}
      </span> <!-- 복사 버튼 -->
      <el-tooltip content="번호 복사" placement="top">
        <el-icon @click.stop="handleClickNumCopy(card.id)" class="kanban-copy">
          <CopyDocument />
        </el-icon>
      </el-tooltip>
      <el-tooltip content="커밋 메시지 복사" placement="top">
        <el-icon @click.stop="handleClickCommitCreate(card)" class="kanban-copy">
          <el-icon>
            <Ticket />
          </el-icon>
        </el-icon>
      </el-tooltip>
    </div>
    <div class="kanban-board-card-header">
      <div class="kanban-board-card-tags" v-if="card.tags.length">
        <!-- 태그중 첫번째 -->
        <el-tag v-for="tag in card.tags" :key="tag.id" type="info" effect="dark">{{ tag.title }}</el-tag>
      </div>
      <div class="kanban-board-card-header__menu">
        <!-- 삭제 아이콘 버튼 -->
        <el-icon class="kanban-delete menu-icon" @click.stop="handleClickDelete">
          <Delete />
        </el-icon>
        <!-- 메뉴 아이콘 버튼 -->
        <el-icon class="kanban-menu menu-icon">
          <MoreFilled />
        </el-icon>
      </div>
    </div>
    <div class="kanban-board-card-header-title">
      <span class="title-text">
        {{ card.title }}</span>
    </div>
    <!-- <div class="kanban-board-card-body">
      {{ card.description }}
    </div> -->


    <div class="commit" v-if="card.commit[0]">
      <!-- 전체 커밋 노출 -->
      <div class="commit__item" v-for="(commit, index) of card.commit" :key="index">
        <article :class="{ 'commit__item--hind': index > 3 }">
          <span class="commit__body">
            {{ commit.title }}
            <span class="card-num">
              <a class="card-num__link" href="">
                (#mb-{{ commit.id }})
              </a>
            </span>
          </span>
        </article>
      </div>
    </div>
    <!-- 만약 커밋이 3개 이상이면 더보기 버튼 노출 -->
    <div class="commit__more__btn" v-if="card.commit.length > 2">
      <span class="commit__header">
        <el-icon class="kanban-copy">
          <MoreFilled />
        </el-icon>
      </span>
    </div>


  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { ElIcon } from "element-plus";
import { ElTag } from "element-plus";
import { Card } from "@/types/KanbanBoard.ts";
import { ElMessage } from "element-plus";

const emit = defineEmits(["delete"]);

defineProps<{
  card: Card;
}>();

// 카드 번호를 클립보드에 복사합니다.
const handleClickNumCopy = (id) => {
  navigator.clipboard.writeText(`#mb-${id}`);
  // element ui 메시지
  ElMessage({
    message: "카드 번호가 복사되었습니다.",
    type: "success",
  });
};

/** function handleClickCommitCreate
 * @description 커밋 메시지를 생성하여 클립보드에 저장합니다.
 * @param {Card} card
 */
const handleClickCommitCreate = (card) => {
  const cardId = card.id;
  const cardTitle = card.title;
  const cardTag = card.tags[0]?.title || 'chore';

  const commitMessage =
    ` ${cardTag}: ${cardTitle} (#mb-${cardId})`

  navigator.clipboard.writeText(commitMessage);

  // element ui 메시지
  ElMessage({
    message: "커밋 메시지가 복사되었습니다.",
    type: "success",
  });
};

const handleClickDelete = () => {
  console.log("삭제");
  emit("delete");
};

</script>
<style scoped lang="scss">
.kanban-board-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 0 20px;
  padding-bottom: 10px;

  // 칸반 카드 번호
  .kanban-board-card--num {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-top: 10px;

    .header__card-num {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 10px;
      font-size: 16px;
      font-weight: 700;
      color: white;
    }

    .kanban-copy {
      margin-left: 10px;
      cursor: pointer;
      color: #ffffff;
    }
  }

  .kanban-board-card-header {
    display: flex;
    width: 100%;

    .kanban-board-card-header-title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;

      .header__card-num {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;

        .card-num__link {
          color: #ffffff;
          font-size: 12px;
          text-decoration: none;
        }
      }
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
    margin-top: 10px;
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
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 40px;
    margin-right: 10px;
  }
}

.kanban-board-card-body {
  font-size: 14px;
}

// 구분선
div.solid {
  width: 100%;
  border-top: 1px solid #616161;
}

.commit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;

  .commit__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: #f5f5f5;
  }

  .commit__header {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #4b4b4b;
  }

  .commit__body {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 30px;
    margin-top: 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    font-weight: 500;
    color: #f5f5f5;
    justify-content: space-between;

    .card-num__link {
      color: #9e9e9e;
      text-decoration: none;
      margin-right: 2px;
    }

    .commit__item--hind {
      display: none;
    }

    .commit__more__btn {
      width: 100%;
      height: 30px;
      margin-top: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #f5f5f5;
      cursor: pointer;
    }

    .solid {
      width: 100%;
      border-top: 1px solid #616161;
    }

    .commit__header {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #4b4b4b;
    }
  }

  .el-badge {
    display: flex;
    margin-top: 6px;
  }

}


.title-text {
  margin-right: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

/* ---------------------------------- hover --------------------------------- */
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