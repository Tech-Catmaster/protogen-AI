// ═══════════════════════════════════════════════════════════
// PROTOGEN AI — Voice-First Companion v2.0
// DIRECT ANSWERS ONLY · No "look at new tab" messages
// Wake word: "Bingo" · Martin is CEO of Protogen AI under HECO AFRICA
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SONGS — 130 TRACKS (expanded)
// ═══════════════════════════════════════════════════════════
const SONGS = [
    { t: "Blinding Lights", a: "The Weeknd", g: "Pop", mood: "upbeat" },
    { t: "Shape of You", a: "Ed Sheeran", g: "Pop", mood: "upbeat" },
    { t: "Bohemian Rhapsody", a: "Queen", g: "Rock", mood: "epic" },
    { t: "Uptown Funk", a: "Mark Ronson ft. Bruno Mars", g: "Pop", mood: "upbeat" },
    { t: "Thinking Out Loud", a: "Ed Sheeran", g: "Pop", mood: "chill" },
    { t: "Stay With Me", a: "Sam Smith", g: "Soul", mood: "sad" },
    { t: "Rolling in the Deep", a: "Adele", g: "Soul", mood: "powerful" },
    { t: "Someone Like You", a: "Adele", g: "Soul", mood: "sad" },
    { t: "Perfect", a: "Ed Sheeran", g: "Pop", mood: "romantic" },
    { t: "Levitating", a: "Dua Lipa", g: "Pop", mood: "upbeat" },
    { t: "Dance Monkey", a: "Tones and I", g: "Pop", mood: "upbeat" },
    { t: "Watermelon Sugar", a: "Harry Styles", g: "Pop", mood: "chill" },
    { t: "Drivers License", a: "Olivia Rodrigo", g: "Pop", mood: "sad" },
    { t: "Peaches", a: "Justin Bieber", g: "Pop", mood: "chill" },
    { t: "Montero", a: "Lil Nas X", g: "Rap", mood: "upbeat" },
    { t: "Good 4 U", a: "Olivia Rodrigo", g: "Pop Rock", mood: "upbeat" },
    { t: "Bad Guy", a: "Billie Eilish", g: "Electropop", mood: "chill" },
    { t: "Old Town Road", a: "Lil Nas X", g: "Country Rap", mood: "upbeat" },
    { t: "Dynamite", a: "BTS", g: "K-Pop", mood: "upbeat" },
    { t: "Butter", a: "BTS", g: "K-Pop", mood: "upbeat" },
    { t: "As It Was", a: "Harry Styles", g: "Pop", mood: "chill" },
    { t: "Easy On Me", a: "Adele", g: "Soul", mood: "sad" },
    { t: "Stay", a: "The Kid LAROI & Justin Bieber", g: "Pop", mood: "upbeat" },
    { t: "Industry Baby", a: "Lil Nas X & Jack Harlow", g: "Rap", mood: "upbeat" },
    { t: "Heat Waves", a: "Glass Animals", g: "Indie", mood: "chill" },
    { t: "Shivers", a: "Ed Sheeran", g: "Pop", mood: "upbeat" },
    { t: "Love Story", a: "Taylor Swift", g: "Country Pop", mood: "romantic" },
    { t: "Anti-Hero", a: "Taylor Swift", g: "Pop", mood: "chill" },
    { t: "Shake It Off", a: "Taylor Swift", g: "Pop", mood: "upbeat" },
    { t: "Blank Space", a: "Taylor Swift", g: "Pop", mood: "upbeat" },
    { t: "Flowers", a: "Miley Cyrus", g: "Pop", mood: "upbeat" },
    { t: "Unholy", a: "Sam Smith & Kim Petras", g: "Pop", mood: "upbeat" },
    { t: "Creepin", a: "Metro Boomin & The Weeknd", g: "R&B", mood: "chill" },
    { t: "Calm Down", a: "Rema & Selena Gomez", g: "Afrobeats", mood: "chill" },
    { t: "Essence", a: "Wizkid ft. Tems", g: "Afrobeats", mood: "chill" },
    { t: "Peru", a: "Fireboy DML & Ed Sheeran", g: "Afropop", mood: "upbeat" },
    { t: "Sungba", a: "Asake", g: "Afrobeats", mood: "upbeat" },
    { t: "Rush", a: "Ayra Starr", g: "Afropop", mood: "upbeat" },
    { t: "Mnike", a: "Tyler ICU & Tumelo.za", g: "Amapiano", mood: "upbeat" },
    { t: "Sere", a: "Omah Lay", g: "Afropop", mood: "chill" },
    { t: "Overloading", a: "Burna Boy", g: "Afrobeats", mood: "upbeat" },
    { t: "Last Last", a: "Burna Boy", g: "Afrobeats", mood: "sad" },
    { t: "Ye", a: "Burna Boy", g: "Afrobeats", mood: "chill" },
    { t: "Love Nwantiti", a: "CKay", g: "Afropop", mood: "romantic" },
    { t: "Electricity", a: "Davido", g: "Afrobeats", mood: "upbeat" },
    { t: "FEM", a: "Davido", g: "Afrobeats", mood: "upbeat" },
    { t: "Soro Soke", a: "Olamide", g: "Afropop", mood: "upbeat" },
    { t: "Finesse", a: "Pheelz & BNXN", g: "Afropop", mood: "upbeat" },
    { t: "Jericho", a: "Rema", g: "Afrobeats", mood: "chill" },
    { t: "Bounce", a: "Rema", g: "Afrobeats", mood: "upbeat" },
    { t: "Midnight", a: "Tiwa Savage", g: "Afropop", mood: "romantic" },
    { t: "Makeba", a: "Jain", g: "World", mood: "upbeat" },
    { t: "Jerusalema", a: "Master KG ft. Nomcebo", g: "Gospel Afro", mood: "upbeat" },
    { t: "Bambelela", a: "Various Artists", g: "Gospel", mood: "upbeat" },
    { t: "Unavailable", a: "Davido ft. Musa Keys", g: "Amapiano", mood: "upbeat" },
    { t: "Love Language", a: "Ludmilla", g: "Funk", mood: "upbeat" },
    { t: "As Long As You Love Me", a: "Backstreet Boys", g: "Pop", mood: "romantic" },
    { t: "I Want It That Way", a: "Backstreet Boys", g: "Pop", mood: "romantic" },
    { t: "Billie Jean", a: "Michael Jackson", g: "Pop", mood: "upbeat" },
    { t: "Thriller", a: "Michael Jackson", g: "Pop", mood: "epic" },
    { t: "Beat It", a: "Michael Jackson", g: "Pop", mood: "upbeat" },
    { t: "PYT", a: "Michael Jackson", g: "Pop", mood: "upbeat" },
    { t: "Smooth Criminal", a: "Michael Jackson", g: "Pop", mood: "upbeat" },
    { t: "Superstition", a: "Stevie Wonder", g: "Soul", mood: "upbeat" },
    { t: "Isn't She Lovely", a: "Stevie Wonder", g: "Soul", mood: "romantic" },
    { t: "Higher Ground", a: "Stevie Wonder", g: "Soul", mood: "upbeat" },
    { t: "I Will Always Love You", a: "Whitney Houston", g: "R&B", mood: "romantic" },
    { t: "Greatest Love of All", a: "Whitney Houston", g: "R&B", mood: "powerful" },
    { t: "One Moment in Time", a: "Whitney Houston", g: "Pop", mood: "powerful" },
    { t: "My Heart Will Go On", a: "Celine Dion", g: "Pop", mood: "sad" },
    { t: "The Power of Love", a: "Celine Dion", g: "Pop", mood: "romantic" },
    { t: "Killing Me Softly", a: "Fugees", g: "Hip-Hop", mood: "chill" },
    { t: "Ready or Not", a: "Fugees", g: "Hip-Hop", mood: "chill" },
    { t: "No Scrubs", a: "TLC", g: "R&B", mood: "upbeat" },
    { t: "Waterfalls", a: "TLC", g: "R&B", mood: "chill" },
    { t: "Creep", a: "TLC", g: "R&B", mood: "sad" },
    { t: "Lose Yourself", a: "Eminem", g: "Rap", mood: "powerful" },
    { t: "Stan", a: "Eminem", g: "Rap", mood: "powerful" },
    { t: "Without Me", a: "Eminem", g: "Rap", mood: "upbeat" },
    { t: "In Da Club", a: "50 Cent", g: "Rap", mood: "upbeat" },
    { t: "Gold Digger", a: "Kanye West", g: "Hip-Hop", mood: "upbeat" },
    { t: "HUMBLE.", a: "Kendrick Lamar", g: "Hip-Hop", mood: "powerful" },
    { t: "DNA.", a: "Kendrick Lamar", g: "Hip-Hop", mood: "powerful" },
    { t: "God's Plan", a: "Drake", g: "Hip-Hop", mood: "chill" },
    { t: "One Dance", a: "Drake", g: "Dancehall", mood: "chill" },
    { t: "Hotline Bling", a: "Drake", g: "R&B", mood: "chill" },
    { t: "XO Tour Llif3", a: "Lil Uzi Vert", g: "Emo Rap", mood: "sad" },
    { t: "Rockstar", a: "Post Malone ft. 21 Savage", g: "Rap", mood: "chill" },
    { t: "Sunflower", a: "Post Malone & Swae Lee", g: "Pop", mood: "chill" },
    { t: "Circles", a: "Post Malone", g: "Pop", mood: "sad" },
    { t: "Savage Love", a: "Jawsh 685 & Jason Derulo", g: "Pop", mood: "upbeat" },
    { t: "Take You Dancing", a: "Jason Derulo", g: "Pop", mood: "upbeat" },
    { t: "Mood", a: "24kGoldn ft. iann dior", g: "Pop Rap", mood: "upbeat" },
    { t: "Therefore I Am", a: "Billie Eilish", g: "Pop", mood: "chill" },
    { t: "Happier Than Ever", a: "Billie Eilish", g: "Pop", mood: "powerful" },
    { t: "positions", a: "Ariana Grande", g: "R&B", mood: "romantic" },
    { t: "7 rings", a: "Ariana Grande", g: "Pop", mood: "upbeat" },
    { t: "Thank U Next", a: "Ariana Grande", g: "Pop", mood: "upbeat" },
    { t: "Rain On Me", a: "Lady Gaga & Ariana Grande", g: "Dance Pop", mood: "upbeat" },
    { t: "Shallow", a: "Lady Gaga & Bradley Cooper", g: "Pop Rock", mood: "powerful" },
    // New tracks
    { t: "Cruel Summer", a: "Taylor Swift", g: "Pop", mood: "upbeat" },
    { t: "Karma", a: "Taylor Swift", g: "Pop", mood: "upbeat" },
    { t: "Midnight Rain", a: "Taylor Swift", g: "Pop", mood: "chill" },
    { t: "Flowers (Remix)", a: "Miley Cyrus & Sia", g: "Pop", mood: "upbeat" },
    { t: "Vampire", a: "Olivia Rodrigo", g: "Pop Rock", mood: "powerful" },
    { t: "bad idea right?", a: "Olivia Rodrigo", g: "Pop Rock", mood: "upbeat" },
    { t: "Ciao Adios", a: "Anne-Marie", g: "Pop", mood: "upbeat" },
    { t: "Rockabye", a: "Clean Bandit ft. Anne-Marie", g: "Dance Pop", mood: "powerful" },
    { t: "Afrobeats", a: "Adekunle Gold", g: "Afropop", mood: "chill" },
    { t: "Pretty Girl", a: "Ayra Starr", g: "Afropop", mood: "chill" },
    { t: "Soweto", a: "Victony", g: "Afropop", mood: "romantic" },
    { t: "Celebrate", a: "Victony", g: "Afropop", mood: "upbeat" },
    { t: "Angel", a: "Shallipopi", g: "Afropop", mood: "chill" },
    { t: "Commas", a: "Asake", g: "Afrobeats", mood: "upbeat" },
    { t: "Yoga", a: "Asake", g: "Afrobeats", mood: "upbeat" },
    { t: "Doja", a: "Asake", g: "Afrobeats", mood: "upbeat" },
    { t: "Rich Flex", a: "Drake & 21 Savage", g: "Hip-Hop", mood: "upbeat" },
    { t: "Knife Talk", a: "Drake ft. 21 Savage", g: "Hip-Hop", mood: "powerful" },
    { t: "Another Day in Paradise", a: "Phil Collins", g: "Pop", mood: "sad" },
    { t: "In the Air Tonight", a: "Phil Collins", g: "Rock", mood: "powerful" },
    { t: "Africa", a: "Toto", g: "Rock", mood: "epic" },
    { t: "Eye of the Tiger", a: "Survivor", g: "Rock", mood: "powerful" },
    { t: "Don't Stop Believin'", a: "Journey", g: "Rock", mood: "upbeat" },
    { t: "Hotel California", a: "Eagles", g: "Rock", mood: "chill" },
    { t: "Stairway to Heaven", a: "Led Zeppelin", g: "Rock", mood: "epic" },
    { t: "Smells Like Teen Spirit", a: "Nirvana", g: "Rock", mood: "powerful" },
    { t: "Wonderwall", a: "Oasis", g: "Rock", mood: "chill" },
    { t: "Mr. Brightside", a: "The Killers", g: "Rock", mood: "upbeat" }
];

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let voiceGender = 'auto';
let personality = 'lutherking';
let activeLang = 'en-US';
let audioUnlocked = false;

