<template>
  <!-- 팝업 메뉴 -->
  <el-form label-position="top" class="form-wrap">

    <section class="form-items__base-info">
      <el-form-item label-width="60px" size="large" label="담당자 (복수 선택 가능)">
        <el-select v-model="customForm.userIdx" placeholder="담당자를 선택하세요" class="select-user">
          <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 필수  -->
      <el-form-item label-width="60px" size="large" label="제목 (필수)" required>
        <el-input aria-required="true" v-model="customForm.title" @keypress.enter="handleEnterCard"
          placeholder="제목을 입력하세요"></el-input>
      </el-form-item>

      <el-form-item label-width="60px" label="태그 (최대 10개)">
        <div class="tag-container">
          <el-tag v-for="tag in customForm.tags" :key="tag.id" type="info" closable @close="handleCloseTag(tag)">
            {{ tag.title }}
          </el-tag>
          <el-input class="tag__input" v-model="customForm.tag" placeholder="추가 태그를 입력"
            @keyup.enter="handleAddTag"></el-input>
          <!-- 태그에 입력된 값이 있으면 'Enter'표시 -->
          <el-button v-if="customForm.tag" type="primary" @click="handleAddTag">
            <span class="icon-enter">↵</span></el-button>
        </div>

      </el-form-item>
    </section>
    <el-form-item>
      <!-- 에디이터 (다크모드)-->
      <md-editor ref="editorRef" language="en-US" :scrollAuto="true" :disabled="false" :preview="true"
        v-model="customForm.description"></md-editor>
    </el-form-item>
    <el-button v-show="false" type="primary">등록</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, ref, toRef, watch, defineEmits, computed } from "vue";
// import { cloneDeep } from "lodash";
import { MdEditor } from 'md-editor-v3';
import { cloneDeep } from "lodash";
import { useUserStore } from "@/stores/user";
// import { Card } from "@/types/KanbanBoard";

// emit
const emit = defineEmits(["update:form", "enter"]);

// editor
const editorRef = ref(null);

// Store
const userStore = useUserStore();
// const users = userStore.users;
const users = computed(() => userStore.users);

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
  height: 600px;
  overflow: auto;
}

.select-user {
  width: 100%;
}

.form-items__base-info {
  border: 1px solid #2b2b2b;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.el-form-item__content {
  // color: #ffffff;
}

.el-form-item__content .el-input__inner {
  // color: #ffffff;
}

.el-form-item__content .el-tag {
  height: 32px;
}

// 첫번째 태그 마진 제거
.el-form-item__content .el-tag:first-child {
  margin-left: 0;
}

.el-form-item__content .el-tag {
  // margin-left: 10px;
  // color: #ffffff;
  background-color: #2b2b2b;

  &:hover {
    // color: #ffffff;
    border: 1px solid #9e9e9e;

    .el-tag__close {
      // color: #ffffff;
    }
  }
}

.tag-container {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;

  .tag__input {
    width: 140px;
    // background-color: #2b2b2b;
    // color: #ffffff;
  }
}


.dialog-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  height: 50px;
  // color: #ffffff;;
  font-size: 20px;
  font-weight: 700;
}

.md-editor {
  width: 100%;
  height: 300px;
  // background-color: black;
  border: none;
  border-radius: 10px;
  padding: 10px;
}

.icon-enter {
  font-size: 12px;
  // margin-left: 5px;
  margin-top: 6px;
  // color: #ffffff;
  font-weight: 700;
}
</style>