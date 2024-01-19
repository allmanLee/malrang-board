<!-- 말랑보드의 메이페이지 -->
<!-- 말랑보드에서는 링크를 모아볼수 있습니다. -->
<!-- 오늘 할일 한일 기록 및 깃연동으로 인원별 커밋 내용을 확인할 수 있습니다. -->
<template>
  <div id="MainView" class="container">
    <section class="main">
      <h1>말랑보드</h1>
      <p>관리자 중심의 프로젝트 메니저가 아닌 구성원 중심의 매니저</p>

    </section>
    <section class="function">
      <h1>말랑보드 기능</h1>
      <p>일별 커밋 - 깃 연동</p>
      <p>한일 기록 - 칸반보드 기록, 엑셀로 저장하기</p>
      <p>오늘 할일 - 대시보드 기능</p>
      <p>컴포넌트 공유 문서 - 목록</p>
      <p>북마크 - 링크 모음</p>
    </section>
    <section class="function">
      <h1>말랑보드 사용자</h1>
      <p>개인프로젝트로 제작된 서비스로, 프론트엔드 개발자에게 최적화 되어 있는 칸판보드입니다.</p>
    </section>
  </div>
</template>
<script setup lang="ts">


</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
  width: 100%;
  margin-bottom: 100px;
  text-align: center;

  section {
    width: 100%;
  }

  h1 {
    font-size: 40px;
    font-weight: 700;
    color: white;
  }

  p {
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
