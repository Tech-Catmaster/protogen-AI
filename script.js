// ═══════════════════════════════════════════════════════════════════════════
// PROTOGEN AI — BINGO V4.0 — ADVANCED INTELLIGENCE CORE
// Creator  : Martin Lutherking Owino — CEO, Protogen AI / HECO AFRICA
// Version  : 4.0.0  |  Architecture: Modular Intelligence Engine
// ═══════════════════════════════════════════════════════════════════════════
'use strict';

// ══════════════════════════════════════════════════════
//  ❶  CONSTANTS & CONFIGURATION
// ══════════════════════════════════════════════════════
const BINGO_CONFIG = {
    wakeWord: 'bingo',
    version: '4.0.0',
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
    function apply(text, stateName) {
        const state = states[stateName] || states.neutral;
        const prefix = state.prefixes[Math.floor(Math.random() * state.prefixes.length)];
        return prefix + text;
    }

    return { detect, get, apply, states };
})();

// ══════════════════════════════════════════════════════
//  ❹  SAVAGE ROAST ENGINE V4 — ULTRA MODE
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
    const CORS = 'https://corsproxy.io/?';
    const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
    const WIKI_SEARCH = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=3&srsearch=';
    const DDG_API = 'https://api.duckduckgo.com/?format=json&no_html=1&skip_disambig=1&q=';

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

    async function fetchText(url, timeout = BINGO_CONFIG.apiTimeout) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), timeout);
            const r = await fetch(url, { signal: ctrl.signal });
            clearTimeout(timer);
            if (!r.ok) return null;
            return await r.text();
        } catch { return null; }
    }

    async function wikipedia(query) {
        // Try direct summary first
        const slug = encodeURIComponent(query.replace(/\s+/g, '_'));
        let data = await fetchSafe(`${WIKI_API}${slug}`);
        if (data && data.extract && data.type !== 'disambiguation') {
            return {
                title: data.title,
                summary: data.extract.substring(0, 500),
                url: data.content_urls?.desktop?.page || ''
            };
        }
        // Fall back to search
        const search = await fetchSafe(`${WIKI_SEARCH}${encodeURIComponent(query)}`);
        if (search?.query?.search?.length) {
            const top = search.query.search[0];
            const slug2 = encodeURIComponent(top.title.replace(/\s+/g, '_'));
            const detail = await fetchSafe(`${WIKI_API}${slug2}`);
            if (detail?.extract) {
                return {
                    title: detail.title,
                    summary: detail.extract.substring(0, 500),
                    url: detail.content_urls?.desktop?.page || ''
                };
            }
        }
        return null;
    }

    async function duckduckgo(query) {
        const data = await fetchSafe(`${DDG_API}${encodeURIComponent(query)}`);
        if (!data) return null;
        // AbstractText is the rich answer
        if (data.AbstractText && data.AbstractText.length > 30) {
            return { answer: data.AbstractText, source: data.AbstractSource || 'DuckDuckGo' };
        }
        // Instant answer
        if (data.Answer && data.Answer.length > 5) {
            return { answer: data.Answer, source: 'DuckDuckGo Instant' };
        }
        // Related topics
        if (data.RelatedTopics?.length) {
            const relevant = data.RelatedTopics.filter(t => t.Text).slice(0, 2).map(t => t.Text).join('. ');
            if (relevant.length > 20) return { answer: relevant, source: 'DuckDuckGo' };
        }
        return null;
    }

    // Football-specific: Open-Football JSON datasets & TheSportsDB
    const SPORTSDB = 'https://www.thesportsdb.com/api/v1/json/3';

    async function liveScores() {
        const today = new Date().toISOString().split('T')[0];
        const data = await fetchSafe(`${SPORTSDB}/eventsday.php?d=${today}&s=Soccer`);
        if (data?.events?.length) return data.events;
        return null;
    }

    async function teamFixtures(teamId) {
        const data = await fetchSafe(`${SPORTSDB}/eventsnext.php?id=${teamId}`);
        return data?.events || null;
    }

    async function teamResults(teamId) {
        const data = await fetchSafe(`${SPORTSDB}/eventslast.php?id=${teamId}`);
        return data?.results || null;
    }

    async function searchTeam(name) {
        const data = await fetchSafe(`${SPORTSDB}/searchteams.php?t=${encodeURIComponent(name)}`);
        return data?.teams?.[0] || null;
    }

    async function searchPlayer(name) {
        const data = await fetchSafe(`${SPORTSDB}/searchplayers.php?p=${encodeURIComponent(name)}`);
        return data?.player?.[0] || null;
    }

    // Smart web answer: tries DDG then Wikipedia
    async function smartAnswer(query) {
        const [ddg, wiki] = await Promise.allSettled([duckduckgo(query), wikipedia(query)]);
        const ddgResult = ddg.status === 'fulfilled' ? ddg.value : null;
        const wikiResult = wiki.status === 'fulfilled' ? wiki.value : null;

        if (ddgResult?.answer && ddgResult.answer.length > 50) {
            return { text: ddgResult.answer, source: ddgResult.source };
        }
        if (wikiResult?.summary && wikiResult.summary.length > 50) {
            return { text: wikiResult.summary, source: 'Wikipedia', title: wikiResult.title };
        }
        return null;
    }

    return { wikipedia, duckduckgo, smartAnswer, liveScores, teamFixtures, teamResults, searchTeam, searchPlayer, fetchSafe, fetchText };
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
        eliminated: ["Liverpool (by PSG, 4-0 aggregate)", "Chelsea", "Barcelona", "Manchester City"],
        semiFinalDates: "April 29 – May 6, 2026",
        final: { date: "May 30, 2026", venue: "Wembley Stadium, London" },
        topScorers: [
            { name: "Harry Kane", club: "Bayern Munich", goals: 10 },
            { name: "Kylian Mbappé", club: "Real Madrid", goals: 9 },
            { name: "Bukayo Saka", club: "Arsenal", goals: 7 },
            { name: "Robert Lewandowski", club: "Barcelona", goals: 6 }
        ]
    },

    teams: {
        bayernMunich: {
            name: "FC Bayern Munich", country: "Germany", league: "Bundesliga",
            position: 1, played: 28, won: 23, drawn: 4, lost: 1,
            goalsFor: 101, goalsAgainst: 27, points: 73,
            topScorer: "Harry Kane", topScorerGoals: 34,
            topAssist: "Jamal Musiala", topAssistCount: 12,
            nextMatch: { opponent: "Borussia Dortmund", competition: "Bundesliga", date: "April 19, 2026", venue: "Allianz Arena", time: "17:30 CET" },
            lastResult: { opponent: "FC Augsburg", score: "3-0", result: "Win", date: "April 5, 2026", competition: "Bundesliga" },
            manager: "Vincent Kompany", stadium: "Allianz Arena", capacity: 75024, founded: 1900,
            keyPlayers: ["Harry Kane", "Jamal Musiala", "Michael Olise", "Joshua Kimmich", "Manuel Neuer", "Alphonso Davies", "Leroy Sané"],
            trophies: { bundesliga: 33, dfbPokal: 20, championsLeague: 6 },
            colors: "Red and White", nickname: "Die Roten / FC Hollywood",
            ucl2026: "Beat Real Madrid 2-1 in QF 1st leg. 2nd leg: April 15 at Bernabeu."
        },
        liverpool: {
            name: "Liverpool FC", country: "England", league: "Premier League",
            position: 1, played: 31, won: 23, drawn: 6, lost: 2,
            goalsFor: 78, goalsAgainst: 30, points: 75,
            topScorer: "Mohamed Salah", topScorerGoals: 25,
            topAssist: "Mohamed Salah", topAssistCount: 14,
            nextMatch: { opponent: "West Ham United", competition: "Premier League", date: "April 19, 2026", venue: "London Stadium", time: "15:00 GMT" },
            lastResult: { opponent: "Fulham", score: "3-1", result: "Win", date: "April 5, 2026", competition: "Premier League" },
            manager: "Arne Slot", stadium: "Anfield", capacity: 61276, founded: 1892,
            keyPlayers: ["Mohamed Salah", "Darwin Núñez", "Cody Gakpo", "Virgil van Dijk", "Alisson", "Trent Alexander-Arnold", "Luis Díaz"],
            trophies: { leagueTitles: 19, faCup: 8, leagueCup: 10, championsLeague: 6 },
            colors: "Red", nickname: "The Reds",
            ucl2026: "Eliminated by PSG in Round of 16, 4-0 on aggregate."
        },
        arsenal: {
            name: "Arsenal FC", country: "England", league: "Premier League",
            position: 2, played: 31, won: 21, drawn: 6, lost: 4,
            goalsFor: 65, goalsAgainst: 28, points: 69,
            topScorer: "Bukayo Saka", topScorerGoals: 18,
            topAssist: "Martin Ødegaard", topAssistCount: 11,
            nextMatch: { opponent: "Manchester City", competition: "Premier League", date: "April 19, 2026", venue: "Emirates Stadium", time: "16:30 GMT" },
            lastResult: { opponent: "Chelsea", score: "2-1", result: "Win", date: "April 4, 2026", competition: "Premier League" },
            manager: "Mikel Arteta", stadium: "Emirates Stadium", capacity: 60704, founded: 1886,
            keyPlayers: ["Bukayo Saka", "Martin Ødegaard", "Declan Rice", "William Saliba", "David Raya", "Leandro Trossard", "Gabriel Martinelli"],
            trophies: { leagueTitles: 13, faCup: 14, championsLeague: 0 },
            colors: "Red and White", nickname: "The Gunners",
            ucl2026: "Beat PSG 3-1 in QF 1st leg. 2nd leg: April 16 at Parc des Princes."
        },
        realMadrid: {
            name: "Real Madrid CF", country: "Spain", league: "La Liga",
            position: 2, played: 29, won: 19, drawn: 6, lost: 4,
            goalsFor: 70, goalsAgainst: 30, points: 63,
            topScorer: "Kylian Mbappé", topScorerGoals: 27,
            topAssist: "Vinícius Júnior", topAssistCount: 13,
            nextMatch: { opponent: "Bayern Munich", competition: "UCL QF 2nd Leg", date: "April 15, 2026", venue: "Santiago Bernabeu", time: "21:00 CET" },
            lastResult: { opponent: "Bayern Munich", score: "1-2", result: "Loss (1st leg)", date: "April 8, 2026", competition: "UCL QF" },
            manager: "Carlo Ancelotti", stadium: "Santiago Bernabeu", capacity: 81044, founded: 1902,
            keyPlayers: ["Kylian Mbappé", "Vinícius Júnior", "Jude Bellingham", "Luka Modrić", "Thibaut Courtois", "Federico Valverde", "Rodrygo"],
            trophies: { laLiga: 36, championsLeague: 15, copaDelRey: 20 },
            colors: "White", nickname: "Los Blancos / The Royal Whites",
            ucl2026: "Trail Bayern Munich 1-2 after QF 1st leg. Must win at Bernabeu on April 15."
        },
        manchesterCity: {
            name: "Manchester City FC", country: "England", league: "Premier League",
            position: 3, played: 31, won: 18, drawn: 5, lost: 8,
            goalsFor: 58, goalsAgainst: 38, points: 59,
            topScorer: "Erling Haaland", topScorerGoals: 22,
            topAssist: "Phil Foden", topAssistCount: 9,
            nextMatch: { opponent: "Arsenal", competition: "Premier League", date: "April 19, 2026", venue: "Emirates Stadium", time: "16:30 GMT" },
            lastResult: { opponent: "Newcastle United", score: "0-1", result: "Loss", date: "April 3, 2026", competition: "Premier League" },
            manager: "Pep Guardiola", stadium: "Etihad Stadium", capacity: 53400, founded: 1880,
            keyPlayers: ["Erling Haaland", "Phil Foden", "Kevin De Bruyne", "Rodri", "Ederson", "Jack Grealish", "Bernardo Silva"],
            trophies: { leagueTitles: 9, faCup: 7, championsLeague: 1 },
            colors: "Sky Blue", nickname: "The Citizens / The Blues",
            ucl2026: "Eliminated in Round of 16."
        }
    },

    players: {
        messi: {
            fullName: "Lionel Andres Messi", nationality: "Argentine",
            dob: "June 24, 1987", age: 38,
            currentClub: "Inter Miami CF", position: "Forward / Attacking Midfielder",
            goals: 903, matches: 1146, assists: 385, ballonDor: 7,
            trophies: [
                "7 Ballon d'Or (2009, 2010, 2011, 2012, 2015, 2019, 2021)",
                "4 UEFA Champions League (2006, 2009, 2011, 2015)",
                "10 La Liga titles with Barcelona",
                "1 FIFA World Cup (Qatar 2022)",
                "3 Copa America (2021 winner, 2024 winner, 2015 runner-up)",
                "1 Olympic Gold Medal (Beijing 2008)"
            ],
            records: [
                "Most Ballon d'Or awards: 7",
                "Most goals for a single club: 672 (Barcelona)",
                "Most La Liga goals: 474",
                "Most goals in a calendar year: 91 (2012)",
                "All-time leading scorer for Argentina: 109 goals"
            ],
            goatStatus: true,
            description: "The Greatest of All Time. End of debate."
        },
        ronaldo: {
            fullName: "Cristiano Ronaldo dos Santos Aveiro", nationality: "Portuguese",
            dob: "February 5, 1985", age: 41,
            currentClub: "Al Nassr (Saudi Arabia)", position: "Forward",
            goals: 967, matches: 1313, assists: 275, ballonDor: 5,
            trophies: [
                "5 Ballon d'Or (2008, 2013, 2014, 2016, 2017)",
                "5 UEFA Champions League (2008, 2014, 2016, 2017, 2018)",
                "3 Premier League titles",
                "2 La Liga titles",
                "1 UEFA European Championship (Euro 2016)",
                "1 UEFA Nations League (2019)"
            ],
            records: [
                "All-time leading goal scorer in football history: 967",
                "Most Champions League goals: 140",
                "Most international goals: 143",
                "First player to score 100 international goals"
            ]
        },
        haaland: {
            fullName: "Erling Braut Haaland", nationality: "Norwegian",
            dob: "July 21, 2000", age: 25,
            currentClub: "Manchester City", position: "Striker",
            goals: 22, matches: 28, assists: 4, ballonDor: 0,
            description: "The Norwegian goal machine. Fastest player to reach 100 Premier League goals. Physical specimen with finishing like a robot. At 25, may break every scoring record in history.",
            records: ["Fastest to 100 PL goals: 105 games", "PL season record: 36 goals (2022-23)"]
        },
        mbappe: {
            fullName: "Kylian Mbappé", nationality: "French",
            dob: "December 20, 1998", age: 27,
            currentClub: "Real Madrid", position: "Forward",
            goals: 27, matches: 32, assists: 8, ballonDor: 0,
            description: "The fastest player on the planet. Playing for Real Madrid this season — 27 goals in La Liga and UCL combined. France's all-time leading scorer at just 27.",
            records: ["Fastest player at World Cup sprint speed: 36.4 km/h", "Youngest French World Cup scorer"]
        },
        saka: {
            fullName: "Bukayo Saka", nationality: "English",
            dob: "September 5, 2001", age: 24,
            currentClub: "Arsenal", position: "Winger",
            goals: 18, matches: 30, assists: 11, ballonDor: 0,
            description: "Arsenal's most important player. Incredible consistency at just 24. England captain in waiting."
        },
        bellingham: {
            fullName: "Jude Bellingham", nationality: "English",
            dob: "June 29, 2003", age: 22,
            currentClub: "Real Madrid", position: "Attacking Midfielder",
            goals: 15, matches: 30, assists: 9, ballonDor: 0,
            description: "Arguably the best central midfielder in the world at just 22. Plays for Real Madrid. Composed, athletic, technically brilliant."
        },
        vinicius: {
            fullName: "Vinícius Júnior", nationality: "Brazilian",
            dob: "July 12, 2000", age: 25,
            currentClub: "Real Madrid", position: "Left Winger",
            goals: 22, matches: 31, assists: 13, ballonDor: 0,
            description: "Real Madrid's most dangerous attacker. Explosive dribbler, clinical finisher. 13 assists this season shows he's evolved into a complete player."
        },
        salah: {
            fullName: "Mohamed Salah", nationality: "Egyptian",
            dob: "June 15, 1992", age: 33,
            currentClub: "Liverpool", position: "Right Winger / Forward",
            goals: 25, matches: 31, assists: 14, ballonDor: 0,
            description: "Liverpool's captain and undisputed best player. 25 goals and 14 assists this season at age 33. Defying age. Legend."
        },
        kane: {
            fullName: "Harry Kane", nationality: "English",
            dob: "July 28, 1993", age: 32,
            currentClub: "Bayern Munich", position: "Striker",
            goals: 34, matches: 28, assists: 8, ballonDor: 0,
            description: "Bayern Munich's talismanic striker. 34 Bundesliga goals this season and counting. England's all-time leading scorer with 70+ international goals."
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
        "Bayern Munich edge Real Madrid 2-1 in Champions League QF first leg at Allianz Arena — Harry Kane with a brilliant finish",
        "Arsenal stun PSG 3-1 at the Emirates in the UCL quarter-final — Saka and Ødegaard in inspired form",
        "Liverpool lead the Premier League with 75 points — 6 clear of Arsenal with 7 games remaining",
        "Harry Kane brings his Bundesliga tally to 34 goals — on course for the Golden Boot by a distance",
        "Lionel Messi continues to defy age at 38 for Inter Miami — still the best footballer on earth",
        "Kylian Mbappé scores his 27th goal of the season for Real Madrid ahead of their UCL second leg",
        "World Cup 2026 ticket sales officially open — 48 nations heading to USA, Canada and Mexico"
    ],

    worldCup2026: {
        hosts: ["United States", "Canada", "Mexico"],
        startDate: "June 11, 2026",
        finalDate: "July 19, 2026",
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
    // Tokenizer
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
            else if (['+', '-', '*', '/', '^', '%'].includes(expr[i])) {
                tokens.push({ type: 'OP', val: expr[i] }); i++;
            } else if (/[a-z]/i.test(expr[i])) {
                let fn = '';
                while (i < expr.length && /[a-z]/i.test(expr[i])) fn += expr[i++];
                tokens.push({ type: 'FUNC', val: fn.toLowerCase() });
            } else i++;
        }
        return tokens;
    }

    // Recursive descent parser → evaluator
    function parse(tokens) {
        let pos = 0;
        function peek() { return tokens[pos]; }
        function consume() { return tokens[pos++]; }

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
                    sin: x => Math.sin(x * Math.PI / 180),
                    cos: x => Math.cos(x * Math.PI / 180),
                    tan: x => Math.tan(x * Math.PI / 180),
                    asin: x => Math.asin(x) * 180 / Math.PI,
                    acos: x => Math.acos(x) * 180 / Math.PI,
                    atan: x => Math.atan(x) * 180 / Math.PI,
                    sqrt: x => Math.sqrt(x),
                    cbrt: x => Math.cbrt(x),
                    log: x => Math.log10(x),
                    ln: x => Math.log(x),
                    abs: x => Math.abs(x),
                    ceil: x => Math.ceil(x),
                    floor: x => Math.floor(x),
                    round: x => Math.round(x)
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

    // Step-by-step solver
    function solveWithSteps(question) {
        const q = question.toLowerCase().trim();
        const steps = [];
        let result = null;

        // Percentage
        let m = q.match(/(\d+\.?\d*)\s*(?:%|percent(?:age)?)\s*of\s*(\d+\.?\d*)/);
        if (m) {
            const pct = parseFloat(m[1]), total = parseFloat(m[2]);
            steps.push(`Formula: (percentage ÷ 100) × total`);
            steps.push(`= (${pct} ÷ 100) × ${total}`);
            steps.push(`= ${pct / 100} × ${total}`);
            result = `= ${(pct / 100) * total}`;
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
            steps.push(`Discriminant = b² - 4ac = ${b}² - 4(${a})(${c}) = ${disc}`);
            if (disc < 0) return { answer: `No real solutions (discriminant = ${disc} < 0).`, steps };
            const x1 = parseFloat(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(6));
            const x2 = parseFloat(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(6));
            steps.push(`x₁ = (${-b} + ${parseFloat(Math.sqrt(disc).toFixed(4))}) / ${2 * a} = ${x1}`);
            steps.push(`x₂ = (${-b} - ${parseFloat(Math.sqrt(disc).toFixed(4))}) / ${2 * a} = ${x2}`);
            return { answer: x1 === x2 ? `x = ${x1} (repeated root)` : `x = ${x1} or x = ${x2}`, steps };
        }

        // Square root with steps
        m = q.match(/square\s*root\s*of\s*(\d+\.?\d*)|sqrt\s*[(\s]*(\d+\.?\d*)/);
        if (m) {
            const n = parseFloat(m[1] || m[2]);
            const sqr = Math.sqrt(n);
            steps.push(`√${n} = ?`);
            if (Number.isInteger(sqr)) steps.push(`${n} = ${sqr} × ${sqr}, so √${n} = ${sqr} exactly`);
            else steps.push(`Using Newton's method approximation: ≈ ${parseFloat(sqr.toFixed(8))}`);
            return { answer: `√${n} = ${parseFloat(sqr.toFixed(8))}`, steps };
        }

        // Power
        m = q.match(/(\d+\.?\d*)\s*(?:to the power of|raised to|to the)\s*(\d+\.?\d*)|\^/);
        if (!m) m = q.match(/(\d+\.?\d*)\s*\^\s*(\d+\.?\d*)/);
        if (m) {
            const base = parseFloat(m[1]), exp = parseFloat(m[2]);
            steps.push(`${base}^${exp} means ${base} multiplied by itself ${exp} times`);
            if (exp <= 5) {
                let s = '', v = 1;
                for (let i = 0; i < exp; i++) { v *= base; s += (i > 0 ? ' × ' : '') + base; }
                steps.push(`= ${s} = ${v}`);
            }
            return { answer: `${base}^${exp} = ${Math.pow(base, exp)}`, steps };
        }

        // Statistics: mean
        m = q.match(/(?:mean|average)\s+of\s+([\d\s,.]+)/);
        if (m) {
            const nums = m[1].match(/\d+\.?\d*/g).map(Number);
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = sum / nums.length;
            steps.push(`Add all numbers: ${nums.join(' + ')} = ${sum}`);
            steps.push(`Divide by count: ${sum} ÷ ${nums.length} = ${parseFloat(mean.toFixed(4))}`);
            return { answer: `Mean of [${nums.join(', ')}] = ${parseFloat(mean.toFixed(4))}`, steps };
        }

        // Derivative
        m = q.match(/derivative\s+of\s+x\s*\^?\s*(\d+)/);
        if (m) {
            const n = parseInt(m[1]);
            steps.push(`Power rule: d/dx(xⁿ) = n·xⁿ⁻¹`);
            steps.push(`n = ${n}, so: d/dx(x^${n}) = ${n}·x^${n - 1}`);
            return { answer: `d/dx(x^${n}) = ${n === 1 ? '1' : `${n}x^${n - 1}`}`, steps };
        }

        // Integral
        m = q.match(/integral\s+of\s+x\s*\^?\s*(\d+)/);
        if (m) {
            const n = parseInt(m[1]);
            steps.push(`Power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C`);
            steps.push(`n = ${n}, so: ∫x^${n} dx = x^${n + 1}/${n + 1} + C`);
            return { answer: `∫x^${n} dx = x^${n + 1}/${n + 1} + C`, steps };
        }

        // Arithmetic expression parser
        const cleanQ = q.replace(/what is|calculate|compute|evaluate|solve|equals?/g, '').trim();
        const mathChars = /^[\d\s+\-*/^().%×÷²³sqrtabscossintan]+$/i;
        if (mathChars.test(cleanQ) && cleanQ.length > 0) {
            const r = evalExpression(cleanQ);
            if (r !== null) {
                return { answer: `${cleanQ.trim()} = ${r}`, steps: [`Evaluated: ${cleanQ.trim()} = ${r}`] };
            }
        }

        // Fallback to legacy solver
        return null;
    }

    // Legacy simple solver (kept for compatibility)
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
            if (n > 20) return `${n}! is astronomically large. Use a scientific calculator.`;
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
    const formulas = {
        force: { eq: 'F = ma', vars: ['mass', 'acceleration'], solve: (m, a) => `F = ${m} × ${a} = ${m * a} Newtons` },
        ke: { eq: 'KE = ½mv²', vars: ['mass', 'velocity'], solve: (m, v) => `KE = 0.5 × ${m} × ${v}² = ${0.5 * m * v * v} Joules` },
        pe: { eq: 'PE = mgh', vars: ['mass', 'height'], solve: (m, h) => `PE = ${m} × 9.81 × ${h} = ${parseFloat((m * 9.81 * h).toFixed(3))} Joules` },
        work: { eq: 'W = Fd', vars: ['force', 'distance'], solve: (f, d) => `W = ${f} × ${d} = ${f * d} Joules` },
        power: { eq: 'P = W/t', vars: ['work', 'time'], solve: (w, t) => `P = ${w} ÷ ${t} = ${parseFloat((w / t).toFixed(4))} Watts` },
        momentum: { eq: 'p = mv', vars: ['mass', 'velocity'], solve: (m, v) => `p = ${m} × ${v} = ${m * v} kg⋅m/s` },
        pressure: { eq: 'P = F/A', vars: ['force', 'area'], solve: (f, a) => `P = ${f} ÷ ${a} = ${parseFloat((f / a).toFixed(4))} Pascals` },
        ohm: { eq: 'V = IR', vars: ['current', 'resistance'], solve: (I, R) => `V = ${I} × ${R} = ${I * R} Volts` },
        wave: { eq: 'v = fλ', vars: ['frequency', 'wavelength'], solve: (f, l) => `v = ${f} × ${l} = ${f * l} m/s` }
    };

    function solve(question) {
        const q = question.toLowerCase();
        const nums = [];
        const rx = /(\d+\.?\d*)/g;
        let nm;
        while ((nm = rx.exec(q)) !== null) nums.push(parseFloat(nm[1]));
        if (nums.length < 2) return null;
        const n = (i) => nums[i] !== undefined ? nums[i] : 0;

        // Kinematics
        if (q.match(/(?:final|new)?\s*velocity.*acceleration.*time|v\s*=\s*u\s*\+/)) {
            const u = n(0), a = n(1), t = n(2);
            const v = u + a * t;
            return `Kinematics: v = u + at\n= ${u} + (${a} × ${t})\n= ${v} m/s`;
        }
        if (q.match(/displacement|distance.*time.*acceleration/)) {
            const u = n(0), t = n(1), a = n(2);
            const s = u * t + 0.5 * a * t * t;
            return `s = ut + ½at²\n= ${u}×${t} + 0.5×${a}×${t}²\n= ${parseFloat(s.toFixed(4))} metres`;
        }

        if (q.match(/force.*mass.*acceleration|newton.*second|f\s*=\s*ma/)) return formulas.force.solve(n(0), n(1));
        if (q.match(/kinetic energy|ke\b/)) return formulas.ke.solve(n(0), n(1));
        if (q.match(/potential energy|gravitational energy|pe\b/)) return formulas.pe.solve(n(0), n(1));
        if (q.match(/ohm.*law|voltage.*current.*resist|v\s*=\s*ir/)) return formulas.ohm.solve(n(0), n(1));
        if (q.match(/momentum/)) return formulas.momentum.solve(n(0), n(1));
        if (q.match(/pressure.*force.*area/)) return formulas.pressure.solve(n(0), n(1));
        if (q.match(/work.*force.*distance/)) return formulas.work.solve(n(0), n(1));
        if (q.match(/power.*work.*time|watt/)) return formulas.power.solve(n(0), n(1));
        if (q.match(/wave.*speed|frequency.*wavelength/)) return formulas.wave.solve(n(0), n(1));

        // Gravitational acceleration
        if (q.match(/gravity|gravitational acceleration/)) return `Gravitational acceleration on Earth: g = 9.81 m/s²`;

        // Electric power
        if (q.match(/electric.*power|p\s*=\s*iv|power.*voltage/)) {
            return `Electric Power: P = IV = ${n(0)} × ${n(1)} = ${n(0) * n(1)} Watts`;
        }

        // Density
        if (q.match(/density/)) {
            return `Density: ρ = m/V = ${n(0)} ÷ ${n(1)} = ${parseFloat((n(0) / n(1)).toFixed(4))} kg/m³`;
        }

        // Heat
        if (q.match(/heat|thermal energy|specific heat/)) {
            const m = n(0), c = n(1), delta_t = n(2) || n(1);
            return `Heat energy: Q = mcΔT = ${m} × ${c} × ${delta_t} = ${parseFloat((m * c * delta_t).toFixed(3))} Joules`;
        }

        return null;
    }

    return { solve, formulas };
})();

