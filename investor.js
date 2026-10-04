(() => {
  const form = document.getElementById('investor-form');
  if (!form) return;
  const panel = document.getElementById('investors');
  const reveal = () => {
    if (window.location.hash === '#investors') panel.open = true;
  };
  window.addEventListener('hashchange', reveal);
  reveal();
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const email = (window.SFM_CONFIG && window.SFM_CONFIG.email) || 'sourfacemusic@gmail.com';
    const subject = 'Anime Underground — investor inquiry';
    const body = `Name: ${data.get('name')}\nReply email: ${data.get('email')}\nProject: Anime Underground / SOURFACEMUSIC\n\n${data.get('message')}`;
    form.querySelector('[role="status"]').textContent = 'Your email draft is ready. Send it from your email app to finish.';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
