// ═══════════════════════════════════════════════════════════════════════════
// PROTOGEN AI — BINGO VOICE ASSISTANT  V3.0
// Wake word : "Bingo"
// Created by: Martin Lutherking Owino — CEO, Protogen AI / HECO AFRICA
// ═══════════════════════════════════════════════════════════════════════════

'use strict';

// ══════════════════════════════════════════════════════
//  SONGS
// ══════════════════════════════════════════════════════
const SONGS = [
    { t: "Blinding Lights",        a: "The Weeknd",         duration: 200 },
    { t: "Shape of You",           a: "Ed Sheeran",         duration: 235 },
    { t: "Bohemian Rhapsody",      a: "Queen",              duration: 355 },
    { t: "Billie Jean",            a: "Michael Jackson",    duration: 293 },
    { t: "Lose Yourself",          a: "Eminem",             duration: 326 },
    { t: "Calm Down",              a: "Rema",               duration: 198 },
    { t: "Watermelon Sugar",       a: "Harry Styles",       duration: 173 },
    { t: "Flowers",                a: "Miley Cyrus",        duration: 200 },
    { t: "Perfect",                a: "Ed Sheeran",         duration: 263 },
    { t: "Levitating",             a: "Dua Lipa",           duration: 203 },
    { t: "As It Was",              a: "Harry Styles",       duration: 167 },
    { t: "Unholy",                 a: "Sam Smith",          duration: 156 },
    { t: "Anti-Hero",              a: "Taylor Swift",       duration: 200 },
    { t: "Cruel Summer",           a: "Taylor Swift",       duration: 178 },
    { t: "Rich Flex",              a: "Drake & 21 Savage",  duration: 211 },
    { t: "Golden Hour",            a: "JVKE",               duration: 209 },
    { t: "Running Up That Hill",   a: "Kate Bush",          duration: 300 },
    { t: "Heat Waves",             a: "Glass Animals",      duration: 238 },
    { t: "Stay",                   a: "The Kid LAROI",      duration: 141 },
    { t: "Peaches",                a: "Justin Bieber",      duration: 198 },
    { t: "Montero",                a: "Lil Nas X",          duration: 137 },
    { t: "Easy On Me",             a: "Adele",              duration: 224 }
];

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
let activeLang    = 'en-US';
let audioUnlocked = false;
let curSong       = -1;
let playing       = false;
let songPos       = 0;
let songDur       = 180;
let progTmr       = null;
let vol           = 0.8;
let audioCtx      = null;
let gainNode      = null;
let shuffleMode   = false;
let repeatMode    = false;
let songHistory   = [];
let isMobile      = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ══════════════════════════════════════════════════════
//  THESPORTSDB API  (free tier — no key)
// ══════════════════════════════════════════════════════
const API_BASE  = 'https://www.thesportsdb.com/api/v1/json/3';
const TEAM_IDS  = {
    'bayern munich': '133604',
    'bayern':        '133604',
    'liverpool':     '133602',
    'arsenal':       '133616',
    'manchester city': '133615',
    'man city':      '133615',
    'chelsea':       '133610',
    'real madrid':   '133739',
    'barcelona':     '133738',
    'borussia dortmund': '133667',
    'dortmund':      '133667',
    'inter milan':   '133736',
    'psg':           '133718'
};

async function apiFetch(url) {
    try {
        const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!r.ok) return null;
        return await r.json();
    } catch (e) {
        return null;
    }
}

async function getLiveScores() {
    const today = new Date().toISOString().split('T')[0];
    const data  = await apiFetch(`${API_BASE}/eventsday.php?d=${today}&s=Soccer`);
    if (data && data.events && data.events.length) return data.events;
    return null;
}

async function getTeamInfo(teamName) {
    const enc  = encodeURIComponent(teamName);
    const data = await apiFetch(`${API_BASE}/searchteams.php?t=${enc}`);
    if (data && data.teams && data.teams.length) return data.teams[0];
    return null;
}

async function getPlayerInfo(playerName) {
    const enc  = encodeURIComponent(playerName);
    const data = await apiFetch(`${API_BASE}/searchplayers.php?p=${enc}`);
    if (data && data.player && data.player.length) return data.player[0];
    return null;
}

async function getTeamFixtures(teamName) {
    const id = TEAM_IDS[teamName.toLowerCase()];
    if (!id) return null;
    const data = await apiFetch(`${API_BASE}/eventsnext.php?id=${id}`);
    if (data && data.events && data.events.length) return data.events;
    return null;
}

async function getLastResults(teamName) {
    const id = TEAM_IDS[teamName.toLowerCase()];
    if (!id) return null;
    const data = await apiFetch(`${API_BASE}/eventslast.php?id=${id}`);
    if (data && data.results && data.results.length) return data.results;
    return null;
}

// ══════════════════════════════════════════════════════
//  FOOTBALL FALLBACK DATA  (2025-26 season)
// ══════════════════════════════════════════════════════
const FOOTBALL = {

    bundesliga: [
        { pos:1, team:"Bayern Munich",       p:28, w:23, d:4, l:1, gf:101, ga:27, pts:73 },
        { pos:2, team:"Bayer Leverkusen",    p:28, w:18, d:6, l:4, gf: 64, ga:34, pts:60 },
        { pos:3, team:"Borussia Dortmund",   p:28, w:16, d:5, l:7, gf: 57, ga:42, pts:53 },
        { pos:4, team:"RB Leipzig",          p:28, w:14, d:6, l:8, gf: 52, ga:41, pts:48 },
        { pos:5, team:"Eintracht Frankfurt", p:28, w:13, d:5, l:10,gf: 49, ga:46, pts:44 }
    ],

    premierLeague: [
        { pos:1, team:"Liverpool",           p:31, w:23, d:6, l:2, gf:78, ga:30, pts:75 },
        { pos:2, team:"Arsenal",             p:31, w:21, d:6, l:4, gf:65, ga:28, pts:69 },
        { pos:3, team:"Manchester City",     p:31, w:18, d:5, l:8, gf:58, ga:38, pts:59 },
        { pos:4, team:"Chelsea",             p:31, w:16, d:5, l:10,gf:55, ga:44, pts:53 },
        { pos:5, team:"Newcastle United",    p:31, w:14, d:7, l:10,gf:48, ga:42, pts:49 }
    ],

    championsLeague: {
        stage: "Quarter-Finals",
        quarterFinals: [
            { home:"Bayern Munich",  hScore:2, away:"Real Madrid",    aScore:1, leg:"1st Leg", date:"April 8, 2026" },
            { home:"Inter Milan",    hScore:1, away:"Atletico Madrid", aScore:1, leg:"1st Leg", date:"April 8, 2026" },
            { home:"Arsenal",        hScore:3, away:"PSG",            aScore:1, leg:"1st Leg", date:"April 9, 2026" },
            { home:"Benfica",        hScore:0, away:"Dortmund",       aScore:2, leg:"1st Leg", date:"April 9, 2026" }
        ],
        secondLeg: [
            { date:"April 15, 2026", home:"Real Madrid",       away:"Bayern Munich",  comp:"UCL QF 2nd Leg", time:"21:00 CET" },
            { date:"April 16, 2026", home:"PSG",               away:"Arsenal",        comp:"UCL QF 2nd Leg", time:"21:00 CET" },
            { date:"April 17, 2026", home:"Atletico Madrid",   away:"Inter Milan",    comp:"UCL QF 2nd Leg", time:"21:00 CET" },
            { date:"April 17, 2026", home:"Borussia Dortmund", away:"Benfica",        comp:"UCL QF 2nd Leg", time:"21:00 CET" }
        ],
        eliminated: ["Liverpool (by PSG 4-0 agg)", "Chelsea", "Barcelona", "Manchester City"],
        semiFinalDates: "April 29 – May 6, 2026",
        final: { date: "May 30, 2026", venue: "Wembley Stadium, London" }
    },

    teams: {
        bayernMunich: {
            name:"FC Bayern Munich", country:"Germany", league:"Bundesliga",
            position:1, played:28, won:23, drawn:4, lost:1,
            goalsFor:101, goalsAgainst:27, points:73,
            topScorer:"Harry Kane", topScorerGoals:34,
            topAssist:"Jamal Musiala", topAssistCount:12,
            nextMatch:{ opponent:"Borussia Dortmund", competition:"Bundesliga", date:"April 19, 2026", venue:"Allianz Arena", time:"17:30 CET" },
            lastResult:{ opponent:"FC Augsburg", score:"3-0", result:"Win", date:"April 5, 2026", competition:"Bundesliga" },
            manager:"Vincent Kompany", stadium:"Allianz Arena", capacity:75024, founded:1900,
            keyPlayers:["Harry Kane","Jamal Musiala","Michael Olise","Joshua Kimmich","Manuel Neuer","Alphonso Davies","Leroy Sané"],
            trophies:{ bundesliga:33, dfbPokal:20, championsLeague:6, clubWorldCup:2 },
            colors:"Red and White", nickname:"Die Roten / FC Hollywood"
        },
        liverpool: {
            name:"Liverpool FC", country:"England", league:"Premier League",
            position:1, played:31, won:23, drawn:6, lost:2,
            goalsFor:78, goalsAgainst:30, points:75,
            topScorer:"Mohamed Salah", topScorerGoals:25,
            topAssist:"Mohamed Salah", topAssistCount:14,
            nextMatch:{ opponent:"West Ham United", competition:"Premier League", date:"April 19, 2026", venue:"London Stadium", time:"15:00 GMT" },
            lastResult:{ opponent:"Fulham", score:"3-1", result:"Win", date:"April 5, 2026", competition:"Premier League" },
            manager:"Arne Slot", stadium:"Anfield", capacity:61276, founded:1892,
            keyPlayers:["Mohamed Salah","Darwin Núñez","Cody Gakpo","Virgil van Dijk","Alisson","Trent Alexander-Arnold","Luis Díaz"],
            trophies:{ leagueTitles:19, faCup:8, leagueCup:10, championsLeague:6, uefaCup:3 },
            colors:"Red", nickname:"The Reds / The Merseysiders"
        }
    },

    players: {
        messi: {
            fullName:"Lionel Andres Messi", nationality:"Argentine",
            dob:"June 24, 1987", age:38,
            currentClub:"Inter Miami CF", position:"Forward",
            goals:903, matches:1146, assists:385, ballonDor:7,
            trophies:[
                "7 Ballon d'Or (2009 2010 2011 2012 2015 2019 2021)",
                "4 UEFA Champions League (2006 2009 2011 2015)",
                "10 La Liga titles with Barcelona",
                "1 FIFA World Cup (Qatar 2022)",
                "3 Copa America (2021 2024 runner-up 2015)",
                "1 Olympic Gold Medal (Beijing 2008)"
            ],
            records:[
                "Most Ballon d'Or awards: 7",
                "Most goals for a single club: 672 (Barcelona)",
                "Most La Liga goals: 474",
                "Most goals in a calendar year: 91 (2012)",
                "All-time leading scorer for Argentina: 109 goals"
            ],
            goatStatus: true
        },
        ronaldo: {
            fullName:"Cristiano Ronaldo dos Santos Aveiro", nationality:"Portuguese",
            dob:"February 5, 1985", age:41,
            currentClub:"Al Nassr (Saudi Arabia)", position:"Forward",
            goals:967, matches:1313, assists:275, ballonDor:5,
            trophies:[
                "5 Ballon d'Or (2008 2013 2014 2016 2017)",
                "5 UEFA Champions League (2008 2014 2016 2017 2018)",
                "3 Premier League titles",
                "2 La Liga titles",
                "1 UEFA European Championship (Euro 2016)",
                "1 UEFA Nations League (2019)"
            ],
            records:[
                "Most career goals in football history: 967",
                "Most Champions League goals: 140",
                "Most international goals: 143",
                "First player to score 100 international goals"
            ]
        }
    },

    upcomingFixtures: [
        { date:"April 15, 2026", home:"Real Madrid",       away:"Bayern Munich",      comp:"UCL QF 2nd Leg",  time:"21:00 CET" },
        { date:"April 16, 2026", home:"PSG",               away:"Arsenal",            comp:"UCL QF 2nd Leg",  time:"21:00 CET" },
        { date:"April 17, 2026", home:"Atletico Madrid",   away:"Inter Milan",        comp:"UCL QF 2nd Leg",  time:"21:00 CET" },
        { date:"April 17, 2026", home:"Borussia Dortmund", away:"Benfica",            comp:"UCL QF 2nd Leg",  time:"21:00 CET" },
        { date:"April 19, 2026", home:"Liverpool",         away:"West Ham United",    comp:"Premier League",  time:"15:00 GMT" },
        { date:"April 19, 2026", home:"Arsenal",           away:"Manchester City",    comp:"Premier League",  time:"16:30 GMT" },
        { date:"April 19, 2026", home:"Bayern Munich",     away:"Borussia Dortmund",  comp:"Bundesliga",      time:"17:30 CET" }
    ],

    recentResults: [
        { date:"April 8, 2026",  home:"Bayern Munich", hScore:2, away:"Real Madrid",  aScore:1, comp:"UCL QF 1st Leg" },
        { date:"April 9, 2026",  home:"Arsenal",       hScore:3, away:"PSG",          aScore:1, comp:"UCL QF 1st Leg" },
        { date:"April 5, 2026",  home:"Bayern Munich", hScore:3, away:"FC Augsburg",  aScore:0, comp:"Bundesliga" },
        { date:"April 5, 2026",  home:"Fulham",        hScore:1, away:"Liverpool",    aScore:3, comp:"Premier League" },
        { date:"April 4, 2026",  home:"Arsenal",       hScore:2, away:"Chelsea",      aScore:1, comp:"Premier League" },
        { date:"April 3, 2026",  home:"Man City",      hScore:0, away:"Newcastle",    aScore:1, comp:"Premier League" }
    ],

    news: [
        "Bayern Munich edge Real Madrid 2-1 in Champions League quarter-final first leg at Allianz Arena",
        "Arsenal stun PSG 3-1 at the Emirates in Champions League quarter-final",
        "Liverpool lead Premier League with 75 points — 6 points clear of Arsenal",
        "Harry Kane scores hat-trick to bring his Bundesliga tally to 34 goals this season",
        "Lionel Messi continues to defy age at 38 for Inter Miami in MLS",
        "Cristiano Ronaldo scores milestone 967th career goal for Al Nassr",
        "World Cup 2026 ticket sales open — USA Canada and Mexico await 48 nations"
    ],

    worldCup2026: {
        hosts:["United States","Canada","Mexico"],
        startDate:"June 11, 2026",
        finalDate:"July 19, 2026",
        teams:48, groups:12,
        finalVenue:"MetLife Stadium, New Jersey, USA",
        defending:"Argentina (Qatar 2022)",
        notable:"First World Cup with 48 teams and 3 co-hosts"
    }
};

