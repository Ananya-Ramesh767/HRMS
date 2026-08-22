/* ============================= NOTIFICATIONS ============================= */
function viewNotifications(user){
  const notifs = getNotifications(user.id);
  const unread = notifs.filter(n => !n.read).length;

  return `
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 class="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
        Notifications
      </h1>
      <p class="text-xs text-slate-500 mt-1">Stay updated on time-off requests, team approvals, and workplace updates.</p>
    </div>
    ${unread > 0 ? `
      <button id="mark-all-read" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition">
        ${icon('check','w-3.5 h-3.5')} Mark All as Read (${unread})
      </button>` : ''}
  </div>

  <div class="bg-white rounded-3xl shadow-card border border-slate-100 divide-y divide-slate-100 overflow-hidden card-pop">
    ${notifs.length ? notifs.map(n => `
      <a href="${n.link}" data-ntf-id="${n.id}" class="flex items-start gap-4 p-5 hover:bg-slate-50 transition ${!n.read ? 'bg-indigo-50/40' : ''}">
        <div class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-indigo-600 animate-pulse'}"></div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-ink leading-snug">${esc(n.message)}</p>
          <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>⏱️</span>
            ${new Date(n.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
          </p>
        </div>
        <span class="text-xs font-bold text-indigo-600 hover:translate-x-0.5 transition-transform">
          View →
        </span>
      </a>`).join('') : `
      <div class="p-8">
        ${EmptyState('No notifications yet', 'You are all caught up! Updates regarding leave approvals and company announcements will show up here.')}
      </div>`}
  </div>`;
}

function bindNotifications(user){
  const btn = $('#mark-all-read');
  if(btn){
    btn.addEventListener('click', () => {
      markAllRead(user.id);
      playChime('click');
      toast('All notifications marked as read', 'info');
      render();
    });
  }

  $$('[data-ntf-id]').forEach(a => {
    a.addEventListener('click', () => {
      markRead(a.getAttribute('data-ntf-id'));
    });
  });
}
