<template>
  <el-container class="sidebar">
    <div class="sidebar-wrapper">


      <!-- <section class="admin-settings"> -->
      <!-- 프로젝트 관리 버튼 - solid -->
      <section class="sidebar-header">
        <!-- 로고 -->
        <div class="logo">
          <h1>말랑보드</h1>
        </div>
        <!-- <span class="groupname-text">서원정보</span> -->
      </section>


      <!-- 마이 보드 -->
      <!-- <el-tooltip content="마이보드로 이동합니다." placement="top">
          <section class="myboard" @click="() => $router.push('/mypage')">
            <div class="myboard-wrapper">
              <artice class='myboard-text'>
                <p class="item-key">내가 진행중인 업무</p>
                <p class="item-value">엑셀 업로드 및 다운로드기능 개발</p>
              </artice>
            </div>
          </section>
        </el-tooltip>
        <el-tooltip content="프로젝트 및 팀 관리 화면으로 이동합니다." placement="top">
          <el-button class="admin-settings__btn" @click="() => $router.push('/project')">
            완료
          </el-button>
        </el-tooltip>
      </section> -->
      <!-- <el-divider></el-divider> -->
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

      <el-scrollbar class="search-items__scrollbar">
        <!-- 팀 즐겨찾기 -->
        <h5>팀 즐겨찾기</h5>

        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-menu-item v-for="(t, index) in  filteredTeamsByBookmark" :key="index" :index="`rt-${index}`">
            <span>{{ t.name }}</span>
          </el-menu-item>
        </el-menu>


        <div class="prj-searched" v-if="filteredProjects?.length && searchText">
          <h5 class="mb-2">프로젝트 검색 결과</h5>
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item v-for="(prj, i) in filteredProjects" :key="`p-${i}`" @click="handleClickPrj" :index="`sp-${i}`">
              <template #title>
                <el-icon>
                  <!-- <icon-menu /> -->
                </el-icon>
                <span>{{ prj.name }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </div>

        <div class="team-searched" v-if="filteredTeams?.length && searchText">
          <h5 class="mb-2">팀 검색 결과</h5>
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item v-for="(t, index) in  filteredTeams" :key="`t-${index}`" :index="`st-${index}`">
              <span>{{ t.name }}</span>
            </el-menu-item>
          </el-menu>
        </div>



        <div class="prj" v-show="filteredProjects?.length && !searchText">
          <h5 class="mb-2">전체 프로젝트</h5>
          <el-menu :default-active="teamId" class="el-menu-vertical-demo" @open="handleOpen" @select="handleSelectMenu"
            @close="handleClose" ref="projectAllRef">
            <el-sub-menu :index="prj?._id" v-for="(prj) in filteredProjects" :key="prj?._id">
              <template #title>
                <el-icon>
                  <!-- <icon-menu /> -->
                </el-icon>
                <span class="ti">{{ prj.name }}</span>
              </template>
              <el-menu-item-group @open="handleOpen">
                <el-menu-item v-for="(t) in  prj.teams" :key="`team-${t?._id}`" :index="`team-${t._id}`"
                  class="items-menu--team">
                  <div class="border-left">
                    <span class="team-name">{{ t.name }}</span>
                  </div>
                </el-menu-item>
              </el-menu-item-group>
              <div v-if="isEmpty(prj.teams)" class="is-empty">
                <el-menu-item disabled>
                  <span class="team-name">팀이 없습니다.</span>
                </el-menu-item>

              </div>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-scrollbar>
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user';
import { useCommonStore } from '@/stores/common';
import { isEmpty } from 'lodash';



// 스토어 프로젝트 목록
const userStore = useUserStore()
const commonStore = useCommonStore()
const projects = computed(() => userStore.getProjects)
const teams = computed(() => userStore.getTeams)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}




