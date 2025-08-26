<template>
  <div class="bg-zinc-900 min-h-screen">
    <HeaderCraft />

    <HelloWorld />
    
    <PlayMusic v-if="musicStore.currentTrack" />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import PlayMusic from '@/components/PlayMusic.vue'
import HeaderCraft from "@/components/HeaderCraft.vue";
import { useMusicStore } from '@/stores/useMusicStore.js';

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    PlayMusic,
    HeaderCraft
  },
  setup() {
    const musicStore = useMusicStore();
    return { musicStore };
  },
}
</script>