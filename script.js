let currentGroupId = null;

// Theme Toggle
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Initialize Theme
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.body.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// View Switching
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${viewId}"]`)?.classList.add('active');
}

// Authentication (Placeholder)
function signInWithGoogle() {
  showNotification('جاري تسجيل الدخول بحساب جوجل...', 'info');
  // Simulate successful login
  setTimeout(() => {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-app').classList.add('active');
    showNotification('تم تسجيل الدخول بنجاح', 'success');
  }, 1000);
}

function signInWithPhone() {
  showNotification('جاري تسجيل الدخول برقم الهاتف...', 'info');
  // Simulate successful login
  setTimeout(() => {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-app').classList.add('active');
    showNotification('تم تسجيل الدخول بنجاح', 'success');
  }, 1000);
}

function signInWithEmail() {
  showNotification('جاري تسجيل الدخول بالبريد الإلكتروني...', 'info');
  // Simulate successful login
  setTimeout(() => {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-app').classList.add('active');
    showNotification('تم تسجيل الدخول بنجاح', 'success');
  }, 1000);
}

function signOut() {
  showNotification('تم تسجيل الخروج بنجاح', 'success');
  document.getElementById('auth-container').style.display = 'flex';
  document.getElementById('main-app').classList.remove('active');
}

// Notifications
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type} show`;
  notification.textContent = message;
  document.body.appendChild(notification);
  // Add to notifications view
  const notificationsContainer = document.getElementById('notifications-container');
  const notificationItem = document.createElement('div');
  notificationItem.className = `notification ${type}`;
  notificationItem.textContent = `${new Date().toLocaleString()}: ${message}`;
  notificationsContainer.prepend(notificationItem);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function clearNotifications() {
  document.getElementById('notifications-container').innerHTML = '';
  showNotification('تم مسح جميع الإشعارات', 'success');
}

// Create Group
function createGroup() {
  const name = document.getElementById('group-name').value;
  const members = document.getElementById('group-members').value;
  const amount = document.getElementById('group-amount').value;
  const date = document.getElementById('group-date').value;
  const duration = document.getElementById('group-duration').value;
  const type = document.getElementById('group-type').value;
  const privacy = document.getElementById('group-privacy').value;

  if (!name || !members || !amount || !date || !duration) {
    showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  const group = {
    id: Date.now(),
    name,
    members: parseInt(members),
    amount: parseInt(amount),
    date,
    duration: parseInt(duration),
    type,
    privacy,
    status: 'active'
  };

  // Simulate API call
  showNotification('تم إنشاء الجمعية بنجاح!', 'success');
  addGroupToList(group);
  updateStats();
  startCountdown(date);
  showView('dashboard-view');
  document.getElementById('create-form').reset();
}

// Add Group to List
function addGroupToList(group) {
  const groupsContainer = document.getElementById('groups-container');
  groupsContainer.innerHTML = ''; // Clear loading spinner
  const groupCard = document.createElement('div');
  groupCard.className = 'group-card';
  groupCard.innerHTML = `
    <div class="group-title">${group.name} <span class="status ${group.status}">${group.status === 'active' ? 'نشطة' : group.status === 'completed' ? 'مكتملة' : 'معلقة'}</span></div>
    <div class="group-info">
      <span class="info-item">الأعضاء: ${group.members}</span>
      <span class="info-item">المبلغ: ${group.amount} ج.م</span>
      <span class="info-item">المدة: ${group.duration} أشهر</span>
    </div>
    <div>
      <button class="btn btn-info" onclick="showGroupDetails(${group.id})">عرض التفاصيل</button>
      <button class="btn btn-warning" onclick="shareGroup(${group.id}, '${group.privacy}')">مشاركة</button>
    </div>
  `;
  groupsContainer.appendChild(groupCard);
}

// Share Group
function shareGroup(groupId, privacy) {
  if (privacy === 'private') {
    showNotification('تم إنشاء رابط دعوة للجمعية الخاصة', 'info');
    // Generate invite link (requires backend)
  } else {
    showNotification('تم مشاركة الجمعية العامة', 'info');
    // Share public group link
  }
}

// Show Group Details
function showGroupDetails(groupId) {
  currentGroupId = groupId;
  showView('detail-view');
  const groupDetails = document.getElementById('group-details');
  groupDetails.innerHTML = `
    <h2>تفاصيل الجمعية</h2>
    <div class="group-card">
      <div class="group-title">جمعية ${groupId} <span class="status active">نشطة</span></div>
      <div class="group-info">
        <span class="info-item">الأعضاء: 10</span>
        <span class="info-item">المبلغ: 1000 ج.م</span>
        <span class="info-item">المدة: 12 شهر</span>
      </div>
      <h3>الأعضاء</h3>
      <div id="members-list"></div>
      <button class="btn btn-success" onclick="showView('add-member-view')">إضافة عضو</button>
      <button class="btn" onclick="showView('dashboard-view')">رجوع</button>
    </div>
  `;
  // Mock member data
  addMemberToList({ name: 'أحمد محمد', phone: '0123456789', email: 'ahmed@example.com', role: 'member', status: 'paid', order: 1 });
}

// Add Member
function addMember() {
  const name = document.getElementById('member-name').value;
  const phone = document.getElementById('member-phone').value;
  const email = document.getElementById('member-email').value;
  const order = document.getElementById('member-order').value;
  const role = document.getElementById('member-role').value;

  if (!name || !phone) {
    showNotification('يرجى ملء الحقول المطلوبة', 'error');
    return;
  }

  const member = { name, phone, email, order: parseInt(order) || null, role, status: 'unpaid' };
  showNotification(`تم إضافة ${name} بنجاح!`, 'success');
  addMemberToList(member);
  sendWhatsAppReminder(phone, 'مرحبًا! تمت إضافتك إلى الجمعية.');
  showView('detail-view');
  document.getElementById('member-form').reset();
}

// Add Member to List
function addMemberToList(member) {
  const membersList = document.getElementById('members-list');
  const memberItem = document.createElement('div');
  memberItem.className = 'member-item';
  memberItem.innerHTML = `
    <div class="member-info">
      <div class="member-name">${member.name}</div>
      <div class="member-phone">${member.phone}</div>
      <div class="member-stats">
        <span class="member-stat">الدور: ${member.order || 'غير محدد'}</span>
        <span class="member-stat">الصلاحية: ${member.role === 'admin' ? 'مشرف' : 'عضو'}</span>
      </div>
      <span class="payment-status ${member.status}">${member.status === 'paid' ? 'مدفوع' : member.status === 'unpaid' ? 'غير مدفوع' : 'متأخر'}</span>
    </div>
    <div class="member-actions">
      <button class="btn btn-info" onclick="sendWhatsAppReminder('${member.phone}')">تذكير</button>
      <button class="btn btn-danger" onclick="removeMember('${member.phone}')">حذف</button>
    </div>
  `;
  membersList.appendChild(memberItem);
}

// Remove Member
function removeMember(phone) {
  showNotification(`تم حذف العضو ${phone}`, 'success');
  // Update UI or backend
}

// WhatsApp Reminders
function sendWhatsAppReminders() {
  showNotification('تم إرسال تذكيرات WhatsApp لجميع الأعضاء!', 'success');
  // Implement WhatsApp API integration
}

function sendWhatsAppReminder(phone, message = 'تذكير: يرجى سداد قسط الجمعية.') {
  showNotification(`تم إرسال تذكير إلى ${phone}`, 'success');
  // Implement WhatsApp API integration
}

// Countdown Timer
function startCountdown(date) {
  const countdownContainer = document.getElementById('countdown-container');
  const countdownTimer = document.getElementById('countdown-timer');
  countdownContainer.style.display = 'block';
  
  const targetDate = new Date(date).getTime();
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;
    if (timeLeft <= 0) {
      clearInterval(interval);
      countdownTimer.textContent = 'انتهى الموعد!';
      showNotification('انتهت الدورة الحالية!', 'info');
      return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    countdownTimer.innerHTML = `
      <span class="countdown-unit"><span class="countdown-value">${days}</span><span class="countdown-label">أيام</span></span>
      <span class="countdown-unit"><span class="countdown-value">${hours}</span><span class="countdown-label">ساعات</span></span>
      <span class="countdown-unit"><span class="countdown-value">${minutes}</span><span class="countdown-label">دقائق</span></span>
      <span class="countdown-unit"><span class="countdown-value">${seconds}</span><span class="countdown-label">ثوان</span></span>
    `;
    // 24-hour reminder
    if (days === 1 && hours === 0 && minutes === 0 && seconds <= 10) {
      showNotification('تذكير: الدورة القادمة تبدأ غدًا!', 'warning');
      sendWhatsAppReminders();
    }
  }, 1000);
}

// AI Suggestions
function loadAISuggestions() {
  const aiContent = document.getElementById('ai-content');
  const suggestions = [
    'اقتراح: ترتيب الأعضاء بناءً على سجل الدفع الأخير.',
    'تنبيه: العضو أحمد محمد تأخر في الدفع 3 مرات.',
    'اقتراح: إعادة تشغيل الجمعية بعد انتهائها تلقائيًا.'
  ];
  aiContent.innerHTML = `<ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
  document.getElementById('ai-suggestions').style.display = 'block';
}

