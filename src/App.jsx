import { useState, useEffect, useRef, useCallback } from "react";

const WORKER_URL = "https://scavenger-hunt.janelle-c56.workers.dev";
const TEAMS = ["Team Tramuntana", "Team Posidònia", "Team Es Vedrà"];
const TOTAL_TIME = 120 * 60;
const PASSCODE = "ibiza2026";
const SECRET_WORD = "WHITEISLAND";
const LETTER_MAP = { 1:"W", 2:"H", 3:"I", 4:"T", 5:"E", 6:"I", 7:"S", 8:"L", 9:"A", 10:"N", 11:"D" };

const THEME = {
  slate: "#3D5166",
  slateDark: "#2A3A4A",
  slateLight: "#EEF2F6",
  orange: "#E8522A",
  orangeLight: "#FDF0EC",
  white: "#FFFFFF",
  sand: "#F8F6F2",
  text: "#1A2530",
  textMid: "#4A5D6E",
  textLight: "#8A9DAE",
  gold: "#D4A017",
  goldLight: "#FDF3D0",
  success: "#2E7D52",
  successLight: "#E8F5EE",
};

const AVATARS = [
  { id: "marina", name: "Marina", color: "#E8522A" },
  { id: "captain", name: "Capt. Sal", color: "#2A3A4A" },
  { id: "flamenco", name: "Flamenco", color: "#F4A0B5" },
  { id: "skipper", name: "Skipper", color: "#3D5166" },
  { id: "bruno", name: "Bruno", color: "#E8C87A" },
  { id: "gato", name: "Gato", color: "#888888" },
  { id: "valentina", name: "Valentina", color: "#E8522A" },
  { id: "elmago", name: "El Mago", color: "#1A1A2E" },
];

function AvatarSVG({ id, size = 60 }) {
  const s = size;
  const avatars = {
    marina: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#3D5166"/>
        <path d="M72 38 Q88 48 92 68 Q96 82 88 90" fill="none" stroke="#2C1810" strokeWidth="8" strokeLinecap="round"/>
        <path d="M72 38 Q78 32 72 28" fill="none" stroke="#2C1810" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="72" cy="36" r="4" fill="#E8522A"/>
        <path d="M38 44 Q40 26 50 24 Q62 24 68 36 Q70 38 72 38" fill="#2C1810"/>
        <path d="M36 46 Q33 52 36 58" fill="#2C1810"/>
        <rect x="44" y="58" width="12" height="10" rx="3" fill="#F5C5A0"/>
        <circle cx="50" cy="44" r="18" fill="#F5C5A0"/>
        <circle cx="42" cy="42" r="7" fill="#1A2A3A" opacity="0.85"/>
        <circle cx="58" cy="42" r="7" fill="#1A2A3A" opacity="0.85"/>
        <circle cx="42" cy="42" r="7" fill="none" stroke="#E8522A" strokeWidth="1.5"/>
        <circle cx="58" cy="42" r="7" fill="none" stroke="#E8522A" strokeWidth="1.5"/>
        <line x1="49" y1="42" x2="51" y2="42" stroke="#E8522A" strokeWidth="1.5"/>
        <path d="M46 52 Q50 56 54 52" fill="#E87A6A"/>
        <path d="M40 68 Q48 64 50 66 Q52 64 60 68 L58 78 Q50 82 42 78Z" fill="#E8522A"/>
        <line x1="44" y1="66" x2="42" y2="60" stroke="#E8522A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="56" y1="66" x2="58" y2="60" stroke="#E8522A" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 78 Q36 90 38 96 Q50 100 62 96 Q64 90 60 78Z" fill="#E8522A"/>
        <circle cx="46" cy="85" r="1.5" fill="white" opacity="0.7"/>
        <circle cx="53" cy="88" r="1.5" fill="white" opacity="0.7"/>
        <circle cx="60" cy="85" r="1.5" fill="white" opacity="0.7"/>
      </svg>
    ),
    captain: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#3D5166"/>
        <path d="M30 38 L70 38 L65 26 L35 26Z" fill="#1A2A3A"/>
        <rect x="26" y="36" width="48" height="5" rx="1" fill="#1A2A3A"/>
        <circle cx="50" cy="52" r="18" fill="#D4956A"/>
        <ellipse cx="40" cy="48" rx="5" ry="4" fill="#1A2A3A"/>
        <line x1="35" y1="46" x2="28" y2="42" stroke="#1A2A3A" strokeWidth="1.5"/>
        <path d="M36 60 Q50 70 64 60 Q62 68 50 70 Q38 68 36 60Z" fill="#5C4030"/>
        <rect x="32" y="70" width="36" height="20" rx="4" fill="#1A2A3A"/>
        <line x1="50" y1="70" x2="50" y2="90" stroke="#E8522A" strokeWidth="2"/>
      </svg>
    ),
    flamenco: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#E8522A" opacity="0.15"/>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#E8522A" strokeWidth="2"/>
        <ellipse cx="50" cy="62" rx="16" ry="20" fill="#F4A0B5"/>
        <ellipse cx="40" cy="64" rx="8" ry="13" fill="#E8829A" opacity="0.6"/>
        <path d="M50 42 Q38 34 40 22 Q42 12 55 8" fill="none" stroke="#F4A0B5" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="57" cy="7" r="9" fill="#F4A0B5"/>
        <path d="M64 6 L72 4 L70 10 L64 10Z" fill="#E8522A"/>
        <circle cx="61" cy="4" r="2" fill="#1A2A3A"/>
        <rect x="55" y="2" width="7" height="4" rx="1" fill="#3D5166"/>
        <rect x="63" y="2" width="7" height="4" rx="1" fill="#3D5166"/>
        <path d="M40 56 Q50 62 60 56" fill="none" stroke="#D4A017" strokeWidth="2"/>
        <line x1="44" y1="82" x2="42" y2="96" stroke="#F07090" strokeWidth="3" strokeLinecap="round"/>
        <line x1="42" y1="96" x2="36" y2="100" stroke="#F07090" strokeWidth="2" strokeLinecap="round"/>
        <line x1="54" y1="82" x2="62" y2="94" stroke="#F07090" strokeWidth="3" strokeLinecap="round"/>
        <line x1="62" y1="94" x2="54" y2="100" stroke="#F07090" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    skipper: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#3D5166"/>
        <ellipse cx="50" cy="30" rx="20" ry="6" fill="white"/>
        <rect x="32" y="24" width="36" height="10" rx="3" fill="white"/>
        <rect x="38" y="20" width="24" height="6" rx="2" fill="#3D5166"/>
        <circle cx="50" cy="48" r="18" fill="#F5C5A0"/>
        <circle cx="42" cy="45" r="2.5" fill="#3D5166"/>
        <circle cx="58" cy="45" r="2.5" fill="#3D5166"/>
        <path d="M42 54 Q50 60 58 54" fill="none" stroke="#D4956A" strokeWidth="2" strokeLinecap="round"/>
        <rect x="32" y="66" width="36" height="22" rx="4" fill="white"/>
        <line x1="32" y1="72" x2="68" y2="72" stroke="#3D5166" strokeWidth="2.5"/>
        <line x1="32" y1="79" x2="68" y2="79" stroke="#3D5166" strokeWidth="2.5"/>
        <line x1="32" y1="86" x2="68" y2="86" stroke="#3D5166" strokeWidth="2.5"/>
      </svg>
    ),
    bruno: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#F5EFE0"/>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#E8522A" strokeWidth="2"/>
        <ellipse cx="50" cy="28" rx="22" ry="6" fill="#E8C87A"/>
        <rect x="28" y="22" width="44" height="12" rx="5" fill="#E8C87A"/>
        <circle cx="50" cy="46" r="18" fill="#F5C5A0"/>
        <ellipse cx="50" cy="48" rx="5" ry="4" fill="#E87A6A"/>
        <circle cx="42" cy="42" r="2.5" fill="#3D5166"/>
        <circle cx="58" cy="42" r="2.5" fill="#3D5166"/>
        <rect x="32" y="64" width="36" height="22" rx="4" fill="#E8522A"/>
        <circle cx="38" cy="72" r="3" fill="white" opacity="0.6"/>
        <circle cx="46" cy="78" r="3" fill="white" opacity="0.6"/>
        <circle cx="54" cy="72" r="3" fill="white" opacity="0.6"/>
        <circle cx="62" cy="78" r="3" fill="white" opacity="0.6"/>
        <rect x="40" y="58" width="20" height="10" rx="3" fill="#3D5166"/>
        <circle cx="50" cy="63" r="4" fill="#1A2A3A"/>
      </svg>
    ),
    gato: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#3D5166"/>
        <circle cx="50" cy="46" r="20" fill="#888"/>
        <polygon points="32,32 26,14 40,26" fill="#888"/>
        <polygon points="68,32 74,14 60,26" fill="#888"/>
        <polygon points="33,30 28,18 40,26" fill="#F4A0B5"/>
        <polygon points="67,30 72,18 60,26" fill="#F4A0B5"/>
        <ellipse cx="42" cy="43" rx="4" ry="5" fill="#1A2A3A"/>
        <ellipse cx="58" cy="43" rx="4" ry="5" fill="#1A2A3A"/>
        <circle cx="43" cy="41" r="1.5" fill="white"/>
        <circle cx="59" cy="41" r="1.5" fill="white"/>
        <polygon points="50,50 47,54 53,54" fill="#F4A0B5"/>
        <line x1="30" y1="51" x2="44" y2="52" stroke="white" strokeWidth="1"/>
        <line x1="30" y1="54" x2="44" y2="54" strokeWidth="1" stroke="white"/>
        <line x1="56" y1="52" x2="70" y2="51" stroke="white" strokeWidth="1"/>
        <line x1="56" y1="54" x2="70" y2="54" stroke="white" strokeWidth="1"/>
        <polygon points="38,68 50,74 38,80" fill="#E8522A"/>
        <polygon points="62,68 50,74 62,80" fill="#E8522A"/>
        <circle cx="50" cy="74" r="3" fill="#E8522A"/>
        <rect x="32" y="66" width="36" height="20" rx="5" fill="#666"/>
      </svg>
    ),
    valentina: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#E8522A" opacity="0.2"/>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#E8522A" strokeWidth="2"/>
        <circle cx="50" cy="26" r="14" fill="#2C1810"/>
        <circle cx="50" cy="18" r="7" fill="#E8522A"/>
        <circle cx="50" cy="40" r="14" fill="#D4956A"/>
        <path d="M40 36 Q43 33 46 36" fill="none" stroke="#2C1810" strokeWidth="1.5"/>
        <path d="M54 36 Q57 33 60 36" fill="none" stroke="#2C1810" strokeWidth="1.5"/>
        <path d="M44 44 Q50 48 56 44" fill="#E8522A"/>
        <path d="M28 54 Q50 66 72 54 Q76 80 50 84 Q24 80 28 54Z" fill="#E8522A"/>
        <line x1="28" y1="58" x2="14" y2="40" stroke="#D4956A" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="12" cy="37" r="5" fill="#D4956A"/>
        <circle cx="10" cy="34" r="4" fill="#2C1810"/>
      </svg>
    ),
    elmago: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#1A1A2E"/>
        <ellipse cx="50" cy="22" rx="20" ry="6" fill="#1A1A2E"/>
        <rect x="32" y="10" width="36" height="16" rx="3" fill="#1A1A2E"/>
        <rect x="28" y="24" width="44" height="4" rx="1" fill="#E8522A"/>
        <text x="62" y="18" fontSize="10" fill="#D4A017" fontFamily="sans-serif">✦</text>
        <text x="28" y="14" fontSize="8" fill="#D4A017" fontFamily="sans-serif">✦</text>
        <circle cx="50" cy="46" r="16" fill="#D4956A"/>
        <ellipse cx="43" cy="43" rx="4" ry="3" fill="#1A1A2E"/>
        <ellipse cx="57" cy="43" rx="4" ry="3" fill="#1A1A2E"/>
        <circle cx="44" cy="41" r="1.5" fill="white"/>
        <circle cx="58" cy="41" r="1.5" fill="white"/>
        <path d="M42 52 Q46 56 50 52 Q54 56 58 52" fill="#2C1810" stroke="#2C1810" strokeWidth="1"/>
        <path d="M28 62 Q50 76 72 62 Q70 84 50 88 Q30 84 28 62Z" fill="#1A1A2E"/>
        <path d="M28 62 Q50 72 72 62" fill="none" stroke="#E8522A" strokeWidth="2"/>
        <line x1="62" y1="58" x2="78" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="80" cy="38" r="4" fill="#D4A017"/>
      </svg>
    ),
  };
  return avatars[id] || null;
}

