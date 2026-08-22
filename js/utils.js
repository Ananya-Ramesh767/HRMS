/* ============================= UTILITIES ============================= */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
const uid = (p='id') => p + '_' + Math.random().toString(36).slice(2,9);
const pad = n => String(n).padStart(2,'0');
const toDateStr = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayStr = () => toDateStr(new Date());
const fmtDateLong = s => { const d=new Date(s+'T00:00:00'); return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); };
const fmtDay = s => new Date(s+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short'});
const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '—';
const fmtMoney = n => '₹' + Math.round(n).toLocaleString('en-IN');
const esc = s => (s==null?'':String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials = name => name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
const AVATAR_COLORS = ['#2F5DE3','#3E9C6F','#D98E2B','#8B5CF6','#0EA5A5','#E15252'];
const avatarColor = seed => AVATAR_COLORS[Math.abs([...seed].reduce((a,c)=>a+c.charCodeAt(0),0)) % AVATAR_COLORS.length];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[6-9]\d{9}$/;

function toast(msg, type='default'){
  const root = $('#toast-root');
  const colors = { default:'bg-ink text-white', success:'bg-success text-white', danger:'bg-danger text-white' };
  const el = document.createElement('div');
  el.className = `toast-enter ${colors[type]||colors.default} px-4 py-3 rounded-lg shadow-card text-sm font-medium max-w-xs`;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .25s'; el.style.opacity='0'; setTimeout(()=>el.remove(),250); }, 3000);
}

function navigate(hash){ location.hash = hash; }
