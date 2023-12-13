<template>
  <div>
    <div class="md-editor">
      <div class="tool-bar">
        <el-tooltip class="item" effect="dark" content="전체화면" placement="top">
          <i @click="editorRef.togglePageFullscreen(true)">
            <el-icon>
              <FullScreen />
            </el-icon>
          </i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="미리보기" placement="top">
          <i @click="editorRef.togglePreview()">
            <el-icon>
              <View />
            </el-icon>
          </i>
        </el-tooltip>
      </div>
      <div class="md-editor">
        <md-editor ref="editorRef" language="en-US" :scrollAuto="true" theme="dark" v-model="description" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineProps, emit } from "vue";

// form 데이터
defineProps({
  description: String,
});

