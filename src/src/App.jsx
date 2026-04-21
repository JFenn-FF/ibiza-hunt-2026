import { useState, useEffect, useRef } from "react";

const WORKER_URL = "https://scavenger-hunt.janelle-c56.workers.dev";
const TEAMS = ["Team Tramuntana", "Team Posidònia", "Team Es Vedrà"];
const TOTAL_TIME = 120 * 60;
const PASSCODE = "ibiza2026";

const THEME = {
  sand: "#F5EFE0",
  sandDark: "#E8DCC8",
  terra: "#C4622D",
  terraLight: "#F0E0D6",
  ocean: "#2B7A9E",
  oceanLight: "#E0F0F8",
  olive: "#6B8C3E",
  oliveLight: "#E8F0DC",
  gold: "#D4A017",
  goldLight: "#FDF3D0",
  text: "#2C1810",
  textMid: "#6B4C3B",
  textLight: "#9B7B6B",
  white: "#FFFDF8",
};

const TEAM_COLORS = [
  { bg: THEME.oceanLight, icon: THEME.ocean, emoji: "🌊" },
  { bg: THEME.oliveLight, icon: THEME.olive, emoji: "🌿" },
  { bg: THEME.terraLight, icon: THEME.terra, emoji: "🏔️" },
];

const SECRET_WORD = "WHITEISLAND";
const LETTER_MAP = { 1:"W", 2:"H", 3:"I", 4:"T", 5:"E", 6:"I", 7:"S", 8:"L", 9:"A", 10:"N", 11:"D" };

