/* ============================= SHARED UI ============================= */
function Badge(status){
  const map = {
    Pending:'bg-warning-light text-warning', Approved:'bg-success-light text-success', Rejected:'bg-danger-light text-danger',
    Present:'bg-success-light text-success', Absent:'bg-warning-light text-warning', 'On Leave':'bg-primary-light text-primary',
  };
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]||'bg-gray-100 text-gray-600'}">${status}</span>`;
}
function StatCard({ label, value, sub, iconName, accent='primary' }){
  return `
  <div class="bg-white rounded-2xl shadow-card p-5 flex items-start justify-between">
    <div>
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">${label}</p>
      <p class="text-2xl font-display font-bold text-ink mt-1.5">${value}</p>
      ${sub ? `<p class="text-xs text-gray-400 mt-1">${sub}</p>` : ''}
    </div>
    <div class="w-10 h-10 rounded-xl bg-${accent}-light text-${accent} flex items-center justify-center shrink-0">${icon(iconName,'w-5 h-5')}</div>
  </div>`;
}
function EmptyState(title, sub, actionHtml=''){
  return `<div class="flex flex-col items-center justify-center text-center py-14 px-6">
    <div class="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mb-3">${icon('calendar','w-6 h-6')}</div>
    <p class="font-display font-semibold text-ink">${title}</p>
    <p class="text-sm text-gray-500 mt-1 max-w-sm">${sub}</p>
    ${actionHtml}
  </div>`;
}
function Avatar(name, size=9){
  return `<div style="background:${avatarColor(name)}" class="w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">${initials(name)}</div>`;
}
function Modal(title, bodyHtml, id='modal'){
  return `
  <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-ink/40" data-close-modal></div>
    <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-card p-6 max-h-[88vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-semibold text-lg text-ink">${title}</h3>
        <button data-close-modal class="text-gray-400 hover:text-ink p-1">${icon('x')}</button>
      </div>
      ${bodyHtml}
    </div>
  </div>`;
}
function closeModal(){ const m = $('#modal-root'); if(m) m.innerHTML=''; }
function openModal(html){ $('#modal-root').innerHTML = html; $$('[data-close-modal]').forEach(b=> b.addEventListener('click', closeModal)); }
function field(label, inputHtml, id){
  return `<div class="mb-4"><label for="${id}" class="block text-xs font-semibold text-gray-600 mb-1.5">${label}</label>${inputHtml}</div>`;
}
const inputCls = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder-gray-400 bg-white focus:border-primary";
function errorBox(msg){ return msg ? `<div class="mb-4 bg-danger-light text-danger text-sm rounded-lg px-3.5 py-2.5">${esc(msg)}</div>` : ''; }
