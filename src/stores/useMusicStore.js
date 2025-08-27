import { defineStore } from 'pinia';
import { Howl } from 'howler';
import axios from 'axios';

export const useMusicStore = defineStore('music', {
  state: () => ({
    sound: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    intervalId: null,
    currentTrack: null,
    searchResults: null,
    playlist: [], 
    currentTrackIndex: -1, 
    // آدرس اصلی بک‌اند را اینجا تعریف کنید
    BASE_URL: 'https://backend-deadpool.kubarcloud.net', 
  }),
  actions: {
    async playTrack(trackData, playlist = []) {
      if (this.sound) {
        this.sound.unload();
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.currentTrack = trackData;
      this.playlist = playlist.length > 0 ? playlist : this.playlist;
      this.currentTrackIndex = this.playlist.findIndex(track => track.track_id === trackData.track_id);
      
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;

      try {
        const query = `${trackData.artist}+${trackData.track_name}`;
        // از متغیر BASE_URL استفاده کنید
        const response = await axios.get(`${this.BASE_URL}/api/v1/get_audio_link`, {
          params: { query_text: query },
        });

        const audioLink = response.data.audio_link;

        this.sound = new Howl({
          src: [audioLink],
          html5: true,
          onload: () => {
            this.duration = this.sound.duration();
          },
          onplay: () => {
            this.isPlaying = true;
            this.intervalId = setInterval(() => {
              this.currentTime = this.sound.seek();
            }, 1000);
          },
          onpause: () => {
            this.isPlaying = false;
            clearInterval(this.intervalId);
          },
          onend: () => {
            this.isPlaying = false;
            clearInterval(this.intervalId);
            this.currentTime = this.duration;
            this.playNextTrack();
          },
        });

        this.sound.play();

      } catch (error) {
        console.error('Error fetching audio link:', error);
      }
    },
    playNextTrack() {
      if (this.currentTrackIndex !== -1 && this.currentTrackIndex < this.playlist.length - 1) {
        const nextTrack = this.playlist[this.currentTrackIndex + 1];
        this.playTrack(nextTrack);
      } else {
        this.sound.stop();
        this.isPlaying = false;
      }
    },
    togglePlayback() {
      if (this.sound && this.sound.state() === 'loaded') {
        if (this.sound.playing()) {
          this.sound.pause();
        } else {
          this.sound.play();
        }
      }
    },
    seek(newTime) {
      if (this.sound && this.sound.state() === 'loaded') {
        this.sound.seek(newTime);
      }
    },
    async searchMusic(query) {
      if (!query.trim()) {
        this.searchResults = null;
        return;
      }
      
      try {
        // از متغیر BASE_URL استفاده کنید
        const response = await axios.get(`${this.BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}`);
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error searching music:', error);
        this.searchResults = null;
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },
  },
});