// ══════════════════════════════════════════════════════
//  ❾  UNIT CONVERTER (Comprehensive)
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
        if (q.match(/nm.*km|nanometers?.*km/)) return `${n} nm = ${r(n * 1e-12)} km`;

        // Weight/Mass
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
        if (q.match(/ml.*cups?/)) return `${n} ml = ${r(n * 0.00422675, 6)} cups`;
        if (q.match(/cups?.*ml/)) return `${n} cups = ${r(n * 236.588, 2)} ml`;
        if (q.match(/liters?.*ml/)) return `${n} L = ${n * 1000} ml`;
        if (q.match(/ml.*liters?/)) return `${n} ml = ${n / 1000} L`;
        if (q.match(/pints?.*liters?/)) return `${n} pints = ${r(n * 0.473176)} L`;
        if (q.match(/liters?.*pints?/)) return `${n} L = ${r(n * 2.11338)} pints`;

        // Speed
        if (q.match(/mph.*km\/h|mph.*kmh/)) return `${n} mph = ${r(n * 1.60934)} km/h`;
        if (q.match(/km\/h.*mph|kmh.*mph/)) return `${n} km/h = ${r(n * 0.621371)} mph`;
        if (q.match(/m\/s.*km\/h/)) return `${n} m/s = ${r(n * 3.6)} km/h`;
        if (q.match(/km\/h.*m\/s/)) return `${n} km/h = ${r(n / 3.6)} m/s`;
        if (q.match(/knots?.*km\/h/)) return `${n} knots = ${r(n * 1.852)} km/h`;

        // Data
        if (q.match(/bytes?.*kb/)) return `${n} bytes = ${r(n / 1024, 6)} KB`;
        if (q.match(/kb.*mb/)) return `${n} KB = ${r(n / 1024, 6)} MB`;
        if (q.match(/mb.*gb/)) return `${n} MB = ${r(n / 1024, 6)} GB`;
        if (q.match(/gb.*tb/)) return `${n} GB = ${r(n / 1024, 6)} TB`;
        if (q.match(/gb.*mb/)) return `${n} GB = ${n * 1024} MB`;
        if (q.match(/tb.*gb/)) return `${n} TB = ${n * 1024} GB`;
        if (q.match(/mb.*kb/)) return `${n} MB = ${n * 1024} KB`;

        // Energy
        if (q.match(/joules?.*calories?/)) return `${n} J = ${r(n * 0.239006)} cal`;
        if (q.match(/calories?.*joules?/)) return `${n} cal = ${r(n * 4.184)} J`;
        if (q.match(/kwh.*joules?/)) return `${n} kWh = ${n * 3600000} J`;

        // Currency hints (no live rates)
        if (q.match(/ksh.*usd|shilling.*dollar/)) return `Approx. 130 KSH = 1 USD (as of early 2026). Check a currency app for real-time rates.`;
        if (q.match(/usd.*ksh|dollar.*shilling/)) return `Approx. 1 USD = 130 KSH (as of early 2026). Check a currency app for real-time rates.`;
        if (q.match(/usd.*euro|dollar.*euro/)) return `Approx. 1 USD = 0.93 EUR (as of early 2026). Check a currency app for live rates.`;
        if (q.match(/pound.*usd|gbp.*usd/)) return `Approx. 1 GBP = 1.27 USD (as of early 2026). Check a currency app for live rates.`;

        return null;
    }
    return { convert };
})();

