<template>
  <!-- 팝업 메뉴 -->
  <el-form class="form-wrap">
    <el-form-item label-width="60px" size="large" label="담당자">
      <el-select v-model="customForm.user_idx" placeholder="담당자를 선택하세요">
        <el-option v-for="user in mockUsers" :key="user.id" :label="user.name" :value="user.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label-width="60px" label="태그">
      <el-input class="tag__input" v-model="customForm.tag" placeholder="태그를 입력하세요"
        @keyup.enter="handleAddTag"></el-input>
      <div class="tag-co∂ntainer">
        <el-tag v-for="tag in customForm.tags" :key="tag.id" type="info" closable @close="handleCloseTag(tag)">
          {{ tag.title }}
        </el-tag>
      </div>
    </el-form-item>
    <el-form-item label-width="60px" size="large" label="제목">
      <el-input v-model="customForm.title" @keypress.enter="handleEnterCard" placeholder="제목을 입력하세요"></el-input>
    </el-form-item>

    <el-form-item>
      <!-- 에디이터 -->
      <md-editor ref="editorRef" language="en-US" :scrollAuto="true" theme="dark" v-model="customForm.description" />
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import { defineProps, ref, toRef, watch, defineEmits } from "vue";
// import { cloneDeep } from "lodash";
import { MdEditor } from 'md-editor-v3';
import { cloneDeep } from "lodash";
import { useUserStore } from "@/stores/user";
// import { Card } from "@/types/KanbanBoard";

// emit
const emit = defineEmits(["update:form", "enter"]);

// Store
const userStore = useUserStore();
// const users = userStore.users;
const mockUsers = userStore.getMockUsers;

// form 데이터
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const form = toRef(props, "form");



/* --------------------------------- 업데이트 폼 --------------------------------- */
let customForm = ref(cloneDeep(form.value));

// customForm 업데이트 될때 emit
watch(customForm, (newVal) => {
  console.log("watch customForm", newVal);
  emit("update:form", newVal);
}, { deep: true });

// open 될 때 form 업데이트
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    customForm.value = cloneDeep(form.value);
  }
});

const handleEnterCard = () => {
  console.log("handleEnterCard");
  emit("enter", customForm.value);
}

// 제목 앞에 fix:, feat:, add:, chore 등 이 붙어있으면 태그로 인식 태그로 추가
// watch(() => customForm.value.title, (newVal) => {
//   const title = newVal;
//   const tag = title.split(":")[0];
//   const tagList = ["fix", "feat", "add", "chore"];
//   if (tagList.includes(tag) && newVal.includes(":")) {
//     customForm.value.tags.push({
//       id: customForm.value.tags.length + 1,
//       title: tag,
//       color: "info",
//     });
//     customForm.value.title = title.replace(`${tag}:`, "");
//   }
// });

/* --------------------------------- 태그 핸들링 --------------------------------- */
// 태그 추가
const handleAddTag = () => {
  if (customForm.value.tag) {
    customForm.value.tags.push({
      id: customForm.value.tags.length + 1,
      title: customForm.value.tag,
      color: "info",
    });
    customForm.value.tag = "";
  }
};

// 태그 삭제
const handleCloseTag = (tag: any) => {
  const index = customForm.value.tags.indexOf(tag);
  customForm.value.tags.splice(index, 1);
};
</script>
<style scoped lang="scss">
// 폼
.form-wrap {
  padding: 20px;
  border-radius: 10px;
  background-color: #1f1f1f;
}

.el-form-item__content {
  color: #ffffff;
}

.el-form-item__content .el-input__inner {
  background-color: #2b2b2b;
  color: #ffffff;
}

// 첫번째 태그 마진 제거
.el-form-item__content .el-tag:first-child {
  margin-left: 0;
}

.el-form-item__content .el-tag {
  background-color: #2b2b2b;
  margin-left: 10px;
  color: #ffffff;
}

.tag-container {
  margin-bottom: 10px;
}


.dialog-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  height: 50px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.md-editor {
  width: 100%;
  height: 300px;
  background-color: black;
  border: none;
  border-radius: 10px;
  padding: 10px;
}

.tool-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  height: 50px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}
</style>