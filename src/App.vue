<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>
<template>
  <header id="header" class="header">
    <div class="logo">
      <h1>말랑보드</h1>
    </div>
    <nav>
      <router-link to="/">홈</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/mypage">MyPage</router-link>
    </nav>
  </header>
  <div class="main">
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
  gap: 50px;
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