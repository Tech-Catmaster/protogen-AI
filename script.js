
// ═══════════════════════════════════════════════════════════════════════════
// PROTOGEN AI — BINGO V3.5 — UNIFIED INTELLIGENCE CORE
// File     : bingo_v3.5.js
// Version  : 3.5.0  |  Architecture: Single-File Unified Intelligence Engine
// Creator  : Martin Lutherking Owino — CEO, Protogen AI / HECO AFRICA
// Build    : Full fusion of Bingo V4 Core + BingoMathPro Extension
//            — No separate script loading required. One file to rule them all.
// ═══════════════════════════════════════════════════════════════════════════
'use strict';

// ══════════════════════════════════════════════════════
//  ❶  CONSTANTS & CONFIGURATION
// ══════════════════════════════════════════════════════
const BINGO_CONFIG = {
    wakeWord: 'bingo',
    version: '3.5.0',
    creator: 'Martin Lutherking Owino',
    company: 'Protogen AI / HECO AFRICA',
    defaultLang: 'en-US',
    sessionMemoryLimit: 50,
    apiTimeout: 6000,
    liveRefreshInterval: 45000,
    ttsRate: 0.91,
    ttsPitch: 1.08,
    ttsVolume: 1.0
};

// ══════════════════════════════════════════════════════
//  ❷  SESSION MEMORY ENGINE
// ══════════════════════════════════════════════════════
const Memory = (() => {
    const _store = [];
    const _context = { lastTopic: null, lastEntity: null, mood: 'neutral', userName: null };
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

    function setMood(mood) { _context.mood = mood; }
    function getMood() { return _context.mood; }
    function setUser(name) { _context.userName = name; remember('username', name); }
    function getUser() { return _context.userName || recall('username') || null; }

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

    return { push, remember, recall, getContext, setMood, getMood, setUser, getUser, detectUserFact, store: _store, ctx: _context };
})();

