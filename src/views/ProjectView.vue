<template>
  <div class="project-manager-view">
    <div class="project-manager-view__wrapper">
      <div class="project-magage-header">
        <h1 class="project-magage-title">프로젝트 관리</h1>
        <h3 class="project-magage-title">
          <el-tooltip content="소속은 마이페이지에서 변경 가능합니다." placement="top">
            <div class="tooltip-container">
              <span class="-border">{{ user.groupName }}</span>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </div>
          </el-tooltip> 그룹의 프로젝트를 관리합니다.
        </h3>
        <h5>
          팀원은 가입시 소속을 선택하고, 동일한 소속의 프로젝트에만 참여할 수 있습니다.
        </h5>
      </div>
      <div class="container">
        <!-- Project Column -->
        <div class="column">
          <h2 class="column-title">프로젝트</h2>
          <!-- 아이콘과 같이 팀 갯수 / 팀원 수 표기 -->


          <el-card v-for="(project, index) in projects" :key="project._id" class="card"
            :class="{ 'highlighted': project._id === selectedPrjId }" @click="selectProject(project._id)">
            <div class="card-header">
              <section class="project-card-column">
                <p class="project-card-column-title">
                  프로젝트 명
                </p>
                <span class="project-card-title">{{ project.name }}</span>
              </section>
              <count-user :member="project?.teams?.reduce((acc, cur) => acc + cur?.members?.length, 0, 0)"
                :team="project?.teams?.length" class="count-user"></count-user>
              <el-button @click="deleteProject(project._id)" class="delete-button">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <div v-if="index === projects.length - 1" class="new-badge">New</div>
          </el-card>
          <el-card v-if="!showTeamFormFlag" class="card project-form-add">
            <el-form @submit.prevent="addProject" class="form">
              <el-input v-model="newProjectName" placeholder="Project Name" required></el-input>
              <el-button type="primary" native-type="submit" class="add-button">Add Project</el-button>
            </el-form>
          </el-card>
        </div>

        <!-- Team Column -->
        <div class="column">
          <h2 class="column-title">팀</h2>
          <el-card v-for="(team, index) in filteredTeams" :key="team._id" class="card"
            :class="{ 'highlighted': team._id === selectedTeamId }" @click="selectTeam(team._id)">
            <div class="team-list">
              <div class="card-header">
                <section class="project-card-column">
                  <p class="project-card-column-title --team">
                    팀 명
                  </p>
                  <span class="project-card-title">{{ team.name }}</span>
                </section>

                <count-user :member="team?.members?.length" class="count-user"></count-user>
                <el-button @click="deleteTeam(selectedPrjId, team._id)" class="delete-button">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
            <div v-if="index === filteredTeams.length - 1" class="new-badge">New</div>
          </el-card>

          <el-card v-if="showTeamFormFlag" class="card">
            <el-form @submit.prevent="addTeam" class="form">
              <el-input v-model="newTeamName" placeholder="Team Name" required></el-input>
              <el-button type="primary" native-type="submit" class="add-button">Add Team</el-button>
              <el-button text @click="hideTeamForm" class="add-button">Cancel</el-button>
            </el-form>
          </el-card>

          <el-button v-else-if="!showTeamFormFlag && selectedPrjId" @click="showTeamForm(selectedPrjId)"
            class="add-button">
            <el-icon>
              <plus />
            </el-icon>
          </el-button>

          <el-empty v-else description="프로젝트를 선택해주세요."></el-empty>
        </div>

        <!-- Member Column -->
        <div class="column">
          <h2 class="column-title">팀원</h2>
          <el-card v-for=" member  in  filteredMembers " :key="member.id" class="card">
            <div class="member-list">
              <p class="member-profile">
                <el-avatar icon="el-icon-user-solid" size="small" shape="circle" :src="member.avatar"
                  fit="fill"></el-avatar>
                {{ member.name }}
              </p>
              <el-button type="danger" class="delete-button--danger"
                @click="deleteMember(selectedPrjId, selectedTeamId, member.id)">Delete</el-button>
            </div>
            <span class="member-is-admin">팀장 / </span>
            <span class="member-email">yjlee@seowoninfo.com</span>

          </el-card>
          <!-- 선택 -->
          <el-card v-if="showMemberFormFlag" class="avator">
            <el-form @submit.prevent="addMember(selectedPrjId, selectedTeamId, newMember.id)" class="form">
              <!-- <el-input v-model="newMember" placeholder="Member Name" required></el-input> -->
              <!-- 팀원을 선택할 수 있음 -->
              <el-select v-model="newMember" placeholder="Member Name" value-key="id" required class="form-select">
                <el-option v-for="member in memberOptions" :key="member.id" :label="member.name" :value="member">
                </el-option>
              </el-select>
              <el-button type="primary" native-type="submit" class="add-button">Add Member</el-button>
              <el-button text @click="hideMemberForm" class="add-button">Cancel</el-button>
            </el-form>
          </el-card>

          <el-button v-else-if="!showMemberFormFlag && selectedTeamId"
            @click="showMemberForm(selectedPrjId, selectedTeamId)" class="add-button">
            <el-icon>
              <plus />
            </el-icon>
          </el-button>
          <el-empty v-else description="팀을 선택해주세요."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import CountUser from '@/components/CountUser.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ProjectRequestDto, TeamRequestDto } from '@/types/dto/project.dto.type';


