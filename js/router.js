/* ============================= ROUTER / BOOTSTRAP ============================= */
const APP = { authError: null, attMonthOffset: 0 };
const HR_ONLY = ['#/employees', '#/analytics'];

function render(){
  const root = $('#root');
  let hash = location.hash || '#/login';
  const user = currentUser();

  if(['#/login','#/signup'].includes(hash)){
    if(user){ location.hash = '#/dashboard'; return; }
    if(hash === '#/signup'){ root.innerHTML = viewSignup({ error: APP.authError }); bindSignup(); }
    else { root.innerHTML = viewLogin({ error: APP.authError }); bindLogin(); }
    return;
  }

  if(!user){ location.hash = '#/login'; return; }

  if(HR_ONLY.includes(hash) && user.role !== 'hr'){ hash = '#/dashboard'; location.hash = hash; return; }
  if(hash !== '#/profile') APP.viewingEmployeeId = null; // clear "viewing someone else" context when leaving profile

  let content = '', bind = null;
  switch(hash){
    case '#/dashboard':
      content = user.role==='hr' ? viewHRDashboard(user) : viewEmployeeDashboard(user);
      bind = () => user.role==='hr' ? null : bindEmployeeDashboard(user);
      break;
    case '#/attendance':
      content = viewAttendance(user); bind = () => bindAttendance(user); break;
    case '#/leave':
      content = viewLeave(user); bind = () => bindLeave(user); break;
    case '#/payroll':
      content = viewPayroll(user); bind = () => bindPayroll(user); break;
    case '#/profile':
      content = viewProfile(user); bind = () => bindProfile(user); break;
    case '#/employees':
      content = viewEmployees(); bind = bindEmployees; break;
    case '#/analytics':
      content = viewAnalytics(); break;
    case '#/notifications':
      content = viewNotifications(user); bind = () => bindNotifications(user); break;
    default:
      location.hash = '#/dashboard'; return;
  }

  root.innerHTML = `<div data-view="${hash}">${Shell(user, hash, content)}</div>`;
  bindShell();
  if(bind) bind();
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => { getDB(); render(); });
