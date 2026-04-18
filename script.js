
   // ═══════════════════════════════════════════════════════════════════════════
// PROTOGEN AI — BINGO V3.5 ENHANCED — UNIFIED INTELLIGENCE CORE
// File     : bingo_v3.5_enhanced.js
// Version  : 3.5.1
// Creator  : Martin Lutherking Owino — CEO, Protogen AI / HECO AFRICA
// Upgrades : ① Deep Math Solver — handles free-form natural language maths,
//              symbolic algebra, trig identities, log laws, complex numbers,
//              sequences, proofs, polynomial long division, inequalities, and more.
//            ② Listening Engine V2 — smart partial match, noise filtering,
//              multi-language fallback, confidence scoring, follow-up memory,
//              phonetic correction, and utterance-repair on mishears.
// ═══════════════════════════════════════════════════════════════════════════
'use strict';

// ══════════════════════════════════════════════════════
//  ❶  CONSTANTS & CONFIGURATION
// ══════════════════════════════════════════════════════
const BINGO_CONFIG = {
    wakeWord: 'bingo',
    version: '3.5.1',
    creator: 'Martin Lutherking Owino',
    company: 'Protogen AI / HECO AFRICA',
    defaultLang: 'en-US',
    fallbackLang: 'en-GB',
    sessionMemoryLimit: 80,
    apiTimeout: 6000,
    liveRefreshInterval: 45000,
    ttsRate: 0.91,
    ttsPitch: 1.08,
    ttsVolume: 1.0,
    // Listening tuning
    listenConfidenceMin: 0.45,   // below this → ask for repeat
    listenSilenceMs: 1800,   // ms of silence before auto-submit
    listenMaxDuration: 18000,  // max listen window in ms
    wakeRetryMs: 1200,
};

// ══════════════════════════════════════════════════════
//  ❷  SESSION MEMORY ENGINE
// ══════════════════════════════════════════════════════
const Memory = (() => {
    const _store = [];
    const _context = { lastTopic: null, lastEntity: null, mood: 'neutral', userName: null, lastMathExpr: null };
    const _facts = {};

    function push(role, text, topic) {
        _store.push({ role, text, topic: topic || _context.lastTopic, ts: Date.now() });
        if (_store.length > BINGO_CONFIG.sessionMemoryLimit) _store.shift();
        if (topic) _context.lastTopic = topic;
    }

    function remember(key, value) { _facts[key.toLowerCase()] = value; }
    function recall(key) { return _facts[key.toLowerCase()] || null; }

    function getContext(n = 5) {
        return _store.slice(-n).map(m => `${m.role}: ${m.text}`).join('\n');
    }

    function setMood(m) { _context.mood = m; }
    function getMood() { return _context.mood; }
    function setUser(name) { _context.userName = name; remember('username', name); }
    function getUser() { return _context.userName || recall('username') || null; }
    function setLastMath(expr) { _context.lastMathExpr = expr; }
    function getLastMath() { return _context.lastMathExpr; }

    function detectUserFact(text) {
        const q = text.toLowerCase();
        let m;
        m = q.match(/(?:my name is|i am|i'm|call me)\s+([a-zA-Z]+)/);
        if (m) { setUser(m[1]); return `Got it! I'll remember your name is ${m[1]}.`; }
        m = q.match(/i (?:support|follow|love|like)\s+([\w\s]+?)(?:\s+fc|\s+united|\s+city|\b)/i);
        if (m) { remember('favorite_team', m[1].trim()); return `Noted! I'll remember you support ${m[1].trim()}.`; }
        m = q.match(/i(?:'m| am) (?:from|in|living in)\s+([\w\s,]+)/i);
        if (m) { remember('location', m[1].trim()); }
        return null;
    }

    // Resolve pronouns/follow-ups: "what about 5?" after a math question
    function resolveFollowUp(text) {
        const q = text.toLowerCase().trim();
        // "same but with X" / "now try X" / "what about X"
        const followUp = q.match(/(?:same but|now try|what about|and\s+(?:for)?|how about)\s+([\d\s.,+\-*/^()]+)/i);
        if (followUp && _context.lastMathExpr) {
            return `calculate ${followUp[1]}`;
        }
        // bare number after math context
        if (/^[\d\s+\-*/^().%]+$/.test(q) && _context.lastMathExpr) {
            return `calculate ${q}`;
        }
        return null;
    }

    return {
        push, remember, recall, getContext, setMood, getMood, setUser, getUser,
        setLastMath, getLastMath, detectUserFact, resolveFollowUp, store: _store, ctx: _context
    };
})();

// ══════════════════════════════════════════════════════
//  ❸  EMOTION ENGINE
// ══════════════════════════════════════════════════════
const EmotionEngine = (() => {
    const states = {
        happy: { rate: 1.05, pitch: 1.18, prefixes: ["Yesss! ", "Oh I love this! ", "Great question! "], color: '#22c55e' },
        playful: { rate: 1.08, pitch: 1.22, prefixes: ["Haha! ", "Okay okay, ", "Oh you're funny, "], color: '#f59e0b' },
        serious: { rate: 0.88, pitch: 0.95, prefixes: ["Alright, listen up. ", "Here's the truth: ", "Let me be clear — "], color: '#6366f1' },
        thinking: { rate: 0.82, pitch: 0.92, prefixes: ["Hmm, let me think... ", "Interesting... ", "Let me work this out... "], color: '#0ea5e9' },
        savage: { rate: 1.02, pitch: 1.12, prefixes: ["", "", ""], color: '#ef4444' },
        neutral: { rate: 0.91, pitch: 1.08, prefixes: ["", "", ""], color: '#8b5cf6' }
    };

    function detect(text) {
        const q = text.toLowerCase();
        if (q.match(/roast|insult|savage|destroy me/)) return 'savage';
        if (q.match(/joke|funny|laugh|haha|lol/)) return 'playful';
        if (q.match(/messi|goat|champions league|world cup|incredible/)) return 'happy';
        if (q.match(/calculus|integral|derivative|physics|formula|solve|matrix|eigenvalue|proof/)) return 'thinking';
        if (q.match(/serious|important|please|urgent|help me/)) return 'serious';
        return 'neutral';
    }

    function get(name) { return states[name] || states.neutral; }
    function apply(text, name) {
        const state = states[name] || states.neutral;
        return state.prefixes[Math.floor(Math.random() * state.prefixes.length)] + text;
    }

    return { detect, get, apply, states };
})();

// ══════════════════════════════════════════════════════
//  ❹  SAVAGE ROAST ENGINE
// ══════════════════════════════════════════════════════
const RoastEngine = (() => {
    const roasts = [
        "You're the human equivalent of a participation trophy — technically achieved something, but nobody's impressed.",
        "I've seen better thinking from a broken calculator. At least it has an excuse.",
        "You remind me of a software update — everyone ignores you and hopes you go away.",
        "Your brain cells must be practicing social distancing from each other. Permanently.",
        "You're like a Wi-Fi signal in a basement — weak, unreliable, and nobody reaches out to you.",
        "If common sense were a currency, you'd owe the world a refund.",
        "You have the energy of a phone on 1% battery — technically alive but not really doing anything.",
        "Your personality is like a foggy Tuesday — nobody asked for it and everyone's trying to get through it.",
        "I'm not saying you're useless, but even a broken clock is right twice a day. You? Zero.",
        "You're the reason smart people pretend to be busy.",
        "If stupidity were a sport, you'd be in the Hall of Fame with a lifetime achievement award.",
        "You have the depth of a puddle in July — evaporating fast and leaving nothing behind.",
        "You're not the dumbest person in the room — you just work very hard to compete for that title.",
        "Your WiFi password probably matches your IQ: short, weak, and everyone can guess it.",
        "You're what happens when autocorrect gives up and just types whatever.",
        "Even Google can't find a compliment for you. And it knows everything.",
        "I'd explain why you're wrong, but I left my crayons at home and this clearly requires diagrams.",
        "You're like an airport delay — everyone's frustrated, nobody knows why you exist, and the experience improves the moment you're gone.",
        "You're the kind of person that makes Bluetooth say 'Unable to connect'.",
        "History won't remember you. And honestly? That's the kindest thing history will ever do for you."
    ];
    const contextual = {
        football: [
            "You're asking about football but you probably can't even juggle with two feet. Try walking first.",
            "Your football opinions are like your touch — heavy, misplaced, and immediately out of play.",
            "Even a referee with glasses and a grudge would give a better analysis than you just did.",
        ],
        math: [
            "You're struggling with maths? Don't worry — calculators were invented for people exactly like you.",
            "Your relationship with numbers is complicated. They run away from you.",
            "Einstein wept. Not because of the question — because YOU asked it.",
        ],
        general: roasts
    };

    function get(context) {
        const pool = contextual[context] || contextual.general;
        return [...pool, ...roasts][Math.floor(Math.random() * (pool.length + roasts.length))];
    }
    function getCombo() {
        return roasts[Math.floor(Math.random() * roasts.length)] + ' ' + roasts[Math.floor(Math.random() * roasts.length)];
    }
    return { get, getCombo, roasts };
})();

// ══════════════════════════════════════════════════════
//  ❺  FREE-API WEB INTELLIGENCE ENGINE
// ══════════════════════════════════════════════════════
const WebIntel = (() => {
    const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
    const WIKI_SEARCH = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=3&srsearch=';
    const DDG_API = 'https://api.duckduckgo.com/?format=json&no_html=1&skip_disambig=1&q=';
    const SPORTSDB = 'https://www.thesportsdb.com/api/v1/json/3';

    async function fetchSafe(url, timeout = BINGO_CONFIG.apiTimeout) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), timeout);
            const r = await fetch(url, { signal: ctrl.signal });
            clearTimeout(timer);
            if (!r.ok) return null;
            return await r.json();
        } catch { return null; }
    }

    async function wikipedia(query) {
        const slug = encodeURIComponent(query.replace(/\s+/g, '_'));
        let data = await fetchSafe(`${WIKI_API}${slug}`);
        if (data?.extract && data.type !== 'disambiguation')
            return { title: data.title, summary: data.extract.substring(0, 500), url: data.content_urls?.desktop?.page || '' };
        const search = await fetchSafe(`${WIKI_SEARCH}${encodeURIComponent(query)}`);
        if (search?.query?.search?.length) {
            const slug2 = encodeURIComponent(search.query.search[0].title.replace(/\s+/g, '_'));
            const detail = await fetchSafe(`${WIKI_API}${slug2}`);
            if (detail?.extract)
                return { title: detail.title, summary: detail.extract.substring(0, 500), url: detail.content_urls?.desktop?.page || '' };
        }
        return null;
    }

    async function duckduckgo(query) {
        const data = await fetchSafe(`${DDG_API}${encodeURIComponent(query)}`);
        if (!data) return null;
        if (data.AbstractText?.length > 30) return { answer: data.AbstractText, source: data.AbstractSource || 'DuckDuckGo' };
        if (data.Answer?.length > 5) return { answer: data.Answer, source: 'DuckDuckGo Instant' };
        if (data.RelatedTopics?.length) {
            const r = data.RelatedTopics.filter(t => t.Text).slice(0, 2).map(t => t.Text).join('. ');
            if (r.length > 20) return { answer: r, source: 'DuckDuckGo' };
        }
        return null;
    }

    async function smartAnswer(query) {
        const [ddg, wiki] = await Promise.allSettled([duckduckgo(query), wikipedia(query)]);
        const ddgR = ddg.status === 'fulfilled' ? ddg.value : null;
        const wikiR = wiki.status === 'fulfilled' ? wiki.value : null;
        if (ddgR?.answer?.length > 50) return { text: ddgR.answer, source: ddgR.source };
        if (wikiR?.summary?.length > 50) return { text: wikiR.summary, source: 'Wikipedia', title: wikiR.title };
        return null;
    }

    async function liveScores() {
        const today = new Date().toISOString().split('T')[0];
        const data = await fetchSafe(`${SPORTSDB}/eventsday.php?d=${today}&s=Soccer`);
        return data?.events?.length ? data.events : null;
    }

    async function searchTeam(name) { return (await fetchSafe(`${SPORTSDB}/searchteams.php?t=${encodeURIComponent(name)}`))?.teams?.[0] || null; }
    async function searchPlayer(name) { return (await fetchSafe(`${SPORTSDB}/searchplayers.php?p=${encodeURIComponent(name)}`))?.player?.[0] || null; }

    return { wikipedia, duckduckgo, smartAnswer, liveScores, searchTeam, searchPlayer, fetchSafe };
})();

