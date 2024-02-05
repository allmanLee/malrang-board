<template>
  <div class="joinview">
    <section class="joinview__left">
      <h1><span class="--welcome">Welcome to </span>말랑보드</h1>
    </section>
    <section class="joinview__right">
      <header>
        <h1>회원가입</h1>
      </header>

      <el-form @submit.prevent="submitForm" class="form" :label-position="'top'">
        <el-form-item label="이름" prop="name">
          <el-input type="text" id="name" v-model="name" required />
        </el-form-item>
        <el-form-item label="이메일" prop="email">
          <el-input type="email" id="email" v-model="email" required />
        </el-form-item>
        <el-form-item label="비밀번호" prop="password">
          <el-input type="password" id="password" v-model="password" required />
        </el-form-item>
        <el-form-item label="비밀번호 확인" prop="rePassword">
          <el-input type="password" id="rePassword" v-model="rePassword" required />
          <el-alert title="비밀번호가 일치하지 않습니다." type="error" v-if="!isPasswordMatch && password && rePassword" show-icon
            center :closable="false"></el-alert>
        </el-form-item>
        <el-form-item label="소속 그룹 (입력하여 추가할 수 있어요!)" prop="groupName">
          <el-select v-model="groupName" filterable allow-create placeholder="소속을 선택하세요" class="select-user">
            <el-option v-for="group in mockGroups" :key="group.id" :label="group.name" :value="group.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isAdmin">
          <el-checkbox v-model="isAdmin" id="isAdmin">당신은 관리자 이신가요?</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" color="primary" @click="submitForm">완료</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// API
import API from '@/apis';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { type Group } from '@/types/users.type.ts';



const $router = useRouter();


const name = ref('');
const email = ref('');
const groupName = ref('');
const password = ref('');
const rePassword = ref('');
const isAdmin = ref(false);

// 비밀번호 중복검사
const isPasswordMatch = ref(false);

watch([password, rePassword], () => {
  isPasswordMatch.value = password.value === rePassword.value;
});

const mockGroups: Group[] = [
  { name: '말랑보드', id: 1 },
  { name: '서원정보', id: 2 }
]
const submitForm = async () => {
  // Perform signup logic here
  console.log('Name:', name.value);
  console.log('Email:', email.value);
  console.log('GroupName:', groupName.value);
  console.log('Password:', password.value);
  console.log('Is Admin:', isAdmin.value);

  try {
    // 회원가입 API 호출
    await API.createUser({
      name: name.value,
      email: email.value,
      password: password.value,
      groupName: groupName.value,
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
}

</script>

<style lang="scss" scoped>
.joinview {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin: 40px;
  margin-top: -100px;

  .el-form {
    width: 100%;
  }

  .joinview__left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // width: 240px;
    width: 100%;
    padding: 20px;

    h1 {
      margin-bottom: 20px;
      font-size: 40px;
      font-family: 'malang-board-bold';
      font-weight: 700;

      .--welcome {
        font-size: 20px;
        font-weight: 200;
        font-family: 'malang-board-bold';
      }
    }

    .description-text {
      margin-bottom: 40px;
      text-align: center;
    }
  }

  .joinview__right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 500px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;

    header {
      h1 {
        margin-bottom: 20px;
        font-weight: 200;
        font-family: 'malang-board-bold';
        font-size: 30px;
      }
    }

    // 폼
    form {
      display: flex;
      flex-direction: column;

      .el-input {
        margin-bottom: 20px;
      }
    }

  }
}

.el-select {
  margin-bottom: 20px;
  width: 100%;
}

label {
  display: block;
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