// Achievements
function loadAchievements() {
  const achievementsGrid = document.getElementById('achievements-grid');
  const achievements = [
    { title: 'عضو نشيط', desc: 'شارك في 5 جمعيات', icon: '🏅', unlocked: true },
    { title: 'مدير مميز', desc: 'أدر 3 جمعيات بنجاح', icon: '👑', unlocked: false },
    { title: 'دفع مثالي', desc: 'سدد 12 دفعة في الوقت', icon: '💰', unlocked: false }
  ];
  achievementsGrid.innerHTML = achievements.map(ach => `
    <div class="achievement-card ${ach.unlocked ? 'unlocked' : ''}">
      <div class="achievement-icon">${ach.icon}</div>
      <div class="achievement-title">${ach.title}</div>
      <div class="achievement-desc">${ach.desc}</div>
    </div>
  `).join('');
  checkAchievements();
}

function checkAchievements() {
  // Simulate achievement checks
  const totalGroups = document.getElementById('total-groups').textContent;
  if (parseInt(totalGroups) >= 5) {
    showNotification('تهانينا! حصلت على شارة "عضو نشيط"', 'success');
  }
}

// Update Stats
function updateStats() {
  document.getElementById('total-groups').textContent = parseInt(document.getElementById('total-groups').textContent) + 1;
  document.getElementById('active-groups').textContent = parseInt(document.getElementById('active-groups').textContent) + 1;
  document.getElementById('total-members').textContent = parseInt(document.getElementById('total-members').textContent) + parseInt(document.getElementById('group-members').value || 0);
  document.getElementById('total-amount').textContent = parseInt(document.getElementById('total-amount').textContent) + parseInt(document.getElementById('group額').value || 0);
}

