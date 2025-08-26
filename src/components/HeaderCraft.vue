<template>
  <header class="fixed top-0 left-0 w-full h-16 bg-zinc-800 text-white flex justify-between items-center px-4 md:px-10 shadow-lg z-50">
    <div class="flex-1">
      <input 
        v-model="searchText"
        type="text" 
        placeholder="Search for artists, songs, or genres" 
        class="w-full md:w-80 p-2 md:p-3 rounded-full bg-zinc-700 text-white text-sm md:text-base border-none outline-none placeholder-zinc-400"
        @keyup.enter="search" 
      />
    </div>
    <div class="ml-4 md:ml-10">
      <h2 class="text-lg md:text-xl font-bold text-emerald-400">9craft Radio</h2>
    </div>
  </header>
</template>

<script>
import { useMusicStore } from '@/stores/useMusicStore.js';

export default {
  name: 'HeaderCraft',
  data() {
    return {
      searchText: '',
      debounceTimer: null,
    };
  },
  watch: {
    searchText(newQuery) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchMusic(newQuery);
      }, 500); // زمان debounce را به 500 میلی‌ثانیه کاهش دادیم تا سریع‌تر عمل کند
    },
  },
  methods: {
    search() {
      clearTimeout(this.debounceTimer);
      this.searchMusic(this.searchText);
    },
    searchMusic(query) {
      const musicStore = useMusicStore();
      musicStore.searchMusic(query);
    }
  },
  beforeUnmount() {
    clearTimeout(this.debounceTimer);
  }
};
</script>