// Store
const store = useUserStore();
const userId = computed(() => store.getUserState.id);
const user = computed(() => store.getUserState);


// Project data
let projects: any = ref([]);
const newProjectName = ref('');

// Team data
const newTeamName = ref('');
const showTeamFormFlag = ref(false);
const selectedPrjId = ref('');

// Team member data
const memberOptions = computed(() => store.getUsers);
const newMember = ref(null);
const showMemberFormFlag = ref(false);
const selectedTeamId = ref('');


/** (스토어)프로젝트세팅 */
projects = computed(() => store.getProjects);

const filteredTeams = computed(() => {
  const project = projects.value.find(project => project._id === selectedPrjId.value);
  if (project) return project.teams;
  return [];
});
const filteredMembers = computed(() => {
  const project = projects.value.find(project => project._id === selectedPrjId.value);
  if (project) {
    const team = project.teams.find(team => team._id === selectedTeamId.value);
    if (team) {
      return team.members;
    }
  }
  return [];
});


/** 프로젝트를 추가합니다. */
const addProject = async () => {
  try {
    const request: ProjectRequestDto = {
      name: newProjectName.value,
      createUserId: userId.value,
      groupId: user.value.groupId,
    };

    showTeamFormFlag.value = false;

    const result = await store.createProject(request);

    // 프로젝트 추가
    // projects.value = [...projects.value, result];

    ElMessage(`${newProjectName.value} 프로젝트가 추가되었습니다.`);
    newProjectName.value = '';

  } catch (error) {
    console.error(error);
  }
};



const beforeDeleteMessage = async (): Promise<Boolean> => {
  const result = await ElMessageBox.confirm('정말로 삭제하시겠습니까?', '알림', {
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
    type: 'warning'
  }).then(() => true).catch(() => false);
  return result;
};

// Delete Project
const deleteProject = async (projectId) => {
  const confirm = await beforeDeleteMessage();
  if (confirm && projectId && projects.value.find(project => project._id === projectId)) {

    await store.deleteProject(projectId);

    projects.value = projects.value.filter(project => project._id !== projectId);
    selectedPrjId.value = ''; // Reset selected project
    selectedTeamId.value = ''; // Reset selected team
  }
};

// Show Team Form
const showTeamForm = (projectId) => {
  const project = projects.value.find(project => project._id === projectId);
  if (project) {
    selectedPrjId.value = projectId;
    showTeamFormFlag.value = true;
    newTeamName.value = '';
  }
};

// Hide Team Form
const hideTeamForm = () => {
  showTeamFormFlag.value = false;
};

// Add Team
const addTeam = async () => {
  try {
    const request: TeamRequestDto = {
      name: newTeamName.value,
      createUserId: userId.value,
      projectId: selectedPrjId.value,
    };

    showTeamFormFlag.value = false;

    const result = await store.createTeam(request);

    // 프로젝트에 팀 추가
    const project = projects.value.find(project => project._id === selectedPrjId.value);

    if (project) {
      // project.teams.push(result);
      console.log('??')
    }

    ElMessage(`${newTeamName.value} 팀이 추가되었습니다.`);
    newTeamName.value = '';
  } catch (error) {
    console.error(error);
  }
};



// Delete Team
const deleteTeam = async (projectId, teamId) => {
  try {
    const confirm = await beforeDeleteMessage();
    if (confirm && projectId && teamId) {
      await store.deleteTeam(projectId, teamId);

      const project = projects.value.find(project => project._id === projectId);
      if (project) {
        project.teams = project.teams.filter(team => team._id !== teamId);
      }
      selectedTeamId.value = ''; // Reset selected team
    }
  } catch (error) {
    console.error(error);
  }
};

