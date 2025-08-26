<template>
  <div class="w-full h-1 md:h-2 bg-zinc-700 rounded-full cursor-pointer relative group" @click="seekByClick">
    <div class="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-linear" :style="{ width: progressPercent + '%' }"></div>
    <div class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full transform -translate-x-1/2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" :style="{ left: progressPercent + '%' }"></div>
  </div>
</template>

<script>
import { useMusicStore } from '@/stores/useMusicStore.js';

export default {
  setup() {
    const musicStore = useMusicStore();
    return { musicStore };
  },
  computed: {
    progressPercent() {
      return this.musicStore.duration > 0 ? (this.musicStore.currentTime / this.musicStore.duration) * 100 : 0;
    }
  },
  methods: {
    seekByClick(event) {
      const progressBar = event.currentTarget;
      const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
      const totalWidth = progressBar.clientWidth;
      const newTime = (clickPosition / totalWidth) * this.musicStore.duration;
      this.musicStore.seek(newTime);
    }
  }
};
</script>