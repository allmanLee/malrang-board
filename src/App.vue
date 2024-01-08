<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

// Store
const userStore = useUserStore();

// 로그인 여부
const isLogin = computed(() => {
  return userStore.isLogin;
});

// 로그아웃
const handleClickToLogout = () => {
  userStore.logout();
}

// 로그인한 사용자명
const userName = computed(() => {
  return userStore.getUserState.name;
});

// 다크모드
useDark()

</script>
<template>
  <header id="header" class="header">
    <section class="header__left">
      <div class="logo">
        <h1>말랑보드</h1>
      </div>
      <nav>
        <router-link to="/">홈</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/mypage">MyPage</router-link>
      </nav>
    </section>
    <nav v-if="!isLogin" class="header__right">
      <!-- 우측 - 로그인, 회원가입 -->
      <router-link to="/login">로그인</router-link> |
      <router-link to="/signup">회원가입</router-link>
    </nav>

    <div v-else class="header__right">
      <!-- 우측 - 로그인 성공시 프로필 노출 -->
      <el-dropdown trigger="click" placement="bottom-end">
        <span class="el-dropdown-link">
          <el-avatar shape="square" :size="20" src="https://avatars.githubusercontent.com/u/26598542?v=4" alt="avatar" />
          <p>{{ userName }}</p>
          <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
        </span>
        <template #dropdown>
          <el-dropdown-item>
            <router-link to="/mypate">
              회원정보
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="handleClickToLogout">
              로그아웃
            </span>
          </el-dropdown-item>
        </template>
      </el-dropdown>
    </div>

  </header>
  <div class="main dark">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  background-color: #2b2b2b;
  border-bottom: 1px solid #eaeaea;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 50px;

  &__left {
    display: flex;
    align-items: center;
    gap: 50px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 20px;

    a {
      color: #fff;
      text-decoration: none;

      &:hover {
        color: #eaeaea;
      }
    }

    // 프로필
    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      text-decoration: none;

      &:hover {
        color: #eaeaea;
      }
    }

    .dropdown-menu {
      background-color: #2b2b2b;
      border: none;
      border-radius: 10px;
      padding: 10px;
      height: 100px;

      .el-dropdown-item {

        color: #fff;
        text-decoration: none;

        &:hover {
          color: #eaeaea;
        }

        &:last-child {
          margin-top: 10px;
          border-top: 1px solid #eaeaea;
          padding-top: 10px;
        }
      }
    }
  }
}

.logo {
  h1 {
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    margin-left: 20px;
  }
}

nav {
  display: flex;
  gap: 20px;

  a {
    color: #fff;
    text-decoration: none;

    &:hover {
      color: #eaeaea;
    }
  }
}

.main {
  margin-top: 80px;
}
</style>