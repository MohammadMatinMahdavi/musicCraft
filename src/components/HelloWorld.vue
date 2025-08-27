<template>
  <div class="pt-24 px-4 md:px-10">
    <div class="mb-8" v-for="(tracksByGenre, genreName) in displayedTracks" :key="genreName">
      <h3 class="text-2xl font-bold mb-4 text-white">{{ genreName }}</h3>
      
      <div class="flex overflow-x-auto gap-4 md:gap-6 pb-4">
        <div class="flex-shrink-0 w-40 sm:w-44 md:w-48 bg-zinc-800 rounded-lg p-3 md:p-4 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 relative group" v-for="track in tracksByGenre" :key="track.track_id">
          <div class="w-full aspect-square relative">
            <img
              class="card-image absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-md"
              :data-src="track.image"
              src="https://via.placeholder.com/100x100?text=Loading..."
              :alt="track.track_name"
            />
          </div>
          <div class="mt-4 text-center">
            <h4 class="text-sm md:text-base font-semibold text-white truncate">{{ track.track_name }}</h4>
            <p class="text-xs md:text-sm text-zinc-400 truncate">{{ track.artist }}</p>
          </div>
          <button class="absolute bottom-4 right-4 md:bottom-5 md:right-5 w-10 h-10 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-in-out" @click="playTrack(track, tracksByGenre)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
              <path d="M6 3.5L18 12L6 20.5V3.5Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useMusicStore } from '@/stores/useMusicStore.js';

export default {
  name: 'HelloWorld',
  data() {
    return {
      tracks: [],
      groupedTracks: {},
      observer: null,
    };
  },
  setup() {
    const musicStore = useMusicStore();
    return { musicStore };
  },
  computed: {
    displayedTracks() {
      if (this.musicStore.searchResults) {
        return { 'Search Results': this.musicStore.searchResults };
      } else {
        return this.groupedTracks;
      }
    }
  },
  watch: {
    displayedTracks: {
      handler() {
        this.$nextTick(() => {
          this.setupLazyLoad();
        });
      },
      deep: true
    }
  },
  async mounted() {
    try {
      const response = await axios.get(`${this.musicStore.BASE_URL}/api/v1/genres`);
      this.tracks = response.data;
      this.groupTracksByGenre();
      
      this.$nextTick(() => {
        this.setupLazyLoad();
      });
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  },
  methods: {
    groupTracksByGenre() {
      const grouped = {};
      this.tracks.forEach(track => {
        if (!grouped[track.genre]) {
          grouped[track.genre] = [];
        }
        grouped[track.genre].push(track);
      });
      this.groupedTracks = grouped;
    },
    playTrack(track, playlist) {
      this.musicStore.playTrack(track, playlist);
    },
    setupLazyLoad() {
      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              this.observer.unobserve(img);
            }
          }
        });
      });

      const images = document.querySelectorAll('.card-image');
      images.forEach(img => {
        this.observer.observe(img);
      });
    },
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
};
</script>