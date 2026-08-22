/* ============================= DATA LAYER ============================= */
/* Mock persistence layer standing in for a real backend/API.
   Structured so every mutation goes through a function here — swapping
   this module for real HTTP calls later would not require touching any view code. */
const STORE_KEY = 'odoo_india_hrms_v4';
const SESSION_KEY = 'odoo_india_session_v4';
const COMPANY = { name: 'Odoo India', prefix: 'OI' };

function loadDB(){
  const legacyKeys = [
    'dayflow_db_v1', 'dayflow_db_v2', 'dayflow_db_v3',
    'dayflow_session_v1', 'dayflow_session_v2',
    'odoo_india_hrms_v1', 'odoo_india_hrms_v2', 'odoo_india_hrms_v3'
  ];
  const raw = localStorage.getItem(STORE_KEY);
  if(raw){
    try {
      const db = JSON.parse(raw);
      if(db && db.employees && db.employees.length && db.employees[0].email && db.employees[0].email.includes('odooindia.com')){
        return db;
      }
    } catch(e){ /* fall through to reseed */ }
  }
  // Clear stale legacy caches
  legacyKeys.forEach(k => { try { localStorage.removeItem(k); } catch(e){} });
  return seedDB();
}

function saveDB(db){ localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
function getDB(){ if(!window.__db) window.__db = loadDB(); return window.__db; }
function commit(){ saveDB(window.__db); }

function resetDatabase(){
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.__db = seedDB();
  return window.__db;
}

function generateEmpCode(db, firstName, lastName, year){
  const f = (firstName || 'EM').trim().replace(/[^a-zA-Z]/g, '').padEnd(2, 'X').slice(0, 2).toUpperCase();
  const l = (lastName || (firstName || 'PL')).trim().replace(/[^a-zA-Z]/g, '').padEnd(2, 'X').slice(0, 2).toUpperCase();
  const y = String(year || new Date().getFullYear());
  
  const employees = (db && db.employees) ? db.employees : [];
  const yearEmployees = employees.filter(e => {
    if(!e.empCode) return false;
    return e.empCode.includes(y) || (e.dateOfJoining && e.dateOfJoining.startsWith(y));
  });
  const serial = pad4(yearEmployees.length + 1);
  return `${COMPANY.prefix}${f}${l}${y}${serial}`;
}

function genTempPassword(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = '';
  for(let i=0;i<8;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

function seedDB(){
  const db = { employees: [], credentials: {}, attendance: [], leaves: [], notifications: [], seq: 1 };
  const seedPeople = [
    {
      first: 'Ananya', last: 'Sharma', role: 'hr', dept: 'Human Resources', job: 'HR Manager',
      join: '2021-03-01', dob: '1992-05-14', gender: 'Female', marital: 'Married',
      address: '#402, Palm Meadows, 100ft Road, Indiranagar, Bengaluru, KA - 560038',
      bankName: 'HDFC Bank', accNo: '50100458921345', ifsc: 'HDFC0001234',
      pan: 'AAAPS9214F', uan: '100902847192', wage: 85000,
      skills: ['People Operations', 'Talent Acquisition', 'HR Strategy', 'Statutory Compliance', 'Conflict Resolution', 'Culture Building'],
      about: 'Leads People Operations and Talent Experience at Odoo India. Passionate about building inclusive, transparent, and vibrant workplaces where every team member does their best work.',
      loves: 'Designing human-centric onboarding experiences, celebrating team milestones, and building transparent company cultures that empower engineers and creatives alike.',
      hobbies: 'Specialty filter coffee brewing, badminton on weekends, Hindustani classical vocals, and hiking in the Western Ghats.',
      vibe: '🚀 Energized'
    },
    {
      first: 'Rahul', last: 'Verma', role: 'employee', dept: 'Engineering', job: 'Software Engineer',
      join: '2022-06-14', dob: '1994-08-22', gender: 'Male', marital: 'Single',
      address: '#12/A, 5th Main, 7th Sector, HSR Layout, Bengaluru, KA - 560102',
      bankName: 'ICICI Bank', accNo: '002305018934', ifsc: 'ICIC0000023',
      pan: 'BKRPV5521M', uan: '100452391084', wage: 55000,
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'System Design'],
      about: 'Full-stack product engineer specializing in performant web architectures, responsive frontends, and reliable API services. Love turning complex business logic into intuitive user experiences.',
      loves: 'Solving challenging distributed systems problems, shipping zero-downtime microservices, and pair-programming with teammates on clean abstractions.',
      hobbies: 'Mechanical keyboards, sci-fi novels, road cycling around Nandi Hills, and brewing AeroPress coffee.',
      vibe: '🎯 Focused'
    },
    {
      first: 'Priya', last: 'Nair', role: 'employee', dept: 'Design', job: 'UI/UX Designer',
      join: '2022-11-02', dob: '1996-03-18', gender: 'Female', marital: 'Single',
      address: 'Flat 304, Green Palms, Marine Drive, Kochi, Kerala - 682031',
      bankName: 'Axis Bank', accNo: '9140200843219', ifsc: 'UTIB0000140',
      pan: 'CPRPN4419K', uan: '100781294012', wage: 52000,
      skills: ['Figma', 'Design Systems', 'Micro-interactions', 'User Research', 'Wireframing', 'Tailwind CSS'],
      about: 'Product designer obsessed with micro-interactions, delightful typography, design systems, and creating interfaces that feel intuitive and joyfully responsive.',
      loves: 'Crafting frictionless user journeys, motion design, rapid Figma prototyping, and running user research sessions that uncover hidden pain points.',
      hobbies: 'Watercolor illustration, pottery, discovering indie board games, and street photography.',
      vibe: '✨ Inspired'
    },
    {
      first: 'Karthik', last: 'Iyer', role: 'employee', dept: 'Sales', job: 'Sales Executive',
      join: '2023-01-19', dob: '1993-11-09', gender: 'Male', marital: 'Married',
      address: '#88, 3rd Cross, Malleshwaram, Bengaluru, KA - 560003',
      bankName: 'State Bank of India', accNo: '20491823901', ifsc: 'SBIN0001256',
      pan: 'DYPKI8823Q', uan: '100652914820', wage: 58000,
      skills: ['B2B Enterprise Sales', 'Key Account Management', 'CRM Automation', 'Solution Consulting', 'Contract Negotiation'],
      about: 'Enterprise sales leader driving strategic growth across South Asia. Passionate about understanding customer workflows and delivering tailored software solutions that accelerate digital transformation.',
      loves: 'Building authentic long-term partnerships with clients, negotiating win-win enterprise contracts, and mentoring junior sales reps.',
      hobbies: 'Cricket enthusiast, playing the acoustic guitar, running half-marathons, and exploring South Indian filter coffee spots.',
      vibe: '🔥 On Fire'
    },
    {
      first: 'Sneha', last: 'Reddy', role: 'employee', dept: 'Finance', job: 'Finance Analyst',
      join: '2023-05-08', dob: '1995-07-25', gender: 'Female', marital: 'Single',
      address: '#201, Shanti Niketan, Whitefield, Bengaluru, KA - 560066',
      bankName: 'Kotak Mahindra Bank', accNo: '4812903841', ifsc: 'KKBK0000420',
      pan: 'AZPSR7714J', uan: '100892341905', wage: 50000,
      skills: ['Financial Modeling', 'SaaS Metrics', 'Corporate Taxation', 'Excel & PowerBI', 'Budget Forecasting'],
      about: 'Finance and operations analyst with a deep background in SaaS unit economics, financial modeling, budgeting, and statutory compliance.',
      loves: 'Building interactive financial models, finding cost efficiencies, and translating complex fiscal data into clear visual dashboards.',
      hobbies: 'Gardening succulents, swimming, listening to finance & tech podcasts, and reading mystery novels.',
      vibe: '☕ Need Coffee'
    },
    {
      first: 'Arjun', last: 'Menon', role: 'employee', dept: 'Support', job: 'Support Specialist',
      join: '2024-02-26', dob: '1997-12-04', gender: 'Male', marital: 'Single',
      address: 'Plot 45, Anna Nagar West, Chennai, TN - 600040',
      bankName: 'HDFC Bank', accNo: '501008892134', ifsc: 'HDFC0000240',
      pan: 'DWTAM3319B', uan: '100994821034', wage: 42000,
      skills: ['Customer Success', 'Technical Support', 'Zendesk & Intercom', 'Incident Triage', 'Knowledge Base Authoring'],
      about: 'Customer success advocate dedicated to troubleshooting technical inquiries, building self-serve knowledge bases, and ensuring our users have a 5-star experience every single day.',
      loves: 'Turning frustrated tickets into delighted loyal customers, analyzing user friction points, and writing crisp documentation.',
      hobbies: 'Board games, acoustic guitar, cooking traditional Kerala dishes, and gaming on PlayStation.',
      vibe: '😊 Great'
    }
  ];

  const locations = ['Bengaluru HQ','Bengaluru HQ','Remote','Bengaluru HQ','Bengaluru HQ','Remote'];
  const passwords = ['Admin@123','Emp@123','Emp@123','Emp@123','Emp@123','Emp@123'];

  seedPeople.forEach((p, idx) => {
    const year = new Date(p.join).getFullYear();
    const empCode = generateEmpCode(db, p.first, p.last, year);
    const id = uid('emp');
    const email = p.role === 'hr' ? 'hr@odooindia.com' : `${p.first.toLowerCase()}.${p.last.toLowerCase()}@odooindia.com`;
    const employee = {
      id,
      empCode,
      name: `${p.first} ${p.last}`,
      email,
      personalEmail: `${p.first.toLowerCase()}.${p.last.toLowerCase()}@gmail.com`,
      phone: `9${Math.floor(100000000+Math.random()*899999999)}`.slice(0,10),
      role: p.role,
      department: p.dept,
      jobPosition: p.job,
      manager: p.role === 'hr' ? 'Leadership Team' : 'Ananya Sharma',
      company: COMPANY.name,
      location: locations[idx],
      dateOfJoining: p.join,
      dob: p.dob,
      gender: p.gender,
      nationality: 'Indian',
      maritalStatus: p.marital,
      residingAddress: p.address,
      bank: {
        accountNumber: p.accNo,
        bankName: p.bankName,
        ifsc: p.ifsc
      },
      panNo: p.pan,
      uanNo: p.uan,
      skills: p.skills,
      about: p.about,
      loves: p.loves,
      hobbies: p.hobbies,
      leaveBalance: { paid: 24, sick: 7 },
      wage: p.wage,
      vibe: p.vibe,
      streak: 14 + idx * 3,
      mustResetPassword: false,
      photoSeed: `${p.first}-${p.last}-${idx}`,
      photoUrl: '',
      certifications: [],
      createdAt: Date.now() - (30 - idx * 4) * 86400000
    };
    db.employees.push(employee);
    db.credentials[email.toLowerCase()] = { password: passwords[idx], employeeId: id };
    db.credentials[empCode.toLowerCase()] = { password: passwords[idx], employeeId: id };
  });

  // Seed sample certifications
  const ananyaEmp = db.employees[0];
  const rahulEmp = db.employees[1];
  const priyaEmp = db.employees[2];

  if(ananyaEmp) ananyaEmp.certifications.push({
    id: uid('cert'),
    name: 'SHRM Senior Certified Professional (SHRM-SCP)',
    issuer: 'SHRM',
    issueDate: '2021-08-15',
    expiryDate: '2027-08-15',
    credentialId: 'SHRM-SCP-882194',
    description: 'Advanced certification in organizational leadership, HR strategy, and employee engagement.',
    status: 'Active',
    attachment: null
  });

  if(rahulEmp) rahulEmp.certifications.push({
    id: uid('cert'),
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issueDate: '2023-04-12',
    expiryDate: '2026-04-12',
    credentialId: 'AWS-SAA-88213',
    description: 'Validated skills in architecting secure, resilient, and scalable AWS cloud applications.',
    status: 'Active',
    attachment: null
  });

  if(priyaEmp) priyaEmp.certifications.push({
    id: uid('cert'),
    name: 'Google UX Design Professional Certificate',
    issuer: 'Google / Coursera',
    issueDate: '2022-09-01',
    expiryDate: '',
    credentialId: 'GUX-2022-5567',
    description: 'End-to-end UX process from foundational empathy research to high-fidelity clickable prototypes.',
    status: 'Active',
    attachment: null
  });

  // Seed ~14 working days of attendance
  const now = new Date();
  for(let back=16; back>=1; back--){
    const d = new Date(now); d.setDate(d.getDate()-back);
    if(d.getDay()===0) continue; // skip Sundays
    const dateStr = toDateStr(d);
    db.employees.forEach((emp) => {
      const skip = Math.random() < 0.08;
      if(skip) return;
      const inH = 9 + Math.floor(Math.random()*2), inM = Math.floor(Math.random()*60);
      const outH = 17 + Math.floor(Math.random()*3), outM = Math.floor(Math.random()*60);
      const checkIn = new Date(d); checkIn.setHours(inH, inM, 0, 0);
      const checkOut = new Date(d); checkOut.setHours(outH, outM, 0, 0);
      const hours = Math.round(((checkOut-checkIn)/3600000)*100)/100;
      const hasBreak = Math.random() < 0.7;
      const breakMinutes = hasBreak ? 20 + Math.floor(Math.random()*40) : 0;
      const breaks = hasBreak ? [{ start: checkIn.getTime()+3*3600000, end: checkIn.getTime()+3*3600000+breakMinutes*60000 }] : [];
      db.attendance.push({ id: uid('att'), employeeId: emp.id, date: dateStr, checkIn: checkIn.getTime(), checkOut: checkOut.getTime(), hours, breaks });
    });
  }

  // Seed demo leaves
  const rahul = db.employees[1], priya = db.employees[2], karthik = db.employees[3];
  db.leaves.push(
    { id: uid('lv'), employeeId: rahul.id, type:'Paid Time Off', startDate: toDateStr(new Date(Date.now()+3*86400000)), endDate: toDateStr(new Date(Date.now()+4*86400000)), days:2, remarks:'Family celebration', status:'Pending', hrComment:'', createdAt: Date.now()-3600000 },
    { id: uid('lv'), employeeId: priya.id, type:'Sick Leave', startDate: toDateStr(new Date(Date.now()-6*86400000)), endDate: toDateStr(new Date(Date.now()-6*86400000)), days:1, remarks:'Seasonal fever', status:'Approved', hrComment:'Take care and get well soon!', createdAt: Date.now()-7*86400000 },
    { id: uid('lv'), employeeId: karthik.id, type:'Unpaid Leave', startDate: toDateStr(new Date(Date.now()-10*86400000)), endDate: toDateStr(new Date(Date.now()-9*86400000)), days:2, remarks:'Personal travel', status:'Rejected', hrComment:'Critical sales review week, please reschedule.', createdAt: Date.now()-11*86400000 }
  );
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

function findEmployeeByIdentifier(db, identifier){
  if(!identifier) return null;
  const q = identifier.trim().toLowerCase();
  return db.employees.find(e =>
    (e.email && e.email.toLowerCase() === q) ||
    (e.empCode && e.empCode.toLowerCase() === q) ||
    (e.personalEmail && e.personalEmail.toLowerCase() === q)
  ) || null;
}

function login(identifier, password){
  if(!identifier || !password) return { ok:false, error:'Please enter both your Email / Login ID and password.' };
  const db = getDB();
  const q = identifier.trim().toLowerCase();

  // Try direct credentials table match
  let cred = db.credentials[q];

  // If not found directly, look up employee and check their credentials
  if(!cred){
    const emp = findEmployeeByIdentifier(db, identifier);
    if(emp){
      cred = db.credentials[emp.email.toLowerCase()] || db.credentials[emp.empCode.toLowerCase()];
    }
  }

  if(!cred || cred.password !== password){
    return { ok:false, error:'Invalid email/login ID or password. Use demo credentials or reset sample data.' };
  }

  setSession(cred.employeeId);
  return { ok:true };
}

function signup({ name, email, phone, password, confirm, dob, gender, maritalStatus, nationality, address, panNo, uanNo, bankName, accountNumber, ifsc, about, loves, hobbies, skills }){
  name = (name||'').trim();
  email = (email||'').trim().toLowerCase();
  phone = (phone||'').trim();
  panNo = (panNo||'').trim().toUpperCase();
  uanNo = (uanNo||'').trim();

  if(!name || name.length < 2) return { ok:false, error:'Please enter your full name.' };
  if(!emailRe.test(email)) return { ok:false, error:'Please enter a valid work email address.' };
  if(!phoneRe.test(phone)) return { ok:false, error:'Please enter a valid mobile number.' };
  if(!panRe.test(panNo)) return { ok:false, error:'Please enter a valid PAN number (format: ABCDE1234F).' };
  if(!uanRe.test(uanNo)) return { ok:false, error:'Please enter a valid 12-digit UAN number.' };
  if(!password || password.length < 6) return { ok:false, error:'Password must be at least 6 characters.' };
  if(password !== confirm) return { ok:false, error:'Passwords do not match.' };

  const db = getDB();
  if(findEmployeeByIdentifier(db, email)) return { ok:false, error:'An account with this email already exists.' };
  if(db.employees.some(e => (e.panNo||'').toUpperCase() === panNo)) return { ok:false, error:'An account with this PAN number already exists.' };
  if(db.employees.some(e => (e.uanNo||'') === uanNo)) return { ok:false, error:'An account with this UAN number already exists.' };

  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] || 'User';
  const last = parts.slice(1).join(' ') || first;
  const year = new Date().getFullYear();
  const empCode = generateEmpCode(db, first, last, year);
  const id = uid('emp');

  const employee = {
    id,
    empCode,
    name,
    email,
    personalEmail: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
    phone,
    role: 'employee',
    department: 'Engineering',
    jobPosition: 'Software Engineer',
    manager: 'Ananya Sharma',
    company: COMPANY.name,
    location: 'Bengaluru HQ',
    dateOfJoining: todayStr(),
    dob: dob || '1998-01-01',
    gender: gender || 'Prefer not to say',
    nationality: (nationality||'').trim() || 'Indian',
    maritalStatus: maritalStatus || 'Single',
    residingAddress: address || 'Bengaluru, Karnataka',
    bank: {
      accountNumber: accountNumber || '',
      bankName: bankName || 'HDFC Bank',
      ifsc: (ifsc||'').trim().toUpperCase() || 'HDFC0001234'
    },
    panNo,
    uanNo,
    skills: Array.isArray(skills) && skills.length ? skills : ['Problem Solving', 'Team Collaboration', 'Communication'],
    about: about || `Joined ${COMPANY.name} to build great software and collaborate with an amazing team.`,
    loves: loves || 'Collaborating with cross-functional teammates and shipping high-impact features.',
    hobbies: hobbies || 'Reading, tech meetups, coffee brewing, and music.',
    leaveBalance: { paid: 24, sick: 7 },
    wage: 45000,
    vibe: '🚀 Energized',
    streak: 1,
    mustResetPassword: false,
    photoSeed: `${first}-${last}-${id}`,
    photoUrl: '',
    certifications: [],
    createdAt: Date.now()
  };

  db.employees.push(employee);
  db.credentials[email.toLowerCase()] = { password, employeeId: id };
  db.credentials[empCode.toLowerCase()] = { password, employeeId: id };
  commit();
  setSession(id);
  return { ok:true, employee };
}

function logout(){ clearSession(); navigate('#/login'); }

/* ---- Employee Profile Mutations ---- */
/* Restricts a mutation to the record owner only (used for About, Skills, Certifications,
   Private Info, and Bank Details — HR can view every employee's profile but must not be
   able to edit these employee-owned sections, even by calling the function directly). */
function assertOwnerOnly(employeeId){
  const session = getSession();
  if(!session || session.employeeId !== employeeId){
    return { ok:false, error:'You do not have permission to edit this section. Only the employee themselves can update it.' };
  }
  return null;
}

function updatePrivateInfo(employeeId, data){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };

  if(data.dob !== undefined) emp.dob = data.dob;
  if(data.gender !== undefined) emp.gender = data.gender;
  if(data.maritalStatus !== undefined) emp.maritalStatus = data.maritalStatus;
  if(data.nationality !== undefined) emp.nationality = data.nationality;
  if(data.residingAddress !== undefined) emp.residingAddress = data.residingAddress;
  if(data.personalEmail !== undefined) emp.personalEmail = data.personalEmail;
  if(data.panNo !== undefined) emp.panNo = (data.panNo || '').toUpperCase();
  if(data.uanNo !== undefined) emp.uanNo = data.uanNo;

  commit();
  return { ok:true, employee:emp };
}

function updateBankDetails(employeeId, data){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };

  emp.bank = emp.bank || {};
  if(data.bankName !== undefined) emp.bank.bankName = data.bankName;
  if(data.accountNumber !== undefined) emp.bank.accountNumber = data.accountNumber;
  if(data.ifsc !== undefined) emp.bank.ifsc = (data.ifsc || '').toUpperCase();

  commit();
  return { ok:true, employee:emp };
}