// common 스토어에 team 아이디 저장
const handleSelectMenu = async (id: string) => {
  // 선택한 팀 아이디 team-{아이디}
  const teamId = id.split('-')[1]
  const teamName = teams.value.find(team => team._id === teamId)?.name
  const projectId = projects.value.find(project => project.teams.find(team => team._id === teamId))?._id
  const projectName = projects.value.find(project => project.teams.find(team => team._id === teamId))?.name
  await commonStore.changeTeamSelected(teamId, teamName, projectId, projectName)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// 만약 로그인이 되어있고, localStorage에 팀이름과 아이디가 저장 되어있다면
// 그 팀을 선택한 상태로 초기화

const teamId: any = ref('')
const initTeam = () => {
  const _teamId = localStorage.getItem('sbSelectedTeamId')
  const _teamName = localStorage.getItem('sbSelectedTeamName')
  const _projectId = localStorage.getItem('sbSelectedProjectId')
  const _projectName = localStorage.getItem('sbSelectedProjectName')
  if (_teamId && _teamName) {
    commonStore.changeTeamSelected(_teamId, _teamName, _projectId, _projectName)
    teamId.value = `team-${_teamId}`
  }
}

onMounted(() => {
  initTeam()
})


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
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px;
  padding-top: 10px;
  padding-bottom: 0px;

  .groupname-text {
    font-size: 16px;
    font-weight: 300;
    margin-left: 20px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logo {
    h1 {
      font-size: 24px;
      font-weight: 700;
      font-family: 'malang-board-bold';
    }
  }
}

.sidebar {
  width: 100% !important;
  height: 100% !important;
  gap: 40px;
  background-color: $background-transparent;
  border-right: 1px solid $gray-300;
  // 오른쪽으로 그림자
  box-shadow: 6px 0px 12px 1px rgba(0, 0, 0, 0.1);

  .sidebar-wrapper {
    display: flex;
    flex-direction: column;
    width: 100% !important;
  }

  h5 {
    margin-left: 20px;
    font-weight: 700;
  }

  .el-menu-vertical-demo {
    width: 100%;
    border: none;
    background-color: transparent;
    margin-bottom: 40px;
    // color: #ffffff;


    &::v-deep(.el-sub-menu__title) {
      // color: #ffffff;
      // border-radius: 8px;
      padding: 4px !important;
      font-family: 'Noto Sans KR', sans-serif;
      // margin: 0 12px;
      height: 40px;
      font-size: 14px;
      border-radius: 6px;

      &:hover {
        // background-color: #232427;
      }
    }

    .is-empty {
      margin-left: 20px;
    }

    &::v-deep(.el-menu-item) {
      // color: #ffffff;
      height: 40px;
      padding-left: 20px !important;
      font-size: 14px;
      border-radius: 6px;
    }

    .el-menu-item-group__title {
      // color: #ffffff;
      font-size: 16px;

    }
  }

  .items-menu--team {
    &:hover {
      // background-color: #34363a;
    }
  }

  // 검색
  .search {
    margin-bottom: 20px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 0 4px;

    .el-input {
      width: 100%;
      border-radius: 0;
      // color: #ffffff;
      font-size: 16px;
      font-weight: 700;

      &::v-deep(.el-input__inner) {
        padding: 0;
      }
    }
  }


  // 프로젝트 관리 (관리자 메뉴)
  .admin-settings {
    margin: 6px;

    .admin-settings__btn {
      width: 100%;
      background-color: hsl(191, 79%, 46%);
      // color: #ffffff;
      border-radius: 4px;
      border: none;
      margin: 0px;
      margin-top: 10px;
      padding: 2px;

      &:hover {
        background-color: hsl(191, 79%, 36%);
        border: none;
      }
    }
  }

  // 마이보드
  .myboard {
    // padding: 6px;

    &::v-deep(.el-card__body) {
      padding: 6px;
    }

    .myboard-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      height: 100%;
      padding: 0px;

      .myboard-text {
        margin-bottom: 10px;

        // 마지막 요소
        &:last-child {
          margin-bottom: 0px;
        }

        .item-key {
          font-size: 14px;
          font-weight: 900;
        }

        .item-value {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }

  .ti {
    font-weight: 700 !important;
  }


  // 팀 선택 시
  .items-menu--team {
    &.is-active {

      // open 가상 클래스
      &::before {
        content: '';
        position: absolute;
        // right: 10px;
        // primary color
        background-color: $primary-300;
        border-radius: 4px;
        color: white;

        width: 4px;
        height: 4px;
        line-height: 20px;
        font-size: 12px;
        font-weight: 600;
        vertical-align: middle;
        text-align: center;

      }
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
      font-weight: 700;
      // padding-left: 10px;
      border-radius: 12px;
      line-height: 40px;
    }
  }
}

.el-menu-item {
  padding: 0px !important;

  &:hover {
    background-color: unset;

  }
}

.el-sub-menu__title {
  border: 8px;
  // background-color: none;
  ;
}

.el-sub-menu {
  margin: 10px;
  border-radius: 8px;
}


.el-sub-menu.is-opened {
  background-color: white;

  .el-menu-item:hover {
    background-color: $background-transparent-secondary;
  }
}

html.dark {

  .sidebar {
    border-right: 1px solid $dark-gray-100;
  }

  .el-sub-menu.is-opened {
    background-color: $dark-gray-300;
  }
}
</style>
