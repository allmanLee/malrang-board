<template>
  <!-- 팝업 메뉴 -->
  <el-form class="form-wrap">
    <el-form-item label-width="60px" size="large" label="담당자">
      <el-input v-model="customForm.user" placeholder="담당자를 입력하세요"></el-input>
    </el-form-item>
    <el-form-item label-width="60px" size="large" label="제목">
      <el-input v-model="customForm.title" placeholder="제목을 입력하세요"></el-input>
    </el-form-item>
    <el-form-item label-width="60px" label="태그">
      <el-input class="tag__input" v-model="customForm.tag" placeholder="태그를 입력하세요"
        @keyup.enter="handleAddTag"></el-input>
      <div class="tag-co∂ntainer">
        <el-tag v-for="tag in customForm.tags" :key="tag.id" :type="tag.color" closable @close="handleCloseTag(tag)">
          {{ tag.title }}
        </el-tag>
      </div>
    </el-form-item>
    <el-form-item>
      <!-- 에디이터 -->
      <!-- <custom-md-editor ref="editorRef" language="en-US" :scrollAuto="true" theme="dark" v-model="form.description" /> -->
      <md-editor ref="editorRef" language="en-US" :scrollAuto="true" theme="dark" v-model="customForm.description" />
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import { reactive, defineProps, toRef, ref } from "vue";
import { cloneDeep } from "lodash";
import { MdEditor } from 'md-editor-v3';
import { Card } from "@/types/KanbanBoard";

// form 데이터
const { form } = defineProps({
  form: {
    type: Object,
    required: true,
  },
});


const editorRef = ref(null)

let customForm = null

customForm = form;

// 태그 삭제
const handleCloseTag = (tag: any) => {
  const index = customForm.tags.indexOf(tag);
  customForm.tags.splice(index, 1);
};

const handleAddTag = () => {
  if (customForm.tag) {
    customForm.tags.push({
      id: customForm.tags.length + 1,
      title: customForm.tag,
      color: "primary",
    });
    customForm.tag = "";
  }
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