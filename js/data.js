/* ============================= DATA LAYER ============================= */
/* Mock persistence layer standing in for a real backend/API.
   Structured so every mutation goes through a function here — swapping
   this module for real HTTP calls later would not require touching any view code. */
const STORE_KEY = 'dayflow_db_v1';
const SESSION_KEY = 'dayflow_session_v1';
const COMPANY = { name: 'Nimbus Works Pvt Ltd', prefix: 'NW' };

function loadDB(){
  const raw = localStorage.getItem(STORE_KEY);
  if(raw){ try { return JSON.parse(raw); } catch(e){ /* fall through to reseed */ } }
  return seedDB();
}
function saveDB(db){ localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
function getDB(){ if(!window.__db) window.__db = loadDB(); return window.__db; }
function commit(){ saveDB(window.__db); }

function generateEmpCode(db, firstName, lastName, year){
  const initialsPart = (firstName.slice(0,2) + lastName.slice(0,2)).toUpperCase();
  const yearEmployees = db.employees.filter(e => e.empCode && e.empCode.includes(String(year)));
  const serial = pad4(yearEmployees.length + 1);
  return `${COMPANY.prefix}${initialsPart}${year}${serial}`;
}
function pad4(n){ return String(n).padStart(4,'0'); }
function genTempPassword(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = '';
  for(let i=0;i<8;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

function seedDB(){
  const db = { employees: [], credentials: {}, attendance: [], leaves: [], notifications: [], seq: 1 };
  const seedPeople = [
    { first:'Ananya', last:'Sharma', role:'hr', dept:'Human Resources', job:'HR Manager', join:'2021-03-01' },
    { first:'Rahul', last:'Verma', role:'employee', dept:'Engineering', job:'Software Engineer', join:'2022-06-14' },
    { first:'Priya', last:'Nair', role:'employee', dept:'Design', job:'UI/UX Designer', join:'2022-11-02' },
    { first:'Karthik', last:'Iyer', role:'employee', dept:'Sales', job:'Sales Executive', join:'2023-01-19' },
    { first:'Sneha', last:'Reddy', role:'employee', dept:'Finance', job:'Finance Analyst', join:'2023-05-08' },
    { first:'Arjun', last:'Menon', role:'employee', dept:'Support', job:'Support Specialist', join:'2024-02-26' },
  ];
  const locations = ['Bengaluru HQ','Bengaluru HQ','Remote','Bengaluru HQ','Chennai Office','Remote'];
  const passwords = ['Admin@123','Emp@123','Emp@123','Emp@123','Emp@123','Emp@123'];

  seedPeople.forEach((p,idx) => {
    const year = new Date(p.join).getFullYear();
    const empCode = generateEmpCode(db, p.first, p.last, year);
    const id = uid('emp');
    const email = p.role === 'hr' ? 'hr@dayflow.io' : `${p.first.toLowerCase()}.${p.last.toLowerCase()}@dayflow.io`;
    const employee = {
      id, empCode, name: `${p.first} ${p.last}`, email,
      personalEmail: `${p.first.toLowerCase()}${p.last.toLowerCase()}@gmail.com`,
      phone: `9${Math.floor(100000000+Math.random()*899999999)}`.slice(0,10),
      role: p.role, department: p.dept, jobPosition: p.job, manager: p.role==='hr' ? '—' : 'Ananya Sharma',
      company: COMPANY.name, location: locations[idx], dateOfJoining: p.join,
      dob: `${1988+idx}-0${(idx%9)+1}-1${idx}`, gender: idx%2===0?'Female':'Male',
      nationality:'Indian', maritalStatus: idx%3===0?'Married':'Single',
      residingAddress: `${12+idx}, ${['Indiranagar','Koramangala','HSR Layout','Whitefield','JP Nagar','Jayanagar'][idx]}, Bengaluru`,
      bank: { accountNumber: `50100${Math.floor(1000000+Math.random()*8999999)}`, bankName:'HDFC Bank', ifsc:'HDFC0001234' },
      panNo: `AAAPZ${1000+idx}${String.fromCharCode(65+idx)}`, uanNo: `10020030${40+idx}`,
      skills: [['React','Node.js','TypeScript'],['Figma','User Research','Prototyping'],['Salesforce','Negotiation','B2B Sales'],['Excel','Taxation','Forecasting'],['Zendesk','Client Success','Troubleshooting'],['People Ops','Payroll','Compliance']][idx],
      about: 'Lorem ipsum dolor sit amet, focused on doing consistently good work and helping the team move fast.',
      loves: 'Solving real problems for real users and celebrating small wins with the team.',
      hobbies: idx%2===0 ? 'Reading, badminton, weekend treks' : 'Cricket, cooking, photography',
      leaveBalance: { paid: 24, sick: 7 },
      wage: [null,52000,48000,55000,50000,42000][idx] || 45000,
      mustResetPassword: false,
      createdAt: Date.now(),
    };
    db.employees.push(employee);
    db.credentials[email] = { password: passwords[idx], employeeId: id };
  });

  // seed ~14 working days of attendance for everyone except HR gets attendance too
  const now = new Date();
  for(let back=16; back>=1; back--){
    const d = new Date(now); d.setDate(d.getDate()-back);
    if(d.getDay()===0) continue; // skip Sundays
    const dateStr = toDateStr(d);
    db.employees.forEach((emp, idx) => {
      const skip = Math.random() < 0.08; // occasional absence
      if(skip) return;
      const inH = 9 + Math.floor(Math.random()*2), inM = Math.floor(Math.random()*60);
      const outH = 17 + Math.floor(Math.random()*3), outM = Math.floor(Math.random()*60);
      const checkIn = new Date(d); checkIn.setHours(inH, inM, 0, 0);
      const checkOut = new Date(d); checkOut.setHours(outH, outM, 0, 0);
      const hours = Math.round(((checkOut-checkIn)/3600000)*100)/100;
      db.attendance.push({ id: uid('att'), employeeId: emp.id, date: dateStr, checkIn: checkIn.getTime(), checkOut: checkOut.getTime(), hours });
    });
  }

  // seed a few leave requests for demo richness
  const rahul = db.employees[1], priya = db.employees[2], karthik = db.employees[3];
  db.leaves.push(
    { id: uid('lv'), employeeId: rahul.id, type:'Paid Time Off', startDate: toDateStr(new Date(Date.now()+3*86400000)), endDate: toDateStr(new Date(Date.now()+4*86400000)), days:2, remarks:'Family function', status:'Pending', hrComment:'', createdAt: Date.now()-3600000 },
    { id: uid('lv'), employeeId: priya.id, type:'Sick Leave', startDate: toDateStr(new Date(Date.now()-6*86400000)), endDate: toDateStr(new Date(Date.now()-6*86400000)), days:1, remarks:'Fever', status:'Approved', hrComment:'Get well soon', createdAt: Date.now()-7*86400000 },
    { id: uid('lv'), employeeId: karthik.id, type:'Unpaid Leave', startDate: toDateStr(new Date(Date.now()-10*86400000)), endDate: toDateStr(new Date(Date.now()-9*86400000)), days:2, remarks:'Personal travel', status:'Rejected', hrComment:'Critical sales week, please reschedule', createdAt: Date.now()-11*86400000 }
  );
  rahul.leaveBalance.paid -= 0; // pending doesn't deduct until approved (deducted on approval)
  priya.leaveBalance.sick -= 1;

  db.notifications.push(
    { id: uid('ntf'), userId: db.employees[0].id, message: `${rahul.name} applied for Paid Time Off`, link:'#/leave', read:false, createdAt: Date.now()-3600000 },
    { id: uid('ntf'), userId: priya.id, message:'Your Sick Leave request was approved', link:'#/leave', read:true, createdAt: Date.now()-6*86400000 },
    { id: uid('ntf'), userId: karthik.id, message:'Your Unpaid Leave request was rejected', link:'#/leave', read:false, createdAt: Date.now()-11*86400000 },
  );

  saveDB(db);
  return db;
}

/* ---- Auth ---- */
function getSession(){ try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e){ return null; } }
function setSession(employeeId){ localStorage.setItem(SESSION_KEY, JSON.stringify({ employeeId, at: Date.now() })); }
function clearSession(){ localStorage.removeItem(SESSION_KEY); }
function currentUser(){
  const s = getSession(); if(!s) return null;
  const db = getDB();
  return db.employees.find(e => e.id === s.employeeId) || null;
}
function login(email, password){
  const db = getDB();
  const cred = db.credentials[email.trim().toLowerCase()];
  if(!cred || cred.password !== password) return { ok:false, error:'Invalid email or password.' };
  setSession(cred.employeeId);
  return { ok:true };
}
function signup({ name, email, phone, password, confirm }){
  email = email.trim().toLowerCase();
  if(!name || name.trim().length < 2) return { ok:false, error:'Please enter your full name.' };
  if(!emailRe.test(email)) return { ok:false, error:'Please enter a valid email address.' };
  if(!phoneRe.test(phone)) return { ok:false, error:'Please enter a valid 10-digit mobile number.' };
  if(password.length < 6) return { ok:false, error:'Password must be at least 6 characters.' };
  if(password !== confirm) return { ok:false, error:'Passwords do not match.' };
  const db = getDB();
  if(db.credentials[email]) return { ok:false, error:'An account with this email already exists.' };
  const [first, ...rest] = name.trim().split(' ');
  const last = rest.join(' ') || first;
  const year = new Date().getFullYear();
  const empCode = generateEmpCode(db, first, last, year);
  const id = uid('emp');
  // Self sign-up always provisions a standard Employee account — role escalation
  // is not exposed in this form; HR/Admin accounts are created by HR only.
  const employee = {
    id, empCode, name: name.trim(), email, personalEmail:'', phone, role:'employee',
    department:'Unassigned', jobPosition:'New Hire', manager:'Ananya Sharma', company: COMPANY.name,
    location:'Bengaluru HQ', dateOfJoining: todayStr(), dob:'', gender:'', nationality:'', maritalStatus:'',
    residingAddress:'', bank:{accountNumber:'',bankName:'',ifsc:''}, panNo:'', uanNo:'',
    skills:[], about:'', loves:'', hobbies:'', leaveBalance:{ paid:24, sick:7 }, wage:35000,
    mustResetPassword:false, createdAt: Date.now(),
  };
  db.employees.push(employee);
  db.credentials[email] = { password, employeeId:id };
  commit();
  setSession(id);
  return { ok:true };
}
function logout(){ clearSession(); navigate('#/login'); }

/* ---- Employees (HR) ---- */
function addEmployee(data){
  const db = getDB();
  const email = data.email.trim().toLowerCase();
  if(!data.name || !emailRe.test(email)) return { ok:false, error:'Please provide a valid name and email.' };
  if(db.credentials[email]) return { ok:false, error:'An account with this email already exists.' };
  const [first, ...rest] = data.name.trim().split(' ');
  const last = rest.join(' ') || first;
  const year = new Date(data.dateOfJoining || todayStr()).getFullYear();
  const empCode = generateEmpCode(db, first, last, year);
  const id = uid('emp');
  const tempPassword = genTempPassword();
  const employee = {
    id, empCode, name: data.name.trim(), email, personalEmail:'', phone: data.phone||'',
    role: data.role === 'hr' ? 'hr' : 'employee', department: data.department || 'Unassigned',
    jobPosition: data.jobPosition || 'New Hire', manager: data.manager || 'Ananya Sharma',
    company: COMPANY.name, location: data.location || 'Bengaluru HQ',
    dateOfJoining: data.dateOfJoining || todayStr(), dob:'', gender:'', nationality:'', maritalStatus:'',
    residingAddress:'', bank:{accountNumber:'',bankName:'',ifsc:''}, panNo:'', uanNo:'',
    skills:[], about:'', loves:'', hobbies:'', leaveBalance:{ paid:24, sick:7 }, wage: Number(data.wage)||30000,
    mustResetPassword:true, createdAt: Date.now(),
  };
  db.employees.push(employee);
  db.credentials[email] = { password: tempPassword, employeeId:id };
  commit();
  return { ok:true, empCode, tempPassword };
}

/* ---- Attendance ---- */
function getTodayAttendance(employeeId){
  const db = getDB();
  return db.attendance.find(a => a.employeeId===employeeId && a.date===todayStr()) || null;
}
function checkIn(employeeId){
  const db = getDB();
  if(getTodayAttendance(employeeId)) return { ok:false, error:'You have already checked in today.' };
  db.attendance.push({ id: uid('att'), employeeId, date: todayStr(), checkIn: Date.now(), checkOut:null, hours:null });
  commit();
  return { ok:true };
}
function checkOut(employeeId){
  const db = getDB();
  const rec = getTodayAttendance(employeeId);
  if(!rec) return { ok:false, error:'You must check in before checking out.' };
  if(rec.checkOut) return { ok:false, error:'You have already checked out today.' };
  rec.checkOut = Date.now();
  rec.hours = Math.round(((rec.checkOut - rec.checkIn)/3600000)*100)/100;
  commit();
  return { ok:true };
}
function getAttendanceForEmployee(employeeId, monthOffset=0){
  const db = getDB();
  const now = new Date(); now.setMonth(now.getMonth()+monthOffset);
  const y = now.getFullYear(), m = now.getMonth();
  return db.attendance
    .filter(a => a.employeeId===employeeId)
    .filter(a => { const d=new Date(a.date+'T00:00:00'); return d.getFullYear()===y && d.getMonth()===m; })
    .sort((a,b)=> b.date.localeCompare(a.date));
}
function getAllAttendanceForDate(dateStr){
  const db = getDB();
  return db.attendance.filter(a => a.date===dateStr);
}
function weeklyHours(employeeId){
  const db = getDB();
  const now = new Date(); const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7);
  return db.attendance.filter(a=> a.employeeId===employeeId && a.hours!=null && new Date(a.date+'T00:00:00') >= weekAgo)
    .reduce((sum,a)=> sum + (a.hours||0), 0);
}

/* ---- Leave / Time Off ---- */
function isOnApprovedLeave(employeeId, dateStr){
  const db = getDB();
  return db.leaves.some(l => l.employeeId===employeeId && l.status==='Approved' && dateStr>=l.startDate && dateStr<=l.endDate);
}
function countLeaveDays(startDate, endDate){
  // business-day count (Mon–Sat), excluding Sundays
  let d = new Date(startDate+'T00:00:00');
  const end = new Date(endDate+'T00:00:00');
  let days = 0;
  while(d <= end){ if(d.getDay()!==0) days++; d.setDate(d.getDate()+1); }
  return Math.max(days,1);
}
function getLeavesForEmployee(employeeId){
  const db = getDB();
  return db.leaves.filter(l=>l.employeeId===employeeId).sort((a,b)=>b.createdAt-a.createdAt);
}
function getAllLeaves(){
  const db = getDB();
  return db.leaves.slice().sort((a,b)=>b.createdAt-a.createdAt);
}
function getPendingLeaves(){
  return getAllLeaves().filter(l=>l.status==='Pending');
}
function applyLeave(employeeId, { type, startDate, endDate, remarks }){
  const db = getDB();
  const emp = db.employees.find(e=>e.id===employeeId);
  if(!type) return { ok:false, error:'Please select a leave type.' };
  if(!startDate || !endDate) return { ok:false, error:'Please select both a start and end date.' };
  if(endDate < startDate) return { ok:false, error:'End date cannot be before start date.' };
  const days = countLeaveDays(startDate, endDate);
  const overlap = db.leaves.some(l => l.employeeId===employeeId && l.status!=='Rejected' &&
    !(endDate < l.startDate || startDate > l.endDate));
  if(overlap) return { ok:false, error:'You already have a request covering these dates.' };
  if(type === 'Paid Time Off' && days > emp.leaveBalance.paid) return { ok:false, error:`Insufficient paid leave balance (${emp.leaveBalance.paid} day(s) available).` };
  if(type === 'Sick Leave' && days > emp.leaveBalance.sick) return { ok:false, error:`Insufficient sick leave balance (${emp.leaveBalance.sick} day(s) available).` };
  const leave = { id: uid('lv'), employeeId, type, startDate, endDate, days, remarks: remarks||'', status:'Pending', hrComment:'', createdAt: Date.now() };
  db.leaves.push(leave);
  db.employees.filter(e=>e.role==='hr').forEach(hr => notify(hr.id, `${emp.name} applied for ${type} (${days} day${days>1?'s':''})`, '#/leave'));
  commit();
  return { ok:true };
}
function decideLeave(leaveId, decision, comment){
  const db = getDB();
  const leave = db.leaves.find(l=>l.id===leaveId);
  if(!leave) return { ok:false, error:'Request not found.' };
  if(leave.status !== 'Pending') return { ok:false, error:'This request has already been decided.' };
  leave.status = decision; leave.hrComment = comment || '';
  if(decision === 'Approved'){
    const emp = db.employees.find(e=>e.id===leave.employeeId);
    if(leave.type==='Paid Time Off') emp.leaveBalance.paid = Math.max(0, emp.leaveBalance.paid - leave.days);
    if(leave.type==='Sick Leave') emp.leaveBalance.sick = Math.max(0, emp.leaveBalance.sick - leave.days);
  }
  notify(leave.employeeId, `Your ${leave.type} request was ${decision.toLowerCase()}${comment? ': '+comment:''}`, '#/leave');
  commit();
  return { ok:true };
}

/* ---- Payroll ---- */
function computeSalary(wage){
  wage = Number(wage)||0;
  const basic = wage * 0.50;
  const hra = basic * 0.50;
  const standardAllowance = wage * 0.0833;
  const performanceBonus = basic * 0.0833;
  const lta = basic * 0.0833;
  const allocated = basic + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(wage - allocated, 0);
  const gross = basic + hra + standardAllowance + performanceBonus + lta + fixedAllowance;
  const pfEmployee = basic * 0.12;
  const pfEmployer = basic * 0.12;
  const professionalTax = 200;
  const netSalary = gross - pfEmployee - professionalTax;
  return { wage, basic, hra, standardAllowance, performanceBonus, lta, fixedAllowance, gross, pfEmployee, pfEmployer, professionalTax, netSalary };
}
function updateWage(employeeId, wage){
  const db = getDB();
  const emp = db.employees.find(e=>e.id===employeeId);
  const n = Number(wage);
  if(!n || n <= 0) return { ok:false, error:'Please enter a valid monthly wage.' };
  emp.wage = n;
  commit();
  return { ok:true };
}

/* ---- Notifications ---- */
function notify(userId, message, link){
  const db = getDB();
  db.notifications.push({ id: uid('ntf'), userId, message, link: link||'#/dashboard', read:false, createdAt: Date.now() });
}
function getNotifications(userId){
  const db = getDB();
  return db.notifications.filter(n=>n.userId===userId).sort((a,b)=>b.createdAt-a.createdAt);
}
function unreadCount(userId){ return getNotifications(userId).filter(n=>!n.read).length; }
function markAllRead(userId){
  const db = getDB();
  db.notifications.filter(n=>n.userId===userId).forEach(n=>n.read=true);
  commit();
}
function markRead(id){
  const db = getDB();
  const n = db.notifications.find(x=>x.id===id);
  if(n){ n.read = true; commit(); }
}

/* ---- Status helpers ---- */
function employeeStatusToday(employeeId){
  const att = getTodayAttendance(employeeId);
  if(att) return 'present';
  if(isOnApprovedLeave(employeeId, todayStr())) return 'leave';
  return 'absent';
}
function statusDot(status){
  const map = { present:'bg-success', leave:'bg-primary', absent:'bg-warning' };
  const label = { present:'Present', leave:'On leave', absent:'Absent' };
  if(status==='leave'){
    return `<span title="On leave" class="text-primary text-xs">✈️</span>`;
  }
  return `<span title="${label[status]}" class="status-dot ${map[status]}"></span>`;
}