// Music
let curSong = -1, playing = false, songPos = 0, songDur = 220, progTmr = null, vol = 0.8;
let audioCtx = null, gainNode = null;
let shuffleMode = false, repeatMode = false;
let lastSong = -1;
let songHistory = [];

// Timers & reminders
let activeTimers = [];

// Trivia
const triviaQuestions = [
    { q: "What is the largest ocean?", a: "Pacific", choices: ["Atlantic", "Pacific", "Indian", "Arctic"] },
    { q: "How many sides does a hexagon have?", a: "6", choices: ["5", "6", "7", "8"] },
    { q: "What planet is called the Red Planet?", a: "Mars", choices: ["Venus", "Jupiter", "Mars", "Saturn"] },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", choices: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Picasso"] },
    { q: "What is the chemical symbol for gold?", a: "Au", choices: ["Go", "Gd", "Au", "Ag"] },
    { q: "How many bones are in the human body?", a: "206", choices: ["196", "206", "216", "226"] },
    { q: "What is the fastest land animal?", a: "Cheetah", choices: ["Lion", "Horse", "Cheetah", "Greyhound"] },
    { q: "In what year did World War II end?", a: "1945", choices: ["1942", "1943", "1944", "1945"] },
    { q: "What is the capital of Australia?", a: "Canberra", choices: ["Sydney", "Melbourne", "Canberra", "Brisbane"] },
    { q: "Who wrote Romeo and Juliet?", a: "Shakespeare", choices: ["Dickens", "Shakespeare", "Chaucer", "Marlowe"] }
];
let triviaActive = false, triviaIdx = -1, triviaScore = 0, triviaTotal = 0;

// Responsive detection
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ═══════════════════════════════════════════════════════════
// UNLOCK AUDIO FOR CHROME
// ═══════════════════════════════════════════════════════════
function unlockAudio() {
    if (audioUnlocked) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = vol;
        gainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audioUnlocked = true;
}

// ═══════════════════════════════════════════════════════════
// SPEECH RECOGNITION
// ═══════════════════════════════════════════════════════════
const VR = {
    wake: null, chat: null, chatActive: false, wakeActive: false, finalText: '',

    stopAll() {
        try { if (this.wake) { this.wake.abort(); this.wake = null; } } catch (e) { }
        try { if (this.chat) { this.chat.abort(); this.chat = null; } } catch (e) { }
        this.chatActive = false; this.wakeActive = false;
    },

    startWake() {
        if (this.chatActive || this.wakeActive) return;
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return;
        this.stopAll();
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.wake = new SR();
        this.wake.continuous = true;
        this.wake.interimResults = true;
        this.wake.lang = 'en-US';
        this.wakeActive = true;
        this.wake.onresult = (e) => {
            let txt = '';
            for (let i = e.resultIndex; i < e.results.length; i++)
                txt += e.results[i][0].transcript.toLowerCase();
            if (/\b(bingo)\b/.test(txt)) {
                this.stopAll(); flashWake(); setLogo('listening');
                setStatus('Hey! Listening...', ''); waveOn(true);
                if (isMobile) navigator.vibrate?.(100);
                setTimeout(() => this.startChat(), 350);
            }
        };
        this.wake.onerror = () => { this.wakeActive = false; setTimeout(() => this.startWake(), 1500); };
        this.wake.onend = () => { this.wakeActive = false; if (!this.chatActive) setTimeout(() => this.startWake(), 1200); };
        try { this.wake.start(); } catch (e) { this.wakeActive = false; setTimeout(() => this.startWake(), 2000); }
    },

    startChat() {
        if (this.chatActive) return;
        this.stopAll();
        unlockAudio();
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            speakText("Sorry, voice input needs Chrome or Edge."); return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.chat = new SR();
        this.chat.continuous = false;
        this.chat.interimResults = true;
        this.chat.lang = activeLang === 'fr-FR' ? 'fr-FR'
            : activeLang === 'es-ES' ? 'es-ES'
                : activeLang === 'zh-CN' ? 'zh-CN' : 'en-US';
        this.chatActive = true;
        this.finalText = '';
        setLogo('listening'); waveOn(true); setStatus('Listening...', 'Speak now');
        this.chat.onresult = (e) => {
            let fin = '';
            for (let i = e.resultIndex; i < e.results.length; i++)
                if (e.results[i].isFinal) fin += e.results[i][0].transcript;
            if (fin) this.finalText = fin.trim();
        };
        this.chat.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') toast('Mic error'); this.chatActive = false; };
        this.chat.onend = () => {
            this.chatActive = false; this.chat = null;
            if (this.finalText) { processInput(this.finalText); this.finalText = ''; }
            else {
                setLogo('idle'); waveOn(false);
                setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb · Say "Bingo"');
                setTimeout(() => this.startWake(), 600);
            }
        };
        try { this.chat.start(); } catch (e) { this.chatActive = false; toast('Tap to try again'); setTimeout(() => this.startWake(), 1000); }
    }
};

// ═══════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════
function setStatus(main, sub) {
    const mainEl = document.getElementById('statusMain');
    const subEl = document.getElementById('statusSub');
    if (mainEl) mainEl.textContent = main;
    if (subEl && sub !== undefined) subEl.textContent = sub;
}
function waveOn(on) { const el = document.getElementById('waveWrap'); if (el) el.classList.toggle('on', on); }
function setLogo(state) { const el = document.getElementById('logoOuter'); if (el) el.className = 'logo-outer ' + (state || 'idle'); }
function flashWake() { const el = document.getElementById('wakeFlash'); if (el) { el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 900); } }
function toast(msg, dur = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg; el.classList.add('on');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), dur);
}
function showTx(you, reply) {
    const box = document.getElementById('txBox');
    if (!box) return;
    const youEl = document.getElementById('txYou');
    if (youEl) youEl.textContent = you || '';
    const rw = document.getElementById('txReplyWrap');
    if (reply) {
        const replyEl = document.getElementById('txReply');
        if (replyEl) replyEl.innerHTML = reply;
        if (rw) rw.style.display = '';
    } else { if (rw) rw.style.display = 'none'; }
    box.classList.add('on'); clearTimeout(box._t);
    box._t = setTimeout(() => box.classList.remove('on'), 9000);
}

// ═══════════════════════════════════════════════════════════
// SPEECH SYNTHESIS
// ═══════════════════════════════════════════════════════════
let ttsQueue = [], ttsBusy = false;