const CHALLENGES = [
  { id:1, type:"photo", emoji:"🚪", location:"Portal de ses Taules — The Grand Entrance", clue:"I am the grandest way in, guarded by two ancient Romans and a bridge that once moved. Cross me to step back in time.", task:"Take a team photo with the Roman statues flanking the gateway — one person must pose like they're crossing a drawbridge dramatically.", hint:"The gateway is between the bastions of Sant Joan and Santa Llúcia. The Roman busts sit in alcoves either side of the archway.", points:150, coords:{lat:38.9083,lng:1.4367} },
  { id:2, type:"trivia", emoji:"⛪", location:"Catedral de Santa Maria — The High Ground", clue:"Climb to the very peak where the Gothic meets the Baroque. I watch over the harbour and the sea, standing where an Arab mosque once stood.", task:"Count the number of bells in the tower, or find the date inscribed near the entrance.", hint:"The cathedral was built from the 14th century on the site of a mosque. Look above the doorway for inscriptions.", answer:"1592", altAnswers:["1","one","14th","four","4"], points:100, coords:{lat:38.9068,lng:1.4365} },
  { id:3, type:"photo", emoji:"💣", location:"Baluarte de Santa Llúcia — The Pirate Defenders", clue:"Find the heavy iron tubes at Baluarte de Santa Llúcia. They once barked at invaders and pirates to keep this fortress safe.", task:"Pose the whole team pointing the largest cannon toward the harbour — your best pirate-defending formation!", hint:"The bastions are on the seaward side of the walls. The cannons face out toward the Mediterranean.", points:150, coords:{lat:38.9083,lng:1.4386} },
  { id:4, type:"photo", emoji:"🦅", location:"Portal de ses Taules — Imperial Coat of Arms", clue:"Above the Grand Entrance, an eagle spreads its wings beneath a crown. The empire's symbol has watched over this gate for centuries.", task:"Recreate the imperial coat of arms as a human tableau — someone must be the eagle, arms spread wide.", hint:"Look up at the carved stone crest directly above the archway at Portal de ses Taules.", points:125, coords:{lat:38.9083,lng:1.4367} },
  { id:5, type:"photo", emoji:"🥐", location:"Convent of Sant Cristòfol — The Sweet Turntable", clue:"Visit the Convent of San Cristóbal, where the walls keep secrets and the nuns keep treats.", task:"Buy a local sweet or bread made by the cloistered nuns and take a team photo enjoying it. (Expenses reimbursed!) Open 9–13:00 and 16–20:00. If closed, buy a sweet from any nearby café and photo outside the convent — full points!", hint:"Ring the bell at the wooden torno window. Pastries from €1.", points:175, coords:{lat:38.9072,lng:1.4342} },
  { id:6, type:"trivia", emoji:"🏺", location:"MACE Museum — The Hidden Foundations", clue:"Head to the Museum of Contemporary Art, but don't just look at the paintings. Peer through the glass floor to see the ancient Phoenician house waiting below.", task:"Identify one artefact or item found in the Phoenician ruins visible through the glass floor.", hint:"The ruins are visible through a glass panel on the ground floor. Look for labels nearby.", answer:"phoenician", altAnswers:["pottery","amphora","wall","mosaic","ceramic","coins","ruins","jar","stone"], points:100, coords:{lat:38.9083,lng:1.4363} },
  { id:7, type:"photo", emoji:"🗿", location:"Plaça d'Espanya — The Reclining Conqueror", clue:"I am the man who took this island back in the 13th century. You'll find me taking it easy, reclining in stone near the seat of power.", task:"Find the shield or crest near the statue and photograph a team member mimicking the reclining pose.", hint:"Guillem de Montgrí is in Plaça d'Espanya.", points:125, coords:{lat:38.9069,lng:1.4382} },
  { id:8, type:"photo", emoji:"🐱", location:"Anywhere in Dalt Vila — Local Cat", clue:"Dalt Vila's most charming residents don't pay rent and answer to no one.", task:"Photograph a Dalt Vila resident cat. Bonus style points if it looks unimpressed.", hint:"Cats lounge near quieter alleyways and sunny steps toward the upper town.", points:75, coords:{lat:38.9075,lng:1.4365} },
  { id:9, type:"photo", emoji:"🚢", location:"Harbour View — Cruise Ship", clue:"One of the great floating cities may be docked in port today. Find it and prove it.", task:"Photograph a cruise ship visible from the harbour or the walls of Dalt Vila.", hint:"Best views from the bastions or harbour promenade below Dalt Vila.", points:100, coords:{lat:38.9083,lng:1.4386} },
  { id:10, type:"photo", emoji:"🌿", location:"Anywhere — Island Drink", clue:"This island has its own herbal spirit, made from local plants and tradition.", task:"Photograph a menu, bottle, sign, or bar display showing a drink named after Ibiza. No need to buy it!", hint:"Hierbas Ibicencas is the island's famous herbal liqueur.", points:75, coords:{lat:38.9075,lng:1.4365} },
  { id:11, type:"photo", emoji:"📮", location:"Anywhere — Ibiza Postcard", clue:"Before smartphones there were postcards. The tradition lives on.", task:"Find and photograph a physical Ibiza postcard — bonus points if it's gloriously tacky.", hint:"Gift shops near Portal de ses Taules and along the harbour front.", points:50, coords:{lat:38.9083,lng:1.4367} },
  { id:12, type:"photo", emoji:"🎩", location:"Mango Store — Steve's Fur Hat Moment", clue:"Your boss once made a questionable fashion statement in a Mango store. History must repeat itself.", task:"Find a fur hat AND a fur/fluffy bag in the Mango store and recreate Steve's iconic photo — same pose, same energy.", hint:"Mango is on Avinguda de Santa Eulàlia des Riu, just outside Dalt Vila. Open until 9pm.", points:200, coords:{lat:38.9108,lng:1.4345}, bonus:true, referencePhoto:"https://i.ibb.co/BVGd1kRx/IMG-1533.jpg" },
  { id:13, type:"photo", emoji:"🅰️", location:"Harbour Area — Ibiza Eivissa Sign", clue:"Find the giant letters that spell out this island's dual name. Strike your best family portrait pose.", task:"Take a classic 'family photo' in front of the IBIZA EIVISSA sign — stiff poses, cheesy smiles, arms-crossed dad energy.", hint:"Near the harbour/marina area at the foot of Dalt Vila. Ask a local!", points:150, coords:{lat:38.9082,lng:1.4367}, bonus:true },
];

