<template>
  <div class="joinview">
    <section class="joinview__left">
      <h1><span class="--welcome">Welcome to </span>말랑보드</h1>
    </section>
    <section class="joinview__right">
      <header>
        <h1>회원가입</h1>
      </header>

      <el-form ref="joinForm" :model="form" :rules="rules" @submit.prevent="nextStep" class="form"
        :label-position="'top'">
        <el-form-item v-if="step === 1" label="이름" prop="name">
          <el-input type="text" id="name" v-model="form.name" required />
        </el-form-item>
        <el-form-item v-if="step === 1" label="이메일" prop="email">
          <el-input type="email" id="email" v-model="form.email" required />
        </el-form-item>
        <el-form-item v-if="step === 1" label="비밀번호" prop="password">
          <el-input type="password" id="password" v-model="form.password" required />
        </el-form-item>
        <el-form-item v-if="step === 1" label="비밀번호 확인" prop="rePassword">
          <el-input type="password" id="rePassword" v-model="form.rePassword" required />
          <!-- <el-alert title="비밀번호가 일치하지 않습니다." type="error" v-if="!isPasswordMatch && form.password && form.rePassword"
            show-icon center :closable="false"></el-alert> -->
        </el-form-item>
        <el-form-item v-if="step === 2" label="소속 그룹 (입력하여 추가할 수 있어요!)" prop="groupName">
          <el-select v-model="form.groupName" filterable allow-create placeholder="소속을 선택하세요" class="select-user">
            <el-option v-for="group in mockGroups" :key="group.id" :label="group.name" :value="group.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="step === 2" prop="isAdmin">
          <el-checkbox v-model="form.isAdmin" id="isAdmin">당신은 관리자 이신가요?</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button v-if="step === 1" type="primary" @click="nextStep">
            <span class="button--bold">
              다음
            </span>
          </el-button>
          <el-button v-if="step === 2" type="primary" @click="submitForm">
            <span class="button--bold">
              완료
            </span>
          </el-button>
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

const form = ref({
  name: '',
  email: '',
  groupName: '',
  password: '',
  rePassword: '',
  isAdmin: false
});

const validatePassword = (rule, value, callback) => {
  console.log('validatePassword', value, form.value.password);
  if (value !== form.value.password) {
    callback(new Error('비밀번호가 일치하지 않습니다.'));
  } else {
    console.log('validatePassword True', value, form.value.password);
    callback();
  }
};

const rules = ref({
  name: [
    { required: true, message: '이름을 입력해주세요', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '이메일을 입력해주세요', trigger: 'blur' },
    { type: 'email', message: '올바른 이메일 형식이 아닙니다', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '비밀번호를 입력해주세요', trigger: 'blur' }
  ],
  rePassword: [
    { required: true, message: '비밀번호 확인을 입력해주세요', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  groupName: [
    { required: true, message: '소속 그룹을 선택해주세요', trigger: 'blur' }
  ]
});

const step = ref(1);

// 비밀번호 중복검사
const isPasswordMatch = ref(false);

watch(() => form.value.rePassword, (newValue) => {
  if (form.value.password === newValue) {
    isPasswordMatch.value = true;
  } else {
    isPasswordMatch.value = false;
  }
});

const mockGroups: Group[] = [
  { name: '말랑보드', id: 1 },
  { name: '서원정보', id: 2 }
];

const nextStep = () => {
  if (step.value === 1) {
    if (isPasswordMatch.value) {
      step.value = 2;
    }
  } else if (step.value === 2) {
    submitForm();
  }
};

const submitForm = async () => {
  // Perform signup logic here
  console.log('Name:', form.value.name);
  console.log('Email:', form.value.email);
  console.log('GroupName:', form.value.groupName);
  console.log('Password:', form.value.password);
  console.log('Is Admin:', form.value.isAdmin);

  try {
    // 회원가입 API 호출
    await API.createUser({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      groupName: form.value.groupName,
      isAdmin: form.value.isAdmin
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
    margin-right: 120px;
    background-color: rgba(255, 255, 255, 0.05);
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

  .button--bold {
    font-weight: 700;
    font-size: 16px;
  }
}

.el-input {
  margin-bottom: 4px;
}

.el-form-item {
  margin-bottom: 40px;
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
