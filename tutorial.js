// Local PDF path (uploaded file)
const specPath = '/mnt/data/5CS045_Full Stack Development_Week02.pdf';
document.getElementById('openSpec').addEventListener('click', () => {
  window.open(specPath, '_blank');
});

// Smooth scroll (no <a> tags)
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Open project (JS only)
function openProject(url) {
  if (!url) return;
  // open same tab; change to window.open(url,'_blank') to open new tab
  window.location.href = url;
}

// Back to top
const backTop = document.getElementById('backTop');
function handleBackTop() {
  backTop.style.display = window.scrollY > 300 ? 'block' : 'none';
}
window.addEventListener('scroll', handleBackTop);
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('pf-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});
(function() {
  const t = localStorage.getItem('pf-theme');
  if (t === 'dark') document.documentElement.classList.add('dark');
})();

// Skills animation
const skillTracks = document.querySelectorAll('.skill-track');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const val = entry.target.getAttribute('data-value') || 0;
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) fill.style.width = val + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  skillTracks.forEach(t => obs.observe(t));
} else {
  skillTracks.forEach(t => {
    const val = t.getAttribute('data-value') || 0;
    const fill = t.querySelector('.skill-fill');
    if (fill) fill.style.width = val + '%';
  });
}

// Contact form handling (validate + localStorage + details view)
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const detailsCard = document.getElementById('detailsCard');
const detailsContent = document.getElementById('detailsContent');

function resetFeedback() { feedback.textContent = ''; }

form.addEventListener('submit', (e) => {
  e.preventDefault();
  feedback.style.color = '';
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const message = document.getElementById('cmessage').value.trim();

  if (name.length < 2) { feedback.style.color='crimson'; feedback.textContent='Name must be at least 2 characters.'; return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { feedback.style.color='crimson'; feedback.textContent='Please enter a valid email.'; return; }
  if (message.length < 5) { feedback.style.color='crimson'; feedback.textContent='Message must be at least 5 characters.'; return; }

  const payload = { name, email, message, savedAt: Date.now() };
  localStorage.setItem('pf-contact', JSON.stringify(payload));
  feedback.style.color='green'; feedback.textContent='Saved locally — showing details...';

  setTimeout(() => showDetailsFromStorage(), 600);
});

function showDetailsFromStorage() {
  const raw = localStorage.getItem('pf-contact');
  if (!raw) return;
  try {
    const obj = JSON.parse(raw);
    detailsContent.innerHTML = `<strong>Name:</strong> ${escapeHtml(obj.name)}<br>
      <strong>Email:</strong> ${escapeHtml(obj.email)}<br>
      <strong>Message:</strong><div style="margin-top:6px">${escapeHtml(obj.message)}</div>
      <div style="margin-top:8px"><em>Saved: ${new Date(obj.savedAt).toLocaleString()}</em></div>`;
    detailsCard.style.display = 'block';
    form.style.display = 'none';
    window.scrollTo({ top: detailsCard.offsetTop - 80, behavior: 'smooth' });
  } catch (e) { console.error(e); }
}

function clearContact() {
  localStorage.removeItem('pf-contact');
  detailsContent.innerHTML = '<em>Stored contact cleared.</em>';
}

function showForm() {
  detailsCard.style.display = 'none';
  form.style.display = 'block';
  resetFeedback();
}

function escapeHtml(s) { return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

// Canvas drawing
function drawCanvas() {
  const canvas = document.getElementById('demoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const g = ctx.createLinearGradient(0,0,canvas.width,0);
  g.addColorStop(0, '#AF4F2E'); g.addColorStop(1, '#E9B48A');
  ctx.fillStyle = g; ctx.fillRect(8,8,canvas.width-16,canvas.height-16);
  ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 26,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#2A1713'; ctx.font = '14px sans-serif'; ctx.fillText('Canvas Demo', canvas.width/2 - 40, canvas.height/2 + 6);
}

// Slider
const slides = document.getElementById('slides');
let slideIndex = 0;
function updateSlider(){
  if(!slides) return;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}
function nextSlide(){ if(!slides) return; slideIndex = (slideIndex + 1) % slides.children.length; updateSlider(); }
function prevSlide(){ if(!slides) return; slideIndex = (slideIndex - 1 + slides.children.length) % slides.children.length; updateSlider(); }
setInterval(()=> { if(slides && slides.children.length) nextSlide(); }, 4000);
window.addEventListener('load', ()=> {
  if(slides) for(let i=0;i<slides.children.length;i++) slides.children[i].style.minWidth = '100%';
  updateSlider();
});

// keyboard accessibility
document.querySelectorAll('.nav-list li, .project').forEach(el => {
  el.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') el.click(); });
});