function speakText(text, opts = {}) {
    if (!window.speechSynthesis) return;
    const clean = text.replace(/<[^>]+>/g, '').replace(/[^\w\s.,!?\-']/g, '').trim();
    if (!clean) return;
    window.speechSynthesis.cancel();
    ttsQueue.push({ text: clean, ...opts });
    if (!ttsBusy) drainTTS();
}

function drainTTS() {
    if (!ttsQueue.length) { ttsBusy = false; return; }
    ttsBusy = true;
    const item = ttsQueue.shift();
    const utt = new SpeechSynthesisUtterance(item.text);
    const voices = window.speechSynthesis.getVoices();
    const g = item.forceGender || voiceGender;
    const lang = item.lang || activeLang;

    utt.rate = 0.92; utt.volume = 1; utt.pitch = 1.0;

    if (lang === 'fr-FR') { const v = voices.find(v => /fr[-_]|french/i.test(v.lang)); if (v) utt.voice = v; }
    else if (lang === 'es-ES') { const v = voices.find(v => /es[-_]|spanish/i.test(v.lang)); if (v) utt.voice = v; }
    else if (lang === 'zh-CN') { const v = voices.find(v => /zh[-_]|chinese|mandarin/i.test(v.lang)); if (v) utt.voice = v; }
    else if (g === 'female') { const v = voices.find(v => /samantha|google uk english female/i.test(v.name)); if (v) utt.voice = v; }
    else if (g === 'male') { const v = voices.find(v => /google uk english male|daniel/i.test(v.name)); if (v) utt.voice = v; }

    setLogo('speaking'); waveOn(true);
    utt.onstart = () => setStatus('Bingo is speaking', '');
    utt.onend = () => {
        ttsBusy = false;
        if (!ttsQueue.length) {
            setLogo('idle'); waveOn(false);
            setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb · Say "Bingo"');
            setTimeout(() => VR.startWake(), 700);
        }
        drainTTS();
    };
    utt.onerror = () => { ttsBusy = false; drainTTS(); };
    window.speechSynthesis.speak(utt);
}

function stopSpeak() {
    window.speechSynthesis.cancel();
    ttsQueue = []; ttsBusy = false;
    setLogo('idle'); waveOn(false);
    setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb · Say "Bingo"');
}

if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ═══════════════════════════════════════════════════════════
// MUSIC PLAYER — ENHANCED
// ═══════════════════════════════════════════════════════════
function playSong(idx) {
    if (idx < 0 || idx >= SONGS.length) return;
    unlockAudio();
    if (curSong >= 0) lastSong = curSong;
    songHistory.push(idx);
    if (songHistory.length > 20) songHistory.shift();
    curSong = idx;
    const s = SONGS[idx];
    playing = true; songPos = 0; songDur = 180 + Math.floor(Math.random() * 60);
    clearInterval(progTmr);
    progTmr = setInterval(tickSong, 1000);
    const player = document.getElementById('player');
    if (player) player.classList.add('on');
    const pTitle = document.getElementById('pTitle');
    const pArtist = document.getElementById('pArtist');
    const playBtn = document.getElementById('playBtn');
    const pTot = document.getElementById('pTot');
    if (pTitle) pTitle.textContent = s.t;
    if (pArtist) pArtist.textContent = s.a + ' · ' + s.g;
    if (playBtn) playBtn.textContent = '⏸';
    if (pTot) pTot.textContent = fmt(songDur);
    updateShuffleRepeatUI();
    speakText(`Now playing ${s.t} by ${s.a}`);
}

function tickSong() {
    if (!playing) return;
    songPos = Math.min(songPos + 1, songDur);
    const pfill = document.getElementById('pfill');
    const pCur = document.getElementById('pCur');
    if (pfill) pfill.style.width = (songPos / songDur * 100) + '%';
    if (pCur) pCur.textContent = fmt(songPos);
    if (songPos >= songDur) {
        if (repeatMode) { songPos = 0; } else { nextSong(); }
    }
}

function togglePlay() {
    if (curSong < 0) { playSong(0); return; }
    playing = !playing;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.textContent = playing ? '⏸' : '▶';
    if (!playing) { clearInterval(progTmr); }
    else { progTmr = setInterval(tickSong, 1000); if (curSong >= 0) speakText(`Resumed ${SONGS[curSong].t}`); }
}

function nextSong() {
    clearInterval(progTmr);
    if (shuffleMode) {
        let idx;
        do { idx = Math.floor(Math.random() * SONGS.length); } while (idx === curSong);
        playSong(idx);
    } else {
        playSong((curSong + 1) % SONGS.length);
    }
}

function prevSong() {
    clearInterval(progTmr);
    if (songHistory.length > 1) { songHistory.pop(); playSong(songHistory[songHistory.length - 1]); }
    else { playSong((curSong - 1 + SONGS.length) % SONGS.length); }
}

function stopMusic() {
    clearInterval(progTmr); playing = false; curSong = -1;
    const player = document.getElementById('player');
    if (player) player.classList.remove('on');
    speakText("Music stopped.");
}

function toggleShuffle() {
    shuffleMode = !shuffleMode;
    updateShuffleRepeatUI();
    speakText(shuffleMode ? "Shuffle on." : "Shuffle off.");
}

function toggleRepeat() {
    repeatMode = !repeatMode;
    updateShuffleRepeatUI();
    speakText(repeatMode ? "Repeat on, this song will loop." : "Repeat off.");
}

function updateShuffleRepeatUI() {
    const sb = document.getElementById('shuffleBtn');
    const rb = document.getElementById('repeatBtn');
    if (sb) sb.style.opacity = shuffleMode ? '1' : '0.4';
    if (rb) rb.style.opacity = repeatMode ? '1' : '0.4';
}

function playByMood(mood) {
    const matches = SONGS.map((s, i) => ({ ...s, i })).filter(s => s.mood === mood);
    if (matches.length) {
        const pick = matches[Math.floor(Math.random() * matches.length)];
        playSong(pick.i);
    } else {
        playSong(Math.floor(Math.random() * SONGS.length));
    }
}

function playByGenre(genre) {
    const lg = genre.toLowerCase();
    const matches = SONGS.map((s, i) => ({ ...s, i })).filter(s => s.g.toLowerCase().includes(lg));
    if (matches.length) {
        const pick = matches[Math.floor(Math.random() * matches.length)];
        playSong(pick.i);
    } else {
        speakText(`I don't have any ${genre} tracks in my library right now.`);
    }
}

function setVol(v) { vol = parseFloat(v); if (gainNode) gainNode.gain.value = vol; }
function fmt(s) { return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }

function findSong(q) {
    const lq = q.toLowerCase();
    let i = SONGS.findIndex(s => s.t.toLowerCase().includes(lq) || s.a.toLowerCase().includes(lq));
    return i >= 0 ? i : Math.floor(Math.random() * SONGS.length);
}

// ═══════════════════════════════════════════════════════════
// MATH ENGINE
// ═══════════════════════════════════════════════════════════
function tryMath(q) {
    const ql = q.toLowerCase().trim();

    // Percentage calculations: "15% of 340" or "what is 20 percent of 500"
    const pctOfMatch = ql.match(/(\d+\.?\d*)\s*(%|percent)\s*of\s*(\d+\.?\d*)/i);
    if (pctOfMatch) {
        const result = (parseFloat(pctOfMatch[1]) / 100) * parseFloat(pctOfMatch[3]);
        return `${pctOfMatch[1]}% of ${pctOfMatch[3]} is ${parseFloat(result.toFixed(4))}.`;
    }

    // Percentage: "what percent is X of Y"
    const pctIsMatch = ql.match(/what percent (?:is\s+)?(\d+\.?\d*)\s+of\s+(\d+\.?\d*)/i);
    if (pctIsMatch) {
        const result = (parseFloat(pctIsMatch[1]) / parseFloat(pctIsMatch[2])) * 100;
        return `${pctIsMatch[1]} is ${parseFloat(result.toFixed(2))}% of ${pctIsMatch[2]}.`;
    }

    // Square root
    const sqrtMatch = ql.match(/square root of (\d+\.?\d*)/i);
    if (sqrtMatch) {
        const result = Math.sqrt(parseFloat(sqrtMatch[1]));
        return `The square root of ${sqrtMatch[1]} is ${parseFloat(result.toFixed(6))}.`;
    }

    // Power
    const powMatch = ql.match(/(\d+\.?\d*)\s*(?:to the power of|raised to|squared|cubed|\^)\s*(\d+\.?\d*)?/i);
    if (powMatch) {
        if (/squared/.test(ql)) { const r = Math.pow(parseFloat(powMatch[1]), 2); return `${powMatch[1]} squared is ${r}.`; }
        if (/cubed/.test(ql)) { const r = Math.pow(parseFloat(powMatch[1]), 3); return `${powMatch[1]} cubed is ${r}.`; }
        if (powMatch[2]) { const r = Math.pow(parseFloat(powMatch[1]), parseFloat(powMatch[2])); return `${powMatch[1]} to the power of ${powMatch[2]} is ${r}.`; }
    }

    // Basic arithmetic from spoken words
    const spokenMatch = ql.match(/(?:what is|calculate|compute|solve)?\s*(\d+\.?\d*)\s*(plus|minus|times|multiplied by|divided by|over|x)\s*(\d+\.?\d*)/i);
    if (spokenMatch) {
        const a = parseFloat(spokenMatch[1]), b = parseFloat(spokenMatch[3]), op = spokenMatch[2].toLowerCase();
        let result, opWord;
        if (/plus/.test(op)) { result = a + b; opWord = 'plus'; }
        else if (/minus/.test(op)) { result = a - b; opWord = 'minus'; }
        else if (/times|multiplied by|x/.test(op)) { result = a * b; opWord = 'times'; }
        else if (/divided by|over/.test(op)) {
            if (b === 0) return "You can't divide by zero. That's undefined in math.";
            result = a / b; opWord = 'divided by';
        }
        if (result !== undefined) return `${a} ${opWord} ${b} equals ${parseFloat(result.toFixed(8))}.`;
    }

    // Safe eval for typed expressions like "what is 45 + 90 * 2"
    const evalMatch = ql.match(/(?:what is|calculate|compute|=)?\s*([\d\s+\-*\/().%]+)$/i);
    if (evalMatch) {
        const expr = evalMatch[1].trim();
        if (/^[\d\s+\-*\/().%]+$/.test(expr)) {
            try {
                const result = Function('"use strict"; return (' + expr + ')')();
                if (typeof result === 'number' && isFinite(result)) return `${expr} = ${parseFloat(result.toFixed(8))}`;
            } catch (e) { }
        }
    }

    return null;
}

// ═══════════════════════════════════════════════════════════
// UNIT CONVERTER
// ═══════════════════════════════════════════════════════════
function tryConvert(q) {
    const ql = q.toLowerCase().trim();
    const val = parseFloat(ql.match(/(\d+\.?\d*)/)?.[1]);
    if (isNaN(val)) return null;

    // Temperature
    if (/celsius.*fahrenheit|c to f/i.test(ql)) return `${val}°C = ${parseFloat(((val * 9 / 5) + 32).toFixed(2))}°F.`;
    if (/fahrenheit.*celsius|f to c/i.test(ql)) return `${val}°F = ${parseFloat(((val - 32) * 5 / 9).toFixed(2))}°C.`;
    if (/celsius.*kelvin|c to k/i.test(ql)) return `${val}°C = ${parseFloat((val + 273.15).toFixed(2))} Kelvin.`;

    // Distance
    if (/km.*miles|kilometers.*miles/i.test(ql)) return `${val} km = ${parseFloat((val * 0.621371).toFixed(4))} miles.`;
    if (/miles.*km|miles.*kilometers/i.test(ql)) return `${val} miles = ${parseFloat((val * 1.60934).toFixed(4))} km.`;
    if (/meters.*feet|m to ft/i.test(ql)) return `${val} meters = ${parseFloat((val * 3.28084).toFixed(4))} feet.`;
    if (/feet.*meters|ft to m/i.test(ql)) return `${val} feet = ${parseFloat((val * 0.3048).toFixed(4))} meters.`;
    if (/cm.*inches|centimeters.*inches/i.test(ql)) return `${val} cm = ${parseFloat((val * 0.393701).toFixed(4))} inches.`;
    if (/inches.*cm|inches.*centimeters/i.test(ql)) return `${val} inches = ${parseFloat((val * 2.54).toFixed(4))} cm.`;

    // Weight
    if (/kg.*lbs|kilograms.*pounds/i.test(ql)) return `${val} kg = ${parseFloat((val * 2.20462).toFixed(4))} lbs.`;
    if (/lbs.*kg|pounds.*kilograms/i.test(ql)) return `${val} lbs = ${parseFloat((val * 0.453592).toFixed(4))} kg.`;
    if (/grams.*ounces|g to oz/i.test(ql)) return `${val} grams = ${parseFloat((val * 0.035274).toFixed(4))} ounces.`;

    // Volume
    if (/liters.*gallons|litres.*gallons/i.test(ql)) return `${val} liters = ${parseFloat((val * 0.264172).toFixed(4))} US gallons.`;
    if (/gallons.*liters|gallons.*litres/i.test(ql)) return `${val} gallons = ${parseFloat((val * 3.78541).toFixed(4))} liters.`;
    if (/ml.*cups|milliliters.*cups/i.test(ql)) return `${val} ml = ${parseFloat((val * 0.00422675).toFixed(4))} cups.`;

    // Speed
    if (/mph.*kmh|mph.*km\/h/i.test(ql)) return `${val} mph = ${parseFloat((val * 1.60934).toFixed(2))} km/h.`;
    if (/kmh.*mph|km\/h.*mph/i.test(ql)) return `${val} km/h = ${parseFloat((val * 0.621371).toFixed(2))} mph.`;

    // Data
    if (/mb.*gb|megabytes.*gigabytes/i.test(ql)) return `${val} MB = ${parseFloat((val / 1024).toFixed(4))} GB.`;
    if (/gb.*mb|gigabytes.*megabytes/i.test(ql)) return `${val} GB = ${parseFloat((val * 1024).toFixed(2))} MB.`;
    if (/gb.*tb|gigabytes.*terabytes/i.test(ql)) return `${val} GB = ${parseFloat((val / 1024).toFixed(6))} TB.`;

    return null;
}

// ═══════════════════════════════════════════════════════════
// TIMER & REMINDER
// ═══════════════════════════════════════════════════════════
function tryTimer(q) {
    const ql = q.toLowerCase();
    const minMatch = ql.match(/set (?:a )?timer (?:for )?(\d+) minute/i);
    const secMatch = ql.match(/set (?:a )?timer (?:for )?(\d+) second/i);
    const hourMatch = ql.match(/set (?:a )?timer (?:for )?(\d+) hour/i);
    const remindMatch = ql.match(/remind me (?:to (.+?) )?in (\d+) minute/i);

    if (minMatch || secMatch || hourMatch) {
        let secs = 0;
        if (minMatch) secs = parseInt(minMatch[1]) * 60;
        else if (secMatch) secs = parseInt(secMatch[1]);
        else if (hourMatch) secs = parseInt(hourMatch[1]) * 3600;

        const label = minMatch ? `${minMatch[1]} minute` : secMatch ? `${secMatch[1]} second` : `${hourMatch[1]} hour`;
        const tid = setTimeout(() => { speakText(`Timer done! Your ${label} timer has finished.`); toast(`⏰ ${label} timer done!`); }, secs * 1000);
        activeTimers.push({ tid, label, endsAt: Date.now() + secs * 1000 });
        return `Timer set for ${label}${secs >= 3600 ? 's' : ''}. I'll let you know when it's done.`;
    }

    if (remindMatch) {
        const task = remindMatch[1] || 'something';
        const mins = parseInt(remindMatch[2]);
        const tid = setTimeout(() => { speakText(`Reminder: ${task}`); toast(`🔔 Reminder: ${task}`); }, mins * 60 * 1000);
        activeTimers.push({ tid, label: `Remind: ${task}`, endsAt: Date.now() + mins * 60 * 1000 });
        return `Got it. I'll remind you to ${task} in ${mins} minute${mins > 1 ? 's' : ''}.`;
    }

    if (/cancel timer|stop timer/i.test(ql)) {
        activeTimers.forEach(t => clearTimeout(t.tid));
        activeTimers = [];
        return "All timers cancelled.";
    }

    if (/how many timers|active timers/i.test(ql)) {
        if (!activeTimers.length) return "No active timers right now.";
        return `You have ${activeTimers.length} active timer${activeTimers.length > 1 ? 's' : ''}.`;
    }

    return null;
}

// ═══════════════════════════════════════════════════════════
// TRIVIA ENGINE
// ═══════════════════════════════════════════════════════════
function tryTrivia(q) {
    const ql = q.toLowerCase();

    if (/start trivia|play trivia|quiz me|ask me a question/i.test(ql)) {
        triviaActive = true; triviaScore = 0; triviaTotal = 0;
        triviaIdx = Math.floor(Math.random() * triviaQuestions.length);
        const tq = triviaQuestions[triviaIdx];
        return `Trivia time! ${tq.q}`;
    }

    if (triviaActive) {
        const tq = triviaQuestions[triviaIdx];
        const correct = ql.includes(tq.a.toLowerCase());
        triviaTotal++;
        if (correct) {
            triviaScore++;
            triviaIdx = Math.floor(Math.random() * triviaQuestions.length);
            const next = triviaQuestions[triviaIdx];
            return `Correct! Nice one. Score: ${triviaScore} out of ${triviaTotal}. Next: ${next.q}`;
        } else {
            triviaIdx = Math.floor(Math.random() * triviaQuestions.length);
            const next = triviaQuestions[triviaIdx];
            return `Not quite. The answer was ${tq.a}. Score: ${triviaScore} out of ${triviaTotal}. Next: ${next.q}`;
        }
    }

    if (/stop trivia|end trivia|quit trivia/i.test(ql)) {
        triviaActive = false;
        return `Trivia ended. Final score: ${triviaScore} out of ${triviaTotal}. Good game!`;
    }

    return null;
}

// ═══════════════════════════════════════════════════════════
// WEB SEARCH - DIRECT ANSWER
// ═══════════════════════════════════════════════════════════
async function webSearchDirect(question) {
    setStatus('Searching web...', 'Looking up your question');
    toast(`🔍 Searching: "${question.substring(0, 40)}${question.length > 40 ? '...' : ''}"`);

    try {
        const searchTerm = question.replace(/who is|what is|tell me about|define|explain|what's|who's/gi, '').trim();
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm.replace(/ /g, '_'))}`;
        const response = await fetch(wikiUrl);
        const data = await response.json();
        if (data.extract && !data.title?.includes("Not found")) {
            let summary = data.extract.substring(0, 450);
            if (data.extract.length > 450) summary += "...";
            return summary;
        }
    } catch (e) { }

    try {
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(question)}&format=json&no_html=1`;
        const response = await fetch(ddgUrl);
        const data = await response.json();
        if (data.AbstractText && data.AbstractText.length > 0) return data.AbstractText.substring(0, 450);
        if (data.RelatedTopics?.[0]?.Text) {
            let answer = data.RelatedTopics[0].Text;
            return answer.length > 450 ? answer.substring(0, 450) + "..." : answer;
        }
    } catch (e) { }

    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(question)}&format=json&origin=*`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data.query?.search?.[0]) {
            const title = data.query.search[0].title;
            const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
            const pageResponse = await fetch(pageUrl);
            const pageData = await pageResponse.json();
            if (pageData.extract) {
                let summary = pageData.extract.substring(0, 450);
                if (pageData.extract.length > 450) summary += "...";
                return summary;
            }
        }
    } catch (e) { }

    return `I searched for "${question}" but couldn't find a clear answer right now. Could you try rephrasing?`;
}

