<template>
  <el-card class="kanban-board-card" ref="cardRef" :class="{ 'kanban-board-card--linked': isLinked }" :id="linkedCardId">
    <div class="kanban-board-card-header">
      <div class="kanban-board-card-header__menu">
        <!-- 삭제 아이콘 버튼 -->
        <el-icon class="kanban-delete menu-icon" @click.stop="handleClickDelete">
          <Delete />
        </el-icon>
        <!-- 메뉴 아이콘 버튼 -->
        <!-- <el-icon class="kanban-menu menu-icon">
          <MoreFilled />
        </el-icon> -->

        <!-- 링크 아이콘 -->
        <div v-if="isLinked || card.commit.length" class="linked-icon" :class="{ 'linked-icon--linked': isLinked }">

          <el-icon class="linked-icon__icon">
            <Link />
          </el-icon>
          <span class="icon-link__text">{{ card.commit.length
          }}</span>
        </div>
      </div>
    </div>



    <section class="card__item--profile">
      <el-avatar shape="square" class="header__user-avatar" :size="20"
        src="https://avatars.githubusercontent.com/u/26598542?v=4" alt="avatar" />
      <span class="header__user-name">
        {{ card.user_name }}
      </span>
    </section>
    <div class="kanban-board-card-header-title">
      <span class="title-text">
        {{ card.title }}
      </span>
    </div>
    <div class="kanban-board-card--num">

      <section class="kanban-board-copy-icons">
        <span class="header__card-num">
          #mb-{{ card.id }}
        </span> <!-- 복사 버튼 -->
        <el-tooltip content=" 번호 복사" placement="top">
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
      </section>
      <div class="kanban-board-card-tags" v-if="card.tags.length">

        <el-tag size="small" type="info" effect="dark">{{ card.tags[0].title }}</el-tag>
        <el-tag size="small" type="info" effect="dark">+3</el-tag>
      </div>
    </div>


    <!-- 전체 커밋 노출 -->
    <!-- <div class="commit" v-if="card.commit[0]">
      <div class="commit__item" v-for="( commit, index ) of  card.commit " :key="index">
        <article :class="{ 'commit__item--hind': index > 3 }">

          <a class="card-num__link" @click.stop="() => { }" :href="`#card__item-${commit.id}`">
            <span class="card-num">
              #mb-{{ commit.id }}
            </span>
            <span class="commit__body">
              {{ commit.title }}
            </span>
          </a>
        </article>
      </div>
    </div> -->

    <!-- [더보기 버튼] 만약 커밋이 3개 이상이면 노출 -->
    <div class="commit__more__btn" v-if="card.commit.length > 2">
      <span class="commit__header">
        <el-icon class="kanban-copy">
          <MoreFilled />
        </el-icon>
      </span>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, onUnmounted } from "vue";
import { ElIcon } from "element-plus";
import { ElTag } from "element-plus";
import { Card } from "@/types/KanbanBoard.ts";
import { ElMessage } from "element-plus";


const emit = defineEmits(["delete"]);

const props = defineProps<{
  card: Card;
}>();

/* ------------------------------- URL 해시 관련 코드 ------------------------------- */
const cardRef = ref(null);

// const userName = computed(() => {
//   const userIdx = props.card.user_idx;
//   return users.value.find((user) => user.id === userIdx)?.name || "이름없음";
// });

// 카드 밖 클릭시 URL 해시 제거
const handleClickOutside = () => {
  // const test = !cardRef.value.contains(e.target);
  // if (test) {
  const url = window.location.href.split("#")[0];
  window.history.pushState({}, null, url);
  // }
};

// 카드 밖 클릭시 이벤트 등록
window.addEventListener("click", handleClickOutside);

// 컴포넌트가 제거될때 이벤트 제거
onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});

// 연결된 카드가 있는지 여부
// 제목에 #이 들어가 있으면 연결된 카드가 있다고 판단합니다.
const isLinked = computed(() => {
  return props.card.title.includes("#");
});