// ══════════════════════════════════════════════════════
//  GEOGRAPHY
// ══════════════════════════════════════════════════════
const GEOGRAPHY = {
    capitals: {
        kenya:"Nairobi", nigeria:"Abuja",
        "south africa":"Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)",
        ghana:"Accra", ethiopia:"Addis Ababa", egypt:"Cairo", tanzania:"Dodoma",
        uganda:"Kampala", zimbabwe:"Harare", zambia:"Lusaka", mozambique:"Maputo",
        angola:"Luanda", cameroon:"Yaounde", senegal:"Dakar", mali:"Bamako",
        "ivory coast":"Yamoussoukro", somalia:"Mogadishu", sudan:"Khartoum",
        rwanda:"Kigali", burundi:"Gitega", malawi:"Lilongwe", botswana:"Gaborone",
        namibia:"Windhoek", "sierra leone":"Freetown", liberia:"Monrovia",
        togo:"Lome", benin:"Porto-Novo", niger:"Niamey", chad:"N'Djamena",
        "central african republic":"Bangui", madagascar:"Antananarivo",
        france:"Paris", germany:"Berlin", italy:"Rome", spain:"Madrid",
        portugal:"Lisbon", "united kingdom":"London", netherlands:"Amsterdam",
        belgium:"Brussels", switzerland:"Bern", austria:"Vienna", sweden:"Stockholm",
        norway:"Oslo", denmark:"Copenhagen", finland:"Helsinki", poland:"Warsaw",
        "czech republic":"Prague", hungary:"Budapest", greece:"Athens",
        ukraine:"Kyiv", romania:"Bucharest", russia:"Moscow",
        usa:"Washington D.C.", "united states":"Washington D.C.", canada:"Ottawa",
        mexico:"Mexico City", brazil:"Brasilia", argentina:"Buenos Aires",
        colombia:"Bogota", chile:"Santiago", peru:"Lima", venezuela:"Caracas",
        ecuador:"Quito", bolivia:"Sucre and La Paz",
        china:"Beijing", japan:"Tokyo", india:"New Delhi", "south korea":"Seoul",
        "north korea":"Pyongyang", indonesia:"Jakarta", philippines:"Manila",
        vietnam:"Hanoi", thailand:"Bangkok", malaysia:"Kuala Lumpur",
        singapore:"Singapore", pakistan:"Islamabad", bangladesh:"Dhaka",
        "saudi arabia":"Riyadh", iran:"Tehran", iraq:"Baghdad",
        israel:"Jerusalem", jordan:"Amman", turkey:"Ankara", afghanistan:"Kabul",
        australia:"Canberra", "new zealand":"Wellington"
    },
    facts: {
        largestCountry:   "Russia (17.1 million km squared)",
        smallestCountry:  "Vatican City (0.44 km squared)",
        longestRiver:     "Nile River (6,650 km) in Africa",
        largestOcean:     "Pacific Ocean (165.25 million km squared)",
        highestMountain:  "Mount Everest (8,849 m) in Nepal and Tibet",
        largestDesert:    "Antarctic Desert (14.2 million km squared) — Sahara is the largest hot desert at 9.2 million km squared",
        largestRainforest:"Amazon Rainforest, South America (5.5 million km squared)",
        greatWall:        "The Great Wall of China stretches approximately 21,196 km",
        deepestOcean:     "Mariana Trench (11,034 m deep) in the Pacific Ocean"
    }
};

// ══════════════════════════════════════════════════════
//  HISTORY
// ══════════════════════════════════════════════════════
const HISTORY = {
    ww1:               "World War 1 (1914-1918): Triggered by the assassination of Archduke Franz Ferdinand. Allied Powers — France, UK, Russia, USA — vs Central Powers — Germany, Austria-Hungary, Ottoman Empire. Over 20 million deaths. Ended with the Treaty of Versailles.",
    ww2:               "World War 2 (1939-1945): The largest conflict in history. Allies — UK, USA, USSR, France — vs Axis — Nazi Germany, Italy, Japan. Started with Germany's invasion of Poland. Over 70 million casualties. Ended May 1945 in Europe and September 1945 in the Pacific.",
    coldWar:           "The Cold War (1947-1991): Geopolitical tension between the USA and USSR after WW2. Featured the Space Race, nuclear arms race, Korean War, Vietnam War and Cuban Missile Crisis. Ended with the dissolution of the Soviet Union in 1991.",
    ancientEgypt:      "Ancient Egypt (3100-30 BC): One of the world's earliest civilisations on the Nile. Built the pyramids, developed hieroglyphics and worshipped pharaohs as gods. Cleopatra was the last pharaoh before Roman conquest.",
    romanEmpire:       "The Roman Empire (27 BC - 476 AD): Dominated the Mediterranean world. Spread Latin, Roman law and Christianity. Notable emperors include Julius Caesar, Augustus, Nero and Constantine.",
    renaissance:       "The Renaissance (14th-17th century): Cultural and intellectual rebirth in Europe. Masters like Leonardo da Vinci, Michelangelo and Raphael thrived. Science, art and philosophy were revolutionised.",
    frenchRevolution:  "The French Revolution (1789-1799): Overthrew the French monarchy. Ideals of Liberte, Egalite, Fraternite. Led to the rise of Napoleon Bonaparte.",
    industrialRevolution:"The Industrial Revolution (1760-1840): Began in Britain. Steam power, factories and machinery transformed society from agricultural to industrial.",
    martinLutherKing:  "Martin Luther King Jr. (1929-1968): American civil rights leader. Led the 1963 March on Washington and delivered his famous 'I Have a Dream' speech. Nobel Peace Prize 1964. Assassinated April 4, 1968.",
    nelsonMandela:     "Nelson Mandela (1918-2013): South African anti-apartheid activist. Imprisoned for 27 years. Became South Africa's first Black president 1994-1999. Nobel Peace Prize 1993.",
    gandhiMahatma:     "Mahatma Gandhi (1869-1948): Led India's non-violent independence movement against British rule. Championed civil disobedience. India gained independence in 1947. Assassinated January 30, 1948.",
    kenyaIndependence: "Kenya gained independence on December 12, 1963, from British colonial rule. Jomo Kenyatta became the first Prime Minister and later the first President of Kenya. This day is celebrated as Jamhuri Day.",
    columbusAmerica:   "Christopher Columbus reached the Americas in 1492, sailing for the Spanish Crown. He landed in the Caribbean on October 12, 1492.",
    moonLanding:       "Apollo 11 landed on the Moon on July 20, 1969. Neil Armstrong became the first human to walk on the lunar surface, saying 'That's one small step for man, one giant leap for mankind.'"
};

