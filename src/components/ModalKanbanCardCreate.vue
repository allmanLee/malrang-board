<template>
  <!-- 팝업 메뉴 -->
  <el-form label-position="left" class="form-wrap" label-width="160">
    <!-- <div></div> -->
    <h1 class="form-title" v-if="!isEditTitle" @click="handleClickEditTitle">
      <span class="form-title__text" v-if="customForm.title">{{ customForm.title }}</span>
      <span class="form-title__text --empty" v-else>제목을 입력하세요</span>
      <span class="icon-edit">
        <el-icon>
          <Edit />
        </el-icon>
        <span>
          편집
        </span>
      </span>
    </h1>
    <el-form-item label-width="0" size="large" v-if="isEditTitle">
      <el-input v-model="customForm.title" ref="titleInput" @blur="isEditTitle = false" class="title-input"
        placeholder="제목을 입력하세요"></el-input>
    </el-form-item>


    <!-- 카드 제목(클릭시 편집가능) -->

    <section class="form-items__base-info">
      <!-- 필수  -->
      <!-- <el-form-item label-width="60px" size="large" label="제목 (필수)" required>
        <el-input aria-required="true" v-model="customForm.title" @keypress.enter="handleEnterCard"
          placeholder="제목을 입력하세요"></el-input>
      </el-form-item> -->
      <el-form-item size="large" label="담당자 (복수 선택 가능)" required>
        <el-select v-model="customForm.userId" placeholder="담당자를 선택하세요" class="select-user">
          <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-for="field in optinalField?.cols || []" :key="field.id" :label="field.label" size="large">
        <el-input v-if="field.type === 'text'" v-model="customForm.optionalData[field.id]" placeholder="입력하세요"></el-input>
        <el-select v-else-if="field.type === 'select'" v-model="customForm.optionalData[field.key]" placeholder="선택하세요"
          class="select-user">
          <el-option v-for="option in field.options" :key="option.id" :label="option.label"
            :value="option.id"></el-option>
        </el-select>
        <el-date-picker v-if="field.type === 'date'" v-model="customForm.optionalData[field.key]" type="date"
          placeholder="날짜를 선택하세요" value-format="YYYY-MM-DD" format="YYYY-MM-DD" style="width: 100%;"></el-date-picker>
        <el-input v-if="field.type === 'number'" v-model="customForm.optionalData[field.key]" type="number"
          placeholder="숫자를 입력하세요" style="width: 100%;"></el-input>
        <el-input v-if="field.type === 'textarea'" v-model="customForm.optionalData[field.key]" type="textarea"
          placeholder="내용을 입력하세요">
        </el-input>
      </el-form-item>

      <el-form-item label="태그 (최대 10개)">
        <div class="tag-container">
          <el-tag v-for="tag in customForm.tags" :key="tag.id" type="info" closable @close="handleCloseTag(tag)" round>
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
    <section class="form-items__description">
      <el-form-item label-width="0">
        <!-- 에디이터 (다크모드)-->
        <KeepAlive include="MdEditor">
          <md-editor ref="editorRef" language="en-US" :scrollAuto="true" :disabled="false" :preview="false"
            v-model="customForm.description" :theme="isDarkMode ? 'dark' : 'light'"></md-editor>
        </KeepAlive>
      </el-form-item>
    </section>
    <el-button v-show="false" type="primary">등록</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, ref, toRef, watch, defineEmits, computed } from "vue";
// import { MdEditor } from 'md-editor-v3';
import { cloneDeep } from "lodash";
import { useUserStore } from "@/stores/user";
// import { useCommonStore } from "@/stores/common";

// 다크모드 여부
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains("dark");
});

// emit
const emit = defineEmits(["update:form", "enter"]);
const isEditTitle = ref(false);

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
  optinalField: {
    type: Object,
    required: true,
  },
  // openType : ['create','update'],
  type: {
    type: String,
    required: true,
  },
});

const form = toRef(props, "form");