function formatTime(s) {
  const m = Math.floor(s/60).toString().padStart(2,"0");
  return `${m}:${(s%60).toString().padStart(2,"0")}`;
}

function openMap(c) {
  window.open(`https://www.google.com/maps/search/?api=1&query=${c.coords.lat},${c.coords.lng}`,"_blank");
}

const regular = CHALLENGES.filter(c => !c.bonus);
const bonus = CHALLENGES.filter(c => c.bonus);
const totalPossible = CHALLENGES.reduce((s,c) => s+c.points,0) + 300;

const initLocal = () => ({
  scores: Object.fromEntries(TEAMS.map(t=>[t,0])),
  completed: Object.fromEntries(TEAMS.map(t=>[t,[]])),
  hints: {},
  timeLeft: TOTAL_TIME,
  timerRunning: false,
  avatars: {},
  positions: {},
});

const S = (extra={}) => ({ border:`1.5px solid ${THEME.slateLight}`, borderRadius:12, cursor:"pointer", fontFamily:"inherit", fontSize:14, ...extra });

export default function App() {
  const [view, setView] = useState("splash");
  const [activeTeam, setActiveTeam] = useState(null);
  const [state, setState] = useState(initLocal());
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [photos, setPhotos] = useState({});
  const [adminPass, setAdminPass] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminErr, setAdminErr] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [cloudPhotos, setCloudPhotos] = useState({});
  const [warned30, setWarned30] = useState(false);
  const [warned10, setWarned10] = useState(false);
  const [showWarning, setShowWarning] = useState(null);
  const [secretGuess, setSecretGuess] = useState("");
  const [secretFeedback, setSecretFeedback] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const teamMarkers = useRef({});
  const fileRefs = useRef({});
  const pendingSync = useRef(null);
  const timerRef = useRef(null);
  const watchId = useRef(null);

  useEffect(() => { fetchState(); fetchPhotos(); }, []);
  useEffect(() => { const i = setInterval(fetchState, 10000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (state.timerRunning && state.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setState(s => { const next = {...s, timeLeft: s.timeLeft-1}; schedulePush(next); return next; });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [state.timerRunning, state.timeLeft]);

  useEffect(() => {
    if (state.timerRunning) {
      if (state.timeLeft <= 1800 && state.timeLeft > 1790 && !warned30) { setShowWarning("30"); setWarned30(true); setTimeout(()=>setShowWarning(null),5000); }
      if (state.timeLeft <= 600 && state.timeLeft > 590 && !warned10) { setShowWarning("10"); setWarned10(true); setTimeout(()=>setShowWarning(null),5000); }
    }
  }, [state.timeLeft, state.timerRunning]);

  // GPS tracking
  useEffect(() => {
    if (view === "map" && activeTeam && navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        updateState(s => ({
          ...s,
          positions: { ...s.positions, [activeTeam]: { lat, lng, ts: Date.now() } }
        }));
      }, null, { enableHighAccuracy: true, maximumAge: 5000 });
    }
    return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); };
  }, [view, activeTeam]);

  // Init Leaflet map
  useEffect(() => {
    if (view !== "map" || !mapRef.current || leafletMap.current) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
      setTimeout(() => {
        if (!mapRef.current) return;
        const L = window.L;
        const map = L.map(mapRef.current).setView([38.9075, 1.4370], 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
        leafletMap.current = map;
        // Add challenge markers
        CHALLENGES.forEach(c => {
          const icon = L.divIcon({ html: `<div style="background:${THEME.slate};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">${c.emoji}</div>`, iconSize:[32,32], className:"" });
          L.marker([c.coords.lat, c.coords.lng], {icon}).addTo(map).bindPopup(`<b>${c.location}</b><br>${c.points} pts`);
        });
        setMapLoaded(true);
      }, 300);
    };
    document.head.appendChild(script);
  }, [view]);

  // Update team avatar markers on map
  useEffect(() => {
    if (!leafletMap.current || !mapLoaded) return;
    const L = window.L;
    const teamColors = { [TEAMS[0]]: THEME.orange, [TEAMS[1]]: THEME.success, [TEAMS[2]]: THEME.gold };
    Object.entries(state.positions || {}).forEach(([team, pos]) => {
      if (!pos) return;
      const avatarId = state.avatars?.[team];
      const color = teamColors[team] || THEME.slate;
      const html = `<div style="background:${color};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);font-size:18px">${avatarId ? "👤" : "📍"}</div>`;
      const icon = L.divIcon({ html, iconSize:[36,36], className:"" });
      if (teamMarkers.current[team]) {
        teamMarkers.current[team].setLatLng([pos.lat, pos.lng]);
      } else {
        teamMarkers.current[team] = L.marker([pos.lat, pos.lng], {icon}).addTo(leafletMap.current).bindPopup(team);
      }
    });
  }, [state.positions, mapLoaded]);

  async function fetchState() {
    try { const r = await fetch(`${WORKER_URL}/state`); const d = await r.json(); setState(s=>({...s,...d})); setLastSync(new Date()); } catch(e) {}
  }
  async function fetchPhotos() {
    try { const r = await fetch(`${WORKER_URL}/photos`); const d = await r.json(); setCloudPhotos(d); } catch(e) {}
  }
  function schedulePush(ns) { clearTimeout(pendingSync.current); pendingSync.current = setTimeout(()=>pushState(ns),1000); }
  async function pushState(ns) {
    setSyncing(true);
    try { await fetch(`${WORKER_URL}/update`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ns)}); setLastSync(new Date()); } catch(e) {}
    setSyncing(false);
  }
  function updateState(updater) { setState(s => { const next = updater(s); schedulePush(next); return next; }); }

  async function compressAndUpload(file, team, challengeId) {
    return new Promise(resolve => {
      const img = new Image(); const reader = new FileReader();
      reader.onload = e => {
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX = 800; let w=img.width,h=img.height;
          if (w>h&&w>MAX){h=(h*MAX)/w;w=MAX;}else if(h>MAX){w=(w*MAX)/h;h=MAX;}
          canvas.width=w;canvas.height=h;
          canvas.getContext("2d").drawImage(img,0,0,w,h);
          const dataUrl = canvas.toDataURL("image/jpeg",0.7);
          try { await fetch(`${WORKER_URL}/photo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({team,challengeId,dataUrl})}); } catch(e){}
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function handlePhotoUpload(c,e) {
    const file = e.target.files[0]; if(!file) return;
    const key = `${activeTeam}-${c.id}`;
    compressAndUpload(file,activeTeam,c.id).then(dataUrl => setPhotos(p=>({...p,[key]:dataUrl})));
  }

  function handleAnswer(c) {
    const key=`${activeTeam}-${c.id}`;
    const val=(answers[key]||"").trim().toLowerCase();
    const all=[c.answer,...(c.altAnswers||[])].map(a=>a.toLowerCase());
    const ok=all.some(a=>val.includes(a)||a.includes(val));
    if(ok){
      if(!state.completed[activeTeam].includes(c.id)) updateState(s=>({...s,completed:{...s.completed,[activeTeam]:[...s.completed[activeTeam],c.id]},scores:{...s.scores,[activeTeam]:s.scores[activeTeam]+c.points}}));
      setFeedback(p=>({...p,[key]:"correct"}));
    } else setFeedback(p=>({...p,[key]:"wrong"}));
  }

  function markPhotoComplete(c) {
    if(!state.completed[activeTeam].includes(c.id)) updateState(s=>({...s,completed:{...s.completed,[activeTeam]:[...s.completed[activeTeam],c.id]},scores:{...s.scores,[activeTeam]:s.scores[activeTeam]+c.points}}));
  }

  function useHint(c) {
    const key=`${activeTeam}-${c.id}`;
    if(!state.hints[key]) updateState(s=>({...s,hints:{...s.hints,[key]:true},scores:{...s.scores,[activeTeam]:Math.max(0,s.scores[activeTeam]-25)}}));
  }

  function handleSecretSubmit() {
    const val=secretGuess.trim().toUpperCase().replace(/\s/g,"");
    if(val===SECRET_WORD){
      if(!state.completed[activeTeam].includes(99)) updateState(s=>({...s,completed:{...s.completed,[activeTeam]:[...s.completed[activeTeam],99]},scores:{...s.scores,[activeTeam]:s.scores[activeTeam]+300}}));
      setSecretFeedback("correct");
    } else setSecretFeedback("wrong");
  }

  const sorted = [...TEAMS].sort((a,b)=>state.scores[b]-state.scores[a]);
  const pct = Math.round((state.timeLeft/TOTAL_TIME)*100);
  const timerColor = state.timeLeft<600?THEME.orange:state.timeLeft<1800?THEME.gold:THEME.success;
  const teamColorMap = { [TEAMS[0]]: THEME.orange, [TEAMS[1]]: THEME.success, [TEAMS[2]]: THEME.gold };

  const Warning = () => showWarning ? (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:showWarning==="10"?THEME.orange:THEME.gold,padding:"14px 20px",textAlign:"center",color:"white",fontWeight:600,fontSize:16}}>
      ⏰ {showWarning==="10"?"10 minutes left — wrap up!":"30 minutes remaining!"}
    </div>
  ) : null;

  const SyncBadge = () => (
    <div style={{fontSize:11,color:THEME.textLight,textAlign:"right",marginBottom:4}}>
      {syncing?"⟳ syncing...":lastSync?`✓ synced ${lastSync.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:""}
    </div>
  );

  const renderCard = (c) => {
    const done=state.completed[activeTeam]?.includes(c.id);
    const key=`${activeTeam}-${c.id}`;
    const hintUsed=state.hints[key]; const fb=feedback[key]; const photo=photos[key]; const isOpen=expanded===c.id;
    return (
      <div key={c.id} style={{borderRadius:14,border:`1.5px solid ${done?THEME.success:c.bonus?THEME.gold:THEME.slateLight}`,background:done?THEME.successLight:c.bonus?THEME.goldLight:THEME.white,overflow:"hidden"}}>
        <div onClick={()=>setExpanded(isOpen?null:c.id)} style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <span style={{fontSize:22}}>{c.emoji}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:13,color:done?THEME.success:c.bonus?THEME.gold:THEME.text,lineHeight:1.3}}>{c.location}</div>
            <div style={{fontSize:12,color:THEME.textLight,marginTop:2}}>{c.type==="trivia"?"❓ Trivia":"📷 Photo"} · {c.points} pts{hintUsed?" · hint used":""}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            {done&&LETTER_MAP[c.id]&&<div style={{width:28,height:28,borderRadius:6,background:THEME.orange,color:"white",fontWeight:700,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{LETTER_MAP[c.id]}</div>}
            {done&&<span style={{color:THEME.success,fontSize:18}}>✓</span>}
            <span style={{fontSize:12,color:THEME.textLight}}>{isOpen?"▲":"▼"}</span>
          </div>
        </div>
        {isOpen&&(
          <div style={{padding:"0 14px 14px",borderTop:`1px solid ${THEME.slateLight}`}} onClick={e=>e.stopPropagation()}>
            <p style={{fontSize:13,fontStyle:"italic",color:THEME.textMid,margin:"12px 0 8px",lineHeight:1.6}}>"{c.clue}"</p>
            <p style={{fontSize:14,margin:"0 0 10px",lineHeight:1.5,color:THEME.text}}><span style={{fontWeight:600}}>Task:</span> {c.task}</p>
            {c.referencePhoto&&(
              <div style={{marginBottom:12}}>
                <p style={{fontSize:12,color:THEME.textLight,margin:"0 0 6px",fontWeight:600}}>🎯 Reference — recreate this:</p>
                <img src={c.referencePhoto} alt="Reference" style={{width:"100%",borderRadius:10,maxHeight:200,objectFit:"cover"}}/>
              </div>
            )}
            <button onClick={()=>openMap(c)} style={{...S(),display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",background:THEME.slateLight,color:THEME.slate,border:"none",marginBottom:12}}>📍 Open in Maps</button>
            {c.type==="trivia"?(
              <>
                {!done&&(<>
                  <input value={answers[key]||""} onChange={e=>setAnswers(p=>({...p,[key]:e.target.value}))} placeholder="Your answer..." style={{width:"100%",boxSizing:"border-box",marginBottom:8,padding:"9px 12px",borderRadius:10,border:`1.5px solid ${THEME.slateLight}`,background:THEME.sand,fontSize:14,fontFamily:"inherit"}} onKeyDown={e=>e.key==="Enter"&&handleAnswer(c)}/>
                  {fb==="wrong"&&<p style={{fontSize:13,color:THEME.orange,margin:"0 0 8px"}}>Not quite — try again!</p>}
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>handleAnswer(c)} style={{...S({flex:1,padding:"9px",background:THEME.slate,color:"white",border:"none",fontWeight:600})}}>Submit</button>
                    {!hintUsed&&<button onClick={()=>useHint(c)} style={{...S({padding:"9px 12px",background:"none",color:THEME.textLight})}}>Hint (−25 pts)</button>}
                  </div>
                </>)}
                {hintUsed&&<p style={{fontSize:13,color:THEME.textMid,marginTop:8,marginBottom:0}}>💡 {c.hint}</p>}
                {done&&<p style={{fontSize:13,color:THEME.success,marginTop:8,marginBottom:0,fontWeight:600}}>✓ Completed · +{c.points} pts</p>}
              </>
            ):(
              <>
                {!done&&(<>
                  <input ref={el=>fileRefs.current[key]=el} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handlePhotoUpload(c,e)}/>
                  <button onClick={()=>fileRefs.current[key]?.click()} style={{...S({width:"100%",padding:"9px",background:THEME.slate,color:"white",border:"none",fontWeight:600,marginBottom:8})}}>📷 Open camera</button>
                  {photo&&(<><img src={photo} alt="uploaded" style={{width:"100%",borderRadius:10,maxHeight:200,objectFit:"cover",marginBottom:8}}/><button onClick={()=>markPhotoComplete(c)} style={{...S({width:"100%",padding:"9px",background:THEME.success,color:"white",border:"none",fontWeight:600,marginBottom:8})}}>✓ Mark as complete</button></>)}
                  {!photo&&<button onClick={()=>markPhotoComplete(c)} style={{...S({width:"100%",padding:"8px",background:"none",color:THEME.textLight,marginBottom:4})}}>Mark done without photo</button>}
                  {!hintUsed&&<button onClick={()=>useHint(c)} style={{...S({width:"100%",padding:"8px",background:"none",color:THEME.textLight})}}>Hint (−25 pts)</button>}
                </>)}
                {hintUsed&&<p style={{fontSize:13,color:THEME.textMid,marginTop:8,marginBottom:0}}>💡 {c.hint}</p>}
                {done&&(<>{photo&&<img src={photo} alt="done" style={{width:"100%",borderRadius:10,maxHeight:200,objectFit:"cover",marginTop:8}}/>}<p style={{fontSize:13,color:THEME.success,marginTop:8,marginBottom:0,fontWeight:600}}>✓ Completed · +{c.points} pts</p></>)}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // SPLASH SCREEN
  if (view === "splash") return (
    <div style={{position:"relative",height:"100vh",maxHeight:"100vh",background:"#1A3F66",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"0 0 60px",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}>
        <svg width="100%" height="100%" viewBox="0 0 380 580" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="380" height="320" fill="#2B5F8E"/>
          <rect x="0" y="0" width="380" height="180" fill="#1A3F66"/>
          <rect x="0" y="120" width="380" height="80" fill="#3A7AB5" opacity="0.5"/>
          <circle cx="280" cy="80" r="38" fill="#E8C840" opacity="0.9"/>
          <circle cx="280" cy="80" r="28" fill="#F5E060"/>
          <line x1="280" y1="28" x2="280" y2="14" stroke="#F5E060" strokeWidth="2" opacity="0.7"/>
          <line x1="316" y1="44" x2="326" y2="34" stroke="#F5E060" strokeWidth="2" opacity="0.7"/>
          <line x1="332" y1="80" x2="346" y2="80" stroke="#F5E060" strokeWidth="2" opacity="0.7"/>
          <line x1="244" y1="44" x2="234" y2="34" stroke="#F5E060" strokeWidth="2" opacity="0.7"/>
          <line x1="228" y1="80" x2="214" y2="80" stroke="#F5E060" strokeWidth="2" opacity="0.7"/>
          <ellipse cx="80" cy="60" rx="40" ry="18" fill="white" opacity="0.15"/>
          <ellipse cx="110" cy="52" rx="30" ry="15" fill="white" opacity="0.15"/>
          <ellipse cx="190" cy="90" rx="35" ry="14" fill="white" opacity="0.1"/>
          <rect x="0" y="290" width="380" height="50" fill="#1E6B8C"/>
          <rect x="0" y="310" width="380" height="30" fill="#2580A8" opacity="0.7"/>
          <line x1="20" y1="300" x2="60" y2="300" stroke="white" strokeWidth="1" opacity="0.2"/>
          <line x1="80" y1="308" x2="130" y2="308" stroke="white" strokeWidth="1" opacity="0.2"/>
          <line x1="240" y1="312" x2="290" y2="312" stroke="white" strokeWidth="1" opacity="0.2"/>
          <path d="M300 306 Q320 302 340 306 L338 314 L302 314Z" fill="#E8C840" opacity="0.9"/>
          <line x1="320" y1="302" x2="320" y2="292" stroke="#8B7355" strokeWidth="1.5"/>
          <path d="M320 292 L332 298 L320 300Z" fill="white" opacity="0.8"/>
          <path d="M0 280 Q80 240 190 230 Q280 222 380 240 L380 340 L0 340Z" fill="#5C7A3E"/>
          <path d="M0 300 Q80 265 190 255 Q280 248 380 262 L380 340 L0 340Z" fill="#4A6630"/>
          <rect x="60" y="160" width="30" height="50" fill="#C4A882"/>
          <rect x="95" y="150" width="25" height="60" fill="#B89868"/>
          <rect x="125" y="165" width="35" height="45" fill="#C4A882"/>
          <rect x="165" y="155" width="28" height="55" fill="#B89868"/>
          <rect x="200" y="162" width="32" height="48" fill="#C4A882"/>
          <rect x="238" y="158" width="26" height="52" fill="#B89868"/>
          <rect x="270" y="168" width="30" height="42" fill="#C4A882"/>
          <rect x="68" y="168" width="7" height="9" fill="#6B5535" opacity="0.7"/>
          <rect x="78" y="168" width="7" height="9" fill="#6B5535" opacity="0.7"/>
          <rect x="133" y="174" width="8" height="10" fill="#6B5535" opacity="0.7"/>
          <rect x="208" y="170" width="8" height="10" fill="#6B5535" opacity="0.7"/>
          <rect x="150" y="100" width="50" height="100" fill="#C4A882"/>
          <rect x="160" y="88" width="30" height="20" fill="#B89868"/>
          <rect x="168" y="76" width="14" height="16" fill="#A88858"/>
          <polygon points="175,50 164,78 186,78" fill="#8B7355"/>
          <rect x="163" y="92" width="10" height="12" rx="5" fill="#6B5535" opacity="0.8"/>
          <rect x="177" y="92" width="10" height="12" rx="5" fill="#6B5535" opacity="0.8"/>
          <circle cx="175" cy="130" r="8" fill="#6B5535" opacity="0.6"/>
          <rect x="0" y="200" width="380" height="100" fill="#9B8565"/>
          <rect x="0" y="200" width="380" height="8" fill="#7A6448"/>
          <rect x="0" y="188" width="22" height="16" fill="#9B8565"/><rect x="28" y="188" width="22" height="16" fill="#9B8565"/><rect x="56" y="188" width="22" height="16" fill="#9B8565"/><rect x="84" y="188" width="22" height="16" fill="#9B8565"/><rect x="112" y="188" width="22" height="16" fill="#9B8565"/><rect x="140" y="188" width="22" height="16" fill="#9B8565"/><rect x="168" y="188" width="22" height="16" fill="#9B8565"/><rect x="196" y="188" width="22" height="16" fill="#9B8565"/><rect x="224" y="188" width="22" height="16" fill="#9B8565"/><rect x="252" y="188" width="22" height="16" fill="#9B8565"/><rect x="280" y="188" width="22" height="16" fill="#9B8565"/><rect x="308" y="188" width="22" height="16" fill="#9B8565"/><rect x="336" y="188" width="22" height="16" fill="#9B8565"/>
          <rect x="0" y="258" width="380" height="82" fill="#8B7555"/>
          <rect x="0" y="258" width="380" height="6" fill="#6A5535"/>
          <line x1="0" y1="272" x2="380" y2="272" stroke="#6A5535" strokeWidth="0.6" opacity="0.4"/>
          <line x1="0" y1="288" x2="380" y2="288" stroke="#6A5535" strokeWidth="0.6" opacity="0.4"/>
          <line x1="0" y1="304" x2="380" y2="304" stroke="#6A5535" strokeWidth="0.6" opacity="0.4"/>
          <rect x="0" y="244" width="24" height="18" fill="#8B7555"/><rect x="30" y="244" width="24" height="18" fill="#8B7555"/><rect x="60" y="244" width="24" height="18" fill="#8B7555"/><rect x="90" y="244" width="24" height="18" fill="#8B7555"/><rect x="120" y="244" width="24" height="18" fill="#8B7555"/><rect x="150" y="244" width="24" height="18" fill="#8B7555"/><rect x="180" y="244" width="24" height="18" fill="#8B7555"/><rect x="210" y="244" width="24" height="18" fill="#8B7555"/><rect x="240" y="244" width="24" height="18" fill="#8B7555"/><rect x="270" y="244" width="24" height="18" fill="#8B7555"/><rect x="300" y="244" width="24" height="18" fill="#8B7555"/><rect x="330" y="244" width="24" height="18" fill="#8B7555"/><rect x="360" y="244" width="20" height="18" fill="#8B7555"/>
          <rect x="28" y="248" width="95" height="12" rx="2" fill="#4A3A20"/>
          <rect x="22" y="257" width="107" height="8" rx="2" fill="#3A2A18"/>
          <circle cx="48" cy="268" r="14" fill="#2A1E10"/><circle cx="48" cy="268" r="9" fill="#1A1208"/><circle cx="48" cy="268" r="3.5" fill="#3A2A18"/>
          <line x1="48" y1="254" x2="48" y2="282" stroke="#3A2A18" strokeWidth="2"/>
          <line x1="34" y1="268" x2="62" y2="268" stroke="#3A2A18" strokeWidth="2"/>
          <line x1="38" y1="258" x2="58" y2="278" stroke="#3A2A18" strokeWidth="2"/>
          <line x1="58" y1="258" x2="38" y2="278" stroke="#3A2A18" strokeWidth="2"/>
          <circle cx="100" cy="268" r="14" fill="#2A1E10"/><circle cx="100" cy="268" r="9" fill="#1A1208"/><circle cx="100" cy="268" r="3.5" fill="#3A2A18"/>
          <line x1="100" y1="254" x2="100" y2="282" stroke="#3A2A18" strokeWidth="2"/>
          <line x1="86" y1="268" x2="114" y2="268" stroke="#3A2A18" strokeWidth="2"/>
          <line x1="90" y1="258" x2="110" y2="278" stroke="#3A2A18" strokeWidth="2"/>
          <line x1="110" y1="258" x2="90" y2="278" stroke="#3A2A18" strokeWidth="2"/>
          <path d="M30 248 Q45 242 190 249 Q205 250 216 254 Q205 259 190 260 Q45 262 30 257Z" fill="#3A2A18"/>
          <ellipse cx="210" cy="254" rx="9" ry="6" fill="#1A0E08"/>
          <ellipse cx="75" cy="253" rx="4" ry="7" fill="#2A1A0A" opacity="0.7"/>
          <ellipse cx="120" cy="252" rx="4" ry="7" fill="#2A1A0A" opacity="0.7"/>
          <ellipse cx="162" cy="252" rx="4" ry="7" fill="#2A1A0A" opacity="0.7"/>
          <rect x="0" y="340" width="380" height="88" fill="#A09070"/>
          <line x1="0" y1="354" x2="380" y2="354" stroke="#8A7858" strokeWidth="0.8" opacity="0.5"/>
          <line x1="0" y1="368" x2="380" y2="368" stroke="#8A7858" strokeWidth="0.8" opacity="0.5"/>
          <line x1="0" y1="382" x2="380" y2="382" stroke="#8A7858" strokeWidth="0.8" opacity="0.5"/>
          <line x1="50" y1="340" x2="50" y2="428" stroke="#8A7858" strokeWidth="0.8" opacity="0.3"/>
          <line x1="190" y1="340" x2="190" y2="428" stroke="#8A7858" strokeWidth="0.8" opacity="0.3"/>
          <line x1="330" y1="340" x2="330" y2="428" stroke="#8A7858" strokeWidth="0.8" opacity="0.3"/>
          <rect x="0" y="428" width="380" height="152" fill="#1A2530" opacity="0.95"/>
        </svg>
      </div>
      <div style={{position:"relative",textAlign:"center",padding:"0 24px"}}>
        <h1 style={{fontSize:30,fontWeight:700,color:"white",margin:"0 0 8px",textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>Dalt Vila</h1>
        <h2 style={{fontSize:20,fontWeight:400,color:"rgba(255,255,255,0.85)",margin:"0 0 4px",textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>Scavenger Hunt</h2>
        <p style={{fontSize:14,color:"rgba(255,255,255,0.65)",margin:"0 0 32px"}}>Ibiza · 2 hours · 13 challenges</p>
        <button onClick={()=>setView("home")} style={{padding:"16px 48px",borderRadius:50,background:THEME.orange,color:"white",border:"none",fontSize:18,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,82,42,0.5)"}}>
          Begin the Hunt →
        </button>
      </div>
    </div>
  );

  // AVATAR PICKER
  if (view === "avatarpick") {
    const takenAvatars = Object.values(state.avatars || {}).filter(a => a);
    return (
      <div style={{background:THEME.sand,minHeight:"100vh",padding:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:THEME.textMid}}>←</button>
          <div>
            <h2 style={{margin:0,fontSize:18,fontWeight:700,color:THEME.text}}>{activeTeam}</h2>
            <p style={{margin:0,fontSize:13,color:THEME.textLight}}>Choose your character</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {AVATARS.map(av => {
            const taken = takenAvatars.includes(av.id) && state.avatars?.[activeTeam] !== av.id;
            const selected = state.avatars?.[activeTeam] === av.id;
            return (
              <button key={av.id} onClick={()=>{ if(!taken){ updateState(s=>({...s,avatars:{...s.avatars,[activeTeam]:av.id}})); setView("challenges"); }}}
                style={{...S({padding:"16px 12px",background:selected?THEME.slateLight:taken?"#f0f0f0":"white",opacity:taken?0.4:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,border:selected?`2px solid ${THEME.orange}`:`1.5px solid ${THEME.slateLight}`})}}>
                <AvatarSVG id={av.id} size={70}/>
                <span style={{fontSize:13,fontWeight:600,color:THEME.text}}>{av.name}</span>
                {taken&&<span style={{fontSize:11,color:THEME.textLight}}>Taken</span>}
                {selected&&<span style={{fontSize:11,color:THEME.orange,fontWeight:600}}>Selected ✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // TIME'S UP
  if (view==="challenges"&&state.timeLeft===0) return (
    <div style={{background:THEME.sand,minHeight:"100vh",padding:"3rem 1.5rem",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>⏰</div>
      <h1 style={{fontSize:28,fontWeight:700,margin:"0 0 8px",color:THEME.orange}}>Time's up!</h1>
      <p style={{fontSize:16,color:THEME.textMid,margin:"0 0 24px"}}>Put your phones down and head back to base!</p>
      <div style={{padding:"20px",borderRadius:16,border:`1.5px solid ${THEME.slateLight}`,background:THEME.white,marginBottom:16}}>
        <p style={{fontSize:14,color:THEME.textLight,margin:"0 0 4px"}}>Final score for</p>
        <p style={{fontSize:18,fontWeight:600,color:THEME.text,margin:"0 0 8px"}}>{activeTeam}</p>
        <p style={{fontSize:42,fontWeight:700,margin:0,color:THEME.orange}}>{state.scores[activeTeam]}</p>
        <p style={{fontSize:13,color:THEME.textLight,margin:"4px 0 0"}}>{state.completed[activeTeam].length}/{CHALLENGES.length} challenges completed</p>
      </div>
      <button onClick={()=>setView("leaderboard")} style={{...S({width:"100%",padding:"13px",background:THEME.slate,color:"white",border:"none",fontWeight:600,fontSize:15})}}>🏆 See final leaderboard</button>
    </div>
  );

  // WINNER
  if (view==="winner") return (
    <div style={{background:`linear-gradient(160deg,${THEME.sand} 0%,${THEME.goldLight} 100%)`,minHeight:"100vh",padding:"2rem 1.5rem",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:8}}>🏆</div>
      <h1 style={{fontSize:26,fontWeight:700,margin:"0 0 4px",color:THEME.slate}}>Hunt complete!</h1>
      <p style={{fontSize:15,color:THEME.textMid,margin:"0 0 28px"}}>Here's how it all ended</p>
      <div style={{display:"grid",gap:12,marginBottom:24}}>
        {sorted.map((t,i)=>(
          <div key={t} style={{padding:"16px 20px",borderRadius:16,border:`1.5px solid ${i===0?THEME.gold:THEME.slateLight}`,background:i===0?THEME.goldLight:THEME.white,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,flexShrink:0}}><AvatarSVG id={state.avatars?.[t]||"gato"} size={44}/></div>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontWeight:600,fontSize:16,color:THEME.text}}>{t}</div>
              <div style={{fontSize:12,color:THEME.textLight,marginTop:2}}>{state.completed[t].length}/{CHALLENGES.length} challenges</div>
            </div>
            <span style={{fontWeight:700,fontSize:22,color:i===0?THEME.gold:THEME.textMid}}>{state.scores[t]}</span>
          </div>
        ))}
      </div>
      <button onClick={()=>setView("home")} style={{...S({width:"100%",padding:"13px",background:THEME.slate,color:"white",border:"none",fontWeight:600,fontSize:15})}}>Back to home</button>
    </div>
  );

  // INSTALL
  if (view==="install") return (
    <div style={{background:THEME.sand,minHeight:"100vh",padding:"1.5rem",maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:THEME.textMid}}>←</button>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:THEME.text}}>Add to home screen</h2>
      </div>
      <p style={{fontSize:14,color:THEME.textMid,marginBottom:24,lineHeight:1.6}}>Make the app feel native by adding it to your phone's home screen!</p>
      {[{os:"🍎",title:"iPhone (Safari)",steps:["Open this link in Safari (not Chrome)","Tap the Share button at the bottom ↑","Scroll down and tap \"Add to Home Screen\"","Tap \"Add\" in the top right"]},{os:"🤖",title:"Android (Chrome)",steps:["Open this link in Chrome","Tap the three dots ⋮ in the top right","Tap \"Add to Home Screen\"","Tap \"Add\" to confirm"]}].map(({os,title,steps})=>(
        <div key={os} style={{marginBottom:16,padding:"16px",borderRadius:14,border:`1.5px solid ${THEME.slateLight}`,background:THEME.white}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{fontSize:22}}>{os}</span><span style={{fontWeight:600,fontSize:15,color:THEME.text}}>{title}</span></div>
          <div style={{display:"grid",gap:10}}>
            {steps.map((step,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:THEME.slateLight,color:THEME.slate,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                <span style={{fontSize:14,lineHeight:1.5,color:THEME.text}}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // MAP VIEW
  if (view==="map") return (
    <div style={{background:THEME.sand,height:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 16px",background:THEME.slate,display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView(activeTeam?"challenges":"home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:"white"}}>←</button>
        <h2 style={{margin:0,fontSize:16,fontWeight:700,color:"white",flex:1}}>Live Map — Dalt Vila</h2>
        <div style={{display:"flex",gap:8}}>
          {TEAMS.map((t,i)=>{
            const colors=[THEME.orange,THEME.success,THEME.gold];
            const hasPos = state.positions?.[t];
            return <div key={t} style={{width:10,height:10,borderRadius:"50%",background:colors[i],opacity:hasPos?1:0.3}}/>;
          })}
        </div>
      </div>
      <div ref={mapRef} style={{flex:1}}/>
      {!mapLoaded&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",color:THEME.slate,fontSize:14}}>Loading map...</div>}
      <div style={{padding:"10px 16px",background:"white",borderTop:`1px solid ${THEME.slateLight}`,overflowX:"auto"}}>
        <div style={{display:"flex",gap:16,minWidth:"max-content",justifyContent:"center"}}>
          {TEAMS.map((t,i)=>{
            const av = AVATARS.find(a=>a.id===state.avatars?.[t]);
            const colors=[THEME.orange,THEME.success,THEME.gold];
            const hasPos = state.positions?.[t];
            return <div key={t} style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:colors[i],opacity:hasPos?1:0.3,flexShrink:0}}/>
              <span style={{fontSize:12,color:THEME.text,fontWeight:600,whiteSpace:"nowrap"}}>{av?.name||t}</span>
            </div>;
          })}
        </div>
      </div>
    </div>
  );

  // HOME
  if (view==="home") return (
    <div style={{background:THEME.sand,minHeight:"100vh",padding:"2rem 1.5rem",maxWidth:480,margin:"0 auto"}}>
      <SyncBadge/>
      <div style={{textAlign:"center",marginBottom:"2rem"}}>
        <div style={{fontSize:52,marginBottom:10}}>🏰</div>
        <h1 style={{fontSize:26,fontWeight:700,margin:"0 0 4px",color:THEME.slate}}>Dalt Vila Scavenger Hunt</h1>
        <p style={{fontSize:14,color:THEME.textMid,margin:"0 0 2px"}}>Ibiza's ancient walled city</p>
        <p style={{fontSize:13,color:THEME.textLight,margin:0}}>{regular.length} challenges · {bonus.length} bonus · {totalPossible} pts · 2 hours</p>
      </div>
      <div style={{display:"grid",gap:12,marginBottom:16}}>
        {TEAMS.map((t,i)=>{
          const col=[THEME.orange,THEME.success,THEME.gold][i];
          const done=state.completed[t].length;
          const pctDone=Math.round((done/CHALLENGES.length)*100);
          const avatarId=state.avatars?.[t];
          return (
            <button key={t} onClick={()=>{ setActiveTeam(t); if(view==="map") return; setView(avatarId?"challenges":"avatarpick"); }}
              style={{...S({padding:"14px 16px",background:THEME.slate,textAlign:"left",display:"flex",alignItems:"center",gap:14})}}>

              <div style={{width:50,height:50,borderRadius:"50%",background:THEME.slateLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                {avatarId ? <AvatarSVG id={avatarId} size={50}/> : <span style={{fontSize:22}}>👤</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:15,color:"white"}}>{t}</div>
                <div style={{height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,marginTop:6,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pctDone}%`,background:THEME.orange,borderRadius:4,transition:"width 0.5s ease"}}/>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:4}}>{done}/{CHALLENGES.length} challenges</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontWeight:700,fontSize:18,color:THEME.orange}}>{state.scores[t]}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>pts</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <button onClick={()=>setView("leaderboard")} style={{...S({padding:"12px",background:THEME.white,color:THEME.text,fontWeight:500})}}>🏆 Leaderboard</button>
        <button onClick={()=>setView("admin")} style={{...S({padding:"12px",background:THEME.white,color:THEME.text,fontWeight:500})}}>⚙️ Admin</button>
      </div>
      <button onClick={()=>{ setActiveTeam(null); setView("map"); }} style={{...S({width:"100%",padding:"12px",background:THEME.orange,color:"white",border:"none",fontWeight:600,marginBottom:10})}}>🗺️ Live Map</button>
      <button onClick={()=>setView("install")} style={{...S({width:"100%",padding:"11px",background:"none",color:THEME.textMid,fontSize:13})}}>📲 Add to home screen</button>
    </div>
  );

  // CHALLENGES
  if (view==="challenges") return (
    <div style={{background:THEME.sand,minHeight:"100vh",padding:"1.5rem",maxWidth:480,margin:"0 auto"}}>
      <Warning/>
      <SyncBadge/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:THEME.textMid}}>←</button>
        <div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
          <AvatarSVG id={state.avatars?.[activeTeam]||"gato"} size={36}/>
        </div>
        <div style={{flex:1}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:700,color:THEME.text}}>{activeTeam}</h2>
          <p style={{margin:0,fontSize:13,color:THEME.textLight}}>{state.scores[activeTeam]} pts · {state.completed[activeTeam].length}/{CHALLENGES.length} done</p>
        </div>
        <button onClick={()=>setView("map")} style={{...S({padding:"6px 10px",background:THEME.slateLight,color:THEME.slate,border:"none",fontSize:12,fontWeight:600})}}>🗺️ Map</button>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:18,fontWeight:700,color:timerColor,fontVariantNumeric:"tabular-nums"}}>{state.timeLeft===0?"⏰":formatTime(state.timeLeft)}</div>
          {state.timerRunning&&<div style={{height:3,width:60,background:THEME.slateLight,borderRadius:3,marginTop:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:timerColor,borderRadius:3,transition:"width 1s linear"}}/></div>}
        </div>
      </div>

      {/* Secret word panel */}
      <div style={{padding:"12px 14px",borderRadius:14,border:`1.5px solid ${THEME.slateLight}`,background:THEME.white,marginBottom:16}}>
        <p style={{fontSize:13,fontWeight:700,color:THEME.slate,margin:"0 0 4px"}}>🔐 Secret phrase challenge</p>
        <p style={{fontSize:12,color:THEME.textMid,margin:"0 0 10px",lineHeight:1.5}}>Each challenge reveals a letter. Collect all 11, unscramble and submit for +300 pts!</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          {regular.map(c=>{
            const done=state.completed[activeTeam]?.includes(c.id);
            return <div key={c.id} style={{width:30,height:30,borderRadius:6,background:done?THEME.orange:THEME.slateLight,border:`1.5px solid ${done?THEME.orange:THEME.slateLight}`,color:done?"white":THEME.textLight,fontWeight:700,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>{done?LETTER_MAP[c.id]:"?"}</div>;
          })}
        </div>
        {state.completed[activeTeam]?.includes(99)?(
          <p style={{fontSize:13,color:THEME.success,fontWeight:600,margin:0}}>✓ Secret phrase solved! +300 pts</p>
        ):(
          <div style={{display:"flex",gap:8}}>
            <input value={secretGuess} onChange={e=>{setSecretGuess(e.target.value);setSecretFeedback(null);}} placeholder="Enter the secret phrase..." style={{flex:1,padding:"9px 12px",borderRadius:10,border:`1.5px solid ${THEME.slateLight}`,background:THEME.sand,fontSize:14,fontFamily:"inherit"}} onKeyDown={e=>e.key==="Enter"&&handleSecretSubmit()}/>
            <button onClick={handleSecretSubmit} style={{...S({padding:"9px 14px",background:THEME.slate,color:"white",border:"none",fontWeight:600})}}>Submit</button>
          </div>
        )}
        {secretFeedback==="wrong"&&<p style={{fontSize:12,color:THEME.orange,margin:"6px 0 0"}}>Not quite — keep collecting letters!</p>}
      </div>

      {/* Quick pills */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {regular.filter(c=>!state.completed[activeTeam]?.includes(c.id)).map(c=>(
          <button key={c.id} onClick={()=>setExpanded(c.id)} style={{...S({padding:"4px 10px",background:THEME.white,fontSize:12,color:THEME.textMid,borderRadius:20})}}>
            {c.emoji} {c.points}pts
          </button>
        ))}
      </div>

      <div style={{display:"grid",gap:10,marginBottom:16}}>{regular.map(renderCard)}</div>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"4px 0 10px"}}>
        <span style={{fontSize:13,fontWeight:700,color:THEME.gold}}>⭐ Bonus challenges</span>
        <div style={{flex:1,height:"0.5px",background:THEME.slateLight}}/>
      </div>
      <div style={{display:"grid",gap:10}}>{bonus.map(renderCard)}</div>
    </div>
  );

  // LEADERBOARD
  if (view==="leaderboard") return (
    <div style={{background:THEME.sand,minHeight:"100vh",padding:"1.5rem",maxWidth:480,margin:"0 auto"}}>
      <SyncBadge/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:THEME.textMid}}>←</button>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:THEME.text}}>Leaderboard</h2>
        <button onClick={fetchState} style={{...S({marginLeft:"auto",padding:"5px 12px",background:"none",color:THEME.textMid,fontSize:12})}}>↻ Refresh</button>
      </div>
      {state.timerRunning&&(
        <div style={{textAlign:"center",marginBottom:20}}>
          <span style={{fontSize:42,fontWeight:700,color:timerColor,fontVariantNumeric:"tabular-nums"}}>{formatTime(state.timeLeft)}</span>
          <p style={{fontSize:13,color:THEME.textLight,margin:"4px 0 8px"}}>remaining</p>
          <div style={{height:6,background:THEME.slateLight,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:timerColor,borderRadius:4,transition:"width 1s linear"}}/></div>
        </div>
      )}
      <div style={{display:"grid",gap:12}}>
        {sorted.map((t,i)=>(
          <div key={t} style={{padding:"14px 16px",borderRadius:14,border:`1.5px solid ${i===0?THEME.gold:THEME.slateLight}`,background:i===0?THEME.goldLight:THEME.white,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,flexShrink:0}}><AvatarSVG id={state.avatars?.[t]||"gato"} size={44}/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:15,color:THEME.text}}>{t}</div>
              <div style={{fontSize:12,color:THEME.textLight,marginTop:2}}>{state.completed[t].length}/{CHALLENGES.length} · {state.completed[t].map(id=>CHALLENGES.find(c=>c.id===id)?.emoji).join(" ")}</div>
            </div>
            <span style={{fontWeight:700,fontSize:22,color:i===0?THEME.gold:THEME.textMid}}>{state.scores[t]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ADMIN
  if (view==="admin") return (
    <div style={{background:THEME.sand,minHeight:"100vh",padding:"1.5rem",maxWidth:480,margin:"0 auto"}}>
      <SyncBadge/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,color:THEME.textMid}}>←</button>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:THEME.text}}>Admin</h2>
      </div>
      {!adminUnlocked?(
        <div style={{textAlign:"center",paddingTop:"2rem"}}>
          <p style={{color:THEME.textMid,fontSize:14,marginBottom:16}}>Enter the host passcode to continue.</p>
          <input type="password" value={adminPass} onChange={e=>{setAdminPass(e.target.value);setAdminErr(false);}} placeholder="Passcode" style={{width:"100%",boxSizing:"border-box",marginBottom:8,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${THEME.slateLight}`,background:THEME.white,fontSize:14,fontFamily:"inherit"}} onKeyDown={e=>{if(e.key==="Enter") adminPass===PASSCODE?setAdminUnlocked(true):setAdminErr(true);}}/>
          {adminErr&&<p style={{fontSize:13,color:THEME.orange,margin:"0 0 8px"}}>Incorrect passcode.</p>}
          <button onClick={()=>adminPass===PASSCODE?setAdminUnlocked(true):setAdminErr(true)} style={{...S({width:"100%",padding:"11px",background:THEME.slate,color:"white",border:"none",fontWeight:600})}}>Unlock</button>
          <p style={{fontSize:12,color:THEME.textLight,marginTop:12}}>Demo passcode: ibiza2026</p>
        </div>
      ):(
        <div>
          <div style={{marginBottom:20,padding:"16px",borderRadius:14,border:`1.5px solid ${THEME.slateLight}`,background:THEME.white}}>
            <p style={{fontSize:13,color:THEME.textLight,margin:"0 0 10px",fontWeight:600}}>Timer — 2 hours</p>
            <div style={{textAlign:"center",marginBottom:12}}>
              <span style={{fontSize:40,fontWeight:700,color:timerColor,fontVariantNumeric:"tabular-nums"}}>{formatTime(state.timeLeft)}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <button onClick={()=>updateState(s=>({...s,timerRunning:true}))} style={{...S({padding:"10px",background:THEME.success,color:"white",border:"none",fontWeight:600})}}>▶ Start</button>
              <button onClick={()=>updateState(s=>({...s,timerRunning:false}))} style={{...S({padding:"10px",background:THEME.goldLight,color:THEME.gold,fontWeight:600})}}>⏸ Pause</button>
              <button onClick={()=>updateState(s=>({...s,timerRunning:false,timeLeft:TOTAL_TIME}))} style={{...S({padding:"10px",background:THEME.slateLight,color:THEME.textMid,fontWeight:600})}}>↺ Reset</button>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <p style={{fontSize:13,color:THEME.textLight,margin:0,fontWeight:600}}>Live team progress</p>
              <button onClick={()=>{fetchState();fetchPhotos();}} style={{...S({padding:"5px 10px",background:"none",color:THEME.textMid,fontSize:12})}}>↻ Refresh</button>
            </div>
            {TEAMS.map((t,i)=>{
              const teamPhotoKeys=Object.keys(cloudPhotos).filter(k=>k.startsWith(`${t}:`));
              const colors=[THEME.orange,THEME.success,THEME.gold];
              return (
                <div key={t} style={{marginBottom:12,padding:"14px",borderRadius:14,border:`1.5px solid ${THEME.slateLight}`,background:THEME.white}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,flexShrink:0}}><AvatarSVG id={state.avatars?.[t]||"gato"} size={36}/></div>
                    <span style={{flex:1,fontSize:14,fontWeight:600,color:THEME.text}}>{t}</span>
                    <span style={{fontSize:12,color:THEME.textLight}}>{state.completed[t].length}/{CHALLENGES.length}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <button onClick={()=>updateState(s=>({...s,scores:{...s.scores,[t]:Math.max(0,s.scores[t]-50)}}))} style={{...S({width:28,height:28,padding:0,background:THEME.slateLight,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"})}}>−</button>
                      <span style={{fontSize:15,fontWeight:700,minWidth:44,textAlign:"center",color:THEME.orange}}>{state.scores[t]}</span>
                      <button onClick={()=>updateState(s=>({...s,scores:{...s.scores,[t]:s.scores[t]+50}}))} style={{...S({width:28,height:28,padding:0,background:THEME.slateLight,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"})}}>+</button>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:THEME.textLight,marginBottom:teamPhotoKeys.length?8:0}}>
                    {state.completed[t].map(id=>CHALLENGES.find(c=>c.id===id)?.emoji).join(" ")||"No challenges completed yet"}
                  </div>
                  {teamPhotoKeys.length>0&&(
                    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                      {teamPhotoKeys.map(key=>{
                        const challengeId=parseInt(key.split(":")[1]);
                        const ch=CHALLENGES.find(c=>c.id===challengeId);
                        return <div key={key} style={{flexShrink:0,textAlign:"center"}}><img src={cloudPhotos[key]} alt="team photo" style={{width:72,height:72,borderRadius:8,objectFit:"cover",display:"block"}}/><div style={{fontSize:10,color:THEME.textLight,marginTop:2}}>{ch?.emoji}</div></div>;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={()=>setView("winner")} style={{...S({width:"100%",padding:"12px",background:THEME.gold,color:"white",border:"none",fontWeight:600,marginBottom:10})}}>🏆 Show winner screen</button>
          <button onClick={()=>updateState(s=>({...s,avatars:{}}))} style={{...S({width:"100%",padding:"11px",background:"none",color:THEME.slate,borderColor:THEME.slate,fontWeight:600,marginBottom:10})}}>👤 Reset all avatars</button>
          <button onClick={async()=>{ await fetch(`${WORKER_URL}/reset`,{method:"POST"}); await fetchState(); setAnswers({});setFeedback({});setPhotos({});setWarned30(false);setWarned10(false); }} style={{...S({width:"100%",padding:"11px",background:"none",color:THEME.orange,borderColor:THEME.orange,fontWeight:600})}}>Reset all progress</button>
        </div>
      )}
    </div>
  );
}
