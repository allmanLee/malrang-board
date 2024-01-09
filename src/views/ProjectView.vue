<template>
  <div class="container">
    <!-- Project Column -->
    <div class="column">
      <h2>프로젝트</h2>
      <el-card v-for="project in projects" :key="project.id" class="card"
        :class="{ 'highlighted': project.id === selectedPrjId }" @click="selectProject(project.id)">
        <div class="card-header">
          {{ project.name }}
          <el-button @click="deleteProject(project.id)" class="delete-button">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
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
      <h2>팀 </h2>
      <el-card v-for=" team in filteredTeams" :key="team.id" class="card"
        :class="{ 'highlighted': team.id === selectedTeamId }" @click="selectTeam(team.id)">
        <div class="team-list">
          <div class="card-header">
            {{ team.name }}

            <el-button @click="deleteTeam(selectedPrjId, selectedTeamId)" class="delete-button">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </div>
      </el-card>

      <el-card v-if="showTeamFormFlag" class="card">
        <el-form @submit.native.prevent="addTeam" class="form">
          <el-input v-model="newTeamName" placeholder="Team Name" required></el-input>
          <el-button type="primary" native-type="submit" class="add-button">Add Team</el-button>
          <el-button text @click="hideTeamForm" class="add-button">Cancel</el-button>
        </el-form>
      </el-card>

      <el-button v-else-if="!showTeamFormFlag && selectedPrjId" @click="showTeamForm(selectedPrjId)" class="add-button">
        <el-icon>
          <plus />
        </el-icon>
      </el-button>

      <el-empty v-else description="프로젝트를 선택해주세요."></el-empty>
    </div>

    <!-- Member Column -->
    <div class="column" :cass="'column-opacity'">
      <h2>팀원</h2>
      <el-card v-for=" member  in  filteredMembers " :key="member.id" class="card">
        <div class="member-list">
          <p class="member-profile">
            <el-avatar icon="el-icon-user-solid" size="small" shape="circle" :src="member.avatar" fit="fill"></el-avatar>
            {{ member.name }}
          </p>
          <el-button type="danger" @click="deleteMember(selectedPrjId, selectedTeamId, member.id)">Delete</el-button>
        </div>
        <!-- <p class="member-email">{{ member.email }}</p> -->
        <span class="member-is-admin">팀장 / </span>
        <span class="member-email">yjlee@seowoninfo.com</span>

      </el-card>
      <el-card v-if="showMemberFormFlag" class="avator">
        <el-form @submit.prevent="addMember(selectedPrjId, selectedTeamId)" class="form">
          <el-input v-model="newMemberName" placeholder="Member Name" required></el-input>
          <el-button type="primary" native-type="submit" class="add-button">Add Member</el-button>
          <el-button text @click="hideMemberForm" class="add-button">Cancel</el-button>
        </el-form>
      </el-card>

      <el-button v-else-if="!showMemberFormFlag && selectedTeamId" @click="showMemberForm(selectedPrjId, selectedTeamId)"
        class="add-button">
        <el-icon>
          <plus />
        </el-icon>
      </el-button>
      <el-empty v-else description="팀을 선택해주세요."></el-empty>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

// Project data
const projects = ref([]);

const newProjectName = ref('');

// Team data
const newTeamName = ref('');
const showTeamFormFlag = ref(false);
const selectedPrjId = ref(0);

// Team member data
const newMemberName = ref('');
const showMemberFormFlag = ref(false);
const selectedTeamId = ref(0);

// Add Project
const addProject = () => {
  const project = {
    id: projects.value.length + 1 || 0,
    name: newProjectName.value,
    teams: []
  };
  projects.value.push(project);
  newProjectName.value = '';
};

const filteredTeams = computed(() => {
  const project = projects.value.find(project => project.id === selectedPrjId.value);
  if (project) {
    return project.teams;
  }
  return [];
});

const filteredMembers = computed(() => {
  const project = projects.value.find(project => project.id === selectedPrjId.value);
  if (project) {
    const team = project.teams.find(team => team.id === selectedTeamId.value);
    if (team) {
      return team.members;
    }
  }
  return [];
});

// Delete Project
const deleteProject = (projectId) => {
  projects.value = projects.value.filter(project => project.id !== projectId);
};

// Show Team Form
const showTeamForm = (projectId) => {
  const project = projects.value.find(project => project.id === projectId);
  if (project) {
    selectedPrjId.value = projectId;
    showTeamFormFlag.value = true;
    newTeamName.value = '';
  }
};

// Hide Team Form
const hideTeamForm = () => {
  console.log('hideTeamForm')
  showTeamFormFlag.value = false;
};

// Add Team
const addTeam = () => {
  console.log('addTeam', selectedPrjId.value)
  const project = projects.value.find(project => project.id === selectedPrjId.value);

  if (project) {
    const team = {
      id: project.teams.length + 1,
      name: newTeamName.value,
      members: []
    };
    project.teams.push(team);
    newTeamName.value = '';
    showTeamFormFlag.value = false;
  }
};

// Delete Team
const deleteTeam = (projectId, teamId) => {
  const project = projects.value.find(project => project.id === projectId);
  if (project) {
    project.teams = project.teams.filter(team => team.id !== teamId);
  }
};

// Show Member Form
const showMemberForm = (projectId, teamId) => {
  const project = projects.value.find(project => project.id === projectId);
  if (project) {
    const team = project.teams.find(team => team.id === teamId);
    if (team) {
      showMemberFormFlag.value = true;
      selectedTeamId.value = teamId;
      newMemberName.value = '';
    }
  }
};

// Hide Member Form
const hideMemberForm = () => {
  showMemberFormFlag.value = false;
};

// Add Member
const addMember = (projectId, teamId) => {
  const project = projects.value.find(project => project.id === projectId);
  if (project) {
    const team = project.teams.find(team => team.id === teamId);

    console.log('addMember', team);
    if (team) {
      const member = {
        id: team.members.length + 1,
        name: newMemberName.value
      };
      team.members.push(member);
      newMemberName.value = '';
      showMemberFormFlag.value = false;
    }
  }
};

// Delete Member
const deleteMember = (projectId, teamId, memberId) => {
  const project = projects.value.find(project => project.id === projectId);
  if (project) {
    const team = project.teams.find(team => team.id === teamId);
    if (team) {
      team.members = team.members.filter(member => member.id !== memberId);
    }
  }
};

// Select Project
const selectProject = (projectId) => {
  selectedPrjId.value = projectId;
};

// Select Team
const selectTeam = (teamId) => {
  selectedTeamId.value = teamId;
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.column {
  flex: 1;
  margin-right: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card {
  cursor: pointer;
  margin-bottom: 10px;
}

.add-button,
.delete-button {
  margin: 0;
  border-radius: 0px;
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
</style>