// Load Charts
function loadCharts() {
  // Payment Chart (Pie)
  const paymentCtx = document.getElementById('payment-chart').getContext('2d');
  new Chart(paymentCtx, {
    type: 'pie',
    data: {
      labels: ['مدفوع', 'غير مدفوع', 'متأخر'],
      datasets: [{
        data: [70, 20, 10],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'نسبة السداد' }
      }
    }
  });

  // Delay Stats (Bar)
  const delayCtx = document.getElementById('delay-stats').getContext('2d');
  new Chart(delayCtx, {
    type: 'bar',
    data: {
      labels: ['أحمد', 'محمد', 'سارة'],
      datasets: [{
        label: 'عدد التأخيرات',
        data: [3, 1, 0],
        backgroundColor: '#ffc107'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        title: { display: true, text: 'إحصائيات التأخير' }
      }
    }
  });

  // Monthly Summary (Line)
  const monthlyCtx = document.getElementById('monthly-summary').getContext('2d');
  new Chart(monthlyCtx, {
    type: 'line',
    data: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل'],
      datasets: [{
        label: 'المدفوعات',
        data: [5000, 6000, 5500, 7000],
        borderColor: '#28a745',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'الملخص الشهري' }
      }
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadAchievements();
  loadAISuggestions();
  loadCharts();
  // Simulate a group for demo
  addGroupToList({
    id: 1,
    name: 'جمعية عينة',
    members: 10,
    amount: 1000,
    date: new Date().toISOString().split('T')[0],
    duration: 12,
    type: 'auto',
    privacy: 'public',
    status: 'active'
  });
  startCountdown(new Date().setDate(new Date().getDate() + 7));
});