const CHALLENGES = [
  {
    id: 1, type: "photo", emoji: "🚪",
    location: "Portal de ses Taules — The Grand Entrance",
    clue: "I am the grandest way in, guarded by two ancient Romans and a bridge that once moved. Cross me to step back in time.",
    task: "Take a team photo with the Roman statues flanking the gateway — one person must pose like they're crossing a drawbridge dramatically.",
    hint: "The gateway is between the bastions of Sant Joan and Santa Llúcia. The Roman busts sit in alcoves either side of the archway.",
    points: 150, coords: { lat: 38.9083, lng: 1.4367 },
    placeId: "ChIJOfuyqbFGmRIR7TB8N1d_r4E",
  },
  {
    id: 2, type: "trivia", emoji: "⛪",
    location: "Catedral de Santa Maria — The High Ground",
    clue: "Climb to the very peak where the Gothic meets the Baroque. I watch over the harbour and the sea, standing where an Arab mosque once stood.",
    task: "Count the number of bells in the tower, or find the date inscribed near the entrance.",
    hint: "The cathedral was built from the 14th century on the site of a mosque. Look above the doorway for inscriptions.",
    answer: "1592", altAnswers: ["1","one","14th","four","4"],
    points: 100, coords: { lat: 38.9068, lng: 1.4365 },
    placeId: "ChIJdQ_YCilHmRIR5oGBuvSQXNs",
  },
  {
    id: 3, type: "photo", emoji: "💣",
    location: "Baluarte de Santa Llúcia — The Pirate Defenders",
    clue: "Find the heavy iron tubes at Baluarte de Santa Llúcia. They once barked at invaders and pirates to keep this 'impenetrable fortress' safe.",
    task: "Pose the whole team pointing the largest cannon toward the harbour — your best pirate-defending formation!",
    hint: "The bastions are on the seaward side of the walls. The cannons face out toward the Mediterranean.",
    points: 150, coords: { lat: 38.9083, lng: 1.4386 },
    placeId: "ChIJQ_icKrJGmRIRtmT9JceG6eA",
  },
  {
    id: 4, type: "photo", emoji: "🦅",
    location: "Portal de ses Taules — Imperial Coat of Arms",
    clue: "Above the Grand Entrance, an eagle spreads its wings beneath a crown. The empire's symbol has watched over this gate for centuries.",
    task: "Recreate the imperial coat of arms above the gateway as a human tableau — someone must be the eagle, arms spread wide.",
    hint: "Look up at the carved stone crest directly above the archway at Portal de ses Taules.",
    points: 125, coords: { lat: 38.9083, lng: 1.4367 },
    placeId: "ChIJOfuyqbFGmRIR7TB8N1d_r4E",
  },
  {
    id: 5, type: "photo", emoji: "🥐",
    location: "Convent of Sant Cristòfol — The Sweet Turntable",
    clue: "Visit the Convent of San Cristóbal, where the walls keep secrets and the nuns keep treats. Look for the wooden 'torno' to find something sweet without seeing a face.",
    task: "Buy a local sweet or bread made by the cloistered nuns and take a team photo enjoying it. (Expenses reimbursed!) Open 9–13:00 and 16–20:00. If the torno is closed, buy a sweet from any nearby café, take your team photo outside the convent door holding it — full points either way!",
    hint: "Ring the bell at the wooden torno window — you pass money in and sweets come back. Pastries from €1.",
    points: 175, coords: { lat: 38.9072, lng: 1.4342 },
    placeId: "ChIJE1kuc7BGmRIR7Mkp6BE9MAw",
  },
  {
    id: 6, type: "trivia", emoji: "🏺",
    location: "MACE Museum — The Hidden Foundations",
    clue: "Head to the Museum of Contemporary Art, but don't just look at the paintings. Peer through the glass floor to see the ancient Phoenician house waiting below.",
    task: "Identify one artefact or item found in the Phoenician ruins visible through the glass floor.",
    hint: "The ruins are visible through a glass panel on the ground floor. Look for labels nearby describing what was found.",
    answer: "phoenician", altAnswers: ["pottery","amphora","wall","mosaic","ceramic","coins","ruins","jar","stone"],
    points: 100, coords: { lat: 38.9083, lng: 1.4363 },
    placeId: "ChIJ8wOmtKxHmRIRtjIZJuH8AbY",
  },
  {
    id: 7, type: "photo", emoji: "🗿",
    location: "Plaça d'Espanya — The Reclining Conqueror",
    clue: "I am the man who took this island back in the 13th century. You'll find me taking it easy, reclining in stone near the seat of power.",
    task: "Find the shield or crest near the statue and photograph a team member mimicking the reclining pose.",
    hint: "Guillem de Montgrí is in Plaça d'Espanya. The statue is a replica of his tomb sarcophagus in Girona Cathedral.",
    points: 125, coords: { lat: 38.9069, lng: 1.4382 },
    placeId: "ChIJHeqEOH9HmRIRMTMb3ZO_CeM",
  },
  {
    id: 8, type: "photo", emoji: "🐱",
    location: "Anywhere in Dalt Vila — Local Cat",
    clue: "Dalt Vila's most charming residents don't pay rent and answer to no one. They've been here longer than the tourists.",
    task: "Photograph a Dalt Vila resident cat. The cat must be clearly in frame — bonus style points if it looks unimpressed.",
    hint: "Cats tend to lounge near the quieter alleyways and sunny steps toward the upper town. Patience is key.",
    points: 75, coords: { lat: 38.9075, lng: 1.4365 },
  },
  {
    id: 9, type: "photo", emoji: "🚢",
    location: "Harbour View — Cruise Ship",
    clue: "One of the great floating cities may be docked in port today. Find it and prove it.",
    task: "Photograph a cruise ship visible from the harbour or the walls of Dalt Vila. The ship must be clearly identifiable.",
    hint: "Best views of the port are from the bastions or from the harbour promenade below Dalt Vila.",
    points: 100, coords: { lat: 38.9083, lng: 1.4386 },
    placeId: "ChIJQ_icKrJGmRIRtmT9JceG6eA",
  },
  {
    id: 10, type: "photo", emoji: "🌿",
    location: "Anywhere — Island Drink",
    clue: "This island has its own herbal spirit, made from local plants and tradition. Find its name somewhere in the wild.",
    task: "Photograph a menu, bottle, sign, or bar display showing a drink named after Ibiza. No need to buy it!",
    hint: "Hierbas Ibicencas is the island's famous herbal liqueur. Look at any bar menu or bottle display near the harbour.",
    points: 75, coords: { lat: 38.9075, lng: 1.4365 },
  },
  {
    id: 11, type: "photo", emoji: "📮",
    location: "Anywhere — Ibiza Postcard",
    clue: "Before smartphones there were postcards. The tradition lives on.",
    task: "Find and photograph a physical Ibiza postcard — in a shop, rack, or café. Bonus points if it's gloriously tacky.",
    hint: "Gift shops near Portal de ses Taules and along the harbour front usually have postcard racks outside.",
    points: 50, coords: { lat: 38.9083, lng: 1.4367 },
  },
  {
    id: 12, type: "photo", emoji: "🎩",
    location: "Mango Store — Steve's Fur Hat Moment",
    clue: "Your boss once made a questionable fashion statement in a Mango store. History must repeat itself.",
    task: "Find a fur hat AND a fur/fluffy bag in the Mango store and recreate Steve's iconic photo — same pose, same energy. Full commitment required.",
    hint: "Mango is on Avinguda de Santa Eulàlia des Riu, just outside Dalt Vila. Open until 9pm.",
    referencePhoto: "https://i.ibb.co/BVGd1kRx/IMG-1533.jpg",
    points: 200, coords: { lat: 38.9108, lng: 1.4345 },
    placeId: "ChIJq3JFbLdGmRIRuwRUzVsuqHo",
    bonus: true,
  },
  {
    id: 13, type: "photo", emoji: "🅰️",
    location: "Harbour Area — Ibiza Eivissa Sign",
    clue: "Find the giant letters that spell out this island's dual name. Strike your best family portrait pose — awkward Christmas card energy required.",
    task: "Take a classic 'family photo' in front of the IBIZA EIVISSA sign — stiff poses, cheesy smiles, one person arms-crossed dad energy.",
    hint: "The large letter sign is near the harbour/marina area at the foot of Dalt Vila. Ask a local if you can't spot it!",
    points: 150, coords: { lat: 38.9082, lng: 1.4367 },
    bonus: true,
  },
];

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function openMap(c) {
  window.open(`https://www.google.com/maps/search/?api=1&query=${c.coords.lat},${c.coords.lng}`, "_blank");
}

