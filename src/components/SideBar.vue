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

    <el-col class="prj-searched" v-if="filteredProjects.length && searchText">
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

    <el-col class="team-searched" v-if="filteredTeams.length && searchText">
      <h5 class="mb-2">팀 검색 결과</h5>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item v-for="(t, index) in  filteredTeams" :key="index" :index="`${index}`">
          <span>{{ t.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>



    <el-col class="prj" v-show="filteredProjects.length && !searchText">
      <h5 class="mb-2">전체 프로젝트</h5>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        ref="projectAllRef">
        <el-sub-menu :index="`${index}`" v-for="(prj, index) in filteredProjects" :key="index">
          <template #title>
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>{{ prj.name }}</span>
          </template>
          <el-menu-item v-for="(t, index) in  filterByProject(prj.id, filteredTeams)" :key="index" :index="`${index}`">
            <span>{{ t.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// 프로젝트 별 팀 목록
const filterByProject = (projectIdx: number, filteredTeam) => {
  return filteredTeam.filter(team => team.prj_id === projectIdx)
}
const projectAllRef = ref(null)


//  검색어 지우고, 해당프로젝트 index 오픈
const handleClickPrj = () => {
  searchText.value = ''
  closeAll()
  projectAllRef.value.open('0')
}

// 전부 닫는다.
const closeAll = () => {
  projects.forEach((prj, index) => {
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

const projects = [
  {
    name: '프로젝트1',
    id: 1,
  },
  {
    name: '프로젝트2',
    id: 2,
  },
  {
    name: '프로젝트3',
    id: 3,
  },
  {
    name: '프로젝트4',
    id: 4,
  },
  {
    name: '프로젝트5',
    id: 5,
  },
  {
    name: '프로젝트6',
    id: 6,
  }
]

const teams = [
  {
    name: '팀1',
    id: 1,
    prj_id: 1,
  },
  {
    name: '팀2',
    id: 2,
    prj_id: 2,
  },
  {
    name: '팀3',
    id: 3,
    prj_id: 3,
  },
  {
    name: '팀4',
    id: 4,
    prj_id: 2,
  },
  {
    name: '팀5',
    id: 5,
    prj_id: 4,
  },
  {
    name: '팀6',
    id: 6,
    prj_id: 3,
  }
]

let searchText = ref('')

const filteredProjects = computed(() => {
  return projects.filter(project => project.name.includes(searchText.value))
})

const filteredTeams = computed(() => {
  return teams.filter(team => team.name.includes(searchText.value))
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

    &::v-deep(.el-submenu__title) {
      color: #fff;
    }

    &::v-deep(.el-menu-item) {
      color: #fff;
      height: 40px;
      // background-color: red;
      font-size: 14px;
      font-weight: 700 !important;
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
      background-color: #6b6b6b;
      border: none;
    }
  }
}
</style>
