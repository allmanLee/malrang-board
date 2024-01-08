<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <h1>Login Page</h1>
    <form>
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="username">
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password">
      <button @click="login">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isDarkMode: true
    };
  },
  methods: {
    login() {
      // Add your login logic here
    }
  }
};
</script>

<style scoped>
.dark-mode {
  background-color: #333;
  color: #fff;
}
</style>
