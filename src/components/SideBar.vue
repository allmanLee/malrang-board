<template>
  <el-row class="tac">
    <el-col>
      <!-- 팀 또는 프로젝트 검색 -->
      <section class="search">
        <el-input v-model="searchText" placeholder="팀 또는 프로젝트 검색" clearable>
          <!-- prefix 검색 아이콘 -->
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </section>

      <section class="admin-settings">
        <!-- 프로젝트 관리 버튼 - solid -->
        <el-tooltip content="프로젝트 및 팀 관리 화면으로 이동합니다." placement="top">
          <el-button class="admin-settings__btn" @click="() => $router.push('/project')">
            프로젝트 관리
          </el-button>
        </el-tooltip>
      </section>

      <!-- 팀 즐겨찾기 -->
      <h5 class="mb-2">팀 즐겨찾기</h5>


      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item v-for="(t, index) in  filteredTeamsByBookmark" :key="index" :index="`${index}`">
          <span>{{ t.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col class="prj-searched" v-if="filteredProjects?.length && searchText">
      <h5 class="mb-2">프로젝트 검색 결과</h5>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item v-for="(prj, index) in filteredProjects" :key="index" @click="handleClickPrj" :index="`${index}`">
          <template #title>
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>{{ prj.name }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col class="team-searched" v-if="filteredTeams?.length && searchText">
      <h5 class="mb-2">팀 검색 결과</h5>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item v-for="(t, index) in  filteredTeams" :key="index" :index="`${index}`">
          <span>{{ t.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>



    <el-col class="prj" v-show="filteredProjects?.length && !searchText">
      <h5 class="mb-2">전체 프로젝트</h5>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        ref="projectAllRef">
        <el-sub-menu :index="`${index}`" v-for="(prj, index) in filteredProjects" :key="index">
          <template #title>
            <el-icon>
              <icon-menu />
            </el-icon>
            <span class="ti">{{ prj.name }}</span>
          </template>
          <el-menu-item v-for="(t, index) in  prj.teams" :key="index" :index="`${index}`" class="test">
            <div class="border-left">
              <span class="team-name">{{ t.name }}</span>
            </div>

          </el-menu-item>
          <div v-if="isEmpty(prj.teams)" class="is-empty">
            <el-menu-item disabled>
              <span class="team-name">팀이 없습니다.</span>
            </el-menu-item>

          </div>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user';
import { isEmpty } from 'lodash';

// 스토어 프로젝트 목록
const userStore = useUserStore()
const projects = computed(() => userStore.getProjects)
const teams = computed(() => userStore.getTeams)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// 프로젝트 별 팀 목록
const projectAllRef = ref(null)


//  검색어 지우고, 해당프로젝트 index 오픈
const handleClickPrj = () => {
  searchText.value = ''
  closeAll()
  projectAllRef.value.open('0')
}

// 전부 닫는다.
const closeAll = () => {
  projects.value.forEach((prj, index) => {
    console.log(index)
    projectAllRef.value.close(index)
  })
}


const bookmarkTeam = [
  {
    name: '팀1',
    id: 1,
    prj_id: 1,
  },
  {
    name: '팀2',
    id: 2,
    prj_id: 2,
  }
]


let searchText = ref('')

const filteredProjects = computed(() => {
  console.log(projects.value)
  return projects?.value?.filter(project => project.name.includes(searchText.value))
})

const filteredTeams = computed(() => {
  console.log(teams.value)
  return teams?.value?.filter(team => team.name.includes(searchText.value))
})

const filteredTeamsByBookmark = computed(() => {
  return bookmarkTeam.filter(team => team.name.includes(searchText.value))
})
</script>

<style lang="scss" scoped>
.tac {
  width: 240px;
  gap: 40px;

  h5 {
    margin-left: 20px;
    font-weight: 700;
  }

  .el-menu-vertical-demo {
    width: 100%;
    border: none;
    background-color: transparent;
    color: #fff;


    &::v-deep(.el-sub-menu__title) {
      color: #fff;
      // border-radius: 8px;
      padding: 4px !important;
      font-family: 'Noto Sans KR', sans-serif;
      // margin: 0 12px;
      height: 40px;
      font-size: 14px;


      &:hover {
        background-color: #232427;
      }
    }

    .is-empty {
      margin-left: 20px;
    }

    &::v-deep(.el-menu-item) {
      color: #fff;
      height: 40px;
      padding-left: 20px !important;
      font-size: 14px;
    }

    .el-menu-item-group__title {
      color: #fff;
      font-size: 16px;
    }
  }

  // 검색
  .search {
    margin-bottom: 20px;
    margin-top: 10px;
    padding: 0 4px;

    .el-input {
      width: 100%;
      border-bottom: 1px solid #fff;
      border-radius: 0;
      color: #fff;
      font-size: 16px;
      font-weight: 700;

      &::v-deep(.el-input__inner) {
        padding: 0;
      }
    }
  }


  // 프로젝트 관리 (관리자 메뉴)
  .admin-settings__btn {
    width: 100%;
    background-color: #2b2b2b;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border-radius: 0;
    border: none;
    margin-bottom: 20px;

    &:hover {
      background-color: #202020;
      border: none;
    }
  }

  .ti {
    font-weight: 700 !important;
  }

  // 팀 아이템 색
  .el-menu-item {
    color: #fff;
    margin-right: 10px;


    &:active {
      background-color: none !important;
    }
  }

  .border-left {
    // TODO 추 후 액티브했을 때로 스타일 변경 예정
    display: flex;
    // border-left: 4px solid rgb(60, 110, 171);
    padding-left: 20px;
    padding-right: 0px;
    height: 100%;
    width: 100%;
    vertical-align: middle;




    .team-name {
      display: flex;
      justify-self: center;
      align-self: center;
      width: 100%;
      height: 100%;
      // padding-left: 10px;
      border-radius: 12px;
      line-height: 40px;
    }
  }
}
</style>
<style lang="scss">
.el-sub-menu {
  &.is-opened {
    .el-sub-menu__title {
      background-color: #253042 !important;
    }
  }
}

.el-menu-item {
  padding: 0px !important;

  &:hover {
    background-color: unset;

  }
}

.el-sub-menu.is-opened {
  background-color: #253042;
}
</style>