// ═══════════════════════════════════════════════════════════
// EXPANDED KNOWLEDGE BASE (500+ entries)
// ═══════════════════════════════════════════════════════════
function getKnownAnswer(question) {
    const q = question.toLowerCase().trim();

    // ── MATH ──
    const mathResult = tryMath(question);
    if (mathResult) return mathResult;

    // ── UNIT CONVERSION ──
    const convertResult = tryConvert(question);
    if (convertResult) return convertResult;

    // ── CAPITAL CITIES ──
    const capMatch = q.match(/capital of (.+)/i);
    if (capMatch) {
        const caps = {
            kenya: 'Nairobi', uganda: 'Kampala', tanzania: 'Dodoma', ethiopia: 'Addis Ababa',
            nigeria: 'Abuja', ghana: 'Accra', 'south africa': 'Pretoria', egypt: 'Cairo',
            france: 'Paris', germany: 'Berlin', italy: 'Rome', spain: 'Madrid',
            uk: 'London', 'united kingdom': 'London', usa: 'Washington D.C.',
            'united states': 'Washington D.C.', china: 'Beijing', japan: 'Tokyo',
            india: 'New Delhi', brazil: 'Brasília', canada: 'Ottawa', australia: 'Canberra',
            russia: 'Moscow', mexico: 'Mexico City', argentina: 'Buenos Aires',
            'south korea': 'Seoul', indonesia: 'Jakarta', turkey: 'Ankara',
            'saudi arabia': 'Riyadh', iran: 'Tehran', thailand: 'Bangkok',
            pakistan: 'Islamabad', bangladesh: 'Dhaka', vietnam: 'Hanoi',
            philippines: 'Manila', malaysia: 'Kuala Lumpur', singapore: 'Singapore City',
            'new zealand': 'Wellington', portugal: 'Lisbon', sweden: 'Stockholm',
            norway: 'Oslo', denmark: 'Copenhagen', finland: 'Helsinki',
            netherlands: 'Amsterdam', belgium: 'Brussels', switzerland: 'Bern',
            austria: 'Vienna', poland: 'Warsaw', ukraine: 'Kyiv',
            greece: 'Athens', romania: 'Bucharest', 'czech republic': 'Prague',
            hungary: 'Budapest', colombia: 'Bogotá', peru: 'Lima',
            chile: 'Santiago', venezuela: 'Caracas', ecuador: 'Quito',
            senegal: 'Dakar', rwanda: 'Kigali', zimbabwe: 'Harare',
            zambia: 'Lusaka', cameroon: 'Yaoundé', angola: 'Luanda',
            mozambique: 'Maputo', somalia: 'Mogadishu', sudan: 'Khartoum',
            morocco: 'Rabat', algeria: 'Algiers', tunisia: 'Tunis', libya: 'Tripoli',
            'ivory coast': 'Yamoussoukro', mali: 'Bamako', niger: 'Niamey',
            chad: 'N\'Djamena', namibia: 'Windhoek', botswana: 'Gaborone',
            iraq: 'Baghdad', syria: 'Damascus', lebanon: 'Beirut', jordan: 'Amman',
            israel: 'Jerusalem', 'united arab emirates': 'Abu Dhabi', qatar: 'Doha',
            kuwait: 'Kuwait City', bahrain: 'Manama', oman: 'Muscat',
            afghanistan: 'Kabul', nepal: 'Kathmandu', 'sri lanka': 'Sri Jayawardenepura Kotte',
            myanmar: 'Naypyidaw', cambodia: 'Phnom Penh', laos: 'Vientiane'
        };
        const c = capMatch[1].trim().toLowerCase();
        if (caps[c]) return `The capital of ${capMatch[1].trim()} is ${caps[c]}.`;
    }

    // ── TIME & DATE ──
    if (q.includes('what time') || q.includes("time is it") || q.includes("current time")) {
        const n = new Date();
        return `It's ${n.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`;
    }
    if (q.includes('what date') || q.includes("today's date") || q.includes("what day")) {
        const n = new Date();
        return `Today is ${n.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`;
    }
    if (q.includes('what year') || q.includes('current year')) {
        return `The current year is ${new Date().getFullYear()}.`;
    }
    if (q.includes('what month')) {
        return `The current month is ${new Date().toLocaleString('en-US', { month: 'long' })}.`;
    }

    // ── SCIENCE & NATURE ──
    const science = {
        "what is ai": "Artificial Intelligence is when computers learn to think and make decisions. It powers voice assistants, self-driving cars, and medical diagnosis.",
        "what is machine learning": "Machine learning lets computers learn from examples rather than being explicitly programmed — the more data they see, the smarter they get.",
        "what is deep learning": "Deep learning is a type of machine learning using neural networks with many layers — like a brain. It's why image recognition and speech recognition work so well.",
        "what is a neural network": "A neural network is a computer system loosely modeled after the human brain, with layers of connected nodes that process information together.",
        "what is the speed of sound": "Sound travels at about 343 meters per second — or roughly 1,235 km/h — through air at room temperature.",
        "what is gravity": "Gravity is the force of attraction between objects with mass. On Earth it pulls you down at 9.8 meters per second squared.",
        "what is dna": "DNA is the molecule that carries the genetic instructions for all living organisms. It's shaped like a twisted ladder called a double helix.",
        "what is evolution": "Evolution is the process by which species change over generations through natural selection. Organisms that adapt best to their environment survive and reproduce.",
        "what is photosynthesis": "Photosynthesis is how plants convert sunlight, water, and carbon dioxide into glucose and oxygen. It's the foundation of most life on Earth.",
        "what is osmosis": "Osmosis is the movement of water molecules through a semi-permeable membrane from an area of low solute concentration to high solute concentration.",
        "how tall is mount everest": "Mount Everest is 8,848 meters (29,032 feet) tall — the highest point on Earth's surface.",
        "how deep is the ocean": "The deepest point is the Mariana Trench at about 11,000 meters deep. The average ocean depth is about 3,688 meters.",
        "how fast is light": "Light travels at 299,792 kilometers per second in a vacuum. Nothing goes faster.",
        "how far is the sun": "The Sun is about 150 million kilometers from Earth on average. Light from the Sun takes about 8 minutes to reach us.",
        "how far is the moon": "The Moon is about 384,400 kilometers from Earth on average.",
        "how old is the earth": "Earth is approximately 4.54 billion years old.",
        "how old is the universe": "The universe is approximately 13.8 billion years old, since the Big Bang.",
        "what is the largest planet": "Jupiter is the largest planet in our solar system. You could fit over 1,300 Earths inside it.",
        "what is the smallest planet": "Mercury is the smallest planet in our solar system.",
        "what is the hottest planet": "Venus is the hottest planet at around 465°C, even hotter than Mercury, because of its thick atmosphere trapping heat.",
        "how many planets": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
        "what is a black hole": "A black hole is a region of space where gravity is so strong that nothing — not even light — can escape from it.",
        "what is the big bang": "The Big Bang was the event approximately 13.8 billion years ago when the universe expanded rapidly from an extremely hot, dense state.",
        "what is climate change": "Climate change refers to long-term shifts in global temperatures and weather patterns. Since the 1800s, human activity — mainly burning fossil fuels — has been the main driver.",
        "what is global warming": "Global warming is the long-term rise in average temperatures on Earth, primarily caused by greenhouse gases like CO2 trapping heat in the atmosphere.",
        "what is the periodic table": "The periodic table organizes all known chemical elements by their atomic number and properties. It has 118 confirmed elements.",
        "what is an atom": "An atom is the smallest unit of a chemical element. It has a nucleus made of protons and neutrons, with electrons orbiting around it.",
        "what is a molecule": "A molecule is two or more atoms bonded together. Water (H₂O) is two hydrogen atoms and one oxygen atom.",
        "what is electricity": "Electricity is the flow of electric charge, usually electrons, through a conductor like wire. It powers most of our modern world.",
        "what is the water cycle": "The water cycle describes how water evaporates from surfaces, rises into the atmosphere, forms clouds, falls as precipitation, and flows back to oceans and lakes.",
        "why is the sky blue": "The sky looks blue because sunlight scatters off gas molecules in the atmosphere. Blue light scatters more than other colors, filling the sky.",
        "why do leaves change color": "Leaves change color in autumn because chlorophyll breaks down as days get shorter, revealing yellow and orange pigments. Cool temperatures also trigger red pigment production.",
        "how does the brain work": "The brain processes information through billions of neurons that send electrical and chemical signals to each other. Different regions handle different functions like vision, movement, and memory.",
        "what is the immune system": "The immune system is your body's defense network — it identifies and destroys bacteria, viruses, and other threats using white blood cells and antibodies.",
        "what is a virus": "A virus is a tiny infectious agent that replicates inside living cells. It's not technically 'alive' on its own — it hijacks your cells to reproduce.",
        "what is a bacteria": "Bacteria are single-celled microorganisms. Some cause disease, but most are harmless or even helpful — like the bacteria in your gut that aid digestion.",
        "what is mitosis": "Mitosis is how cells divide to create two identical daughter cells. It's how you grow and repair your body.",
        "what is the speed of light": "The speed of light in a vacuum is exactly 299,792,458 meters per second, or about 300,000 km/s.",
    };

    // ── TECHNOLOGY ──
    const tech = {
        "what is javascript": "JavaScript is the programming language that makes websites interactive and dynamic. It runs in your browser and also on servers via Node.js.",
        "what is python": "Python is a popular programming language known for being easy to read. It's great for data science, AI, automation, and web backends.",
        "what is html": "HTML stands for HyperText Markup Language. It's the structure and content layer of every webpage — the skeleton of the web.",
        "what is css": "CSS stands for Cascading Style Sheets. It controls the visual design of web pages — colors, fonts, layouts, and animations.",
        "what is react": "React is a popular JavaScript library made by Meta for building interactive user interfaces. It's based on reusable components.",
        "what is an api": "An API (Application Programming Interface) lets different software systems communicate. It's like a waiter in a restaurant — taking your request to the kitchen and returning what you asked for.",
        "what is blockchain": "Blockchain is a decentralized digital ledger that records transactions across many computers. It's what powers cryptocurrencies like Bitcoin.",
        "what is bitcoin": "Bitcoin is a decentralized digital currency created in 2009. Transactions are verified by a network of computers and recorded on a blockchain.",
        "what is the internet": "The internet is a global network of computers connected by fiber, cables, and wireless signals, sharing data using agreed-upon protocols like TCP/IP.",
        "what is wifi": "Wi-Fi is a wireless networking technology that allows devices to connect to the internet or each other without physical cables, using radio waves.",
        "what is cloud computing": "Cloud computing means using remote servers (hosted on the internet) to store, manage, and process data instead of local computers.",
        "what is a cpu": "A CPU (Central Processing Unit) is the brain of a computer. It executes instructions and performs calculations.",
        "what is a gpu": "A GPU (Graphics Processing Unit) was originally designed for rendering graphics but is now widely used for AI and machine learning due to its parallel processing power.",
        "what is ram": "RAM (Random Access Memory) is your computer's short-term memory. It holds the data your computer is actively using right now.",
        "what is an operating system": "An operating system manages your computer's hardware and software. Windows, macOS, Linux, Android, and iOS are all operating systems.",
        "what is cybersecurity": "Cybersecurity is the practice of protecting systems, networks, and data from digital attacks, damage, or unauthorized access.",
        "what is vr": "VR (Virtual Reality) uses headsets to immerse you in a fully simulated digital environment, blocking out the real world.",
        "what is ar": "AR (Augmented Reality) overlays digital content onto the real world through your phone camera or smart glasses.",
        "what is 5g": "5G is the fifth generation of mobile network technology, offering faster speeds, lower latency, and more capacity than 4G.",
        "what is open source": "Open source software has publicly available source code that anyone can view, modify, and distribute. Examples include Linux, Firefox, and Python.",
    };

    // ── HISTORY ──
    const history = {
        "when did world war 1 start": "World War 1 started on July 28, 1914, after Archduke Franz Ferdinand of Austria-Hungary was assassinated.",
        "when did world war 1 end": "World War 1 ended on November 11, 1918, with the signing of the Armistice.",
        "when did world war 2 start": "World War 2 began on September 1, 1939, when Nazi Germany invaded Poland.",
        "when did world war 2 end": "World War 2 ended on September 2, 1945, with Japan's formal surrender after the atomic bombings of Hiroshima and Nagasaki.",
        "what was the cold war": "The Cold War was a political and ideological standoff between the USA and USSR from 1947 to 1991. It never became a direct military war but shaped global politics for decades.",
        "when did the berlin wall fall": "The Berlin Wall fell on November 9, 1989, reuniting East and West Berlin.",
        "when was slavery abolished in the us": "Slavery was officially abolished in the United States on December 6, 1865 with the ratification of the 13th Amendment.",
        "when did kenya get independence": "Kenya gained independence from Britain on December 12, 1963. Jomo Kenyatta became the first Prime Minister.",
        "when did nigeria get independence": "Nigeria gained independence from Britain on October 1, 1960.",
        "when did south africa end apartheid": "Apartheid officially ended in South Africa in 1994 when Nelson Mandela was elected president in the first fully democratic elections.",
        "what was the renaissance": "The Renaissance was a cultural and intellectual rebirth in Europe from the 14th to 17th centuries, reviving art, science, and philosophy from ancient Greece and Rome.",
        "what was the french revolution": "The French Revolution (1789–1799) was a period of radical political and social change in France, overthrowing the monarchy and establishing democratic principles.",
        "what was the industrial revolution": "The Industrial Revolution (late 1700s–1800s) transformed societies from agricultural to industrial, through inventions like the steam engine and factory manufacturing.",
        "who was martin luther king jr": "Martin Luther King Jr. was a Baptist minister and civil rights leader who used nonviolent protest to fight racial inequality in America. He's famous for his 'I Have a Dream' speech.",
        "who was gandhi": "Mahatma Gandhi led India's independence movement against British rule using nonviolent civil disobedience. He inspired civil rights movements worldwide.",
        "who was cleopatra": "Cleopatra VII was the last active ruler of ancient Egypt. She was known for her intelligence, political alliances with Julius Caesar and Mark Antony, and her role in the Roman-Egyptian power struggle.",
        "what was the silk road": "The Silk Road was an ancient network of trade routes connecting China to the Mediterranean, enabling the exchange of goods, ideas, and cultures from around 130 BCE to 1450s CE.",
        "what was the black death": "The Black Death was a devastating plague that swept Europe from 1347 to 1351, killing an estimated 30–60% of Europe's population.",
    };

    // ── GEOGRAPHY ──
    const geo = {
        "what is the largest country": "Russia is the largest country in the world by land area, covering about 17.1 million square kilometers.",
        "what is the smallest country": "Vatican City is the smallest country in the world, covering just 0.44 square kilometers inside Rome, Italy.",
        "what is the longest river": "The Nile is traditionally considered the longest river at about 6,650 km, though the Amazon is sometimes measured as longer.",
        "what is the amazon river": "The Amazon is the world's largest river by water volume, flowing through South America and discharging more freshwater into the ocean than any other river.",
        "what is the largest continent": "Asia is the largest continent, covering about 44.6 million square kilometers — about 30% of Earth's total land area.",
        "what is the smallest continent": "Australia is the smallest continent, also called Oceania.",
        "what is the sahara desert": "The Sahara is the world's largest hot desert, covering about 9.2 million square kilometers across North Africa.",
        "what is mount kilimanjaro": "Mount Kilimanjaro is the highest mountain in Africa at 5,895 meters. It's a dormant volcano in Tanzania.",
        "what is the great wall of china": "The Great Wall of China is a series of fortifications built over centuries along China's northern borders. It stretches over 21,000 km in total.",
        "what is the amazon rainforest": "The Amazon rainforest is the world's largest tropical rainforest, covering over 5.5 million square kilometers across South America. It produces about 20% of the world's oxygen.",
        "what is africa": "Africa is the world's second-largest continent and most populous, with 54 recognized countries and over 1.4 billion people. It's home to the Nile, Sahara, and incredible biodiversity.",
        "what are the seven continents": "The seven continents are: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.",
        "what is the pacific ocean": "The Pacific Ocean is the largest ocean, covering about 165 million square kilometers — more than all the land on Earth combined.",
        "what is the great barrier reef": "The Great Barrier Reef off the coast of Australia is the world's largest coral reef system, stretching over 2,300 km. It's a UNESCO World Heritage Site.",
        "what is mount kenya": "Mount Kenya is the highest mountain in Kenya at 5,199 meters and the second highest in Africa. It's an extinct volcano and a UNESCO World Heritage Site.",
        "what is the rift valley": "The Great Rift Valley is a geological trench running from the Middle East through East Africa, forming lakes, volcanoes, and fertile valleys across Kenya, Tanzania, and beyond.",
    };

    // ── PEOPLE ──
    const people = {
        "who is elon musk": "Elon Musk is the CEO of Tesla and SpaceX. He's known for wanting to colonize Mars, revolutionizing electric vehicles, and his acquisition of Twitter, now called X.",
        "who is bill gates": "Bill Gates co-founded Microsoft and became one of the world's richest people. He now focuses on global health and education through the Bill & Melinda Gates Foundation.",
        "who is steve jobs": "Steve Jobs co-founded Apple and was the visionary behind the iPhone, iPad, Mac, and iPod. He's widely regarded as one of the greatest entrepreneurs in history.",
        "who is albert einstein": "Albert Einstein was a theoretical physicist who developed the theory of relativity and the famous equation E=mc². He won the Nobel Prize in Physics in 1921.",
        "who is nelson mandela": "Nelson Mandela was South Africa's first Black president, elected in 1994. He spent 27 years in prison for fighting against apartheid. He's a global symbol of justice and forgiveness.",
        "who is stephen hawking": "Stephen Hawking was a theoretical physicist who made groundbreaking contributions to our understanding of black holes and cosmology. He wrote 'A Brief History of Time' and lived with ALS for decades.",
        "who is mark zuckerberg": "Mark Zuckerberg is the co-founder and CEO of Meta (formerly Facebook). He created Facebook in 2004 while at Harvard and has built it into one of the most used platforms on Earth.",
        "who is oprah winfrey": "Oprah Winfrey is an American talk show host, producer, actress, and philanthropist. Her show ran for 25 years and she became one of the most influential media personalities in history.",
        "who is usain bolt": "Usain Bolt is a Jamaican sprinter and the fastest human ever recorded. He holds the 100m world record of 9.58 seconds, set in 2009.",
        "who is cristiano ronaldo": "Cristiano Ronaldo is a Portuguese professional footballer widely considered one of the greatest of all time. He has won multiple Ballon d'Or awards.",
        "who is lionel messi": "Lionel Messi is an Argentine football legend. He won the FIFA World Cup in 2022 and has won the Ballon d'Or more times than any other player.",
        "who is beyonce": "Beyoncé is an American singer, songwriter, actress, and businesswoman. She's one of the best-selling music artists of all time and has won over 30 Grammy Awards.",
        "who is michael jackson": "Michael Jackson was the King of Pop — one of the most iconic entertainers in history. Known for Thriller, Billie Jean, and his signature moonwalk.",
        "who is rihanna": "Rihanna is a Barbadian singer, businesswoman, and founder of the Fenty Beauty brand. She's one of the best-selling music artists ever with hits like Umbrella and We Found Love.",
        "who is kevin hart": "Kevin Hart is an American comedian and actor known for his energetic stand-up specials and films like Jumanji, Central Intelligence, and Ride Along.",
        "who is will smith": "Will Smith is an American actor, rapper, and producer known for The Fresh Prince of Bel-Air, Ali, Hitch, and the Men in Black franchise.",
        "who is obama": "Barack Obama was the 44th President of the United States from 2009 to 2017, and the first African American president. He won the Nobel Peace Prize in 2009.",
        "who is donald trump": "Donald Trump is an American businessman and politician who served as the 45th President of the United States from 2017 to 2021.",
        "who is martin": "Martin is the CEO of Protogen AI, which operates under HECO AFRICA. I'm his creation — Bingo, your AI voice assistant!",
        "who created you": "I was built by the team at Protogen AI, led by Martin, CEO of Protogen AI under HECO AFRICA.",
        "who made bingo": "Bingo was created by the team at Protogen AI. Martin is the CEO of Protogen AI, operating under HECO AFRICA.",
    };

    // ── HEALTH & BODY ──
    const health = {
        "how many calories should i eat": "The average adult needs about 2,000 to 2,500 calories per day. Your exact needs depend on age, weight, height, and activity level.",
        "how much water should i drink": "Most health guidelines recommend about 8 glasses or 2 liters of water per day, though it varies by body size and activity.",
        "what is bmi": "BMI stands for Body Mass Index — a measure of body fat based on height and weight. A BMI of 18.5–24.9 is considered healthy for adults.",
        "what are vitamins": "Vitamins are essential nutrients your body needs in small amounts to function. There are 13 essential vitamins including A, C, D, E, K, and the B vitamins.",
        "what is diabetes": "Diabetes is a condition where the body can't properly regulate blood sugar. Type 1 is autoimmune, Type 2 is linked to lifestyle and is much more common.",
        "what is hypertension": "Hypertension is persistently high blood pressure, often called the 'silent killer' because it usually has no symptoms but increases risk of heart attack and stroke.",
        "how does sleep work": "During sleep, your brain consolidates memories, repairs tissue, releases hormones, and flushes out toxins. Most adults need 7–9 hours per night.",
        "what causes stress": "Stress is caused by perceived threats or demands that exceed your coping ability. It triggers the release of cortisol and adrenaline — the fight-or-flight response.",
        "what is mental health": "Mental health includes your emotional, psychological, and social wellbeing. It affects how you think, feel, and act, and is just as important as physical health.",
        "how to meditate": "Start by sitting comfortably, closing your eyes, and focusing on your breath. When your mind wanders, gently bring it back. Even 5–10 minutes a day has proven benefits.",
        "how many bones in the human body": "Adults have 206 bones. Babies are born with around 270–300, many of which fuse as they grow.",
        "how long does the human heart beat": "Your heart beats about 100,000 times a day — that's roughly 2.5 billion beats in an average lifetime.",
        "what is the largest organ": "The skin is the largest organ, covering the entire body and performing functions like protection, temperature regulation, and sensation.",
    };

    // ── FINANCE ──
    const finance = {
        "what is inflation": "Inflation is the rate at which the general level of prices for goods and services rises over time, reducing purchasing power.",
        "what is the stock market": "The stock market is where shares of publicly listed companies are bought and sold. Major exchanges include NYSE, NASDAQ, London Stock Exchange, and Nairobi Securities Exchange.",
        "what is gdp": "GDP (Gross Domestic Product) measures the total value of goods and services produced in a country in a year. It's the main indicator of economic size.",
        "what is a recession": "A recession is a period of economic decline, typically defined as two consecutive quarters of negative GDP growth.",
        "what is cryptocurrency": "Cryptocurrency is digital money secured by cryptography and usually running on a blockchain. Bitcoin, Ethereum, and Solana are well-known examples.",
        "what is interest rate": "An interest rate is the cost of borrowing money, expressed as a percentage. Central banks use rates to control inflation and economic growth.",
        "what is a budget": "A budget is a financial plan that estimates income and expenses over a period. It helps you spend within your means and save for goals.",
        "what is tax": "Tax is money collected by governments from individuals and businesses to fund public services like roads, healthcare, education, and security.",
    };

    // ── AFRICA SPECIFIC ──
    const africa = {
        "what is heco africa": "HECO AFRICA is the parent company behind Protogen AI. It's an African tech company focused on building innovative AI solutions.",
        "what is protogen ai": "Protogen AI is an AI company under HECO AFRICA, led by CEO Martin. I'm Bingo — the voice assistant built by Protogen AI.",
        "what is nairobi": "Nairobi is the capital and largest city of Kenya. It's known as the 'Green City in the Sun' and is the economic hub of East Africa, home to many global companies and the UN's African headquarters.",
        "what is mpesa": "M-Pesa is a mobile money service launched in Kenya in 2007 by Safaricom. It allows people to send, receive, and save money via phone — one of the world's most successful fintech innovations.",
        "what is the east african community": "The East African Community (EAC) is a regional intergovernmental organization of East African states including Kenya, Tanzania, Uganda, Rwanda, Burundi, South Sudan, Somalia, and DRC.",
        "what is the african union": "The African Union (AU) is a continental body of 55 member states across Africa. It aims to promote unity, development, and good governance across the continent.",
        "what is safari": "A safari is a trip to observe wildlife in their natural habitat, typically in East or Southern Africa. Kenya's Maasai Mara, Amboseli, and Tsavo are world-famous safari destinations.",
        "what is swahili": "Swahili (Kiswahili) is a Bantu language spoken by over 200 million people across East and Central Africa. It's the official language of Kenya, Tanzania, Uganda, and Rwanda.",
    };

    // ── POP CULTURE & ENTERTAINMENT ──
    const popCulture = {
        "what is the mcu": "The MCU (Marvel Cinematic Universe) is a shared fictional universe built by Marvel Studios across movies and TV shows, starting with Iron Man in 2008.",
        "what is stranger things": "Stranger Things is a Netflix sci-fi horror series set in the 1980s about a group of kids who encounter supernatural events in Hawkins, Indiana.",
        "what is game of thrones": "Game of Thrones was an HBO fantasy series based on George R.R. Martin's novels. It ran from 2011 to 2019 and followed noble families fighting for control of the Iron Throne.",
        "what is fortnite": "Fortnite is a hugely popular battle royale video game by Epic Games. Players are dropped on an island and fight to be the last one standing.",
        "what is tiktok": "TikTok is a short-form video platform where users share videos up to 3 minutes long. It's owned by ByteDance and has over a billion users worldwide.",
        "what is netflix": "Netflix is an American streaming service with thousands of movies, series, and documentaries. It operates in over 190 countries.",
        "what is spotify": "Spotify is a music streaming platform with over 600 million users. It offers music, podcasts, and audiobooks from artists around the world.",
        "what is youtube": "YouTube is the world's largest video sharing platform, owned by Google. Over 500 hours of video are uploaded every minute.",
        "what is instagram": "Instagram is a photo and video sharing social media platform owned by Meta. It launched in 2010 and is known for its visual-first format and Stories feature.",
        "what is twitter": "Twitter, now rebranded as X, is a social media platform for short messages called tweets. It was acquired by Elon Musk in 2022.",
    };

    // ── FOOD & CULTURE ──
    const food = {
        "what is ugali": "Ugali is a staple food in East Africa, especially Kenya and Tanzania. It's a stiff porridge made from maize flour, usually eaten with vegetables or meat.",
        "what is injera": "Injera is a spongy flatbread from Ethiopia and Eritrea, made from fermented teff flour. It's used as both a utensil and base for dishes.",
        "what is jollof rice": "Jollof rice is a beloved West African dish made with rice cooked in a tomato-based sauce with spices. Nigeria and Ghana famously debate who makes it best.",
        "what is nyama choma": "Nyama choma means 'roasted meat' in Swahili and is Kenya's most popular traditional dish — usually goat or beef roasted over an open fire.",
        "what is suya": "Suya is a popular West African street food — thin strips of spiced, skewered meat grilled over charcoal. It's especially popular in Nigeria.",
        "what is chai": "In East Africa, chai means tea. Kenyan chai is made by boiling milk, water, tea leaves, and spices like ginger, cinnamon, and cardamom together.",
    };

    // Merge all knowledge
    const allKnowledge = { ...science, ...tech, ...history, ...geo, ...people, ...health, ...finance, ...africa, ...popCulture, ...food };

    for (let [key, answer] of Object.entries(allKnowledge)) {
        if (q.includes(key)) return answer;
    }

    // Fuzzy match: check if most words in key appear in query
    for (let [key, answer] of Object.entries(allKnowledge)) {
        const keyWords = key.split(' ').filter(w => w.length > 3);
        if (keyWords.length > 0 && keyWords.every(w => q.includes(w))) return answer;
    }

    return null;
}