// 연결된 카드의의 id
const linkedCardId = computed(() => {
  return `card__item-${props.card.id}`;
});

// const linkedElementId = computed(() => {
//   return `#card__item-${props.card.id}`;
// })


/* ------------------------------- 커밋 메시지 ------------------------------- */

// 카드 번호를 클립보드에 복사합니다.
const handleClickNumCopy = (id) => {
  navigator.clipboard.writeText(`#mb-${id} `);

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
    ` ${cardTag}: ${cardTitle} (#mb - ${cardId})`

  navigator.clipboard.writeText(commitMessage);

  // element ui 메시지
  ElMessage({
    message: "커밋 메시지가 복사되었습니다.",
    type: "success",
  });
};


/* ------------------------------- 삭제 ------------------------------- */

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
  border-radius: 10px;
  border: none;
  padding: 0;
  border: 1px solid transparent; // padding-bottom: 10px;

  // 연결된 카드일 경우: 어두운 보랏빛
  &.kanban-board-card--linked {
    background-color: #4a536b;

    // hover 했을때
    &:hover {
      background-color: #203a51;
    }
  }

  .linked-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 30px;
    padding: 0 12px;
    height: 30px;
    border-radius: 10px;
    background-color: #4a536b;
    cursor: pointer;

    .linked-icon__icon {
      color: #ffffff;
      margin-top: 0px;
      right: 4px;
    }

    .icon-link__text {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }

    &:hover {
      background-color: #2b2b2b;
    }
  }

  .card__item--profile {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .header__user-avatar {
      // margin-right: 10px;
      border: 1px solid;
    }

    .header__user-name {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      margin-left: 10px;
    }
  }

  // 칸반 카드 번호
  .kanban-board-card--num {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-top: 12px;

    .kanban-board-copy-icons {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;

      .header__card-num {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 10px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        z-index: 2;
      }

      .kanban-copy {
        box-sizing: content-box;
        // margin-left: 10px;
        cursor: pointer;
        color: #ffffff;
        padding: 4px;
        // background-color: #434242;
        border-radius: 12px;
      }

      .kanban-copy:hover {
        color: #eaeaea;
        background-color: #434242;
      }
    }
  }

  // 카드 헤더
  .kanban-board-card-header {
    display: flex;
    width: 100%;

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

  .kanban-board-card-header-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;

    .title-text {
      margin-right: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      width: 220px;
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
}

.kanban-board-card-tags {
  display: flex;
  gap: 4px;
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
  width: 100%;
  margin-bottom: 10px;

  .commit__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    color: #f5f5f5;
    overflow: hidden;
  }

  .commit__header {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #4b4b4b;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .card-num__link {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 20px;
    color: #9e9e9e;
    font-weight: 500;
    color: #f5f5f5;
    text-decoration: none;
    margin-right: 2px;
    white-space: nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;

    .card-num {
      margin-right: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #9e9e9e;
    }
  }

  .commit__body {
    cursor: pointer;
    display: flex;
    font-size: 14px;



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




/* ---------------------------------- hover --------------------------------- */
.kanban-board-card:hover .kanban-board-card-header__menu {
  display: flex;
}

.kanban-board-card:hover {
  background-color: black;
  border: 1px solid #4a536b;
}


.background-tag-wrapper {
  position: absolute;
  width: auto;
  min-width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  opacity: 0;
  border-radius: 10px;
  // background-color: #2b2b2b;
  transition: all 0.3s ease-in-out;

  .background-title {
    position: absolute;
    top: 8px;
    left: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    height: 30px;
    font-weight: 700;
    color: #ffffff;
    overflow: hidden;


    .background-title__text {
      margin-right: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      padding: 10px;
      width: 160px;
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }



}

.background-tag-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 1;
}

.commit__body:hover {
  text-decoration: underline;
}

/* ---------------------------------- focus --------------------------------- */
</style>