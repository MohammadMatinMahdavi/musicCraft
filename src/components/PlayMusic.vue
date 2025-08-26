<template>
  <div class="fixed bottom-0 left-0 w-full p-4 bg-zinc-800 border-t border-zinc-700 shadow-xl z-50 flex items-center justify-center">
    <div class="flex items-center w-full max-w-5xl">
      <div v-if="musicStore.currentTrack" class="flex items-center w-full max-w-5xl">
        <div class="w-12 h-12 md:w-16 md:h-16 mr-3 md:mr-6 flex-shrink-0 rounded-md overflow-hidden shadow-lg">
          <img :src="musicStore.currentTrack.image" :alt="musicStore.currentTrack.track_name" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col justify-center flex-grow min-w-0 mr-4 md:mr-8">
          <p class="text-sm md:text-lg font-semibold text-white truncate">{{ musicStore.currentTrack.track_name }}</p>
          <p class="text-xs md:text-sm text-zinc-400 mt-1 truncate">{{ musicStore.currentTrack.artist }}</p>
        </div>
        <div class="flex-shrink-0 flex items-center justify-center mr-4 md:mr-6">
          <button @click="musicStore.togglePlayback()" class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-none shadow-lg transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none">
            <svg v-if="!musicStore.isPlaying" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
              <path d="M6 3.5L18 12L6 20.5V3.5Z" fill="white"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
              <path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z" fill="white"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center flex-grow gap-2 md:gap-4 min-w-0">
          <div class="text-xs md:text-sm text-zinc-400 min-w-[3rem] text-center">{{ musicStore.formatTime(musicStore.currentTime) }}</div>
          <ProgressBar />
          <div class="text-xs md:text-sm text-zinc-400 min-w-[3rem] text-center">{{ musicStore.formatTime(musicStore.duration) }}</div>
        </div>
      </div>
      
      <div v-else class="flex items-center justify-center w-full text-zinc-400 text-sm md:text-base">
        Select a track to start playing!
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue';
import { useMusicStore } from '@/stores/useMusicStore.js';

export default {
  components: {
    ProgressBar,
  },
  setup() {
    const musicStore = useMusicStore();
    return { musicStore };
  },
};
</script>