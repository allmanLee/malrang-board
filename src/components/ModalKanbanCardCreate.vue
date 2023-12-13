<template>
  <!-- 팝업 메뉴 -->
  <el-dialog class="dark" :title="`노트 추가`" v-model="modalKanban.dialogVisible" :before-close="modalKanban.beforeClose">
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
          <el-tag v-for="tag in form.tags" :key="tag.id" :type="tag.color" closable @close="handleCloseTag(tag)">
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
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="modalKanban.close()">취소</el-button>
      <el-button type="primary" @click="handleSave(selectedBoardId)">저장</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, defineProps } from "vue";
import _ from "lodash";

// form 데이터
defineProps<{
  form: {
    user: string;
    title: string;
    tag: string;
    tags: { id: number; title: string; color: string }[];
    description: string;
  };
}>();

let customForm = reactive({
  user: "",
  title: "",
  tag: "",
  tags: [],
  description: "",
});

customForm = _.cloneDeep(form.value);

// 저장 버튼 클릭시
const handleSave = (selectedBoardId: number) => {
  emit("update-card", {
    boardId: selectedBoardId,
    card: {
      id: 1,
      title: customForm.title,
      description: customForm.description,
      tags: customForm.tags,
      commit: [],
    },
  });
};


// 태그 삭제
const handleCloseTag = (tag: any) => {
  form.value.tags.splice(form.value.tags.indexOf(tag), 1);
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