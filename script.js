(() => {
  'use strict';

  const config = window.SFM_CONFIG || {};
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-config-text]').forEach((node) => {
    const key = node.dataset.configText;
    if (key && config[key]) node.textContent = config[key];
  });

  document.querySelectorAll('[data-config-email]').forEach((link) => {
    if (!config.email) return;
    link.href = `mailto:${config.email}`;
    const target = link.querySelector('span');
    if (target) target.textContent = config.email;
    else if (!link.querySelector('strong')) link.textContent = config.email;
  });

  document.querySelectorAll('[data-config-phone]').forEach((link) => {
    if (!config.phoneHref) return;
    link.href = `tel:${config.phoneHref}`;
    const target = link.querySelector('span');
    if (target && config.phoneDisplay) target.textContent = config.phoneDisplay;
    else if (!link.querySelector('strong') && config.phoneDisplay) link.textContent = config.phoneDisplay;
  });

  document.querySelectorAll('[data-config-location]').forEach((node) => {
    if (config.location) node.textContent = config.location;
  });

  document.querySelectorAll('[data-social]').forEach((link) => {
    const network = link.dataset.social;
    if (network && config.socials && config.socials[network]) link.href = config.socials[network];
  });

  const track = (eventName, values = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, values);
  };

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.addEventListener('click', () => track('outbound_link_click', {
      link_url: link.href,
      link_text: link.textContent.trim()
    }));
  });

  document.querySelectorAll('[data-fundraiser-link]').forEach((link) => {
    link.addEventListener('click', () => track('fundraiser_click', {
      page_path: window.location.pathname,
      link_text: link.textContent.trim()
    }));
  });

  document.querySelectorAll('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const originalText = button.textContent;
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
          window.setTimeout(() => { button.textContent = originalText; }, 1800);
        } else {
          window.prompt('Copy this link:', shareData.url);
        }
        track('share', { method: navigator.share ? 'native' : 'copy', content_type: 'link', item_id: shareData.url });
      } catch (error) {
        if (error && error.name !== 'AbortError') console.error('Share failed:', error);
      }
    });
  });

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = button.dataset.copyUrl || window.location.href;
      const status = document.querySelector('.copy-status');
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(url);
        else window.prompt('Copy this link:', url);
        if (status) status.textContent = 'Link copied.';
      } catch (error) {
        console.error('Copy failed:', error);
        if (status) status.textContent = 'Copy failed. Use the address bar instead.';
      }
    });
  });

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }

      const payload = Object.fromEntries(new FormData(bookingForm).entries());
      payload._subject = `SOURFACEMUSIC inquiry from ${payload.artistName || 'website visitor'}`;
      payload._template = 'table';
      payload._captcha = 'false';

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(config.email || 'sourfacemusic@gmail.com')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`FormSubmit returned ${response.status}`);
        bookingForm.reset();
        alert('Your inquiry was sent to SOURFACEMUSIC.');
        track('booking_inquiry', { service_type: payload.helpNeeded || 'unspecified' });
      } catch (error) {
        console.error('Booking form failed:', error);
        const subject = encodeURIComponent(payload._subject);
        const body = encodeURIComponent(`Artist: ${payload.artistName || ''}\nEmail: ${payload.email || ''}\nService: ${payload.helpNeeded || ''}\n\nProject:\n${payload.projectIdea || ''}`);
        window.location.href = `mailto:${config.email || 'sourfacemusic@gmail.com'}?subject=${subject}&body=${body}`;
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }
})();
