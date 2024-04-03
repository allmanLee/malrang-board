<!-- 설정 모달 컨텐츠: 폼에 들어갈 필터를 추가하거나 삭제할 수 있고, 태그의 색을 추가 할 수 있다 -->

<template>
  <div>
    <div class="modal-board-setting">
      <el-container>
        <el-aside width="160px" height="100vh" class="menu-side-bar">
          <el-menu v-model="menuIndex" default-active="1" @select="handleSelectMenu">
            <el-menu-item v-for="tab in tabs" :key="tab.index" :index="tab.index">{{ tab.label }}</el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <h1>
              {{ tabs.find((tab) => tab.index === menuIndex).label }}
            </h1>
          </el-header>
          <el-main>
            <div class="team-container" v-if="menuIndex === '1'">
              <el-form label-width="80px">
                <el-form-item label="팀 이름">
                  <el-input v-model="teamName"></el-input>
                </el-form-item>
                <el-form-item label="팀 설명">
                  <el-input v-model="teamDescription"></el-input>
                </el-form-item>
                <el-form-item label="팀 맴버">
                  <el-select v-model="teamMembers" multiple placeholder="팀 맴버 선택">
                    <el-option v-for="member in teamMembers" :key="member.id" :label="member.name"
                      :value="member.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">수정</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="field-container" v-if="menuIndex === '2'">
              <el-form label-width="80px">
                <el-form-item label="이름">
                  <el-input v-model="fieldForm.label"></el-input>
                </el-form-item>
                <el-form-item label="타입">
                  <el-select v-model="fieldForm.type" placeholder="타입 선택">
                    <el-option label="텍스트" value="text"></el-option>
                    <el-option label="숫자" value="number"></el-option>
                    <el-option label="날짜" value="date"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="필터 키">
                  <el-input v-model="fieldForm.key"></el-input>
                </el-form-item>
                <el-form-item>
                  <!-- 필수 여부 -->
                  <el-checkbox v-model="fieldForm.required">필수 여부</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addField">추가</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="tag-container" v-if="menuIndex === '3'">
              <el-form label-width="80px">
                <el-form-item label="태그 이름">
                  <el-input v-model="tagForm.label"></el-input>
                </el-form-item>
                <el-form-item label="키 값">
                  <el-input v-model="tagForm.key"></el-input>
                </el-form-item>
                <el-form-item label="태그 색">
                  <el-color-picker v-model="tagForm.color"></el-color-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addTag">추가</el-button>
                </el-form-item>
              </el-form>
              <!-- 태그 선택해서 그룹 선택하는 기능 추가 -->
              <div class="tag-search-bar">
                <el-checkbox v-model="allCheckTag">
                  전체 선택
                </el-checkbox>
                <el-select v-model="selectedTagGroup" placeholder="태그 그룹 선택">
                  <el-option v-for="group in tagGroups" :key="group.id" :label="group.name"
                    :value="group.id"></el-option>
                </el-select>
              </div>

              <div class="tag-list">
                <el-tag v-for="tag in tags" :key="tag.id" effect="dark" :color="tag.color">{{ tag.name }}</el-tag>
              </div>
            </div>

          </el-main>
          <el-footer>
            <!-- <el-button type="primary" @click="closeModal">확인</el-button> -->
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

// 랜덤 해쉬 생성
const randomHash = () => {
  return Math.random().toString(36).substr(2, 11)
}

const menuIndex = ref('1')
const handleSelectMenu = (index) => {
  menuIndex.value = index
}
const teamMembers = ref([
  {
    id: 1,
    name: '김철수',
  },
  {
    id: 2,
    name: '김영희',
  },
  {
    id: 3,
    name: '김민수',
  },
  {
    id: 4,
    name: '김미영',
  },
])
const tabs = ref([
  {
    label: '팀 정보 수정',
    index: '1',
  },
  {
    label: '칸반 정보',
    index: '2',
  },
  {
    label: '태그 관리',
    index: '3',
  },
])

const tagGroups = ref([
  {
    id: 1,
    name: '[칸반보드] 보드 업그레이드',
  },
  {
    id: 2,
    name: '[칸반보드] 카드 내용 수정',
  },
  {
    id: 3,
    name: '[필터] 필터 추가',
  },
])

const selectedTagGroup = ref(1)
const fieldForm = ref({
  label: '',
  type: 'text',
  required: false,
  key: randomHash(),
})
const addField = () => {
  console.log('필터 추가')
  ElNotification({
    title: '필터 추가',
    message: '필터가 추가되었습니다.',
    type: 'success',
  })
}

/* ---------------------------------- 태그 관리 --------------------------------- */

const tags = ref([])
const tagForm = ref({
  label: '',
  key: randomHash(),
  color: '#409EFF',
})

const addTag = () => {
  tags.value.push({
    id: tags.value.length + 1,
    name: tagForm.value.label,
    color: tagForm.value.color,
  })

  tagForm.value = {
    label: '',
    key: randomHash(),
    color: '#409EFF',
  }

  ElNotification({
    title: '태그 추가',
    message: '태그가 추가되었습니다.',
    type: 'success',
  })
}

const allCheckTag = ref(false)


/* ---------------------------------- 팀 관리 --------------------------------- */
const teamName = ref('')
const teamDescription = ref('')




</script>

<style scoped lang="scss">
.modal-board-setting {
  width: 800px;
  height: 100%;

  .menu-side-bar {
    height: 100%;

  }

  &::v-deep(.el-container) {
    height: 100%;
  }

  .el-menu {
    height: 100%;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
  }
}



.modal-board-setting {
  width: 800px;
  height: 50vh;
}

.tag-search-bar {
  display: flex;

  align-items: space-between;
  justify-content: space-between;
  margin-bottom: 10px;

  .el-select {
    width: 200px;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>