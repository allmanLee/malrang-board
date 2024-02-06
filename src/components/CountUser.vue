<template>
  <div class="count-user">
    <div class="count-team__header">
      <span v-if="team">팀</span>
      <span v-if="team && member">&nbsp;/&nbsp;</span>
      <span v-if="member">인원</span>
    </div>
    <div class="count-team__body">
      <span v-if="team">{{ team }}</span>
      <span v-if="team && member">&nbsp;/&nbsp;</span>
      <span v-if="member">{{ member }}</span>
    </div>
    <span v-if="!team && !member" style="font-size: 12px; font-weight: bold;" class="--empty">팀원이 없어요</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  team: {
    type: Number,
    default: 0
  },
  member: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss" scoped>
.count-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 12px;
  width: 200px;
  padding: 10px;
}

.count-team__header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  color: #616161;
  font-size: 12px;
}

.count-team__body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  font-size: 16px;
  font-weight: bold;
}

.--empty {
  color: $gray-700;
  font-size: 12px;
  font-weight: bold;
}
</style>