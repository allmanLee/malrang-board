<template>
  <div>
    <!-- Add Project Form -->
    <el-form @submit.native.prevent="addProject" class="form">
      <el-input v-model="newProjectName" placeholder="Project Name" required></el-input>
      <el-button type="primary" native-type="submit">Add Project</el-button>
    </el-form>

    <!-- Project List -->
    <el-card class="card">
      <ul>
        <li v-for="project in projects" :key="project.id">
          {{ project.name }}
          <el-button type="danger" @click="deleteProject(project.id)">Delete</el-button>
          <el-button type="primary" @click="showTeamForm(project.id)">Add Team</el-button>
          <ul>
            <li v-for="team in project.teams" :key="team.id">
              {{ team.name }}
              <el-button type="danger" @click="deleteTeam(project.id, team.id)">Delete</el-button>
              <el-button type="primary" @click="showMemberForm(project.id, team.id)">Add Member</el-button>
              <ul>
                <li v-for="member in team.members" :key="member.id">
                  {{ member.name }}
                  <el-button type="danger" @click="deleteMember(project.id, team.id, member.id)">Delete</el-button>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </el-card>

    <!-- Add Team Form -->
    <el-card v-if="showTeamFormFlag" class="card">
      <el-form @submit.native.prevent="addTeam(selectedPrjId)" class="form">
        <el-input v-model="newTeamName" placeholder="Team Name" required></el-input>
        <el-button type="primary" native-type="submit">Add Team</el-button>
        <el-button type="text" @click="hideTeamForm">Cancel</el-button>
      </el-form>
    </el-card>

    <!-- Add Team Member Form -->
    <el-card v-if="showMemberFormFlag" class="card">
      <el-form @submit.native.prevent="addMember(selectedPrjId, selectedTeamId)" class="form">
        <el-input v-model="newMemberName" placeholder="Member Name" required></el-input>
        <el-button type="primary" native-type="submit">Add Member</el-button>
        <el-button type="text" @click="hideMemberForm">Cancel</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
  showTeamFormFlag.value = false;
};

// Add Team
const addTeam = (projectId) => {
  console.log('addTeam', projects.value);


  const project = projects.value.find(project => project.id === projectId);
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
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: 20px;
}

.card {
  margin-bottom: 20px;
}
</style>
