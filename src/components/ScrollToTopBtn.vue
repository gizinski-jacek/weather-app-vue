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
  left: 0;
  margin: 0.25rem;
  width: 24px;
  height: 24px;
  transition: 0.3s ease-in-out;

  &:hover,
  &:active {
    opacity: 1;
  }

  span {
    display: block;
    margin: auto;

    &:before,
    &:after {
      display: block;
      content: '';
      width: 3px;
      height: 12px;
      background-color: var(--color-border-hover);
      border-radius: 4px;
      transform: translateX(-2px) rotate(40deg);
      cursor: pointer;
      transition: 0.3s ease-in-out;
    }

    &:after {
      border-radius: 4px;
      transform: translateX(4px) translateY(-12px) rotate(-40deg);
    }
  }

  &:active span:before,
  &:active span:after {
    background-color: var(--color-border-active);
  }
}

@media (min-width: 640px) {
  .scroll-to-top-btn {
    right: 0;
    width: 32px;
    height: 32px;
    opacity: 0.5;

    span {

      &:before,
      &:after {
        width: 4px;
        height: 16px;
        transform: translateX(0) translateY(2px) rotate(40deg);
      }

      &:after {
        transform: translateX(8px) translateY(-14px) rotate(-40deg);
      }
    }
  }
}
</style>