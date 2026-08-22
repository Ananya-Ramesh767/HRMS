/* ============================= SHARED UI ============================= */
function Badge(status){
  const map = {
    Pending:     'bg-amber-50 text-amber-700 border border-amber-200/80',
    Approved:    'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Rejected:    'bg-rose-50 text-rose-700 border border-rose-200/80',
    Present:     'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Absent:      'bg-amber-50 text-amber-700 border border-amber-200/80',
    'On Leave':  'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    Active:      'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Expired:     'bg-rose-50 text-rose-700 border border-rose-200/80',
    'In Progress':'bg-blue-50 text-blue-700 border border-blue-200/80',
  };
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]||'bg-slate-100 text-slate-700'}">${status}</span>`;
}

function StatCard({ label, value, sub, iconName, accent='primary', badgeText='', trend='' }){
  const accentGradients = {
    primary: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600 border-indigo-100',
    success: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-100',
    warning: 'from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-100',
    danger:  'from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-100',
    accent:  'from-purple-500/10 to-purple-500/5 text-purple-600 border-purple-100',
    teal:    'from-teal-500/10 to-teal-500/5 text-teal-600 border-teal-100',
  };

  const accentIcons = {
    primary: 'bg-indigo-600 text-white shadow-indigo-500/25',
    success: 'bg-emerald-600 text-white shadow-emerald-500/25',
    warning: 'bg-amber-500 text-white shadow-amber-500/25',
    danger:  'bg-rose-600 text-white shadow-rose-500/25',
    accent:  'bg-purple-600 text-white shadow-purple-500/25',
    teal:    'bg-teal-600 text-white shadow-teal-500/25',
  };

  return `
  <div class="bg-white rounded-2xl shadow-card border border-slate-100/80 p-5 flex items-start justify-between relative overflow-hidden card-pop group">
    <div class="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${accentGradients[accent]||accentGradients.primary} pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
    <div class="relative z-10">
      <div class="flex items-center gap-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${label}</p>
        ${badgeText ? `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">${badgeText}</span>` : ''}
      </div>
      <p class="text-2xl font-display font-extrabold text-ink mt-2 tracking-tight">${value}</p>
      ${sub ? `<p class="text-xs text-slate-400 mt-1.5 flex items-center gap-1">${trend ? `<span class="text-emerald-600 font-bold">${trend}</span> · ` : ''}${sub}</p>` : ''}
    </div>
    <div class="w-11 h-11 rounded-2xl ${accentIcons[accent]||accentIcons.primary} shadow-md flex items-center justify-center shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 relative z-10">
      ${icon(iconName,'w-5 h-5')}
    </div>
  </div>`;
}

function EmptyState(title, sub, actionHtml=''){
  return `
  <div class="flex flex-col items-center justify-center text-center py-12 px-6">
    <div class="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3 shadow-inner">
      ${icon('sparkles','w-7 h-7')}
    </div>
    <p class="font-display font-bold text-ink text-base">${title}</p>
    <p class="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">${sub}</p>
    ${actionHtml ? `<div class="mt-4">${actionHtml}</div>` : ''}
  </div>`;
}

function Avatar(empOrName, size=10, showStatus=false){
  const isObj = typeof empOrName === 'object' && empOrName !== null;
  const name = isObj ? empOrName.name : String(empOrName||'User');
  const photo = isObj ? photoUrlFor(empOrName) : '';
  const sizePx = size * 4;
  const statusHtml = showStatus && isObj ? `<span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${employeeStatusColor(employeeStatusToday(empOrName.id))}"></span>` : '';

  if(photo){
    return `
    <div class="relative inline-block shrink-0" style="width:${sizePx}px; height:${sizePx}px;">
      <img src="${photo}" alt="${esc(name)}" class="w-full h-full rounded-2xl object-cover shadow-sm ring-2 ring-slate-100" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div style="background:${avatarColor(name)}; display:none;" class="w-full h-full rounded-2xl items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-slate-100">${initials(name)}</div>
      ${statusHtml}
    </div>`;
  }

  return `
  <div class="relative inline-block shrink-0" style="width:${sizePx}px; height:${sizePx}px;">
    <div style="background:${avatarColor(name)}" class="w-full h-full rounded-2xl flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-slate-100">${initials(name)}</div>
    ${statusHtml}
  </div>`;
}

function employeeStatusColor(st){
  const map = {
    present: 'bg-emerald-500',
    break: 'bg-amber-500 animate-pulse',
    'checked-out': 'bg-slate-400',
    leave: 'bg-indigo-500',
    absent: 'bg-slate-300'
  };
  return map[st] || 'bg-slate-300';
}

function statusDot(st){
  const map = {
    present: { bg:'bg-emerald-500', label:'Checked In', text:'text-emerald-700', badge:'bg-emerald-50 border-emerald-200' },
    break: { bg:'bg-amber-500 animate-ping', label:'On Break', text:'text-amber-700', badge:'bg-amber-50 border-amber-200' },
    'checked-out': { bg:'bg-slate-400', label:'Checked Out', text:'text-slate-600', badge:'bg-slate-50 border-slate-200' },
    leave: { bg:'bg-indigo-500', label:'On Leave', text:'text-indigo-700', badge:'bg-indigo-50 border-indigo-200' },
    absent: { bg:'bg-slate-300', label:'Not Checked In', text:'text-slate-500', badge:'bg-slate-50 border-slate-200' },
  };
  const cfg = map[st] || map.absent;
  return `
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge} ${cfg.text}">
    <span class="w-2 h-2 rounded-full ${cfg.bg}"></span>
    ${cfg.label}
  </span>`;
}

function Modal(title, bodyHtml, id='modal', maxWidth='max-w-xl'){
  return `
  <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" data-close-modal></div>
    <div class="relative bg-white w-full ${maxWidth} rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto transform scale-100 transition-all">
      <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <h3 class="font-display font-extrabold text-xl text-ink flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
          ${title}
        </h3>
        <button data-close-modal class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-ink flex items-center justify-center transition" title="Close">${icon('x','w-4 h-4')}</button>
      </div>
      ${bodyHtml}
    </div>
  </div>`;
}

function closeModal(){
  const m = $('#modal-root');
  if(m) m.innerHTML = '';
}

function openModal(html){
  const root = $('#modal-root');
  if(!root) return;
  root.innerHTML = html;
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
}

function field(label, inputHtml, id, helpText=''){
  return `
  <div class="mb-4">
    <label for="${id}" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">${label}</label>
    ${inputHtml}
    ${helpText ? `<p class="text-xs text-slate-400 mt-1">${helpText}</p>` : ''}
  </div>`;
}

const inputCls = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition outline-none";

function errorBox(msg){
  return msg ? `<div class="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl px-4 py-3 flex items-center gap-2"><span>⚠️</span><div>${esc(msg)}</div></div>` : '';
}
