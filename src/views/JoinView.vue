<template>
  <div class="join-view">
    <h1>말랑보드에 회원가입 해주세요!</h1>
    <article class="description-text">
      <p>회원가입을 위해 아래 정보를 입력해주세요.</p>
      <p>팀, 프로젝트 정보는 관리자(팀장, PL) 계정이 설정할 수 있습니다.</p>
    </article>
    <el-form @submit.prevent="submitForm" class="form">
      <el-label for="name">Name:</el-label>
      <el-input type="text" id="name" v-model="name" required />

      <el-label for="email">Email:</el-label>
      <el-input type="email" id="email" v-model="email" required />

      <el-label for="password">Password:</el-label>
      <el-input type="password" id="password" v-model="password" required />

      <!-- 임시 PL 여부 -->
      <el-checkbox v-model="isAdmin" id="isAdmin">당신은 관리자 이신가요?</el-checkbox>

      <el-button type="submit" color="primary">완료</el-button>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const isAdmin = ref(false);

    const submitForm = () => {
      // Perform signup logic here
      console.log('Name:', name.value);
      console.log('Email:', email.value);
      console.log('Password:', password.value);
      console.log('Is Admin:', isAdmin.value);
    };

    return {
      name,
      email,
      password,
      isAdmin,
      submitForm
    };
  }
}
</script>

<style lang="scss" scoped>
.join-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;

  h1 {
    margin-bottom: 20px;
    color: #fff;
    font-weight: 700;
  }
}

// 폼
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.el-input {
  margin-bottom: 20px;
}

label {
  display: block;
}

form {
  width: 300px;
  margin: 0 auto;


}

h1 {
  text-align: center;
}

// 버튼
.el-button {
  width: 100%;
  margin-top: 20px;
}

.el-checkbox {
  display: flex;
  align-items: center;
}

.dark-mode {
  background-color: #333;
  color: #fff;
}

.description-text {
  margin-bottom: 40px;
  text-align: center;
}
</style>
