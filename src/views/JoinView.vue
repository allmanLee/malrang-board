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

      <el-button type="primary" color="primary" @click="submitForm">완료</el-button>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';

// API
import API from '@/apis';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';


export default {
  setup() {

    const $router = useRouter();


    const name = ref('');
    const email = ref('');
    const password = ref('');
    const isAdmin = ref(false);

    const submitForm = async () => {
      // Perform signup logic here
      console.log('Name:', name.value);
      console.log('Email:', email.value);
      console.log('Password:', password.value);
      console.log('Is Admin:', isAdmin.value);

      try {
        // 회원가입 API 호출
        await API.createUser({
          name: name.value,
          email: email.value,
          password: password.value,
          isAdmin: isAdmin.value
        });

        // 회원가입 성공
        ElMessage.success('회원가입이 완료되었습니다.');

        // 로그인 페이지로 이동
        $router.push('/login');
      } catch (error) {
        console.error(error);
        ElMessage.error('회원가입에 실패했습니다.');
      }
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

.description-text {
  margin-bottom: 40px;
  text-align: center;
}
</style>