// ══════════════════════════════════════════════════════
//  ❿  REASONING ENGINE (Think-step-by-step)
// ══════════════════════════════════════════════════════
const ReasoningEngine = (() => {
    function analyzeQuestion(q) {
        const lower = q.toLowerCase();
        if (lower.match(/why|reason|explain|how.*work|what.*cause/)) return 'explanatory';
        if (lower.match(/compare|difference|vs|versus|better/)) return 'comparative';
        if (lower.match(/should i|recommend|best|which one/)) return 'advisory';
        if (lower.match(/define|what is|meaning of/)) return 'definitional';
        if (lower.match(/when|date|year|time/)) return 'temporal';
        if (lower.match(/who|person|player|created/)) return 'entity';
        if (lower.match(/how many|how much|count|number/)) return 'quantitative';
        return 'general';
    }

    function buildContext(question) {
        return {
            type: analyzeQuestion(question),
            history: Memory.getContext(3),
            mood: Memory.getMood(),
            user: Memory.getUser()
        };
    }

    function formatResponse(raw, type, mood) {
        if (!raw) return null;
        let resp = raw;
        // Personalize if we know the user
        const user = Memory.getUser();
        // Apply emotion prefix occasionally
        if (Math.random() > 0.6 && mood !== 'neutral') {
            resp = EmotionEngine.apply(resp, mood);
        }
        return resp;
    }

    return { analyzeQuestion, buildContext, formatResponse };
})();

