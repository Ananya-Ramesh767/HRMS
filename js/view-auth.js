/* ============================= AUTH VIEWS ============================= */
function AuthShell(title, sub, formHtml){
  return `
  <div class="min-h-screen grid lg:grid-cols-12 bg-slate-900 text-slate-100 overflow-hidden font-sans relative">
    <!-- Playful Background Gradient Blobs -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Left Brand Hero Column -->
    <div class="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 lg:p-16 relative border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
      <!-- Brand Header -->
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-white font-display font-extrabold text-xl shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
          OI
        </div>
        <div>
          <span class="font-display font-extrabold text-2xl text-white tracking-tight">Odoo India</span>
          <span class="text-xs text-indigo-400 font-semibold block tracking-wider uppercase">Dayflow HRMS</span>
        </div>
      </div>

      <!-- Center Hero Message & Floating Playful Cards -->
      <div class="my-auto py-10 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6">
          <span>🚀</span>
          <span>Next-Gen Employee Experience</span>
        </div>
        <h1 class="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
          Your workday, <br/>
          <span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">smooth & playful.</span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed mb-8">
          Check in with one click, request leaves with instant approvals, view clear payslips, and keep your career profile glowing.
        </p>

        <!-- Floating Feature Pills -->
        <div class="grid grid-cols-2 gap-3.5 pt-2">
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">⚡</div>
            <div>
              <p class="text-xs font-bold text-white">Instant Check-in</p>
              <p class="text-[11px] text-slate-400">Timer & break tracker</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div class="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">🌴</div>
            <div>
              <p class="text-xs font-bold text-white">Smart Leave Hub</p>
              <p class="text-[11px] text-slate-400">Balances & quick remarks</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">💳</div>
            <div>
              <p class="text-xs font-bold text-white">Transparent Payroll</p>
              <p class="text-[11px] text-slate-400">Full statutory breakdown</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">🎯</div>
            <div>
              <p class="text-xs font-bold text-white">Rich Profiles</p>
              <p class="text-[11px] text-slate-400">Skills, loves & hobbies</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
        <span>Odoo India — Bangalore HQ</span>
        <span>Version 4.0 · Modernized</span>
      </div>
    </div>

    <!-- Right Auth Form Column -->
    <div class="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-900/90 lg:bg-transparent">
      <div class="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-2xl text-slate-900 border border-slate-100">
        <!-- Mobile Brand Header -->
        <div class="lg:hidden flex items-center gap-2.5 mb-6">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-display font-extrabold text-base">
            OI
          </div>
          <div>
            <span class="font-display font-extrabold text-lg text-ink">Odoo India</span>
            <span class="text-[10px] text-indigo-600 font-bold block uppercase">Dayflow HRMS</span>
          </div>
        </div>

        <h2 class="font-display text-2xl font-extrabold text-ink tracking-tight mb-1.5">${title}</h2>
        <p class="text-xs text-slate-500 mb-6">${sub}</p>

        ${formHtml}
      </div>
    </div>
  </div>`;
}

function viewLogin(state){
  const body = `
    <form id="login-form" novalidate>
      ${errorBox(state.error)}
      <div class="mb-4">
        <label for="f-ident" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          Email or Login ID
        </label>
        <input id="f-ident" class="${inputCls}" placeholder="e.g. hr@odooindia.com or OIANSH20210001" value="${esc(state.ident||'')}" required autocomplete="username">
        <p class="text-[11px] text-slate-400 mt-1">You can enter either your work email or your system Login ID.</p>
      </div>

      <div class="mb-5">
        <div class="flex items-center justify-between mb-1.5">
          <label for="f-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Password
          </label>
          <span class="text-[11px] text-indigo-600 font-semibold">Demo: Admin@123 / Emp@123</span>
        </div>
        <input id="f-password" type="password" class="${inputCls}" placeholder="••••••••" required autocomplete="current-password">
      </div>

      <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-indigo-500/25 transition-all transform active:scale-98">
        Sign In to Workday →
      </button>
    </form>

    <div class="mt-5 text-center">
      <p class="text-xs text-slate-500">
        New employee? <a href="#/signup" class="text-indigo-600 font-bold hover:underline">Create Account / Onboard</a>
      </p>
    </div>

    <!-- Quick 1-Click Demo Logins -->
    <div class="mt-6 pt-5 border-t border-slate-100">
      <div class="flex items-center justify-between mb-2.5">
        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">⚡ 1-Click Demo Logins</p>
        <button id="auth-reset-db-btn" class="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 transition" title="Clean and re-seed database">
          🔄 Reset Demo Data
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <button type="button" data-demo="hr" class="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-left transition flex items-center gap-2">
          <span class="text-base">👩‍💼</span>
          <div class="min-w-0">
            <p class="font-bold text-purple-900 truncate">HR Manager</p>
            <p class="text-[10px] text-purple-600 truncate">Ananya Sharma</p>
          </div>
        </button>

        <button type="button" data-demo="dev" class="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-left transition flex items-center gap-2">
          <span class="text-base">👨‍💻</span>
          <div class="min-w-0">
            <p class="font-bold text-indigo-900 truncate">Engineer</p>
            <p class="text-[10px] text-indigo-600 truncate">Rahul Verma</p>
          </div>
        </button>

        <button type="button" data-demo="design" class="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-left transition flex items-center gap-2">
          <span class="text-base">🎨</span>
          <div class="min-w-0">
            <p class="font-bold text-emerald-900 truncate">UI Designer</p>
            <p class="text-[10px] text-emerald-600 truncate">Priya Nair</p>
          </div>
        </button>

        <button type="button" data-demo="sales" class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-left transition flex items-center gap-2">
          <span class="text-base">💼</span>
          <div class="min-w-0">
            <p class="font-bold text-amber-900 truncate">Sales Lead</p>
            <p class="text-[10px] text-amber-600 truncate">Karthik Iyer</p>
          </div>
        </button>
      </div>
    </div>`;

  return AuthShell('Welcome back!', 'Sign in to access your Odoo India workspace.', body);
}