// ══════════════════════════════════════════════════════
//  ❸  EMOTION ENGINE
// ══════════════════════════════════════════════════════
const EmotionEngine = (() => {
    const states = {
        happy: { rate: 1.05, pitch: 1.18, prefixes: ["Yesss! ", "Oh I love this! ", "Great question! "], color: '#22c55e' },
        playful: { rate: 1.08, pitch: 1.22, prefixes: ["Haha! ", "Okay okay, ", "Oh you're funny, "], color: '#f59e0b' },
        serious: { rate: 0.88, pitch: 0.95, prefixes: ["Alright, listen up. ", "Here's the truth: ", "Let me be clear — "], color: '#6366f1' },
        thinking: { rate: 0.82, pitch: 0.92, prefixes: ["Hmm, let me think... ", "Interesting... ", "Processing that... "], color: '#0ea5e9' },
        savage: { rate: 1.02, pitch: 1.12, prefixes: ["", "", ""], color: '#ef4444' },
        neutral: { rate: 0.91, pitch: 1.08, prefixes: ["", "", ""], color: '#8b5cf6' }
    };

    function detect(text) {
        const q = text.toLowerCase();
        if (q.match(/roast|insult|savage|destroy me/)) return 'savage';
        if (q.match(/joke|funny|laugh|haha|lol/)) return 'playful';
        if (q.match(/messi|goat|champions league|world cup|incredible/)) return 'happy';
        if (q.match(/calculus|integral|derivative|physics|formula|solve/)) return 'thinking';
        if (q.match(/serious|important|please|urgent|help me/)) return 'serious';
        return 'neutral';
    }

    function get(name) { return states[name] || states.neutral; }
    function apply(text, name) {
        const state = states[name] || states.neutral;
        const prefix = state.prefixes[Math.floor(Math.random() * state.prefixes.length)];
        return prefix + text;
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
        "The world didn't revolve around you even when you thought it did. It was laughing.",
        "You have the depth of a puddle in July — evaporating fast and leaving nothing behind.",
        "Some people are like clouds — when they disappear, it's a beautiful day. You're a thunderstorm with no rain. Just noise.",
        "You're not the dumbest person in the room — you just work very hard to compete for that title.",
        "Your WiFi password probably matches your IQ: short, weak, and everyone can guess it.",
        "You're what happens when autocorrect gives up and just types whatever.",
        "Scientists study you as a cautionary tale. The study is called 'How Not To'.",
        "Even Google can't find a compliment for you. And it knows everything.",
        "I'd explain why you're wrong, but I left my crayons at home and this clearly requires diagrams.",
        "You're like an airport delay — everyone's frustrated, nobody knows why you exist, and the experience improves the moment you're gone.",
        "Your vibe is basically homework — nobody wants you, you show up anyway, and you ruin the mood.",
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
        const all = [...pool, ...roasts];
        return all[Math.floor(Math.random() * all.length)];
    }

    function getCombo() {
        const r1 = roasts[Math.floor(Math.random() * roasts.length)];
        const r2 = roasts[Math.floor(Math.random() * roasts.length)];
        return r1 + ' ' + r2;
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
        if (data?.extract && data.type !== 'disambiguation') {
            return { title: data.title, summary: data.extract.substring(0, 500), url: data.content_urls?.desktop?.page || '' };
        }
        const search = await fetchSafe(`${WIKI_SEARCH}${encodeURIComponent(query)}`);
        if (search?.query?.search?.length) {
            const top = search.query.search[0];
            const slug2 = encodeURIComponent(top.title.replace(/\s+/g, '_'));
            const detail = await fetchSafe(`${WIKI_API}${slug2}`);
            if (detail?.extract) {
                return { title: detail.title, summary: detail.extract.substring(0, 500), url: detail.content_urls?.desktop?.page || '' };
            }
        }
        return null;
    }

    async function duckduckgo(query) {
        const data = await fetchSafe(`${DDG_API}${encodeURIComponent(query)}`);
        if (!data) return null;
        if (data.AbstractText?.length > 30) return { answer: data.AbstractText, source: data.AbstractSource || 'DuckDuckGo' };
        if (data.Answer?.length > 5) return { answer: data.Answer, source: 'DuckDuckGo Instant' };
        if (data.RelatedTopics?.length) {
            const relevant = data.RelatedTopics.filter(t => t.Text).slice(0, 2).map(t => t.Text).join('. ');
            if (relevant.length > 20) return { answer: relevant, source: 'DuckDuckGo' };
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
        if (data?.events?.length) return data.events;
        return null;
    }

    async function searchTeam(name) {
        const data = await fetchSafe(`${SPORTSDB}/searchteams.php?t=${encodeURIComponent(name)}`);
        return data?.teams?.[0] || null;
    }

    async function searchPlayer(name) {
        const data = await fetchSafe(`${SPORTSDB}/searchplayers.php?p=${encodeURIComponent(name)}`);
        return data?.player?.[0] || null;
    }

    return { wikipedia, duckduckgo, smartAnswer, liveScores, searchTeam, searchPlayer, fetchSafe };
})();

// ══════════════════════════════════════════════════════
//  ❻  FULL FOOTBALL KNOWLEDGE BASE  (2025-26 Season)
// ══════════════════════════════════════════════════════
const FootballDB = {
    TEAM_IDS: {
        'bayern munich': '133604', 'bayern': '133604',
        'liverpool': '133602', 'arsenal': '133616',
        'manchester city': '133615', 'man city': '133615',
        'chelsea': '133610', 'real madrid': '133739',
        'barcelona': '133738', 'borussia dortmund': '133667',
        'dortmund': '133667', 'inter milan': '133736', 'psg': '133718',
        'atletico madrid': '133741', 'newcastle': '133614',
        'tottenham': '133622', 'manchester united': '133620',
        'man united': '133620', 'juventus': '133735',
        'ac milan': '133732', 'napoli': '133754', 'benfica': '133725'
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
        messi: {
            fullName: "Lionel Messi", nationality: "Argentine", currentClub: "Inter Miami CF",
            dob: "June 24, 1987", age: 38, goals: 850, assists: 380, matches: 1100,
            ballonDor: 8, description: "The Greatest of All Time. 8 Ballon d'Or awards, 2022 World Cup winner.",
            trophies: ["2022 FIFA World Cup", "4× Champions League", "10× La Liga", "7× Copa del Rey", "8× Ballon d'Or"],
            records: ["All-time top scorer for Argentina", "Most Ballon d'Or awards ever (8)", "Most La Liga goals", "Only player to score 91 goals in a calendar year (2012)"]
        },
        ronaldo: {
            fullName: "Cristiano Ronaldo", nationality: "Portuguese", currentClub: "Al-Nassr",
            dob: "February 5, 1985", age: 41, goals: 900, assists: 260, matches: 1150,
            ballonDor: 5, description: "All-time leading scorer in football history. 5 Ballon d'Or awards.",
            trophies: ["5× Champions League", "3× Premier League", "2× La Liga", "3× Serie A", "EURO 2016", "Nations League 2019"],
            records: ["All-time leading scorer in football history (900+ goals)", "Most Champions League goals ever", "Most international goals ever (130+)"]
        },
        haaland: {
            fullName: "Erling Haaland", nationality: "Norwegian", currentClub: "Manchester City",
            dob: "July 21, 2000", age: 25, goals: 42, assists: 7, matches: 40,
            description: "Premier League's most lethal striker. Record-breaking debut season."
        },
        mbappe: {
            fullName: "Kylian Mbappé", nationality: "French", currentClub: "Real Madrid",
            dob: "December 20, 1998", age: 27, goals: 27, assists: 11, matches: 35,
            description: "The fastest player in the world. 27 goals this season for Real Madrid."
        },
        saka: {
            fullName: "Bukayo Saka", nationality: "English", currentClub: "Arsenal",
            dob: "September 5, 2001", age: 24, goals: 18, assists: 13, matches: 35,
            description: "Arsenal's most important player. 6 UCL goals this campaign."
        },
        bellingham: {
            fullName: "Jude Bellingham", nationality: "English", currentClub: "Real Madrid",
            dob: "June 29, 2003", age: 22, goals: 16, assists: 9, matches: 34,
            description: "Real Madrid's energetic midfielder. One of the best midfielders in the world."
        },
        vinicius: {
            fullName: "Vinícius Jr.", nationality: "Brazilian", currentClub: "Real Madrid",
            dob: "July 12, 2000", age: 25, goals: 21, assists: 12, matches: 33,
            description: "Explosive winger. 2024 Ballon d'Or winner. Dazzling on the left flank."
        },
        salah: {
            fullName: "Mohamed Salah", nationality: "Egyptian", currentClub: "Liverpool",
            dob: "June 15, 1992", age: 33, goals: 26, assists: 18, matches: 35,
            description: "Premier League's most dangerous attacker. Key to Liverpool's title push."
        },
        kane: {
            fullName: "Harry Kane", nationality: "English", currentClub: "Bayern Munich",
            dob: "July 28, 1993", age: 32, goals: 34, assists: 10, matches: 36,
            description: "34 Bundesliga goals — on course for the Golden Boot. Brilliant in Germany."
        }
    },

    teams: {
        bayernMunich: {
            name: "Bayern Munich", league: "Bundesliga", position: 1, points: 73, played: 28,
            won: 23, drawn: 4, lost: 1, goalsFor: 101, goalsAgainst: 27,
            manager: "Vincent Kompany", stadium: "Allianz Arena", capacity: 75024,
            topScorer: "Harry Kane", topScorerGoals: 34, topAssist: "Jamal Musiala", topAssistCount: 14,
            keyPlayers: ["Harry Kane", "Jamal Musiala", "Leroy Sané", "Manuel Neuer", "Joshua Kimmich"],
            ucl2026: "Led Real Madrid 2-1 after QF 1st leg. 2nd leg April 15 at Bernabéu.",
            nextMatch: { opponent: "Borussia Dortmund", competition: "Bundesliga", date: "April 19, 2026", venue: "Signal Iduna Park", time: "17:30 CET" },
            lastResult: { score: "2-0", opponent: "FC Augsburg", result: "Win", date: "April 5, 2026", competition: "Bundesliga" },
            trophies: { bundesliga: 33, championsLeague: 6, DFBPokal: 20, worldClubCup: 2 }
        },
        liverpool: {
            name: "Liverpool", league: "Premier League", position: 1, points: 75, played: 31,
            won: 23, drawn: 6, lost: 2, goalsFor: 78, goalsAgainst: 30,
            manager: "Arne Slot", stadium: "Anfield", capacity: 61276,
            topScorer: "Mohamed Salah", topScorerGoals: 26, topAssist: "Trent Alexander-Arnold", topAssistCount: 15,
            keyPlayers: ["Mohamed Salah", "Virgil van Dijk", "Trent Alexander-Arnold", "Darwin Núñez", "Alisson"],
            ucl2026: "Eliminated in Round of 16",
            nextMatch: { opponent: "West Ham United", competition: "Premier League", date: "April 19, 2026", venue: "London Stadium", time: "15:00 GMT" },
            lastResult: { score: "3-1", opponent: "Fulham", result: "Win", date: "April 5, 2026", competition: "Premier League" },
            trophies: { premierLeague: 20, championsLeague: 6, FAcup: 8, leagueCup: 10 }
        },
        arsenal: {
            name: "Arsenal", league: "Premier League", position: 2, points: 69, played: 31,
            won: 21, drawn: 6, lost: 4, goalsFor: 65, goalsAgainst: 28,
            manager: "Mikel Arteta", stadium: "Emirates Stadium", capacity: 60704,
            topScorer: "Bukayo Saka", topScorerGoals: 18, topAssist: "Martin Ødegaard", topAssistCount: 13,
            keyPlayers: ["Bukayo Saka", "Martin Ødegaard", "Declan Rice", "Gabriel Magalhães", "David Raya"],
            ucl2026: "QF — Led PSG 3-1 after 1st leg. 2nd leg April 16 in Paris.",
            nextMatch: { opponent: "Manchester City", competition: "Premier League", date: "April 19, 2026", venue: "Etihad Stadium", time: "16:30 GMT" },
            lastResult: { score: "2-1", opponent: "Chelsea", result: "Win", date: "April 4, 2026", competition: "Premier League" },
            trophies: { premierLeague: 13, championsLeague: 0, FAcup: 14, leagueCup: 2 }
        },
        realMadrid: {
            name: "Real Madrid", league: "La Liga", position: 2, points: 63, played: 29,
            won: 19, drawn: 6, lost: 4, goalsFor: 70, goalsAgainst: 30,
            manager: "Carlo Ancelotti", stadium: "Santiago Bernabéu", capacity: 81044,
            topScorer: "Kylian Mbappé", topScorerGoals: 27, topAssist: "Vinícius Jr.", topAssistCount: 12,
            keyPlayers: ["Kylian Mbappé", "Vinícius Jr.", "Jude Bellingham", "Rodrygo", "Dani Carvajal"],
            ucl2026: "Trail Bayern 1-2 after QF 1st leg. 2nd leg April 15 at Bernabéu.",
            nextMatch: { opponent: "Bayern Munich", competition: "UCL QF 2nd Leg", date: "April 15, 2026", venue: "Santiago Bernabéu", time: "21:00 CET" },
            lastResult: { score: "2-1", opponent: "Barcelona", result: "Win", date: "March 30, 2026", competition: "La Liga" },
            trophies: { laLiga: 36, championsLeague: 15, copaDelRey: 20, worldClubCup: 8 }
        },
        manchesterCity: {
            name: "Manchester City", league: "Premier League", position: 3, points: 59, played: 31,
            won: 18, drawn: 5, lost: 8, goalsFor: 58, goalsAgainst: 38,
            manager: "Pep Guardiola", stadium: "Etihad Stadium", capacity: 53400,
            topScorer: "Erling Haaland", topScorerGoals: 42, topAssist: "Kevin De Bruyne", topAssistCount: 11,
            keyPlayers: ["Erling Haaland", "Kevin De Bruyne", "Phil Foden", "Bernardo Silva", "Ederson"],
            ucl2026: "Eliminated in Round of 16",
            nextMatch: { opponent: "Arsenal", competition: "Premier League", date: "April 19, 2026", venue: "Etihad Stadium", time: "16:30 GMT" },
            lastResult: { score: "0-1", opponent: "Newcastle", result: "Loss", date: "April 3, 2026", competition: "Premier League" },
            trophies: { premierLeague: 9, championsLeague: 1, FAcup: 8, leagueCup: 9 }
        }
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
//  ❼  ADVANCED MATH ENGINE  (Step-by-step solver)
// ══════════════════════════════════════════════════════
const MathEngine = (() => {
    function tokenize(expr) {
        const tokens = [];
        let i = 0;
        expr = expr.replace(/\s+/g, '');
        while (i < expr.length) {
            if (/\d|\./.test(expr[i])) {
                let num = '';
                while (i < expr.length && /[\d.]/.test(expr[i])) num += expr[i++];
                tokens.push({ type: 'NUM', val: parseFloat(num) });
            } else if (expr[i] === '(') { tokens.push({ type: 'LPAREN' }); i++; }
            else if (expr[i] === ')') { tokens.push({ type: 'RPAREN' }); i++; }
            else if (['+', '-', '*', '/', '%', '^'].includes(expr[i])) {
                tokens.push({ type: 'OP', val: expr[i] }); i++;
            } else if (/[a-z]/i.test(expr[i])) {
                let fn = '';
                while (i < expr.length && /[a-z]/i.test(expr[i])) fn += expr[i++];
                tokens.push({ type: 'FUNC', val: fn.toLowerCase() });
            } else i++;
        }
        return tokens;
    }

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
            while (peek() && peek().type === 'OP' && (peek().val === '*' || peek().val === '/' || peek().val === '%')) {
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
                const arg = parsePrimary();
                const fns = {
                    sin: x => Math.sin(x * Math.PI / 180), cos: x => Math.cos(x * Math.PI / 180),
                    tan: x => Math.tan(x * Math.PI / 180), asin: x => Math.asin(x) * 180 / Math.PI,
                    acos: x => Math.acos(x) * 180 / Math.PI, atan: x => Math.atan(x) * 180 / Math.PI,
                    sqrt: x => Math.sqrt(x), cbrt: x => Math.cbrt(x),
                    log: x => Math.log10(x), ln: x => Math.log(x),
                    abs: x => Math.abs(x), ceil: x => Math.ceil(x),
                    floor: x => Math.floor(x), round: x => Math.round(x)
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

    function evalExpression(expr) {
        try {
            const clean = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3');
            const tokens = tokenize(clean);
            const result = parse(tokens);
            if (isNaN(result) || !isFinite(result)) return null;
            return parseFloat(result.toPrecision(10)).toString();
        } catch { return null; }
    }

    function solveWithSteps(question) {
        const q = question.toLowerCase().trim();
        const steps = [];

        // Percentage
        let m = q.match(/(\d+\.?\d*)\s*(?:%|percent(?:age)?)\s*of\s*(\d+\.?\d*)/);
        if (m) {
            const pct = parseFloat(m[1]), total = parseFloat(m[2]);
            steps.push(`Formula: (percentage ÷ 100) × total`);
            steps.push(`= (${pct} ÷ 100) × ${total}`);
            steps.push(`= ${pct / 100} × ${total}`);
            return { answer: `${pct}% of ${total} = ${(pct / 100) * total}`, steps };
        }

        // Quadratic formula
        m = q.match(/(-?\d*\.?\d*)\s*x[²2\^]\s*([+\-]\s*\d+\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)\s*=\s*0/);
        if (m) {
            const a = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
            const b = parseFloat(m[2].replace(/\s/g, ''));
            const c = parseFloat(m[3].replace(/\s/g, ''));
            const disc = b * b - 4 * a * c;
            steps.push(`Quadratic formula: x = (-b ± √(b²-4ac)) / 2a`);
            steps.push(`a = ${a}, b = ${b}, c = ${c}`);
            steps.push(`Discriminant = ${disc}`);
            if (disc < 0) return { answer: `No real solutions (discriminant = ${disc} < 0).`, steps };
            const x1 = parseFloat(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(6));
            const x2 = parseFloat(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(6));
            return { answer: x1 === x2 ? `x = ${x1} (repeated root)` : `x = ${x1} or x = ${x2}`, steps };
        }

        // Square root
        m = q.match(/square\s*root\s*of\s*(\d+\.?\d*)|sqrt\s*[(\s]*(\d+\.?\d*)/);
        if (m) {
            const n = parseFloat(m[1] || m[2]);
            const sqr = Math.sqrt(n);
            steps.push(`√${n} = ?`);
            if (Number.isInteger(sqr)) steps.push(`${n} = ${sqr}×${sqr}, so √${n} = ${sqr} exactly`);
            else steps.push(`≈ ${parseFloat(sqr.toFixed(8))}`);
            return { answer: `√${n} = ${parseFloat(sqr.toFixed(8))}`, steps };
        }

        // Power
        m = q.match(/(\d+\.?\d*)\s*(?:to the power of|raised to)\s*(\d+\.?\d*)/);
        if (!m) m = q.match(/(\d+\.?\d*)\s*\^\s*(\d+\.?\d*)/);
        if (m) {
            const base = parseFloat(m[1]), exp = parseFloat(m[2]);
            steps.push(`${base}^${exp} = ${Math.pow(base, exp)}`);
            return { answer: `${base}^${exp} = ${Math.pow(base, exp)}`, steps };
        }

        // Mean
        m = q.match(/(?:mean|average)\s+of\s+([\d\s,.]+)/);
        if (m) {
            const nums = m[1].match(/\d+\.?\d*/g).map(Number);
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = sum / nums.length;
            steps.push(`Sum: ${nums.join(' + ')} = ${sum}`);
            steps.push(`Mean = ${sum} ÷ ${nums.length}`);
            return { answer: `Mean of [${nums.join(', ')}] = ${parseFloat(mean.toFixed(4))}`, steps };
        }

        // Derivative (basic power rule)
        m = q.match(/derivative\s+of\s+x\s*\^?\s*(\d+)/);
        if (m) {
            const n = parseInt(m[1]);
            steps.push(`Power rule: d/dx(xⁿ) = n·xⁿ⁻¹`);
            steps.push(`d/dx(x^${n}) = ${n}x^${n - 1}`);
            return { answer: `d/dx(x^${n}) = ${n === 1 ? '1' : `${n}x^${n - 1}`}`, steps };
        }

        // Integral (basic power rule)
        m = q.match(/integral\s+of\s+x\s*\^?\s*(\d+)/);
        if (m) {
            const n = parseInt(m[1]);
            steps.push(`∫xⁿ dx = xⁿ⁺¹/(n+1) + C`);
            return { answer: `∫x^${n} dx = x^${n + 1}/${n + 1} + C`, steps };
        }

        // Arithmetic expression
        const cleanQ = q.replace(/what is|calculate|compute|evaluate|solve|equals?/g, '').trim();
        const mathChars = /^[\d\s+\-*/^().%×÷²³sqrtabscossintan]+$/i;
        if (mathChars.test(cleanQ) && cleanQ.length > 0) {
            const r = evalExpression(cleanQ);
            if (r !== null) return { answer: `${cleanQ.trim()} = ${r}`, steps: [`= ${r}`] };
        }

        return null;
    }

    function solveMath(question) {
        const result = solveWithSteps(question);
        if (result) return result.answer;
        const q = question.toLowerCase().trim();
        let m;
        m = q.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/);
        if (m) return `${m[1]}% of ${m[2]} = ${(parseFloat(m[1]) / 100) * parseFloat(m[2])}`;
        m = q.match(/(\d+\.?\d*)\s*([\+\-\*\/x×÷])\s*(\d+\.?\d*)/);
        if (m) {
            const a = parseFloat(m[1]), b = parseFloat(m[3]), op = m[2];
            if (op === '+') return `${a} + ${b} = ${a + b}`;
            if (op === '-') return `${a} - ${b} = ${a - b}`;
            if (op === '*' || op === 'x' || op === '×') return `${a} × ${b} = ${a * b}`;
            if (op === '/' || op === '÷') return b === 0 ? "Cannot divide by zero." : `${a} ÷ ${b} = ${parseFloat((a / b).toFixed(8))}`;
        }
        m = q.match(/factorial\s+of\s+(\d+)|(\d+)\s*!/);
        if (m) {
            const n = parseInt(m[1] || m[2]);
            if (n > 20) return `${n}! is astronomically large.`;
            let f = 1; for (let i = 2; i <= n; i++) f *= i;
            return `${n}! = ${f}`;
        }
        return null;
    }

    return { solveWithSteps, solveMath, evalExpression };
})();

// ══════════════════════════════════════════════════════
//  ❽  ADVANCED PHYSICS ENGINE
// ══════════════════════════════════════════════════════
const PhysicsEngine = (() => {
    function solve(question) {
        const q = question.toLowerCase();
        const nums = [];
        const rx = /(\d+\.?\d*)/g;
        let nm;
        while ((nm = rx.exec(q)) !== null) nums.push(parseFloat(nm[1]));
        if (nums.length < 2) return null;
        const n = i => nums[i] !== undefined ? nums[i] : 0;

        if (q.match(/(?:final|new)?\s*velocity.*acceleration.*time|v\s*=\s*u\s*\+/))
            return `Kinematics: v = u + at = ${n(0)} + (${n(1)} × ${n(2)}) = ${n(0) + n(1) * n(2)} m/s`;
        if (q.match(/displacement|distance.*time.*acceleration/)) {
            const s = n(0) * n(1) + 0.5 * n(2) * n(1) * n(1);
            return `s = ut + ½at² = ${n(0)}×${n(1)} + 0.5×${n(2)}×${n(1)}² = ${parseFloat(s.toFixed(4))} m`;
        }
        if (q.match(/force.*mass.*acceleration|newton.*second|f\s*=\s*ma/))
            return `F = ma = ${n(0)} × ${n(1)} = ${n(0) * n(1)} Newtons`;
        if (q.match(/kinetic energy|ke\b/))
            return `KE = ½mv² = 0.5 × ${n(0)} × ${n(1)}² = ${0.5 * n(0) * n(1) * n(1)} Joules`;
        if (q.match(/potential energy|pe\b/))
            return `PE = mgh = ${n(0)} × 9.81 × ${n(1)} = ${parseFloat((n(0) * 9.81 * n(1)).toFixed(3))} Joules`;
        if (q.match(/ohm.*law|voltage.*current.*resist|v\s*=\s*ir/))
            return `V = IR = ${n(0)} × ${n(1)} = ${n(0) * n(1)} Volts`;
        if (q.match(/momentum/))
            return `p = mv = ${n(0)} × ${n(1)} = ${n(0) * n(1)} kg⋅m/s`;
        if (q.match(/pressure.*force.*area/))
            return `P = F/A = ${n(0)} ÷ ${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} Pascals`;
        if (q.match(/work.*force.*distance/))
            return `W = Fd = ${n(0)} × ${n(1)} = ${n(0) * n(1)} Joules`;
        if (q.match(/power.*work.*time/))
            return `P = W/t = ${n(0)} ÷ ${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} Watts`;
        if (q.match(/wave.*speed|frequency.*wavelength/))
            return `v = fλ = ${n(0)} × ${n(1)} = ${n(0) * n(1)} m/s`;
        if (q.match(/gravity|gravitational acceleration/))
            return `Gravitational acceleration on Earth: g = 9.81 m/s²`;
        if (q.match(/electric.*power|p\s*=\s*iv/))
            return `P = IV = ${n(0)} × ${n(1)} = ${n(0) * n(1)} Watts`;
        if (q.match(/density/))
            return `ρ = m/V = ${n(0)} ÷ ${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} kg/m³`;
        if (q.match(/heat|thermal energy|specific heat/))
            return `Q = mcΔT = ${n(0)} × ${n(1)} × ${n(2) || n(1)} = ${parseFloat((n(0) * n(1) * (n(2) || n(1))).toFixed(3))} Joules`;
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

        // Temperature
        if (q.match(/celsius.*fahrenheit|°c.*°f|c to f/)) return `${n}°C = ${r(n * 9 / 5 + 32, 2)}°F`;
        if (q.match(/fahrenheit.*celsius|°f.*°c|f to c/)) return `${n}°F = ${r((n - 32) * 5 / 9, 2)}°C`;
        if (q.match(/celsius.*kelvin/)) return `${n}°C = ${r(n + 273.15, 2)} K`;
        if (q.match(/kelvin.*celsius/)) return `${n} K = ${r(n - 273.15, 2)}°C`;
        if (q.match(/fahrenheit.*kelvin/)) return `${n}°F = ${r((n - 32) * 5 / 9 + 273.15, 2)} K`;
        // Distance
        if (q.match(/km.*miles?/)) return `${n} km = ${r(n * 0.621371)} miles`;
        if (q.match(/miles?.*km/)) return `${n} miles = ${r(n * 1.60934)} km`;
        if (q.match(/meters?.*feet|m\s+to\s+f/)) return `${n} m = ${r(n * 3.28084)} feet`;
        if (q.match(/feet.*meters?/)) return `${n} ft = ${r(n * 0.3048)} m`;
        if (q.match(/cm.*inches?/)) return `${n} cm = ${r(n * 0.393701)} in`;
        if (q.match(/inches?.*cm/)) return `${n} in = ${r(n * 2.54)} cm`;
        if (q.match(/meters?.*yards?/)) return `${n} m = ${r(n * 1.09361)} yards`;
        if (q.match(/yards?.*meters?/)) return `${n} yards = ${r(n * 0.9144)} m`;
        // Weight
        if (q.match(/kg.*lbs?|kilograms?.*pounds?/)) return `${n} kg = ${r(n * 2.20462)} lbs`;
        if (q.match(/lbs?.*kg|pounds?.*kg/)) return `${n} lbs = ${r(n * 0.453592)} kg`;
        if (q.match(/grams?.*ounces?/)) return `${n} g = ${r(n * 0.035274)} oz`;
        if (q.match(/ounces?.*grams?/)) return `${n} oz = ${r(n * 28.3495)} g`;
        if (q.match(/tonnes?.*kg/)) return `${n} tonne(s) = ${n * 1000} kg`;
        if (q.match(/kg.*tonnes?/)) return `${n} kg = ${n / 1000} tonnes`;
        if (q.match(/grams?.*kg/)) return `${n} g = ${n / 1000} kg`;
        if (q.match(/kg.*grams?/)) return `${n} kg = ${n * 1000} g`;
        // Volume
        if (q.match(/liters?.*gallons?/)) return `${n} L = ${r(n * 0.264172)} gallons`;
        if (q.match(/gallons?.*liters?/)) return `${n} gallons = ${r(n * 3.78541)} L`;
        if (q.match(/liters?.*ml/)) return `${n} L = ${n * 1000} ml`;
        if (q.match(/ml.*liters?/)) return `${n} ml = ${n / 1000} L`;
        // Speed
        if (q.match(/mph.*km\/h|mph.*kmh/)) return `${n} mph = ${r(n * 1.60934)} km/h`;
        if (q.match(/km\/h.*mph|kmh.*mph/)) return `${n} km/h = ${r(n * 0.621371)} mph`;
        if (q.match(/m\/s.*km\/h/)) return `${n} m/s = ${r(n * 3.6)} km/h`;
        if (q.match(/km\/h.*m\/s/)) return `${n} km/h = ${r(n / 3.6)} m/s`;
        // Data
        if (q.match(/bytes?.*kb/)) return `${n} bytes = ${r(n / 1024, 6)} KB`;
        if (q.match(/kb.*mb/)) return `${n} KB = ${r(n / 1024, 6)} MB`;
        if (q.match(/mb.*gb/)) return `${n} MB = ${r(n / 1024, 6)} GB`;
        if (q.match(/gb.*tb/)) return `${n} GB = ${r(n / 1024, 6)} TB`;
        if (q.match(/gb.*mb/)) return `${n} GB = ${n * 1024} MB`;
        if (q.match(/tb.*gb/)) return `${n} TB = ${n * 1024} GB`;
        // Energy
        if (q.match(/joules?.*calories?/)) return `${n} J = ${r(n * 0.239006)} cal`;
        if (q.match(/calories?.*joules?/)) return `${n} cal = ${r(n * 4.184)} J`;
        // Currency hints
        if (q.match(/ksh.*usd|shilling.*dollar/)) return `Approx. 130 KSH = 1 USD (early 2026 rate). Use a currency app for live rates.`;
        if (q.match(/usd.*ksh|dollar.*shilling/)) return `Approx. 1 USD = 130 KSH (early 2026 rate). Use a currency app for live rates.`;
        if (q.match(/usd.*euro|dollar.*euro/)) return `Approx. 1 USD = 0.93 EUR (early 2026 rate).`;
        if (q.match(/pound.*usd|gbp.*usd/)) return `Approx. 1 GBP = 1.27 USD (early 2026 rate).`;
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
        if (Math.random() > 0.6 && mood !== 'neutral') return EmotionEngine.apply(raw, mood);
        return raw;
    }

    return { analyzeQuestion, formatResponse };
})();

// ══════════════════════════════════════════════════════
//  ⓫  GENERAL KNOWLEDGE BASE (Extended)
// ══════════════════════════════════════════════════════
const KnowledgeBase = (() => {
    const GEOGRAPHY = {
        capitals: {
            kenya: "Nairobi", nigeria: "Abuja",
            "south africa": "Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)",
            ghana: "Accra", ethiopia: "Addis Ababa", egypt: "Cairo", tanzania: "Dodoma",
            uganda: "Kampala", zimbabwe: "Harare", zambia: "Lusaka", mozambique: "Maputo",
            angola: "Luanda", cameroon: "Yaounde", senegal: "Dakar",
            "ivory coast": "Yamoussoukro", somalia: "Mogadishu", sudan: "Khartoum",
            rwanda: "Kigali", madagascar: "Antananarivo", malawi: "Lilongwe",
            botswana: "Gaborone", namibia: "Windhoek",
            france: "Paris", germany: "Berlin", italy: "Rome", spain: "Madrid",
            portugal: "Lisbon", "united kingdom": "London", netherlands: "Amsterdam",
            belgium: "Brussels", switzerland: "Bern", austria: "Vienna", sweden: "Stockholm",
            norway: "Oslo", denmark: "Copenhagen", finland: "Helsinki", poland: "Warsaw",
            "czech republic": "Prague", hungary: "Budapest", greece: "Athens",
            ukraine: "Kyiv", russia: "Moscow",
            usa: "Washington D.C.", "united states": "Washington D.C.", canada: "Ottawa",
            mexico: "Mexico City", brazil: "Brasilia", argentina: "Buenos Aires",
            colombia: "Bogota", chile: "Santiago", peru: "Lima",
            china: "Beijing", japan: "Tokyo", india: "New Delhi", "south korea": "Seoul",
            indonesia: "Jakarta", philippines: "Manila", vietnam: "Hanoi",
            thailand: "Bangkok", malaysia: "Kuala Lumpur", singapore: "Singapore",
            pakistan: "Islamabad", "saudi arabia": "Riyadh", iran: "Tehran",
            turkey: "Ankara", australia: "Canberra", "new zealand": "Wellington"
        }
    };

    const SCIENCE = {
        speedOfLight: "The speed of light in a vacuum is exactly 299,792,458 m/s — approximately 300,000 km/s.",
        speedOfSound: "The speed of sound in air at 20°C is approximately 343 m/s (1,235 km/h).",
        dna: "DNA (Deoxyribonucleic Acid) carries genetic instructions. It consists of a double helix of nucleotide base pairs: A-T and C-G.",
        gravity: "Gravity is the fundamental force of attraction between masses. g = 9.81 m/s² on Earth's surface.",
        ai: "Artificial Intelligence simulates human cognitive processes using machine learning, neural networks, and NLP.",
        quantum: "Quantum mechanics describes matter at the smallest scales: wave-particle duality, superposition, entanglement, and the uncertainty principle.",
        blackHole: "A black hole is where gravity is so strong nothing escapes — not even light. Formed from massive collapsing stars.",
        bigBang: "The Big Bang (13.8 billion years ago) was the rapid expansion of spacetime from an extremely hot, dense state.",
        evolution: "Evolution by natural selection (Charles Darwin, 1859) explains how species change over generations through survival of the fittest.",
        internet: "The internet began as ARPANET (1969). Tim Berners-Lee invented the World Wide Web in 1989. Now connects 5+ billion people.",
        climate: "Climate change: burning fossil fuels releases CO₂ that traps heat in Earth's atmosphere — the enhanced greenhouse effect."
    };

    const HISTORY = {
        ww1: "World War 1 (1914-1918): Allied Powers vs Central Powers. 20+ million deaths. Ended with Treaty of Versailles 1919.",
        ww2: "World War 2 (1939-1945): Allies vs Axis. 70-85 million casualties. Holocaust killed 6 million Jews. Led to the United Nations.",
        coldWar: "Cold War (1947-1991): USA vs USSR — nuclear arms race, Korean War, Vietnam War, Cuban Missile Crisis, Berlin Wall. Ended with Soviet dissolution.",
        civilRights: "American Civil Rights Movement (1954-1968): MLK, Rosa Parks, Malcolm X. Civil Rights Act 1964, Voting Rights Act 1965.",
        mandela: "Nelson Mandela (1918-2013): 27 years in prison. First Black president of South Africa (1994-1999). Nobel Peace Prize 1993.",
        gandhi: "Mahatma Gandhi (1869-1948): Led India's non-violent independence via Satyagraha. India independent August 15, 1947.",
        kenyaIndependence: "Kenya gained independence December 12, 1963. Jomo Kenyatta became first PM. Celebrated as Jamhuri Day.",
        moonLanding: "Apollo 11 landed on the Moon July 20, 1969. Neil Armstrong: 'One small step for man, one giant leap for mankind.'",
        romanEmpire: "Roman Empire (27 BC–476 AD): dominated the Mediterranean for 500 years. Spread Latin, law, and Christianity across Europe.",
        frenchRevolution: "French Revolution (1789-1799): Overthrew monarchy. Liberté, Égalité, Fraternité. Reign of Terror. Led to Napoleon.",
        colonialism: "European colonialism (15th-20th century): Scramble for Africa (1880s). Immense exploitation but also spread of technology and language."
    };

    const TECH = {
        gpt: "GPT is a family of large language models by OpenAI. GPT-4 powers ChatGPT. Trained on massive text datasets using transformer architecture.",
        blockchain: "Blockchain is a distributed, immutable ledger secured by cryptography. Powers Bitcoin, Ethereum, and smart contracts.",
        python: "Python (1991, Guido van Rossum): dominant language for AI/ML, data science, and web development.",
        react: "React: Meta's JavaScript library for UIs (2013). Component-based, virtual DOM. Most popular frontend framework globally.",
        cloudComputing: "Cloud computing: AWS, Azure, Google Cloud deliver on-demand computing, storage, and databases over the internet.",
        ev: "Electric Vehicles: use battery-powered motors instead of combustion engines. Tesla leads premium market. China leads adoption globally."
    };

    function getCapital(question) {
        const q = question.toLowerCase();
        const m = q.match(/capital\s+(?:of|city\s+of)\s+(.+?)(?:\?|$)/);
        if (m) {
            const country = m[1].trim().replace(/\?/g, '').toLowerCase();
            const cap = GEOGRAPHY.capitals[country] || GEOGRAPHY.capitals[country.replace(/^the\s+/, '')];
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
            return `I'm Bingo — your advanced AI assistant by Protogen AI / HECO AFRICA. Version 3.5 — unified intelligence with full maths, physics, football, science, history, web search, music and more. Ask me anything!`;
        if (q.match(/what can you do|your abilities|features/))
            return `Bingo V3.5 can: Live football scores & stats (all leagues), Champions League updates, Player profiles, Step-by-step Maths (arithmetic → calculus → olympiad), Number theory, Statistics, Linear algebra, Geometry, Physics, Unit conversions, Web search, General knowledge, Science & history, Music playback, Timers, Jokes & savage roasts, Memory of our conversation. Just ask!`;
        if (q.match(/version|what version/))
            return `I'm running Bingo Version 3.5 — the unified single-file build fusing the core intelligence engine with the BingoMathPro extension for deep mathematical reasoning.`;

        if (q.match(/^(hi|hello|hey|howdy)\b/)) {
            const h = new Date().getHours();
            const user = Memory.getUser();
            const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
            return `${g}${user ? `, ${user}` : ''}! I'm Bingo V3.5. What can I help you with today?`;
        }
        if (q.match(/how are you|how do you feel/)) return `Running at full power! All systems optimal. What can I do for you?`;
        if (q.match(/thank(s| you)|cheers/)) return `You're welcome! That's what I'm here for. Fire away with the next question!`;

        if (q.match(/speed of light/)) return SCIENCE.speedOfLight;
        if (q.match(/speed of sound/)) return SCIENCE.speedOfSound;
        if (q.match(/what is dna\b/)) return SCIENCE.dna;
        if (q.match(/what is ai|artificial intel/)) return SCIENCE.ai;
        if (q.match(/what is gravity/)) return SCIENCE.gravity;
        if (q.match(/quantum/)) return SCIENCE.quantum;
        if (q.match(/black hole/)) return SCIENCE.blackHole;
        if (q.match(/big bang/)) return SCIENCE.bigBang;
        if (q.match(/evolution|darwin/)) return SCIENCE.evolution;
        if (q.match(/internet.*history|history.*internet/)) return SCIENCE.internet;
        if (q.match(/climate change|global warming/)) return SCIENCE.climate;
        if (q.match(/gpt|chatgpt/)) return SCIENCE.ai + ' ' + TECH.gpt;
        if (q.match(/blockchain|bitcoin|crypto/)) return TECH.blockchain;
        if (q.match(/python.*language|programming.*python/)) return TECH.python;
        if (q.match(/react.*javascript/)) return TECH.react;
        if (q.match(/cloud computing/)) return TECH.cloudComputing;
        if (q.match(/electric.*vehicle|tesla\b|ev\b/)) return TECH.ev;

        if (q.match(/distance.*earth.*moon|moon.*distance/)) return `The average distance from Earth to the Moon is 384,400 km (238,855 miles).`;
        if (q.match(/distance.*earth.*sun|sun.*distance/)) return `The average distance from Earth to the Sun is 149.6 million km (1 AU).`;
        if (q.match(/how old is.*earth|age.*earth/)) return `Earth is approximately 4.54 billion years old.`;
        if (q.match(/how old is.*universe|age.*universe/)) return `The universe is approximately 13.8 billion years old.`;
        if (q.match(/\bpi\b|value of pi/)) return `Pi (π) ≈ 3.14159265358979... — the ratio of a circle's circumference to its diameter.`;
        if (q.match(/planets in solar system|number of planets/)) return `8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.`;
        if (q.match(/largest planet/)) return `Jupiter is the largest planet in our solar system.`;
        if (q.match(/nearest star/)) return `Proxima Centauri, 4.24 light-years away.`;

        if (q.match(/world war (1|one|i)\b/) && !q.match(/world war (2|two|ii)/)) return HISTORY.ww1;
        if (q.match(/world war (2|two|ii)/)) return HISTORY.ww2;
        if (q.match(/cold war/)) return HISTORY.coldWar;
        if (q.match(/civil rights|martin luther king|mlk/)) return HISTORY.civilRights;
        if (q.match(/mandela/)) return HISTORY.mandela;
        if (q.match(/gandhi/)) return HISTORY.gandhi;
        if (q.match(/kenya.*independen|independen.*kenya|jamhuri/)) return HISTORY.kenyaIndependence;
        if (q.match(/moon landing|neil armstrong|apollo 11/)) return HISTORY.moonLanding;
        if (q.match(/roman empire/)) return HISTORY.romanEmpire;
        if (q.match(/french revolution/)) return HISTORY.frenchRevolution;
        if (q.match(/colonialism|colonial/)) return HISTORY.colonialism;

        const cap = getCapital(question);
        if (cap) return cap;

        if (q.match(/largest country/)) return `Russia is the largest country at 17.1 million km².`;
        if (q.match(/smallest country/)) return `Vatican City is the smallest at 0.44 km².`;
        if (q.match(/longest river/)) return `The Nile (6,650 km) is traditionally the world's longest river.`;
        if (q.match(/highest mountain|everest/)) return `Mount Everest (8,849 m) on the Nepal-Tibet border. First summited by Hillary and Norgay on May 29, 1953.`;
        if (q.match(/mariana trench|deepest/)) return `Mariana Trench (Challenger Deep) is 11,034 m below sea level — the deepest point on Earth.`;
        if (q.match(/kenya.*population|population.*kenya/)) return `Kenya has ~57 million people (2026 estimate). Nairobi is the capital with ~5.3 million.`;

        if (q.match(/meaning of life/)) return `42! (Douglas Adams). More seriously: purpose, love, connection, and experience are common answers across philosophy and religion.`;
        if (q.match(/seconds.*day/)) return `86,400 seconds in a day (60×60×24).`;
        if (q.match(/days.*year/)) return `365 days (366 in a leap year).`;

        return null;
    }

    return { getGeneral, getCapital, GEOGRAPHY, SCIENCE, HISTORY, TECH };
})();

// ══════════════════════════════════════════════════════
//  ⓬  FOOTBALL QUERY PROCESSOR
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
        const n = name.toLowerCase();
        const t = FootballDB.teams;
        if (n.includes('bayern') || n.includes('munich')) return { data: t.bayernMunich };
        if (n.includes('liverpool')) return { data: t.liverpool };
        if (n.includes('arsenal')) return { data: t.arsenal };
        if (n.includes('real madrid') || (n.includes('madrid') && !n.includes('atletico'))) return { data: t.realMadrid };
        if (n.includes('manchester city') || n.includes('man city')) return { data: t.manchesterCity };
        return null;
    }

    function answer(question) {
        const q = question.toLowerCase();
        const cl = FootballDB.championsLeague;
        const wc = FootballDB.worldCup2026;

        if (q.match(/live|score.*now|currently.*playing/)) {
            const upcoming = cl.secondLeg.filter(m => new Date(m.date) >= new Date());
            if (upcoming.length) {
                const list = upcoming.map(m => `${m.home} vs ${m.away} — ${m.comp} on ${m.date} at ${m.time}`).join('; ');
                return `No live matches right now. Upcoming: ${list}`;
            }
            return `No live matches at the moment. Next fixtures: April 15 — Real Madrid vs Bayern Munich (UCL), April 19 — Liverpool vs West Ham, Arsenal vs Man City.`;
        }

        if (q.match(/upcoming|next.*fixtures?|schedule/)) {
            const list = FootballDB.upcomingFixtures.map(f => `${f.date}: ${f.home} vs ${f.away} — ${f.comp} at ${f.time}`).join('. ');
            return `Upcoming Fixtures: ${list}`;
        }

        if (q.match(/recent results?|latest results?|last.*results?/)) {
            const list = FootballDB.recentResults.map(r => `${r.date}: ${r.home} ${r.hScore}-${r.aScore} ${r.away} (${r.comp})`).join('. ');
            return `Recent Results: ${list}`;
        }

        if (q.match(/football news|latest.*football/))
            return `Football Headlines: ${FootballDB.news.join('. ')}`;

        if (q.match(/world cup/)) {
            return `FIFA World Cup 2026: ${wc.hosts.join(', ')}. ${wc.startDate}–${wc.finalDate}. ${wc.teams} teams, ${wc.groups} groups. Final: ${wc.finalVenue}. Defending champions: ${wc.defending}. Contenders: ${wc.topContenders.join(', ')}. ${wc.notable}.`;
        }

        if (q.match(/champions league|ucl\b|european cup/)) {
            if (q.match(/quarter.?final/)) {
                const list = cl.quarterFinals.map(m => `${m.home} ${m.hScore}-${m.aScore} ${m.away} (${m.leg})`).join('; ');
                return `UCL QF 1st Legs: ${list}. 2nd legs April 15-17. Final: ${cl.final.date} at ${cl.final.venue}.`;
            }
            if (q.match(/semi.?final/)) return `UCL Semi-Final dates: ${cl.semiFinalDates}.`;
            if (q.match(/\bfinal\b/)) return `UCL Final: ${cl.final.date} at ${cl.final.venue}.`;
            if (q.match(/top scorer|goal.*scorer/)) {
                const list = cl.topScorers.map(s => `${s.name} (${s.club}) ${s.goals} goals`).join(', ');
                return `UCL 2025-26 Top Scorers: ${list}.`;
            }
            if (q.match(/eliminated/)) return `Eliminated: ${cl.eliminated.join(', ')}.`;
            return `UCL 2025-26 — ${cl.stage}. Bayern lead Real Madrid 2-1 after QF 1st leg. Arsenal beat PSG 3-1. Semi-finals: ${cl.semiFinalDates}. Final: ${cl.final.date} at ${cl.final.venue}.`;
        }

        const playerNames = ['messi', 'ronaldo', 'haaland', 'mbapp', 'saka', 'bellingham', 'vinicius', 'salah', 'kane', 'vini', 'musiala', 'odegaard', 'van dijk', 'de bruyne', 'foden'];
        for (const pn of playerNames) {
            if (q.includes(pn)) {
                const player = getPlayerInfo(pn);
                if (player) {
                    if (q.match(/messi.*ronaldo|ronaldo.*messi|compare|vs|versus|goat.*debate|better/)) {
                        const mes = FootballDB.players.messi;
                        const ron = FootballDB.players.ronaldo;
                        return `The eternal debate! Messi: ${mes.goals} career goals, ${mes.matches} matches, ${mes.assists} assists, ${mes.ballonDor} Ballon d'Or awards, 1 World Cup. Ronaldo: ${ron.goals} career goals (all-time record), ${ron.matches} matches, ${ron.ballonDor} Ballon d'Or awards, 5 UCL titles, 0 World Cups. Messi won 2022 — cementing GOAT status.`;
                    }
                    if (q.match(/goals?/)) return `${player.fullName}: ${player.goals} goals in ${player.matches} matches.`;
                    if (q.match(/age|born|dob/)) return `${player.fullName} was born ${player.dob}, age ${player.age}.`;
                    if (q.match(/club|play.*for|team/)) return `${player.fullName} plays for ${player.currentClub}.`;
                    if (player.trophies && q.match(/trophies?|titles?/)) return `${player.fullName}'s trophies: ${player.trophies.join('. ')}.`;
                    return `${player.fullName} (${player.nationality}), ${player.currentClub}. ${player.description}`;
                }
            }
        }

        if (q.match(/musiala/)) return `Jamal Musiala — Bayern Munich's creative genius. Born 2003, plays for Germany. One of the brightest talents in world football at 22.`;
        if (q.match(/odegaard|ødegaard/)) return `Martin Ødegaard is Arsenal's captain and creative midfielder. Norwegian international, one of the best playmakers in the PL.`;
        if (q.match(/van dijk|virgil/)) return `Virgil van Dijk is Liverpool's commanding centre-back — arguably the best defender in the world.`;
        if (q.match(/de bruyne|kevin/)) return `Kevin De Bruyne is Man City's midfield maestro — widely regarded as the best central midfielder of his generation.`;
        if (q.match(/\bfoden\b/)) return `Phil Foden — Man City's most creative player, the 'Stockport Iniesta'.`;

        const teamResult = getTeamData(q);
        if (teamResult) {
            const td = teamResult.data;
            if (q.match(/next match|fixture/)) return `${td.name}'s next match: vs ${td.nextMatch.opponent}, ${td.nextMatch.competition}, ${td.nextMatch.date} at ${td.nextMatch.venue} (${td.nextMatch.time}).`;
            if (q.match(/last.*match|recent result/)) return `${td.name}'s last result: ${td.lastResult.score} vs ${td.lastResult.opponent} — ${td.lastResult.result} on ${td.lastResult.date}.`;
            if (q.match(/top scorer|goals/)) return `${td.name} top scorer: ${td.topScorer} (${td.topScorerGoals} goals). Top assist: ${td.topAssist} (${td.topAssistCount}).`;
            if (q.match(/squad|key players/)) return `${td.name} key players: ${td.keyPlayers.join(', ')}. Manager: ${td.manager}.`;
            if (q.match(/manager|coach/)) return `${td.name}'s manager is ${td.manager}.`;
            if (q.match(/stadium|ground/)) return `${td.name} play at ${td.stadium} (capacity ${td.capacity.toLocaleString()}).`;
            if (q.match(/trophies?|titles?/)) {
                const entries = Object.entries(td.trophies).map(([k, v]) => `${v} ${k.replace(/([A-Z])/g, ' $1').trim()}`).join(', ');
                return `${td.name} trophies: ${entries}.`;
            }
            if (q.match(/table|standing|position/)) return `${td.name}: ${td.position}th in ${td.league}, ${td.points} pts from ${td.played} games (W${td.won} D${td.drawn} L${td.lost}).`;
            return `${td.name}: ${td.position}th in ${td.league}, ${td.points} pts. Top scorer: ${td.topScorer} (${td.topScorerGoals}). Manager: ${td.manager}. Stadium: ${td.stadium}.`;
        }

        if (q.match(/bundesliga.*(table|standing)|table.*bundesliga/)) {
            const rows = FootballDB.bundesliga.map(t => `${t.pos}. ${t.team} ${t.pts}pts (W${t.w} D${t.d} L${t.l})`).join('. ');
            return `Bundesliga 2025-26 Top 5: ${rows}`;
        }
        if (q.match(/premier league.*(table|standing)|epl.*table|pl.*table/)) {
            const rows = FootballDB.premierLeague.map(t => `${t.pos}. ${t.team} ${t.pts}pts (W${t.w} D${t.d} L${t.l})`).join('. ');
            return `Premier League 2025-26 Top 8: ${rows}`;
        }
        if (q.match(/la liga.*(table|standing)|laliga/)) {
            const rows = FootballDB.laLiga.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ');
            return `La Liga 2025-26 Top 5: ${rows}`;
        }
        if (q.match(/serie a.*(table|standing)/)) {
            const rows = FootballDB.serieA.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ');
            return `Serie A 2025-26 Top 5: ${rows}`;
        }

        if (q.match(/\bpsg\b|paris saint.?germain/)) return `PSG trail Arsenal 1-3 after UCL QF 1st leg. 2nd leg: April 16 at Parc des Princes.`;
        if (q.match(/\binter milan\b|internazionale/)) return `Inter Milan drew 1-1 with Atletico in UCL QF 1st leg. 2nd leg April 17. Top of Serie A (60 pts).`;
        if (q.match(/\bdortmund\b/) && !q.match(/bundesliga table/)) return `Borussia Dortmund beat Benfica 2-0 in UCL QF 1st leg. 2nd leg April 17. 3rd in Bundesliga.`;
        if (q.match(/\bbarcelona\b/) && !q.match(/la liga table/)) return `FC Barcelona top La Liga (67 pts). Eliminated from UCL this season. Manager: Hansi Flick.`;
        if (q.match(/\bchelsa\b|\bchelsea\b/) && !q.match(/premier league table/)) return `Chelsea 4th in Premier League (53 pts). Manager: Enzo Maresca. Lost 1-2 to Arsenal on April 4.`;
        if (q.match(/\bnewcastle\b/)) return `Newcastle 5th in Premier League (49 pts). Beat Man City 1-0. Manager: Eddie Howe.`;
        if (q.match(/\bjuventus\b/)) return `Juventus 3rd in Serie A (53 pts).`;
        if (q.match(/\bnapoli\b/)) return `Napoli lead Serie A (62 pts). Manager: Antonio Conte.`;
        if (q.match(/\batletico\b/)) return `Atletico Madrid drew 1-1 at Inter in UCL QF 1st leg. 2nd leg April 17 at Wanda Metropolitano.`;
        if (q.match(/football|soccer|match\b/)) return `Latest: ${FootballDB.news[0]}. ${FootballDB.news[1]}. Ask about any team, player or league!`;

        return null;
    }

    return { answer, getPlayerInfo, getTeamData };
})();

// ══════════════════════════════════════════════════════
//  ⓭  MUSIC PLAYER ENGINE
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
    { t: "Rich Flex", a: "Drake & 21 Savage", duration: 211 },
    { t: "Golden Hour", a: "JVKE", duration: 209 },
    { t: "Running Up That Hill", a: "Kate Bush", duration: 300 },
    { t: "Heat Waves", a: "Glass Animals", duration: 238 },
    { t: "Stay", a: "The Kid LAROI", duration: 141 },
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
        playing = !playing;
        updateUI();
        TTS.speak(playing ? "Resuming music." : "Music paused.");
    }

    function next() {
        clearInterval(progTmr);
        if (shuffleMode) {
            let idx; do { idx = Math.floor(Math.random() * SONGS.length); } while (idx === curSong && SONGS.length > 1);
            play(idx);
        } else { play((curSong + 1) % SONGS.length); }
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
        const slider = document.getElementById('volSlider');
        if (slider) slider.value = vol;
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

    return { play, toggle, next, prev, stop, setVol, seek, findSong, get curSong() { return curSong; }, get playing() { return playing; }, get shuffleMode() { return shuffleMode; }, set shuffleMode(v) { shuffleMode = v; }, get repeatMode() { return repeatMode; }, set repeatMode(v) { repeatMode = v; }, songs: SONGS };
})();

// ══════════════════════════════════════════════════════
//  ⓮  TTS ENGINE
// ══════════════════════════════════════════════════════
const TTS = (() => {
    let queue = [], busy = false;
    const PREFERRED = [
        'Google UK English Female', 'Google US English', 'Microsoft Aria Online (Natural)',
        'Microsoft Zira Desktop', 'Samantha', 'Karen', 'Moira', 'Tessa', 'Daniel'
    ];

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
        UI.setLogo('speaking');
        UI.waveOn(true);
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
    function waveOn(on) {
        const el = document.getElementById('waveWrap');
        if (el) el.classList.toggle('on', on);
    }
    function setLogo(state) {
        const el = document.getElementById('logoOuter');
        if (el) el.className = 'logo-outer ' + (state || 'idle');
    }
    function flashWake() {
        const el = document.getElementById('wakeFlash');
        if (el) { el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 900); }
    }
    function toast(msg, dur = 2800) {
        const el = document.getElementById('toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('on');
        clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.remove('on'), dur);
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
        } else {
            if (rw) rw.style.display = 'none';
        }
        box.classList.add('on');
        clearTimeout(box._t);
        box._t = setTimeout(() => box.classList.remove('on'), 14000);
    }
    function showThinking(on) {
        const el = document.getElementById('thinkingIndicator');
        if (el) el.style.display = on ? 'flex' : 'none';
    }
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
        const id = setTimeout(() => {
            TTS.speak(`Timer done! ${parsed.label} have passed. Time is up!`, 'happy');
            UI.toast(`⏰ Timer done — ${parsed.label}`);
        }, parsed.ms);
        active.push({ id, label: parsed.label, end: Date.now() + parsed.ms });
        return `Timer set for ${parsed.label}. I'll alert you when it's done!`;
    }
    function list() {
        if (!active.length) return "No active timers.";
        return active.map(t => { const rem = Math.max(0, Math.round((t.end - Date.now()) / 1000)); return `${t.label} — ${rem}s remaining`; }).join(', ');
    }
    return { set, list, parse };
})();