// ══════════════════════════════════════════════════════
//  TIME & DATE  (always uses new Date())
// ══════════════════════════════════════════════════════
function getCurrentTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', second:'2-digit', hour12:true });
    const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    return `The current time is ${timeStr}. Today is ${dateStr}.`;
}

function getCurrentDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    return `Today is ${dateStr}.`;
}

// ══════════════════════════════════════════════════════
//  MATH SOLVER
// ══════════════════════════════════════════════════════
function solveMath(question) {
    const q = question.toLowerCase().trim();

    // Percentage: "15% of 340"
    let m = q.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/);
    if (m) {
        const pct = parseFloat(m[1]), total = parseFloat(m[2]);
        return `${pct}% of ${total} = ${(pct / 100) * total}`;
    }

    // Square root
    m = q.match(/square\s*root\s*of\s*(\d+\.?\d*)|sqrt\s*\(?\s*(\d+\.?\d*)\s*\)?/);
    if (m) {
        const n = parseFloat(m[1] || m[2]);
        return `Square root of ${n} = ${Math.sqrt(n)}`;
    }

    // Cube root
    m = q.match(/cube\s*root\s*of\s*(\d+\.?\d*)/);
    if (m) {
        const n = parseFloat(m[1]);
        return `Cube root of ${n} = ${parseFloat(Math.cbrt(n).toFixed(6))}`;
    }

    // Power: "2 to the power of 10" or "2^10"
    m = q.match(/(\d+\.?\d*)\s*(?:to\s*the\s*power\s*of|raised\s*to|\^)\s*(\d+\.?\d*)/);
    if (m) {
        const base = parseFloat(m[1]), exp = parseFloat(m[2]);
        return `${base} to the power of ${exp} = ${Math.pow(base, exp)}`;
    }

    // Factorial: "5 factorial" or "5!"
    m = q.match(/(\d+)\s*!|(\d+)\s*factorial/);
    if (m) {
        const n = parseInt(m[1] || m[2]);
        if (n > 20) return `${n}! is a very large number — use a scientific calculator for factorials above 20.`;
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return `${n}! = ${f}`;
    }

    // Trigonometry: sin, cos, tan
    m = q.match(/\b(sin|cos|tan)\s*\(?\s*(\d+\.?\d*)\s*°?\s*\)?/);
    if (m) {
        const fn = m[1], deg = parseFloat(m[2]);
        const rad = deg * Math.PI / 180;
        const result = fn === 'sin' ? Math.sin(rad) : fn === 'cos' ? Math.cos(rad) : Math.tan(rad);
        return `${fn}(${deg} degrees) = ${parseFloat(result.toFixed(8))}`;
    }

    // Inverse trig: asin, acos, atan
    m = q.match(/\b(asin|arcsin|acos|arccos|atan|arctan)\s*\(?\s*(\d+\.?\d*)\s*\)?/);
    if (m) {
        const fn = m[1].replace('arc',''), n = parseFloat(m[2]);
        const r = fn === 'sin' ? Math.asin(n) : fn === 'cos' ? Math.acos(n) : Math.atan(n);
        return `${m[1]}(${n}) = ${parseFloat((r * 180 / Math.PI).toFixed(6))} degrees`;
    }

    // Natural log
    m = q.match(/\bln\s*\(?\s*(\d+\.?\d*)\s*\)?/);
    if (m) return `ln(${m[1]}) = ${parseFloat(Math.log(parseFloat(m[1])).toFixed(8))}`;

    // Log base 10
    m = q.match(/\blog\s*\(?\s*(\d+\.?\d*)\s*\)?/);
    if (m) return `log(${m[1]}) = ${parseFloat(Math.log10(parseFloat(m[1])).toFixed(8))}`;

    // Derivative: "derivative of x^n"
    m = q.match(/derivative\s+of\s+x\s*\^?\s*(\d+)/);
    if (m) {
        const n = parseInt(m[1]);
        if (n === 1) return `d/dx(x) = 1`;
        return `d/dx(x^${n}) = ${n}x^${n - 1}`;
    }

    // Integral: "integral of x^n"
    m = q.match(/integral\s+of\s+x\s*\^?\s*(\d+)/);
    if (m) {
        const n = parseInt(m[1]);
        return `Integral of x^${n} dx = x^${n + 1}/${n + 1} + C`;
    }

    // Quadratic: ax^2 + bx + c = 0  (handles x^2 or x2 or x squared)
    m = q.match(/(\d*\.?\d*)\s*x[\^²2]\s*([+\-]\s*\d+\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)\s*=\s*0/);
    if (m) {
        const a = m[1] === '' || m[1] === '0' ? 1 : parseFloat(m[1]);
        const b = parseFloat(m[2].replace(/\s/g,''));
        const c = parseFloat(m[3].replace(/\s/g,''));
        const disc = b * b - 4 * a * c;
        if (disc < 0) return `The equation has no real solutions (discriminant = ${disc} < 0).`;
        const x1 = parseFloat(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(6));
        const x2 = parseFloat(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(6));
        return x1 === x2
            ? `x = ${x1} (one repeated root)`
            : `x = ${x1} or x = ${x2}`;
    }

    // Linear: ax + b = c  or  ax - b = c
    m = q.match(/(\d*\.?\d*)\s*x\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)/);
    if (m) {
        const a    = m[1] === '' || m[1] === '0' ? 1 : parseFloat(m[1]);
        const sign = m[2] === '+' ? 1 : -1;
        const b    = sign * parseFloat(m[3]);
        const c    = parseFloat(m[4]);
        return `x = ${parseFloat(((c - b) / a).toFixed(6))}`;
    }

    // Simple x = something
    m = q.match(/(\d*\.?\d*)\s*x\s*=\s*(\d+\.?\d*)/);
    if (m) {
        const a = parseFloat(m[1]) || 1, c = parseFloat(m[2]);
        return `x = ${parseFloat((c / a).toFixed(6))}`;
    }

    // Basic arithmetic: handles numbers with operators
    m = q.match(/(\d+\.?\d*)\s*([\+\-\*\/x×÷])\s*(\d+\.?\d*)/);
    if (m) {
        const a = parseFloat(m[1]), b = parseFloat(m[3]), op = m[2];
        if (op === '+')                       return `${a} + ${b} = ${a + b}`;
        if (op === '-')                       return `${a} - ${b} = ${a - b}`;
        if (op === '*' || op === 'x' || op === '×') return `${a} x ${b} = ${a * b}`;
        if (op === '/' || op === '÷') {
            if (b === 0) return "Cannot divide by zero.";
            return `${a} divided by ${b} = ${parseFloat((a / b).toFixed(8))}`;
        }
    }

    // Absolute value
    m = q.match(/absolute\s*value\s*of\s*(-?\d+\.?\d*)/);
    if (m) return `|${m[1]}| = ${Math.abs(parseFloat(m[1]))}`;

    // Modulo / remainder
    m = q.match(/(\d+\.?\d*)\s*(?:mod|modulo|remainder.*divided.*by)\s*(\d+\.?\d*)/);
    if (m) return `${m[1]} mod ${m[2]} = ${parseFloat(m[1]) % parseFloat(m[2])}`;

    return null;
}

// ══════════════════════════════════════════════════════
//  PHYSICS SOLVER
// ══════════════════════════════════════════════════════
function solvePhysics(question) {
    const q = question.toLowerCase();
    const nums = [];
    const rx = /(\d+\.?\d*)/g;
    let nm;
    while ((nm = rx.exec(q)) !== null) nums.push(parseFloat(nm[1]));
    if (nums.length < 2) return null;

    const n = (i) => nums[i] !== undefined ? nums[i] : 0;

    if (q.includes('force') && (q.includes('mass') || q.includes('kg')) && (q.includes('acceleration') || q.includes('m/s')))
        return `Force: F = m x a = ${n(0)} kg x ${n(1)} m/s2 = ${n(0) * n(1)} Newtons`;

    if (q.includes('kinetic energy'))
        return `Kinetic Energy: KE = 0.5 x m x v2 = 0.5 x ${n(0)} x ${n(1)}2 = ${0.5 * n(0) * n(1) * n(1)} Joules`;

    if (q.includes('potential energy')) {
        const g = 9.81;
        return `Potential Energy: PE = m x g x h = ${n(0)} x ${g} x ${n(1)} = ${parseFloat((n(0) * g * n(1)).toFixed(3))} Joules`;
    }

    if (q.includes('ohm') || (q.includes('voltage') && q.includes('resistance')))
        return `Ohm's Law: V = I x R = ${n(0)} A x ${n(1)} Ohms = ${n(0) * n(1)} Volts`;

    if (q.includes('velocity') && q.includes('acceleration') && q.includes('time'))
        return `Velocity: v = u + at = ${n(0)} + (${n(1)} x ${n(2)}) = ${n(0) + n(1) * n(2)} m/s`;

    if (q.includes('work') && (q.includes('force') || q.includes('distance')))
        return `Work: W = F x d = ${n(0)} N x ${n(1)} m = ${n(0) * n(1)} Joules`;

    if (q.includes('power') && q.includes('time'))
        return `Power: P = W / t = ${n(0)} J divided by ${n(1)} s = ${parseFloat((n(0) / n(1)).toFixed(4))} Watts`;

    if (q.includes('momentum'))
        return `Momentum: p = m x v = ${n(0)} kg x ${n(1)} m/s = ${n(0) * n(1)} kg m/s`;

    if (q.includes('pressure') && (q.includes('force') || q.includes('area')))
        return `Pressure: P = F / A = ${n(0)} N divided by ${n(1)} m2 = ${parseFloat((n(0) / n(1)).toFixed(4))} Pascals`;

    if (q.match(/wave.*speed|speed.*wave|wavelength.*frequency/))
        return `Wave speed: v = f x lambda = ${n(0)} Hz x ${n(1)} m = ${n(0) * n(1)} m/s`;

    if (q.includes('gravitational') && q.includes('acceleration'))
        return `Acceleration due to gravity on Earth is 9.81 m/s squared.`;

    if (q.match(/density.*mass.*volume|density/))
        return `Density: rho = m / V = ${n(0)} kg divided by ${n(1)} m3 = ${parseFloat((n(0) / n(1)).toFixed(4))} kg/m3`;

    return null;
}

