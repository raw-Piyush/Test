/* ==========================================================================
   Cute & Playful JavaScript Quiz & Mood Booster Engine
   ========================================================================== */

// --- Audio Synthesis Setup ---
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Cute synth sound: Pop (used when options escape or button clicks)
function playPop() {
    if (!soundEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) { console.log("Audio play error", e); }
}

// Cute synth sound: Dodge Whoosh
function playWhoosh() {
    if (!soundEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.18);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) { console.log("Audio play error", e); }
}

// Cute synth sound: Sweet success chime
function playSuccess() {
    if (!soundEnabled) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Ascending Arpeggio)
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            
            gain.gain.setValueAtTime(0, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
            
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.3);
        });
    } catch (e) { console.log("Audio play error", e); }
}

// Cute synth sound: Victory fanfare
function playVictory() {
    if (!soundEnabled) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        const notes = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 587.33, d: 0.12 }, // D5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.15 }, // G5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.15 }, // G5
            { f: 1046.50, d: 0.4 }  // C6
        ];
        let accumTime = 0;
        notes.forEach((note) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.f, now + accumTime);
            
            gain.gain.setValueAtTime(0, now + accumTime);
            gain.gain.linearRampToValueAtTime(0.1, now + accumTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + accumTime + note.d);
            
            osc.start(now + accumTime);
            osc.stop(now + accumTime + note.d + 0.05);
            accumTime += note.d * 0.85;
        });
    } catch (e) { console.log("Audio play error", e); }
}

// --- Canvas Particle Engine ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, type = 'heart', emoji = '❤️') {
        this.x = x;
        this.y = y;
        this.type = type; // 'heart', 'star', 'emoji'
        this.emoji = emoji;
        this.size = type === 'emoji' ? 24 + Math.random() * 16 : 8 + Math.random() * 8;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = type === 'emoji' ? -(2 + Math.random() * 5) : -(0.5 + Math.random() * 2);
        this.gravity = type === 'emoji' ? 0.15 : 0;
        this.opacity = 1;
        this.fadeSpeed = type === 'emoji' ? 0.015 : 0.005;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.opacity -= this.fadeSpeed;
        this.rotation += this.rotSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'emoji') {
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
        } else if (this.type === 'heart') {
            ctx.fillStyle = 'rgba(255, 133, 161, 0.6)';
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 4);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
            ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, -this.size / 4);
            ctx.fill();
        } else {
            // Star particle
            ctx.fillStyle = 'rgba(255, 224, 102, 0.7)';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size,
                           -Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
                ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size / 2),
                           -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size / 2));
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}

// Particle loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Auto-generate soft background floaters
    if (particles.filter(p => p.type !== 'emoji').length < 35 && Math.random() < 0.05) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            canvas.height + 20,
            Math.random() > 0.5 ? 'heart' : 'star'
        ));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateParticles);
}
requestAnimationFrame(animateParticles);

// Spawn bursts of items
function spawnBurst(x, y, count, type = 'emoji', emojiList = ['❤️', '✨']) {
    for (let i = 0; i < count; i++) {
        const selectedEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        particles.push(new Particle(x, y, type, selectedEmoji));
    }
}

// --- Quiz Questions Database ---
// Correct option keeps Piyush's image positive and DOES NOT escape.
// Negative options escape/dodge when interacted with.
const quizData = [
    {
        question: "Agar Shivi aur Piyush ki pyaari ladaai ho jaaye, toh sabse pehle sorry kaun bolega? 🤔",
        options: [
            { text: "Piyush! (Chaahe galti kisi ki bhi ho, he values friendship more!) ❤️", correct: true },
            { text: "Shivi (Vo toh bina gussa kiye reh hi nahi sakti)", correct: false },
            { text: "Koi nahi bolega, ego is more important", correct: false }
        ]
    },
    {
        question: "Piyush ki sabse achhi quality kya hai according to Shivi? 🌟",
        options: [
            { text: "He is super caring, supports Shivi, and can always bring a smile! 🥰", correct: true },
            { text: "He is extremely lazy and does absolutely nothing all day", correct: false },
            { text: "He ignores Shivi and forgets to reply to messages for weeks", correct: false }
        ]
    },
    {
        question: "Piyush kitna intelligent hai? 🧠",
        options: [
            { text: "Smartest! Einstein se thoda hi kam, basically Shivi ke puzzles solve kar leta h", correct: true },
            { text: "He has zero brain cells, totally blank", correct: false },
            { text: "His brain is only used for sleeping and eating junk", correct: false }
        ]
    },
    {
        question: "Shivi ke gusse ko melt karne ka secret recipe kiske paas hai? 🧪🍫",
        options: [
            { text: "Piyush! with his cute messages, jokes, and virtual sweet treats! 🌸", correct: true },
            { text: "Kisi ke paas nahi, Shivi hamesha gussa hi rehti h", correct: false },
            { text: "Shivi apne aap hi thak ke thandi ho jaati hai", correct: false }
        ]
    },
    {
        question: "Piyush ne ye cute webpage Shivi ke liye kyun banaya? ✨🎨",
        options: [
            { text: "Kyunki Shivi ki smile and khushi Piyush ke liye sabse zyada matter karti h! 😊💝", correct: true },
            { text: "Kyunki uske paas koi kaam nahi tha and he wanted to irritate her", correct: false },
            { text: "Bas time pass karne ke liye bina kisi reason ke", correct: false }
        ]
    }
];

