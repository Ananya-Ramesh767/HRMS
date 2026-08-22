/* ============================= AUTH VIEWS ============================= */
function AuthShell(title, sub, formHtml){
  return `
  <div class="min-h-screen grid lg:grid-cols-2">
    <div class="hidden lg:flex flex-col justify-between bg-ink text-white p-12 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image:radial-gradient(circle at 2px 2px, white 1.5px, transparent 0); background-size:26px 26px;"></div>
      <div class="relative flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-ink font-display font-bold">D</div>
        <span class="font-display font-bold text-xl">Dayflow</span>
      </div>
      <div class="relative">
        <div class="h-1 w-16 flow-bar rounded-full mb-6"></div>
        <h1 class="font-display text-4xl font-bold leading-tight mb-4">One place for<br/>your whole workday.</h1>
        <p class="text-white/60 max-w-sm">Check in, request time off, and track payroll — Dayflow keeps every employee and HR workflow moving in sync.</p>
      </div>
      <p class="relative text-xs text-white/40">Built for the Odoo × NMIT Bangalore Hackathon</p>
    </div>
    <div class="flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-sm">
        <div class="lg:hidden flex items-center gap-2.5 mb-8">
          <div class="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white font-display font-bold text-sm">D</div>
          <span class="font-display font-bold text-lg text-ink">Dayflow</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-ink mb-1.5">${title}</h2>
        <p class="text-sm text-gray-500 mb-6">${sub}</p>
        ${formHtml}
      </div>
    </div>
  </div>`;
}
function viewLogin(state){
  const body = `
    <form id="login-form" novalidate>
      ${errorBox(state.error)}
      ${field('Email', `<input id="f-email" type="email" class="${inputCls}" placeholder="you@dayflow.io" value="${esc(state.email||'')}" required>`, 'f-email')}
      ${field('Password', `<input id="f-password" type="password" class="${inputCls}" placeholder="••••••••" required>`, 'f-password')}
      <button class="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg py-2.5 transition">Sign In</button>
    </form>
    <p class="text-sm text-gray-500 mt-5">Don't have an account? <a href="#/signup" class="text-primary font-semibold">Sign Up</a></p>
    <div class="mt-6 bg-primary-light rounded-xl p-4 text-xs text-primary/90 leading-relaxed">
      <p class="font-semibold mb-1">Demo credentials</p>
      HR/Admin — hr@dayflow.io / Admin@123<br/>
      Employee — rahul.verma@dayflow.io / Emp@123
    </div>`;
  return AuthShell('Welcome back', 'Sign in to continue to Dayflow.', body);
}
function bindLogin(){
  $('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#f-email').value, password = $('#f-password').value;
    const res = login(email, password);
    if(!res.ok){ APP.authError = res.error; render(); return; }
    APP.authError = null;
    navigate('#/dashboard');
  });
}
function viewSignup(state){
  const body = `
    <form id="signup-form" novalidate>
      ${errorBox(state.error)}
      ${field('Full Name', `<input id="f-name" class="${inputCls}" placeholder="Jane Doe" required>`, 'f-name')}
      ${field('Email', `<input id="f-email" type="email" class="${inputCls}" placeholder="you@dayflow.io" required>`, 'f-email')}
      ${field('Phone', `<input id="f-phone" class="${inputCls}" placeholder="9876543210" required>`, 'f-phone')}
      ${field('Password', `<input id="f-password" type="password" class="${inputCls}" required>`, 'f-password')}
      ${field('Confirm Password', `<input id="f-confirm" type="password" class="${inputCls}" required>`, 'f-confirm')}
      <button class="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg py-2.5 transition">Sign Up</button>
    </form>
    <p class="text-sm text-gray-500 mt-5">Already have an account? <a href="#/login" class="text-primary font-semibold">Sign In</a></p>
    <p class="text-xs text-gray-400 mt-4">New sign-ups are provisioned as standard Employee accounts. HR/Admin accounts are created by HR from the Employees page.</p>`;
  return AuthShell('Create your account', 'Join Dayflow to manage your workday.', body);
}
function bindSignup(){
  $('#signup-form').addEventListener('submit', e => {
    e.preventDefault();
    const res = signup({
      name: $('#f-name').value, email: $('#f-email').value, phone: $('#f-phone').value,
      password: $('#f-password').value, confirm: $('#f-confirm').value,
    });
    if(!res.ok){ APP.authError = res.error; render(); return; }
    APP.authError = null;
    toast('Account created — welcome to Dayflow!', 'success');
    navigate('#/dashboard');
  });
}