// Show Member Form
const showMemberForm = (projectId, teamId) => {
  const project = projects.value.find(project => project._id === projectId);
  if (project) {
    const team = project.teams.find(team => team._id === teamId);
    if (team) {
      showMemberFormFlag.value = true;
      selectedTeamId.value = teamId;
      newMember.value = null;
    }
  }
};

// Hide Member Form
const hideMemberForm = () => {
  showMemberFormFlag.value = false;
};

// Add Member
const addMember = async (projectId, teamId, userId) => {
  try {
    await store.addMember({ projectId, teamId, userId }, {});

    newMember.value = null;
    showMemberFormFlag.value = false;
  } catch (error) {
    console.error(error);
  }
};

// Delete Member
const deleteMember = async (projectId, teamId, userId) => {
  try {
    const confirm = await beforeDeleteMessage();
    if (confirm && projectId && teamId && userId) {
      await store.deleteMember({ projectId, teamId, userId });
    }
  } catch (error) {
    console.error(error);
  }
};

// Select Project
const selectProject = (projectId) => {
  selectedPrjId.value = projectId;
  selectedTeamId.value = ''; // Reset selected team
};

// Select Team
const selectTeam = (teamId) => {
  selectedTeamId.value = teamId;
};
</script>

<style lang="scss" scoped>
.project-manager-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 100px;
  margin-bottom: 100px;
  text-align: center;
}

.project-magage-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  // width: 100%;
  gap: 0px;
  margin-bottom: 20px;

  h1 {
    font-size: 40px;
    font-weight: 700;
    color: white;
  }

  .project-manager-view__wrapper {
    width: 100%;
    max-width: 1200px;
    padding: 0 20px;
  }
}

.project-magage-title {
  display: flex;
  color: white;
  vertical-align: middle;
  width: 100%;

  // 아이콘 조금 위로 조정
  .el-icon {
    margin-top: -2px;
    margin-right: 4px;
    ;
  }

  .tooltip-container {
    display: flex;
    cursor: pointer;
    gap: 5px;
    align-items: center;
    justify-content: center;
    width: auto;
  }

  & .-border {
    // border-bottom: 1px solid #eaeaea;;
    text-decoration: underline;
    padding-bottom: 10px;
    font-weight: 600;
    padding: 0;

  }
}

.project-card-title {
  font-size: 16px;
  font-weight: bold;
  width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}


.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.column {
  flex: 1;
  background-color: #000;
  padding: 20px;
  border-radius: 10px;
  width: 400px;

  &-title {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

.form-select {
  width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .project-card-column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .project-card-column-title {
    font-size: 12px;
    color: #616161;
    width: 140px;
    overflow: hidden;
  }
}

.card {
  position: relative;
  cursor: pointer;
  align-items: flex-start !important;
  margin-bottom: 10px;
  text-align: left;
}



// 삭제 추가 아이콘 버튼
.delete-button {
  margin: 0;
  border-radius: 4px;
  background-color: none !important;

  // 버튼 색상
  --el-button-border-color: #616161;
  --el-button-hover-bg-color: #eaeaea;
  --el-button-hover-border-color: #2c2c2c;

  &::v-deep(button) {
    border: 1px solid red;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
    border-color: #2c2c2c !important;

    .el-icon {
      color: #fff !important;
    }
  }
}

.add-button {
  margin-top: 10px;
  width: 100%;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-list__item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  border: 1px solid #eaeaea;
  padding: 10px;
  width: 100%;
  font-size: 16px;

  ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }


}

.highlighted {
  background-color: #f5f5f5;
  color: #000;

  .el-icon {
    color: #000 !important;
  }

  .new-badge {
    background-color: #2196f3;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    color: #fff;
  }
}


.member-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .member-profile {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .delete-button--danger {
    color: #fff;
    background-color: #f44336;
    border-color: #f44336;
  }


}

.member-is-admin {
  font-size: 12px;
  color: #eaeaea;
}

.member-email {
  font-size: 12px;
  color: #616161;
}

.column-opacity {
  opacity: 0.7 !important;
}

// New badge - 팀, 프로젝트 팀원 추가시 나타나는 뱃지
.new-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #1973bd;
  color: #fff;
  padding: 2px 10px;
  border-radius: 0 0 0 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  font-size: 12px;
}


// count-user
.count-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 12px;
  width: 100px;
  padding: 10px;
}
</style>