function bindLogin(){
  const form = $('#login-form');
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ident = $('#f-ident').value.trim();
      const password = $('#f-password').value;
      const res = login(ident, password);
      if(!res.ok){
        APP.authError = res.error;
        APP.authIdent = ident;
        render();
        return;
      }
      APP.authError = null;
      APP.authIdent = null;
      toast('Signed in successfully — Welcome!', 'success');
      playChime('success');
      navigate('#/dashboard');
    });
  }

  // Quick 1-click Demo Logins
  $$('[data-demo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-demo');
      const creds = {
        hr:     { ident: 'hr@odooindia.com', pass: 'Admin@123' },
        dev:    { ident: 'rahul.verma@odooindia.com', pass: 'Emp@123' },
        design: { ident: 'priya.nair@odooindia.com', pass: 'Emp@123' },
        sales:  { ident: 'karthik.iyer@odooindia.com', pass: 'Emp@123' },
      };
      const c = creds[type];
      if(c){
        const res = login(c.ident, c.pass);
        if(res.ok){
          APP.authError = null;
          toast(`Logged in as ${type.toUpperCase()}`, 'success');
          playChime('success');
          navigate('#/dashboard');
        } else {
          // If credentials fail, reset db and retry
          resetDatabase();
          login(c.ident, c.pass);
          navigate('#/dashboard');
        }
      }
    });
  });

  const resetBtn = $('#auth-reset-db-btn');
  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      resetDatabase();
      toast('Demo database refreshed to defaults!', 'success');
      playChime('success');
      render();
    });
  }
}

function viewSignup(state){
  const body = `
    <form id="signup-form" novalidate class="space-y-3.5">
      ${errorBox(state.error)}
      
      <div>
        <label for="f-name" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Full Name *
        </label>
        <input id="f-name" class="${inputCls}" placeholder="e.g. Sameer Kulkarni" required>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="f-email" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Work Email *
          </label>
          <input id="f-email" type="email" class="${inputCls}" placeholder="sameer@odooindia.com" required>
        </div>
        <div>
          <label for="f-phone" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Mobile Number *
          </label>
          <input id="f-phone" class="${inputCls}" placeholder="9876543210" required>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="f-dob" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Date of Birth
          </label>
          <input id="f-dob" type="date" class="${inputCls}" value="1998-05-20">
        </div>
        <div>
          <label for="f-gender" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Gender
          </label>
          <select id="f-gender" class="${inputCls}">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say" selected>Prefer not to say</option>
          </select>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="f-bank" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Bank Name
          </label>
          <input id="f-bank" class="${inputCls}" placeholder="HDFC Bank / ICICI / SBI" value="HDFC Bank">
        </div>
        <div>
          <label for="f-acc" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Account Number
          </label>
          <input id="f-acc" class="${inputCls}" placeholder="50100293841029">
        </div>
      </div>

      <div>
        <label for="f-loves" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          What I love about my job (Optional)
        </label>
        <input id="f-loves" class="${inputCls}" placeholder="e.g. Building fast UI, solving tricky problems, great teammates">
      </div>

      <div>
        <label for="f-hobbies" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          Interests & Hobbies (Optional)
        </label>
        <input id="f-hobbies" class="${inputCls}" placeholder="e.g. Badminton, photography, trekking, coffee">
      </div>

      <div class="grid sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label for="f-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Password *
          </label>
          <input id="f-password" type="password" class="${inputCls}" placeholder="Min. 6 chars" required>
        </div>
        <div>
          <label for="f-confirm" class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Confirm Password *
          </label>
          <input id="f-confirm" type="password" class="${inputCls}" placeholder="Repeat password" required>
        </div>
      </div>

      <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-indigo-500/25 transition-all transform active:scale-98 mt-2">
        Complete Registration & Join Odoo India →
      </button>
    </form>

    <div class="mt-4 text-center">
      <p class="text-xs text-slate-500">
        Already have an account? <a href="#/login" class="text-indigo-600 font-bold hover:underline">Sign In</a>
      </p>
    </div>
    
    <div class="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed">
      ✨ <strong>Auto Login ID Generation:</strong> Your Login ID will be formatted as <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">OI[FL]YYYY####</code> (e.g. <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">OIJODO20220001</code>).
    </div>`;

  return AuthShell('Create Your Account', 'Join Odoo India to access your personal workday portal.', body);
}

function bindSignup(){
  const form = $('#signup-form');
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const payload = {
        name: $('#f-name').value,
        email: $('#f-email').value,
        phone: $('#f-phone').value,
        dob: $('#f-dob')?.value,
        gender: $('#f-gender')?.value,
        bankName: $('#f-bank')?.value,
        accountNumber: $('#f-acc')?.value,
        loves: $('#f-loves')?.value,
        hobbies: $('#f-hobbies')?.value,
        password: $('#f-password').value,
        confirm: $('#f-confirm').value,
      };

      const res = signup(payload);
      if(!res.ok){
        APP.authError = res.error;
        render();
        return;
      }

      APP.authError = null;
      launchConfetti();
      playChime('success');
      toast(`Welcome to Odoo India! Your Login ID is ${res.employee.empCode}`, 'success');
      navigate('#/dashboard');
    });
  }
}
