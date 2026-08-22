/* ============================= UTILITIES ============================= */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
const uid = (p='id') => p + '_' + Math.random().toString(36).slice(2,9);
const pad = n => String(n).padStart(2,'0');
const pad4 = n => String(n).padStart(4,'0');
const toDateStr = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayStr = () => toDateStr(new Date());
const fmtDateLong = s => { if(!s) return '—'; const d=new Date(s+'T00:00:00'); return isNaN(d) ? s : d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); };
const fmtDay = s => { if(!s) return ''; const d=new Date(s+'T00:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('en-IN',{weekday:'short'}); };
const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '—';
const fmtMoney = n => '₹' + Math.round(Number(n)||0).toLocaleString('en-IN');
const esc = s => (s==null?'':String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials = name => (name||'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('') || 'OI';
const AVATAR_COLORS = ['#4F46E5','#059669','#D97706','#7C3AED','#0284C7','#DB2777','#E11D48'];
const avatarColor = seed => AVATAR_COLORS[Math.abs([...String(seed||'OI')].reduce((a,c)=>a+c.charCodeAt(0),0)) % AVATAR_COLORS.length];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[0-9+() -]{7,15}$/;

const fmtDuration = ms => {
  if(!ms || ms<=0) return '0m';
  const totalMin = Math.round(ms/60000);
  const h=Math.floor(totalMin/60), m=totalMin%60;
  return h>0 ? `${h}h ${m}m` : `${m}m`;
};

function photoUrlFor(emp){
  if(!emp) return '';
  if(emp.photoUrl) return emp.photoUrl;
  const seed = encodeURIComponent(emp.photoSeed || emp.name || 'User');
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=EEF2FF,ECFDF5,FFFBEB,FDF2F8,F5F3FF`;
}

function readFileAsDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function toast(msg, type='default'){
  const root = $('#toast-root');
  if(!root) return;
  const colors = {
    default: 'bg-slate-900 text-white border border-slate-700/60 shadow-xl shadow-slate-900/20',
    success: 'bg-emerald-600 text-white border border-emerald-500 shadow-xl shadow-emerald-600/20',
    danger:  'bg-rose-600 text-white border border-rose-500 shadow-xl shadow-rose-600/20',
    info:    'bg-indigo-600 text-white border border-indigo-500 shadow-xl shadow-indigo-600/20',
    warning: 'bg-amber-600 text-white border border-amber-500 shadow-xl shadow-amber-600/20'
  };
  const icons = {
    default: '✨',
    success: '🎉',
    danger:  '⚠️',
    info:    '💡',
    warning: '⚡'
  };
  const el = document.createElement('div');
  el.className = `toast-enter ${colors[type]||colors.default} px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 max-w-sm backdrop-blur-md transition-all duration-300 transform`;
  el.innerHTML = `<span>${icons[type]||'✨'}</span><div class="flex-1">${esc(msg)}</div>`;
  root.appendChild(el);
  setTimeout(()=>{
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px) scale(0.95)';
    setTimeout(()=> el.remove(), 300);
  }, 3500);
}

function navigate(hash){ location.hash = hash; }

/* ---- Playful Canvas Confetti Engine ---- */
function launchConfetti(originX = 0.5, originY = 0.5){
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);

  const colors = ['#6366F1','#EC4899','#10B981','#F59E0B','#3B82F6','#8B5CF6','#F43F5E'];
  const particles = [];
  const count = 75;
  for(let i=0; i<count; i++){
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 12;
    particles.push({
      x: w * originX,
      y: h * originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.35,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  let start = null;
  function animate(ts){
    if(!start) start = ts;
    const progress = (ts - start) / 2200;
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rSpeed;
      p.opacity = Math.max(0, 1 - progress);
      if(p.opacity > 0) alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      if(p.shape === 'rect'){
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size/2, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    });

    if(alive && progress < 1){
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(animate);
}

/* ---- Audio Chimes via Web Audio API ---- */
function playChime(type='success'){
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if(type === 'success'){
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if(type === 'click'){
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch(e){ /* ignore audio permission issues */ }
}

/* ---- Profile Completeness Calculator ---- */
function calcProfileCompleteness(emp){
  if(!emp) return 0;
  const checks = [
    Boolean(emp.name),
    Boolean(emp.email),
    Boolean(emp.phone),
    Boolean(emp.dob),
    Boolean(emp.gender),
    Boolean(emp.nationality),
    Boolean(emp.residingAddress),
    Boolean(emp.panNo),
    Boolean(emp.bank?.accountNumber && emp.bank?.bankName),
    Boolean(emp.about && emp.about.length > 5),
    Boolean(emp.loves && emp.loves.length > 3),
    Boolean(emp.hobbies && emp.hobbies.length > 3),
    Boolean(emp.skills && emp.skills.length > 0),
  ];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}