// Funny dodge messages shown in the hints box
const dodgeQuotes = [
    "Aiyoo! Ye wala option click nahi ho payega 😜",
    "Nope! Try picking a nice option! 🌸",
    "Piyush ne ispe security lock laga rakha hai! 🔐",
    "Oops! Button bhaag gaya! 🏃‍♀️💨",
    "Try another option, Piyush is good! 😄✨",
    "Ahaha! You missed! 🎯",
    "Negative comments are blocked on this server! 🚫"
];

let currentQuestionIndex = 0;

// --- DOM Elements ---
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const victoryScreen = document.getElementById('victory-screen');

const startQuizBtn = document.getElementById('start-quiz-btn');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');

const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizHintBox = document.getElementById('quiz-hint-box');

// Victory Screen interactive buttons
const complimentBtn = document.getElementById('compliment-btn');
const flowerBtn = document.getElementById('flower-btn');
const chocolateBtn = document.getElementById('chocolate-btn');
const complimentOutput = document.getElementById('compliment-output');

// --- Sound Controls ---
soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
    playPop();
});

// --- Screen Switching Logic ---
function showScreen(screen) {
    [welcomeScreen, quizScreen, victoryScreen].forEach(s => s.classList.remove('active-screen'));
    screen.classList.add('active-screen');
}

// --- Start Game ---
startQuizBtn.addEventListener('click', () => {
    initAudio();
    playPop();
    showScreen(quizScreen);
    loadQuestion(0);
});

// --- Quiz Rendering & Mechanics ---
function loadQuestion(index) {
    currentQuestionIndex = index;
    quizHintBox.textContent = "";
    
    const currentQ = quizData[index];
    
    // Progress setup
    const progressPercent = ((index + 1) / quizData.length) * 100;
    progressBarFill.style.width = `${progressPercent}%`;
    progressText.textContent = `Question ${index + 1} of ${quizData.length}`;
    
    // Question Text
    questionText.textContent = currentQ.question;
    
    // Reset option container children
    optionsContainer.innerHTML = "";
    
    // Render options
    currentQ.options.forEach((opt, idx) => {
        const button = document.createElement('button');
        // Cute candy gradients color classes
        const colorClasses = ['opt-pink', 'opt-peach', 'opt-blue'];
        const colorClass = colorClasses[idx % colorClasses.length];
        button.className = `option-btn ${colorClass}`;
        button.id = `opt-btn-${idx}`;
        
        // Option Indicator circle
        const indicator = document.createElement('span');
        indicator.className = 'option-indicator';
        indicator.textContent = String.fromCharCode(65 + idx); // A, B, C...
        
        const labelText = document.createTextNode(opt.text);
        
        button.appendChild(indicator);
        button.appendChild(labelText);
        
        // Add events
        if (opt.correct) {
            // Correct Option
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top, 15, 'emoji', ['💖', '✨', '🌸', '🥳']);
                playSuccess();
                
                // Animate progress to next question
                button.style.background = '#E8F5E9';
                button.style.borderColor = '#4CAF50';
                button.disabled = true;
                
                setTimeout(() => {
                    if (currentQuestionIndex + 1 < quizData.length) {
                        loadQuestion(currentQuestionIndex + 1);
                    } else {
                        finishQuiz();
                    }
                }, 800);
            });
        } else {
            // Escaping Option (Dodge behavior)
            let lastDodgeTime = 0;
            const dodgeHandler = (e) => {
                // Prevent multiple firing within 120ms to remove UI lag & double triggers
                const now = Date.now();
                if (now - lastDodgeTime < 120) return;
                lastDodgeTime = now;
                
                if (e.type === 'touchstart') {
                    e.preventDefault();
                }
                
                playWhoosh();
                
                // Show a random dodge message
                const randomMsg = dodgeQuotes[Math.floor(Math.random() * dodgeQuotes.length)];
                quizHintBox.textContent = randomMsg;
                
                // Let the particle emitter burst cute run emojis
                const rect = button.getBoundingClientRect();
                spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 5, 'emoji', ['🏃‍♀️', '💨', '😜']);
                
                // Bounded dodge inside container
                dodgeButton(button);
            };
            
            // Listen on touchstart and click to dodge immediately when selected, not on hover
            button.addEventListener('touchstart', dodgeHandler, { passive: false });
            
            // Trigger dodge on click
            button.addEventListener('click', (e) => {
                e.preventDefault();
                dodgeHandler(e);
            });
        }
        
        optionsContainer.appendChild(button);
    });
}