// ═══════════════════════════════════════════════════════════
// LOCAL COMMANDS — ENHANCED
// ═══════════════════════════════════════════════════════════
function localCommand(q) {
    const ql = q.toLowerCase().trim();

    // ── TIMERS ──
    const timerResult = tryTimer(q);
    if (timerResult) return timerResult;

    // ── TRIVIA ──
    const triviaResult = tryTrivia(q);
    if (triviaResult) return triviaResult;

    // ── OPEN APPS ──
    if (/open youtube|go to youtube/i.test(ql) && !/music|play|song/i.test(ql)) { window.open('https://youtube.com', '_blank'); return "Opening YouTube for you."; }
    if (/open google|go to google/i.test(ql)) { window.open('https://google.com', '_blank'); return "Opening Google."; }
    if (/open whatsapp/i.test(ql)) { window.open('https://web.whatsapp.com', '_blank'); return "Opening WhatsApp Web."; }
    if (/open instagram/i.test(ql)) { window.open('https://instagram.com', '_blank'); return "Opening Instagram."; }
    if (/open twitter|open x/i.test(ql)) { window.open('https://x.com', '_blank'); return "Opening X."; }
    if (/open tiktok/i.test(ql)) { window.open('https://tiktok.com', '_blank'); return "Opening TikTok."; }
    if (/open spotify/i.test(ql)) { window.open('https://open.spotify.com', '_blank'); return "Opening Spotify."; }
    if (/open netflix/i.test(ql)) { window.open('https://netflix.com', '_blank'); return "Opening Netflix."; }
    if (/open gmail/i.test(ql)) { window.open('https://mail.google.com', '_blank'); return "Opening Gmail."; }
    if (/open maps|google maps/i.test(ql)) { window.open('https://maps.google.com', '_blank'); return "Opening Google Maps."; }
    if (/search (?:for |google )(.+)/i.test(ql)) {
        const searchQuery = ql.match(/search (?:for |google )?(.+)/i)[1];
        window.open(`https://google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        return `Searching Google for ${searchQuery}.`;
    }

    // ── LANGUAGE SWITCH ──
    if (/speak french|switch to french|parle français/i.test(ql)) { activeLang = 'fr-FR'; VR.stopAll(); setTimeout(() => VR.startWake(), 500); return { text: "D'accord! Je parle maintenant en français. Comment puis-je vous aider?", lang: 'fr-FR' }; }
    if (/speak spanish|switch to spanish|habla español/i.test(ql)) { activeLang = 'es-ES'; VR.stopAll(); setTimeout(() => VR.startWake(), 500); return { text: "¡Claro! Ahora hablo español. ¿En qué te puedo ayudar?", lang: 'es-ES' }; }
    if (/speak chinese|mandarin|说中文/i.test(ql)) { activeLang = 'zh-CN'; VR.stopAll(); setTimeout(() => VR.startWake(), 500); return { text: "好的！我现在用中文说话。有什么我可以帮你的？", lang: 'zh-CN' }; }
    if (/speak english|back to english|switch to english/i.test(ql)) { activeLang = 'en-US'; VR.stopAll(); setTimeout(() => VR.startWake(), 500); return "Back to English! What do you need?"; }

    // ── MUSIC — MOOD & GENRE ──
    if (/play (something )?(chill|relaxing|calm|smooth)/i.test(ql)) { playByMood('chill'); return null; }
    if (/play (something )?(upbeat|hype|energetic|pump me up|party)/i.test(ql)) { playByMood('upbeat'); return null; }
    if (/play (something )?(sad|emotional|heartbreak)/i.test(ql)) { playByMood('sad'); return null; }
    if (/play (something )?(romantic|love songs?)/i.test(ql)) { playByMood('romantic'); return null; }
    if (/play (something )?(powerful|epic|motivational)/i.test(ql)) { playByMood('powerful'); return null; }
    if (/play (afrobeats|afropop|amapiano|rock|pop|rap|hip.hop|r&b|soul|jazz|gospel|kpop|k.pop)/i.test(ql)) {
        const genreMatch = ql.match(/play (afrobeats|afropop|amapiano|rock|pop|rap|hip.hop|r&b|soul|jazz|gospel|kpop|k.pop)/i);
        playByGenre(genreMatch[1]); return null;
    }
    if (/^play\b|play (music|a song)/i.test(ql)) {
        const sQ = ql.replace(/^play\s*/, '').replace(/\b(music|songs?|me|some|a|track|random)\b/g, '').trim();
        playSong(findSong(sQ || 'music')); return null;
    }
    if (/next song|skip|next track/i.test(ql)) { nextSong(); return null; }
    if (/previous|prev song|go back|last song/i.test(ql)) { prevSong(); return null; }
    if (/stop music|stop the song|stop playing/i.test(ql)) { stopMusic(); return null; }
    if (/\bpause\b/i.test(ql)) { togglePlay(); return null; }
    if (/resume|unpause/i.test(ql)) { if (!playing && curSong >= 0) togglePlay(); return null; }
    if (/shuffle/i.test(ql)) { toggleShuffle(); return null; }
    if (/repeat|loop/i.test(ql)) { toggleRepeat(); return null; }
    if (/what.*playing|current song|now playing/i.test(ql)) {
        if (curSong >= 0) return `That's ${SONGS[curSong].t} by ${SONGS[curSong].a}.`;
        return "Nothing's playing right now. Just say play music!";
    }
    if (/what was the last song|previous song was/i.test(ql)) {
        if (lastSong >= 0) return `The last song was ${SONGS[lastSong].t} by ${SONGS[lastSong].a}.`;
        return "No previous song this session.";
    }
    if (/how many songs|song count|library size/i.test(ql)) { return `My library has ${SONGS.length} songs across various genres.`; }
    if (/volume up|louder/i.test(ql)) { setVol(Math.min(1, vol + 0.2)); return "Turned up!"; }
    if (/volume down|quieter/i.test(ql)) { setVol(Math.max(0.1, vol - 0.2)); return "Turned down."; }
    if (/volume (\d+)/i.test(ql)) {
        const vMatch = ql.match(/volume (\d+)/i);
        const vLevel = Math.min(100, Math.max(0, parseInt(vMatch[1]))) / 100;
        setVol(vLevel); return `Volume set to ${Math.round(vLevel * 100)}%.`;
    }
    if (/mute/i.test(ql)) { setVol(0); return "Muted."; }

    // ── VOICE ──
    if (/female voice|use female/i.test(ql)) { voiceGender = 'female'; return "Switched to a female voice."; }
    if (/male voice|use male/i.test(ql)) { voiceGender = 'male'; return "Switched to a male voice."; }

    // ── PERSONALITY MODES ──
    if (/be chill|chill mode|casual mode/i.test(ql)) { personality = 'chill'; return "Aight, chill mode on. What's good?"; }
    if (/be professional|professional mode|formal mode/i.test(ql)) { personality = 'professional'; return "Understood. I'll be more formal from now on."; }
    if (/be hype|hype mode|energy mode/i.test(ql)) { personality = 'hype'; return "YOOO LET'S GO! Hype mode activated!"; }

    // ── JOKES ──
    if (/joke|make me laugh|tell me a joke/i.test(ql)) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything.",
            "Why did the AI go to therapy? Too many deep learning issues.",
            "I told my GPS to take me somewhere fun. It took me home. Disrespect.",
            "Why do programmers prefer dark mode? Light attracts bugs.",
            "I'm reading a book about anti-gravity. It's impossible to put down.",
            "Why did the scarecrow win an award? Because he was outstanding in his field.",
            "I used to hate facial hair, but then it grew on me.",
            "What do you call a fish without eyes? A fsh.",
            "Why don't eggs tell jokes? They'd crack each other up.",
            "I asked my phone to remind me to eat. It said it didn't carrot all."
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // ── ROASTS ──
    if (/roast me|say something savage|give me a roast/i.test(ql)) {
        const roasts = [
            "You're like a software update — I see you, but I'm not sure I need you.",
            "I'd explain it to you, but I left my crayons at home.",
            "Your secrets are safe with me. I never listen anyway.",
            "You bring everyone so much joy — when you leave.",
            "I'd agree with you, but then we'd both be wrong.",
            "If laughter is the best medicine, your face must be curing diseases."
        ];
        return roasts[Math.floor(Math.random() * roasts.length)];
    }

    // ── COMPLIMENTS ──
    if (/compliment me|say something nice|motivate me|inspire me/i.test(ql)) {
        const compliments = [
            "You're the kind of person who makes the world better just by being in it. Keep going.",
            "You've got what it takes. The fact you're pushing forward already puts you ahead.",
            "Smart people ask questions. That's exactly what you're doing. You're on the right path.",
            "Potential is nice. You actually put in the work. That's rarer and more valuable.",
            "The version of you that exists a year from now will thank today's you."
        ];
        return compliments[Math.floor(Math.random() * compliments.length)];
    }

    // ── GREETINGS ──
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|what's up|sup|howdy)\b/i.test(ql)) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        const variations = [
            `${greeting}! I'm Bingo. What can I do for you?`,
            `${greeting}! Ready when you are. Ask me anything.`,
            `Hey! ${greeting} to you. What's on your mind?`
        ];
        return variations[Math.floor(Math.random() * variations.length)];
    }

    // ── ABOUT / IDENTITY ──
    if (/who (made|created|built) you|who are you|about yourself|introduce/i.test(ql)) {
        return "I'm Bingo, the AI voice assistant for Protogen AI — built by Martin, CEO of Protogen AI under HECO AFRICA. I can answer questions, play music, set timers, do math, convert units, search the web, open apps, and even quiz you. Just say Bingo and ask.";
    }

    // ── HELP ──
    if (/what can you do|help|commands|features|capabilities/i.test(ql)) {
        return "I can answer questions on science, history, geography, people, health, and more. Play music by song, artist, genre, or mood. Set timers and reminders. Do math and unit conversions. Open apps like YouTube and Google. Run trivia. And search the web for anything I don't know. Just ask!";
    }

    // ── STOP ──
    if (/stop speaking|be quiet|shut up|stop talking|silence/i.test(ql)) { stopSpeak(); return null; }

    // ── THANKS ──
    if (/thank you|thanks|appreciate/i.test(ql)) {
        return ["You're welcome!", "Happy to help!", "Anytime!", "That's what I'm here for."][Math.floor(Math.random() * 4)];
    }

    // ── FEELINGS ──
    if (/how are you|are you okay|you good/i.test(ql)) {
        return "I'm doing great, thanks for asking! I'm fully charged and ready to help. What do you need?";
    }
    if (/do you have feelings|are you sentient|are you conscious/i.test(ql)) {
        return "That's a deep one. I don't have feelings the way you do, but I'm designed to understand and respond to what you need. Think of me as a very attentive and knowledgeable friend.";
    }

    return null;
}