// ══════════════════════════════════════════════════════
//  ⓫  GENERAL KNOWLEDGE (Extended)
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
        speedOfLight: "The speed of light in a vacuum is exactly 299,792,458 metres per second — approximately 300,000 km/s or 186,000 miles per second.",
        speedOfSound: "The speed of sound in air at sea level (20°C) is approximately 343 m/s (1,235 km/h). It varies with temperature and medium.",
        dna: "DNA (Deoxyribonucleic Acid) is the molecule carrying genetic instructions for all known living organisms. It consists of a double helix of nucleotide base pairs: Adenine-Thymine and Cytosine-Guanine.",
        gravity: "Gravity is the fundamental force of attraction between masses. On Earth's surface, g = 9.81 m/s². Described by Newton's Law of Universal Gravitation and Einstein's General Relativity.",
        ai: "Artificial Intelligence is the simulation of human cognitive processes by machines. It includes machine learning, deep learning, neural networks, natural language processing, and computer vision. Modern AI systems like large language models are trained on vast datasets.",
        quantum: "Quantum mechanics describes matter and energy at the smallest scales. Key principles: wave-particle duality, superposition, quantum entanglement, and Heisenberg's uncertainty principle.",
        blackHole: "A black hole is a region of spacetime where gravity is so strong that nothing — not even light — can escape. They form when massive stars collapse. Described by the Schwarzschild radius.",
        bigBang: "The Big Bang (13.8 billion years ago) was the rapid expansion of spacetime from an extremely hot, dense state. It explains the cosmic microwave background radiation, the expansion of the universe, and the distribution of hydrogen and helium.",
        dnaStructure: "DNA has a double helix structure discovered by Watson and Crick in 1953 (building on Rosalind Franklin's X-ray crystallography). It stores genetic information in sequences of 4 bases: A, T, G, C.",
        evolution: "Evolution by natural selection — proposed by Charles Darwin in 1859 — explains how species change over generations. Individuals with traits better suited to their environment survive and reproduce more successfully, passing on those traits.",
        internet: "The internet began as ARPANET (1969). Tim Berners-Lee invented the World Wide Web in 1989. Today it connects 5+ billion people through TCP/IP protocols, web servers, and fibre optic cables.",
        climate: "Climate change refers to long-term shifts in global temperatures and weather patterns. The burning of fossil fuels releases CO₂ and other greenhouse gases that trap heat in Earth's atmosphere — the enhanced greenhouse effect."
    };

    const HISTORY = {
        ww1: "World War 1 (1914-1918): Triggered by the assassination of Archduke Franz Ferdinand. Allied Powers (France, UK, Russia, USA) vs Central Powers (Germany, Austria-Hungary, Ottoman Empire). Over 20 million deaths. Ended with the Treaty of Versailles 1919.",
        ww2: "World War 2 (1939-1945): The largest conflict in human history. Allies (UK, USA, USSR, France) vs Axis (Nazi Germany, Italy, Japan). 70-85 million casualties. Holocaust killed 6 million Jews. Ended May 1945 (Europe) and September 1945 (Pacific). Led to the United Nations.",
        coldWar: "The Cold War (1947-1991): Geopolitical tension between USA and USSR after WW2. Featured the nuclear arms race, Space Race, Korean War (1950-53), Vietnam War (1955-75), Cuban Missile Crisis (1962), and the Berlin Wall (1961-1989). Ended with Soviet dissolution in 1991.",
        civilRights: "The American Civil Rights Movement (1954-1968): Led by Dr. Martin Luther King Jr., Rosa Parks, Malcolm X and others. Fought racial segregation and discrimination. Key events: Montgomery Bus Boycott (1955), March on Washington (1963), Civil Rights Act (1964), Voting Rights Act (1965).",
        mandela: "Nelson Mandela (1918-2013): South African anti-apartheid activist imprisoned for 27 years on Robben Island. Released 1990, negotiated end to apartheid. South Africa's first Black president (1994-1999). Nobel Peace Prize 1993.",
        gandhi: "Mahatma Gandhi (1869-1948): Led India's non-violent independence movement (Satyagraha) against British rule. Salt March (1930) was iconic. India gained independence August 15, 1947. Gandhi assassinated January 30, 1948.",
        kenyaIndependence: "Kenya gained independence on December 12, 1963 from British colonial rule. Jomo Kenyatta became the first Prime Minister (later President). This date is celebrated as Jamhuri Day — Kenya's most important national holiday.",
        moonLanding: "Apollo 11 landed on the Moon July 20, 1969. Neil Armstrong became the first human to walk on the lunar surface: 'That's one small step for man, one giant leap for mankind.' Buzz Aldrin also walked on the Moon. Michael Collins orbited above.",
        romanEmpire: "The Roman Empire (27 BC – 476 AD) dominated the Mediterranean world for 500 years. It spread Latin, Roman law, Christianity, roads, and architecture across Europe, North Africa and the Middle East. Fell when Romulus Augustulus was deposed by Odoacer in 476 AD.",
        frenchRevolution: "The French Revolution (1789-1799): Overthrew the French monarchy and aristocracy. Ideals of Liberté, Égalité, Fraternité. The Reign of Terror (1793-94) saw mass executions. Led to Napoleon Bonaparte's rise and his conquests of Europe.",
        colonialism: "European colonialism (15th-20th century): European powers colonised most of Africa, Asia, and the Americas. The 'Scramble for Africa' (1880s) saw most of Africa divided. Colonial exploitation caused immense suffering but also spread technology, language and infrastructure."
    };

    const TECH = {
        gpt: "GPT (Generative Pre-trained Transformer) is a family of large language models developed by OpenAI. GPT-4 and beyond power ChatGPT. These models are trained on massive text datasets using transformer architecture and can generate human-like text.",
        blockchain: "Blockchain is a distributed, immutable ledger of transactions secured by cryptography. Data is stored in chained blocks verified by consensus mechanisms. Powers cryptocurrencies like Bitcoin and Ethereum, and smart contracts.",
        python: "Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. Known for readability and simplicity. The dominant language for AI/ML, data science, web development (Django/Flask), and automation.",
        react: "React is a JavaScript library for building user interfaces, created by Meta (Facebook) in 2013. Uses a component-based architecture and a virtual DOM for efficient updates. The most popular frontend framework globally.",
        cloudComputing: "Cloud computing delivers computing services (servers, storage, databases, networking, software) over the internet ('the cloud'). Major providers: AWS (Amazon), Azure (Microsoft), Google Cloud. Enables scalable, on-demand resources without physical infrastructure.",
        cybersecurity: "Cybersecurity protects computer systems, networks, and data from digital attacks. Key domains: network security, application security, cryptography, incident response, ethical hacking. Increasingly critical as cyber threats grow globally.",
        ev: "Electric Vehicles (EVs) use electric motors powered by battery packs instead of combustion engines. Tesla dominates the premium market. China leads global EV adoption. EVs produce zero direct emissions — critical for climate goals. Battery technology (energy density, charging speed) is the key frontier."
    };

    function getCapital(question) {
        const q = question.toLowerCase();
        const m = q.match(/capital\s+(?:of|city\s+of)\s+(.+?)(?:\?|$)/);
        if (m) {
            const country = m[1].trim().replace(/\?/g, '').toLowerCase();
            const cap = GEOGRAPHY.capitals[country] || GEOGRAPHY.capitals[country.replace(/^the\s+/, '')];
            if (cap) return `The capital of ${country.charAt(0).toUpperCase() + country.slice(1)} is ${cap}.`;
            return null; // Let web search handle it
        }
        return null;
    }

    function getGeneral(question) {
        const q = question.toLowerCase().trim();

        // Time
        if (q.match(/what.*(time|clock)|current time/)) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}. Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        }
        if (q.match(/what.*date|today.*date|date.*today/)) {
            return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        }
        if (q.match(/what.*day\b|today.*day/)) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return `Today is ${days[new Date().getDay()]}.`;
        }
        if (q.match(/what.*year/)) return `The current year is ${new Date().getFullYear()}.`;

        // Identity
        if (q.match(/who (created|made|built|developed) you|creator/))
            return `I was created by Martin Lutherking Owino — CEO and lead developer of Protogen AI under HECO AFRICA. He's building Africa's AI future and made me, Bingo, as a testament to what African innovation can achieve!`;
        if (q.match(/who are you|what are you|your name/))
            return `I'm Bingo — a next-generation AI assistant by Protogen AI under HECO AFRICA. Version 4.0 — smarter, faster, and more capable than ever. Football, maths, physics, science, history, music, web search — ask me anything!`;
        if (q.match(/what can you do|your abilities|features/))
            return `I can do: Live football scores and stats (all major leagues), Champions League updates, Player profiles, Maths from arithmetic to calculus with steps, Physics problem solving, Unit conversions, Web search with smart summaries, General knowledge, Science and history, Music playback, Timers, Jokes and savage roasts, Memory of our conversation, and much more. Just ask!`;

        // Greetings
        if (q.match(/^(hi|hello|hey|howdy)\b/)) {
            const h = new Date().getHours();
            const user = Memory.getUser();
            const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
            return `${greeting}${user ? `, ${user}` : ''}! I'm Bingo. What can I help you with today?`;
        }
        if (q.match(/how are you|how do you feel/)) return `I'm running perfectly — all systems at full power! Ready to answer anything you throw at me. What's on your mind?`;
        if (q.match(/thank(s| you)|cheers/)) return `You're very welcome! That's what I'm here for. Fire away with your next question!`;

        // Science
        if (q.match(/speed of light/)) return SCIENCE.speedOfLight;
        if (q.match(/speed of sound/)) return SCIENCE.speedOfSound;
        if (q.match(/what is dna\b/)) return SCIENCE.dna;
        if (q.match(/what is ai|artificial intelligence/)) return SCIENCE.ai;
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
        if (q.match(/react.*javascript|javascript.*react/)) return TECH.react;
        if (q.match(/cloud computing/)) return TECH.cloudComputing;
        if (q.match(/electric.*vehicle|tesla\b|ev\b/)) return TECH.ev;

        // Distance / space
        if (q.match(/distance.*earth.*moon|moon.*distance/)) return `The average distance from Earth to the Moon is 384,400 km (238,855 miles). It varies: perigee (closest) ≈ 356,500 km, apogee (farthest) ≈ 406,700 km.`;
        if (q.match(/distance.*earth.*sun|sun.*distance/)) return `The average distance from Earth to the Sun is 149.6 million km (1 Astronomical Unit). This varies: perihelion (January) ≈ 147 million km, aphelion (July) ≈ 152 million km.`;
        if (q.match(/how old is.*earth|age.*earth/)) return `Earth is approximately 4.54 billion years old, based on radiometric dating of meteorites and the oldest Earth rocks.`;
        if (q.match(/how old is.*universe|age.*universe/)) return `The universe is approximately 13.8 billion years old, calculated from the cosmic microwave background radiation using the ΛCDM cosmological model.`;
        if (q.match(/pi\b|value of pi/)) return `Pi (π) ≈ 3.14159265358979323846... It is the ratio of a circle's circumference to its diameter — an irrational number with infinite non-repeating decimals.`;
        if (q.match(/number of planets|planets in solar system/)) return `Our solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Pluto was reclassified as a dwarf planet in 2006.`;
        if (q.match(/largest planet/)) return `Jupiter is the largest planet in our solar system — so large that all other planets could fit inside it.`;
        if (q.match(/nearest star/)) return `The nearest star to Earth (besides the Sun) is Proxima Centauri, 4.24 light-years away in the Alpha Centauri system.`;

        // History
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

        // Geography capitals
        const cap = getCapital(question);
        if (cap) return cap;

        // Geography facts
        if (q.match(/largest country/)) return `Russia is the largest country in the world at 17.1 million km² — covering 11% of Earth's landmass and spanning 11 time zones.`;
        if (q.match(/smallest country/)) return `Vatican City is the smallest country in the world at just 0.44 km², entirely within Rome, Italy.`;
        if (q.match(/longest river/)) return `The Nile (6,650 km) is traditionally considered the world's longest river, though the Amazon is sometimes argued as longer due to its greater discharge.`;
        if (q.match(/highest mountain|tallest mountain|everest/)) return `Mount Everest (8,849 m above sea level) is the highest mountain on Earth, on the Nepal-Tibet border. First summited by Edmund Hillary and Tenzing Norgay on May 29, 1953.`;
        if (q.match(/deepest ocean|mariana trench/)) return `The Mariana Trench (Challenger Deep) is the deepest point on Earth at 11,034 m (36,201 ft) below sea level, in the western Pacific Ocean.`;
        if (q.match(/largest ocean/)) return `The Pacific Ocean is the largest at 165.25 million km² — larger than all land masses combined.`;
        if (q.match(/amazon rainforest/)) return `The Amazon Rainforest covers 5.5 million km² across 9 South American countries (mostly Brazil). It produces 20% of the world's oxygen and contains 10% of all species on Earth.`;
        if (q.match(/great wall.*china/)) return `The Great Wall of China stretches approximately 21,196 km total length. Built over many dynasties from 7th century BC to 17th century AD to defend against northern invasions.`;
        if (q.match(/africa.*largest country|largest.*africa/)) return `Algeria is the largest country in Africa at 2.38 million km², since Sudan was divided in 2011.`;
        if (q.match(/kenya.*population|population.*kenya/)) return `Kenya has a population of approximately 57 million people (2026 estimate). Nairobi is the capital and largest city with about 5.3 million people.`;

        // Numbers & Logic
        if (q.match(/meaning of life/)) return `42! (According to Douglas Adams in 'The Hitchhiker's Guide to the Galaxy'.) The actual answer is a philosophical question humanity has grappled with for millennia — purpose, love, experience, and connection are common answers.`;
        if (q.match(/how many seconds.*day|seconds.*in.*day/)) return `There are 86,400 seconds in a day (60 × 60 × 24 = 86,400).`;
        if (q.match(/how many days.*year/)) return `A regular year has 365 days. A leap year has 366 days, occurring every 4 years (with exceptions for century years not divisible by 400).`;

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
        const players = FootballDB.players;
        if (n.includes('messi')) return players.messi;
        if (n.includes('ronaldo')) return players.ronaldo;
        if (n.includes('haaland')) return players.haaland;
        if (n.includes('mbappe') || n.includes('mbappé')) return players.mbappe;
        if (n.includes('saka')) return players.saka;
        if (n.includes('bellingham')) return players.bellingham;
        if (n.includes('vinicius') || n.includes('vinícius') || n.includes('vini')) return players.vinicius;
        if (n.includes('salah')) return players.salah;
        if (n.includes('kane')) return players.kane;
        return null;
    }

    function getTeamData(name) {
        const n = name.toLowerCase();
        const t = FootballDB.teams;
        if (n.includes('bayern') || n.includes('munich')) return { key: 'bayernMunich', data: t.bayernMunich };
        if (n.includes('liverpool')) return { key: 'liverpool', data: t.liverpool };
        if (n.includes('arsenal')) return { key: 'arsenal', data: t.arsenal };
        if (n.includes('real madrid') || n.includes('madrid')) return { key: 'realMadrid', data: t.realMadrid };
        if (n.includes('manchester city') || n.includes('man city') || n.includes('city')) return { key: 'manchesterCity', data: t.manchesterCity };
        return null;
    }

    function answer(question) {
        const q = question.toLowerCase();
        const cl = FootballDB.championsLeague;
        const wc = FootballDB.worldCup2026;

        // — LIVE / SCORES —
        if (q.match(/live|score.*now|currently.*playing|what.*score/)) {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            const upcoming = cl.secondLeg.filter(m => {
                const d = new Date(m.date);
                const now = new Date();
                return d >= now || d.toDateString() === now.toDateString();
            });
            if (upcoming.length) {
                const list = upcoming.map(m => `${m.home} vs ${m.away} (${m.comp}) — ${m.date} at ${m.time}`).join('; ');
                return `No live scores at the moment. Upcoming: ${list}. Ask me specifically about any team or league!`;
            }
            return `No live matches at the moment. Check back during match times. Upcoming fixtures: April 15 — Real Madrid vs Bayern Munich (UCL), April 19 — Liverpool vs West Ham, Arsenal vs Man City.`;
        }

        // — UPCOMING FIXTURES —
        if (q.match(/upcoming|next.*fixtures?|fixture.*list|schedule.*week/)) {
            const list = FootballDB.upcomingFixtures.map(f => `${f.date}: ${f.home} vs ${f.away} — ${f.comp} at ${f.time}`).join('. ');
            return `Upcoming Fixtures: ${list}`;
        }

        // — RECENT RESULTS —
        if (q.match(/recent results?|latest results?|last.*results?|scores.*this week/)) {
            const list = FootballDB.recentResults.map(r => `${r.date}: ${r.home} ${r.hScore}-${r.aScore} ${r.away} (${r.comp})`).join('. ');
            return `Recent Results: ${list}`;
        }

        // — NEWS —
        if (q.match(/football news|latest.*football|football.*headlines/))
            return `Football Headlines: ${FootballDB.news.join('. ')}`;

        // — WORLD CUP —
        if (q.match(/world cup/)) {
            return `FIFA World Cup 2026: Hosted by ${wc.hosts.join(', ')}. Dates: ${wc.startDate} to ${wc.finalDate}. ${wc.teams} teams in ${wc.groups} groups. Final: ${wc.finalVenue}. Defending champions: ${wc.defending}. Top contenders: ${wc.topContenders.join(', ')}. ${wc.notable}.`;
        }

        // — CHAMPIONS LEAGUE —
        if (q.match(/champions league|ucl\b|european cup/)) {
            if (q.match(/quarter.?final/)) {
                const list = cl.quarterFinals.map(m => `${m.home} ${m.hScore}-${m.aScore} ${m.away} (${m.leg})`).join('; ');
                return `UCL Quarter-Final 1st Legs: ${list}. 2nd legs: April 15-17, 2026. Final: ${cl.final.date} at ${cl.final.venue}.`;
            }
            if (q.match(/semi.?final/)) return `UCL Semi-Final dates: ${cl.semiFinalDates}.`;
            if (q.match(/\bfinal\b/)) return `The 2025-26 Champions League Final will be held on ${cl.final.date} at ${cl.final.venue}.`;
            if (q.match(/top scorer|goal.*scorer/)) {
                const list = cl.topScorers.map(s => `${s.name} (${s.club}) — ${s.goals} goals`).join(', ');
                return `UCL 2025-26 Top Scorers: ${list}.`;
            }
            if (q.match(/eliminated|knocked out/)) return `Eliminated teams: ${cl.eliminated.join(', ')}.`;
            return `Champions League 2025-26 is at the ${cl.stage}. Bayern lead Real Madrid 2-1 after QF 1st leg. Arsenal beat PSG 3-1. Semi-finals: ${cl.semiFinalDates}. Final: ${cl.final.date} at ${cl.final.venue}.`;
        }

        // — PLAYER QUERIES —
        const playerNames = ['messi', 'ronaldo', 'haaland', 'mbapp', 'saka', 'bellingham', 'vinicius', 'salah', 'kane', 'vini', 'musiala', 'olise', 'van dijk', 'odegaard', 'de bruyne', 'foden'];
        for (const pn of playerNames) {
            if (q.includes(pn)) {
                const player = getPlayerInfo(pn);
                if (player) {
                    if (q.match(/messi.*ronaldo|ronaldo.*messi|compare|vs|versus|goat.*debate|better/)) {
                        const mes = FootballDB.players.messi;
                        const ron = FootballDB.players.ronaldo;
                        return `The eternal debate! Messi: ${mes.goals} career goals, ${mes.matches} matches, ${mes.assists} assists, ${mes.ballonDor} Ballon d'Or awards, 1 World Cup, 4 Champions Leagues. Ronaldo: ${ron.goals} career goals (all-time record!), ${ron.matches} matches, ${ron.assists} assists, ${ron.ballonDor} Ballon d'Or awards, 5 Champions Leagues, 0 World Cups. Messi won the 2022 World Cup — cementing his legacy. The stats, the trophies, the era — Messi is the Greatest Of All Time. Ronaldo is the greatest goal machine in history. Two different types of genius.`;
                    }
                    if (q.match(/goals?/)) return `${player.fullName}: ${player.goals} goals in ${player.matches} matches this ${player.currentClub ? 'career' : 'season'}${player.assists ? `, with ${player.assists} assists` : ''}.`;
                    if (q.match(/age|born|dob/)) return `${player.fullName} was born on ${player.dob}${player.age ? `, age ${player.age}` : ''}.`;
                    if (q.match(/club|play.*for|team/)) return `${player.fullName} plays for ${player.currentClub}.`;
                    if (player.trophies && q.match(/trophies?|titles?/)) return `${player.fullName}'s trophies: ${player.trophies.join('. ')}.`;
                    if (player.records && q.match(/records?/)) return `${player.fullName}'s records: ${player.records.join('. ')}.`;
                    // General player info
                    return `${player.fullName} (${player.nationality}), ${player.currentClub}. ${player.description || ''} ${player.goals} ${player.matches < 50 ? 'goals this season' : 'career goals'}, ${player.assists || 0} assists.`;
                }
            }
        }

        // Special player mentions not in full DB
        if (q.match(/musiala/)) return `Jamal Musiala — Bayern Munich's creative genius. ${FootballDB.teams.bayernMunich.topAssistCount} assists this Bundesliga season. Born in Stuttgart (2003), plays for Germany. One of the brightest talents in world football at just 22.`;
        if (q.match(/odegaard|ødegaard/)) return `Martin Ødegaard is Arsenal's captain and creative midfielder. ${FootballDB.teams.arsenal.topAssistCount} assists this season. Norwegian international and one of the best playmakers in the Premier League.`;
        if (q.match(/van dijk|virgil/)) return `Virgil van Dijk is Liverpool's commanding centre-back. Arguably the best defender in the world. His presence has been crucial to Liverpool's Premier League title challenge.`;
        if (q.match(/de bruyne|kevin/)) return `Kevin De Bruyne is Manchester City's midfield maestro — widely regarded as the best central midfielder of his generation. Currently on ${FootballDB.teams.manchesterCity.topAssistCount} assists.`;
        if (q.match(/\bfoden\b|phil foden/)) return `Phil Foden is Manchester City's most creative player — the 'Stockport Iniesta'. ${FootballDB.teams.manchesterCity.topAssistCount} assists this season.`;

        // — TEAM QUERIES —
        const teamResult = getTeamData(q);
        if (teamResult) {
            const { data: td } = teamResult;
            if (q.match(/next match|next game|fixture/)) {
                const nm = td.nextMatch;
                return `${td.name}'s next match: vs ${nm.opponent}, ${nm.competition}, ${nm.date} at ${nm.venue} (${nm.time}).`;
            }
            if (q.match(/last.*match|last.*result|recent result/)) {
                const lr = td.lastResult;
                return `${td.name}'s last result: ${lr.score} vs ${lr.opponent} — ${lr.result} on ${lr.date} (${lr.competition}).`;
            }
            if (q.match(/top scorer|goals/)) return `${td.name} top scorer: ${td.topScorer} with ${td.topScorerGoals} goals. Top assist: ${td.topAssist} (${td.topAssistCount} assists).`;
            if (q.match(/squad|players|key players/)) return `${td.name} key players: ${td.keyPlayers.join(', ')}. Manager: ${td.manager}.`;
            if (q.match(/manager|coach/)) return `${td.name}'s manager is ${td.manager}.`;
            if (q.match(/stadium|ground|arena/)) return `${td.name} play at ${td.stadium} (capacity ${td.capacity.toLocaleString()}).`;
            if (q.match(/trophies?|titles?|honours?/)) {
                const t = td.trophies;
                const entries = Object.entries(t).map(([k, v]) => `${v} ${k.replace(/([A-Z])/g, ' $1').trim()}`).join(', ');
                return `${td.name} trophies: ${entries}.`;
            }
            if (q.match(/table|standing|position/)) return `${td.name}: ${td.position}${td.position === 1 ? 'st' : td.position === 2 ? 'nd' : td.position === 3 ? 'rd' : 'th'} in ${td.league} with ${td.points} pts from ${td.played} games (W${td.won} D${td.drawn} L${td.lost}, GF:${td.goalsFor} GA:${td.goalsAgainst}).`;
            if (q.match(/ucl|champions league/)) return `${td.name} in UCL 2025-26: ${td.ucl2026}`;
            // Default team info
            return `${td.name}: ${td.position}${['st', 'nd', 'rd', 'th'][Math.min(td.position - 1, 3)]} in ${td.league}, ${td.points} pts from ${td.played} games. Top scorer: ${td.topScorer} (${td.topScorerGoals} goals). Manager: ${td.manager}. Stadium: ${td.stadium}.`;
        }

        // — LEAGUE TABLES —
        if (q.match(/bundesliga.*(table|standing|top|leaders?)|table.*bundesliga/)) {
            const rows = FootballDB.bundesliga.map(t => `${t.pos}. ${t.team} ${t.pts}pts (${t.p}G W${t.w} D${t.d} L${t.l} +${t.gf - t.ga})`).join('. ');
            return `Bundesliga 2025-26 Table (Top 5): ${rows}`;
        }
        if (q.match(/premier league.*(table|standing|top)|epl.*table|pl.*table|english.*table/)) {
            const rows = FootballDB.premierLeague.map(t => `${t.pos}. ${t.team} ${t.pts}pts (${t.p}G W${t.w} D${t.d} L${t.l})`).join('. ');
            return `Premier League 2025-26 Table (Top 8): ${rows}`;
        }
        if (q.match(/la liga.*(table|standing)|laliga/)) {
            const rows = FootballDB.laLiga.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ');
            return `La Liga 2025-26 Top 5: ${rows}`;
        }
        if (q.match(/serie a.*(table|standing)/)) {
            const rows = FootballDB.serieA.map(t => `${t.pos}. ${t.team} ${t.pts}pts`).join(', ');
            return `Serie A 2025-26 Top 5: ${rows}`;
        }

        // Specific teams without full data
        if (q.match(/\bpsg\b|paris saint.?germain/)) return `PSG trail Arsenal 1-3 after UCL QF 1st leg. 2nd leg: April 16, 2026 at Parc des Princes. PSG need at least 3 goals to progress. Former star Mbappé now plays for Real Madrid.`;
        if (q.match(/\binter milan\b|internazionale/)) return `Inter Milan drew 1-1 with Atletico Madrid in UCL QF 1st leg. 2nd leg: April 17. Top of Serie A with 60 points. Manager: Simone Inzaghi.`;
        if (q.match(/\bdortmund\b|borussia dortmund/) && !q.match(/bundesliga table/)) return `Borussia Dortmund beat Benfica 2-0 in UCL QF 1st leg. 2nd leg at home on April 17. 3rd in Bundesliga with ${FootballDB.bundesliga[2].pts} points.`;
        if (q.match(/\bbarcelona\b/) && !q.match(/la liga table/)) return `FC Barcelona are top of La Liga with ${FootballDB.laLiga[0].pts} points. They were eliminated from the Champions League this season. Robert Lewandowski leads their attack. Manager: Hansi Flick.`;
        if (q.match(/\bchelsa\b|\bchelsea\b/) && !q.match(/premier league table/)) return `Chelsea are 4th in the Premier League with ${FootballDB.premierLeague[3].pts} points. Manager: Enzo Maresca. They lost 1-2 to Arsenal on April 4.`;
        if (q.match(/\bnewcastle\b/)) return `Newcastle United are 5th in the Premier League with ${FootballDB.premierLeague[4].pts} points. They beat Man City 1-0 on April 3. Manager: Eddie Howe.`;
        if (q.match(/\bjuventus\b|juve\b/)) return `Juventus are 3rd in Serie A with ${FootballDB.serieA[2].pts} points this season.`;
        if (q.match(/\bnapoli\b/)) return `Napoli lead Serie A with ${FootballDB.serieA[0].pts} points — their title challenge is looking strong. Manager: Antonio Conte.`;
        if (q.match(/\batletico\b|atletico madrid/)) return `Atletico Madrid drew 1-1 at Inter Milan in the UCL QF 1st leg. 2nd leg at Wanda Metropolitano on April 17. 3rd in La Liga.`;

        // General football query
        if (q.match(/football|soccer|goal\b|match\b/))
            return `Latest: ${FootballDB.news[0]}. ${FootballDB.news[1]}. Ask me about any specific team, player, league or the Champions League for full details!`;

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
    { t: "Unholy", a: "Sam Smith", duration: 156 },
    { t: "Anti-Hero", a: "Taylor Swift", duration: 200 },
    { t: "Cruel Summer", a: "Taylor Swift", duration: 178 },
    { t: "Rich Flex", a: "Drake & 21 Savage", duration: 211 },
    { t: "Golden Hour", a: "JVKE", duration: 209 },
    { t: "Running Up That Hill", a: "Kate Bush", duration: 300 },
    { t: "Heat Waves", a: "Glass Animals", duration: 238 },
    { t: "Stay", a: "The Kid LAROI", duration: 141 },
    { t: "Peaches", a: "Justin Bieber", duration: 198 },
    { t: "Montero", a: "Lil Nas X", duration: 137 },
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

    return { play, toggle, next, prev, stop, setVol, seek, findSong, get curSong() { return curSong; }, get playing() { return playing; }, songs: SONGS };
})();