// ══════════════════════════════════════════════════════
//  UNIT CONVERTER
// ══════════════════════════════════════════════════════
function convertUnits(question) {
    const q = question.toLowerCase();
    const nm = q.match(/(\d+\.?\d*)/);
    if (!nm) return null;
    const n = parseFloat(nm[1]);

    // Temperature
    if (q.match(/celsius.*fahrenheit|°c.*°f|c to f/))   return `${n} degrees Celsius = ${parseFloat((n * 9/5 + 32).toFixed(2))} degrees Fahrenheit`;
    if (q.match(/fahrenheit.*celsius|°f.*°c|f to c/))   return `${n} degrees Fahrenheit = ${parseFloat(((n - 32) * 5/9).toFixed(2))} degrees Celsius`;
    if (q.match(/celsius.*kelvin|c to k/))               return `${n} degrees Celsius = ${parseFloat((n + 273.15).toFixed(2))} Kelvin`;
    if (q.match(/kelvin.*celsius|k to c/))               return `${n} Kelvin = ${parseFloat((n - 273.15).toFixed(2))} degrees Celsius`;
    if (q.match(/fahrenheit.*kelvin|f to k/))            return `${n} degrees Fahrenheit = ${parseFloat(((n - 32) * 5/9 + 273.15).toFixed(2))} Kelvin`;

    // Distance
    if (q.match(/km.*miles?|kilometres?.*miles?/))       return `${n} km = ${parseFloat((n * 0.621371).toFixed(4))} miles`;
    if (q.match(/miles?.*km/))                           return `${n} miles = ${parseFloat((n * 1.60934).toFixed(4))} km`;
    if (q.match(/meters?.*feet|m.*ft/))                  return `${n} meters = ${parseFloat((n * 3.28084).toFixed(4))} feet`;
    if (q.match(/feet.*meters?|ft.*m/))                  return `${n} feet = ${parseFloat((n * 0.3048).toFixed(4))} meters`;
    if (q.match(/cm.*inches?/))                          return `${n} cm = ${parseFloat((n * 0.393701).toFixed(4))} inches`;
    if (q.match(/inches?.*cm/))                          return `${n} inches = ${parseFloat((n * 2.54).toFixed(4))} cm`;
    if (q.match(/meters?.*yards?/))                      return `${n} meters = ${parseFloat((n * 1.09361).toFixed(4))} yards`;
    if (q.match(/yards?.*meters?/))                      return `${n} yards = ${parseFloat((n * 0.9144).toFixed(4))} meters`;
    if (q.match(/light.*year/))                          return `${n} light year(s) = ${parseFloat((n * 9.461e12).toExponential(4))} km`;

    // Weight
    if (q.match(/kg.*lbs?|kilograms?.*pounds?/))         return `${n} kg = ${parseFloat((n * 2.20462).toFixed(4))} lbs`;
    if (q.match(/lbs?.*kg|pounds?.*kg/))                 return `${n} lbs = ${parseFloat((n * 0.453592).toFixed(4))} kg`;
    if (q.match(/grams?.*ounces?|g.*oz/))                return `${n} g = ${parseFloat((n * 0.035274).toFixed(4))} oz`;
    if (q.match(/ounces?.*grams?|oz.*g/))                return `${n} oz = ${parseFloat((n * 28.3495).toFixed(4))} g`;
    if (q.match(/tonnes?.*kg/))                          return `${n} tonne(s) = ${n * 1000} kg`;
    if (q.match(/kg.*tonnes?/))                          return `${n} kg = ${n / 1000} tonnes`;

    // Volume
    if (q.match(/liters?.*gallons?|l.*gal/))             return `${n} L = ${parseFloat((n * 0.264172).toFixed(4))} gallons`;
    if (q.match(/gallons?.*liters?|gal.*l/))             return `${n} gallons = ${parseFloat((n * 3.78541).toFixed(4))} L`;
    if (q.match(/ml.*cups?/))                            return `${n} ml = ${parseFloat((n * 0.00422675).toFixed(6))} cups`;
    if (q.match(/cups?.*ml/))                            return `${n} cups = ${parseFloat((n * 236.588).toFixed(2))} ml`;
    if (q.match(/liters?.*ml|l.*ml/))                   return `${n} L = ${n * 1000} ml`;
    if (q.match(/ml.*liters?|ml.*l\b/))                 return `${n} ml = ${n / 1000} L`;

    // Speed
    if (q.match(/mph.*km\/h|mph.*kmh/))                  return `${n} mph = ${parseFloat((n * 1.60934).toFixed(4))} km/h`;
    if (q.match(/km\/h.*mph|kmh.*mph/))                  return `${n} km/h = ${parseFloat((n * 0.621371).toFixed(4))} mph`;
    if (q.match(/m\/s.*km\/h/))                          return `${n} m/s = ${parseFloat((n * 3.6).toFixed(4))} km/h`;
    if (q.match(/km\/h.*m\/s/))                          return `${n} km/h = ${parseFloat((n / 3.6).toFixed(4))} m/s`;
    if (q.match(/knots?.*km\/h/))                        return `${n} knots = ${parseFloat((n * 1.852).toFixed(4))} km/h`;

    // Data
    if (q.match(/mb.*gb/))   return `${n} MB = ${parseFloat((n / 1024).toFixed(6))} GB`;
    if (q.match(/gb.*tb/))   return `${n} GB = ${parseFloat((n / 1024).toFixed(6))} TB`;
    if (q.match(/gb.*mb/))   return `${n} GB = ${n * 1024} MB`;
    if (q.match(/tb.*gb/))   return `${n} TB = ${n * 1024} GB`;
    if (q.match(/kb.*mb/))   return `${n} KB = ${parseFloat((n / 1024).toFixed(6))} MB`;
    if (q.match(/mb.*kb/))   return `${n} MB = ${n * 1024} KB`;
    if (q.match(/bytes?.*kb/)) return `${n} bytes = ${parseFloat((n / 1024).toFixed(6))} KB`;

    // Currency hint (no live rates)
    if (q.match(/ksh.*usd|kenya.*dollar|shilling.*dollar/))
        return "I don't have live exchange rates. As of early 2026 approximately 130 Kenyan Shillings equal 1 US Dollar — check a currency app for real-time rates.";
    if (q.match(/usd.*ksh|dollar.*shilling/))
        return "I don't have live exchange rates. As of early 2026 approximately 1 US Dollar equals 130 Kenyan Shillings — check a currency app for real-time rates.";

    return null;
}

// ══════════════════════════════════════════════════════
//  JOKES / ROASTS / COMPLIMENTS
// ══════════════════════════════════════════════════════
const JOKES = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the math book look so sad? It had too many problems.",
    "What do you call a fake noodle? An impasta!",
    "Why did the AI go to therapy? Too many deep learning issues.",
    "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why can't you trust a ladder? It's always up to something.",
    "I asked Siri why I'm still single. She opened the front-facing camera.",
    "Why don't footballers use computers? Because they're afraid of the net!",
    "What do Harry Kane and a clock have in common? They both always hit the top corner!",
    "Why was the football pitch wet? Because the players kept dribbling!",
    "I told my dog he was adopted. He said he already knew — his tail never matched the family.",
    "What do you call a sleeping dinosaur? A dino-snore!"
];

const ROASTS = [
    "You're like a software update — I see you, but I'm not sure I need you.",
    "I'd explain it to you, but I left my crayons at home.",
    "Your secrets are safe with me. I never listen anyway.",
    "You're not stupid. You just have bad luck thinking.",
    "I'm not saying you're lazy, but you could trip over a cordless phone.",
    "You're the reason shampoo bottles have instructions.",
    "I'm jealous of people who haven't met you yet.",
    "You're like a cloud — when you disappear, it's a beautiful day!"
];

const COMPLIMENTS = [
    "You're the kind of person who makes the world better just by being in it.",
    "Smart people ask questions. That's exactly what you're doing!",
    "You have a brilliant mind. Keep learning and growing!",
    "Your curiosity is one of your greatest strengths.",
    "You're doing great — never stop exploring and asking questions!",
    "You make every conversation more interesting. Keep that energy!"
];

function getJoke()       { return JOKES[Math.floor(Math.random() * JOKES.length)]; }
function getRoast()      { return ROASTS[Math.floor(Math.random() * ROASTS.length)]; }
function getCompliment() { return COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]; }