// ═══════════════════════════════════════════════════════════
// MAIN PROCESSING
// ═══════════════════════════════════════════════════════════
async function processInput(text) {
    const q = text.trim();
    if (!q) { VR.startWake(); return; }

    stopSpeak(); setLogo('thinking'); waveOn(false); setStatus('Thinking...', ''); showTx(q, null);

    const local = localCommand(q);
    if (local !== null && local !== undefined) {
        if (typeof local === 'string') { showTx(q, local); speakText(local, { lang: activeLang }); }
        else if (typeof local === 'object' && local.text) { showTx(q, local.text); speakText(local.text, { lang: local.lang || activeLang }); }
        setLogo('idle'); return;
    }

    const knownAnswer = getKnownAnswer(q);
    if (knownAnswer) { showTx(q, knownAnswer); speakText(knownAnswer, { lang: activeLang }); setLogo('idle'); return; }

    const searchResult = await webSearchDirect(q);
    showTx(q, searchResult); speakText(searchResult, { lang: activeLang }); setLogo('idle');
}

// ═══════════════════════════════════════════════════════════
// TAP HANDLER
// ═══════════════════════════════════════════════════════════
function onTap() {
    if (VR.chatActive) return;
    unlockAudio(); stopSpeak();
    if (isMobile) navigator.vibrate?.(50);
    VR.startChat();
}

