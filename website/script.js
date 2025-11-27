// State
let currentSection = 0;
const totalSections = 6;
let isTransitioning = false;

// DOM Elements
const sections = document.querySelectorAll('.section-panel');
const navDots = document.querySelectorAll('.nav-dot');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentNum = document.getElementById('currentNum');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initButtons();
    initScrolling();
});

// Go to Section
function goToSection(index) {
    if (index < 0 || index >= totalSections || isTransitioning || index === currentSection) return;

    isTransitioning = true;
    currentSection = index;

    // Update sections
    sections.forEach((section, i) => {
        section.classList.toggle('active', i === currentSection);
    });

    // Update nav dots
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSection);
    });

    // Update progress
    progressBar.style.width = ((currentSection + 1) / totalSections * 100) + '%';

    // Update counter
    currentNum.textContent = currentSection + 1;
    prevBtn.disabled = currentSection === 0;
    nextBtn.disabled = currentSection === totalSections - 1;

    // Animate KPIs on last section
    if (currentSection === 5) {
        setTimeout(animateKPIs, 600);
    }

    setTimeout(() => { isTransitioning = false; }, 800);
}

// Navigation
function initNavigation() {
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSection(index));
    });

    prevBtn.addEventListener('click', () => goToSection(currentSection - 1));
    nextBtn.addEventListener('click', () => goToSection(currentSection + 1));
}

// Button Handlers
function initButtons() {
    document.getElementById('exploreBtn').addEventListener('click', () => goToSection(1));

    document.getElementById('messengerTab').addEventListener('click', () => switchFlow('messenger'));
    document.getElementById('smsTab').addEventListener('click', () => switchFlow('sms'));

    document.getElementById('runMessengerBtn').addEventListener('click', runMessengerDemo);
    document.getElementById('runSmsBtn').addEventListener('click', runSmsDemo);

    document.getElementById('refreshKpiBtn').addEventListener('click', animateKPIs);
}

// Scroll/Keyboard
function initScrolling() {
    let lastWheel = 0;

    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastWheel < 1000) return;
        lastWheel = now;

        if (e.deltaY > 0) goToSection(currentSection + 1);
        else goToSection(currentSection - 1);
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSection(currentSection + 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSection(currentSection - 1);
    });

    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
    document.addEventListener('touchend', (e) => {
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSection(currentSection + 1);
            else goToSection(currentSection - 1);
        }
    });
}

// Flow Switch
function switchFlow(platform) {
    const messengerTab = document.getElementById('messengerTab');
    const smsTab = document.getElementById('smsTab');
    const messengerFlow = document.getElementById('messengerFlow');
    const smsFlow = document.getElementById('smsFlow');

    if (platform === 'messenger') {
        messengerTab.classList.add('bg-white/20');
        messengerTab.classList.remove('text-white/60');
        smsTab.classList.remove('bg-white/20');
        smsTab.classList.add('text-white/60');
        messengerFlow.classList.remove('hidden');
        smsFlow.classList.add('hidden');
    } else {
        smsTab.classList.add('bg-white/20');
        smsTab.classList.remove('text-white/60');
        messengerTab.classList.remove('bg-white/20');
        messengerTab.classList.add('text-white/60');
        smsFlow.classList.remove('hidden');
        messengerFlow.classList.add('hidden');
    }
}

// Messenger Demo
const messengerMessages = [
    { sender: 'bot', text: "👋 Magandang araw! Welcome sa Barangay San Miguel Connect.\n\nPaki-type po ang inyong pangalan." },
    { sender: 'user', text: "Juan Dela Cruz" },
    { sender: 'bot', text: "Salamat Juan! 📱 Ano po ang mobile number ninyo?" },
    { sender: 'user', text: "09171234567" },
    { sender: 'bot', text: "✅ Registered!\n\n1️⃣ Barangay Clearance\n2️⃣ Barangay ID\n3️⃣ Health Appointment\n4️⃣ Certificate of Indigency" },
    { sender: 'user', text: "1" },
    { sender: 'bot', text: "📅 Available Slots:\nA - Jan 15, 9AM\nB - Jan 15, 2PM\nC - Jan 16, 9AM" },
    { sender: 'user', text: "A" },
    { sender: 'bot', text: "🎉 CONFIRMED!\n\n📋 Ref#: BRY-2024-00152\n📌 Barangay Clearance\n📅 Jan 15, 9:00 AM\n📍 Window 2\n\nSee you po! 🙏" }
];

let msgIndex = 0;
function runMessengerDemo() {
    const chat = document.getElementById('messengerChat');
    chat.innerHTML = '';
    msgIndex = 0;
    showNextMsg();
}

function showNextMsg() {
    if (msgIndex >= messengerMessages.length) return;
    const msg = messengerMessages[msgIndex];
    const chat = document.getElementById('messengerChat');
    const div = document.createElement('div');
    div.className = `chat-bubble flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`;
    const bg = msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-600';
    div.innerHTML = `<div class="${bg} text-white px-3 py-2 rounded-xl max-w-[80%] text-xs whitespace-pre-line">${msg.text}</div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    msgIndex++;
    setTimeout(showNextMsg, 1000);
}

// SMS Demo
const smsMessages = [
    { sender: 'user', text: "BOOK" },
    { sender: 'bot', text: "BARANGAY SAN MIGUEL\n1-Clearance\n2-Brgy ID\n3-Health\n4-Indigency\n\nReply: [#] [Name]" },
    { sender: 'user', text: "1 Juan Dela Cruz" },
    { sender: 'bot', text: "Slots:\nA-Jan15 9AM\nB-Jan15 2PM\nC-Jan16 9AM\n\nReply letter." },
    { sender: 'user', text: "A" },
    { sender: 'bot', text: "CONFIRMED!\nRef#: BRY-2024-00152\nJan 15, 9AM\nWindow 2\n\nBring ID. Salamat!" }
];

let smsIndex = 0;
function runSmsDemo() {
    const chat = document.getElementById('smsChat');
    chat.innerHTML = '';
    smsIndex = 0;
    showNextSms();
}

function showNextSms() {
    if (smsIndex >= smsMessages.length) return;
    const msg = smsMessages[smsIndex];
    const chat = document.getElementById('smsChat');
    const div = document.createElement('div');
    div.className = `chat-bubble flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`;
    const bg = msg.sender === 'user' ? 'bg-green-500' : 'bg-gray-600';
    div.innerHTML = `<div class="${bg} text-white px-3 py-2 rounded-xl max-w-[80%] text-xs whitespace-pre-line">${msg.text}</div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    smsIndex++;
    setTimeout(showNextSms, 1200);
}

// Animate KPIs
function animateKPIs() {
    animateValue('adoptionRate', 0, 32, 1500, '%');
    document.getElementById('adoptionBar').style.width = '80%';

    animateValue('noShowRate', 0, 12, 1500, '%');
    document.getElementById('noShowBar').style.width = '80%';

    animateValue('waitTime', 0, 12, 1500, '');
    document.getElementById('waitBar').style.width = '80%';

    animateValue('satisfaction', 0, 4.6, 1500, '', true);
    document.getElementById('satBar').style.width = '92%';

    animateValue('todayBookings', 0, 47, 1500);
    animateValue('currentQueue', 0, 8, 1500);
    animateValue('completedToday', 0, 39, 1500);
}

function animateValue(id, start, end, duration, suffix = '', decimal = false) {
    const el = document.getElementById(id);
    const range = end - start;
    const startTime = performance.now();

    function update(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const value = start + range * easeOut(progress);
        el.textContent = (decimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function easeOut(x) {
    return 1 - Math.pow(1 - x, 4);
}