// ══════════════════════════════════════════════════════
//  GENERAL KNOWLEDGE
// ══════════════════════════════════════════════════════
function getGeneralAnswer(question) {
    const q = question.toLowerCase().trim();

    // Time & Date
    if (q.match(/what.*(time|clock)|current time|time is it/))         return getCurrentTime();
    if (q.match(/what.*date|today.*date|date.*today/))                 return getCurrentDate();
    if (q.match(/what.*day\b|today.*day|which day/)) {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        return `Today is ${days[new Date().getDay()]}.`;
    }
    if (q.match(/what.*year/))   return `The current year is ${new Date().getFullYear()}.`;
    if (q.match(/what.*month/))  return `The current month is ${new Date().toLocaleDateString('en-US',{month:'long'})}.`;

    // Identity
    if (q.match(/who (created|made|built|developed) you|who is your (creator|developer|maker)/))
        return "I was created by the brilliant Martin Lutherking Owino — CEO and lead developer of Protogen AI under HECO AFRICA. He is a visionary technologist building Africa's AI future!";

    if (q.match(/who is martin (lutherking|owino)|martin owino/))
        return "Martin Lutherking Owino is the CEO and lead developer of Protogen AI under HECO AFRICA — a pioneering AI company in Africa. He built me, Bingo, to be the smartest voice assistant around!";

    if (q.match(/who are you|what are you|your name/))
        return "I'm Bingo — your intelligent AI voice assistant created by Protogen AI under HECO AFRICA. I can answer football questions, solve maths and physics, tell jokes, play music, convert units, and much more!";

    if (q.match(/what can you do|your (features|abilities|capabilities)|help me/))
        return "Here's what I can do: Football stats and live scores, Bundesliga and Premier League tables, Champions League updates, Messi and Ronaldo stats, Maths from basic arithmetic to calculus, Physics calculations, Unit conversions, History and geography, Jokes roasts and compliments, Music playback, Timers, and general knowledge. Just ask me anything!";

    if (q.match(/what is (protogen|heco africa)/))
        return "Protogen AI is a cutting-edge artificial intelligence company founded under HECO AFRICA by CEO Martin Lutherking Owino. Our mission is to build world-class AI solutions for Africa and beyond.";

    // Greetings
    if (q.match(/^(hi|hello|hey|howdy|what'?s? up|sup)\b/)) {
        const h = new Date().getHours();
        return `${h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"}! I'm Bingo. What would you like to know?`;
    }
    if (q.match(/good morning/))              return "Good morning! Hope your day is off to a great start. Ask me anything!";
    if (q.match(/good afternoon/))            return "Good afternoon! How can I help you?";
    if (q.match(/good evening|good night/))   return "Good evening! How can I assist you tonight?";
    if (q.match(/how are you|how do you feel/))
        return "I'm running perfectly and ready to help! Ask me about football, maths, history — anything!";
    if (q.match(/thank(s| you)|cheers|awesome/))
        return "You're very welcome! Always happy to help. Ask me anything else!";

    // Science & Tech facts
    if (q.match(/speed of light/))       return "The speed of light in a vacuum is approximately 299,792,458 metres per second, or about 300,000 km/s.";
    if (q.match(/speed of sound/))       return "The speed of sound in air at sea level is approximately 343 metres per second (1,235 km/h) at 20 degrees Celsius.";
    if (q.match(/what is dna/))          return "DNA (Deoxyribonucleic acid) is the molecule that carries the genetic instructions for the development, functioning, growth and reproduction of all known living organisms.";
    if (q.match(/what is ai|artificial intelligence/))
        return "Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems. It includes learning, reasoning, problem-solving, perception, and language understanding.";
    if (q.match(/what is the internet/)) return "The internet is a global network of interconnected computers and servers that communicate using standardised protocols. It was developed in the 1960s-70s and became publicly accessible in the 1990s.";
    if (q.match(/what is gravity/))      return "Gravity is a fundamental force of nature that attracts objects with mass toward one another. On Earth, gravity accelerates objects at 9.81 metres per second squared toward the centre of the planet.";
    if (q.match(/distance.*earth.*moon|moon.*distance/)) return "The average distance from Earth to the Moon is approximately 384,400 km.";
    if (q.match(/distance.*earth.*sun|sun.*distance/))   return "The average distance from Earth to the Sun is approximately 149.6 million km, also called 1 Astronomical Unit (1 AU).";
    if (q.match(/how old is (the )?earth/))              return "Earth is approximately 4.54 billion years old.";
    if (q.match(/how old is the universe/))              return "The universe is estimated to be approximately 13.8 billion years old, based on observations of the cosmic microwave background.";
    if (q.match(/pi\b|value of pi/))                     return "Pi (π) is approximately 3.14159265358979. It is the ratio of a circle's circumference to its diameter.";

    // History
    if (q.match(/world war (1|one|i)\b/) && !q.match(/world war (2|two|ii)/)) return HISTORY.ww1;
    if (q.match(/world war (2|two|ii)/))      return HISTORY.ww2;
    if (q.match(/cold war/))                  return HISTORY.coldWar;
    if (q.match(/ancient egypt/))             return HISTORY.ancientEgypt;
    if (q.match(/roman empire/))              return HISTORY.romanEmpire;
    if (q.match(/renaissance/))               return HISTORY.renaissance;
    if (q.match(/french revolution/))         return HISTORY.frenchRevolution;
    if (q.match(/industrial revolution/))     return HISTORY.industrialRevolution;
    if (q.match(/martin luther king|mlk/))    return HISTORY.martinLutherKing;
    if (q.match(/nelson mandela/))            return HISTORY.nelsonMandela;
    if (q.match(/mahatma gandhi|gandhi/))     return HISTORY.gandhiMahatma;
    if (q.match(/kenya.*independen|independen.*kenya/)) return HISTORY.kenyaIndependence;
    if (q.match(/christopher columbus|columbus/))       return HISTORY.columbusAmerica;
    if (q.match(/moon landing|neil armstrong|apollo 11/)) return HISTORY.moonLanding;

    // Geography — capitals
    const capMatch = q.match(/capital\s+(?:of|city\s+of)\s+(.+?)(?:\?|$)/);
    if (capMatch) {
        const country = capMatch[1].trim().replace(/\?/g,'').toLowerCase();
        const capital = GEOGRAPHY.capitals[country] || GEOGRAPHY.capitals[country.replace(/^the\s+/,'')];
        if (capital) return `The capital of ${country.charAt(0).toUpperCase() + country.slice(1)} is ${capital}.`;
        return `I don't have the capital of ${country} in my database. Try searching online for the latest information.`;
    }

    // Geography — facts
    if (q.match(/largest country/))                                return `The largest country in the world is ${GEOGRAPHY.facts.largestCountry}.`;
    if (q.match(/smallest country/))                               return `The smallest country in the world is ${GEOGRAPHY.facts.smallestCountry}.`;
    if (q.match(/longest river/))                                  return `The longest river in the world is the ${GEOGRAPHY.facts.longestRiver}.`;
    if (q.match(/largest ocean/))                                  return `The largest ocean in the world is the ${GEOGRAPHY.facts.largestOcean}.`;
    if (q.match(/highest mountain|tallest mountain|mount everest/)) return `The highest mountain is ${GEOGRAPHY.facts.highestMountain}.`;
    if (q.match(/largest desert/))                                 return GEOGRAPHY.facts.largestDesert;
    if (q.match(/amazon rainforest/))                              return GEOGRAPHY.facts.largestRainforest;
    if (q.match(/great wall of china/))                            return GEOGRAPHY.facts.greatWall;
    if (q.match(/deepest ocean|mariana trench/))                   return `The deepest point in the ocean is the ${GEOGRAPHY.facts.deepestOcean}.`;

    return null;
}

// ══════════════════════════════════════════════════════
//  FOOTBALL ANSWER (local fallback)
// ══════════════════════════════════════════════════════
function getFootballAnswer(question) {
    const q   = question.toLowerCase();
    const bm  = FOOTBALL.teams.bayernMunich;
    const liv = FOOTBALL.teams.liverpool;
    const mes = FOOTBALL.players.messi;
    const ron = FOOTBALL.players.ronaldo;

    // Live scores
    if (q.match(/live (score|match|game)|score.*now|currently playing/)) {
        const list = FOOTBALL.championsLeague.secondLeg.map(f =>
            `${f.date}: ${f.home} vs ${f.away} (${f.comp} at ${f.time})`
        ).join("; ");
        return `No live scores available right now. Today's scheduled fixtures: ${list}.`;
    }

    // Upcoming fixtures
    if (q.match(/upcoming|next.*fixtures?|fixture.*list|schedule/)) {
        const list = FOOTBALL.upcomingFixtures.map(f =>
            `${f.date}: ${f.home} vs ${f.away} — ${f.comp} at ${f.time}`
        ).join(". ");
        return `Upcoming Fixtures: ${list}`;
    }

    // Recent results
    if (q.match(/recent results?|latest results?|last.*results?/)) {
        const list = FOOTBALL.recentResults.map(r =>
            `${r.date}: ${r.home} ${r.hScore}-${r.aScore} ${r.away} (${r.comp})`
        ).join(". ");
        return `Recent Results: ${list}`;
    }

    // News
    if (q.match(/football news|latest news|latest football/))
        return `Football Headlines: ${FOOTBALL.news.join(". ")}`;

    // ── MESSI ──
    if (q.includes('messi')) {
        if (q.match(/messi.*ronaldo|ronaldo.*messi|vs|compare|better|goat.*debate/))
            return `Messi vs Ronaldo — the eternal debate! Messi: ${mes.goals} goals, ${mes.matches} matches, ${mes.assists} assists, ${mes.ballonDor} Ballon d'Or awards, 1 World Cup, 4 Champions League titles. Ronaldo: ${ron.goals} goals (all-time record), ${ron.matches} matches, ${ron.assists} assists, ${ron.ballonDor} Ballon d'Or awards, 5 Champions League titles, no World Cup. Messi won the 2022 World Cup to complete his legacy as the undisputed Greatest Of All Time!`;
        if (q.match(/goals?/))
            return `Lionel Messi has scored an extraordinary ${mes.goals} career goals in ${mes.matches} matches, with ${mes.assists} assists. He scored 672 goals for Barcelona alone — a record for any single club.`;
        if (q.match(/trophies?|titles?|honors?/))
            return `Lionel Messi's trophies: ${mes.trophies.join(", ")}.`;
        if (q.match(/records?/))
            return `Messi's records: ${mes.records.join(". ")}.`;
        if (q.match(/age|born|birthday/))
            return `Lionel Messi was born on ${mes.dob} and is ${mes.age} years old.`;
        if (q.match(/club|team|play/))
            return `Messi currently plays for ${mes.currentClub} in MLS.`;
        return `The Greatest Of All Time — Lionel Messi. Born ${mes.dob} in Rosario, Argentina. Career: ${mes.goals} goals, ${mes.assists} assists in ${mes.matches} matches. Awards: ${mes.ballonDor} Ballon d'Or awards — the most ever by any player — plus 1 World Cup, 4 Champions League titles, and 10 La Liga titles. His vision, dribbling, and genius remain unmatched in football history. Currently playing for ${mes.currentClub} at age ${mes.age}.`;
    }

    // ── RONALDO ──
    if (q.match(/\bronaldo\b|cristiano ronaldo/)) {
        if (q.match(/goals?/))
            return `Cristiano Ronaldo holds the all-time record with ${ron.goals} career goals in ${ron.matches} matches — more than any footballer in history!`;
        if (q.match(/trophies?|titles?/))
            return `Cristiano Ronaldo's trophies: ${ron.trophies.join(", ")}.`;
        if (q.match(/records?/))
            return `Ronaldo's records: ${ron.records.join(". ")}.`;
        return `Cristiano Ronaldo — one of the greatest footballers ever. Born ${ron.dob}. Career: ${ron.goals} goals (the all-time world record!), ${ron.assists} assists in ${ron.matches} matches. ${ron.ballonDor} Ballon d'Or awards, 5 Champions League titles, 1 Euro 2016. Currently plays for ${ron.currentClub}.`;
    }

    // ── HARRY KANE ──
    if (q.match(/harry kane|\bkane\b/))
        return `Harry Kane is Bayern Munich's star striker and the Bundesliga's top scorer with ${bm.topScorerGoals} goals this season. He joined Bayern Munich from Tottenham Hotspur and has been truly outstanding at the Allianz Arena.`;

    // ── MUSIALA ──
    if (q.match(/musiala/))
        return `Jamal Musiala is Bayern Munich's creative genius in midfield. He has ${bm.topAssistCount} assists this season, making him the top creator at Bayern. Born in Stuttgart in 2003, he is one of the brightest young talents in world football.`;

    // ── OLISE ──
    if (q.match(/\bolise\b/))
        return `Michael Olise joined Bayern Munich from Crystal Palace in 2024. The French winger has been electric at the Allianz Arena this season and is one of Bayern's key attackers.`;

    // ── SALAH ──
    if (q.match(/\bsalah\b|mo salah/))
        return `Mohamed Salah is Liverpool's captain and talisman. This season he has ${liv.topScorerGoals} Premier League goals and ${liv.topAssistCount} assists — the most in both categories at Liverpool. He remains one of the best players in the world at 32.`;

    // ── VAN DIJK ──
    if (q.match(/van dijk|virgil/))
        return `Virgil van Dijk is Liverpool's commanding centre-back and one of the best defenders in the world. He has been absolutely crucial to Liverpool's Premier League title challenge this season.`;

    // ── KIMMICH ──
    if (q.match(/kimmich/))
        return `Joshua Kimmich is Bayern Munich's midfield engine — a tireless, intelligent player who can play as defensive midfielder or right-back. He is one of the best midfielders in the world.`;

    // ── NEUER ──
    if (q.match(/\bneuer\b/))
        return `Manuel Neuer is Bayern Munich's legendary goalkeeper and one of the greatest in football history. He revolutionised the sweeper-keeper role and remains Bayern's first-choice keeper.`;

    // ── DAVIES ──
    if (q.match(/alphonso davies|davies/))
        return `Alphonso Davies is Bayern Munich's Canadian left-back known for his explosive pace and attacking ability. He is one of the fastest players in world football.`;

    // ── LIVERPOOL ──
    if (q.match(/\bliverpool\b|lfc\b|the reds\b/)) {
        if (q.match(/next match|next game|fixture/)) {
            const nm = liv.nextMatch;
            return `Liverpool's next match: vs ${nm.opponent}, ${nm.competition}, ${nm.date} at ${nm.venue}, kick-off ${nm.time}.`;
        }
        if (q.match(/last (match|result|game)|recent result/)) {
            const lr = liv.lastResult;
            return `Liverpool's last result: vs ${lr.opponent} — ${lr.score} (${lr.result}) on ${lr.date} in the ${lr.competition}.`;
        }
        if (q.match(/top scorer|goals/))
            return `Liverpool's top scorer is Mohamed Salah with ${liv.topScorerGoals} goals and ${liv.topAssistCount} assists this season.`;
        if (q.match(/squad|players|key players/))
            return `Liverpool's key players: ${liv.keyPlayers.join(", ")}. Manager: ${liv.manager}.`;
        if (q.match(/trophies?|titles?/))
            return `Liverpool's major trophies: ${liv.trophies.leagueTitles} league titles, ${liv.trophies.faCup} FA Cups, ${liv.trophies.leagueCup} League Cups, ${liv.trophies.championsLeague} Champions League titles.`;
        if (q.match(/manager|coach/))
            return `Liverpool's manager is ${liv.manager}, who replaced Jurgen Klopp in 2024.`;
        if (q.match(/stadium|anfield/))
            return `Liverpool play at Anfield which has a capacity of ${liv.capacity.toLocaleString()} seats. Anfield's famous Kop end is one of the most iconic stands in world football.`;
        if (q.match(/table|position|standing/))
            return `Liverpool are ${liv.position}st in the Premier League with ${liv.points} points from ${liv.played} games (W${liv.won} D${liv.drawn} L${liv.lost}), scoring ${liv.goalsFor} goals.`;
        return `Liverpool FC — Premier League leaders in ${new Date().getFullYear()} with ${liv.points} points from ${liv.played} games. Founded ${liv.founded}, Stadium: Anfield (${liv.capacity.toLocaleString()} capacity), Manager: ${liv.manager}, Top scorer: ${liv.topScorer} (${liv.topScorerGoals} goals, ${liv.topAssistCount} assists). Last result: ${liv.lastResult.score} vs ${liv.lastResult.opponent}.`;
    }

    // ── ARSENAL ──
    if (q.match(/\barsenal\b/)) {
        const ars = FOOTBALL.premierLeague.find(t => t.team === 'Arsenal');
        if (!ars) return null;
        return `Arsenal are ${ars.pos}nd in the Premier League with ${ars.pts} points from ${ars.p} games (W${ars.w} D${ars.d} L${ars.l}). They beat PSG 3-1 in the Champions League quarter-final first leg on April 9, 2026. Manager: Mikel Arteta. Stadium: Emirates Stadium (60,704 capacity).`;
    }

    // ── BAYERN MUNICH ──
    if (q.match(/\bbayern\b|fc bayern/)) {
        if (q.match(/next match|next game|fixture/)) {
            const nm = bm.nextMatch;
            return `Bayern Munich's next match: vs ${nm.opponent}, ${nm.competition}, ${nm.date} at ${nm.venue}, kick-off ${nm.time}.`;
        }
        if (q.match(/last (match|result|game)|recent result/)) {
            const lr = bm.lastResult;
            return `Bayern Munich's last result: ${lr.opponent} ${lr.score} (${lr.result}) on ${lr.date} in the ${lr.competition}.`;
        }
        if (q.match(/top scorer|goals?/))
            return `Bayern Munich's top scorer is Harry Kane with ${bm.topScorerGoals} Bundesliga goals this season. Top assist provider is Jamal Musiala with ${bm.topAssistCount} assists.`;
        if (q.match(/squad|players|key players/))
            return `Bayern Munich's key players: ${bm.keyPlayers.join(", ")}. Manager: ${bm.manager}.`;
        if (q.match(/trophies?|titles?/))
            return `Bayern Munich's trophies: ${bm.trophies.bundesliga} Bundesliga titles, ${bm.trophies.dfbPokal} DFB-Pokal titles, ${bm.trophies.championsLeague} Champions League titles.`;
        if (q.match(/manager|coach/))
            return `Bayern Munich's manager is ${bm.manager}, who took charge in 2024 replacing Thomas Tuchel.`;
        if (q.match(/stadium|allianz arena/))
            return `Bayern Munich play at the ${bm.stadium} which has a capacity of ${bm.capacity.toLocaleString()} seats. It opened in 2005 and is one of the most modern stadiums in the world.`;
        if (q.match(/table|position|standing/))
            return `Bayern Munich are ${bm.position}st in the Bundesliga with ${bm.points} points from ${bm.played} games (W${bm.won} D${bm.drawn} L${bm.lost}), scoring a league-best ${bm.goalsFor} goals.`;
        return `FC Bayern Munich — Germany's most successful club and Bundesliga leaders. ${bm.points} points from ${bm.played} games. Founded ${bm.founded}, Stadium: ${bm.stadium} (${bm.capacity.toLocaleString()} capacity), Manager: ${bm.manager}, Top scorer: ${bm.topScorer} (${bm.topScorerGoals} goals), Top assist: ${bm.topAssist} (${bm.topAssistCount} assists). Trophies: ${bm.trophies.bundesliga} Bundesliga, ${bm.trophies.dfbPokal} DFB-Pokal, ${bm.trophies.championsLeague} Champions League.`;
    }

    // ── BUNDESLIGA TABLE ──
    if (q.match(/bundesliga (table|standings?|top|leaders?)|top.*bundesliga/)) {
        const rows = FOOTBALL.bundesliga.map(t =>
            `${t.pos}. ${t.team} — ${t.pts} pts (${t.p} played, W${t.w} D${t.d} L${t.l}, GF ${t.gf} GA ${t.ga})`
        ).join(". ");
        return `Bundesliga 2025-26 Top 5: ${rows}`;
    }

    // ── PREMIER LEAGUE TABLE ──
    if (q.match(/premier league (table|standings?|top)|epl table|pl table/)) {
        const rows = FOOTBALL.premierLeague.map(t =>
            `${t.pos}. ${t.team} — ${t.pts} pts (${t.p} played, W${t.w} D${t.d} L${t.l})`
        ).join(". ");
        return `Premier League 2025-26 Top 5: ${rows}`;
    }

    // ── CHAMPIONS LEAGUE ──
    if (q.match(/champions league|ucl\b/)) {
        const cl = FOOTBALL.championsLeague;
        if (q.match(/quarter.?final|qf\b/)) {
            const list = cl.quarterFinals.map(m =>
                `${m.home} ${m.hScore}-${m.aScore} ${m.away} (${m.leg}, ${m.date})`
            ).join("; ");
            return `Champions League Quarter-Finals 2025-26 first-leg results: ${list}`;
        }
        if (q.match(/semi.?final|sf\b/))
            return `Champions League Semi-Final dates: ${cl.semiFinalDates}.`;
        if (q.match(/\bfinal\b/))
            return `The 2025-26 Champions League Final will be held on ${cl.final.date} at ${cl.final.venue}.`;
        if (q.match(/eliminated|knocked out/))
            return `Teams eliminated from the Champions League 2025-26: ${cl.eliminated.join(", ")}.`;
        return `Champions League 2025-26 is at the ${cl.stage}. Bayern Munich lead Real Madrid 2-1 after the first leg. Arsenal beat PSG 3-1. The final is on ${cl.final.date} at ${cl.final.venue}.`;
    }

    // ── WORLD CUP ──
    if (q.match(/world cup/)) {
        const wc = FOOTBALL.worldCup2026;
        return `FIFA World Cup 2026: Hosted by ${wc.hosts.join(", ")}. Dates: ${wc.startDate} to ${wc.finalDate}. ${wc.teams} teams in ${wc.groups} groups. Final venue: ${wc.finalVenue}. Defending champions: ${wc.defending}. ${wc.notable}.`;
    }

    // ── REAL MADRID ──
    if (q.match(/real madrid/))
        return `Real Madrid trail Bayern Munich 1-2 after the Champions League quarter-final first leg. Their second leg is on April 15, 2026 at the Bernabeu. Real Madrid have won the most Champions League titles — 15 in total.`;

    // ── PSG ──
    if (q.match(/\bpsg\b|paris saint.germain/))
        return `Paris Saint-Germain trail Arsenal 1-3 after the Champions League quarter-final first leg. Their second leg is on April 16, 2026 at Parc des Princes.`;

    // General football
    if (q.match(/football|soccer|goal\b|match\b|pitch\b|penalty\b|offside|referee/))
        return `Latest football news: ${FOOTBALL.news[0]}. ${FOOTBALL.news[1]}. Ask me about Bayern Munich, Liverpool, Messi, Ronaldo, the Champions League, Bundesliga, Premier League, or the 2026 World Cup for full stats!`;

    return null;
}

// ══════════════════════════════════════════════════════
//  LIVE API FOOTBALL ANSWER (tries API, falls back to local)
// ══════════════════════════════════════════════════════
async function getFootballAnswerLive(question) {
    const q = question.toLowerCase();

    // Live scores — try API first
    if (q.match(/live (score|match|game)|score.*now|currently playing|today.*match/)) {
        toast('Fetching live scores…');
        const events = await getLiveScores();
        if (events && events.length) {
            const live = events.slice(0, 5).map(e =>
                `${e.strHomeTeam} ${e.intHomeScore || 0}-${e.intAwayScore || 0} ${e.strAwayTeam} (${e.strLeague})`
            ).join("; ");
            return `Live matches today: ${live}`;
        }
        // fallback
        return getFootballAnswer(question);
    }

    // Next fixtures for specific team — try API
    const teamMatch = q.match(/(?:next|upcoming|fixtures?|schedule).*(?:for\s+)?(.+?)(?:\?|$)/);
    if (teamMatch && q.match(/next|upcoming|fixture/)) {
        const teamName = teamMatch[1].trim();
        const id = TEAM_IDS[teamName];
        if (id) {
            toast(`Fetching ${teamName} fixtures…`);
            const events = await getTeamFixtures(teamName);
            if (events && events.length) {
                const list = events.slice(0, 3).map(e =>
                    `${e.dateEvent}: ${e.strHomeTeam} vs ${e.strAwayTeam} (${e.strLeague})`
                ).join("; ");
                return `Upcoming fixtures for ${teamName}: ${list}`;
            }
        }
    }

    // Last results for specific team — try API
    if (q.match(/last result|recent result|last game|last match/)) {
        const teamName = q.includes('bayern') ? 'Bayern Munich' :
                         q.includes('liverpool') ? 'Liverpool' : null;
        if (teamName) {
            toast(`Fetching ${teamName} results…`);
            const results = await getLastResults(teamName);
            if (results && results.length) {
                const r = results[0];
                return `${teamName}'s last result: ${r.strHomeTeam} ${r.intHomeScore}-${r.intAwayScore} ${r.strAwayTeam} on ${r.dateEvent} (${r.strLeague})`;
            }
        }
    }

    return getFootballAnswer(question);
}

// ══════════════════════════════════════════════════════
//  MUSIC PLAYER
// ══════════════════════════════════════════════════════
function unlockAudio() {
    if (audioUnlocked) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = vol;
        gainNode.connect(audioCtx.destination);
        if (audioCtx.state === 'suspended') audioCtx.resume();
        audioUnlocked = true;
    } catch (e) { /* not critical */ }
}

function playSong(idx) {
    if (idx < 0 || idx >= SONGS.length) return;
    unlockAudio();
    if (curSong >= 0) songHistory.push(curSong);
    if (songHistory.length > 20) songHistory.shift();
    curSong  = idx;
    playing  = true;
    songPos  = 0;
    songDur  = SONGS[idx].duration || 180;
    clearInterval(progTmr);
    progTmr  = setInterval(tickSong, 1000);
    const player  = document.getElementById('player');
    const pTitle  = document.getElementById('pTitle');
    const pArtist = document.getElementById('pArtist');
    const playBtn = document.getElementById('playBtn');
    const pTot    = document.getElementById('pTot');
    if (player)  player.classList.add('on');
    if (pTitle)  pTitle.textContent  = SONGS[idx].t;
    if (pArtist) pArtist.textContent = SONGS[idx].a;
    if (playBtn) playBtn.textContent = '⏸';
    if (pTot)    pTot.textContent    = fmt(songDur);
    speakText(`Now playing ${SONGS[idx].t} by ${SONGS[idx].a}`);
}

function tickSong() {
    if (!playing) return;
    songPos++;
    const pfill = document.getElementById('pfill');
    const pCur  = document.getElementById('pCur');
    if (pfill) pfill.style.width = (songPos / songDur * 100) + '%';
    if (pCur)  pCur.textContent  = fmt(songPos);
    if (songPos >= songDur) {
        if (repeatMode) { songPos = 0; return; }
        nextSong();
    }
}

function togglePlay() {
    if (curSong < 0) { playSong(0); return; }
    playing = !playing;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.textContent = playing ? '⏸' : '▶';
    speakText(playing ? "Resuming music." : "Music paused.");
}

function nextSong() {
    clearInterval(progTmr);
    if (shuffleMode) {
        let idx;
        do { idx = Math.floor(Math.random() * SONGS.length); } while (idx === curSong && SONGS.length > 1);
        playSong(idx);
    } else {
        playSong((curSong + 1) % SONGS.length);
    }
}

function prevSong() {
    clearInterval(progTmr);
    if (songHistory.length > 0) {
        playSong(songHistory.pop());
    } else {
        playSong((curSong - 1 + SONGS.length) % SONGS.length);
    }
}

function stopMusic() {
    clearInterval(progTmr);
    playing = false;
    curSong = -1;
    songPos = 0;
    const player = document.getElementById('player');
    if (player) player.classList.remove('on');
    speakText("Music stopped.");
}

function toggleShuffle() {
    shuffleMode = !shuffleMode;
    speakText(shuffleMode ? "Shuffle on." : "Shuffle off.");
    toast(shuffleMode ? "Shuffle ON" : "Shuffle OFF");
}

function toggleRepeat() {
    repeatMode = !repeatMode;
    speakText(repeatMode ? "Repeat on." : "Repeat off.");
    toast(repeatMode ? "Repeat ON" : "Repeat OFF");
}

function setVol(v) {
    vol = Math.max(0, Math.min(1, parseFloat(v)));
    if (gainNode) gainNode.gain.value = vol;
    const slider = document.getElementById('volSlider');
    if (slider) slider.value = vol;
}

function fmt(s) {
    const sec = Math.floor(s) || 0;
    return Math.floor(sec / 60) + ':' + (sec % 60 < 10 ? '0' : '') + (sec % 60);
}

// ══════════════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════════════
function parseTimer(question) {
    const q = question.toLowerCase();
    const hr  = q.match(/(\d+)\s*hours?/);
    const min = q.match(/(\d+)\s*minutes?/);
    const sec = q.match(/(\d+)\s*seconds?/);
    let totalMs = 0, parts = [];
    if (hr)  { const h = parseInt(hr[1]);  totalMs += h * 3600000; parts.push(`${h} hour${h > 1 ? 's' : ''}`); }
    if (min) { const m = parseInt(min[1]); totalMs += m * 60000;   parts.push(`${m} minute${m > 1 ? 's' : ''}`); }
    if (sec) { const s = parseInt(sec[1]); totalMs += s * 1000;    parts.push(`${s} second${s > 1 ? 's' : ''}`); }
    return totalMs > 0 ? { ms: totalMs, label: parts.join(' and ') } : null;
}

function setTimer(question) {
    if (!question.match(/set.*timer|timer.*for|alarm/)) return null;
    const parsed = parseTimer(question);
    if (!parsed) return null;
    setTimeout(() => {
        speakText(`Timer done! ${parsed.label} have passed. Time is up!`);
        toast(`Timer done — ${parsed.label}`);
    }, parsed.ms);
    return `Timer set for ${parsed.label}. I will let you know when it is done!`;
}

// ══════════════════════════════════════════════════════
//  SPEECH SYNTHESIS
// ══════════════════════════════════════════════════════
let ttsQueue = [], ttsBusy = false;

function speakText(text) {
    if (!window.speechSynthesis) return;
    const clean = String(text)
        .replace(/<[^>]+>/g, '')
        .replace(/[^\w\s.,!?'\-:;()\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!clean) return;
    window.speechSynthesis.cancel();
    ttsQueue = [clean];
    ttsBusy  = false;
    drainTTS();
}

function drainTTS() {
    if (!ttsQueue.length) { ttsBusy = false; return; }
    ttsBusy = true;
    const text = ttsQueue.shift();
    const utt  = new SpeechSynthesisUtterance(text);
    utt.rate   = 0.92;
    utt.volume = 1;
    utt.pitch  = 1.05;
    utt.lang   = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
        /Google US English|Microsoft Aria|Samantha|Karen|Moira|Daniel/i.test(v.name)
    ) || voices.find(v => v.lang === 'en-US' && !v.localService)
      || voices.find(v => /en/i.test(v.lang));
    if (preferred) utt.voice = preferred;

    setLogo('speaking');
    waveOn(true);
    utt.onstart = () => setStatus('Bingo is speaking…', '');
    utt.onend   = () => {
        ttsBusy = false;
        if (!ttsQueue.length) {
            setLogo('idle');
            waveOn(false);
            setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
            setTimeout(() => VR.startWake(), 700);
        }
        drainTTS();
    };
    utt.onerror = () => { ttsBusy = false; drainTTS(); };
    window.speechSynthesis.speak(utt);
}

function stopSpeak() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    ttsQueue = [];
    ttsBusy  = false;
    setLogo('idle');
    waveOn(false);
}

if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ══════════════════════════════════════════════════════
//  MAIN PROCESSOR
// ══════════════════════════════════════════════════════
async function processInput(text) {
    const q = text.trim();
    if (!q) { VR.startWake(); return; }

    stopSpeak();
    setLogo('thinking');
    waveOn(false);
    setStatus('Thinking…', '');
    showTx(q, '');

    let answer = null;

    // 1. Football — try live API, fall back to local
    answer = await getFootballAnswerLive(q);
    if (answer) { finalize(q, answer); return; }

    // 2. General knowledge
    answer = getGeneralAnswer(q);
    if (answer) { finalize(q, answer); return; }

    // 3. Math
    answer = solveMath(q);
    if (answer) { finalize(q, answer); return; }

    // 4. Physics
    answer = solvePhysics(q);
    if (answer) { finalize(q, answer); return; }

    // 5. Unit conversion
    answer = convertUnits(q);
    if (answer) { finalize(q, answer); return; }

    // 6. Jokes / Roasts / Compliments
    if (q.match(/tell.*joke|joke\b|make me laugh/))         { finalize(q, getJoke());       return; }
    if (q.match(/roast me|roast\b/))                        { finalize(q, getRoast());      return; }
    if (q.match(/compliment me|compliment\b|say something nice/)) { finalize(q, getCompliment()); return; }

    // 7. Timer
    answer = setTimer(q);
    if (answer) { finalize(q, answer); return; }

    // 8. Music commands
    if (q.match(/play (music|songs?|something|a song)\b/))      { playSong(0); finalize(q, `Playing ${SONGS[0].t} by ${SONGS[0].a}`); return; }
    const playMatch = q.match(/^play (.+)/);
    if (playMatch) {
        const term = playMatch[1].toLowerCase();
        const idx  = SONGS.findIndex(s =>
            s.t.toLowerCase().includes(term) || s.a.toLowerCase().includes(term)
        );
        if (idx >= 0) { playSong(idx); finalize(q, `Playing ${SONGS[idx].t} by ${SONGS[idx].a}`); return; }
    }
    if (q.match(/next (song|track)/))                        { nextSong();    setLogo('idle'); return; }
    if (q.match(/previous (song|track)|go back/))           { prevSong();    setLogo('idle'); return; }
    if (q.match(/stop (music|playing)|stop music/))         { stopMusic();   setLogo('idle'); return; }
    if (q.match(/pause (music|song)|pause\b/))              { togglePlay();  setLogo('idle'); return; }
    if (q.match(/resume\b|unpause/))                        { if (!playing) togglePlay(); setLogo('idle'); return; }
    if (q.match(/shuffle/))                                 { toggleShuffle(); setLogo('idle'); return; }
    if (q.match(/repeat/))                                  { toggleRepeat();  setLogo('idle'); return; }
    if (q.match(/volume up|louder|turn.*up/))               { setVol(vol + 0.15); finalize(q, "Volume increased!"); return; }
    if (q.match(/volume down|quieter|turn.*down/))          { setVol(vol - 0.15); finalize(q, "Volume decreased."); return; }
    if (q.match(/what.*playing|current.*song/)) {
        if (curSong >= 0) { finalize(q, `Currently playing: ${SONGS[curSong].t} by ${SONGS[curSong].a}`); return; }
        finalize(q, "No music is playing right now. Say play music to start!"); return;
    }
    if (q.match(/list.*songs?|song.*list|playlist/)) {
        const list = SONGS.slice(0, 8).map((s, i) => `${i+1}. ${s.t} by ${s.a}`).join(", ");
        finalize(q, `Here are some songs: ${list} and more!`); return;
    }

    // 9. Wikipedia fallback
    setStatus('Searching…', '');
    toast('Searching…');
    try {
        const term = encodeURIComponent(q.replace(/\s+/g,'_').substring(0, 60));
        const resp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${term}`);
        if (resp.ok) {
            const data = await resp.json();
            if (data.extract && data.type !== 'disambiguation' && !data.title?.includes('not found')) {
                const summary = data.extract.substring(0, 450);
                finalize(q, summary);
                return;
            }
        }
    } catch (e) { /* ignore */ }

    finalize(q, `I'm not sure about that. Try asking me about football, maths, physics, history, geography, or say what can you do for a full list!`);
}

function finalize(question, answer) {
    showTx(question, answer);
    speakText(answer);
    setLogo('idle');
}

// ══════════════════════════════════════════════════════
//  SPEECH RECOGNITION
// ══════════════════════════════════════════════════════
const VR = {
    wake: null, chat: null,
    chatActive: false, wakeActive: false,
    finalText: '',

    stopAll() {
        try { if (this.wake) this.wake.abort(); } catch (e) {}
        try { if (this.chat) this.chat.abort(); } catch (e) {}
        this.wake = null; this.chat = null;
        this.chatActive = false; this.wakeActive = false;
    },

    startWake() {
        if (this.chatActive || this.wakeActive) return;
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        this.stopAll();
        this.wake                   = new SR();
        this.wake.continuous        = true;
        this.wake.interimResults    = true;
        this.wake.lang              = 'en-US';
        this.wake.maxAlternatives   = 3;
        this.wakeActive             = true;

        this.wake.onresult = (e) => {
            let txt = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                for (let a = 0; a < e.results[i].length; a++) {
                    txt += e.results[i][a].transcript.toLowerCase() + ' ';
                }
            }
            if (/\bbingo\b/.test(txt)) {
                this.stopAll();
                flashWake();
                setLogo('listening');
                setStatus('Hey! Listening…', '');
                waveOn(true);
                if (isMobile && navigator.vibrate) navigator.vibrate(100);
                setTimeout(() => this.startChat(), 350);
            }
        };

        this.wake.onerror = (e) => {
            this.wakeActive = false;
            if (e.error !== 'aborted') setTimeout(() => this.startWake(), 2000);
        };

        this.wake.onend = () => {
            this.wakeActive = false;
            if (!this.chatActive) setTimeout(() => this.startWake(), 1200);
        };

        try {
            this.wake.start();
        } catch (e) {
            this.wakeActive = false;
            setTimeout(() => this.startWake(), 2500);
        }
    },

    startChat() {
        if (this.chatActive) return;
        this.stopAll();
        unlockAudio();
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            speakText("Sorry, voice input requires Chrome or Edge. Please type your question.");
            return;
        }
        this.chat                   = new SR();
        this.chat.continuous        = false;
        this.chat.interimResults    = true;
        this.chat.lang              = activeLang;
        this.chat.maxAlternatives   = 3;
        this.chatActive             = true;
        this.finalText              = '';
        setLogo('listening');
        waveOn(true);
        setStatus('Listening…', 'Speak your question');

        this.chat.onresult = (e) => {
            let finalPart = '', interimPart = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) finalPart   += e.results[i][0].transcript;
                else                      interimPart += e.results[i][0].transcript;
            }
            if (finalPart)   this.finalText = finalPart.trim();
            if (interimPart) setStatus('Listening…', interimPart);
        };

        this.chat.onerror = (e) => {
            if (e.error !== 'no-speech' && e.error !== 'aborted') toast('Mic error: ' + e.error);
            this.chatActive = false;
        };

        this.chat.onend = () => {
            this.chatActive = false;
            this.chat       = null;
            if (this.finalText) {
                processInput(this.finalText);
                this.finalText = '';
            } else {
                setLogo('idle');
                waveOn(false);
                setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');
                setTimeout(() => this.startWake(), 600);
            }
        };

        try {
            this.chat.start();
        } catch (e) {
            this.chatActive = false;
            toast('Tap to try again');
            setTimeout(() => this.startWake(), 1000);
        }
    }
};