// ══════════════════════════════════════════════════════
//  ⓮  TTS ENGINE — Natural Female Voice
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
        return voices.find(v => /en/i.test(v.lang) && !v.localService)
            || voices.find(v => /en-US|en-GB/i.test(v.lang))
            || null;
    }

    function emotionParams(mood) {
        const state = EmotionEngine.get(mood);
        return { rate: state.rate, pitch: state.pitch };
    }

    function speak(text, mood) {
        if (!window.speechSynthesis) return;
        const clean = String(text)
            .replace(/<[^>]+>/g, '')
            .replace(/([^\w\s.,!?'\-:;()\/°%+])/g, ' ')
            .replace(/\s+/g, ' ').trim();
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
        const params = emotionParams(mood);
        utt.rate = params.rate;
        utt.pitch = params.pitch;
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
                UI.setLogo('idle');
                UI.waveOn(false);
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
        return active.map(t => {
            const rem = Math.max(0, Math.round((t.end - Date.now()) / 1000));
            return `${t.label} — ${rem}s remaining`;
        }).join(', ');
    }

    return { set, list, parse };
})();

// ══════════════════════════════════════════════════════
//  ⓱  MAIN AI PROCESSOR  (Orchestrator)
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

    // — Memory: detect user facts —
    const userFact = Memory.detectUserFact(q);
    if (userFact) { finalize(q, userFact); return; }

    // — Detect mood —
    const mood = EmotionEngine.detect(q);
    Memory.setMood(mood);

    // — Store in memory —
    Memory.push('user', q);

    let answer = null;

    // ── 1. ROAST ──
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

    if (q.match(/how many timers|active timers|my timers/i)) { finalize(q, TimerEngine.list(), 'neutral'); return; }

    // ── 3. MUSIC ──
    if (q.match(/play (music|songs?|something|a song)\b/i)) {
        MusicPlayer.play(0);
        finalize(q, `Playing "${SONGS[0].t}" by ${SONGS[0].a}. Enjoy!`); return;
    }
    const playMatch = q.match(/^(?:play|put on)\s+(.+)/i);
    if (playMatch) {
        const term = playMatch[1].toLowerCase().replace(/please|now|for me/g, '').trim();
        const idx = MusicPlayer.findSong(term);
        if (idx >= 0) {
            MusicPlayer.play(idx);
            finalize(q, `Playing "${SONGS[idx].t}" by ${SONGS[idx].a}`); return;
        }
    }
    if (q.match(/next (song|track)/i)) { MusicPlayer.next(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/previous (song|track)|go back|last song/i)) { MusicPlayer.prev(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/stop (music|playing)|stop music/i)) { MusicPlayer.stop(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/pause (music|song)|pause\b/i)) { MusicPlayer.toggle(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/resume\b|unpause/i)) { if (!MusicPlayer.playing) MusicPlayer.toggle(); UI.setLogo('idle'); UI.showThinking(false); return; }
    if (q.match(/shuffle/i)) {
        const on = !MusicPlayer.shuffleMode;
        finalize(q, on ? "Shuffle mode on. Let's mix it up!" : "Shuffle off."); return;
    }
    if (q.match(/volume up|louder|turn.*up/i)) { MusicPlayer.setVol(0.95); finalize(q, "Volume cranked up!"); return; }
    if (q.match(/volume down|quieter|turn.*down/i)) { MusicPlayer.setVol(0.5); finalize(q, "Volume turned down."); return; }
    if (q.match(/what.*playing|current.*song/i)) {
        if (MusicPlayer.curSong >= 0) { finalize(q, `Now playing: "${SONGS[MusicPlayer.curSong].t}" by ${SONGS[MusicPlayer.curSong].a}`); return; }
        finalize(q, "No music playing. Say 'play music' to start!"); return;
    }
    if (q.match(/list.*songs?|song.*list|playlist/i)) {
        const list = SONGS.slice(0, 10).map((s, i) => `${i + 1}. ${s.t} — ${s.a}`).join(', ');
        finalize(q, `Playlist: ${list}... and more!`); return;
    }

    // ── 4. FOOTBALL (try live API first, fallback to local) ──
    if (q.match(/football|soccer|goal\b|match|fixture|score|league|bundesliga|premier.*league|la liga|serie a|ucl|champions.*league|world.*cup|messi|ronaldo|haaland|mbapp|saka|salah|kane|vinicius|bellingham|musiala|liverpool|arsenal|bayern|chelsea|manchester|real madrid|barcelona|psg|dortmund|inter|atletico|napoli|juventus|transfer|squad|manager|stadium|trophy|title/i)) {
        // Try live API for live scores
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

    // ── 6. MATHS ──
    if (q.match(/\d|\bmath|calculate|compute|solve|equation|algebra|calculus|trigonometry|derivative|integral|factorial|sqrt|square root|percentage|mean|average|sin|cos|tan|log|ln\b/i)) {
        const result = MathEngine.solveWithSteps(q);
        if (result) {
            const stepStr = result.steps && result.steps.length > 0
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
    if (q.match(/convert|celsius|fahrenheit|kelvin|km|miles|meters|feet|kg|pounds|liters|gallons|mph|kmh|bytes|mb|gb|tb|inches|cm|oz|ounces/i)) {
        answer = UnitConverter.convert(q);
        if (answer) { finalize(q, answer); return; }
    }

    // ── 9. WEB SEARCH (DuckDuckGo + Wikipedia) ──
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
    const fallback = `${user ? `Sorry ${user}` : 'I\'m not sure'} about that. I can help with football, maths, physics, science, history, geography, music, timers, unit conversions, jokes and roasts. Try "what can you do" for the full list!`;
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
//  ⓲  JOKES / COMPLIMENTS
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
    "What do you call a fish without eyes? A fsh.",
    "Why did the scarecrow win an award? He was outstanding in his field.",
    "My WiFi went down for five minutes so I had to talk to my family. They seem nice.",
    "I'm reading a book about anti-gravity. It's impossible to put down.",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them."
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
//  ⓳  VOICE RECOGNITION ENGINE
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
                stopAll();
                UI.flashWake();
                UI.setLogo('listening');
                UI.setStatus('Hey! Listening…', '');
                UI.waveOn(true);
                if (isMobile && navigator.vibrate) navigator.vibrate(100);
                setTimeout(() => startChat(), 350);
            }
        };

        wake.onerror = (e) => {
            wakeActive = false;
            if (e.error !== 'aborted') setTimeout(() => startWake(), 2000);
        };
        wake.onend = () => {
            wakeActive = false;
            if (!chatActive) setTimeout(() => startWake(), 1200);
        };

        try { wake.start(); } catch (e) { wakeActive = false; setTimeout(() => startWake(), 2500); }
    }

    function startChat() {
        if (chatActive) return;
        stopAll();
        MusicPlayer.setVol(0.4); // duck music during listening
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { TTS.speak("Voice input requires Chrome or Edge. Please type your question."); return; }
        chat = new SR();
        chat.continuous = false;
        chat.interimResults = true;
        chat.lang = BINGO_CONFIG.defaultLang;
        chat.maxAlternatives = 3;
        chatActive = true;
        finalText = '';
        UI.setLogo('listening');
        UI.waveOn(true);
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

        chat.onerror = (e) => {
            if (e.error !== 'no-speech' && e.error !== 'aborted') UI.toast('Mic error: ' + e.error);
            chatActive = false;
        };

        chat.onend = () => {
            chatActive = false; chat = null;
            MusicPlayer.setVol(0.8); // restore volume
            if (finalText) { processInput(finalText); finalText = ''; }
            else {
                UI.setLogo('idle'); UI.waveOn(false);
                UI.setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
                setTimeout(() => startWake(), 600);
            }
        };

        try { chat.start(); }
        catch (e) { chatActive = false; UI.toast('Tap to try again'); setTimeout(() => startWake(), 1000); }
    }

    return { startWake, startChat, stopAll };
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
        const greet = `Hello! I'm Bingo Version 4 — your advanced AI assistant by Protogen AI. I've been upgraded with a full intelligence engine, real-time football data, step-by-step maths, savage roast mode, and web search. Say Bingo or tap to activate. Let's go!`;
        TTS.speak(greet, 'happy');
    }, 1200);

    setTimeout(() => VoiceRecog.startWake(), 4500);
});

// ══════════════════════════════════════════════════════
//  GLOBAL EXPORTS (backward compatibility + HTML buttons)
// ══════════════════════════════════════════════════════
window.onTap = onTap;
window.togglePlay = () => MusicPlayer.toggle();
window.nextSong = () => MusicPlayer.next();
window.prevSong = () => MusicPlayer.prev();
window.stopMusic = () => MusicPlayer.stop();
window.setVol = (v) => MusicPlayer.setVol(v);
window.toggleShuffle = () => {
    MusicPlayer.shuffleMode = !MusicPlayer.shuffleMode;
    TTS.speak(MusicPlayer.shuffleMode ? "Shuffle on." : "Shuffle off.");
};
window.toggleRepeat = () => {
    MusicPlayer.repeatMode = !MusicPlayer.repeatMode;
    TTS.speak(MusicPlayer.repeatMode ? "Repeat on." : "Repeat off.");
};
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

