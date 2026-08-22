/* ============================= NOTIFICATIONS ============================= */
function viewNotifications(user){
  const notifs = getNotifications(user.id);
  return `
  <div class="flex items-center justify-between flex-wrap gap-3 mb-6">
    <div><h1 class="font-display text-2xl font-bold text-ink">Notifications</h1><p class="text-sm text-gray-500 mt-1">Stay on top of requests and updates.</p></div>
    ${notifs.some(n=>!n.read) ? `<button id="mark-all-read" class="text-xs font-semibold text-primary">Mark all as read</button>`:''}
  </div>
  <div class="bg-white rounded-2xl shadow-card divide-y divide-gray-50">
    ${notifs.length ? notifs.map(n=>`
      <a href="${n.link}" data-ntf-id="${n.id}" class="flex items-start gap-3 p-4 hover:bg-paper transition ${!n.read?'bg-primary-light/30':''}">
        <div class="w-2 h-2 rounded-full mt-2 shrink-0 ${n.read?'bg-gray-200':'bg-primary'}"></div>
        <div class="flex-1 min-w-0"><p class="text-sm text-ink">${esc(n.message)}</p><p class="text-xs text-gray-400 mt-1">${new Date(n.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</p></div>
      </a>`).join('') : `<div class="p-2">${EmptyState('No notifications', 'You will see updates about leave and attendance here.')}</div>`}
  </div>`;
}
function bindNotifications(user){
  const btn = $('#mark-all-read');
  if(btn) btn.addEventListener('click', ()=>{ markAllRead(user.id); render(); });
  $$('[data-ntf-id]').forEach(a => a.addEventListener('click', ()=> markRead(a.getAttribute('data-ntf-id'))));
}