/* --------------------------------- 업데이트 폼 --------------------------------- */
let customForm = ref(cloneDeep(form.value));
let titleInput = ref(null);
let handleClickEditTitle = () => {
  isEditTitle.value = true;
  // setTimeout(() => {
  //   titleInput.value.focus();
  // }, 100);
};

// customForm 업데이트 될때 emit
watch(customForm, (newVal) => {
  emit("update:form", newVal);
}, { deep: true });

// open 될 때 form 업데이트
// watch(() => props.isOpen, (newVal) => {
//   if (newVal) {
//     customForm.value = cloneDeep(form.value);
//   }
// }, { immediate: true });
console.log("props.isOpen", props.isOpen);
console.log("props.form", props.form);
console.log("optinalField", props.optinalField);

// 만약 customForm에서 optinalField에 비어있는 키가 있다면 추가
if (props.optinalField) {
  const optionalData = customForm.value.optionalData;
  for (const field of props.optinalField.cols) {
    if (!optionalData[field.key]) {
      optionalData[field.key] = null;
    }
  }
}


// const handleEnterCard = () => {
//   console.log("handleEnterCard");
//   emit("enter", customForm.value);
// }

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
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0px !important;
  border-radius: 10px;
  overflow: auto;

  .form-title {
    display: flex;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    align-items: flex-end;
    width: auto;
    min-height: 40px;
    gap: 10px;
    border-bottom: 1px dashed $gray-300;

    &__text {
      font-weight: 700;

      &.--empty {
        color: $gray-700;
      }
    }




    .icon-edit {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      padding-bottom: 10px;
      gap: 2px;
      width: 60px;
      // color: $gray-300;

      span {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 14px;
        // font-weight: 700;
      }
    }
  }
}

.title-input {
  border: none;
  border-bottom: 1px dashed $gray-300;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 39px;

  &::v-deep(.el-input__inner) {
    padding: 0;
    margin: 0;
    border: none;
    font-size: 24px;
    font-weight: 700;

  }

  &::v-deep(.el-input__wrapper) {
    box-shadow: none;
    padding: 0;

  }
}

.select-user {
  width: 100%;
}

.form-items__base-info {
  // border: 1px solid #2b2b2b;
  margin-bottom: 20px;
  border-radius: 10px;
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
  // background-color: #2b2b2b;

  &:hover {
    // color: #ffffff;
    border: 1px solid #9e9e9e;

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


.form-items__description {
  .md-editor {
    width: 100%;
    // min-height: 100px;
    // background-color: black;
    border: 1px solid #2b2b2b;
    border-radius: 10px;
    padding: 10px;
    // color: white;

    &__preview {
      border: 1px solid #2b2b2b;
      border-radius: 10px;
      padding: 10px;
      // color: white;
    }
  }
}


.icon-enter {
  font-size: 12px;
  // margin-left: 5px;
  margin-top: 6px;
  // color: #ffffff;
  font-weight: 700;
}

// 카드 추가 버튼
.add-button {
  width: 100%;
  height: 20px;
}

html.dark {
  .form-wrap {
    .form-title {
      border-bottom: 1px dashed $dark-gray-100;

      .icon-edit {
        // color: #9e9e9e;
      }
    }

    .title-input {
      border-bottom: 1px dashed #9e9e9e;
    }

    .el-tag {

      // color: #ffffff;
      // background-color: #2b2b2b;
      &:hover {
        // color: #ffffff;
        border: 1px solid #9e9e9e;
      }
    }

    .md-editor {
      border: 1px solid #2b2b2b;
    }
  }
}

html.dark {

  .form-items__description {
    .md-editor {
      width: 100%;
      // min-height: 100px;
      // background-color: black;
      border: 1px solid #2b2b2b;
      border-radius: 10px;
      padding: 10px;
      color: white;

      &__preview {
        border: 1px solid #2b2b2b;
        border-radius: 10px;
        padding: 10px;
        color: white;
      }
    }
  }
}
</style>