// Logic to move the button to a random safe coordinate inside the card
function dodgeButton(btn) {
    if (!btn.classList.contains('dodging')) {
        // Freeze original layout width/height before making absolute to prevent collapsing
        const originalWidth = btn.offsetWidth;
        const originalHeight = btn.offsetHeight;
        btn.style.width = `${originalWidth}px`;
        btn.style.height = `${originalHeight}px`;
        
        // Add an invisible placeholder to keep layout stable and prevent grid shifting
        let placeholder = document.getElementById(`placeholder-${btn.id}`);
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.id = `placeholder-${btn.id}`;
            placeholder.style.width = `${originalWidth}px`;
            placeholder.style.height = `${originalHeight}px`;
            placeholder.style.margin = window.getComputedStyle(btn).margin;
            placeholder.style.visibility = 'hidden';
            btn.parentNode.insertBefore(placeholder, btn);
        }
        
        btn.classList.add('dodging');
    }
    
    // Bounds boundaries based on optionsContainer (the parent card element area)
    const containerW = optionsContainer.clientWidth;
    const containerH = optionsContainer.clientHeight;
    const btnW = btn.offsetWidth || 220;
    const btnH = btn.offsetHeight || 50;
    
    const maxX = Math.max(10, containerW - btnW);
    const maxY = Math.max(10, containerH - btnH);
    
    // Determine current position quadrant
    const curLeft = parseFloat(btn.style.left) || btn.offsetLeft;
    const curTop = parseFloat(btn.style.top) || btn.offsetTop;
    
    const isLeft = curLeft < containerW / 2;
    const isTop = curTop < containerH / 2;
    
    // Target Quadrant Coordinates
    let targets = [];
    if (isLeft && isTop) {
        targets = [
            { x: [containerW / 2, maxX], y: [0, containerH / 2] },     // Top Right
            { x: [0, containerW / 2], y: [containerH / 2, maxY] },     // Bottom Left
            { x: [containerW / 2, maxX], y: [containerH / 2, maxY] }   // Bottom Right
        ];
    } else if (!isLeft && isTop) {
        targets = [
            { x: [0, containerW / 2], y: [0, containerH / 2] },     // Top Left
            { x: [0, containerW / 2], y: [containerH / 2, maxY] },     // Bottom Left
            { x: [containerW / 2, maxX], y: [containerH / 2, maxY] }   // Bottom Right
        ];
    } else if (isLeft && !isTop) {
        targets = [
            { x: [0, containerW / 2], y: [0, containerH / 2] },     // Top Left
            { x: [containerW / 2, maxX], y: [0, containerH / 2] },     // Top Right
            { x: [containerW / 2, maxX], y: [containerH / 2, maxY] }   // Bottom Right
        ];
    } else {
        targets = [
            { x: [0, containerW / 2], y: [0, containerH / 2] },     // Top Left
            { x: [containerW / 2, maxX], y: [0, containerH / 2] },     // Top Right
            { x: [0, containerW / 2], y: [containerH / 2, maxY] }      // Bottom Left
        ];
    }
    
    // Pick target quadrant randomly
    const q = targets[Math.floor(Math.random() * targets.length)];
    const pad = 12; // safe inner padding
    
    const xMin = Math.min(q.x[0], q.x[1]);
    const xMax = Math.max(q.x[0], q.x[1]);
    const yMin = Math.min(q.y[0], q.y[1]);
    const yMax = Math.max(q.y[0], q.y[1]);
    
    let newX = xMin + pad + Math.random() * (xMax - xMin - pad * 2);
    let newY = yMin + pad + Math.random() * (yMax - yMin - pad * 2);
    
    newX = Math.max(pad, Math.min(newX, maxX - pad));
    newY = Math.max(pad, Math.min(newY, maxY - pad));
    
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
}

