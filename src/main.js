const container = document.getElementById('mainContainer');
const sections = document.querySelectorAll('.section-panel');
const navDots = document.querySelectorAll('.nav-dot');
const progressBar = document.getElementById('progressBar');
const scrollHint = document.getElementById('scrollHint');
let currentSection = 0;
let isScrolling = false;
let scrollTimeout;

// Update active section based on scroll
function updateActiveSection() {
    const scrollLeft = container.scrollLeft;
    const sectionWidth = window.innerWidth;
    const newSection = Math.round(scrollLeft / sectionWidth);

    if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        currentSection = newSection;

        // Update nav dots
        navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });

        // Update section active class
        sections.forEach((section, index) => {
            section.classList.toggle('active', index === currentSection);
        });

        // Trigger KPI animation when reaching that section
        if (currentSection === 5) {
            setTimeout(animateKPIs, 500);
        }
    }

    // Update progress bar
    const maxScroll = container.scrollWidth - container.clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    progressBar.style.width = progress + '%';

    // Hide scroll hint after first scroll
    if (scrollLeft > 100) {
        scrollHint.style.opacity = '0';
    }
}

container.addEventListener('scroll', updateActiveSection);

// Scroll to section
window.scrollToSection = function (index) {
    if (index < 0 || index >= sections.length || isScrolling) return;
    isScrolling = true;
    const sectionWidth = window.innerWidth;
    container.scrollTo({
        left: index * sectionWidth,
        behavior: 'smooth'
    });
    setTimeout(() => { isScrolling = false; }, 800);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1);
    } else if (e.key === 'ArrowLeft' && currentSection > 0) {
        scrollToSection(currentSection - 1);
    }
});

// Mouse wheel horizontal scroll - convert vertical wheel to horizontal
container.addEventListener('wheel', (e) => {
    e.preventDefault();

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            scrollToSection(currentSection - 1);
        }
    }, 50);
}, { passive: false });

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (diff < 0 && currentSection > 0) {
            scrollToSection(currentSection - 1);
        }
    }
}

// Platform Tab Switching
window.switchPlatform = function (platform) {
    const messengerTab = document.getElementById('messengerTab');
    const smsTab = document.getElementById('smsTab');
    const messengerFlow = document.getElementById('messengerFlow');
    const smsFlow = document.getElementById('smsFlow');

    if (platform === 'messenger') {
        messengerTab.classList.add('tab-active', 'bg-blue-50');
        smsTab.classList.remove('tab-active', 'bg-blue-50');
        smsTab.classList.add('text-gray-500');
        messengerFlow.classList.remove('hidden');
        smsFlow.classList.add('hidden');
    } else {
        smsTab.classList.add('tab-active', 'bg-blue-50');
        messengerTab.classList.remove('tab-active', 'bg-blue-50');
        messengerTab.classList.add('text-gray-500');
        smsFlow.classList.remove('hidden');
        messengerFlow.classList.add('hidden');
    }
}

// Messenger Demo
const messengerMessages = [
    { sender: 'bot', text: "Magandang araw po! 👋 Welcome sa Barangay San Miguel Connect.\n\nPaki-type po ang inyong buong pangalan." },
    { sender: 'user', text: "Juan Dela Cruz" },
    { sender: 'bot', text: "Salamat, Juan! 📱 Ano po ang mobile number ninyo?" },
    { sender: 'user', text: "09171234567" },
    { sender: 'bot', text: "✅ Registered!\n\n1️⃣ Barangay Clearance\n2️⃣ Barangay ID\n3️⃣ Health Appointment\n4️⃣ Certificate of Indigency\n5️⃣ Other Services" },
    { sender: 'user', text: "1" },
    { sender: 'bot', text: "Barangay Clearance ✅\n\n📅 A - Jan 15, 9AM\n📅 B - Jan 15, 2PM\n📅 C - Jan 16, 9AM" },
    { sender: 'user', text: "A" },
    { sender: 'bot', text: "🎉 CONFIRMED!\n\n📋 Ref#: BRY-2024-00152\n📌 Barangay Clearance\n📅 Jan 15, 9:00 AM\n📍 Window 2\n\nSee you! 🙏" }
];

let messengerIndex = 0;

window.runMessengerDemo = function () {
    const chatContainer = document.getElementById('messengerChat');
    chatContainer.innerHTML = '';
    messengerIndex = 0;
    showNextMessengerMessage();
}

function showNextMessengerMessage() {
    if (messengerIndex >= messengerMessages.length) return;
    const msg = messengerMessages[messengerIndex];
    const chatContainer = document.getElementById('messengerChat');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`;
    const bgColor = msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white';
    bubble.innerHTML = `<div class="${bgColor} px-4 py-2 rounded-2xl max-w-xs text-sm whitespace-pre-line">${msg.text}</div>`;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    messengerIndex++;
    setTimeout(showNextMessengerMessage, 1200);
}

// SMS Demo
const smsMessages = [
    { sender: 'user', text: "BOOK" },
    { sender: 'bot', text: "BARANGAY SAN MIGUEL\n\n1-Clearance\n2-Brgy ID\n3-Health\n4-Indigency\n\nReply: [#] [Name]" },
    { sender: 'user', text: "1 Juan Dela Cruz" },
    { sender: 'bot', text: "Slots:\nA-Jan15 9AM\nB-Jan15 2PM\nC-Jan16 9AM\n\nReply letter." },
    { sender: 'user', text: "A" },
    { sender: 'bot', text: "CONFIRMED!\nRef#: BRY-2024-00152\nJan 15, 9AM\nWindow 2\n\nBring ID. Salamat!" }
];

let smsIndex = 0;

window.runSmsDemo = function () {
    const chatContainer = document.getElementById('smsChat');
    chatContainer.innerHTML = '';
    smsIndex = 0;
    showNextSmsMessage();
}

function showNextSmsMessage() {
    if (smsIndex >= smsMessages.length) return;
    const msg = smsMessages[smsIndex];
    const chatContainer = document.getElementById('smsChat');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`;
    const bgColor = msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white';
    bubble.innerHTML = `<div class="${bgColor} px-4 py-2 rounded-2xl max-w-xs text-sm whitespace-pre-line">${msg.text}</div>`;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    smsIndex++;
    setTimeout(showNextSmsMessage, 1400);
}

// Animate KPIs
window.animateKPIs = function () {
    animateValue('adoptionRate', 0, 32, 1500, '%');
    animateBar('adoptionBar', 80);
    animateValue('noShowRate', 0, 12, 1500, '%');
    animateBar('noShowBar', 80);
    animateValue('waitTime', 0, 12, 1500, '');
    animateBar('waitBar', 80);
    animateValue('satisfaction', 0, 4.6, 1500, '', true);
    animateBar('satBar', 92);
    animateValue('todayBookings', 0, 47, 1500);
    animateValue('currentQueue', 0, 8, 1500);
    animateValue('completedToday', 0, 39, 1500);
}

function animateValue(id, start, end, duration, suffix = '', isDecimal = false) {
    const element = document.getElementById(id);
    if (!element) return;
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = start + (range * easeOutQuart(progress));
        element.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function animateBar(id, targetWidth) {
    const bar = document.getElementById(id);
    if (bar) setTimeout(() => { bar.style.width = targetWidth + '%'; }, 100);
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Initialize first section as active
sections[0].classList.add('active');