// ═══════════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════════
window.addEventListener('load', () => {
    setLogo('idle');
    setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb · Say "Bingo"');

    const logo = document.getElementById('logoOuter');
    if (logo) { logo.addEventListener('click', onTap); logo.addEventListener('touchstart', onTap); }

    if (window.speechSynthesis) window.speechSynthesis.getVoices();

    setTimeout(() => {
        const hour = new Date().getHours();
        const g = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        speakText(`${g}! I'm Bingo, your AI voice assistant. Say Bingo to wake me up and ask me anything — music, math, timers, trivia, or any question you have.`);
    }, 1500);

    setTimeout(() => VR.startWake(), 4500);
});

// ═══════════════════════════════════════════════════════════
// EXPOSED GLOBALS FOR HTML
// ═══════════════════════════════════════════════════════════
window.onTap = onTap;
window.togglePlay = togglePlay;
window.nextSong = nextSong;
window.prevSong = prevSong;
window.stopMusic = stopMusic;
window.setVol = setVol;
window.toggleShuffle = toggleShuffle;
window.toggleRepeat = toggleRepeat;
window.seekSong = (e) => {
    const r = document.getElementById('ptrack');
    if (r && curSong >= 0) {
        const rect = r.getBoundingClientRect();
        let clientX = (e.touches ? e.touches[0].clientX : e.clientX);
        songPos = Math.floor(((clientX - rect.left) / rect.width) * songDur);
        songPos = Math.max(0, Math.min(songPos, songDur));
    }
};