// ══════════════════════════════════════════════════════
//  UI HELPERS
// ══════════════════════════════════════════════════════
function setStatus(main, sub) {
    const mainEl = document.getElementById('statusMain');
    const subEl  = document.getElementById('statusSub');
    if (mainEl) mainEl.textContent = main;
    if (subEl && sub !== undefined) subEl.textContent = sub;
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
    if (el) {
        el.classList.add('on');
        setTimeout(() => el.classList.remove('on'), 900);
    }
}

function toast(msg, dur) {
    const el = document.getElementById('toast');
    if (!el) return;
    if (dur === undefined) dur = 2800;
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
    box._t = setTimeout(() => box.classList.remove('on'), 12000);
}

// ══════════════════════════════════════════════════════
//  TAP HANDLER
// ══════════════════════════════════════════════════════
function onTap() {
    if (VR.chatActive) return;
    unlockAudio();
    stopSpeak();
    if (isMobile && navigator.vibrate) navigator.vibrate(50);
    VR.startChat();
}

// ══════════════════════════════════════════════════════
//  STARTUP
// ══════════════════════════════════════════════════════
window.addEventListener('load', () => {
    setLogo('idle');
    setStatus('Say "Bingo"', isMobile ? 'Tap or say Bingo' : 'Tap orb or say "Bingo"');

    const logo = document.getElementById('logoOuter');
    if (logo) {
        logo.addEventListener('click',      onTap, { passive: true });
        logo.addEventListener('touchstart', onTap, { passive: true });
    }

    // Type-to-ask support (optional input field)
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
            if (inp.value.trim()) {
                processInput(inp.value.trim());
                inp.value = '';
            }
        });
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    setTimeout(() => {
        speakText("Hello! I'm Bingo, your AI voice assistant by Protogen AI. Say Bingo or tap to activate me. Ask me about football, maths, history, or anything!");
    }, 1500);

    setTimeout(() => VR.startWake(), 4500);
});