// --- Victory / Final Screen Setup ---
function finishQuiz() {
    playVictory();
    showScreen(victoryScreen);
    
    // Spawn massive confetti burst from middle bottom
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight - 50;
    spawnBurst(startX, startY, 40, 'emoji', ['🎉', '💖', '✨', '👑', '🌈', '💐']);
    
    // Set off delayed bursts
    setTimeout(() => {
        spawnBurst(window.innerWidth * 0.25, window.innerHeight * 0.3, 20, 'emoji', ['🎈', '🌸', '✨']);
        spawnBurst(window.innerWidth * 0.75, window.innerHeight * 0.3, 20, 'emoji', ['🎈', '🌸', '✨']);
    }, 600);
}

// --- Interactive Mood Boosters ---
const compliments = [
    "Piyush believes Shivi's smile is easily the most beautiful thing in the world! 😊💖",
    "Shivi is officially the World Champion of being cute & bubbly! 🧸🏆",
    "Piyush says Shivi is a certified genius (except when she starts arguing) 😜🧠",
    "Warning: Shivi's cuteness levels are breaking the website! 📈🌸",
    "If laughing at silly jokes was an Olympic sport, Shivi would have a gold medal! 🥇😂",
    "Piyush promises to always listen to Shivi's long stories (even if he yawns) 😴🎤",
    "Shivi's advice is 99% accurate! The remaining 1% is when she says Piyush is annoying! 🤐",
    "No matter how grumpy Shivi gets, she is still Piyush's favorite partner-in-crime! 🤠💖"
];

let lastComplimentIndex = -1;

complimentBtn.addEventListener('click', (e) => {
    playPop();
    const rect = complimentBtn.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top, 8, 'emoji', ['💡', '✨', '💛']);
    
    // Select a unique compliment
    let randIdx;
    do {
        randIdx = Math.floor(Math.random() * compliments.length);
    } while (randIdx === lastComplimentIndex);
    
    lastComplimentIndex = randIdx;
    
    complimentOutput.textContent = compliments[randIdx];
    complimentOutput.style.display = 'block';
    complimentOutput.classList.remove('scale-in');
    void complimentOutput.offsetWidth; // Trigger reflow for animation reset
    complimentOutput.classList.add('scale-in');
});

flowerBtn.addEventListener('click', (e) => {
    playSuccess();
    const rect = flowerBtn.getBoundingClientRect();
    // Emitter burst
    spawnBurst(rect.left + rect.width / 2, rect.top, 15, 'emoji', ['🌸', '🌺', '🌹', '🌻', '🌷', '🌼']);
    
    // Also drop flowers from the top of the screen to simulate a rain
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            particles.push(new Particle(
                Math.random() * window.innerWidth,
                -20,
                'emoji',
                ['🌸', '🌺', '🌹', '🌻', '🌷', '🌼'][Math.floor(Math.random() * 6)]
            ));
        }, i * 150);
    }
});

chocolateBtn.addEventListener('click', (e) => {
    playSuccess();
    const rect = chocolateBtn.getBoundingClientRect();
    // Emitter burst
    spawnBurst(rect.left + rect.width / 2, rect.top, 15, 'emoji', ['🍫', '🍩', '🍪', '🍬', '🍭']);
    
    // Rain chocolates
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            particles.push(new Particle(
                Math.random() * window.innerWidth,
                -20,
                'emoji',
                ['🍫', '🍩', '🍪', '🍬', '🍭'][Math.floor(Math.random() * 5)]
            ));
        }, i * 150);
    }
});
