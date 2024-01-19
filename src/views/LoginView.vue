<template>
  <div class="login-view">
    <h1>로그인</h1>
    <el-form @submit.prevent="login">
      <el-label v-show="false" for="email">email</el-label>
      <el-input type="text" id="username" placeholder="이메일" v-model="email" />
      <el-label v-show="false" for="password">비밀번호</el-label>
      <!-- 비밀번호에서 엔터 시 로그인 -->
      <el-input @keyup.enter="login" type="password" id="password" placeholder="비밀번호" v-model="password" />
      <el-alert :title="errorMessage" type="error" v-if="isLoginError" show-icon center :closable="false"></el-alert>
      <el-button @click="login">Login</el-button>
    </el-form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import API from '@/apis';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
const email = ref('');
const password = ref('');

const $router = useRouter();
const userStore = useUserStore();

// 로그인 에러 메시지
const isLoginError = ref(false);
const errorMessage = ref('');

const login = async () => {
  // Add your login logic here
  console.log('email:', email.value);
  try {
    // API 호출
    const result = await API.login({
      email: email.value,
      password: password.value
    });

    ElMessage.success('로그인이 완료되었습니다.'); // 로그인 성공

    userStore.fetchUser(result); // Store userState 업데이트
    isLoginError.value = false;
    setTimeout(() => {
      $router.push('/'); // 메인 페이지로 이동
    }, 1000);

  } catch (error) {
    console.error(error);
    isLoginError.value = true;
    errorMessage.value = error.error;
  };
};
</script>

<style lang="scss" scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: -100px;

  h1 {
    margin-bottom: 20px;
    color: #fff;
    font-weight: 700;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    margin: 0 auto;

    .el-input {
      margin-bottom: 20px;
    }

    label {
      display: block;
    }

    .el-button {
      width: 100%;
      margin-top: 20px;
    }

    .el-checkbox {
      display: flex;
      align-items: center;
    }
  }
}
</style>
@/types/users.type