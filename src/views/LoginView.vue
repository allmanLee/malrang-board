<template>
  <div class="login-view">
    <!-- 백그라운드 동영상 (천천히 페이드인, 페이드아웃 효과)-->
    <div class="background-video">
      <video autoplay muted loop class="background active">
        <source src="@/assets/videos/background.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="login-view__container">
      <h1>말랑보드</h1>
      <el-form @submit.prevent="login" label-position="top" class="login-view__form">
        <el-form-item :size="'large'" prop="email">
          <el-input type="text" id="username" placeholder="이메일" v-model="email" />
        </el-form-item>
        <el-form-item :size="'large'" prop="password">
          <el-input @keyup.enter="login" type="password" id="password" placeholder="비밀번호" v-model="password" />
        </el-form-item>
        <el-alert :title="errorMessage" type="error" v-if="isLoginError" show-icon center :closable="false"></el-alert>
        <el-form-item>
          <el-button size="large" type="primary" @click="login">로그인</el-button>
        </el-form-item>
      </el-form>
      <!-- 회원가입 및 아이디 비밀번호 찾기 -->
      <div class="login-view__link">
        <router-link to="/signup">회원가입</router-link>
        <router-link to="/find-password">아이디/비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import API from '@/apis';
import { ElMessage, ElNotification } from 'element-plus';
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

    ElNotification.success('로그인이 완료되었습니다.'); // 로그인 성공
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
  background-color: rgba(255, 255, 255, 0.2);

  .login-view__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 100px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  h1 {
    margin-bottom: 20px;
    font-size: 40px;
    font-family: 'malang-board-bold';
    font-weight: 700;
  }

  .login-view__form {
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 400px;
  }

  form {
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

.login-view__link {
  display: flex;
  justify-content: space-between;
  width: 400px;
  margin-top: 0px;

  a {
    padding: 4px;
    color: $gray-500;
    font-size: 14px;
  }

  a:hover {
    color: white;
  }
}


// 동영상 무한루프 페이드인 페이드아웃
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -1;
    transform: translateX(-50%) translateY(-50%);
    opacity: 1;

    &.active {
      animation: fadeInOut 19s infinite;
    }

    @keyframes fadeInOut {
      0% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }
  }
}

html.dark {

  .login-view {
    background-color: rgba(0, 0, 0, 0.8);

    .login-view__container {
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
      // border: 1px solid $gray-700;
    }
  }
}
</style>