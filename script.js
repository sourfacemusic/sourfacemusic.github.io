const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Google Analytics tracking
if (typeof gtag !== 'undefined') {
  gtag('event', 'page_view', {
    'page_path': window.location.pathname,
    'page_title': document.title
  });
}

if (!document.querySelector('link[href="playlist.css"]')) {
  const playlistStyles = document.createElement('link');
  playlistStyles.rel = 'stylesheet';
  playlistStyles.href = 'playlist.css';
  document.head.appendChild(playlistStyles);
}

const tracks = [
  {
    title: 'HOODLUM',
    meta: 'prod by SOURFACEMUSIC • leveled preview • 0:26',
    src: 'assets/audio/hoodlum-prod-by-sourfacemusic.mp3'
  },
  {
    title: 'U ALREADY',
    meta: 'prod by SOURFACEMUSIC • leveled preview • 0:26',
    src: 'assets/audio/u-already-prod-by-sourfacemusic.mp3'
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
  
  // Track audio interaction
  if (typeof gtag !== 'undefined') {
    gtag('event', 'music_track_loaded', {
      'track_title': track.title,
      'track_index': currentTrack + 1
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
    if (typeof gtag !== 'undefined') {
      gtag('event', 'music_played', {
        'track_title': tracks[currentTrack].title
      });
    }
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

// Booking form handling
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const data = {
      artistName: formData.get('artistName'),
      email: formData.get('email'),
      projectIdea: formData.get('projectIdea'),
      deadline: formData.get('deadline'),
      links: formData.get('links'),
      helpNeeded: formData.get('helpNeeded'),
      timestamp: new Date().toISOString()
    };
    
    // Track booking inquiry
    if (typeof gtag !== 'undefined') {
      gtag('event', 'booking_inquiry', {
        'artist_name': data.artistName,
        'service_type': data.helpNeeded
      });
    }
    
    // Send to email via FormSubmit.co (free service)
    try {
      const response = await fetch('https://formsubmit.co/ajax/booking@sourfacemusic.com', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('✅ Booking inquiry sent! We\'ll get back to you soon.');
        bookingForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form error:', error);
      // Fallback to email
      window.location.href = `mailto:booking@sourfacemusic.com?subject=Booking Inquiry from ${encodeURIComponent(data.artistName)}&body=${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    }
  });
}

// Social link tracking
 document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href');
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_link_click', {
        'link_url': href,
        'link_text': link.textContent
      });
    }
  });
});

// Official fundraiser click tracking
 document.querySelectorAll('[data-fundraiser-link]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'fundraiser_click', {
        'page_path': window.location.pathname,
        'link_text': link.textContent.trim()
      });
    }
  });
});

// Native share button with a copy-link fallback
 document.querySelectorAll('[data-share]').forEach(button => {
  button.addEventListener('click', async () => {
    const shareData = {
      title: button.dataset.shareTitle || document.title,
      text: button.dataset.shareText || '',
      url: button.dataset.shareUrl || window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        button.textContent = 'Link copied';
        window.setTimeout(() => {
          button.textContent = 'Share this fundraiser';
        }, 2200);
      } else {
        window.prompt('Copy this fundraiser link:', shareData.url);
      }

      if (typeof gtag !== 'undefined') {
        gtag('event', 'fundraiser_share', {
          'share_url': shareData.url
        });
      }
    } catch (error) {
      if (error && error.name !== 'AbortError') console.error('Share error:', error);
    }
  });
});

// Dedicated copy-link cards
 document.querySelectorAll('[data-copy-url]').forEach(button => {
  button.addEventListener('click', async () => {
    const url = button.dataset.copyUrl || window.location.href;
    const status = document.querySelector('.copy-status');

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        if (status) status.textContent = 'Support-page link copied.';
      } else {
        window.prompt('Copy this fundraiser link:', url);
      }
    } catch (error) {
      console.error('Copy error:', error);
      if (status) status.textContent = 'Copy failed. Select the address from your browser.';
    }
  });
});

// Cookiebot CMP integration for this static GitHub Pages site.
// Keep the Domain Group ID private until it is entered through a controlled update.
(() => {
  const COOKIEBOT_DOMAIN_GROUP_ID = '';
  const validCookiebotId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!validCookiebotId.test(COOKIEBOT_DOMAIN_GROUP_ID)) {
    console.info('Cookiebot CMP files are installed but inactive until a valid Domain Group ID is configured.');
    return;
  }

  if (!document.getElementById('Cookiebot')) {
    const cookiebotScript = document.createElement('script');
    cookiebotScript.id = 'Cookiebot';
    cookiebotScript.src = 'https://consent.cookiebot.com/uc.js';
    cookiebotScript.type = 'text/javascript';
    cookiebotScript.dataset.cbid = COOKIEBOT_DOMAIN_GROUP_ID;
    cookiebotScript.dataset.blockingmode = 'auto';
    document.head.insertBefore(cookiebotScript, document.head.firstChild);
  }

  const addCookieSettingsLink = () => {
    const footer = document.querySelector('.footer p:last-child');
    if (!footer || document.getElementById('cookie-settings-link')) return;

    const separator = document.createTextNode(' · ');
    const link = document.createElement('a');
    link.id = 'cookie-settings-link';
    link.href = '#';
    link.textContent = 'Cookie settings';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.Cookiebot && typeof window.Cookiebot.renew === 'function') {
        window.Cookiebot.renew();
      }
    });

    footer.append(separator, link);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCookieSettingsLink);
  } else {
    addCookieSettingsLink();
  }
})();
