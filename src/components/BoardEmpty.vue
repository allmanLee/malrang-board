<template>
  <div class="board-empty">
    <div class="info">
      <div class="board-empty__text">
        <p class="board-empty__text__title">팀을 선택해주세요!</p>
        <p>말랑보드는 팀 별 보드를 제공합니다.</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
// import type { Board } from "@/types/KanbanBoard.ts";
import type { Project, Team } from "@/types/projects.type.ts";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const project = computed(() => userStore?.getProjects);

const projectOptions = computed(() => {
  const options = [];

  project.value?.forEach((item: Project) => {
    const children = [];
    item.teams?.forEach((team: Team) => {
      children?.push({
        value: team._id,
        label: team.name,
      });
    });
    options?.push({
      value: item._id,
      label: item.name,
      children,
    });
  });

  return options;
})

const cascaderProps = {
  multiple: true,
}

const filterToday = ref([]);

const setFilterToday = () => {
  filterTodayCard.value = []
}



const getBoards = async () => {
  // const boards = await userStore.getBoards;
  // boards.value = boards;
};
</script>

<style scoped lang="scss">
.board-empty {
  display: flex;
  // 가운데 정렬
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 80vh;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;

    .info__card-list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;

      .info__card-list__item {
        width: 500px;
        height: 500px;
        list-style-type: none;

        // 카드
        .el-card {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          cursor: pointer;

          &:hover {
            box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.12);
          }

          // 카드 헤더
          ::v-deep(.el-card__header) {
            padding: 0;
            height: 40px;
            border-radius: 10px 10px 0 0;
            background-color: #409eff;
            // color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          // 카드 본문
          ::v-deep(.el-card__body) {
            padding: 20;
            height: 260px;
            border-radius: 0 0 10px 10px;
            background-color: rgba($color: #000000, $alpha: 0.1);
            // color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            display: flex;
          }
        }
      }
    }
  }

  .info__card-list__item__body {
    display: flex;
    flex-direction: column;
    width: 100%;

    .body__filter {
      display: flex;


      ::v-deep(.el-cascader) {
        width: 100% !important;
      }
    }
  }


  .board-empty__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    width: 500px;
    // color: #ffffff;;
    font-weight: 700;
    margin-bottom: 20px;

    .board-empty__text__title {
      font-size: 54px;
      font-weight: 700;
    }
  }
}

.article-today {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  height: 100%;
  // color: #ffffff;
  font-size: 16px;
  font-weight: 700;

  .article-today__title {
    font-size: 20px;
    font-weight: 700;
  }

  .article-today--empty {
    font-size: 16px;
    font-weight: 700;
    color: #4f565d;
  }
}
</style>