function updateAboutAndInterests(employeeId, { about, loves, hobbies }){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };

  if(about !== undefined) emp.about = about;
  if(loves !== undefined) emp.loves = loves;
  if(hobbies !== undefined) emp.hobbies = hobbies;

  commit();
  return { ok:true, employee:emp };
}

function updateWorkInfo(employeeId, data){
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };

  if(data.name) emp.name = data.name.trim();
  if(data.phone) emp.phone = data.phone.trim();
  if(data.department) emp.department = data.department;
  if(data.jobPosition) emp.jobPosition = data.jobPosition;
  if(data.location) emp.location = data.location;
  if(data.manager) emp.manager = data.manager;

  commit();
  return { ok:true, employee:emp };
}

function updatePhoto(employeeId, photoUrl){
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.photoUrl = photoUrl;
  commit();
  return { ok:true };
}

function setUserVibe(employeeId, vibe){
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.vibe = vibe;
  commit();
  return { ok:true };
}

function addSkill(employeeId, skill){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  if(!skill || !skill.trim()) return { ok:false, error:'Invalid skill.' };
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.skills = emp.skills || [];
  if(!emp.skills.includes(skill.trim())){
    emp.skills.push(skill.trim());
    commit();
  }
  return { ok:true };
}

function removeSkill(employeeId, skill){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.skills = (emp.skills || []).filter(s => s !== skill);
  commit();
  return { ok:true };
}

