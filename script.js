const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

if (!document.querySelector('link[href="playlist.css"]')) {
  const playlistStyles = document.createElement('link');
  playlistStyles.rel = 'stylesheet';
  playlistStyles.href = 'playlist.css';
  document.head.appendChild(playlistStyles);
}

const tracks = [
  {
    title: 'HOODLUM',
    meta: 'prod by SOURFACEMUSIC • 0:26',
    src: 'assets/audio/hoodlum-prod-by-sourfacemusic.mp3'
  }
];

const player = document.getElementById('music-player');
const trackTitle = document.getElementById('track-title');
const trackMeta = document.getElementById('track-meta');
const trackCount = document.getElementById('track-count');
const trackList = document.getElementById('track-list');
const playButton = document.getElementById('playlist-play');
const nextButton = document.getElementById('playlist-next');
const musicNavLink = document.getElementById('music-nav-link');
const heroMusicLink = document.getElementById('hero-music-link');
let currentTrack = 0;

function loadTrack(index, shouldPlay = false) {
  if (!player || !tracks.length) return;
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];
  player.src = track.src;
  if (trackTitle) trackTitle.textContent = track.title;
  if (trackMeta) trackMeta.textContent = track.meta;
  if (trackCount) trackCount.textContent = `${currentTrack + 1} / ${tracks.length}`;
  document.querySelectorAll('.track-button').forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === currentTrack);
  });
  if (shouldPlay) {
    player.play().catch(() => {
      if (playButton) playButton.textContent = 'Tap to play';
    });
  }
}

function startPlaylist() {
  loadTrack(currentTrack, true);
}

function nextTrack(shouldPlay = true) {
  loadTrack(currentTrack + 1, shouldPlay);
}

if (trackList && tracks.length) {
  tracks.forEach((track, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'track-button';
    button.innerHTML = `<strong>${track.title}</strong><span>${track.meta}</span>`;
    button.addEventListener('click', () => loadTrack(index, true));
    trackList.appendChild(button);
  });
}

if (player) {
  loadTrack(0, false);
  player.addEventListener('play', () => {
    if (playButton) playButton.textContent = 'Playing';
  });
  player.addEventListener('pause', () => {
    if (playButton) playButton.textContent = 'Play playlist';
  });
  player.addEventListener('ended', () => nextTrack(true));
}

if (playButton) playButton.addEventListener('click', startPlaylist);
if (nextButton) nextButton.addEventListener('click', () => nextTrack(true));
if (musicNavLink) musicNavLink.addEventListener('click', () => setTimeout(startPlaylist, 350));
if (heroMusicLink) heroMusicLink.addEventListener('click', () => setTimeout(startPlaylist, 350));
