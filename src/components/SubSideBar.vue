<template>
  <div class="subsidebar">
    <el-menu default-active="2" class="subsidebar__menu" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
      <el-menu-item index="1" class="subsideber__menu__item" @click="router.push('/')">
        <div class="menu-content">
          <el-icon class="menu-icon">
            <HomeFilled />
          </el-icon>
          <span>홈</span>
        </div>
      </el-menu-item>
      <el-menu-item index="2" class="subsideber__menu__item" @click="router.push('/mypage')">
        <div class="menu-content">
          <el-icon class="menu-icon">
            <user />
          </el-icon>
          <span>Me</span>
        </div>
      </el-menu-item>
      <el-menu-item index="3" disabled class="subsideber__menu__item">
        <el-icon>
          <document />
        </el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4" class="subsideber__menu__item" @click="router.push('/project')">
        <div class="menu-content">
          <el-icon class="menu-icon">
            <setting />
          </el-icon>
          <span>설정</span>
        </div>
      </el-menu-item>
    </el-menu>

    <div class="subside-bottom">
      <el-dropdown trigger="click" placement="bottom-end">
        <span class="el-dropdown-link">
          <el-badge value=" " class="online-badge">
            <el-avatar shape="square" :size="40" src="https://avatars.githubusercontent.com/u/26598542?v=4"
              alt="avatar" />
          </el-badge>

          <!-- <p>{{ userName }}</p> -->
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}



// Store
const userStore = useUserStore();

// 로그인 여부
computed(() => {
  return userStore.isLogin;
});

// 로그아웃
const handleClickToLogout = () => {
  userStore.logout();
}

// localStorage에 저장된 userState 가져와서 업데이트
const userState = localStorage.getItem('userState');
if (userState) {
  userStore.fetchUser(JSON.parse(userState));
}

// 로그인한 사용자명
const userName = computed(() => {
  return userStore.getUserState.name;
});

</script>

<style lang="scss" scoped>
.subsidebar {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;

  .subsidebar__menu {
    padding-top: 10px;
    width: 100%;
    height: 100%;

    .subsideber__menu__item {
      margin-bottom: 20px;
    }

    // 액티브 메뉴 아이콘에 배경
    .el-menu-item.is-active {
      .menu-icon {
        background-color: $gray-700;
        color: white;
      }

      span {
        color: $gray-100;
      }
    }

  }

  .menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;

    .menu-icon {
      font-size: 40px;
      padding: 4px;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: none;
    }

    span {
      display: flex;
      align-items: center;
      height: 20px;
      font-size: 14px;
      font-weight: 900;

    }
  }
}

.subside-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  // border-top: 1px solid #e4e7ed;

  .online-badge {
    &::v-deep(.el-badge__content) {
      height: 0px;
      width: 0px;
      padding: 6px;
      color: $gray-700;
      border: 2px solid black;
      font-size: 14px;
      font-weight: 700;
    }
  }
}
</style>