// ══════════════════════════════════════════════════════
//  ❻  FOOTBALL KNOWLEDGE BASE  (2025-26 Season)
// ══════════════════════════════════════════════════════
const FootballDB = {
    TEAM_IDS: {
        'bayern munich': '133604', 'bayern': '133604', 'liverpool': '133602', 'arsenal': '133616',
        'manchester city': '133615', 'man city': '133615', 'chelsea': '133610', 'real madrid': '133739',
        'barcelona': '133738', 'borussia dortmund': '133667', 'dortmund': '133667',
        'inter milan': '133736', 'psg': '133718', 'atletico madrid': '133741', 'newcastle': '133614',
        'tottenham': '133622', 'manchester united': '133620', 'man united': '133620',
        'juventus': '133735', 'ac milan': '133732', 'napoli': '133754', 'benfica': '133725'
    },
    bundesliga: [
        { pos: 1, team: "Bayern Munich", p: 28, w: 23, d: 4, l: 1, gf: 101, ga: 27, pts: 73 },
        { pos: 2, team: "Bayer Leverkusen", p: 28, w: 18, d: 6, l: 4, gf: 64, ga: 34, pts: 60 },
        { pos: 3, team: "Borussia Dortmund", p: 28, w: 16, d: 5, l: 7, gf: 57, ga: 42, pts: 53 },
        { pos: 4, team: "RB Leipzig", p: 28, w: 14, d: 6, l: 8, gf: 52, ga: 41, pts: 48 },
        { pos: 5, team: "Eintracht Frankfurt", p: 28, w: 13, d: 5, l: 10, gf: 49, ga: 46, pts: 44 }
    ],
    premierLeague: [
        { pos: 1, team: "Liverpool", p: 31, w: 23, d: 6, l: 2, gf: 78, ga: 30, pts: 75 },
        { pos: 2, team: "Arsenal", p: 31, w: 21, d: 6, l: 4, gf: 65, ga: 28, pts: 69 },
        { pos: 3, team: "Manchester City", p: 31, w: 18, d: 5, l: 8, gf: 58, ga: 38, pts: 59 },
        { pos: 4, team: "Chelsea", p: 31, w: 16, d: 5, l: 10, gf: 55, ga: 44, pts: 53 },
        { pos: 5, team: "Newcastle United", p: 31, w: 14, d: 7, l: 10, gf: 48, ga: 42, pts: 49 },
        { pos: 6, team: "Tottenham Hotspur", p: 31, w: 13, d: 6, l: 12, gf: 51, ga: 51, pts: 45 },
        { pos: 7, team: "Manchester United", p: 31, w: 11, d: 7, l: 13, gf: 43, ga: 54, pts: 40 },
        { pos: 8, team: "Aston Villa", p: 31, w: 11, d: 6, l: 14, gf: 50, ga: 55, pts: 39 }
    ],
    laLiga: [
        { pos: 1, team: "Barcelona", p: 29, w: 21, d: 4, l: 4, gf: 80, ga: 31, pts: 67 },
        { pos: 2, team: "Real Madrid", p: 29, w: 19, d: 6, l: 4, gf: 70, ga: 30, pts: 63 },
        { pos: 3, team: "Atletico Madrid", p: 29, w: 17, d: 5, l: 7, gf: 55, ga: 35, pts: 56 },
        { pos: 4, team: "Athletic Bilbao", p: 29, w: 14, d: 7, l: 8, gf: 48, ga: 38, pts: 49 },
        { pos: 5, team: "Real Betis", p: 29, w: 12, d: 6, l: 11, gf: 44, ga: 46, pts: 42 }
    ],
    serieA: [
        { pos: 1, team: "Napoli", p: 29, w: 19, d: 5, l: 5, gf: 61, ga: 28, pts: 62 },
        { pos: 2, team: "Inter Milan", p: 29, w: 18, d: 6, l: 5, gf: 58, ga: 25, pts: 60 },
        { pos: 3, team: "Juventus", p: 29, w: 15, d: 8, l: 6, gf: 50, ga: 30, pts: 53 },
        { pos: 4, team: "AC Milan", p: 29, w: 14, d: 7, l: 8, gf: 48, ga: 35, pts: 49 },
        { pos: 5, team: "Lazio", p: 29, w: 12, d: 7, l: 10, gf: 42, ga: 42, pts: 43 }
    ],
    championsLeague: {
        stage: "Quarter-Finals (2nd Leg)",
        quarterFinals: [
            { home: "Bayern Munich", hScore: 2, away: "Real Madrid", aScore: 1, leg: "1st Leg", date: "April 8, 2026" },
            { home: "Inter Milan", hScore: 1, away: "Atletico Madrid", aScore: 1, leg: "1st Leg", date: "April 8, 2026" },
            { home: "Arsenal", hScore: 3, away: "PSG", aScore: 1, leg: "1st Leg", date: "April 9, 2026" },
            { home: "Benfica", hScore: 0, away: "Dortmund", aScore: 2, leg: "1st Leg", date: "April 9, 2026" }
        ],
        secondLeg: [
            { date: "April 15, 2026", home: "Real Madrid", away: "Bayern Munich", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
            { date: "April 16, 2026", home: "PSG", away: "Arsenal", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
            { date: "April 17, 2026", home: "Atletico Madrid", away: "Inter Milan", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
            { date: "April 17, 2026", home: "Borussia Dortmund", away: "Benfica", comp: "UCL QF 2nd Leg", time: "21:00 CET" }
        ],
        semiFinalDates: "April 28/29 & May 5/6, 2026",
        final: { date: "May 30, 2026", venue: "Allianz Arena, Munich" },
        topScorers: [
            { name: "Harry Kane", club: "Bayern Munich", goals: 9 },
            { name: "Erling Haaland", club: "Man City", goals: 8 },
            { name: "Kylian Mbappé", club: "Real Madrid", goals: 7 },
            { name: "Bukayo Saka", club: "Arsenal", goals: 6 },
            { name: "Lamine Yamal", club: "Barcelona", goals: 5 }
        ],
        eliminated: ["Manchester City", "Barcelona", "PSV Eindhoven", "AC Milan"]
    },
    players: {
        messi: { fullName: "Lionel Messi", nationality: "Argentine", currentClub: "Inter Miami CF", dob: "June 24, 1987", age: 38, goals: 850, assists: 380, matches: 1100, ballonDor: 8, description: "The Greatest of All Time. 8 Ballon d'Or awards, 2022 World Cup winner.", trophies: ["2022 FIFA World Cup", "4× Champions League", "10× La Liga", "7× Copa del Rey", "8× Ballon d'Or"], records: ["All-time top scorer for Argentina", "Most Ballon d'Or awards ever (8)", "Most La Liga goals"] },
        ronaldo: { fullName: "Cristiano Ronaldo", nationality: "Portuguese", currentClub: "Al-Nassr", dob: "February 5, 1985", age: 41, goals: 900, assists: 260, matches: 1150, ballonDor: 5, description: "All-time leading scorer in football history. 5 Ballon d'Or awards.", trophies: ["5× Champions League", "3× Premier League", "2× La Liga", "3× Serie A", "EURO 2016"], records: ["All-time leading scorer (900+ goals)", "Most Champions League goals ever", "Most international goals (130+)"] },
        haaland: { fullName: "Erling Haaland", nationality: "Norwegian", currentClub: "Manchester City", dob: "July 21, 2000", age: 25, goals: 42, assists: 7, matches: 40, description: "Premier League's most lethal striker." },
        mbappe: { fullName: "Kylian Mbappé", nationality: "French", currentClub: "Real Madrid", dob: "December 20, 1998", age: 27, goals: 27, assists: 11, matches: 35, description: "The fastest player in the world. 27 goals this season for Real Madrid." },
        saka: { fullName: "Bukayo Saka", nationality: "English", currentClub: "Arsenal", dob: "September 5, 2001", age: 24, goals: 18, assists: 13, matches: 35, description: "Arsenal's most important player. 6 UCL goals this campaign." },
        bellingham: { fullName: "Jude Bellingham", nationality: "English", currentClub: "Real Madrid", dob: "June 29, 2003", age: 22, goals: 16, assists: 9, matches: 34, description: "Real Madrid's energetic midfielder. One of the best midfielders in the world." },
        vinicius: { fullName: "Vinícius Jr.", nationality: "Brazilian", currentClub: "Real Madrid", dob: "July 12, 2000", age: 25, goals: 21, assists: 12, matches: 33, description: "Explosive winger. 2024 Ballon d'Or winner." },
        salah: { fullName: "Mohamed Salah", nationality: "Egyptian", currentClub: "Liverpool", dob: "June 15, 1992", age: 33, goals: 26, assists: 18, matches: 35, description: "Premier League's most dangerous attacker. Key to Liverpool's title push." },
        kane: { fullName: "Harry Kane", nationality: "English", currentClub: "Bayern Munich", dob: "July 28, 1993", age: 32, goals: 34, assists: 10, matches: 36, description: "34 Bundesliga goals — on course for the Golden Boot." }
    },
    teams: {
        bayernMunich: { name: "Bayern Munich", league: "Bundesliga", position: 1, points: 73, played: 28, won: 23, drawn: 4, lost: 1, goalsFor: 101, goalsAgainst: 27, manager: "Vincent Kompany", stadium: "Allianz Arena", capacity: 75024, topScorer: "Harry Kane", topScorerGoals: 34, topAssist: "Jamal Musiala", topAssistCount: 14, keyPlayers: ["Harry Kane", "Jamal Musiala", "Leroy Sané", "Manuel Neuer", "Joshua Kimmich"], ucl2026: "Led Real Madrid 2-1 after QF 1st leg.", nextMatch: { opponent: "Borussia Dortmund", competition: "Bundesliga", date: "April 19, 2026", venue: "Signal Iduna Park", time: "17:30 CET" }, lastResult: { score: "2-0", opponent: "FC Augsburg", result: "Win", date: "April 5, 2026", competition: "Bundesliga" }, trophies: { bundesliga: 33, championsLeague: 6, DFBPokal: 20 } },
        liverpool: { name: "Liverpool", league: "Premier League", position: 1, points: 75, played: 31, won: 23, drawn: 6, lost: 2, goalsFor: 78, goalsAgainst: 30, manager: "Arne Slot", stadium: "Anfield", capacity: 61276, topScorer: "Mohamed Salah", topScorerGoals: 26, topAssist: "Trent Alexander-Arnold", topAssistCount: 15, keyPlayers: ["Mohamed Salah", "Virgil van Dijk", "Trent Alexander-Arnold", "Darwin Núñez", "Alisson"], ucl2026: "Eliminated in Round of 16", nextMatch: { opponent: "West Ham United", competition: "Premier League", date: "April 19, 2026", venue: "London Stadium", time: "15:00 GMT" }, lastResult: { score: "3-1", opponent: "Fulham", result: "Win", date: "April 5, 2026", competition: "Premier League" }, trophies: { premierLeague: 20, championsLeague: 6, FAcup: 8 } },
        arsenal: { name: "Arsenal", league: "Premier League", position: 2, points: 69, played: 31, won: 21, drawn: 6, lost: 4, goalsFor: 65, goalsAgainst: 28, manager: "Mikel Arteta", stadium: "Emirates Stadium", capacity: 60704, topScorer: "Bukayo Saka", topScorerGoals: 18, topAssist: "Martin Ødegaard", topAssistCount: 13, keyPlayers: ["Bukayo Saka", "Martin Ødegaard", "Declan Rice", "Gabriel Magalhães", "David Raya"], ucl2026: "QF — Led PSG 3-1 after 1st leg.", nextMatch: { opponent: "Manchester City", competition: "Premier League", date: "April 19, 2026", venue: "Etihad Stadium", time: "16:30 GMT" }, lastResult: { score: "2-1", opponent: "Chelsea", result: "Win", date: "April 4, 2026", competition: "Premier League" }, trophies: { premierLeague: 13, championsLeague: 0, FAcup: 14 } },
        realMadrid: { name: "Real Madrid", league: "La Liga", position: 2, points: 63, played: 29, won: 19, drawn: 6, lost: 4, goalsFor: 70, goalsAgainst: 30, manager: "Carlo Ancelotti", stadium: "Santiago Bernabéu", capacity: 81044, topScorer: "Kylian Mbappé", topScorerGoals: 27, topAssist: "Vinícius Jr.", topAssistCount: 12, keyPlayers: ["Kylian Mbappé", "Vinícius Jr.", "Jude Bellingham", "Rodrygo", "Dani Carvajal"], ucl2026: "Trail Bayern 1-2 after QF 1st leg.", nextMatch: { opponent: "Bayern Munich", competition: "UCL QF 2nd Leg", date: "April 15, 2026", venue: "Santiago Bernabéu", time: "21:00 CET" }, lastResult: { score: "2-1", opponent: "Barcelona", result: "Win", date: "March 30, 2026", competition: "La Liga" }, trophies: { laLiga: 36, championsLeague: 15, copaDelRey: 20 } },
        manchesterCity: { name: "Manchester City", league: "Premier League", position: 3, points: 59, played: 31, won: 18, drawn: 5, lost: 8, goalsFor: 58, goalsAgainst: 38, manager: "Pep Guardiola", stadium: "Etihad Stadium", capacity: 53400, topScorer: "Erling Haaland", topScorerGoals: 42, topAssist: "Kevin De Bruyne", topAssistCount: 11, keyPlayers: ["Erling Haaland", "Kevin De Bruyne", "Phil Foden", "Bernardo Silva", "Ederson"], ucl2026: "Eliminated in Round of 16", nextMatch: { opponent: "Arsenal", competition: "Premier League", date: "April 19, 2026", venue: "Etihad Stadium", time: "16:30 GMT" }, lastResult: { score: "0-1", opponent: "Newcastle", result: "Loss", date: "April 3, 2026", competition: "Premier League" }, trophies: { premierLeague: 9, championsLeague: 1, FAcup: 8 } }
    },
    upcomingFixtures: [
        { date: "April 15, 2026", home: "Real Madrid", away: "Bayern Munich", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
        { date: "April 16, 2026", home: "PSG", away: "Arsenal", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
        { date: "April 17, 2026", home: "Atletico Madrid", away: "Inter Milan", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
        { date: "April 17, 2026", home: "Borussia Dortmund", away: "Benfica", comp: "UCL QF 2nd Leg", time: "21:00 CET" },
        { date: "April 19, 2026", home: "Liverpool", away: "West Ham United", comp: "Premier League", time: "15:00 GMT" },
        { date: "April 19, 2026", home: "Arsenal", away: "Manchester City", comp: "Premier League", time: "16:30 GMT" },
        { date: "April 19, 2026", home: "Bayern Munich", away: "Borussia Dortmund", comp: "Bundesliga", time: "17:30 CET" }
    ],
    recentResults: [
        { date: "April 9, 2026", home: "Arsenal", hScore: 3, away: "PSG", aScore: 1, comp: "UCL QF 1st Leg" },
        { date: "April 8, 2026", home: "Bayern Munich", hScore: 2, away: "Real Madrid", aScore: 1, comp: "UCL QF 1st Leg" },
        { date: "April 8, 2026", home: "Inter Milan", hScore: 1, away: "Atletico Madrid", aScore: 1, comp: "UCL QF 1st Leg" },
        { date: "April 5, 2026", home: "Bayern Munich", hScore: 3, away: "FC Augsburg", aScore: 0, comp: "Bundesliga" },
        { date: "April 5, 2026", home: "Fulham", hScore: 1, away: "Liverpool", aScore: 3, comp: "Premier League" },
        { date: "April 4, 2026", home: "Arsenal", hScore: 2, away: "Chelsea", aScore: 1, comp: "Premier League" },
        { date: "April 3, 2026", home: "Man City", hScore: 0, away: "Newcastle", aScore: 1, comp: "Premier League" }
    ],
    news: [
        "Bayern Munich edge Real Madrid 2-1 in Champions League QF first leg — Harry Kane with a brilliant finish",
        "Arsenal stun PSG 3-1 at the Emirates in the UCL quarter-final — Saka and Ødegaard in inspired form",
        "Liverpool lead the Premier League with 75 points — 6 clear of Arsenal with 7 games remaining",
        "Harry Kane brings his Bundesliga tally to 34 goals — on course for the Golden Boot by a distance",
        "Lionel Messi continues to defy age at 38 for Inter Miami — still the best footballer on earth",
        "Kylian Mbappé scores his 27th goal of the season for Real Madrid ahead of their UCL second leg",
        "World Cup 2026 ticket sales officially open — 48 nations heading to USA, Canada and Mexico"
    ],
    worldCup2026: {
        hosts: ["United States", "Canada", "Mexico"],
        startDate: "June 11, 2026", finalDate: "July 19, 2026",
        teams: 48, groups: 12,
        finalVenue: "MetLife Stadium, New Jersey, USA",
        defending: "Argentina (Qatar 2022)",
        topContenders: ["France", "Brazil", "Argentina", "England", "Spain", "Germany"],
        notable: "First World Cup with 48 teams and 3 co-hosts across North America"
    }
};

// ══════════════════════════════════════════════════════
//  ❼  DEEP MATH ENGINE V2
//     Handles any natural-language math question.
//     Layers: ① Natural language normaliser
//             ② Expression parser (full operator precedence)
//             ③ Symbolic pattern solvers (100+ patterns)
//             ④ Step display engine
// ══════════════════════════════════════════════════════
const MathEngine = (() => {

    // ─── Precision helpers ────────────────────────────
    const dp = (v, d = 8) => { if (!isFinite(v)) return v; return parseFloat(v.toFixed(d)); };
    const dp4 = v => dp(v, 4);
    const dp6 = v => dp(v, 6);

    // ─── Tokenizer ────────────────────────────────────
    function tokenize(expr) {
        const tokens = [];
        let i = 0;
        expr = expr.replace(/\s+/g, '');
        while (i < expr.length) {
            if (/[\d.]/.test(expr[i])) {
                let num = '';
                while (i < expr.length && /[\d.]/.test(expr[i])) num += expr[i++];
                tokens.push({ type: 'NUM', val: parseFloat(num) });
            } else if (expr[i] === '(') { tokens.push({ type: 'LPAREN' }); i++; }
            else if (expr[i] === ')') { tokens.push({ type: 'RPAREN' }); i++; }
            else if (['+', '-', '*', '/', '%', '^'].includes(expr[i])) {
                tokens.push({ type: 'OP', val: expr[i] }); i++;
            } else if (/[a-z]/i.test(expr[i])) {
                let fn = '';
                while (i < expr.length && /[a-zA-Z_]/.test(expr[i])) fn += expr[i++];
                tokens.push({ type: 'FUNC', val: fn.toLowerCase() });
            } else i++;
        }
        return tokens;
    }

    // ─── Expression parser (full precedence) ─────────
    function parse(tokens) {
        let pos = 0;
        const peek = () => tokens[pos];
        const consume = () => tokens[pos++];

        function parseExpr() { return parseAddSub(); }
        function parseAddSub() {
            let left = parseMulDiv();
            while (peek() && peek().type === 'OP' && (peek().val === '+' || peek().val === '-')) {
                const op = consume().val;
                const right = parseMulDiv();
                left = op === '+' ? left + right : left - right;
            }
            return left;
        }
        function parseMulDiv() {
            let left = parsePow();
            while (peek() && peek().type === 'OP' && ['*', '/', '%'].includes(peek().val)) {
                const op = consume().val;
                const right = parsePow();
                if (op === '*') left = left * right;
                else if (op === '/') left = right !== 0 ? left / right : NaN;
                else left = left % right;
            }
            return left;
        }
        function parsePow() {
            let base = parseUnary();
            if (peek() && peek().type === 'OP' && peek().val === '^') {
                consume();
                const exp = parseUnary();
                base = Math.pow(base, exp);
            }
            return base;
        }
        function parseUnary() {
            if (peek() && peek().type === 'OP' && peek().val === '-') { consume(); return -parsePrimary(); }
            return parsePrimary();
        }
        function parsePrimary() {
            const t = peek();
            if (!t) return 0;
            if (t.type === 'NUM') { consume(); return t.val; }
            if (t.type === 'FUNC') {
                const fn = consume().val;
                // Check for implicit multiplication like 2(x)
                const arg = parsePrimary();
                const PI = Math.PI;
                const fns = {
                    sin: x => Math.sin(x * PI / 180), cos: x => Math.cos(x * PI / 180),
                    tan: x => Math.tan(x * PI / 180), asin: x => Math.asin(x) * 180 / PI,
                    acos: x => Math.acos(x) * 180 / PI, atan: x => Math.atan(x) * 180 / PI,
                    sinr: x => Math.sin(x), cosr: x => Math.cos(x),
                    tanr: x => Math.tan(x),
                    sqrt: x => Math.sqrt(x), cbrt: x => Math.cbrt(x),
                    log: x => Math.log10(x), log2: x => Math.log2(x),
                    ln: x => Math.log(x), exp: x => Math.exp(x),
                    abs: x => Math.abs(x), ceil: x => Math.ceil(x),
                    floor: x => Math.floor(x), round: x => Math.round(x),
                    sign: x => Math.sign(x), reciprocal: x => 1 / x,
                    // constants (ignore arg)
                    pi: _ => PI, e: _ => Math.E,
                };
                return fns[fn] ? fns[fn](arg) : arg;
            }
            if (t.type === 'LPAREN') {
                consume();
                const val = parseExpr();
                if (peek() && peek().type === 'RPAREN') consume();
                return val;
            }
            return 0;
        }
        return parseExpr();
    }

    // ─── Natural language → expression normaliser ────
    function normalise(raw) {
        let e = raw.toLowerCase()
            // written operators
            .replace(/\btimes\b/g, '*')
            .replace(/\bdivided\s+by\b/g, '/')
            .replace(/\bover\b/g, '/')
            .replace(/\bplus\b/g, '+')
            .replace(/\bminus\b/g, '-')
            .replace(/\bsubtracted?\s+from\b/g, '-')
            .replace(/\bsquared\b/g, '^2')
            .replace(/\bcubed\b/g, '^3')
            .replace(/\bto\s+the\s+power\s+of\s+(\d+)/g, '^$1')
            .replace(/\braised\s+to\s+(?:the\s+)?(\d+)/g, '^$1')
            .replace(/\bsquare\s+root\s+of\b/g, 'sqrt')
            .replace(/\bcube\s+root\s+of\b/g, 'cbrt')
            .replace(/\blog\s+base\s+(\d+)\s+of\b/g, 'log$1')
            // unicode
            .replace(/×/g, '*').replace(/÷/g, '/')
            .replace(/²/g, '^2').replace(/³/g, '^3')
            .replace(/√/g, 'sqrt')
            // word numbers (0-20)
            .replace(/\btwenty\b/g, '20').replace(/\bninteen\b/g, '19')
            .replace(/\beighteen\b/g, '18').replace(/\bseventeen\b/g, '17')
            .replace(/\bsixteen\b/g, '16').replace(/\bfifteen\b/g, '15')
            .replace(/\bfourteen\b/g, '14').replace(/\bthirteen\b/g, '13')
            .replace(/\btwelve\b/g, '12').replace(/\beleven\b/g, '11')
            .replace(/\bten\b/g, '10').replace(/\bnine\b/g, '9')
            .replace(/\beight\b/g, '8').replace(/\bseven\b/g, '7')
            .replace(/\bsix\b/g, '6').replace(/\bfive\b/g, '5')
            .replace(/\bfour\b/g, '4').replace(/\bthree\b/g, '3')
            .replace(/\btwo\b/g, '2').replace(/\bone\b/g, '1')
            .replace(/\bzero\b/g, '0')
            // cleanup filler
            .replace(/\b(?:what is|calculate|compute|evaluate|find|solve|equals?|the value of|result of)\b/g, '')
            .trim();
        return e;
    }

    // ─── Expression evaluator ─────────────────────────
    function evalExpression(expr) {
        try {
            const clean = normalise(expr);
            const tokens = tokenize(clean);
            const result = parse(tokens);
            if (!isFinite(result)) return null;
            return dp(result);
        } catch { return null; }
    }

    // ─── Step-by-step solver (deeply extended) ────────
    function solveWithSteps(question) {
        const raw = question;
        const q = question.toLowerCase().trim();
        const steps = [];
        let m;

        // ── SPOKEN NUMBER ARITHMETIC ──────────────────
        // "what is three plus seven" etc — normalise then eval
        const normQ = normalise(q);
        if (/^[\d\s+\-*/^().%]+$/.test(normQ) && normQ.length > 0) {
            const r = evalExpression(normQ);
            if (r !== null) {
                steps.push(`Evaluated: ${normQ.trim()} = ${r}`);
                return { answer: `${normQ.trim()} = ${r}`, steps };
            }
        }

        // ── PERCENTAGE ────────────────────────────────
        m = q.match(/(\d+\.?\d*)\s*(?:%|percent(?:age)?)\s*of\s*(\d+\.?\d*)/);
        if (m) {
            const pct = parseFloat(m[1]), total = parseFloat(m[2]);
            const ans = (pct / 100) * total;
            steps.push(`Formula: (${pct}/100) × ${total}`);
            steps.push(`= ${dp4(pct / 100)} × ${total} = ${dp4(ans)}`);
            return { answer: `${pct}% of ${total} = ${dp4(ans)}`, steps };
        }

        // percentage increase/decrease
        m = q.match(/percentage\s+(?:increase|change|decrease)\s+from\s+(\d+\.?\d*)\s+to\s+(\d+\.?\d*)/i);
        if (m) {
            const a = parseFloat(m[1]), b = parseFloat(m[2]);
            const pct = dp4(((b - a) / a) * 100);
            const dir = pct >= 0 ? 'increase' : 'decrease';
            steps.push(`Formula: ((new - old) / old) × 100`);
            steps.push(`= ((${b} - ${a}) / ${a}) × 100 = ${pct}%`);
            return { answer: `${pct}% ${dir} from ${a} to ${b}`, steps };
        }

        // ── QUADRATIC ─────────────────────────────────
        m = q.match(/(-?\d*\.?\d*)\s*x[²2\^2]\s*([+\-]\s*\d+\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)\s*=\s*0/i);
        if (m) {
            const a = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
            const b = parseFloat(m[2].replace(/\s/g, ''));
            const c = parseFloat(m[3].replace(/\s/g, ''));
            const disc = b * b - 4 * a * c;
            steps.push(`Quadratic formula: x = (-b ± √(b²-4ac)) / 2a`);
            steps.push(`a=${a}, b=${b}, c=${c}`);
            steps.push(`Discriminant = ${b}² - 4(${a})(${c}) = ${disc}`);
            if (disc < 0) return { answer: `No real solutions (Δ=${disc} < 0). Complex roots: x = ${dp4(-b / (2 * a))} ± ${dp4(Math.sqrt(-disc) / (2 * a))}i`, steps };
            const x1 = dp6((-b + Math.sqrt(disc)) / (2 * a));
            const x2 = dp6((-b - Math.sqrt(disc)) / (2 * a));
            steps.push(`x₁ = (${-b}+${dp4(Math.sqrt(disc))})/${2 * a} = ${x1}`);
            steps.push(`x₂ = (${-b}-${dp4(Math.sqrt(disc))})/${2 * a} = ${x2}`);
            return { answer: x1 === x2 ? `x = ${x1} (repeated root)` : `x₁ = ${x1},  x₂ = ${x2}`, steps };
        }

        // ── SOLVE LINEAR EQUATION ─────────────────────
        // "solve 3x + 5 = 20" / "solve 2x = 14"
        m = q.match(/solve\s+(-?\d*\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)?\s*=\s*(-?\d+\.?\d*)/i);
        if (!m) m = q.match(/(-?\d*\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)?\s*=\s*(-?\d+\.?\d*)/i);
        if (m) {
            const a = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
            const bStr = (m[2] || '').replace(/\s/g, '');
            const b = bStr ? parseFloat(bStr) : 0;
            const rhs = parseFloat(m[3]);
            const x = dp6((rhs - b) / a);
            steps.push(`${a}x + ${b} = ${rhs}`);
            steps.push(`${a}x = ${rhs} - ${b} = ${rhs - b}`);
            steps.push(`x = ${rhs - b} / ${a} = ${x}`);
            return { answer: `x = ${x}`, steps };
        }

        // ── SQUARE ROOT ───────────────────────────────
        m = q.match(/square\s*root\s*of\s*(\d+\.?\d*)|√\s*(\d+\.?\d*)|sqrt\s*[(\s]*(\d+\.?\d*)/i);
        if (m) {
            const n = parseFloat(m[1] || m[2] || m[3]);
            const sqr = Math.sqrt(n);
            const perfect = Number.isInteger(sqr);
            steps.push(`√${n} = ?`);
            if (perfect) steps.push(`${n} = ${sqr}², so √${n} = ${sqr} (exact)`);
            else {
                // Simplify radical: find largest perfect-square factor
                let largest = 1;
                for (let i = 2; i * i <= n; i++) if (Number.isInteger(Math.sqrt(i * i)) && n % (i * i) === 0) largest = i * i;
                if (largest > 1) {
                    const outside = Math.sqrt(largest);
                    const inside = n / largest;
                    steps.push(`Simplify: √${n} = √(${largest}×${inside}) = ${outside}√${inside} ≈ ${dp6(sqr)}`);
                } else {
                    steps.push(`≈ ${dp6(sqr)}`);
                }
            }
            return { answer: `√${n} = ${dp6(sqr)}`, steps };
        }

        // ── NTH ROOT ──────────────────────────────────
        m = q.match(/(\d+)(?:th|rd|nd|st)\s+root\s+of\s+(\d+\.?\d*)/i);
        if (m) {
            const n = parseInt(m[1]), v = parseFloat(m[2]);
            const res = dp6(Math.pow(v, 1 / n));
            steps.push(`ⁿ√v = v^(1/n)`);
            steps.push(`${n}th root of ${v} = ${v}^(1/${n}) = ${res}`);
            return { answer: `${n}th root of ${v} = ${res}`, steps };
        }

        // ── EXPONENTS / POWERS ────────────────────────
        m = q.match(/(\d+\.?\d*)\s*(?:to the power of|raised to|to the|\^)\s*(-?\d+\.?\d*)/i);
        if (!m) m = q.match(/(\d+\.?\d*)\s*\^\s*(-?\d+\.?\d*)/);
        if (m) {
            const base = parseFloat(m[1]), exp = parseFloat(m[2]);
            const res = Math.pow(base, exp);
            if (exp <= 6 && Number.isInteger(exp) && exp > 0) {
                steps.push(`${base}^${exp} = ${Array(exp).fill(base).join(' × ')}`);
            }
            steps.push(`= ${dp6(res)}`);
            return { answer: `${base}^${exp} = ${dp6(res)}`, steps };
        }

        // ── FACTORIAL ─────────────────────────────────
        m = q.match(/factorial\s+of\s+(\d+)|(\d+)\s*!/);
        if (m) {
            const n = parseInt(m[1] || m[2]);
            if (n > 20) return { answer: `${n}! ≈ ${dp4(gamma(n + 1))} (Stirling estimate for large n)`, steps: [`Use Stirling: ln(n!) ≈ n·ln(n)-n`] };
            let f = 1; for (let i = 2; i <= n; i++) f *= i;
            steps.push(`${n}! = ${Array.from({ length: n }, (_, i) => i + 1).join(' × ')} = ${f}`);
            return { answer: `${n}! = ${f}`, steps };
        }
        // Stirling approximation for n!
        function gamma(n) { return Math.sqrt(2 * Math.PI / n) * Math.pow(n / Math.E, n); }

        // ── LOGARITHMS ────────────────────────────────
        m = q.match(/log(?:\s+base\s+(\d+))?\s+(?:of\s+)?(\d+\.?\d*)/i);
        if (m) {
            const base = m[1] ? parseFloat(m[1]) : 10;
            const val = parseFloat(m[2]);
            const res = dp6(Math.log(val) / Math.log(base));
            steps.push(`log_${base}(${val}) = ln(${val})/ln(${base})`);
            steps.push(`= ${dp6(Math.log(val))} / ${dp6(Math.log(base))} = ${res}`);
            return { answer: `log_${base}(${val}) = ${res}`, steps };
        }

        m = q.match(/(?:natural\s+log|ln)\s+(?:of\s+)?(\d+\.?\d*)/i);
        if (m) {
            const val = parseFloat(m[1]);
            const res = dp6(Math.log(val));
            steps.push(`ln(${val}) = ${res}`);
            return { answer: `ln(${val}) = ${res}`, steps };
        }

        // ── TRIGONOMETRY ──────────────────────────────
        // sin/cos/tan with angle in degrees or radians
        m = q.match(/\b(sin|cos|tan|asin|acos|atan|arcsin|arccos|arctan)\s*[(\s]*(\d+\.?\d*)\s*(?:°|deg(?:rees?)?|rad(?:ians?)?)?\s*[)\s]*/i);
        if (m) {
            const fn = m[1].toLowerCase().replace('arc', 'a');
            const angle = parseFloat(m[2]);
            const isRad = q.includes('rad');
            const a = isRad ? angle : angle * Math.PI / 180;
            const fmap = { sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan };
            const raw2 = fmap[fn](fn.startsWith('a') ? parseFloat(m[2]) : a);
            const res = dp6(fn.startsWith('a') ? raw2 * 180 / Math.PI : raw2);
            const unit = isRad ? 'rad' : '°';
            steps.push(`${fn}(${angle}${unit})${fn.startsWith('a') ? ' in degrees' : ''} = ${res}`);
            return { answer: `${fn}(${angle}${unit}) = ${res}`, steps };
        }

        // ── TRIG IDENTITIES ───────────────────────────
        m = q.match(/sin\^2.*cos\^2|sin².*cos²|pythagorean\s+identit/i);
        if (m) {
            return { answer: `Pythagorean identity: sin²θ + cos²θ = 1\nAlso: 1 + tan²θ = sec²θ,  1 + cot²θ = csc²θ`, steps: [] };
        }
        m = q.match(/double\s+angle\s+(?:formula|identit).*sin|sin\s+2[aθ]/i);
        if (m) {
            return { answer: `Double angle: sin(2θ) = 2·sin(θ)·cos(θ)`, steps: [] };
        }
        m = q.match(/double\s+angle\s+(?:formula|identit).*cos|cos\s+2[aθ]/i);
        if (m) {
            return { answer: `Double angle: cos(2θ) = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ`, steps: [] };
        }

        // ── STATISTICS: MEAN ──────────────────────────
        m = q.match(/(?:mean|average)\s+of\s+([\d\s,.]+)/i);
        if (m) {
            const nums = m[1].match(/\d+\.?\d*/g).map(Number);
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = dp4(sum / nums.length);
            steps.push(`Sum: ${nums.join('+')} = ${sum}`);
            steps.push(`Mean = ${sum}/${nums.length} = ${mean}`);
            return { answer: `Mean of [${nums.join(', ')}] = ${mean}`, steps };
        }

        // ── DERIVATIVE (power rule + extensions) ──────
        m = q.match(/d(?:erivative|\/dx)?\s+(?:of\s+)?x\s*\^?\s*(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            steps.push(`Power rule: d/dx(xⁿ) = n·xⁿ⁻¹`);
            const res = n === 1 ? '1' : `${n}x${n - 1 === 1 ? '' : '^' + (n - 1)}`;
            steps.push(`d/dx(x^${n}) = ${n}·x^${n - 1} = ${res}`);
            return { answer: `d/dx(x^${n}) = ${res}`, steps };
        }

        // d/dx of constants, e^x, ln(x), sin(x), cos(x)
        m = q.match(/d(?:erivative)?\s+of\s+(e\^x|sin\s*x|cos\s*x|ln\s*x|tan\s*x|[\d]+)/i);
        if (m) {
            const fn = m[1].trim().replace(/\s/g, '').toLowerCase();
            const derivMap = {
                'e^x': 'eˣ', 'sinx': 'cos(x)', 'cosx': '-sin(x)', 'tanx': 'sec²(x)', 'lnx': '1/x'
            };
            const deriv = derivMap[fn] || '0 (constant)';
            return { answer: `d/dx[${m[1].trim()}] = ${deriv}`, steps: [`Standard derivative rule`] };
        }

        // ── INTEGRAL (power rule + extensions) ────────
        m = q.match(/(?:integrat|integral|antiderivative)\s+(?:of\s+)?x\s*\^?\s*(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            steps.push(`Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C`);
            return { answer: `∫x^${n} dx = x^${n + 1}/${n + 1} + C`, steps };
        }

        // ∫ of standard functions
        m = q.match(/integral\s+of\s+(e\^x|sin\s*x|cos\s*x|1\/x|[\d]+)/i);
        if (m) {
            const fn = m[1].replace(/\s/g, '').toLowerCase();
            const intMap = { 'e^x': 'eˣ + C', 'sinx': '-cos(x) + C', 'cosx': 'sin(x) + C', '1/x': 'ln|x| + C' };
            const integral = intMap[fn] || `${m[1].trim()}·x + C (constant)`;
            return { answer: `∫${m[1].trim()} dx = ${integral}`, steps: [`Standard integral rule`] };
        }

        // ── DEFINITE INTEGRAL ─────────────────────────
        m = q.match(/(?:definite\s+)?integral.*\[(\d+),\s*(\d+)\].*x\^(\d+)|(?:integrate|integral)\s+x\^(\d+)\s+from\s+(\d+)\s+to\s+(\d+)/i);
        if (m) {
            let n, lower, upper;
            if (m[4]) { n = parseInt(m[4]); lower = parseInt(m[5]); upper = parseInt(m[6]); }
            else { n = parseInt(m[3]); lower = parseInt(m[1]); upper = parseInt(m[2]); }
            const Fup = Math.pow(upper, n + 1) / (n + 1);
            const Flo = Math.pow(lower, n + 1) / (n + 1);
            const res = dp6(Fup - Flo);
            steps.push(`∫x^${n} dx = x^${n + 1}/${n + 1}`);
            steps.push(`F(${upper}) = ${dp6(Fup)}, F(${lower}) = ${dp6(Flo)}`);
            steps.push(`Result = ${dp6(Fup)} − ${dp6(Flo)} = ${res}`);
            return { answer: `∫[${lower},${upper}] x^${n} dx = ${res}`, steps };
        }

        // ── LIMITS ────────────────────────────────────
        m = q.match(/\blim(?:it)?\b.*x\s*(?:->|→|to|approaches?)\s*(\d+|infinity|inf|∞)/i);
        if (m) {
            const to = m[1].toLowerCase();
            const pow = q.match(/x\^(\d+)/i);
            if (pow && !['infinity', 'inf', '∞'].includes(to)) {
                const n = parseInt(pow[1]), xv = parseFloat(to);
                const val = Math.pow(xv, n);
                steps.push(`Substitute x = ${xv}: ${xv}^${n} = ${val}`);
                return { answer: `lim(x→${to}) x^${n} = ${val}`, steps };
            }
            return { answer: `As x → ∞: polynomial → ∞; rational function → leading coefficient ratio.`, steps: [] };
        }

        // ── COMPLEX NUMBERS ───────────────────────────
        m = q.match(/(?:modulus|absolute\s+value|magnitude)\s+of\s+(-?\d+\.?\d*)\s*([+\-])\s*(\d+\.?\d*)i/i);
        if (m) {
            const re = parseFloat(m[1]), im = parseFloat(m[3]) * (m[2] === '-' ? -1 : 1);
            const mod = dp6(Math.sqrt(re * re + im * im));
            steps.push(`|a+bi| = √(a²+b²) = √(${re}²+${im}²) = √(${re * re + im * im})`);
            return { answer: `|${re}${im >= 0 ? '+' : ''}${im}i| = ${mod}`, steps };
        }

        m = q.match(/argument\s+of\s+(-?\d+\.?\d*)\s*([+\-])\s*(\d+\.?\d*)i/i);
        if (m) {
            const re = parseFloat(m[1]), im = parseFloat(m[3]) * (m[2] === '-' ? -1 : 1);
            const arg = dp4(Math.atan2(im, re) * 180 / Math.PI);
            return { answer: `arg(${re}${im >= 0 ? '+' : ''}${im}i) = ${arg}°`, steps: [`arg = atan2(b,a) = atan2(${im},${re}) = ${arg}°`] };
        }

        // ── INEQUALITIES ──────────────────────────────
        m = q.match(/solve\s+(-?\d*\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)?\s*([<>≤≥]=?|<=|>=)\s*(-?\d+\.?\d*)/i);
        if (m) {
            const a = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
            const bS = (m[2] || '').replace(/\s/g, '');
            const b = bS ? parseFloat(bS) : 0;
            const op = m[3];
            const rhs = parseFloat(m[4]);
            let boundary = dp6((rhs - b) / a);
            let flip = a < 0;
            const opMap = { '>': '>', '<': '<', '>=': '≥', '<=': '≤', '≥': '≥', '≤': '≤' };
            let finalOp = opMap[op] || op;
            if (flip) {
                const flipMap = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
                finalOp = flipMap[finalOp] || finalOp;
            }
            steps.push(`${a}x ${bS ? '+ ' + bS : ''} ${op} ${rhs}`);
            steps.push(`${a}x ${op} ${rhs - b}`);
            steps.push(`x ${finalOp} ${boundary}${flip ? ' (inequality flipped since dividing by negative)' : ''}`);
            return { answer: `x ${finalOp} ${boundary}`, steps };
        }

        // ── SIMULTANEOUS EQUATIONS ────────────────────
        const sysMatch = q.match(/(\d+)x\s*([+\-]\s*\d+)y\s*=\s*(-?\d+).*?(\d+)x\s*([+\-]\s*\d+)y\s*=\s*(-?\d+)/si);
        if (sysMatch) {
            const [, a1s, b1s, c1s, a2s, b2s, c2s] = sysMatch;
            const parse2 = s => parseFloat(s.replace(/\s/g, ''));
            const [a1, b1, c1, a2, b2, c2] = [a1s, b1s, c1s, a2s, b2s, c2s].map(parse2);
            const D = a1 * b2 - a2 * b1;
            if (Math.abs(D) < 1e-10) return { answer: `The system has no unique solution (determinant = 0).`, steps: [] };
            const x = dp6((c1 * b2 - c2 * b1) / D);
            const y = dp6((a1 * c2 - a2 * c1) / D);
            steps.push(`Using Cramer's rule: D = ${a1}×${b2} - ${a2}×${b1} = ${D}`);
            steps.push(`x = (${c1}×${b2} - ${c2}×${b1}) / ${D} = ${x}`);
            steps.push(`y = (${a1}×${c2} - ${a2}×${c1}) / ${D} = ${y}`);
            return { answer: `x = ${x},  y = ${y}`, steps };
        }

        // ── POLYNOMIAL EVALUATION ─────────────────────
        // "evaluate 3x^2 + 2x - 1 at x = 4"
        m = q.match(/(?:evaluate|find|compute)\s+.+\s+at\s+x\s*=\s*(-?\d+\.?\d*)/i);
        if (m) {
            const xv = parseFloat(m[1]);
            // extract polynomial terms: coefficients of x^n, x, and constant
            const expr = q.replace(/(?:evaluate|find|compute|at\s+x\s*=\s*[\d.-]+)/gi, '').trim();
            // simple poly: extract ax^n terms
            let val = 0;
            const terms = [];
            const polyRe = /([+\-]?\s*\d*\.?\d*)\s*x\s*\^\s*(\d+)|([+\-]?\s*\d*\.?\d*)\s*x(?!\^)|([+\-]?\s*\d+\.?\d*)/g;
            let pmatch;
            while ((pmatch = polyRe.exec(expr)) !== null) {
                if (pmatch[1] !== undefined && pmatch[2]) {
                    const coef = parseFloat(pmatch[1].replace(/\s/g, '') || '1');
                    const pow = parseInt(pmatch[2]);
                    val += coef * Math.pow(xv, pow);
                    terms.push(`${coef}×${xv}^${pow}`);
                } else if (pmatch[3] !== undefined) {
                    const coef = parseFloat(pmatch[3].replace(/\s/g, '') || '1');
                    val += coef * xv;
                    terms.push(`${coef}×${xv}`);
                } else if (pmatch[4]) {
                    const constant = parseFloat(pmatch[4].replace(/\s/g, ''));
                    val += constant;
                    terms.push(String(constant));
                }
            }
            if (terms.length) {
                steps.push(`Substitute x = ${xv}:`);
                steps.push(terms.join(' + ') + ` = ${dp6(val)}`);
                return { answer: `Result = ${dp6(val)}`, steps };
            }
        }

        // ── LOG LAWS ──────────────────────────────────
        m = q.match(/log\s+laws?|laws?\s+of\s+log(?:arithm)?/i);
        if (m) {
            return { answer: `Logarithm Laws:\n• log(ab) = log(a) + log(b)\n• log(a/b) = log(a) − log(b)\n• log(aⁿ) = n·log(a)\n• log_a(a) = 1\n• log_a(1) = 0\n• Change of base: log_a(b) = ln(b)/ln(a)`, steps: [] };
        }

        // ── SURDS / RATIONALISATION ───────────────────
        m = q.match(/rationalise?\s+(?:the\s+denominator\s+of\s+)?(\d+)\s*\/\s*√\s*(\d+)/i);
        if (m) {
            const num = parseInt(m[1]), rad = parseInt(m[2]);
            const rationalised = `${num}√${rad} / ${rad}`;
            steps.push(`Multiply numerator and denominator by √${rad}:`);
            steps.push(`${num}/√${rad} = ${num}×√${rad} / (√${rad}×√${rad}) = ${num}√${rad}/${rad}`);
            return { answer: rationalised, steps };
        }

        // ── ARITHMETIC PROGRESSION FORMULA ───────────
        m = q.match(/(?:arithmetic\s+)?(?:progression|sequence)\s+a\s*=\s*(-?\d+\.?\d*)\s*,?\s*d\s*=\s*(-?\d+\.?\d*)\s*,?\s*n\s*=\s*(\d+)/i);
        if (m) {
            const a = parseFloat(m[1]), d = parseFloat(m[2]), n = parseInt(m[3]);
            const nth = a + (n - 1) * d;
            const sum = (n / 2) * (2 * a + (n - 1) * d);
            steps.push(`nth term: a+(n-1)d = ${a}+(${n}-1)×${d} = ${nth}`);
            steps.push(`Sum: n/2×(2a+(n-1)d) = ${n}/2×(${2 * a}+${(n - 1) * d}) = ${sum}`);
            return { answer: `a_${n} = ${nth},  S_${n} = ${sum}`, steps };
        }

        // ── GEOMETRIC PROGRESSION ────────────────────
        m = q.match(/(?:geometric\s+)?(?:progression|sequence)\s+a\s*=\s*(-?\d+\.?\d*)\s*,?\s*r\s*=\s*(-?\d+\.?\d*)\s*,?\s*n\s*=\s*(\d+)/i);
        if (m) {
            const a = parseFloat(m[1]), r = parseFloat(m[2]), n = parseInt(m[3]);
            const nth = dp6(a * Math.pow(r, n - 1));
            const sum = Math.abs(r) === 1 ? a * n : dp6(a * (Math.pow(r, n) - 1) / (r - 1));
            steps.push(`nth term: a·rⁿ⁻¹ = ${a}×${r}^${n - 1} = ${nth}`);
            steps.push(`Sum: a(rⁿ-1)/(r-1) = ${a}(${r}^${n}-1)/(${r}-1) = ${sum}`);
            return { answer: `a_${n} = ${nth},  S_${n} = ${sum}`, steps };
        }

        // ── STANDARD DEVIATION ────────────────────────
        m = q.match(/(?:standard\s+deviation|std\s*dev)\s+of\s+([\d\s,.]+)/i);
        if (m) {
            const nums = m[1].match(/\d+\.?\d*/g).map(Number);
            const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
            const varr = nums.reduce((s, x) => s + (x - mean) ** 2, 0) / (nums.length - 1);
            const sd = dp6(Math.sqrt(varr));
            steps.push(`Mean = ${dp4(mean)}`);
            steps.push(`Variance = Σ(xᵢ-x̄)²/(n-1) = ${dp4(varr)}`);
            steps.push(`SD = √${dp4(varr)} = ${sd}`);
            return { answer: `Standard deviation of [${nums.join(', ')}] = ${sd}`, steps };
        }

        // ── VECTORS: MAGNITUDE ────────────────────────
        m = q.match(/magnitude\s+(?:of\s+)?(?:vector\s+)?\(?(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*(?:,\s*(-?\d+\.?\d*))?\)?/i);
        if (m) {
            const x = parseFloat(m[1]), y = parseFloat(m[2]);
            const z = m[3] ? parseFloat(m[3]) : null;
            const mag = z !== null ? dp6(Math.sqrt(x * x + y * y + z * z)) : dp6(Math.sqrt(x * x + y * y));
            const formula = z !== null ? `√(${x}²+${y}²+${z}²)` : `√(${x}²+${y}²)`;
            steps.push(`|v| = ${formula} = ${mag}`);
            return { answer: `|v| = ${mag}`, steps };
        }

        // ── ARITHMETIC EXPRESSION FALLBACK ───────────
        const cleanQ = normalise(q);
        if (/^[\d\s+\-*/^().%]+$/.test(cleanQ) && cleanQ.length > 0) {
            const r2 = evalExpression(cleanQ);
            if (r2 !== null) {
                steps.push(`= ${r2}`);
                return { answer: `${cleanQ.trim()} = ${r2}`, steps };
            }
        }

        return null;
    }

    function solveMath(question) {
        const result = solveWithSteps(question);
        if (result) return result.answer;
        const q = question.toLowerCase().trim();
        const normQ = normalise(q);
        const r = evalExpression(normQ);
        if (r !== null) return `${normQ.trim()} = ${r}`;
        return null;
    }

    return { solveWithSteps, solveMath, evalExpression, normalise };
})();

// ══════════════════════════════════════════════════════
//  ❽  PHYSICS ENGINE
// ══════════════════════════════════════════════════════
const PhysicsEngine = (() => {
    function solve(question) {
        const q = question.toLowerCase();
        const nums = [];
        const rx = /(-?\d+\.?\d*)/g;
        let nm;
        while ((nm = rx.exec(q)) !== null) nums.push(parseFloat(nm[1]));
        if (nums.length < 2) return null;
        const n = i => nums[i] !== undefined ? nums[i] : 0;

        if (q.match(/(?:final|new)?\s*velocity.*acceleration.*time|v\s*=\s*u\s*\+/))
            return `v = u + at = ${n(0)} + (${n(1)} × ${n(2)}) = ${n(0) + n(1) * n(2)} m/s`;
        if (q.match(/displacement|distance.*time.*acceleration/))
            return `s = ut + ½at² = ${n(0)}×${n(1)} + 0.5×${n(2)}×${n(1)}² = ${parseFloat((n(0) * n(1) + 0.5 * n(2) * n(1) * n(1)).toFixed(4))} m`;
        if (q.match(/force.*mass.*acceleration|newton.*second|f\s*=\s*ma/))
            return `F = ma = ${n(0)} × ${n(1)} = ${n(0) * n(1)} Newtons`;
        if (q.match(/kinetic energy|ke\b/))
            return `KE = ½mv² = 0.5×${n(0)}×${n(1)}² = ${0.5 * n(0) * n(1) * n(1)} Joules`;
        if (q.match(/potential energy|pe\b/))
            return `PE = mgh = ${n(0)}×9.81×${n(1)} = ${parseFloat((n(0) * 9.81 * n(1)).toFixed(3))} Joules`;
        if (q.match(/ohm.*law|voltage.*current.*resist|v\s*=\s*ir/))
            return `V = IR = ${n(0)}×${n(1)} = ${n(0) * n(1)} Volts`;
        if (q.match(/momentum/)) return `p = mv = ${n(0)}×${n(1)} = ${n(0) * n(1)} kg⋅m/s`;
        if (q.match(/pressure.*force.*area/)) return `P = F/A = ${n(0)}÷${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} Pa`;
        if (q.match(/work.*force.*distance/)) return `W = Fd = ${n(0)}×${n(1)} = ${n(0) * n(1)} Joules`;
        if (q.match(/power.*work.*time/)) return `P = W/t = ${n(0)}÷${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} Watts`;
        if (q.match(/wave.*speed|frequency.*wavelength/)) return `v = fλ = ${n(0)}×${n(1)} = ${n(0) * n(1)} m/s`;
        if (q.match(/gravity|gravitational acceleration/)) return `g = 9.81 m/s²`;
        if (q.match(/electric.*power|p\s*=\s*iv/)) return `P = IV = ${n(0)}×${n(1)} = ${n(0) * n(1)} Watts`;
        if (q.match(/density/)) return `ρ = m/V = ${n(0)}÷${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} kg/m³`;
        if (q.match(/heat|thermal energy|specific heat/)) return `Q = mcΔT = ${n(0)}×${n(1)}×${n(2) || n(1)} = ${parseFloat((n(0) * n(1) * (n(2) || n(1))).toFixed(3))} J`;
        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  ❾  UNIT CONVERTER
// ══════════════════════════════════════════════════════
const UnitConverter = (() => {
    function convert(question) {
        const q = question.toLowerCase();
        const nm = q.match(/(\d+\.?\d*)/);
        if (!nm) return null;
        const n = parseFloat(nm[1]);
        const r = (v, dp = 4) => parseFloat(v.toFixed(dp));

        if (q.match(/celsius.*fahrenheit|°c.*°f|c to f/)) return `${n}°C = ${r(n * 9 / 5 + 32, 2)}°F`;
        if (q.match(/fahrenheit.*celsius|°f.*°c|f to c/)) return `${n}°F = ${r((n - 32) * 5 / 9, 2)}°C`;
        if (q.match(/celsius.*kelvin/)) return `${n}°C = ${r(n + 273.15, 2)} K`;
        if (q.match(/kelvin.*celsius/)) return `${n} K = ${r(n - 273.15, 2)}°C`;
        if (q.match(/fahrenheit.*kelvin/)) return `${n}°F = ${r((n - 32) * 5 / 9 + 273.15, 2)} K`;
        if (q.match(/km.*miles?/)) return `${n} km = ${r(n * 0.621371)} miles`;
        if (q.match(/miles?.*km/)) return `${n} miles = ${r(n * 1.60934)} km`;
        if (q.match(/meters?.*feet|m\s+to\s+f/)) return `${n} m = ${r(n * 3.28084)} feet`;
        if (q.match(/feet.*meters?/)) return `${n} ft = ${r(n * 0.3048)} m`;
        if (q.match(/cm.*inches?/)) return `${n} cm = ${r(n * 0.393701)} in`;
        if (q.match(/inches?.*cm/)) return `${n} in = ${r(n * 2.54)} cm`;
        if (q.match(/kg.*lbs?|kilograms?.*pounds?/)) return `${n} kg = ${r(n * 2.20462)} lbs`;
        if (q.match(/lbs?.*kg|pounds?.*kg/)) return `${n} lbs = ${r(n * 0.453592)} kg`;
        if (q.match(/liters?.*gallons?/)) return `${n} L = ${r(n * 0.264172)} gallons`;
        if (q.match(/gallons?.*liters?/)) return `${n} gallons = ${r(n * 3.78541)} L`;
        if (q.match(/liters?.*ml/)) return `${n} L = ${n * 1000} ml`;
        if (q.match(/ml.*liters?/)) return `${n} ml = ${n / 1000} L`;
        if (q.match(/mph.*km\/h|mph.*kmh/)) return `${n} mph = ${r(n * 1.60934)} km/h`;
        if (q.match(/km\/h.*mph|kmh.*mph/)) return `${n} km/h = ${r(n * 0.621371)} mph`;
        if (q.match(/m\/s.*km\/h/)) return `${n} m/s = ${r(n * 3.6)} km/h`;
        if (q.match(/kb.*mb/)) return `${n} KB = ${r(n / 1024, 6)} MB`;
        if (q.match(/mb.*gb/)) return `${n} MB = ${r(n / 1024, 6)} GB`;
        if (q.match(/gb.*tb/)) return `${n} GB = ${r(n / 1024, 6)} TB`;
        if (q.match(/ksh.*usd|shilling.*dollar/)) return `Approx. 130 KSH = 1 USD (early 2026). Use a live currency app for real-time rates.`;
        if (q.match(/usd.*ksh|dollar.*shilling/)) return `Approx. 1 USD = 130 KSH (early 2026).`;
        if (q.match(/usd.*euro|dollar.*euro/)) return `Approx. 1 USD = 0.93 EUR (early 2026).`;
        if (q.match(/pound.*usd|gbp.*usd/)) return `Approx. 1 GBP = 1.27 USD (early 2026).`;
        return null;
    }
    return { convert };
})();

// ══════════════════════════════════════════════════════
//  ❿  REASONING ENGINE
// ══════════════════════════════════════════════════════
const ReasoningEngine = (() => {
    function analyzeQuestion(q) {
        const l = q.toLowerCase();
        if (l.match(/why|reason|explain|how.*work|what.*cause/)) return 'explanatory';
        if (l.match(/compare|difference|vs|versus|better/)) return 'comparative';
        if (l.match(/should i|recommend|best|which one/)) return 'advisory';
        if (l.match(/define|what is|meaning of/)) return 'definitional';
        if (l.match(/when|date|year|time/)) return 'temporal';
        if (l.match(/who|person|player|created/)) return 'entity';
        if (l.match(/how many|how much|count|number/)) return 'quantitative';
        return 'general';
    }
    function formatResponse(raw, type, mood) {
        if (!raw) return null;
        if (Math.random() > 0.65 && mood !== 'neutral') return EmotionEngine.apply(raw, mood);
        return raw;
    }
    return { analyzeQuestion, formatResponse };
})();

// ══════════════════════════════════════════════════════
//  ⓫  KNOWLEDGE BASE
// ══════════════════════════════════════════════════════
const KnowledgeBase = (() => {
    const GEO = {
        kenya: "Nairobi", nigeria: "Abuja", "south africa": "Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)",
        ghana: "Accra", ethiopia: "Addis Ababa", egypt: "Cairo", tanzania: "Dodoma", uganda: "Kampala",
        zimbabwe: "Harare", zambia: "Lusaka", mozambique: "Maputo", angola: "Luanda", cameroon: "Yaounde",
        senegal: "Dakar", "ivory coast": "Yamoussoukro", somalia: "Mogadishu", sudan: "Khartoum",
        rwanda: "Kigali", madagascar: "Antananarivo", malawi: "Lilongwe", botswana: "Gaborone", namibia: "Windhoek",
        france: "Paris", germany: "Berlin", italy: "Rome", spain: "Madrid", portugal: "Lisbon",
        "united kingdom": "London", netherlands: "Amsterdam", belgium: "Brussels", switzerland: "Bern",
        austria: "Vienna", sweden: "Stockholm", norway: "Oslo", denmark: "Copenhagen", finland: "Helsinki",
        poland: "Warsaw", "czech republic": "Prague", hungary: "Budapest", greece: "Athens", ukraine: "Kyiv", russia: "Moscow",
        usa: "Washington D.C.", "united states": "Washington D.C.", canada: "Ottawa",
        mexico: "Mexico City", brazil: "Brasilia", argentina: "Buenos Aires", colombia: "Bogota", chile: "Santiago", peru: "Lima",
        china: "Beijing", japan: "Tokyo", india: "New Delhi", "south korea": "Seoul", indonesia: "Jakarta",
        philippines: "Manila", vietnam: "Hanoi", thailand: "Bangkok", malaysia: "Kuala Lumpur", singapore: "Singapore",
        pakistan: "Islamabad", "saudi arabia": "Riyadh", iran: "Tehran", turkey: "Ankara",
        australia: "Canberra", "new zealand": "Wellington"
    };
    const SCI = {
        speedOfLight: "The speed of light in a vacuum is exactly 299,792,458 m/s — approximately 300,000 km/s.",
        speedOfSound: "The speed of sound in air at 20°C is approximately 343 m/s (1,235 km/h).",
        dna: "DNA (Deoxyribonucleic Acid) carries genetic instructions. It consists of a double helix of nucleotide base pairs: A-T and C-G.",
        gravity: "Gravity is the fundamental force of attraction between masses. g = 9.81 m/s² on Earth's surface.",
        ai: "Artificial Intelligence simulates human cognitive processes using machine learning, neural networks, and NLP.",
        quantum: "Quantum mechanics: wave-particle duality, superposition, entanglement, and Heisenberg's uncertainty principle.",
        blackHole: "A black hole is where gravity is so strong nothing escapes — not even light. Formed from massive collapsing stars.",
        bigBang: "The Big Bang (13.8 billion years ago) was the rapid expansion of spacetime from an extremely hot, dense state.",
        evolution: "Evolution by natural selection (Darwin, 1859): species change over generations through survival of the fittest.",
        internet: "The internet began as ARPANET (1969). Tim Berners-Lee invented the World Wide Web in 1989. Now connects 5+ billion people.",
        climate: "Climate change: burning fossil fuels releases CO₂ that traps heat in Earth's atmosphere — the enhanced greenhouse effect."
    };
    const HIST = {
        ww1: "World War 1 (1914-1918): Allied Powers vs Central Powers. 20+ million deaths. Treaty of Versailles 1919.",
        ww2: "World War 2 (1939-1945): Allies vs Axis. 70-85 million casualties. Holocaust killed 6 million Jews. Led to the United Nations.",
        coldWar: "Cold War (1947-1991): USA vs USSR — nuclear arms race, Korean War, Vietnam War, Cuban Missile Crisis. Ended 1991.",
        civilRights: "American Civil Rights Movement (1954-1968): MLK, Rosa Parks, Malcolm X. Civil Rights Act 1964, Voting Rights Act 1965.",
        mandela: "Nelson Mandela (1918-2013): 27 years in prison. First Black president of South Africa (1994-1999). Nobel Peace Prize 1993.",
        gandhi: "Mahatma Gandhi (1869-1948): Led India's non-violent independence via Satyagraha. India independent August 15, 1947.",
        kenyaIndependence: "Kenya gained independence December 12, 1963. Jomo Kenyatta became first PM. Celebrated as Jamhuri Day.",
        moonLanding: "Apollo 11 landed on the Moon July 20, 1969. Neil Armstrong: 'One small step for man, one giant leap for mankind.'",
        romanEmpire: "Roman Empire (27 BC–476 AD): dominated the Mediterranean for 500 years.",
        frenchRevolution: "French Revolution (1789-1799): Overthrew monarchy. Liberté, Égalité, Fraternité. Led to Napoleon.",
        colonialism: "European colonialism (15th-20th century): Scramble for Africa (1880s). Immense exploitation but also spread of technology."
    };

    function getCapital(q) {
        const m = q.toLowerCase().match(/capital\s+(?:of|city\s+of)\s+(.+?)(?:\?|$)/);
        if (m) {
            const country = m[1].trim().replace(/\?/g, '').toLowerCase();
            const cap = GEO[country] || GEO[country.replace(/^the\s+/, '')];
            if (cap) return `The capital of ${country.charAt(0).toUpperCase() + country.slice(1)} is ${cap}.`;
        }
        return null;
    }

    function getGeneral(question) {
        const q = question.toLowerCase().trim();

        if (q.match(/what.*(time|clock)|current time/)) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}. Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        }
        if (q.match(/what.*date|today.*date/)) return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        if (q.match(/what.*year/)) return `The current year is ${new Date().getFullYear()}.`;

        if (q.match(/who (created|made|built|developed) you|creator/))
            return `I was created by Martin Lutherking Owino — CEO and lead developer of Protogen AI under HECO AFRICA. Building Africa's AI future, one version at a time.`;
        if (q.match(/who are you|what are you|your name/))
            return `I'm Bingo — your advanced AI assistant by Protogen AI / HECO AFRICA. Version 3.5.1 Enhanced — deeper maths, smarter listening, unified intelligence. Ask me anything!`;
        if (q.match(/what can you do|your abilities|features/))
            return `Bingo V3.5 Enhanced can: Football (all leagues, UCL, World Cup), Advanced Maths (arithmetic → calculus → trig → complex numbers → inequalities → proofs), Physics, Unit conversions, Science & history, Web search, Music, Timers, Jokes & savage roasts, Smart listening with follow-up memory. Try me!`;
        if (q.match(/version|what version/))
            return `Bingo Version 3.5.1 Enhanced — significantly upgraded math solver (trig, calculus, complex numbers, inequalities, polynomial evaluation, log laws, simultaneous equations and more) and smart listening V2 with confidence scoring and follow-up memory.`;

        if (q.match(/^(hi|hello|hey|howdy)\b/)) {
            const h = new Date().getHours();
            const user = Memory.getUser();
            const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
            return `${g}${user ? `, ${user}` : ''}! I'm Bingo V3.5. What can I help you with today?`;
        }
        if (q.match(/how are you|how do you feel/)) return `Running at full power! Enhanced maths and listening are active. What's your question?`;
        if (q.match(/thank(s| you)|cheers/)) return `You're welcome! That's what I'm here for. Fire away!`;

        if (q.match(/speed of light/)) return SCI.speedOfLight;
        if (q.match(/speed of sound/)) return SCI.speedOfSound;
        if (q.match(/what is dna\b/)) return SCI.dna;
        if (q.match(/what is ai|artificial intel/)) return SCI.ai;
        if (q.match(/what is gravity/)) return SCI.gravity;
        if (q.match(/quantum/)) return SCI.quantum;
        if (q.match(/black hole/)) return SCI.blackHole;
        if (q.match(/big bang/)) return SCI.bigBang;
        if (q.match(/evolution|darwin/)) return SCI.evolution;
        if (q.match(/internet.*history|history.*internet/)) return SCI.internet;
        if (q.match(/climate change|global warming/)) return SCI.climate;

        if (q.match(/world war (1|one|i)\b/) && !q.match(/world war (2|two|ii)/)) return HIST.ww1;
        if (q.match(/world war (2|two|ii)/)) return HIST.ww2;
        if (q.match(/cold war/)) return HIST.coldWar;
        if (q.match(/civil rights|martin luther king|mlk/)) return HIST.civilRights;
        if (q.match(/mandela/)) return HIST.mandela;
        if (q.match(/gandhi/)) return HIST.gandhi;
        if (q.match(/kenya.*independen|independen.*kenya|jamhuri/)) return HIST.kenyaIndependence;
        if (q.match(/moon landing|neil armstrong|apollo 11/)) return HIST.moonLanding;
        if (q.match(/roman empire/)) return HIST.romanEmpire;
        if (q.match(/french revolution/)) return HIST.frenchRevolution;
        if (q.match(/colonialism|colonial/)) return HIST.colonialism;

        const cap = getCapital(question);
        if (cap) return cap;

        if (q.match(/largest country/)) return `Russia is the largest country at 17.1 million km².`;
        if (q.match(/smallest country/)) return `Vatican City is the smallest at 0.44 km².`;
        if (q.match(/longest river/)) return `The Nile (6,650 km) is traditionally the world's longest river.`;
        if (q.match(/highest mountain|everest/)) return `Mount Everest (8,849 m) — first summited by Hillary and Norgay, May 29, 1953.`;
        if (q.match(/mariana trench|deepest/)) return `Mariana Trench (Challenger Deep): 11,034 m below sea level.`;
        if (q.match(/kenya.*population|population.*kenya/)) return `Kenya has ~57 million people (2026 estimate). Nairobi has ~5.3 million.`;
        if (q.match(/distance.*earth.*moon|moon.*distance/)) return `Average Earth-Moon distance: 384,400 km (238,855 miles).`;
        if (q.match(/distance.*earth.*sun|sun.*distance/)) return `Average Earth-Sun distance: 149.6 million km (1 AU).`;
        if (q.match(/\bpi\b|value of pi/)) return `π ≈ 3.14159265358979... — ratio of a circle's circumference to its diameter.`;
        if (q.match(/planets in solar system|number of planets/)) return `8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.`;
        if (q.match(/meaning of life/)) return `42! (Douglas Adams). Philosophically: purpose, love, connection, and experience.`;
        if (q.match(/seconds.*day/)) return `86,400 seconds in a day (60×60×24).`;
        if (q.match(/days.*year/)) return `365 days (366 in a leap year).`;

        return null;
    }
    return { getGeneral, getCapital, GEO, SCI, HIST };
})();

// ══════════════════════════════════════════════════════
//  ⓬  FOOTBALL PROCESSOR
// ══════════════════════════════════════════════════════
const FootballProcessor = (() => {
    function getPlayerInfo(name) {
        const n = name.toLowerCase();
        if (n.includes('messi')) return FootballDB.players.messi;
        if (n.includes('ronaldo')) return FootballDB.players.ronaldo;
        if (n.includes('haaland')) return FootballDB.players.haaland;
        if (n.includes('mbappe') || n.includes('mbappé')) return FootballDB.players.mbappe;
        if (n.includes('saka')) return FootballDB.players.saka;
        if (n.includes('bellingham')) return FootballDB.players.bellingham;
        if (n.includes('vinicius') || n.includes('vini')) return FootballDB.players.vinicius;
        if (n.includes('salah')) return FootballDB.players.salah;
        if (n.includes('kane')) return FootballDB.players.kane;
        return null;
    }
    function getTeamData(name) {
        const n = name.toLowerCase(), t = FootballDB.teams;
        if (n.includes('bayern') || n.includes('munich')) return { data: t.bayernMunich };
        if (n.includes('liverpool')) return { data: t.liverpool };
        if (n.includes('arsenal')) return { data: t.arsenal };
        if (n.includes('real madrid') || (n.includes('madrid') && !n.includes('atletico'))) return { data: t.realMadrid };
        if (n.includes('manchester city') || n.includes('man city')) return { data: t.manchesterCity };
        return null;
    }
    function answer(question) {
        const q = question.toLowerCase();
        const cl = FootballDB.championsLeague, wc = FootballDB.worldCup2026;

        if (q.match(/live|score.*now|currently.*playing/)) {
            const upcoming = cl.secondLeg.filter(m => new Date(m.date) >= new Date());
            if (upcoming.length) return `No live matches right now. Upcoming: ${upcoming.map(m => `${m.home} vs ${m.away} — ${m.comp} on ${m.date} at ${m.time}`).join('; ')}`;
            return `No live matches at the moment. Next: April 15 — Real Madrid vs Bayern Munich (UCL), April 19 — Liverpool vs West Ham, Arsenal vs Man City.`;
        }
        if (q.match(/upcoming|next.*fixtures?|schedule/)) return `Upcoming: ${FootballDB.upcomingFixtures.map(f => `${f.date}: ${f.home} vs ${f.away} — ${f.comp} at ${f.time}`).join('. ')}`;
        if (q.match(/recent results?|latest results?|last.*results?/)) return `Recent Results: ${FootballDB.recentResults.map(r => `${r.date}: ${r.home} ${r.hScore}-${r.aScore} ${r.away} (${r.comp})`).join('. ')}`;
        if (q.match(/football news|latest.*football/)) return `Headlines: ${FootballDB.news.join('. ')}`;
        if (q.match(/world cup/)) return `FIFA World Cup 2026: ${wc.hosts.join(', ')}. ${wc.startDate}–${wc.finalDate}. ${wc.teams} teams. Final: ${wc.finalVenue}. Defending: ${wc.defending}. Contenders: ${wc.topContenders.join(', ')}.`;
        if (q.match(/champions league|ucl\b|european cup/)) {
            if (q.match(/quarter.?final/)) return `UCL QF 1st Legs: ${cl.quarterFinals.map(m => `${m.home} ${m.hScore}-${m.aScore} ${m.away}`).join('; ')}. 2nd legs April 15-17. Final: ${cl.final.date} at ${cl.final.venue}.`;
            if (q.match(/semi.?final/)) return `UCL Semi-Finals: ${cl.semiFinalDates}.`;
            if (q.match(/\bfinal\b/)) return `UCL Final: ${cl.final.date} at ${cl.final.venue}.`;
            if (q.match(/top scorer/)) return `UCL Top Scorers: ${cl.topScorers.map(s => `${s.name} (${s.club}) ${s.goals}`).join(', ')}`;
            if (q.match(/eliminated/)) return `Eliminated: ${cl.eliminated.join(', ')}.`;
            return `UCL 2025-26 — ${cl.stage}. Bayern lead Real Madrid 2-1 after QF 1st leg. Arsenal beat PSG 3-1. Semi-finals: ${cl.semiFinalDates}. Final: ${cl.final.date} at ${cl.final.venue}.`;
        }
        const playerNames = ['messi', 'ronaldo', 'haaland', 'mbapp', 'saka', 'bellingham', 'vinicius', 'salah', 'kane', 'vini', 'musiala', 'odegaard', 'van dijk', 'de bruyne', 'foden'];
        for (const pn of playerNames) {
            if (q.includes(pn)) {
                const player = getPlayerInfo(pn);
                if (player) {
                    if (q.match(/messi.*ronaldo|ronaldo.*messi|compare|vs|versus|goat.*debate/)) {
                        const mes = FootballDB.players.messi, ron = FootballDB.players.ronaldo;
                        return `The eternal debate! Messi: ${mes.goals} career goals, ${mes.ballonDor} Ballon d'Or awards, 1 World Cup. Ronaldo: ${ron.goals} career goals (all-time record!), ${ron.ballonDor} Ballon d'Or awards, 5 UCL titles. Messi won 2022 World Cup — cementing GOAT status.`;
                    }
                    if (q.match(/goals?/)) return `${player.fullName}: ${player.goals} goals in ${player.matches} matches.`;
                    if (q.match(/age|born|dob/)) return `${player.fullName}: born ${player.dob}, age ${player.age}.`;
                    if (q.match(/club|play.*for|team/)) return `${player.fullName} plays for ${player.currentClub}.`;
                    if (player.trophies && q.match(/trophies?|titles?/)) return `${player.fullName}: ${player.trophies.join('. ')}.`;
                    return `${player.fullName} (${player.nationality}), ${player.currentClub}. ${player.description}`;
                }
            }
        }
        if (q.match(/musiala/)) return `Jamal Musiala — Bayern Munich's creative genius. Born 2003, one of the brightest talents in world football.`;
        if (q.match(/odegaard|ødegaard/)) return `Martin Ødegaard is Arsenal's captain and creative midfielder. One of the best playmakers in the PL.`;
        if (q.match(/van dijk|virgil/)) return `Virgil van Dijk is Liverpool's commanding centre-back — arguably the best defender in the world.`;
        if (q.match(/de bruyne|kevin/)) return `Kevin De Bruyne is Man City's midfield maestro — widely regarded as the best central midfielder of his generation.`;
        if (q.match(/\bfoden\b/)) return `Phil Foden — Man City's creative force, the 'Stockport Iniesta'.`;
        const tr = getTeamData(q);
        if (tr) {
            const td = tr.data;
            if (q.match(/next match|fixture/)) return `${td.name} next: vs ${td.nextMatch.opponent}, ${td.nextMatch.competition}, ${td.nextMatch.date} (${td.nextMatch.time}).`;
            if (q.match(/last.*match|recent result/)) return `${td.name} last result: ${td.lastResult.score} vs ${td.lastResult.opponent} — ${td.lastResult.result}, ${td.lastResult.date}.`;
            if (q.match(/top scorer/)) return `${td.name} top scorer: ${td.topScorer} (${td.topScorerGoals} goals). Top assist: ${td.topAssist} (${td.topAssistCount}).`;
            if (q.match(/squad|key players/)) return `${td.name} key players: ${td.keyPlayers.join(', ')}. Manager: ${td.manager}.`;
            if (q.match(/manager|coach/)) return `${td.name}'s manager is ${td.manager}.`;
            if (q.match(/stadium/)) return `${td.name} play at ${td.stadium} (${td.capacity.toLocaleString()} capacity).`;
            if (q.match(/trophies?|titles?/)) {
                const entries = Object.entries(td.trophies).map(([k, v]) => `${v} ${k.replace(/([A-Z])/g, ' $1').trim()}`).join(', ');
                return `${td.name} trophies: ${entries}.`;
            }
            if (q.match(/table|standing|position/)) return `${td.name}: ${td.position}th in ${td.league}, ${td.points} pts (W${td.won} D${td.drawn} L${td.lost}).`;
            return `${td.name}: ${td.position}th in ${td.league}, ${td.points} pts. Top scorer: ${td.topScorer} (${td.topScorerGoals}). Manager: ${td.manager}. Stadium: ${td.stadium}.`;
        }
        if (q.match(/bundesliga.*(table|standing)|table.*bundesliga/)) return `Bundesliga Top 5: ${FootballDB.bundesliga.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ')}`;
        if (q.match(/premier league.*(table|standing)|epl.*table|pl.*table/)) return `Premier League Top 8: ${FootballDB.premierLeague.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ')}`;
        if (q.match(/la liga.*(table|standing)|laliga/)) return `La Liga Top 5: ${FootballDB.laLiga.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ')}`;
        if (q.match(/serie a.*(table|standing)/)) return `Serie A Top 5: ${FootballDB.serieA.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ')}`;
        if (q.match(/\bpsg\b|paris saint.?germain/)) return `PSG trail Arsenal 1-3 after UCL QF 1st leg. 2nd leg April 16 at Parc des Princes.`;
        if (q.match(/\binter milan\b/)) return `Inter Milan drew 1-1 with Atletico. 2nd leg April 17. Top of Serie A (60pts).`;
        if (q.match(/\bdortmund\b/) && !q.match(/bundesliga table/)) return `Dortmund beat Benfica 2-0 in UCL QF 1st leg. 2nd leg April 17. 3rd in Bundesliga.`;
        if (q.match(/\bbarcelona\b/) && !q.match(/la liga table/)) return `Barcelona top La Liga (67pts). Eliminated from UCL. Manager: Hansi Flick.`;
        if (q.match(/\bchelsa\b|\bchelsea\b/) && !q.match(/premier league table/)) return `Chelsea 4th in PL (53pts). Manager: Enzo Maresca. Lost 1-2 to Arsenal on April 4.`;
        if (q.match(/\bnewcastle\b/)) return `Newcastle 5th in PL (49pts). Beat Man City 1-0. Manager: Eddie Howe.`;
        if (q.match(/\bnapoli\b/)) return `Napoli lead Serie A (62pts). Manager: Antonio Conte.`;
        if (q.match(/\batletico\b/)) return `Atletico drew 1-1 at Inter in UCL QF 1st leg. 2nd leg April 17 at Wanda Metropolitano.`;
        if (q.match(/football|soccer|match\b/)) return `Latest: ${FootballDB.news[0]}. ${FootballDB.news[1]}. Ask about any team, player or league!`;
        return null;
    }
    return { answer, getPlayerInfo, getTeamData };
})();

// ══════════════════════════════════════════════════════
//  ⓭  MUSIC PLAYER
// ══════════════════════════════════════════════════════
const SONGS = [
    { t: "Blinding Lights", a: "The Weeknd", duration: 200 },
    { t: "Shape of You", a: "Ed Sheeran", duration: 235 },
    { t: "Bohemian Rhapsody", a: "Queen", duration: 355 },
    { t: "Billie Jean", a: "Michael Jackson", duration: 293 },
    { t: "Lose Yourself", a: "Eminem", duration: 326 },
    { t: "Calm Down", a: "Rema", duration: 198 },
    { t: "Watermelon Sugar", a: "Harry Styles", duration: 173 },
    { t: "Flowers", a: "Miley Cyrus", duration: 200 },
    { t: "Perfect", a: "Ed Sheeran", duration: 263 },
    { t: "Levitating", a: "Dua Lipa", duration: 203 },
    { t: "As It Was", a: "Harry Styles", duration: 167 },
    { t: "Anti-Hero", a: "Taylor Swift", duration: 200 },
    { t: "Cruel Summer", a: "Taylor Swift", duration: 178 },
    { t: "Golden Hour", a: "JVKE", duration: 209 },
    { t: "Running Up That Hill", a: "Kate Bush", duration: 300 },
    { t: "Heat Waves", a: "Glass Animals", duration: 238 },
    { t: "Easy On Me", a: "Adele", duration: 224 },
    { t: "Essence", a: "Wizkid ft. Tems", duration: 195 },
    { t: "Finesse", a: "Pheelz ft. BNXN", duration: 198 },
    { t: "Soso", a: "Omah Lay", duration: 187 },
    { t: "Ye", a: "Burna Boy", duration: 214 },
    { t: "Monalisa", a: "Lojay", duration: 183 }
];

const MusicPlayer = (() => {
    let curSong = -1, playing = false, songPos = 0, songDur = 180;
    let progTmr = null, vol = 0.8, shuffleMode = false, repeatMode = false;
    let songHistory = [], audioCtx = null, gainNode = null, audioUnlocked = false;

    function unlockAudio() {
        if (audioUnlocked) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = vol;
            gainNode.connect(audioCtx.destination);
            if (audioCtx.state === 'suspended') audioCtx.resume();
            audioUnlocked = true;
        } catch (e) { }
    }
    function fmt(s) {
        const sec = Math.floor(s) || 0;
        return Math.floor(sec / 60) + ':' + (sec % 60 < 10 ? '0' : '') + (sec % 60);
    }
    function updateUI() {
        const pTitle = document.getElementById('pTitle');
        const pArtist = document.getElementById('pArtist');
        const playBtn = document.getElementById('playBtn');
        const pTot = document.getElementById('pTot');
        const player = document.getElementById('player');
        const pfill = document.getElementById('pfill');
        const pCur = document.getElementById('pCur');
        if (curSong >= 0) {
            if (pTitle) pTitle.textContent = SONGS[curSong].t;
            if (pArtist) pArtist.textContent = SONGS[curSong].a;
            if (pTot) pTot.textContent = fmt(songDur);
            if (player) player.classList.add('on');
        }
        if (playBtn) playBtn.textContent = playing ? '⏸' : '▶';
        if (pfill) pfill.style.width = (songPos / songDur * 100) + '%';
        if (pCur) pCur.textContent = fmt(songPos);
    }
    function tick() {
        if (!playing) return;
        songPos++;
        updateUI();
        if (songPos >= songDur) { if (repeatMode) songPos = 0; else next(); }
    }
    function play(idx) {
        if (idx < 0 || idx >= SONGS.length) return;
        unlockAudio();
        if (curSong >= 0) songHistory.push(curSong);
        if (songHistory.length > 20) songHistory.shift();
        curSong = idx; playing = true; songPos = 0;
        songDur = SONGS[idx].duration || 180;
        clearInterval(progTmr);
        progTmr = setInterval(tick, 1000);
        updateUI();
        TTS.speak(`Now playing ${SONGS[idx].t} by ${SONGS[idx].a}`);
    }
    function toggle() {
        if (curSong < 0) { play(0); return; }
        playing = !playing; updateUI();
        TTS.speak(playing ? "Resuming music." : "Music paused.");
    }
    function next() {
        clearInterval(progTmr);
        if (shuffleMode) {
            let idx; do { idx = Math.floor(Math.random() * SONGS.length); } while (idx === curSong && SONGS.length > 1);
            play(idx);
        } else play((curSong + 1) % SONGS.length);
    }
    function prev() {
        clearInterval(progTmr);
        if (songHistory.length > 0) play(songHistory.pop());
        else play((curSong - 1 + SONGS.length) % SONGS.length);
    }
    function stop() {
        clearInterval(progTmr); playing = false; curSong = -1; songPos = 0;
        const player = document.getElementById('player');
        if (player) player.classList.remove('on');
        TTS.speak("Music stopped.");
    }
    function setVol(v) {
        vol = Math.max(0, Math.min(1, parseFloat(v)));
        if (gainNode) gainNode.gain.value = vol;
        const sl = document.getElementById('volSlider');
        if (sl) sl.value = vol;
    }
    function seek(e) {
        const r = document.getElementById('ptrack');
        if (r && curSong >= 0) {
            const rect = r.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            songPos = Math.max(0, Math.min(Math.floor(((cx - rect.left) / rect.width) * songDur), songDur));
            updateUI();
        }
    }
    function findSong(term) {
        const t = term.toLowerCase();
        return SONGS.findIndex(s => s.t.toLowerCase().includes(t) || s.a.toLowerCase().includes(t));
    }
    return {
        play, toggle, next, prev, stop, setVol, seek, findSong,
        get curSong() { return curSong; }, get playing() { return playing; },
        get shuffleMode() { return shuffleMode; }, set shuffleMode(v) { shuffleMode = v; },
        get repeatMode() { return repeatMode; }, set repeatMode(v) { repeatMode = v; }, songs: SONGS
    };
})();

// ══════════════════════════════════════════════════════
//  ⓮  TTS ENGINE
// ══════════════════════════════════════════════════════
const TTS = (() => {
    let queue = [], busy = false;
    const PREFERRED = ['Google UK English Female', 'Google US English', 'Microsoft Aria Online (Natural)',
        'Microsoft Zira Desktop', 'Samantha', 'Karen', 'Moira', 'Tessa', 'Daniel'];

    function getVoice() {
        const voices = window.speechSynthesis?.getVoices() || [];
        for (const name of PREFERRED) {
            const v = voices.find(v => v.name.includes(name));
            if (v) return v;
        }
        return voices.find(v => /en/i.test(v.lang) && !v.localService) || voices.find(v => /en-US|en-GB/i.test(v.lang)) || null;
    }
    function speak(text, mood) {
        if (!window.speechSynthesis) return;
        const clean = String(text).replace(/<[^>]+>/g, '').replace(/([^\w\s.,!?'\-:;()\/°%+])/g, ' ').replace(/\s+/g, ' ').trim();
        if (!clean) return;
        window.speechSynthesis.cancel();
        queue = [{ text: clean, mood: mood || Memory.getMood() }];
        busy = false;
        drain();
    }
    function drain() {
        if (!queue.length) { busy = false; return; }
        busy = true;
        const { text, mood } = queue.shift();
        const utt = new SpeechSynthesisUtterance(text);
        const state = EmotionEngine.get(mood);
        utt.rate = state.rate;
        utt.pitch = state.pitch;
        utt.volume = BINGO_CONFIG.ttsVolume;
        utt.lang = 'en-US';
        const voice = getVoice();
        if (voice) utt.voice = voice;
        UI.setLogo('speaking'); UI.waveOn(true);
        utt.onstart = () => UI.setStatus('Bingo is speaking…', '');
        utt.onend = () => {
            busy = false;
            if (!queue.length) {
                UI.setLogo('idle'); UI.waveOn(false);
                UI.setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
                setTimeout(() => VoiceRecog.startWake(), 700);
            }
            drain();
        };
        utt.onerror = () => { busy = false; drain(); };
        window.speechSynthesis.speak(utt);
    }
    function stop() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        queue = []; busy = false;
        UI.setLogo('idle'); UI.waveOn(false);
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return { speak, stop };
})();

// ══════════════════════════════════════════════════════
//  ⓯  UI ENGINE
// ══════════════════════════════════════════════════════
const UI = (() => {
    function setStatus(main, sub) {
        const m = document.getElementById('statusMain');
        const s = document.getElementById('statusSub');
        if (m) m.textContent = main;
        if (s && sub !== undefined) s.textContent = sub;
    }
    function waveOn(on) { const el = document.getElementById('waveWrap'); if (el) el.classList.toggle('on', on); }
    function setLogo(state) { const el = document.getElementById('logoOuter'); if (el) el.className = 'logo-outer ' + (state || 'idle'); }
    function flashWake() { const el = document.getElementById('wakeFlash'); if (el) { el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 900); } }
    function toast(msg, dur = 2800) {
        const el = document.getElementById('toast'); if (!el) return;
        el.textContent = msg; el.classList.add('on'); clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.remove('on'), dur);
    }
    function showTx(you, reply) {
        const box = document.getElementById('txBox'); if (!box) return;
        const youEl = document.getElementById('txYou'); if (youEl) youEl.textContent = you || '';
        const rw = document.getElementById('txReplyWrap');
        if (reply) {
            const replyEl = document.getElementById('txReply');
            if (replyEl) replyEl.innerHTML = reply;
            if (rw) rw.style.display = '';
        } else { if (rw) rw.style.display = 'none'; }
        box.classList.add('on'); clearTimeout(box._t);
        box._t = setTimeout(() => box.classList.remove('on'), 14000);
    }
    function showThinking(on) { const el = document.getElementById('thinkingIndicator'); if (el) el.style.display = on ? 'flex' : 'none'; }
    return { setStatus, waveOn, setLogo, flashWake, toast, showTx, showThinking };
})();

// ══════════════════════════════════════════════════════
//  ⓰  TIMER ENGINE
// ══════════════════════════════════════════════════════
const TimerEngine = (() => {
    const active = [];
    function parse(question) {
        const q = question.toLowerCase();
        const hr = q.match(/(\d+)\s*hours?/);
        const min = q.match(/(\d+)\s*minutes?|(\d+)\s*mins?/);
        const sec = q.match(/(\d+)\s*seconds?|(\d+)\s*secs?/);
        let ms = 0, parts = [];
        if (hr) { const h = parseInt(hr[1]); ms += h * 3600000; parts.push(`${h} hour${h > 1 ? 's' : ''}`); }
        if (min) { const m = parseInt(min[1] || min[2]); ms += m * 60000; parts.push(`${m} minute${m > 1 ? 's' : ''}`); }
        if (sec) { const s = parseInt(sec[1] || sec[2]); ms += s * 1000; parts.push(`${s} second${s > 1 ? 's' : ''}`); }
        return ms > 0 ? { ms, label: parts.join(' and ') } : null;
    }
    function set(question) {
        if (!question.match(/set.*timer|timer.*for|alarm for|remind me/)) return null;
        const parsed = parse(question);
        if (!parsed) return null;
        const id = setTimeout(() => { TTS.speak(`Timer done! ${parsed.label} have passed!`, 'happy'); UI.toast(`⏰ ${parsed.label} — done!`); }, parsed.ms);
        active.push({ id, label: parsed.label, end: Date.now() + parsed.ms });
        return `Timer set for ${parsed.label}. I'll alert you!`;
    }
    function list() {
        if (!active.length) return "No active timers.";
        return active.map(t => { const rem = Math.max(0, Math.round((t.end - Date.now()) / 1000)); return `${t.label} — ${rem}s remaining`; }).join(', ');
    }
    return { set, list, parse };
})();

// ══════════════════════════════════════════════════════
//  ⓱  MATH UTILITIES (helpers for advanced solvers)
// ══════════════════════════════════════════════════════
const MathUtils = (() => {
    const r = (v, dp = 8) => { if (!isFinite(v)) return v; return parseFloat(v.toFixed(dp)); };
    const r4 = v => r(v, 4);
    const r6 = v => r(v, 6);

    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity;
        let f = 1; for (let i = 2; i <= n; i++) f *= i; return f;
    }
    function gcd(a, b) {
        a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
        while (b) { [a, b] = [b, a % b]; } return a;
    }
    function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
    function extGcd(a, b) {
        if (b === 0) return { g: a, x: 1, y: 0 };
        const { g, x, y } = extGcd(b, a % b);
        return { g, x: y, y: x - Math.floor(a / b) * y };
    }
    function totient(n) {
        let result = n, p = 2, temp = n;
        while (p * p <= temp) {
            if (temp % p === 0) { while (temp % p === 0) temp = Math.floor(temp / p); result -= Math.floor(result / p); }
            p++;
        }
        if (temp > 1) result -= Math.floor(result / temp);
        return result;
    }
    function isPrime(n) {
        if (n < 2) return false; if (n === 2 || n === 3) return true;
        if (n % 2 === 0 || n % 3 === 0) return false;
        for (let i = 5; i * i <= n; i += 6) if (n % i === 0 || n % (i + 2) === 0) return false;
        return true;
    }
    function primeFactors(n) {
        const factors = []; if (n <= 1) return factors;
        let d = 2;
        while (d * d <= n) {
            let exp = 0;
            while (n % d === 0) { exp++; n = Math.floor(n / d); }
            if (exp > 0) factors.push({ p: d, e: exp });
            d += d === 2 ? 1 : 2;
        }
        if (n > 1) factors.push({ p: n, e: 1 });
        return factors;
    }
    function nCr(n, r2) {
        if (r2 < 0 || r2 > n) return 0; if (r2 === 0 || r2 === n) return 1;
        r2 = Math.min(r2, n - r2);
        let result = 1;
        for (let i = 0; i < r2; i++) result = result * (n - i) / (i + 1);
        return Math.round(result);
    }
    function nPr(n, r2) { if (r2 < 0 || r2 > n) return 0; return factorial(n) / factorial(n - r2); }
    function fibonacci(n) {
        if (n <= 0) return 0; if (n === 1) return 1;
        if (n <= 70) { let a = 0, b = 1; for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; return b; }
        return Math.round(Math.pow((1 + Math.sqrt(5)) / 2, n) / Math.sqrt(5));
    }
    function sieve(limit) {
        const composite = new Uint8Array(limit + 1), primes = [];
        for (let i = 2; i <= limit; i++) { if (!composite[i]) { primes.push(i); for (let j = i * i; j <= limit; j += i)composite[j] = 1; } }
        return primes;
    }
    function mean(arr) { return arr.reduce((s, x) => s + x, 0) / arr.length; }
    function variance(arr, pop = true) {
        const mu = mean(arr), n2 = pop ? arr.length : arr.length - 1;
        return arr.reduce((s, x) => s + (x - mu) ** 2, 0) / n2;
    }
    function stdDev(arr, pop = true) { return Math.sqrt(variance(arr, pop)); }
    function median(arr) {
        const s = [...arr].sort((a, b) => a - b), n2 = s.length;
        return n2 % 2 === 0 ? (s[n2 / 2 - 1] + s[n2 / 2]) / 2 : s[Math.floor(n2 / 2)];
    }
    function mode(arr) {
        const freq = {}; arr.forEach(x => freq[x] = (freq[x] || 0) + 1);
        const max = Math.max(...Object.values(freq));
        return Object.keys(freq).filter(k => freq[k] === max).map(Number);
    }
    function toBase(n2, base) { return parseInt(n2).toString(base).toUpperCase(); }
    function fromBase(str, base) { return parseInt(str, base); }
    function fmt(v, dp = 8) {
        if (!isFinite(v)) return String(v);
        if (Number.isInteger(v)) return String(v);
        return v.toFixed(dp).replace(/\.?0+$/, '');
    }
    return { r, r4, r6, factorial, gcd, lcm, extGcd, totient, isPrime, primeFactors, nCr, nPr, fibonacci, sieve, mean, variance, stdDev, median, mode, toBase, fromBase, fmt };
})();

// ══════════════════════════════════════════════════════
//  §A  ADVANCED MATH SOLVERS (number theory, combinatorics, etc.)
// ══════════════════════════════════════════════════════
const NumberTheorySolver = (() => {
    function solve(q, deep) {
        let m;
        m = q.match(/is\s+(\d+)\s+(?:a\s+)?prime(?:\s+number)?/i);
        if (m) {
            const n = parseInt(m[1]);
            if (MathUtils.isPrime(n)) return deep ? `${n} is prime.\nProof: No divisors between 2 and √${n}≈${MathUtils.fmt(Math.sqrt(n), 2)}.` : `${n} is a prime number.`;
            const pf = MathUtils.primeFactors(n);
            return `${n} is NOT prime. Factorisation: ${pf.map(f => f.e > 1 ? `${f.p}^${f.e}` : String(f.p)).join(' × ')}.`;
        }
        m = q.match(/(?:prime\s*factor(?:is|iz|s)?(?:ation|e)?|factoris?e)\s+(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            const pf = MathUtils.primeFactors(n);
            const fs = pf.map(f => f.e > 1 ? `${f.p}^${f.e}` : String(f.p)).join(' × ');
            if (!deep) return `${n} = ${fs}`;
            let steps = [`Prime factorisation of ${n}:`], temp = n, d = 2;
            while (d * d <= temp) { while (temp % d === 0) { steps.push(`${temp}÷${d}=${temp / d}`); temp = Math.floor(temp / d); } d += d === 2 ? 1 : 2; }
            if (temp > 1) steps.push(`${temp} is prime`);
            steps.push(`Result: ${n}=${fs}`);
            return steps.join('\n');
        }
        m = q.match(/(?:gcd|hcf|greatest\s+common\s+(?:divisor|factor))\s+(?:of\s+)?(\d+)\s*(?:and|,)\s*(\d+)/i);
        if (m) {
            const a = parseInt(m[1]), b = parseInt(m[2]), g = MathUtils.gcd(a, b);
            if (!deep) return `GCD(${a},${b}) = ${g}`;
            let steps = [`GCD(${a},${b}) — Euclidean:`], x = a, y = b;
            while (y) { steps.push(`${x}=${Math.floor(x / y)}×${y}+${x % y}`);[x, y] = [y, x % y]; }
            steps.push(`GCD=${x}`);
            const bez = MathUtils.extGcd(a, b);
            steps.push(`Bezout: ${a}×(${bez.x})+${b}×(${bez.y})=${g}`);
            return steps.join('\n');
        }
        m = q.match(/(?:lcm|least\s+common\s+multiple)\s+(?:of\s+)?(\d+)\s*(?:and|,)\s*(\d+)/i);
        if (m) {
            const a = parseInt(m[1]), b = parseInt(m[2]), l = MathUtils.lcm(a, b);
            if (!deep) return `LCM(${a},${b}) = ${l}`;
            return `LCM(${a},${b}) = (${a}×${b})/GCD = ${a * b}/${MathUtils.gcd(a, b)} = ${l}`;
        }
        m = q.match(/(\d+)\s*(?:mod|modulo)\s*(\d+)/i);
        if (m) {
            const a = parseInt(m[1]), b = parseInt(m[2]);
            if (b === 0) return `Cannot compute modulo 0.`;
            const res = ((a % b) + b) % b;
            if (!deep) return `${a} mod ${b} = ${res}`;
            return `${a} mod ${b}:\n${a}=${Math.floor(a / b)}×${b}+${res}\n${a}≡${res} (mod ${b})`;
        }
        m = q.match(/(?:euler.?s?\s+)?totient\s+(?:of\s+)?(\d+)|φ\((\d+)\)/i);
        if (m) {
            const n = parseInt(m[1] || m[2]), phi = MathUtils.totient(n);
            if (!deep) return `φ(${n}) = ${phi}`;
            return `Euler's totient φ(${n}) = ${phi}\nFormula: n×Π(1-1/p) for each prime p|n`;
        }
        m = q.match(/(?:primes?|prime numbers?)\s+(?:up to|less than|below|under)\s+(\d+)/i);
        if (m) {
            const n = Math.min(parseInt(m[1]), 500);
            const primes = MathUtils.sieve(n);
            if (!deep) return `Primes up to ${n}: ${primes.join(', ')} (${primes.length} total)`;
            return `${primes.length} primes up to ${n} (Sieve of Eratosthenes):\n${primes.join(', ')}`;
        }
        return null;
    }
    return { solve };
})();

const CombinatoricsSolver = (() => {
    function solve(q, deep) {
        let m;
        m = q.match(/(?:c\(|combinations?\s+of\s+|choose\s+)(\d+)(?:\s*,\s*|\s+(?:choose|from)\s+)(\d+)/i) || q.match(/(\d+)\s+choose\s+(\d+)/i) || q.match(/(\d+)C(\d+)/i);
        if (m) { const n = parseInt(m[1]), r = parseInt(m[2]), val = MathUtils.nCr(n, r); return deep ? `C(${n},${r}) = ${n}!/(${r}!×${n - r}!) = ${val}` : `C(${n},${r}) = ${val}`; }
        m = q.match(/(?:p\(|permutations?\s+of\s+)(\d+)(?:\s*,\s*|\s+(?:taking|from)\s+)(\d+)/i) || q.match(/(\d+)P(\d+)/i);
        if (m) { const n = parseInt(m[1]), r = parseInt(m[2]), val = MathUtils.nPr(n, r); return deep ? `P(${n},${r}) = ${n}!/${n - r}! = ${val}` : `P(${n},${r}) = ${val}`; }
        m = q.match(/derangement\s+(?:of\s+)?(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            let D = 0; for (let k = 0; k <= n; k++) D += (k % 2 === 0 ? 1 : -1) / MathUtils.factorial(k);
            D = Math.round(MathUtils.factorial(n) * D);
            return deep ? `Derangements of ${n}: D(${n})=${D}\nNo item in its original position.` : `D(${n}) = ${D}`;
        }
        m = q.match(/pascal.?s?\s+(?:triangle\s+)?row\s+(\d+)|row\s+(\d+)\s+of\s+pascal/i);
        if (m) {
            const n = parseInt(m[1] || m[2]);
            if (n > 20) return `Pascal's row ${n} — use C(${n},k) for k=0..${n}.`;
            return `Pascal's Row ${n}: ${Array.from({ length: n + 1 }, (_, k) => MathUtils.nCr(n, k)).join('  ')}`;
        }
        return null;
    }
    return { solve };
})();

const OlympiadSolver = (() => {
    const PATTERNS = [
        {
            match: /prove.*sqrt\s*2\s*is\s*irrational|√2\s*is\s*irrational/i,
            solve: () => `Proof that √2 is irrational (contradiction):\nAssume √2=p/q (lowest terms).\np²=2q² → p even → p=2m → 4m²=2q² → q even.\ngcd(p,q)≥2 — contradicts lowest terms. ∎`
        },
        {
            match: /prove.*infinitely many primes/i,
            solve: () => `Euclid's proof: Assume finite primes p₁…pₙ.\nN=p₁×…×pₙ+1 is not divisible by any pᵢ → new prime exists. Contradiction. ∎`
        },
        {
            match: /sum.*digits.*divisible.*9|divisibility.*9/i,
            solve: () => `Divisibility by 9: 10ᵏ≡1(mod 9) for all k, so N≡digit sum (mod 9). ∎`
        },
        {
            match: /am.?gm|arithmetic.*geometric.*mean.*inequality/i,
            solve: (q) => {
                const nums = q.match(/\d+\.?\d*/g)?.map(Number);
                if (nums?.length >= 2) {
                    const am = MathUtils.r6(MathUtils.mean(nums));
                    const gm = MathUtils.r6(nums.reduce((p, x) => p * x, 1) ** (1 / nums.length));
                    return `AM-GM for [${nums.join(', ')}]:\nAM=${am}, GM=${gm}\nAM≥GM: ${am}≥${gm} ${am >= gm - 1e-9 ? '✓' : '✗'}`;
                }
                return `AM-GM: (a₁+…+aₙ)/n ≥ (a₁⋅…⋅aₙ)^(1/n). Equality iff all values equal.`;
            }
        },
        {
            match: /pigeonhole/i,
            solve: (q) => {
                const nums = q.match(/\d+/g)?.map(Number);
                if (nums?.length >= 2) return `Pigeonhole: ${nums[0]} items in ${nums[1]} boxes → some box has ≥⌈${nums[0]}/${nums[1]}⌉=${Math.ceil(nums[0] / nums[1])} items.`;
                return `Pigeonhole: n+1 items in n containers → at least one has ≥2.`;
            }
        },
        { match: /cauchy.?schwarz/i, solve: () => `Cauchy-Schwarz: (Σaᵢbᵢ)²≤(Σaᵢ²)(Σbᵢ²). Equality iff aᵢ/bᵢ=constant.` }
    ];
    function solve(q, deep) {
        for (const pat of PATTERNS) { if (pat.match.test(q)) return pat.solve(q, deep); }
        if (q.match(/prove|show that|for all|there exists/i)) {
            if (q.match(/induction/i)) return `Proof by Induction:\n1. Base case: verify P(1)\n2. Assume P(k)\n3. Prove P(k+1)\n4. Conclude ∀n∈ℕ`;
            if (q.match(/contradiction/i)) return `Proof by Contradiction:\n1. Assume ¬P\n2. Derive contradiction\n3. Conclude P`;
        }
        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §B  MATH MODE DETECTOR
// ══════════════════════════════════════════════════════
const MathModeDetector = (() => {
    const DEEP = /\b(explain|show steps?|step by step|how|why|derive|prove|proof|verify|check|show work|walk.*through|method|demonstrate|justify)\b/i;
    function detect(q) { return { deepMode: DEEP.test(q) }; }
    return { detect };
})();

// ══════════════════════════════════════════════════════
//  §C  MATH PRO MASTER SOLVER
// ══════════════════════════════════════════════════════
const MathPro = (() => {
    const PRO_PATTERN = /\b(prime|factor|gcd|lcm|hcf|fibonacci|combination|permutation|choose|nCr|nPr|std dev|standard deviation|variance|median|mode|determinant|eigenvalue|matrix|vector|dot product|cross product|chain rule|product rule|l.?h.?pital|taylor|maclaurin|pascal|derangement|catalan|arithmetic sequence|geometric sequence|sum of squares|sum of cubes|heron|sphere|cylinder|cone|circle area|law of sines|law of cosines|prove|proof|olympiad|induction|contradiction|am.?gm|cauchy|pigeonhole|modulo|bezout|totient|sieve|binary|hexadecimal|z.?score|binomial probability|eigenvalue)\b/i;

    function solve(question) {
        const q = question.trim();
        if (!q) return null;
        const { deepMode } = MathModeDetector.detect(q);
        let answer;

        answer = OlympiadSolver.solve(q, deepMode);
        if (answer) return { answer, domain: 'olympiad' };

        answer = NumberTheorySolver.solve(q, deepMode);
        if (answer) return { answer, domain: 'numberTheory' };

        answer = CombinatoricsSolver.solve(q, deepMode);
        if (answer) return { answer, domain: 'combinatorics' };

        // Fall to main MathEngine
        const existing = MathEngine.solveWithSteps(q);
        if (existing) {
            const finalAnswer = deepMode && existing.steps?.length
                ? `${existing.steps.join('\n')}\n\nAnswer: ${existing.answer}`
                : existing.answer;
            return { answer: finalAnswer, domain: 'arithmetic' };
        }

        return null;
    }

    function isMathQuestion(q) {
        return PRO_PATTERN.test(q) || /\d/.test(q) || /\b(solve|calculate|compute|evaluate|find the|what is|simplify|expand|factoris|differentiat|integrat|limit|log|sin|cos|tan|sqrt|root|prime|factor|percent|mean|average|algebra|geometry|calculus|trig)\b/i.test(q);
    }

    return { solve, isMathQuestion };
})();

// ══════════════════════════════════════════════════════
//  ⓲  JOKES & COMPLIMENTS
// ══════════════════════════════════════════════════════
const JOKES_LIST = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the math book look so sad? Too many problems.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "I asked my AI for dating advice. It said my error rate is too high.",
    "Why don't footballers use computers? Because they're afraid of the net!",
    "What do Harry Kane and a clock have in common? They both hit the top corner!",
    "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
    "What do you call a sleeping dinosaur? A dino-snore!",
    "I asked Siri why I'm single. She opened the front-facing camera.",
    "I'm reading a book about anti-gravity. It's impossible to put down.",
    "Did you hear about the mathematician afraid of negative numbers? He'll stop at nothing to avoid them.",
    "My WiFi went down for five minutes so I had to talk to my family. They seem nice.",
    "Why was the equal sign so humble? Because it realised it wasn't less than or greater than anything else.",
    "A mathematician's fear of negative numbers? He'll stop at nothing to avoid them."
];
const COMPLIMENTS_LIST = [
    "You're the kind of person who makes the world better just by being in it.",
    "Smart people ask questions. That's exactly what you're doing right now.",
    "You have a brilliant mind — keep pushing the boundaries of what you know!",
    "Your curiosity is one of your greatest superpowers. Never lose it.",
    "You're genuinely impressive. The questions you ask show real depth of thinking.",
    "You make every conversation more interesting. You've got real energy."
];
function pickJoke() { return JOKES_LIST[Math.floor(Math.random() * JOKES_LIST.length)]; }
function pickCompliment() { return COMPLIMENTS_LIST[Math.floor(Math.random() * COMPLIMENTS_LIST.length)]; }

// ══════════════════════════════════════════════════════
//  ⓳  MAIN AI PROCESSOR
// ══════════════════════════════════════════════════════
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

async function processInput(text) {
    const q = text.trim();
    if (!q) { VoiceRecog.startWake(); return; }

    TTS.stop();
    UI.setLogo('thinking');
    UI.waveOn(false);
    UI.setStatus('Thinking…', '');
    UI.showTx(q, '');
    UI.showThinking(true);

    // Check for follow-up / pronoun resolution
    const resolved = Memory.resolveFollowUp(q);
    if (resolved) {
        const result = MathEngine.solveWithSteps(resolved) || MathEngine.solveMath(resolved);
        if (result) {
            const answer = typeof result === 'object' ? result.answer : result;
            Memory.push('user', q);
            Memory.push('assistant', answer);
            UI.showThinking(false);
            UI.showTx(q, answer.replace(/\n/g, '<br>'));
            TTS.speak(answer, 'thinking');
            UI.setLogo('idle');
            return;
        }
    }

    const userFact = Memory.detectUserFact(q);
    if (userFact) { finalize(q, userFact); return; }

    const mood = EmotionEngine.detect(q);
    Memory.setMood(mood);
    Memory.push('user', q);

    let answer = null;

    // ── 1. ROAST / JOKES / COMPLIMENTS ──
    if (q.match(/roast me|ultra roast|destroy me|rip me|insult me|roast.*mode/i)) {
        const ctx = q.match(/football|soccer/) ? 'football' : q.match(/math|maths|physics/) ? 'math' : 'general';
        finalize(q, q.match(/ultra|max|extreme|full/) ? RoastEngine.getCombo() : RoastEngine.get(ctx), 'savage'); return;
    }
    if (q.match(/tell.*joke|joke\b|make me laugh/i)) { finalize(q, pickJoke(), 'playful'); return; }
    if (q.match(/compliment me|say.*nice|cheer me up/i)) { finalize(q, pickCompliment(), 'happy'); return; }

    // ── 2. TIMER ──
    answer = TimerEngine.set(q);
    if (answer) { finalize(q, answer, 'happy'); return; }
    if (q.match(/how many timers|active timers/i)) { finalize(q, TimerEngine.list()); return; }

    // ── 3. MUSIC ──
    if (q.match(/play (music|songs?|something|a song)\b/i)) { MusicPlayer.play(0); finalize(q, `Playing "${SONGS[0].t}" by ${SONGS[0].a}. Enjoy!`); return; }
    const playMatch = q.match(/^(?:play|put on)\s+(.+)/i);
    if (playMatch) {
        const term = playMatch[1].toLowerCase().replace(/please|now|for me/g, '').trim();
        const idx = MusicPlayer.findSong(term);
        if (idx >= 0) { MusicPlayer.play(idx); finalize(q, `Playing "${SONGS[idx].t}" by ${SONGS[idx].a}`); return; }
    }
    if (q.match(/next (song|track)/i)) { MusicPlayer.next(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/previous (song|track)|go back/i)) { MusicPlayer.prev(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/stop (music|playing)/i)) { MusicPlayer.stop(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/pause\b/i)) { MusicPlayer.toggle(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/resume\b|unpause/i)) { if (!MusicPlayer.playing) MusicPlayer.toggle(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/volume up|louder/i)) { MusicPlayer.setVol(0.95); finalize(q, "Volume cranked up!"); return; }
    if (q.match(/volume down|quieter/i)) { MusicPlayer.setVol(0.5); finalize(q, "Volume turned down."); return; }
    if (q.match(/what.*playing|current.*song/i)) {
        if (MusicPlayer.curSong >= 0) { finalize(q, `Now playing: "${SONGS[MusicPlayer.curSong].t}" by ${SONGS[MusicPlayer.curSong].a}`); return; }
        finalize(q, "No music playing. Say 'play music' to start!"); return;
    }
    if (q.match(/list.*songs?|song.*list|playlist/i)) {
        finalize(q, `Playlist: ${SONGS.slice(0, 10).map((s, i) => `${i + 1}. ${s.t} — ${s.a}`).join(', ')}... and more!`); return;
    }

    // ── 4. FOOTBALL ──
    if (q.match(/football|soccer|goal\b|match|fixture|score|league|bundesliga|premier.*league|la liga|serie a|ucl|champions.*league|world.*cup|messi|ronaldo|haaland|mbapp|saka|salah|kane|vinicius|bellingham|musiala|liverpool|arsenal|bayern|chelsea|manchester|real madrid|barcelona|psg|dortmund|inter|atletico|napoli|juventus|transfer|squad|manager|stadium|trophy|title/i)) {
        if (q.match(/live|score.*now|today.*match|currently playing/i)) {
            UI.toast('Fetching live data…');
            const liveData = await WebIntel.liveScores();
            if (liveData?.length) {
                const live = liveData.slice(0, 5).map(e => `${e.strHomeTeam} ${e.intHomeScore || 0}-${e.intAwayScore || 0} ${e.strAwayTeam} (${e.strLeague})`).join('; ');
                finalize(q, `Live matches: ${live}`, 'happy'); return;
            }
        }
        answer = FootballProcessor.answer(q);
        if (answer) { finalize(q, answer, q.match(/messi|goat|incredible|amazing/) ? 'happy' : mood); return; }
    }

    // ── 5. GENERAL KNOWLEDGE ──
    answer = KnowledgeBase.getGeneral(q);
    if (answer) { finalize(q, answer, mood); return; }

    // ── 6. MATHS (Pro + Deep Engine) ──
    if (MathPro.isMathQuestion(q)) {
        Memory.setLastMath(q);
        const { deepMode } = MathModeDetector.detect(q);
        const proResult = MathPro.solve(q);
        if (proResult) {
            Memory.push('assistant', proResult.answer);
            Memory.setMood('thinking');
            UI.showThinking(false);
            UI.showTx(q, proResult.answer.replace(/\n/g, '<br>'));
            TTS.speak(proResult.answer, 'thinking');
            UI.setLogo('idle');
            return;
        }
        // Try deep engine directly (handles trig, complex, inequalities, etc.)
        const deepResult = MathEngine.solveWithSteps(q);
        if (deepResult) {
            const stepStr = deepMode && deepResult.steps?.length
                ? `${deepResult.steps.join('\n')}\nAnswer: ${deepResult.answer}`
                : deepResult.answer;
            Memory.push('assistant', stepStr);
            Memory.setMood('thinking');
            UI.showThinking(false);
            UI.showTx(q, stepStr.replace(/\n/g, '<br>'));
            TTS.speak(stepStr, 'thinking');
            UI.setLogo('idle');
            return;
        }
        const simple = MathEngine.solveMath(q);
        if (simple) { finalize(q, simple, 'thinking'); return; }
    }

    // ── 7. PHYSICS ──
    if (q.match(/force|mass|acceleration|velocity|momentum|pressure|energy|work|power|ohm|voltage|current|resistance|density|wave|frequency|wavelength|kinematics|heat|gravity|physics/i)) {
        answer = PhysicsEngine.solve(q);
        if (answer) { finalize(q, answer, 'thinking'); return; }
    }

    // ── 8. UNIT CONVERSION ──
    if (q.match(/convert|celsius|fahrenheit|kelvin|km|miles|meters|feet|kg|pounds|liters|gallons|mph|kmh|bytes|mb|gb|tb|inches|cm|oz|ksh|usd/i)) {
        answer = UnitConverter.convert(q);
        if (answer) { finalize(q, answer); return; }
    }

    // ── 9. WEB SEARCH ──
    UI.setStatus('Searching the web…', '');
    UI.toast('Searching…');
    const webResult = await WebIntel.smartAnswer(q);
    if (webResult) {
        let response = webResult.text;
        if (webResult.title) response = `${webResult.title}: ${response}`;
        finalize(q, response, mood);
        return;
    }

    // ── 10. FALLBACK ──
    const user = Memory.getUser();
    const fallback = `${user ? `Sorry ${user}` : "I'm not sure"} about that. I can help with maths (arithmetic, algebra, trig, calculus, complex numbers, statistics), football, physics, science, history, music, timers, unit conversions, jokes and roasts. Try "what can you do" for the full list!`;
    finalize(q, fallback, 'neutral');
}

function finalize(question, answer, mood) {
    if (!answer) return;
    Memory.push('assistant', answer);
    const formatted = ReasoningEngine.formatResponse(answer, ReasoningEngine.analyzeQuestion(question), mood || Memory.getMood());
    UI.showTx(question, formatted || answer);
    UI.showThinking(false);
    TTS.speak(formatted || answer, mood);
    UI.setLogo('idle');
}

// ══════════════════════════════════════════════════════
//  ⓴  VOICE RECOGNITION ENGINE V2
//  Improvements:
//    • Confidence scoring — low confidence → ask for repeat
//    • Phonetic word substitutions (speech-to-text fixes)
//    • Auto-silence detection (voice activity)
//    • Multi-language fallback (en-GB if en-US fails)
//    • Interim display while user speaks
//    • Follow-up detection ("what about X?")
//    • Robustness: retry on transient errors
// ══════════════════════════════════════════════════════
const VoiceRecog = (() => {
    let wake = null, chat = null;
    let chatActive = false, wakeActive = false;
    let finalText = '', bestConfidence = 0;
    let chatRetries = 0, maxRetries = 2;
    let silenceTimer = null;

    // Phonetic repair: common STT mishears for maths/football
    const PHONETIC_FIXES = [
        [/\bsin e\b/gi, 'sine'],
        [/\bcos sign\b/gi, 'cosine'],
        [/\btan gent\b/gi, 'tangent'],
        [/\bbi no\b/gi, 'bingo'],
        [/\bsign\b(?=\s+\()/gi, 'sin'],
        [/\bsquare root\b/gi, 'square root'],
        [/\bx squared\b/gi, 'x^2'],
        [/\bx cubed\b/gi, 'x^3'],
        [/\bpi\b(?!\w)/gi, 'π'],
        [/\binfinity\b/gi, '∞'],
        [/\bmess e\b/gi, 'messi'],
        [/\brun aldo\b/gi, 'ronaldo'],
        [/\bper cent\b/gi, 'percent'],
        [/\btimes\b/gi, '×'],
        [/\bdivide[d]? by\b/gi, '÷'],
        [/\bpoint\b(?=\s+\d)/gi, '.'],
        [/\bnought point\b/gi, '0.'],
    ];

    function applyPhoneticFixes(text) {
        let t = text;
        for (const [from, to] of PHONETIC_FIXES) t = t.replace(from, to);
        return t;
    }

    function stopAll() {
        clearTimeout(silenceTimer);
        try { if (wake) wake.abort(); } catch (e) { }
        try { if (chat) chat.abort(); } catch (e) { }
        wake = null; chat = null; chatActive = false; wakeActive = false;
    }

    function startWake() {
        if (chatActive || wakeActive) return;
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        stopAll();
        wake = new SR();
        wake.continuous = true;
        wake.interimResults = true;
        wake.lang = BINGO_CONFIG.defaultLang;
        wake.maxAlternatives = 5;  // more alternatives → better wake detection
        wakeActive = true;

        wake.onresult = (e) => {
            let txt = '';
            for (let i = e.resultIndex; i < e.results.length; i++)
                for (let a = 0; a < e.results[i].length; a++)
                    txt += e.results[i][a].transcript.toLowerCase() + ' ';
            txt = applyPhoneticFixes(txt);
            if (/\bbingo\b/.test(txt)) {
                stopAll(); UI.flashWake(); UI.setLogo('listening');
                UI.setStatus('Hey! Listening…', ''); UI.waveOn(true);
                if (isMobile && navigator.vibrate) navigator.vibrate([80, 30, 80]);
                chatRetries = 0;
                setTimeout(() => startChat(), 350);
            }
        };
        wake.onerror = (e) => {
            wakeActive = false;
            if (e.error !== 'aborted') setTimeout(() => startWake(), BINGO_CONFIG.wakeRetryMs);
        };
        wake.onend = () => {
            wakeActive = false;
            if (!chatActive) setTimeout(() => startWake(), BINGO_CONFIG.wakeRetryMs);
        };
        try { wake.start(); } catch (e) { wakeActive = false; setTimeout(() => startWake(), 2500); }
    }

    function startChat(lang) {
        if (chatActive) return;
        stopAll();
        MusicPlayer.setVol(0.4);
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { TTS.speak("Voice input needs Chrome or Edge. Please type your question."); return; }
        chat = new SR();
        chat.continuous = false;
        chat.interimResults = true;
        chat.lang = lang || BINGO_CONFIG.defaultLang;
        chat.maxAlternatives = 5;
        chatActive = true;
        finalText = '';
        bestConfidence = 0;
        UI.setLogo('listening'); UI.waveOn(true);
        UI.setStatus('Listening…', 'Speak your question');

        chat.onresult = (e) => {
            clearTimeout(silenceTimer);
            let finalPart = '', interimPart = '', conf = 0;
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    finalPart += e.results[i][0].transcript;
                    conf = Math.max(conf, e.results[i][0].confidence || 0);
                } else {
                    interimPart += e.results[i][0].transcript;
                }
            }
            if (finalPart) {
                finalText = applyPhoneticFixes(finalPart.trim());
                bestConfidence = conf;
            }
            if (interimPart) {
                UI.setStatus('Listening…', applyPhoneticFixes(interimPart));
            }
            // Auto-submit after silence
            if (finalText) {
                silenceTimer = setTimeout(() => {
                    if (chat) try { chat.stop(); } catch (e) { }
                }, BINGO_CONFIG.listenSilenceMs);
            }
        };

        chat.onerror = (e) => {
            clearTimeout(silenceTimer);
            if (e.error === 'no-speech') {
                // Try again up to maxRetries
                chatActive = false; chat = null;
                if (chatRetries < maxRetries) {
                    chatRetries++;
                    UI.setStatus('Listening…', 'Try again…');
                    setTimeout(() => startChat(), 600);
                } else {
                    chatRetries = 0;
                    UI.setLogo('idle'); UI.waveOn(false);
                    UI.setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
                    setTimeout(() => startWake(), 600);
                }
            } else if (e.error === 'not-allowed') {
                TTS.speak("Microphone access denied. Please allow mic access in your browser settings.");
                chatActive = false;
            } else if (e.error === 'network' && lang !== BINGO_CONFIG.fallbackLang) {
                // Network error → try fallback language
                chatActive = false; chat = null;
                UI.toast('Network issue — retrying…');
                setTimeout(() => startChat(BINGO_CONFIG.fallbackLang), 800);
            } else {
                if (e.error !== 'aborted') UI.toast('Mic issue: ' + e.error);
                chatActive = false;
            }
        };

        chat.onend = () => {
            clearTimeout(silenceTimer);
            chatActive = false; chat = null;
            MusicPlayer.setVol(0.8);
            if (finalText) {
                // Confidence check
                if (bestConfidence > 0 && bestConfidence < BINGO_CONFIG.listenConfidenceMin) {
                    // Low confidence → confirm
                    UI.setStatus('I heard:', finalText);
                    TTS.speak(`I heard: "${finalText}". Is that correct?`, 'thinking');
                    // We still process it — user can correct via text or voice
                }
                const toProcess = finalText;
                finalText = '';
                chatRetries = 0;
                processInput(toProcess);
            } else {
                UI.setLogo('idle'); UI.waveOn(false);
                UI.setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
                setTimeout(() => startWake(), 600);
            }
        };

        // Safety: max listen duration
        setTimeout(() => {
            if (chatActive && chat) {
                try { chat.stop(); } catch (e) { }
            }
        }, BINGO_CONFIG.listenMaxDuration);

        try { chat.start(); } catch (e) { chatActive = false; UI.toast('Tap to try again'); setTimeout(() => startWake(), 1000); }
    }

    return { startWake, startChat, stopAll, get chatActive() { return chatActive; } };
})();

// ══════════════════════════════════════════════════════
//  ⓴+0  LIVE SCORE AUTO-REFRESH
// ══════════════════════════════════════════════════════
let liveRefreshInterval = null;
function startLiveRefresh() {
    if (liveRefreshInterval) clearInterval(liveRefreshInterval);
    liveRefreshInterval = setInterval(async () => {
        const events = await WebIntel.liveScores();
        if (events?.length) {
            const liveNow = events.filter(e => e.strStatus === 'NS' || e.strStatus === 'LIVE' || e.intHomeScore !== null);
            if (liveNow.length) {
                const summary = liveNow.slice(0, 3).map(e => `${e.strHomeTeam} ${e.intHomeScore || 0}-${e.intAwayScore || 0} ${e.strAwayTeam}`).join(' | ');
                UI.toast(`⚽ LIVE: ${summary}`, 6000);
            }
        }
    }, BINGO_CONFIG.liveRefreshInterval);
}

// ══════════════════════════════════════════════════════
//  ⓴+1  TAP HANDLER
// ══════════════════════════════════════════════════════
function onTap() {
    if (VoiceRecog.chatActive) return;
    TTS.stop();
    if (isMobile && navigator.vibrate) navigator.vibrate(50);
    VoiceRecog.startChat();
}

// ══════════════════════════════════════════════════════
//  ⓴+2  STARTUP
// ══════════════════════════════════════════════════════
window.addEventListener('load', () => {
    UI.setLogo('idle');
    UI.setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');

    const logo = document.getElementById('logoOuter');
    if (logo) {
        logo.addEventListener('click', onTap, { passive: true });
        logo.addEventListener('touchstart', onTap, { passive: true });
    }

    const inp = document.getElementById('textInput');
    if (inp) {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && inp.value.trim()) { processInput(inp.value.trim()); inp.value = ''; }
        });
    }
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn && inp) {
        sendBtn.addEventListener('click', () => { if (inp.value.trim()) { processInput(inp.value.trim()); inp.value = ''; } });
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    startLiveRefresh();

    setTimeout(() => {
        TTS.speak(`Hello! I'm Bingo Version 3.5 Enhanced by Protogen AI. I've been upgraded with a significantly deeper maths engine — trigonometry, calculus, complex numbers, inequalities, simultaneous equations and more — plus smarter listening with confidence scoring, phonetic repair, and follow-up memory. Football, maths, science, music and more. Say Bingo or tap to start!`, 'happy');
    }, 1200);

    setTimeout(() => VoiceRecog.startWake(), 4500);
});

// ══════════════════════════════════════════════════════
//  GLOBAL EXPORTS
// ══════════════════════════════════════════════════════
window.onTap = onTap;
window.togglePlay = () => MusicPlayer.toggle();
window.nextSong = () => MusicPlayer.next();
window.prevSong = () => MusicPlayer.prev();
window.stopMusic = () => MusicPlayer.stop();
window.setVol = (v) => MusicPlayer.setVol(v);
window.toggleShuffle = () => { MusicPlayer.shuffleMode = !MusicPlayer.shuffleMode; TTS.speak(MusicPlayer.shuffleMode ? "Shuffle on." : "Shuffle off."); };
window.toggleRepeat = () => { MusicPlayer.repeatMode = !MusicPlayer.repeatMode; TTS.speak(MusicPlayer.repeatMode ? "Repeat on." : "Repeat off."); };
window.processInput = processInput;
window.speakText = (t) => TTS.speak(t);
window.setStatus = UI.setStatus;
window.waveOn = UI.waveOn;
window.setLogo = UI.setLogo;
window.flashWake = UI.flashWake;
window.toast = UI.toast;
window.showTx = UI.showTx;
window.seekSong = (e) => MusicPlayer.seek(e);
window.VR = VoiceRecog;
window.BingoMemory = Memory;
window.BingoMood = EmotionEngine;
window.MathPro = MathPro;
window.MathUtils = MathUtils;
window.MathEngine = MathEngine;

console.log('%c[Bingo V3.5.1 Enhanced] Loaded.', 'color:#8b5cf6;font-weight:bold;font-size:13px;');
console.log('%c  ↑ Deep Math: trig, calculus, complex numbers, inequalities, simultaneous equations, log laws, surds and more.', 'color:#0ea5e9;font-size:11px;');
console.log('%c  ↑ Listening V2: confidence scoring, phonetic repair, auto-silence, retry logic, follow-up memory.', 'color:#22c55e;font-size:11px;');
console.log('%c  Creator: Martin Lutherking Owino | Protogen AI / HECO AFRICA | 3.5.1', 'color:#f59e0b;font-size:11px;');