const regular = CHALLENGES.filter(c => !c.bonus);
const bonus = CHALLENGES.filter(c => c.bonus);

const initLocal = () => ({
  scores: Object.fromEntries(TEAMS.map(t => [t, 0])),
  completed: Object.fromEntries(TEAMS.map(t => [t, []])),
  hints: {},
  timeLeft: TOTAL_TIME,
  timerRunning: false,
});

const btn = (extra = {}) => ({
  border: `1.5px solid ${THEME.sandDark}`,
  borderRadius: 12,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 14,
  ...extra,
});

export default function App() {
  const [view, setView] = useState("home");
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
  const timerRef = useRef(null);
  const fileRefs = useRef({});
  const pendingSync = useRef(null);

  useEffect(() => { fetchState(); }, []);
  useEffect(() => { const i = setInterval(fetchState, 10000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (state.timerRunning && state.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setState(s => {
          const next = { ...s, timeLeft: s.timeLeft - 1 };
          schedulePush(next);
          return next;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [state.timerRunning, state.timeLeft]);

  // Countdown warnings
  useEffect(() => {
    if (state.timerRunning) {
      if (state.timeLeft <= 1800 && state.timeLeft > 1790 && !warned30) {
        setShowWarning("30"); setWarned30(true);
        setTimeout(() => setShowWarning(null), 5000);
      }
      if (state.timeLeft <= 600 && state.timeLeft > 590 && !warned10) {
        setShowWarning("10"); setWarned10(true);
        setTimeout(() => setShowWarning(null), 5000);
      }
    }
  }, [state.timeLeft, state.timerRunning]);

  async function fetchState() {
    try {
      const res = await fetch(`${WORKER_URL}/state`);
      const data = await res.json();
      setState(s => ({ ...s, ...data }));
      setLastSync(new Date());
    } catch (e) {}
  }

  async function fetchPhotos() {
    try {
      const res = await fetch(`${WORKER_URL}/photos`);
      const data = await res.json();
      setCloudPhotos(data);
    } catch (e) {}
  }

  function schedulePush(ns) {
    clearTimeout(pendingSync.current);
    pendingSync.current = setTimeout(() => pushState(ns), 1000);
  }

  async function pushState(ns) {
    setSyncing(true);
    try {
      await fetch(`${WORKER_URL}/update`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ns) });
      setLastSync(new Date());
    } catch (e) {}
    setSyncing(false);
  }

  function updateState(updater) {
    setState(s => { const next = updater(s); schedulePush(next); return next; });
  }

  const pct = Math.round((state.timeLeft / TOTAL_TIME) * 100);
  const timerColor = state.timeLeft < 600 ? "#C4622D" : state.timeLeft < 1800 ? THEME.gold : THEME.olive;
  const teamIdx = (t) => TEAMS.indexOf(t);

  function handleAnswer(c) {
    const key = `${activeTeam}-${c.id}`;
    const val = (answers[key] || "").trim().toLowerCase();
    const all = [c.answer, ...(c.altAnswers || [])].map(a => a.toLowerCase());
    const ok = all.some(a => val.includes(a) || a.includes(val));
    if (ok) {
      if (!state.completed[activeTeam].includes(c.id)) {
        updateState(s => ({ ...s, completed: { ...s.completed, [activeTeam]: [...s.completed[activeTeam], c.id] }, scores: { ...s.scores, [activeTeam]: s.scores[activeTeam] + c.points } }));
      }
      setFeedback(p => ({ ...p, [key]: "correct" }));
    } else setFeedback(p => ({ ...p, [key]: "wrong" }));
  }

  async function compressAndUpload(file, team, challengeId) {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX = 800;
          let w = img.width, h = img.height;
          if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX; }
          else if (h > MAX) { w = (w * MAX) / h; h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          try {
            await fetch(`${WORKER_URL}/photo`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ team, challengeId, dataUrl }),
            });
          } catch (e) {}
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function handlePhotoUpload(c, e) {
    const file = e.target.files[0];
    if (!file) return;
    const key = `${activeTeam}-${c.id}`;
    compressAndUpload(file, activeTeam, c.id).then(dataUrl => {
      setPhotos(p => ({ ...p, [key]: dataUrl }));
    });
  }

  function markPhotoComplete(c) {
    if (!state.completed[activeTeam].includes(c.id)) {
      updateState(s => ({ ...s, completed: { ...s.completed, [activeTeam]: [...s.completed[activeTeam], c.id] }, scores: { ...s.scores, [activeTeam]: s.scores[activeTeam] + c.points } }));
    }
  }

  function useHint(c) {
    const key = `${activeTeam}-${c.id}`;
    if (!state.hints[key]) {
      updateState(s => ({ ...s, hints: { ...s.hints, [key]: true }, scores: { ...s.scores, [activeTeam]: Math.max(0, s.scores[activeTeam] - 25) } }));
    }
  }

  const [secretGuess, setSecretGuess] = useState("");
  const [secretFeedback, setSecretFeedback] = useState(null);

  function handleSecretSubmit() {
    const val = secretGuess.trim().toUpperCase().replace(/\s/g, "");
    if (val === SECRET_WORD) {
      if (!state.completed[activeTeam].includes(99)) {
        updateState(s => ({ ...s, completed: { ...s.completed, [activeTeam]: [...s.completed[activeTeam], 99] }, scores: { ...s.scores, [activeTeam]: s.scores[activeTeam] + 300 } }));
      }
      setSecretFeedback("correct");
    } else {
      setSecretFeedback("wrong");
    }
  }

  const sorted = [...TEAMS].sort((a, b) => state.scores[b] - state.scores[a]);
  const totalPossible = CHALLENGES.reduce((s, c) => s + c.points, 0) + 300;

  const SyncBadge = () => (
    <div style={{ fontSize: 11, color: THEME.textLight, textAlign: "right", marginBottom: 6 }}>
      {syncing ? "⟳ syncing..." : lastSync ? `✓ synced ${lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
    </div>
  );

  const Warning = () => showWarning ? (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: showWarning === "10" ? THEME.terra : THEME.gold, padding: "14px 20px", textAlign: "center", color: THEME.white, fontWeight: 500, fontSize: 16 }}>
      ⏰ {showWarning === "10" ? "10 minutes left — wrap up!" : "30 minutes remaining!"}
    </div>
  ) : null;

  const renderCard = (c) => {
    const done = state.completed[activeTeam]?.includes(c.id);
    const key = `${activeTeam}-${c.id}`;
    const hintUsed = state.hints[key];
    const fb = feedback[key];
    const photo = photos[key];
    const isOpen = expanded === c.id;
    const remaining = regular.filter(ch => !state.completed[activeTeam]?.includes(ch.id));

    return (
      <div key={c.id} style={{ borderRadius: 14, border: `1.5px solid ${done ? THEME.olive : c.bonus ? THEME.gold : THEME.sandDark}`, background: done ? THEME.oliveLight : c.bonus ? THEME.goldLight : THEME.white, overflow: "hidden" }}>
        <div onClick={() => setExpanded(isOpen ? null : c.id)} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <span style={{ fontSize: 22 }}>{c.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: done ? THEME.olive : c.bonus ? THEME.gold : THEME.text, lineHeight: 1.3 }}>{c.location}</div>
            <div style={{ fontSize: 12, color: THEME.textLight, marginTop: 2 }}>{c.type === "trivia" ? "❓ Trivia" : "📷 Photo"} · {c.points} pts{hintUsed ? " · hint used" : ""}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {done && LETTER_MAP[c.id] && (
              <div style={{ width: 28, height: 28, borderRadius: 6, background: THEME.terra, color: THEME.white, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {LETTER_MAP[c.id]}
              </div>
            )}
            {done && <span style={{ color: THEME.olive, fontSize: 18 }}>✓</span>}
            <span style={{ fontSize: 12, color: THEME.textLight }}>{isOpen ? "▲" : "▼"}</span>
          </div>
        </div>
        {isOpen && (
          <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${THEME.sandDark}` }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 13, fontStyle: "italic", color: THEME.textMid, margin: "12px 0 8px", lineHeight: 1.6 }}>"{c.clue}"</p>
            <p style={{ fontSize: 14, margin: "0 0 10px", lineHeight: 1.5, color: THEME.text }}><span style={{ fontWeight: 500 }}>Task:</span> {c.task}</p>
            {c.referencePhoto && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: THEME.textLight, margin: "0 0 6px", fontWeight: 500 }}>🎯 Reference photo — recreate this:</p>
                <img src={c.referencePhoto} alt="Reference" style={{ width: "100%", borderRadius: 10, maxHeight: 220, objectFit: "cover" }} />
              </div>
            )}
            <button onClick={() => openMap(c)} style={{ ...btn(), display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", background: THEME.oceanLight, color: THEME.ocean, border: `1px solid ${THEME.ocean}30`, marginBottom: 12 }}>
              📍 Open in Maps
            </button>
            {c.type === "trivia" ? (
              <>
                {!done && (
                  <>
                    <input value={answers[key] || ""} onChange={e => setAnswers(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="Your answer..." style={{ width: "100%", boxSizing: "border-box", marginBottom: 8, padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${THEME.sandDark}`, background: THEME.sand, color: THEME.text, fontSize: 14, fontFamily: "inherit" }}
                      onKeyDown={e => e.key === "Enter" && handleAnswer(c)} />
                    {fb === "wrong" && <p style={{ fontSize: 13, color: THEME.terra, margin: "0 0 8px" }}>Not quite — try again!</p>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleAnswer(c)} style={{ ...btn({ flex: 1, padding: "9px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 500 }) }}>Submit</button>
                      {!hintUsed && <button onClick={() => useHint(c)} style={{ ...btn({ padding: "9px 12px", background: "none", color: THEME.textLight }) }}>Hint (−25 pts)</button>}
                    </div>
                  </>
                )}
                {hintUsed && <p style={{ fontSize: 13, color: THEME.textMid, marginTop: 8, marginBottom: 0 }}>💡 {c.hint}</p>}
                {done && <p style={{ fontSize: 13, color: THEME.olive, marginTop: 8, marginBottom: 0, fontWeight: 500 }}>✓ Completed · +{c.points} pts</p>}
              </>
            ) : (
              <>
                {!done && (
                  <>
                    <input ref={el => fileRefs.current[key] = el} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handlePhotoUpload(c, e)} />
                    <button onClick={() => fileRefs.current[key]?.click()} style={{ ...btn({ width: "100%", padding: "9px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 500, marginBottom: 8 }) }}>
                      📷 Open camera
                    </button>
                    {photo && (
                      <>
                        <img src={photo} alt="uploaded" style={{ width: "100%", borderRadius: 10, maxHeight: 200, objectFit: "cover", marginBottom: 8 }} />
                        <button onClick={() => markPhotoComplete(c)} style={{ ...btn({ width: "100%", padding: "9px", background: THEME.olive, color: THEME.white, border: "none", fontWeight: 500, marginBottom: 8 }) }}>✓ Mark as complete</button>
                      </>
                    )}
                    {!photo && <button onClick={() => markPhotoComplete(c)} style={{ ...btn({ width: "100%", padding: "8px", background: "none", color: THEME.textLight, marginBottom: 4 }) }}>Mark done without photo</button>}
                    {!hintUsed && <button onClick={() => useHint(c)} style={{ ...btn({ width: "100%", padding: "8px", background: "none", color: THEME.textLight }) }}>Hint (−25 pts)</button>}
                  </>
                )}
                {hintUsed && <p style={{ fontSize: 13, color: THEME.textMid, marginTop: 8, marginBottom: 0 }}>💡 {c.hint}</p>}
                {done && (
                  <>
                    {photo && <img src={photo} alt="done" style={{ width: "100%", borderRadius: 10, maxHeight: 200, objectFit: "cover", marginTop: 8 }} />}
                    <p style={{ fontSize: 13, color: THEME.olive, marginTop: 8, marginBottom: 0, fontWeight: 500 }}>✓ Completed · +{c.points} pts</p>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // TIME'S UP screen
  if (view === "challenges" && state.timeLeft === 0) return (
    <div style={{ background: THEME.sand, minHeight: "100vh", padding: "3rem 1.5rem", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⏰</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", color: THEME.terra }}>Time's up!</h1>
      <p style={{ fontSize: 16, color: THEME.textMid, margin: "0 0 24px" }}>Put your phones down and head back to base!</p>
      <div style={{ padding: "20px", borderRadius: 16, border: `1.5px solid ${THEME.sandDark}`, background: THEME.white, marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: THEME.textLight, margin: "0 0 4px" }}>Final score for</p>
        <p style={{ fontSize: 18, fontWeight: 600, color: THEME.text, margin: "0 0 8px" }}>{activeTeam}</p>
        <p style={{ fontSize: 42, fontWeight: 700, margin: 0, color: THEME.terra }}>{state.scores[activeTeam]}</p>
        <p style={{ fontSize: 13, color: THEME.textLight, margin: "4px 0 0" }}>{state.completed[activeTeam].length}/{CHALLENGES.length} challenges completed</p>
      </div>
      <button onClick={() => setView("leaderboard")} style={{ ...btn({ width: "100%", padding: "13px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 600, fontSize: 15 }) }}>🏆 See final leaderboard</button>
    </div>
  );

  // WINNER screen
  if (view === "winner") {
    const winner = sorted[0];
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <div style={{ background: `linear-gradient(160deg, ${THEME.sand} 0%, ${THEME.goldLight} 100%)`, minHeight: "100vh", padding: "2rem 1.5rem", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", color: THEME.terra }}>Hunt complete!</h1>
        <p style={{ fontSize: 15, color: THEME.textMid, margin: "0 0 28px" }}>Here's how it all ended</p>
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          {sorted.map((t, i) => (
            <div key={t} style={{ padding: "16px 20px", borderRadius: 16, border: `2px solid ${i === 0 ? THEME.gold : THEME.sandDark}`, background: i === 0 ? THEME.goldLight : THEME.white, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>{medals[i]}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: THEME.text }}>{t}</div>
                <div style={{ fontSize: 12, color: THEME.textLight, marginTop: 2 }}>{state.completed[t].length}/{CHALLENGES.length} challenges</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 22, color: i === 0 ? THEME.gold : THEME.textMid }}>{state.scores[t]}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setView("home")} style={{ ...btn({ width: "100%", padding: "13px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 600, fontSize: 15 }) }}>Back to home</button>
      </div>
    );
  }

  if (view === "install") return (
    <div style={{ background: THEME.sand, minHeight: "100vh", padding: "1.5rem", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: THEME.textMid }}>←</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: THEME.text }}>Add to home screen</h2>
      </div>
      <p style={{ fontSize: 14, color: THEME.textMid, marginBottom: 24, lineHeight: 1.6 }}>Make the app feel native by adding it to your phone's home screen. It opens fullscreen with no browser bar!</p>
      {[
        { os: "🍎", title: "iPhone (Safari)", steps: ["Open this link in Safari (not Chrome)", "Tap the Share button at the bottom ↑", "Scroll down and tap \"Add to Home Screen\"", "Tap \"Add\" in the top right"] },
        { os: "🤖", title: "Android (Chrome)", steps: ["Open this link in Chrome", "Tap the three dots ⋮ in the top right", "Tap \"Add to Home Screen\"", "Tap \"Add\" to confirm"] }
      ].map(({ os, title, steps }) => (
        <div key={os} style={{ marginBottom: 16, padding: "16px", borderRadius: 14, border: `1.5px solid ${THEME.sandDark}`, background: THEME.white }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>{os}</span>
            <span style={{ fontWeight: 600, fontSize: 15, color: THEME.text }}>{title}</span>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: THEME.terraLight, color: THEME.terra, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 14, lineHeight: 1.5, color: THEME.text }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (view === "home") return (
    <div style={{ background: THEME.sand, minHeight: "100vh", padding: "2rem 1.5rem", maxWidth: 480, margin: "0 auto" }}>
      <SyncBadge />
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>🏰</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", color: THEME.text }}>Dalt Vila Scavenger Hunt</h1>
        <p style={{ fontSize: 14, color: THEME.textMid, margin: "0 0 2px" }}>Ibiza's ancient walled city</p>
        <p style={{ fontSize: 13, color: THEME.textLight, margin: 0 }}>{regular.length} challenges · {bonus.length} bonus · {totalPossible} pts · 2 hours</p>
      </div>
      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {TEAMS.map((t, i) => {
          const col = TEAM_COLORS[i];
          const done = state.completed[t].length;
          const pctDone = Math.round((done / CHALLENGES.length) * 100);
          return (
            <button key={t} onClick={() => { setActiveTeam(t); setView("challenges"); }}
              style={{ ...btn({ padding: "16px", background: THEME.white, textAlign: "left", display: "flex", alignItems: "center", gap: 14, borderColor: THEME.sandDark }) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{col.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: THEME.text }}>{t}</div>
                <div style={{ height: 4, background: THEME.sandDark, borderRadius: 4, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pctDone}%`, background: col.icon, borderRadius: 4, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: 12, color: THEME.textLight, marginTop: 4 }}>{done}/{CHALLENGES.length} challenges</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: THEME.terra }}>{state.scores[t]}</div>
                <div style={{ fontSize: 11, color: THEME.textLight }}>pts</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <button onClick={() => setView("leaderboard")} style={{ ...btn({ padding: "12px", background: THEME.white, color: THEME.text, fontWeight: 500 }) }}>🏆 Leaderboard</button>
        <button onClick={() => setView("admin")} style={{ ...btn({ padding: "12px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 500 }) }}>⚙️ Admin</button>
      </div>
      <button onClick={() => setView("install")} style={{ ...btn({ width: "100%", padding: "11px", background: "none", color: THEME.textMid, fontSize: 13 }) }}>📲 Add to home screen</button>
    </div>
  );

  if (view === "challenges") return (
    <div style={{ background: THEME.sand, minHeight: "100vh", padding: "1.5rem", maxWidth: 480, margin: "0 auto" }}>
      <Warning />
      <SyncBadge />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: THEME.textMid }}>←</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: THEME.text }}>{activeTeam}</h2>
          <p style={{ margin: 0, fontSize: 13, color: THEME.textLight }}>{state.scores[activeTeam]} pts · {state.completed[activeTeam].length}/{CHALLENGES.length} done</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: timerColor, fontVariantNumeric: "tabular-nums" }}>
            {state.timeLeft === 0 ? "⏰ Done!" : formatTime(state.timeLeft)}
          </div>
          {state.timerRunning && (
            <div style={{ height: 3, width: 80, background: THEME.sandDark, borderRadius: 3, marginTop: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: timerColor, borderRadius: 3, transition: "width 1s linear" }} />
            </div>
          )}
        </div>
      </div>

      {/* Remaining challenges pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {regular.filter(c => !state.completed[activeTeam]?.includes(c.id)).map(c => (
          <button key={c.id} onClick={() => { setExpanded(c.id); setTimeout(() => document.getElementById(`c-${c.id}`)?.scrollIntoView({ behavior: "smooth" }), 100); }}
            style={{ ...btn({ padding: "4px 10px", background: THEME.white, fontSize: 12, color: THEME.textMid, borderRadius: 20 }) }}>
            {c.emoji} {c.points}pts
          </button>
        ))}
      </div>

      {/* Secret word instructions */}
      <div style={{ padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${THEME.sandDark}`, background: THEME.white, marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: THEME.text, margin: "0 0 4px" }}>🔐 Secret phrase challenge</p>
        <p style={{ fontSize: 12, color: THEME.textMid, margin: "0 0 10px", lineHeight: 1.5 }}>Each completed challenge reveals a letter. Collect all 11, unscramble them and submit the secret phrase for a 300pt bonus!</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {regular.map(c => {
            const done = state.completed[activeTeam]?.includes(c.id);
            return (
              <div key={c.id} style={{ width: 32, height: 32, borderRadius: 6, background: done ? THEME.terra : THEME.sand, border: `1.5px solid ${done ? THEME.terra : THEME.sandDark}`, color: done ? THEME.white : THEME.textLight, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {done ? LETTER_MAP[c.id] : "?"}
              </div>
            );
          })}
        </div>
        {state.completed[activeTeam]?.includes(99) ? (
          <p style={{ fontSize: 13, color: THEME.olive, fontWeight: 600, margin: 0 }}>✓ Secret phrase solved! +300 pts</p>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input value={secretGuess} onChange={e => { setSecretGuess(e.target.value); setSecretFeedback(null); }}
              placeholder="Enter the secret phrase..." style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${THEME.sandDark}`, background: THEME.sand, color: THEME.text, fontSize: 14, fontFamily: "inherit" }}
              onKeyDown={e => e.key === "Enter" && handleSecretSubmit()} />
            <button onClick={handleSecretSubmit} style={{ ...btn({ padding: "9px 14px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 600 }) }}>Submit</button>
          </div>
        )}
        {secretFeedback === "wrong" && <p style={{ fontSize: 12, color: THEME.terra, margin: "6px 0 0" }}>Not quite — keep collecting letters!</p>}
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>{regular.map(c => <div key={c.id} id={`c-${c.id}`}>{renderCard(c)}</div>)}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0 10px" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: THEME.gold }}>⭐ Bonus challenges</span>
        <div style={{ flex: 1, height: "0.5px", background: THEME.sandDark }} />
      </div>
      <div style={{ display: "grid", gap: 10 }}>{bonus.map(renderCard)}</div>
    </div>
  );

  if (view === "leaderboard") return (
    <div style={{ background: THEME.sand, minHeight: "100vh", padding: "1.5rem", maxWidth: 480, margin: "0 auto" }}>
      <SyncBadge />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: THEME.textMid }}>←</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: THEME.text }}>Leaderboard</h2>
        <button onClick={fetchState} style={{ ...btn({ marginLeft: "auto", padding: "5px 12px", background: "none", color: THEME.textMid, fontSize: 12 }) }}>↻ Refresh</button>
      </div>
      {state.timerRunning && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 42, fontWeight: 700, color: timerColor, fontVariantNumeric: "tabular-nums" }}>{formatTime(state.timeLeft)}</span>
          <p style={{ fontSize: 13, color: THEME.textLight, margin: "4px 0 8px" }}>remaining</p>
          <div style={{ height: 6, background: THEME.sandDark, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: timerColor, borderRadius: 4, transition: "width 1s linear" }} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {sorted.map((t, i) => (
          <div key={t} style={{ padding: "16px", borderRadius: 14, border: `1.5px solid ${i === 0 ? THEME.gold : THEME.sandDark}`, background: i === 0 ? THEME.goldLight : THEME.white, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 26, width: 32, textAlign: "center" }}>{["🥇", "🥈", "🥉"][i]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: THEME.text }}>{t}</div>
              <div style={{ fontSize: 12, color: THEME.textLight, marginTop: 2 }}>{state.completed[t].length}/{CHALLENGES.length} challenges · {state.completed[t].map(id => CHALLENGES.find(c => c.id === id)?.emoji).join(" ")}</div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 22, color: i === 0 ? THEME.gold : THEME.textMid }}>{state.scores[t]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === "admin") return (
    <div style={{ background: THEME.sand, minHeight: "100vh", padding: "1.5rem", maxWidth: 480, margin: "0 auto" }}>
      <SyncBadge />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: THEME.textMid }}>←</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: THEME.text }}>Admin</h2>
      </div>
      {!adminUnlocked ? (
        <div style={{ textAlign: "center", paddingTop: "2rem" }}>
          <p style={{ color: THEME.textMid, fontSize: 14, marginBottom: 16 }}>Enter the host passcode to continue.</p>
          <input type="password" value={adminPass} onChange={e => { setAdminPass(e.target.value); setAdminErr(false); }}
            placeholder="Passcode" style={{ width: "100%", boxSizing: "border-box", marginBottom: 8, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${THEME.sandDark}`, background: THEME.white, fontSize: 14, fontFamily: "inherit" }}
            onKeyDown={e => { if (e.key === "Enter") adminPass === PASSCODE ? setAdminUnlocked(true) : setAdminErr(true); }} />
          {adminErr && <p style={{ fontSize: 13, color: THEME.terra, margin: "0 0 8px" }}>Incorrect passcode.</p>}
          <button onClick={() => adminPass === PASSCODE ? setAdminUnlocked(true) : setAdminErr(true)}
            style={{ ...btn({ width: "100%", padding: "11px", background: THEME.terra, color: THEME.white, border: "none", fontWeight: 600 }) }}>Unlock</button>
          <p style={{ fontSize: 12, color: THEME.textLight, marginTop: 12 }}>Demo passcode: ibiza2026</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 20, padding: "16px", borderRadius: 14, border: `1.5px solid ${THEME.sandDark}`, background: THEME.white }}>
            <p style={{ fontSize: 13, color: THEME.textLight, margin: "0 0 10px", fontWeight: 500 }}>Timer — 2 hours</p>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 42, fontWeight: 700, color: timerColor, fontVariantNumeric: "tabular-nums" }}>{formatTime(state.timeLeft)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <button onClick={() => updateState(s => ({ ...s, timerRunning: true }))} style={{ ...btn({ padding: "10px", background: THEME.olive, color: THEME.white, border: "none", fontWeight: 500 }) }}>▶ Start</button>
              <button onClick={() => updateState(s => ({ ...s, timerRunning: false }))} style={{ ...btn({ padding: "10px", background: THEME.goldLight, color: THEME.gold, fontWeight: 500 }) }}>⏸ Pause</button>
              <button onClick={() => updateState(s => ({ ...s, timerRunning: false, timeLeft: TOTAL_TIME }))} style={{ ...btn({ padding: "10px", background: THEME.sand, color: THEME.textMid, fontWeight: 500 }) }}>↺ Reset</button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: THEME.textLight, margin: 0, fontWeight: 500 }}>Live team progress</p>
              <button onClick={() => { fetchState(); fetchPhotos(); }} style={{ ...btn({ padding: "5px 10px", background: "none", color: THEME.textMid, fontSize: 12 }) }}>↻ Refresh</button>
            </div>
            {TEAMS.map((t, i) => {
              const col = TEAM_COLORS[i];
              const teamPhotoKeys = Object.keys(cloudPhotos).filter(k => k.startsWith(`${t}:`));
              return (
                <div key={t} style={{ marginBottom: 12, padding: "14px", borderRadius: 14, border: `1.5px solid ${THEME.sandDark}`, background: THEME.white }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{col.emoji}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: THEME.text }}>{t}</span>
                    <span style={{ fontSize: 12, color: THEME.textLight }}>{state.completed[t].length}/{CHALLENGES.length} done</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => updateState(s => ({ ...s, scores: { ...s.scores, [t]: Math.max(0, s.scores[t] - 50) } }))} style={{ ...btn({ width: 28, height: 28, padding: 0, background: THEME.sand, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }) }}>−</button>
                      <span style={{ fontSize: 15, fontWeight: 700, minWidth: 44, textAlign: "center", color: THEME.terra }}>{state.scores[t]}</span>
                      <button onClick={() => updateState(s => ({ ...s, scores: { ...s.scores, [t]: s.scores[t] + 50 } }))} style={{ ...btn({ width: 28, height: 28, padding: 0, background: THEME.sand, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }) }}>+</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: THEME.textLight, marginBottom: teamPhotoKeys.length ? 8 : 0 }}>
                    {state.completed[t].map(id => CHALLENGES.find(c => c.id === id)?.emoji).join(" ") || "No challenges completed yet"}
                  </div>
                  {teamPhotoKeys.length > 0 && (
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                      {teamPhotoKeys.map((key) => {
                        const challengeId = parseInt(key.split(":")[1]);
                        const ch = CHALLENGES.find(c => c.id === challengeId);
                        return (
                          <div key={key} style={{ flexShrink: 0, textAlign: "center" }}>
                            <img src={cloudPhotos[key]} alt="team photo" style={{ width: 72, height: 72, borderRadius: 8, objectFit: "cover", display: "block" }} />
                            <div style={{ fontSize: 10, color: THEME.textLight, marginTop: 2 }}>{ch?.emoji}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {teamPhotoKeys.length === 0 && <p style={{ fontSize: 12, color: THEME.textLight, margin: "4px 0 0", fontStyle: "italic" }}>No photos yet</p>}
                </div>
              );
            })}
          </div>

          <button onClick={() => setView("winner")} style={{ ...btn({ width: "100%", padding: "12px", background: THEME.gold, color: THEME.white, border: "none", fontWeight: 600, marginBottom: 10 }) }}>
            🏆 Show winner screen
          </button>
          <button onClick={async () => {
            await fetch(`${WORKER_URL}/reset`, { method: "POST" });
            await fetchState();
            setAnswers({}); setFeedback({}); setPhotos({});
            setWarned30(false); setWarned10(false);
          }} style={{ ...btn({ width: "100%", padding: "11px", background: "none", color: THEME.terra, borderColor: THEME.terra, fontWeight: 500 }) }}>
            Reset all progress
          </button>
        </div>
      )}
    </div>
  );
}