// ══════════════════════════════════════════════════════
//  SEEK HANDLER
// ══════════════════════════════════════════════════════
function seekSong(e) {
    const r = document.getElementById('ptrack');
    if (r && curSong >= 0) {
        const rect    = r.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        songPos = Math.floor(((clientX - rect.left) / rect.width) * songDur);
        songPos = Math.max(0, Math.min(songPos, songDur));
        const pfill = document.getElementById('pfill');
        const pCur  = document.getElementById('pCur');
        if (pfill) pfill.style.width = (songPos / songDur * 100) + '%';
        if (pCur)  pCur.textContent  = fmt(songPos);
    }
}

// ══════════════════════════════════════════════════════
//  EXPOSE GLOBALS
// ══════════════════════════════════════════════════════
window.onTap          = onTap;
window.togglePlay     = togglePlay;
window.nextSong       = nextSong;
window.prevSong       = prevSong;
window.stopMusic      = stopMusic;
window.setVol         = setVol;
window.toggleShuffle  = toggleShuffle;
window.toggleRepeat   = toggleRepeat;
window.processInput   = processInput;
window.speakText      = speakText;
window.setStatus      = setStatus;
window.waveOn         = waveOn;
window.setLogo        = setLogo;
window.flashWake      = flashWake;
window.toast          = toast;
window.showTx         = showTx;
window.seekSong       = seekSong;
