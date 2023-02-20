<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const btnVisible = ref<boolean>(false);

onMounted(() => {
  if (typeof window === 'undefined') return;
  window.addEventListener('scroll', toggleBtnVisiblity);
});

onUnmounted(() => {
  window.removeEventListener('scroll', toggleBtnVisiblity);
})

function toggleBtnVisiblity() {
  btnVisible.value = document.documentElement.scrollTop > 400;
};

function scrollToTop(e: MouseEvent) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
</script>

<template>
  <button type="button" class="scroll-to-top-btn" :style="{ display: btnVisible ? 'block' : 'none' }"
    @click="scrollToTop">
    <span></span>
  </button>
</template>

<style scoped lang="scss">
.scroll-to-top-btn {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 0.5rem;
  width: 28px;
  height: 28px;

  span {
    display: block;
    margin: auto;

    &:before,
    &:after {
      display: block;
      content: "";
      width: 4px;
      height: 14px;
      background-color: var(--color-heading);
      border-radius: 4px;
      transform: translateX(-1px) rotate(40deg);
      cursor: pointer;
      transition: 0.25s ease-in-out;
    }

    &:after {
      border-radius: 4px;
      transform: translateX(6px) translateY(-14px) rotate(-40deg);
    }

    &:hover:before,
    &:hover:after {
      background-color: var(--color-text);
    }
  }

  &:active span:before,
  &:active span:after {
    background-color: var(--color-text-alt);
  }
}
</style>