function addCertification(employeeId, cert){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  if(!cert.name || !cert.issuer) return { ok:false, error:'Please provide a certification name and issuer.' };
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.certifications = emp.certifications || [];
  emp.certifications.push({ id: uid('cert'), ...cert });
  commit();
  return { ok:true };
}

function updateCertification(employeeId, certId, cert){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.certifications = emp.certifications || [];
  const idx = emp.certifications.findIndex(c => c.id === certId);
  if(idx === -1) return { ok:false, error:'Certification not found.' };
  emp.certifications[idx] = { ...emp.certifications[idx], ...cert };
  commit();
  return { ok:true };
}

function deleteCertification(employeeId, certId){
  const denied = assertOwnerOnly(employeeId);
  if(denied) return denied;
  const db = getDB();
  const emp = db.employees.find(e => e.id === employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.certifications = (emp.certifications || []).filter(c => c.id !== certId);
  commit();
  return { ok:true };
}

/* ---- HR Management ---- */
function addEmployee(data){
  const db = getDB();
  const email = (data.email||'').trim().toLowerCase();
  if(!data.name || !emailRe.test(email)) return { ok:false, error:'Please provide a valid name and email.' };
  if(findEmployeeByIdentifier(db, email)) return { ok:false, error:'An account with this email or Login ID already exists.' };

  const parts = data.name.trim().split(' ').filter(Boolean);
  const first = parts[0] || 'User';
  const last = parts.slice(1).join(' ') || first;
  const year = new Date(data.dateOfJoining || todayStr()).getFullYear();
  const empCode = generateEmpCode(db, first, last, year);
  const id = uid('emp');
  const tempPassword = genTempPassword();

  const employee = {
    id,
    empCode,
    name: data.name.trim(),
    email,
    personalEmail: data.personalEmail || `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
    phone: data.phone || '',
    role: data.role === 'hr' ? 'hr' : 'employee',
    department: data.department || 'Engineering',
    jobPosition: data.jobPosition || 'New Specialist',
    manager: data.manager || 'Ananya Sharma',
    company: COMPANY.name,
    location: data.location || 'Bengaluru HQ',
    dateOfJoining: data.dateOfJoining || todayStr(),
    dob: data.dob || '1996-01-01',
    gender: data.gender || 'Prefer not to say',
    nationality: 'Indian',
    maritalStatus: data.maritalStatus || 'Single',
    residingAddress: data.residingAddress || 'Bengaluru, Karnataka',
    bank: {
      accountNumber: data.accountNumber || '',
      bankName: data.bankName || 'HDFC Bank',
      ifsc: data.ifsc || 'HDFC0001234'
    },
    panNo: data.panNo || `AAAPZ${Math.floor(1000+Math.random()*8999)}K`,
    uanNo: data.uanNo || `1002${Math.floor(10000000+Math.random()*89999999)}`,
    skills: data.skills || ['Communication', 'Teamwork'],
    about: data.about || `New member of the ${data.department || 'Odoo India'} team.`,
    loves: data.loves || 'Solving real problems for customers and collaborating with brilliant peers.',
    hobbies: data.hobbies || 'Exploring tech, reading books, travel, and fitness.',
    leaveBalance: { paid: 24, sick: 7 },
    wage: Number(data.wage) || 45000,
    vibe: '🚀 Energized',
    streak: 1,
    mustResetPassword: true,
    photoSeed: `${first}-${last}-${id}`,
    photoUrl: '',
    certifications: [],
    createdAt: Date.now()
  };

  db.employees.push(employee);
  db.credentials[email.toLowerCase()] = { password: tempPassword, employeeId: id };
  db.credentials[empCode.toLowerCase()] = { password: tempPassword, employeeId: id };
  commit();
  return { ok:true, empCode, tempPassword, employee };
}

/* ---- Attendance ---- */
function getTodayAttendance(employeeId){
  const db = getDB();
  return db.attendance.find(a => a.employeeId===employeeId && a.date===todayStr()) || null;
}

function checkIn(employeeId){
  const db = getDB();
  if(getTodayAttendance(employeeId)) return { ok:false, error:'You have already checked in today.' };
  db.attendance.push({ id: uid('att'), employeeId, date: todayStr(), checkIn: Date.now(), checkOut:null, hours:null, breaks:[] });
  
  const emp = db.employees.find(e => e.id === employeeId);
  if(emp) emp.streak = (emp.streak || 0) + 1;

  commit();
  return { ok:true };
}

function totalBreakMs(rec){
  return (rec.breaks||[]).reduce((sum,b)=> sum + ((b.end||Date.now()) - b.start), 0);
}

function isOnBreak(rec){
  return !!(rec && rec.breaks && rec.breaks.length && rec.breaks[rec.breaks.length-1].end == null);
}

function startBreak(employeeId){
  const db = getDB();
  const rec = getTodayAttendance(employeeId);
  if(!rec) return { ok:false, error:'You must check in before starting a break.' };
  if(rec.checkOut) return { ok:false, error:'You have already checked out today.' };
  if(isOnBreak(rec)) return { ok:false, error:'You are already on a break.' };
  rec.breaks = rec.breaks || [];
  rec.breaks.push({ start: Date.now(), end: null });
  commit();
  return { ok:true };
}

function endBreak(employeeId){
  const db = getDB();
  const rec = getTodayAttendance(employeeId);
  if(!rec || !isOnBreak(rec)) return { ok:false, error:'You are not currently on a break.' };
  rec.breaks[rec.breaks.length-1].end = Date.now();
  commit();
  return { ok:true };
}

function checkOut(employeeId){
  const db = getDB();
  const rec = getTodayAttendance(employeeId);
  if(!rec) return { ok:false, error:'You must check in before checking out.' };
  if(rec.checkOut) return { ok:false, error:'You have already checked out today.' };
  if(isOnBreak(rec)) return { ok:false, error:'Please end your current break before checking out.' };
  rec.checkOut = Date.now();
  const grossMs = rec.checkOut - rec.checkIn;
  const netMs = Math.max(grossMs - totalBreakMs(rec), 0);
  rec.hours = Math.round((netMs/3600000)*100)/100;
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
  const s = new Date(startDate+'T00:00:00'), e = new Date(endDate+'T00:00:00');
  if(isNaN(s) || isNaN(e) || e < s) return 0;
  let count = 0, cur = new Date(s);
  while(cur <= e){
    if(cur.getDay() !== 0) count++; // skip Sunday
    cur.setDate(cur.getDate()+1);
  }
  return count;
}

function applyLeave(employeeId, { type, startDate, endDate, remarks, attachment }){
  if(!type || !startDate || !endDate) return { ok:false, error:'Please fill all required leave fields.' };
  if(endDate < startDate) return { ok:false, error:'End date cannot precede start date.' };
  const days = countLeaveDays(startDate, endDate);
  if(days <= 0) return { ok:false, error:'Selected date range includes no working days.' };

  const db = getDB();
  const emp = db.employees.find(e => e.id===employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };

  if(type === 'Paid Time Off' && emp.leaveBalance.paid < days)
    return { ok:false, error:`Insufficient paid leave balance (you have ${emp.leaveBalance.paid} days remaining).` };
  if(type === 'Sick Leave' && emp.leaveBalance.sick < days)
    return { ok:false, error:`Insufficient sick leave balance (you have ${emp.leaveBalance.sick} days remaining).` };

  const leaveId = uid('lv');
  db.leaves.unshift({
    id: leaveId,
    employeeId,
    type,
    startDate,
    endDate,
    days,
    remarks: remarks || '',
    attachment: attachment || null,
    status: 'Pending',
    hrComment: '',
    createdAt: Date.now()
  });

  const hrUsers = db.employees.filter(e => e.role === 'hr');
  hrUsers.forEach(hr => {
    db.notifications.unshift({
      id: uid('ntf'),
      userId: hr.id,
      message: `${emp.name} requested ${days} day(s) ${type}`,
      link: '#/leave',
      read: false,
      createdAt: Date.now()
    });
  });

  commit();
  return { ok:true, leaveId };
}

function decideLeave(leaveId, decision, hrComment=''){
  const db = getDB();
  const l = db.leaves.find(x => x.id === leaveId);
  if(!l) return { ok:false, error:'Leave request not found.' };
  if(l.status !== 'Pending') return { ok:false, error:'This request has already been processed.' };

  l.status = decision;
  l.hrComment = hrComment;

  const emp = db.employees.find(e => e.id === l.employeeId);
  if(decision === 'Approved' && emp){
    if(l.type === 'Paid Time Off') emp.leaveBalance.paid = Math.max(0, emp.leaveBalance.paid - l.days);
    if(l.type === 'Sick Leave') emp.leaveBalance.sick = Math.max(0, emp.leaveBalance.sick - l.days);
  }

  db.notifications.unshift({
    id: uid('ntf'),
    userId: l.employeeId,
    message: `Your ${l.type} request was ${decision.toLowerCase()}${hrComment ? ': "' + hrComment + '"' : ''}`,
    link: '#/leave',
    read: false,
    createdAt: Date.now()
  });

  commit();
  return { ok:true };
}

function getLeavesForEmployee(employeeId){
  const db = getDB();
  return db.leaves.filter(l => l.employeeId===employeeId).sort((a,b)=> b.createdAt - a.createdAt);
}

function getAllLeaves(){
  const db = getDB();
  return db.leaves.slice().sort((a,b)=> b.createdAt - a.createdAt);
}

function getPendingLeaves(){
  const db = getDB();
  return db.leaves.filter(l => l.status==='Pending');
}

/* ---- Payroll Calculation ---- */
function computeSalary(wage){
  const w = Number(wage) || 30000;
  const basic = Math.round(w * 0.50);
  const hra = Math.round(basic * 0.50);
  const standardAllowance = Math.round(w * 0.15);
  const performanceBonus = Math.round(w * 0.08);
  const lta = Math.round(w * 0.05);
  const fixedAllowance = Math.max(0, w - (basic + hra + standardAllowance + performanceBonus + lta));
  const gross = basic + hra + standardAllowance + performanceBonus + lta + fixedAllowance;

  const pfEmployee = Math.round(basic * 0.12);
  const pfEmployer = Math.round(basic * 0.12);
  const professionalTax = 200;
  const totalDeductions = pfEmployee + professionalTax;
  const netSalary = gross - totalDeductions;

  return {
    wage: w,
    basic,
    hra,
    standardAllowance,
    performanceBonus,
    lta,
    fixedAllowance,
    gross,
    pfEmployee,
    pfEmployer,
    professionalTax,
    totalDeductions,
    netSalary
  };
}

function updateWage(employeeId, newWage){
  const n = Number(newWage);
  if(!n || n <= 0) return { ok:false, error:'Wage must be a positive number.' };
  const db = getDB();
  const emp = db.employees.find(e => e.id===employeeId);
  if(!emp) return { ok:false, error:'Employee not found.' };
  emp.wage = n;
  commit();
  return { ok:true };
}

/* ---- Status / Helpers ---- */
function employeeStatusToday(employeeId){
  if(isOnApprovedLeave(employeeId, todayStr())) return 'leave';
  const att = getTodayAttendance(employeeId);
  if(!att) return 'absent';
  if(att.checkOut) return 'checked-out';
  if(isOnBreak(att)) return 'break';
  return 'present';
}

/* ---- Notifications ---- */
function getNotifications(userId){
  const db = getDB();
  return db.notifications.filter(n => n.userId === userId).sort((a,b)=> b.createdAt - a.createdAt);
}

function unreadNotifCount(userId){
  return getNotifications(userId).filter(n => !n.read).length;
}

function markRead(notifId){
  const db = getDB();
  const n = db.notifications.find(x => x.id === notifId);
  if(n){ n.read = true; commit(); }
}

function markAllRead(userId){
  const db = getDB();
  db.notifications.filter(n => n.userId === userId).forEach(n => { n.read = true; });
  commit();
}
