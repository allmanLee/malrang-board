<script setup lang="ts">
import { RouterView } from 'vue-router'
// import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import SideBar from '@/components/SideBar.vue';
import SubSideBar from './components/SubSideBar.vue';

const router = useRouter();
const isShowSide = computed(() => {
  // 메인 페이지에서만 노출
  return router.currentRoute.value.path === '/main';
});

// 로그인, 회원가입 에서 미노출 (SubSideBar에서 노출)
const isLogin = computed(() => {
  return router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/signup';
});

</script>
<template>
  <el-container class="app-container">
    <!-- <el-header id="header" class="header">
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
        <router-link to="/login">로그인</router-link> |
        <router-link to="/signup">회원가입</router-link>
      </nav>

      <div v-else class="header__right">
        <el-dropdown trigger="click" placement="bottom-end">
          <span class="el-dropdown-link">
            <el-avatar shape="square" :size="20" src="https://avatars.githubusercontent.com/u/26598542?v=4"
              alt="avatar" />
            <p>{{ userName }}</p>
          </span>
          <template #dropdown>
            <el-dropdown-item>
              <span @click.self="router.push('/mypage')">
                회원정보
              </span>

            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="handleClickToLogout">
                로그아웃
              </span>
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
    </el-header> -->
    <el-container>
      <el-aside v-if="!isLogin" class="navigation-side__bar">
        <sub-side-bar />
      </el-aside>
      <el-aside v-if="!isLogin" class="navigation-side__bar">
        <SideBar />
      </el-aside>
      <div class="main">
        <RouterView />
      </div>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.app-container {
  position: relative;
  height: 100vh;
}

.header {
  display: flex;
  // background-color: black;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  height: 60px;

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
      // color: #ffffff;
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
      // color: #ffffff;
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

        // color: #ffffff;
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
    // color: #ffffff;
    font-size: 24px;
    font-weight: 700;
    margin-left: 20px;
  }
}

nav {
  display: flex;
  gap: 20px;

  a {
    // color: #ffffff;
    text-decoration: none;

    &:hover {
      color: #eaeaea;
    }
  }
}

.main {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.navigation-side__bar {
  height: 100%;
  overflow: unset;
}

// 첫번째
.navigation-side__bar:first-child {
  border-right: none;
  width: 66px;
}
</style>