// ══════════════════════════════════════════════════════
//  §A  MATH PRO EXTENSION — UTILITIES
//      Brought in-file from bingo_math_pro.js
// ══════════════════════════════════════════════════════
const MathUtils = (() => {
    const r = (v, dp = 8) => { if (!isFinite(v)) return v; return parseFloat(v.toFixed(dp)); };
    const r4 = v => r(v, 4);
    const r6 = v => r(v, 6);

    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
    function gcd(a, b) {
        a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
        while (b) { [a, b] = [b, a % b]; }
        return a;
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
        if (n < 2) return false;
        if (n === 2 || n === 3) return true;
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
        if (r2 < 0 || r2 > n) return 0;
        if (r2 === 0 || r2 === n) return 1;
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
        for (let i = 2; i <= limit; i++) {
            if (!composite[i]) { primes.push(i); for (let j = i * i; j <= limit; j += i) composite[j] = 1; }
        }
        return primes;
    }
    function mean(arr) { return arr.reduce((s, x) => s + x, 0) / arr.length; }
    function variance(arr, population = true) {
        const mu = mean(arr), n2 = population ? arr.length : arr.length - 1;
        return arr.reduce((s, x) => s + (x - mu) ** 2, 0) / n2;
    }
    function stdDev(arr, population = true) { return Math.sqrt(variance(arr, population)); }
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
//  §B  MATH MODE DETECTOR
// ══════════════════════════════════════════════════════
const MathModeDetector = (() => {
    const DEEP = /\b(explain|show steps?|step by step|how|why|derive|prove|proof|verify|check|show work|walk.*through|method|approach|demonstrate|justify|from first principles?)\b/i;
    function detect(q) {
        return { deepMode: DEEP.test(q) };
    }
    return { detect };
})();

// ══════════════════════════════════════════════════════
//  §C  NUMBER THEORY SOLVER
// ══════════════════════════════════════════════════════
const NumberTheorySolver = (() => {
    function solve(q, deep) {
        let m;

        m = q.match(/is\s+(\d+)\s+(?:a\s+)?prime(?:\s+number)?/i);
        if (m) {
            const n = parseInt(m[1]);
            if (MathUtils.isPrime(n)) {
                if (deep) return `${n} is prime.\nProof: No divisors exist between 2 and √${n} ≈ ${MathUtils.fmt(Math.sqrt(n), 2)}.`;
                return `${n} is a prime number.`;
            }
            const pf = MathUtils.primeFactors(n);
            return `${n} is NOT prime. Factorisation: ${pf.map(f => f.e > 1 ? `${f.p}^${f.e}` : `${f.p}`).join(' × ')}.`;
        }

        m = q.match(/(?:prime\s*factor(?:is|iz|s)?(?:ation|e)?|factoris?e)\s+(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            const pf = MathUtils.primeFactors(n);
            const factorStr = pf.map(f => f.e > 1 ? `${f.p}^${f.e}` : `${f.p}`).join(' × ');
            if (!deep) return `${n} = ${factorStr}`;
            let steps = [`Prime factorisation of ${n}:`], temp = n, d = 2;
            while (d * d <= temp) {
                while (temp % d === 0) { steps.push(`${temp} ÷ ${d} = ${temp / d}`); temp = Math.floor(temp / d); }
                d += d === 2 ? 1 : 2;
            }
            if (temp > 1) steps.push(`${temp} is prime → done`);
            steps.push(`Result: ${n} = ${factorStr}`);
            return steps.join('\n');
        }

        m = q.match(/(?:gcd|hcf|greatest\s+common\s+(?:divisor|factor))\s+(?:of\s+)?(\d+)\s*(?:and|,)\s*(\d+)/i);
        if (m) {
            const a = parseInt(m[1]), b = parseInt(m[2]), g = MathUtils.gcd(a, b);
            if (!deep) return `GCD(${a}, ${b}) = ${g}`;
            let steps = [`GCD(${a}, ${b}) — Euclidean algorithm:`], x = a, y = b;
            while (y) { steps.push(`${x} = ${Math.floor(x / y)} × ${y} + ${x % y}`);[x, y] = [y, x % y]; }
            steps.push(`GCD = ${x}`);
            const bez = MathUtils.extGcd(a, b);
            steps.push(`Bezout: ${a}×(${bez.x}) + ${b}×(${bez.y}) = ${g}`);
            return steps.join('\n');
        }

        m = q.match(/(?:lcm|least\s+common\s+multiple)\s+(?:of\s+)?(\d+)\s*(?:and|,)\s*(\d+)/i);
        if (m) {
            const a = parseInt(m[1]), b = parseInt(m[2]), l = MathUtils.lcm(a, b);
            if (!deep) return `LCM(${a}, ${b}) = ${l}`;
            return `LCM(${a}, ${b}) = (${a} × ${b}) / GCD = ${a * b} / ${MathUtils.gcd(a, b)} = ${l}`;
        }

        m = q.match(/(\d+)\s*(?:mod|modulo)\s*(\d+)/i);
        if (m) {
            const a = parseInt(m[1]), b = parseInt(m[2]);
            if (b === 0) return `Cannot compute modulo 0.`;
            const result = ((a % b) + b) % b;
            if (!deep) return `${a} mod ${b} = ${result}`;
            return `${a} mod ${b}:\n${a} = ${Math.floor(a / b)} × ${b} + ${result}\n${a} ≡ ${result} (mod ${b})`;
        }

        m = q.match(/(?:euler.?s?\s+)?totient\s+(?:of\s+)?(\d+)|φ\((\d+)\)/i);
        if (m) {
            const n = parseInt(m[1] || m[2]), phi = MathUtils.totient(n);
            if (!deep) return `φ(${n}) = ${phi}`;
            const pf = MathUtils.primeFactors(n);
            return `Euler's totient φ(${n}):\nFormula: n × Π(1 - 1/p)\nPrime factors: ${pf.map(f => f.p).join(', ')}\nφ(${n}) = ${phi}`;
        }

        m = q.match(/(?:primes?|prime numbers?)\s+(?:up to|less than|below|under)\s+(\d+)/i);
        if (m) {
            const n = Math.min(parseInt(m[1]), 500);
            const primes = MathUtils.sieve(n);
            if (!deep) return `Primes up to ${n}: ${primes.join(', ')} (${primes.length} total)`;
            return `${primes.length} primes up to ${n} (Sieve of Eratosthenes):\n${primes.join(', ')}`;
        }

        m = q.match(/(\d+)(?:st|nd|rd|th)\s+prime|prime\s+number\s+(\d+)/i);
        if (m) {
            const target = parseInt(m[1] || m[2]);
            if (target > 1000) return `Finding the ${target}th prime requires a large sieve — beyond quick compute.`;
            let count = 0, n = 1;
            while (count < target) { n++; if (MathUtils.isPrime(n)) count++; }
            return `The ${target}th prime number is ${n}.`;
        }

        m = q.match(/bezout|extended.*gcd/i);
        if (m) {
            const nums = q.match(/\d+/g);
            if (nums?.length >= 2) {
                const a = parseInt(nums[0]), b = parseInt(nums[1]);
                const { g, x, y } = MathUtils.extGcd(a, b);
                return `Bezout's identity for ${a} and ${b}:\nGCD = ${g}\n${a}×(${x}) + ${b}×(${y}) = ${g}`;
            }
        }

        m = q.match(/fermat.?s?\s+little\s+theorem/i);
        if (m) {
            const nums = q.match(/\d+/g);
            if (nums?.length >= 2) {
                const a = parseInt(nums[0]), p = parseInt(nums[1]);
                if (MathUtils.isPrime(p)) {
                    const result = Math.pow(a, p - 1) % p;
                    return `Fermat's Little Theorem: a^(p-1) ≡ 1 (mod p)\n${a}^(${p}-1) ≡ ${result} (mod ${p})${result === 1 ? ' ✓' : ' — check inputs.'}`;
                }
                return `${p} is not prime, so Fermat's Little Theorem doesn't apply directly.`;
            }
        }

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §D  COMBINATORICS SOLVER
// ══════════════════════════════════════════════════════
const CombinatoricsSolver = (() => {
    function solve(q, deep) {
        let m;

        m = q.match(/(?:c\(|combinations?\s+of\s+|choose\s+)(\d+)(?:\s*,\s*|\s+(?:choose|from)\s+)(\d+)/i)
            || q.match(/(\d+)\s+choose\s+(\d+)/i) || q.match(/(\d+)C(\d+)/i);
        if (m) {
            const n = parseInt(m[1]), r = parseInt(m[2]), val = MathUtils.nCr(n, r);
            if (!deep) return `C(${n},${r}) = ${val}`;
            return `C(${n},${r}) = ${n}! / (${r}! × ${n - r}!) = ${val}`;
        }

        m = q.match(/(?:p\(|permutations?\s+of\s+)(\d+)(?:\s*,\s*|\s+(?:taking|from)\s+)(\d+)/i)
            || q.match(/(\d+)P(\d+)/i) || q.match(/(\d+)\s+permute\s+(\d+)/i);
        if (m) {
            const n = parseInt(m[1]), r = parseInt(m[2]), val = MathUtils.nPr(n, r);
            if (!deep) return `P(${n},${r}) = ${val}`;
            return `P(${n},${r}) = ${n}! / ${n - r}! = ${val}`;
        }

        m = q.match(/derangement\s+(?:of\s+)?(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            let D = 0;
            for (let k = 0; k <= n; k++) D += (k % 2 === 0 ? 1 : -1) / MathUtils.factorial(k);
            D = Math.round(MathUtils.factorial(n) * D);
            if (!deep) return `D(${n}) = ${D}`;
            return `Derangements of ${n} elements: D(${n}) = ${D}\nNo item appears in its original position.`;
        }

        m = q.match(/catalan\s+(?:number\s+)?(?:of\s+|for\s+)?(\d+)/i);
        if (m) {
            const n = parseInt(m[1]);
            if (n > 20) return `Catalan(${n}) is very large.`;
            const val = Math.round(MathUtils.nCr(2 * n, n) / (n + 1));
            if (!deep) return `Catalan(${n}) = ${val}`;
            return `Catalan(${n}) = C(${2 * n},${n}) / ${n + 1} = ${val}`;
        }

        m = q.match(/pascal.?s?\s+(?:triangle\s+)?row\s+(\d+)|row\s+(\d+)\s+of\s+pascal/i);
        if (m) {
            const n = parseInt(m[1] || m[2]);
            if (n > 20) return `Pascal's row ${n} — too wide. Use C(${n},k) for k=0..${n}.`;
            const row = Array.from({ length: n + 1 }, (_, k) => MathUtils.nCr(n, k));
            return `Pascal's Triangle Row ${n}: ${row.join('  ')}`;
        }

        m = q.match(/inclusion.?exclusion/i);
        if (m) {
            const nums = q.match(/\d+/g);
            if (nums?.length >= 3) {
                const [A, B, AandB] = nums.map(Number);
                return `Inclusion-Exclusion: |A ∪ B| = |A| + |B| - |A ∩ B| = ${A} + ${B} - ${AandB} = ${A + B - AandB}`;
            }
        }

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §E  STATISTICS SOLVER (Pro)
// ══════════════════════════════════════════════════════
const StatisticsSolverPro = (() => {
    function extractNums(q) {
        const m = q.match(/([\d\s,.-]+)/g);
        if (!m) return [];
        return m.join(' ').match(/-?\d+\.?\d*/g)?.map(Number).filter(isFinite) || [];
    }

    function solve(q, deep) {
        let m;
        const nums = extractNums(q);

        m = q.match(/(?:standard\s+deviation|std\s*dev)\s+(?:of\s+)?([\d\s,.]+)/i);
        if (m && nums.length >= 2) {
            const s = MathUtils.r6(MathUtils.stdDev(nums, false));
            if (!deep) return `Sample std dev of [${nums.join(', ')}] = ${s}`;
            const mu = MathUtils.r6(MathUtils.mean(nums));
            return `Std Dev of [${nums.join(', ')}]:\nMean = ${mu}\nSample s = ${s}`;
        }

        m = q.match(/variance\s+(?:of\s+)?([\d\s,.]+)/i);
        if (m && nums.length >= 2) {
            const v = MathUtils.r6(MathUtils.variance(nums, false));
            if (!deep) return `Sample variance of [${nums.join(', ')}] = ${v}`;
            return `Variance of [${nums.join(', ')}] = ${v}\nMean = ${MathUtils.r6(MathUtils.mean(nums))}`;
        }

        m = q.match(/probability\s+(?:of\s+)?(\d+)\s+(?:out\s+of|in|\/)\s+(\d+)/i);
        if (m) {
            const fav = parseInt(m[1]), tot = parseInt(m[2]);
            const p = MathUtils.r6(fav / tot);
            if (!deep) return `P(${fav}/${tot}) = ${p} = ${MathUtils.r4(p * 100)}%`;
            return `Probability = ${fav}/${tot} = ${p}\n= ${MathUtils.r4(p * 100)}%\nOdds: ${fav}:${tot - fav} in favour`;
        }

        m = q.match(/z.?score|standardis|standard score/i);
        if (m && nums.length >= 3) {
            const z = MathUtils.r6((nums[0] - nums[1]) / nums[2]);
            if (!deep) return `z = (${nums[0]} - ${nums[1]}) / ${nums[2]} = ${z}`;
            return `Z-score = (x-μ)/σ = (${nums[0]}-${nums[1]})/${nums[2]} = ${z}\n${Math.abs(z).toFixed(2)} standard deviations ${z >= 0 ? 'above' : 'below'} the mean.`;
        }

        m = q.match(/binomial.*probability|p\s*=\s*[\d.]+.*n\s*=\s*\d+.*k\s*=\s*\d+/i);
        if (m) {
            const nM = q.match(/n\s*=\s*(\d+)/i), kM = q.match(/k\s*=\s*(\d+)/i), pM = q.match(/p\s*=\s*([\d.]+)/i);
            if (nM && kM && pM) {
                const n = parseInt(nM[1]), k = parseInt(kM[1]), p = parseFloat(pM[1]);
                const prob = MathUtils.nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
                if (!deep) return `B(${n},${k},${p}) = ${MathUtils.r6(prob)}`;
                return `Binomial P(X=${k}): C(${n},${k}) × ${p}^${k} × ${1 - p}^${n - k}\n= ${MathUtils.r6(prob)}`;
            }
        }

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §F  LINEAR ALGEBRA SOLVER
// ══════════════════════════════════════════════════════
const LinearAlgebraSolver = (() => {
    function parseMatrix(str) {
        try {
            const rows = str.match(/\[([\d,.\s-]+)\]/g);
            if (!rows) return null;
            return rows.map(r => r.replace(/[\[\]]/g, '').split(',').map(Number));
        } catch { return null; }
    }
    function det2(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
    function det3(A) {
        return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1])
            - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
            + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    }
    function inv2(A) {
        const d = det2(A); if (Math.abs(d) < 1e-10) return null;
        return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]];
    }
    function matStr(A) { return A.map(row => '[' + row.map(v => MathUtils.r4(v)).join(', ') + ']').join('\n'); }

    function solve(q, deep) {
        let m;

        m = q.match(/determinant|det\s*\(/i);
        if (m) {
            const mat = parseMatrix(q);
            if (mat?.length === 2 && mat[0].length === 2) {
                const d = det2(mat);
                if (!deep) return `det = ${d}`;
                return `2×2 Determinant:\n(${mat[0][0]}×${mat[1][1]}) - (${mat[0][1]}×${mat[1][0]}) = ${d}`;
            }
            if (mat?.length === 3 && mat[0].length === 3) {
                const d = MathUtils.r(det3(mat));
                return `3×3 Determinant = ${d}`;
            }
        }

        m = q.match(/inverse.*matrix|matrix.*inverse|A\^{?-1}/i);
        if (m) {
            const mat = parseMatrix(q);
            if (mat?.length === 2 && mat[0].length === 2) {
                const d = det2(mat);
                if (Math.abs(d) < 1e-10) return `Matrix is singular (det = 0) — no inverse.`;
                const inv = inv2(mat);
                if (!deep) return `A⁻¹ =\n${matStr(inv)}`;
                return `2×2 Inverse:\ndet(A) = ${d}\nA⁻¹ =\n${matStr(inv)}`;
            }
        }

        m = q.match(/dot\s*product|scalar\s*product/i);
        if (m) {
            const nums = q.match(/-?\d+\.?\d*/g)?.map(Number);
            if (nums?.length >= 4 && nums.length % 2 === 0) {
                const half = nums.length / 2;
                const u = nums.slice(0, half), v = nums.slice(half);
                const dot = u.reduce((s, x, i) => s + x * v[i], 0);
                if (!deep) return `u · v = ${dot}`;
                return `Dot product:\n${u.map((x, i) => `${x}×${v[i]}`).join(' + ')} = ${dot}`;
            }
        }

        m = q.match(/cross\s*product|vector\s*product/i);
        if (m) {
            const nums = q.match(/-?\d+\.?\d*/g)?.map(Number);
            if (nums?.length >= 6) {
                const [a1, a2, a3, b1, b2, b3] = nums;
                const cx = a2 * b3 - a3 * b2, cy = a3 * b1 - a1 * b3, cz = a1 * b2 - a2 * b1;
                if (!deep) return `u × v = (${cx}, ${cy}, ${cz})`;
                return `Cross product:\ni: ${a2}×${b3}-${a3}×${b2}=${cx}\nj: ${a3}×${b1}-${a1}×${b3}=${cy}\nk: ${a1}×${b2}-${a2}×${b1}=${cz}\nu × v = (${cx}, ${cy}, ${cz})`;
            }
        }

        m = q.match(/eigenvalue|eigenvector/i);
        if (m) {
            const mat = parseMatrix(q);
            if (mat?.length === 2 && mat[0].length === 2) {
                const [a, b, c, d] = [mat[0][0], mat[0][1], mat[1][0], mat[1][1]];
                const trace = a + d, det = a * d - b * c, disc = trace * trace - 4 * det;
                if (disc < 0) return `Complex eigenvalues: λ = (${trace} ± √${disc}) / 2`;
                const l1 = MathUtils.r6((trace + Math.sqrt(disc)) / 2);
                const l2 = MathUtils.r6((trace - Math.sqrt(disc)) / 2);
                if (!deep) return `λ₁ = ${l1}, λ₂ = ${l2}`;
                return `Eigenvalues: λ² - ${trace}λ + ${det} = 0\nλ₁ = ${l1}, λ₂ = ${l2}`;
            }
        }

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §G  CALCULUS SOLVER (Pro)
// ══════════════════════════════════════════════════════
const CalculusSolverPro = (() => {
    function solve(q, deep) {
        let m;

        m = q.match(/chain\s*rule|derivative.*of.*(?:sin|cos|tan|e\^|ln)\s*\(/i);
        if (m) {
            const sinM = q.match(/derivative.*of\s+sin\s*\(([^)]+)\)/i);
            if (sinM) return `Chain Rule: d/dx[sin(${sinM[1]})] = cos(${sinM[1]}) × d/dx[${sinM[1]}]`;
            const cosM = q.match(/derivative.*of\s+cos\s*\(([^)]+)\)/i);
            if (cosM) return `d/dx[cos(${cosM[1]})] = -sin(${cosM[1]}) × d/dx[${cosM[1]}]`;
            const expM = q.match(/derivative.*of\s+e\^([a-z0-9^*]+)/i);
            if (expM) return `d/dx[e^${expM[1]}] = e^${expM[1]} × d/dx[${expM[1]}]`;
        }

        m = q.match(/product\s*rule/i);
        if (m) {
            return `Product Rule: d/dx[u·v] = u'v + uv'\nProvide specific functions u and v for a worked example.`;
        }

        m = q.match(/quotient\s*rule/i);
        if (m) return `Quotient Rule: d/dx[u/v] = (u'v - uv') / v²`;

        m = q.match(/l.?h.?pital|l'hopital/i);
        if (m) return `L'Hôpital's Rule: When lim gives 0/0 or ∞/∞, differentiate numerator and denominator separately, then evaluate.`;

        m = q.match(/taylor|maclaurin/i);
        if (m) {
            if (q.match(/e\^x|exp\s*\(x\)/i)) return `eˣ = 1 + x + x²/2! + x³/3! + ... = Σ xⁿ/n! (radius ∞)`;
            if (q.match(/sin\s*\(?x\)?/i)) return `sin(x) = x - x³/3! + x⁵/5! - ... = Σ (-1)ⁿx^(2n+1)/(2n+1)! (radius ∞)`;
            if (q.match(/cos\s*\(?x\)?/i)) return `cos(x) = 1 - x²/2! + x⁴/4! - ... = Σ (-1)ⁿx^(2n)/(2n)! (radius ∞)`;
            if (q.match(/ln\s*\(1\+x\)/i)) return `ln(1+x) = x - x²/2 + x³/3 - ... (radius -1 < x ≤ 1)`;
        }

        m = q.match(/(?:definite\s+)?integral.*\[(\d+),\s*(\d+)\]|(?:integrate|integral)\s+x\^(\d+)\s+from\s+(\d+)\s+to\s+(\d+)/i);
        if (m) {
            const powerM = q.match(/x\^(\d+)/i);
            if (powerM) {
                let n, lower, upper;
                if (q.match(/from.*to/i)) { n = parseInt(m[3]); lower = parseInt(m[4]); upper = parseInt(m[5]); }
                else { n = parseInt(powerM[1]); lower = parseInt(m[1]); upper = parseInt(m[2]); }
                if (!isNaN(n) && !isNaN(lower) && !isNaN(upper)) {
                    const Fup = Math.pow(upper, n + 1) / (n + 1);
                    const Flo = Math.pow(lower, n + 1) / (n + 1);
                    const res = MathUtils.r6(Fup - Flo);
                    if (!deep) return `∫[${lower},${upper}] x^${n} dx = ${res}`;
                    return `∫[${lower},${upper}] x^${n} dx:\nAntiderivative: x^${n + 1}/${n + 1}\nF(${upper}) = ${MathUtils.r6(Fup)}, F(${lower}) = ${MathUtils.r6(Flo)}\nResult = ${res}`;
                }
            }
        }

        m = q.match(/\blimit\b.*x\s*(?:->|→|approaches?)\s*(\d+|infinity|inf|∞)/i);
        if (m) {
            const to = m[1].toLowerCase();
            const polyM = q.match(/x\^(\d+)/i);
            if (polyM && !['infinity', 'inf', '∞'].includes(to)) {
                const n = parseInt(polyM[1]), x = parseFloat(to);
                const val = Math.pow(x, n);
                if (!deep) return `lim(x→${to}) x^${n} = ${val}`;
                return `lim(x→${to}) x^${n}: substitute x = ${to} → ${val}`;
            }
            if (['infinity', 'inf', '∞'].includes(to)) return `As x → ∞: compare leading degrees of numerator vs denominator for rational functions.`;
        }

        m = q.match(/partial\s+derivative|∂/i);
        if (m) {
            const polyM = q.match(/x\^(\d+)\s*y\^(\d+)/i);
            if (polyM) {
                const nx = parseInt(polyM[1]), ny = parseInt(polyM[2]);
                const fx = q.match(/with\s+respect\s+to\s+x|∂.*∂x/i);
                const fy = q.match(/with\s+respect\s+to\s+y|∂.*∂y/i);
                if (fx) return `∂/∂x [x^${nx}y^${ny}] = ${nx}x^${nx - 1}y^${ny}`;
                if (fy) return `∂/∂y [x^${nx}y^${ny}] = ${ny}x^${nx}y^${ny - 1}`;
                return `∂/∂x [x^${nx}y^${ny}] = ${nx}x^${nx - 1}y^${ny}\n∂/∂y [x^${nx}y^${ny}] = ${ny}x^${nx}y^${ny - 1}`;
            }
        }

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §H  GEOMETRY SOLVER (Pro)
// ══════════════════════════════════════════════════════
const GeometrySolverPro = (() => {
    const PI = Math.PI, rr = MathUtils.r4;
    function solve(q, deep) {
        const nums = q.match(/-?\d+\.?\d*/g)?.map(Number) || [];
        const n = i => nums[i] ?? 0;
        let m;

        if (q.match(/circle/i)) {
            const rad = q.match(/radius\s*(?:of|=|is)?\s*([\d.]+)/i);
            const dia = q.match(/diameter\s*(?:of|=|is)?\s*([\d.]+)/i);
            let R = rad ? parseFloat(rad[1]) : dia ? parseFloat(dia[1]) / 2 : n(0);
            if (R > 0) {
                const area = rr(PI * R * R), circ = rr(2 * PI * R);
                if (!deep) return `Circle r=${R}: Area=${area}, Circumference=${circ}`;
                return `Circle (r=${R}):\nArea = πr² = ${area}\nCircumference = 2πr = ${circ}\nDiameter = ${2 * R}`;
            }
        }

        m = q.match(/(?:area|heron).*triangle.*sides?/i);
        if (m && nums.length >= 3) {
            const [a, b, c] = [n(0), n(1), n(2)];
            if (a + b > c && a + c > b && b + c > a) {
                const s = (a + b + c) / 2;
                const area = rr(Math.sqrt(s * (s - a) * (s - b) * (s - c)));
                if (!deep) return `Triangle area (Heron's, sides ${a},${b},${c}) = ${area}`;
                return `Heron's formula: s=(${a}+${b}+${c})/2=${s}\nArea = √[s(s-a)(s-b)(s-c)] = ${area}`;
            }
        }

        m = q.match(/area.*triangle|triangle.*area/i);
        if (m && !q.match(/sides?|heron/i) && nums.length >= 2) {
            const area = rr(0.5 * n(0) * n(1));
            if (!deep) return `Triangle area = ½ × ${n(0)} × ${n(1)} = ${area}`;
            return `Area = ½ × base × height = ½ × ${n(0)} × ${n(1)} = ${area}`;
        }

        m = q.match(/pythag|hypotenuse|right.*triangle/i);
        if (m && nums.length >= 2) {
            if (q.match(/hypotenuse|find.*c\b/i)) {
                const c = rr(Math.sqrt(n(0) ** 2 + n(1) ** 2));
                if (!deep) return `c = √(${n(0)}²+${n(1)}²) = ${c}`;
                return `c² = ${n(0)}² + ${n(1)}² = ${n(0) ** 2 + n(1) ** 2}\nc = ${c}`;
            }
            if (q.match(/leg|missing.*side/i)) {
                const leg = rr(Math.sqrt(n(0) ** 2 - n(1) ** 2));
                return `Missing leg = √(${n(0)}²-${n(1)}²) = ${leg}`;
            }
            const [a, b, c] = [...nums].sort((x, y) => x - y);
            const isRight = Math.abs(a ** 2 + b ** 2 - c ** 2) < 0.001;
            return `${isRight ? 'Yes, it IS a right triangle' : 'Not a right triangle'}. Check: ${a}²+${b}²=${a ** 2 + b ** 2}, c²=${c ** 2}.`;
        }

        m = q.match(/rectangle/i);
        if (m && nums.length >= 2) {
            const area = rr(n(0) * n(1)), perim = rr(2 * (n(0) + n(1))), diag = rr(Math.sqrt(n(0) ** 2 + n(1) ** 2));
            if (!deep) return `Rectangle ${n(0)}×${n(1)}: Area=${area}, Perimeter=${perim}`;
            return `Rectangle (${n(0)}×${n(1)}):\nArea=${area}, Perimeter=${perim}, Diagonal=${diag}`;
        }

        m = q.match(/sphere/i);
        if (m && nums.length >= 1) {
            const R = n(0), vol = rr(4 / 3 * PI * R ** 3), sa = rr(4 * PI * R ** 2);
            if (!deep) return `Sphere r=${R}: Volume=${vol}, Surface Area=${sa}`;
            return `Sphere (r=${R}):\nVolume = (4/3)πr³ = ${vol}\nSurface Area = 4πr² = ${sa}`;
        }

        m = q.match(/cylinder/i);
        if (m && nums.length >= 2) {
            const [rC, h] = [n(0), n(1)], vol = rr(PI * rC ** 2 * h), sa = rr(2 * PI * rC * (rC + h));
            if (!deep) return `Cylinder r=${rC} h=${h}: Volume=${vol}, Surface Area=${sa}`;
            return `Cylinder (r=${rC}, h=${h}):\nVolume = πr²h = ${vol}\nSA = 2πr(r+h) = ${sa}`;
        }

        m = q.match(/cone/i);
        if (m && nums.length >= 2) {
            const [rCo, h] = [n(0), n(1)], l = rr(Math.sqrt(rCo ** 2 + h ** 2));
            const vol = rr(PI * rCo ** 2 * h / 3), sa = rr(PI * rCo * (rCo + l));
            if (!deep) return `Cone r=${rCo} h=${h}: Volume=${vol}, Slant=${l}`;
            return `Cone (r=${rCo}, h=${h}):\nSlant = √(r²+h²) = ${l}\nVolume = (1/3)πr²h = ${vol}\nSA = πr(r+l) = ${sa}`;
        }

        m = q.match(/law\s+of\s+(sines?|cosines?)/i);
        if (m) {
            const which = m[1].toLowerCase();
            if (which.startsWith('sine') && nums.length >= 4) {
                const [a, A, B] = [n(0), n(1) * PI / 180, n(2) * PI / 180];
                const b = rr(a * Math.sin(B) / Math.sin(A));
                return `Law of Sines: b = a×sin(B)/sin(A) = ${n(0)}×sin(${Math.round(n(2))}°)/sin(${Math.round(n(1))}°) = ${b}`;
            }
            if (which.startsWith('cos') && nums.length >= 3) {
                const [a, b, C] = [n(0), n(1), n(2) * PI / 180];
                const c = rr(Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(C)));
                return `Law of Cosines: c = √(${n(0)}²+${n(1)}²-2×${n(0)}×${n(1)}×cos(${Math.round(n(2))}°)) = ${c}`;
            }
            if (which.startsWith('sine')) return `Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)`;
            return `Law of Cosines: c² = a² + b² - 2ab·cos(C)`;
        }

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §I  SEQUENCES & SERIES SOLVER (Pro)
// ══════════════════════════════════════════════════════
const SequencesSolverPro = (() => {
    function solve(q, deep) {
        const nums = q.match(/-?\d+\.?\d*/g)?.map(Number) || [];
        const n = i => nums[i] ?? 0;
        let m;

        m = q.match(/arithmetic\s+(?:sequence|series|progression|sum)/i);
        if (m && nums.length >= 2) {
            const a = n(0), d = n(1), nVal = nums[2] ? n(2) : null;
            if (nVal) {
                const nth = a + (nVal - 1) * d;
                const sum = (nVal / 2) * (2 * a + (nVal - 1) * d);
                if (!deep) return `AP: a${nVal}=${nth}, S${nVal}=${sum}`;
                return `Arithmetic Progression (a=${a}, d=${d}, n=${nVal}):\naₙ = a+(n-1)d = ${nth}\nSₙ = n/2×(2a+(n-1)d) = ${sum}`;
            }
            return `AP (a=${a}, d=${d}): aₙ = ${a}+(n-1)×${d}`;
        }

        m = q.match(/geometric\s+(?:sequence|series|progression|sum)/i);
        if (m && nums.length >= 2) {
            const a = n(0), r = n(1), nVal = nums[2] ? n(2) : null;
            if (nVal) {
                const nth = MathUtils.r6(a * Math.pow(r, nVal - 1));
                const sum = Math.abs(r) === 1 ? a * nVal : MathUtils.r6(a * (Math.pow(r, nVal) - 1) / (r - 1));
                if (!deep) return `GP: a${nVal}=${nth}, S${nVal}=${sum}`;
                return `Geometric Progression (a=${a}, r=${r}, n=${nVal}):\naₙ=${nth}, Sₙ=${sum}`;
            }
            if (Math.abs(r) < 1) return `GP (a=${a}, r=${r}): Sum to infinity = ${MathUtils.r6(a / (1 - r))}`;
            return `GP (a=${a}, r=${r}): aₙ = ${a}×${r}^(n-1)`;
        }

        m = q.match(/sum.*first\s+(\d+)\s+(?:natural|positive)\s+(?:numbers?|integers?)/i);
        if (m) {
            const nVal = parseInt(m[1]);
            const sum = nVal * (nVal + 1) / 2;
            if (!deep) return `Σk (k=1 to ${nVal}) = ${sum}`;
            return `Sum of first ${nVal} natural numbers = n(n+1)/2 = ${nVal}×${nVal + 1}/2 = ${sum}`;
        }

        m = q.match(/sum.*(?:of\s+)?squares/i);
        if (m && nums.length >= 1) {
            const nVal = n(0), sum = nVal * (nVal + 1) * (2 * nVal + 1) / 6;
            if (!deep) return `Σk² (k=1 to ${nVal}) = ${sum}`;
            return `Sum of squares = n(n+1)(2n+1)/6 = ${nVal}×${nVal + 1}×${2 * nVal + 1}/6 = ${sum}`;
        }

        m = q.match(/sum.*cubes?/i);
        if (m && nums.length >= 1) {
            const nVal = n(0), sum = Math.pow(nVal * (nVal + 1) / 2, 2);
            if (!deep) return `Σk³ (k=1 to ${nVal}) = ${sum}`;
            return `Sum of cubes = [n(n+1)/2]² = ${sum}`;
        }

        m = q.match(/fibonacci\s+(?:sequence|number|term)?\s*(?:of\s+|n\s*=\s*)?(\d+)/i)
            || q.match(/(\d+)(?:st|nd|rd|th)\s+fibonacci/i);
        if (m) {
            const nVal = parseInt(m[1]);
            if (nVal > 0 && nVal <= 78) {
                const fib = MathUtils.fibonacci(nVal);
                if (!deep) return `F(${nVal}) = ${fib}`;
                const terms = Array.from({ length: Math.min(nVal, 12) }, (_, i) => MathUtils.fibonacci(i + 1));
                return `Fibonacci F(${nVal}) = ${fib}\nSequence: ${terms.join(', ')}${nVal > 12 ? '...' : ''}`;
            }
        }

        m = q.match(/(?:convert|express)\s+(\d+)\s+(?:to|in)\s+(binary|octal|hexadecimal|base\s*\d+)/i);
        if (m) {
            const num = parseInt(m[1]), target = m[2].toLowerCase();
            if (target === 'binary') return `${num} in binary = ${MathUtils.toBase(num, 2)}`;
            if (target === 'octal') return `${num} in octal = ${MathUtils.toBase(num, 8)}`;
            if (target === 'hexadecimal') return `${num} in hexadecimal = ${MathUtils.toBase(num, 16)}`;
            const bM = m[2].match(/\d+/);
            if (bM) return `${num} in base ${bM[0]} = ${MathUtils.toBase(num, parseInt(bM[0]))}`;
        }

        m = q.match(/([01]+)\s+(?:from\s+)?binary\s+(?:to\s+)?decimal|binary\s+([01]+)/i);
        if (m) return `Binary ${m[1] || m[2]} = ${MathUtils.fromBase(m[1] || m[2], 2)} (decimal)`;

        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §J  OLYMPIAD SOLVER
// ══════════════════════════════════════════════════════
const OlympiadSolver = (() => {
    const PATTERNS = [
        {
            match: /prove\s+that\s+the\s+sum\s+of.*consecutive\s+odd/i,
            solve: (q, deep) => {
                const m = q.match(/(\d+)\s+consecutive/i);
                const n = m ? parseInt(m[1]) : null;
                if (!deep) return n ? `Sum of first ${n} odd numbers = n² = ${n * n}` : `Sum of first n odd numbers = n².`;
                return `Proof by induction: Sum of first n odd numbers = n²\nBase: 1 = 1² ✓\nInductive step: k² + (2(k+1)-1) = k² + 2k + 1 = (k+1)² ✓`;
            }
        },
        {
            match: /prove.*n\^2.*even|if\s+n\^2\s+is\s+even/i,
            solve: () => `Proof (contrapositive): If n is odd, n=(2k+1).\nn² = (2k+1)² = 4k²+4k+1 = 2(2k²+2k)+1 — odd.\nSo if n² is even, n must be even. ∎`
        },
        {
            match: /prove.*sqrt\s*2\s*is\s*irrational|√2\s*is\s*irrational/i,
            solve: () => `Proof by contradiction: Assume √2 = p/q (lowest terms).\np² = 2q² → p even → p=2m → 4m²=2q² → q even → gcd(p,q)≥2. Contradiction. ∎`
        },
        {
            match: /prove.*infinitely many primes/i,
            solve: () => `Euclid's proof: Assume finite primes p₁...pₙ. N = p₁×...×pₙ+1 is not divisible by any pᵢ → new prime exists. Contradiction. ∎`
        },
        {
            match: /sum.*digits.*divisible.*9|divisibility.*9/i,
            solve: () => `Divisibility by 9: 10ᵏ ≡ 1 (mod 9) for all k, so N ≡ digit sum (mod 9). ∎`
        },
        {
            match: /am.?gm|arithmetic.*geometric.*mean.*inequality/i,
            solve: (q) => {
                const nums = q.match(/\d+\.?\d*/g)?.map(Number);
                if (nums?.length >= 2) {
                    const am = MathUtils.r6(MathUtils.mean(nums));
                    const gm = MathUtils.r6(nums.reduce((p, x) => p * x, 1) ** (1 / nums.length));
                    return `AM-GM for [${nums.join(', ')}]:\nAM = ${am}, GM = ${gm}\nAM ≥ GM: ${am} ≥ ${gm} ${am >= gm - 1e-9 ? '✓' : '✗'}`;
                }
                return `AM-GM: (a₁+...+aₙ)/n ≥ (a₁·...·aₙ)^(1/n). Equality iff all values equal.`;
            }
        },
        {
            match: /cauchy.?schwarz/i,
            solve: () => `Cauchy-Schwarz: (Σaᵢbᵢ)² ≤ (Σaᵢ²)(Σbᵢ²). Equality iff aᵢ/bᵢ = constant.`
        },
        {
            match: /pigeonhole\s+principle/i,
            solve: (q) => {
                const nums = q.match(/\d+/g)?.map(Number);
                if (nums?.length >= 2) {
                    return `Pigeonhole: ${nums[0]} items in ${nums[1]} boxes → some box has ≥ ⌈${nums[0]}/${nums[1]}⌉ = ${Math.ceil(nums[0] / nums[1])} items.`;
                }
                return `Pigeonhole Principle: n+1 items in n containers → at least one has ≥2. Generalised: k×n+1 items → some container has ≥k+1.`;
            }
        }
    ];

    function solve(q, deep) {
        for (const pat of PATTERNS) {
            if (pat.match.test(q)) return pat.solve(q, deep);
        }
        if (q.match(/prove|show that|for all|there exists/i)) {
            if (q.match(/induction/i)) return `Proof by Induction:\n1. Base case: verify P(1)\n2. Assume P(k) true\n3. Prove P(k) → P(k+1)\n4. Conclude for all n ∈ ℕ`;
            if (q.match(/contradiction/i)) return `Proof by Contradiction:\n1. Assume negation of what you want to prove\n2. Derive a logical contradiction\n3. Conclude original statement is true`;
            if (q.match(/contrapositive/i)) return `Proof by Contrapositive:\nTo prove "P → Q", prove "¬Q → ¬P". They are logically equivalent.`;
        }
        return null;
    }
    return { solve };
})();

// ══════════════════════════════════════════════════════
//  §K  MATH PRO MASTER SOLVER
//      Orchestrates all advanced solvers
// ══════════════════════════════════════════════════════
const MathPro = (() => {
    const MATH_PRO_PATTERN = /\b(prime|factor|gcd|lcm|hcf|fibonacci|combination|permutation|choose|nCr|nPr|statistic|std dev|standard deviation|variance|median|mode|determinant|eigenvalue|matrix|vector|dot product|cross product|integral.*\[|derivative.*sin|derivative.*cos|chain rule|product rule|l.?h.?pital|taylor|maclaurin|binomial.*n=|pascal|derangement|catalan|arithmetic sequence|geometric sequence|sum of squares|sum of cubes|pythagor|heron|sphere|cylinder|cone|circle area|law of sines|law of cosines|prove|proof|olympiad|induction|contradiction|am.?gm|cauchy|pigeonhole|modulo|bezout|totient|sieve|binary|hexadecimal|base conversion|z.?score|correlation|binomial probability|eigenvalue)\b/i;

    function solve(question) {
        const q = question.trim();
        if (!q) return null;
        const { deepMode } = MathModeDetector.detect(q);

        let answer = null;

        answer = OlympiadSolver.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'olympiad' };

        answer = NumberTheorySolver.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'numberTheory' };

        answer = CombinatoricsSolver.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'combinatorics' };

        answer = LinearAlgebraSolver.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'linearAlgebra' };

        answer = CalculusSolverPro.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'calculus' };

        answer = GeometrySolverPro.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'geometry' };

        answer = StatisticsSolverPro.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'statistics' };

        answer = SequencesSolverPro.solve(q, deepMode);
        if (answer) return { answer, mode: deepMode ? 'deep' : 'fast', domain: 'sequences' };

        // Fall through to base MathEngine
        const existingResult = MathEngine.solveWithSteps(q);
        if (existingResult) {
            const finalAnswer = deepMode && existingResult.steps?.length
                ? `${existingResult.steps.join(' → ')}\nAnswer: ${existingResult.answer}`
                : existingResult.answer;
            return { answer: finalAnswer, mode: deepMode ? 'deep' : 'fast', domain: 'arithmetic' };
        }

        return null;
    }

    function isMathProQuestion(q) {
        return MATH_PRO_PATTERN.test(q);
    }

    return { solve, isMathProQuestion };
})();

// ══════════════════════════════════════════════════════
//  ⓫  JOKES & COMPLIMENTS
// ══════════════════════════════════════════════════════
const JOKES_LIST = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the math book look so sad? Too many problems.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "I asked my AI for dating advice. It said my error rate is too high.",
    "Why don't footballers use computers? Because they're afraid of the net!",
    "What do Harry Kane and a clock have in common? They both hit the top corner!",
    "Why was the football pitch wet? Because the players kept dribbling!",
    "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
    "What do you call a sleeping dinosaur? A dino-snore!",
    "Why can't you trust a ladder? It's always up to something.",
    "I asked Siri why I'm single. She opened the front-facing camera.",
    "I'm reading a book about anti-gravity. It's impossible to put down.",
    "Did you hear about the mathematician afraid of negative numbers? He'll stop at nothing to avoid them.",
    "My WiFi went down for five minutes so I had to talk to my family. They seem nice."
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
//  ⓱  MAIN AI PROCESSOR
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

    const userFact = Memory.detectUserFact(q);
    if (userFact) { finalize(q, userFact); return; }

    const mood = EmotionEngine.detect(q);
    Memory.setMood(mood);
    Memory.push('user', q);

    let answer = null;

    // ── 1. ROAST / JOKES / COMPLIMENTS ──
    if (q.match(/roast me|ultra roast|destroy me|rip me|insult me|roast.*mode/i)) {
        const context = q.match(/football|soccer/) ? 'football' : q.match(/math|maths|physics/) ? 'math' : 'general';
        const roast = q.match(/ultra|max|extreme|full/) ? RoastEngine.getCombo() : RoastEngine.get(context);
        finalize(q, roast, 'savage'); return;
    }
    if (q.match(/tell.*joke|joke\b|make me laugh/i)) { finalize(q, pickJoke(), 'playful'); return; }
    if (q.match(/compliment me|say.*nice|cheer me up/i)) { finalize(q, pickCompliment(), 'happy'); return; }

    // ── 2. TIMER ──
    answer = TimerEngine.set(q);
    if (answer) { finalize(q, answer, 'happy'); return; }
    if (q.match(/how many timers|active timers/i)) { finalize(q, TimerEngine.list()); return; }

    // ── 3. MUSIC ──
    if (q.match(/play (music|songs?|something|a song)\b/i)) {
        MusicPlayer.play(0); finalize(q, `Playing "${SONGS[0].t}" by ${SONGS[0].a}. Enjoy!`); return;
    }
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

    // ── 6. MATHS PRO (extended solvers first) ──
    const isDeepMath = MathPro.isMathProQuestion(q) || q.match(/\d|\bmath|calculate|compute|solve|equation|algebra|calculus|trigonometry|derivative|integral|factorial|sqrt|square root|percentage|prime|factor|gcd|lcm|matrix|vector|combination|permutation|fibonacci|statistics|std dev|variance|median|mode|probability/i);

    if (isDeepMath) {
        const proResult = MathPro.solve(q);
        if (proResult) {
            const { deepMode } = MathModeDetector.detect(q);
            Memory.push('assistant', proResult.answer);
            Memory.setMood('thinking');
            UI.showThinking(false);
            UI.showTx(q, proResult.answer.replace(/\n/g, '<br>'));
            TTS.speak(proResult.answer, 'thinking');
            UI.setLogo('idle');
            return;
        }
        // Fallback to base engine
        const result = MathEngine.solveWithSteps(q);
        if (result) {
            const { deepMode } = MathModeDetector.detect(q);
            const stepStr = deepMode && result.steps?.length
                ? `Steps: ${result.steps.join(' → ')}. Answer: ${result.answer}`
                : result.answer;
            finalize(q, stepStr, 'thinking'); return;
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
    const fallback = `${user ? `Sorry ${user}` : "I'm not sure"} about that. I can help with football, maths (including number theory, calculus, statistics, linear algebra), physics, science, history, geography, music, timers, unit conversions, jokes and roasts. Try "what can you do" for the full list!`;
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
//  ⓲  VOICE RECOGNITION ENGINE
// ══════════════════════════════════════════════════════
const VoiceRecog = (() => {
    let wake = null, chat = null;
    let chatActive = false, wakeActive = false;
    let finalText = '';

    function stopAll() {
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
        wake.maxAlternatives = 3;
        wakeActive = true;

        wake.onresult = (e) => {
            let txt = '';
            for (let i = e.resultIndex; i < e.results.length; i++)
                for (let a = 0; a < e.results[i].length; a++)
                    txt += e.results[i][a].transcript.toLowerCase() + ' ';
            if (/\bbingo\b/.test(txt)) {
                stopAll(); UI.flashWake(); UI.setLogo('listening');
                UI.setStatus('Hey! Listening…', ''); UI.waveOn(true);
                if (isMobile && navigator.vibrate) navigator.vibrate(100);
                setTimeout(() => startChat(), 350);
            }
        };
        wake.onerror = (e) => { wakeActive = false; if (e.error !== 'aborted') setTimeout(() => startWake(), 2000); };
        wake.onend = () => { wakeActive = false; if (!chatActive) setTimeout(() => startWake(), 1200); };
        try { wake.start(); } catch (e) { wakeActive = false; setTimeout(() => startWake(), 2500); }
    }

    function startChat() {
        if (chatActive) return;
        stopAll();
        MusicPlayer.setVol(0.4);
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { TTS.speak("Voice input requires Chrome or Edge. Please type your question."); return; }
        chat = new SR();
        chat.continuous = false;
        chat.interimResults = true;
        chat.lang = BINGO_CONFIG.defaultLang;
        chat.maxAlternatives = 3;
        chatActive = true;
        finalText = '';
        UI.setLogo('listening'); UI.waveOn(true);
        UI.setStatus('Listening…', 'Speak your question');

        chat.onresult = (e) => {
            let final = '', interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) final += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            if (final) finalText = final.trim();
            if (interim) UI.setStatus('Listening…', interim);
        };
        chat.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') UI.toast('Mic error: ' + e.error); chatActive = false; };
        chat.onend = () => {
            chatActive = false; chat = null;
            MusicPlayer.setVol(0.8);
            if (finalText) { processInput(finalText); finalText = ''; }
            else {
                UI.setLogo('idle'); UI.waveOn(false);
                UI.setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
                setTimeout(() => startWake(), 600);
            }
        };
        try { chat.start(); } catch (e) { chatActive = false; UI.toast('Tap to try again'); setTimeout(() => startWake(), 1000); }
    }

    return { startWake, startChat, stopAll, get chatActive() { return chatActive; } };
})();

// ══════════════════════════════════════════════════════
//  ⓴  LIVE SCORE AUTO-REFRESH
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
            if (e.key === 'Enter' && inp.value.trim()) {
                processInput(inp.value.trim());
                inp.value = '';
            }
        });
    }
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn && inp) {
        sendBtn.addEventListener('click', () => {
            if (inp.value.trim()) { processInput(inp.value.trim()); inp.value = ''; }
        });
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    startLiveRefresh();

    setTimeout(() => {
        TTS.speak(`Hello! I'm Bingo Version 3.5 — your advanced AI assistant by Protogen AI. I now come as a single unified file combining the core intelligence engine with full mathematical reasoning. Football, maths from arithmetic to olympiad level, physics, science, history, music, web search and more. Say Bingo or tap to activate. Let's go!`, 'happy');
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
// Math Pro exports
window.MathPro = MathPro;
window.MathUtils = MathUtils;
window.NumberTheorySolver = NumberTheorySolver;
window.CombinatoricsSolver = CombinatoricsSolver;
window.LinearAlgebraSolver = LinearAlgebraSolver;
window.OlympiadSolver = OlympiadSolver;

console.log('%c[Bingo V3.5] Unified Intelligence Core loaded — Single-file fusion of Core + MathPro Extension.', 'color:#8b5cf6; font-weight:bold; font-size:13px;');
console.log('%c  Creator: Martin Lutherking Owino | Protogen AI / HECO AFRICA | Version 3.5.0', 'color:#0ea5e9; font-size:11px;');

