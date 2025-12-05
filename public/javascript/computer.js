const startBtn = document.getElementById('startBtn');
const screen = document.getElementById('screen');
const led = document.getElementById('led');
const desktop = document.getElementById('desktop');
const computer = document.getElementById('computer');
let on = false, clockTimer = null;

function formatTime(d) {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = formatTime(new Date());
}

function powerToggle() {
  on = !on;
  if (on) {
    screen.classList.remove('off');
    screen.classList.add('on');
    screen.setAttribute('aria-label', 'Écran allumé');
    led.classList.add('on');
    startBtn.textContent = 'Shutdown';
    startBtn.setAttribute('aria-pressed', 'true');
    desktop.style.opacity = 0;
    setTimeout(() => {
      desktop.style.opacity = 1;
      updateClock();
      clockTimer = setInterval(updateClock, 1000);
    }, 700);
  } else {
    screen.classList.remove('on');
    screen.classList.add('off');
    screen.setAttribute('aria-label', 'Écran éteint');
    led.classList.remove('on');
    startBtn.textContent = 'Start';
    startBtn.setAttribute('aria-pressed', 'false');
    desktop.style.opacity = 0;
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
  }
}

startBtn.addEventListener('click', powerToggle);
startBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); powerToggle(); }
});

const levelsContainer = document.getElementById("levelsContainer");
const levelsGrid = document.getElementById("levelsGrid");
const logo = document.querySelector('#desktop img');
const backBtn = document.getElementById('backBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function renderLevels() {
  levelsGrid.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    const lvl = document.createElement("div");
    lvl.className = "level"; 
    lvl.textContent = "Niveau " + i;

    if (i === 1) lvl.addEventListener("click", () => {
      levelsContainer.style.display = "none"; 
      document.getElementById('level1Modal').style.display = "flex";
    });
    if (i === 2) lvl.addEventListener("click", () => {
      levelsContainer.style.display = "none"; 
      document.getElementById('level2Modal').style.display = "flex"; 
      currentQuestionIndex = 0; 
      renderQuiz();
    });
    if (i === 3) lvl.addEventListener("click", () => {
      levelsContainer.style.display = "none"; 
      document.getElementById('level3Modal').style.display = "flex"; 
      showCurrentImage();
    });
    if (i === 4) lvl.addEventListener("click", () => {
      levelsContainer.style.display = "none"; 
      document.getElementById('level4Modal').style.display = "flex"; 
      resetPedalier();
    });

    levelsGrid.appendChild(lvl);
  }
}

renderLevels();

logo.addEventListener('click', () => { 
  levelsContainer.style.display = levelsContainer.style.display === "none" ? "flex" : "none"; 
});
backBtn.addEventListener('click', () => { levelsContainer.style.display = "none"; });

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    computer.requestFullscreen().then(() => computer.classList.add('fullscreen'));
  } else {
    document.exitFullscreen().then(() => computer.classList.remove('fullscreen'));
  }
});

const closeLevel1Modal = document.getElementById('closeLevel1Modal');
closeLevel1Modal.addEventListener('click', () => {
  document.getElementById('level1Modal').style.display = 'none';
  levelsContainer.style.display = 'flex';
});
document.querySelector('#level1Modal .link-button').addEventListener('click', () => {
  alert("Bravo ! Vous avez réussi le niveau 1 (D)");
  document.getElementById('level1Modal').style.display = 'none';
  levelsContainer.style.display = 'flex';
  document.querySelectorAll('.level').forEach(l => { if (l.textContent === "Niveau 1") l.classList.add('completed'); });
});

const level2Modal = document.getElementById('level2Modal');
const closeLevel2Modal = document.getElementById('closeLevel2Modal');
const currentQuestionContainer = document.getElementById('currentQuestionContainer');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const submitQuizBtn = document.getElementById('submitQuizBtn');
let currentQuestionIndex = 0;
let userAnswers = Array(8).fill(null);
const quizQuestions = [
  { q: "Que signifie le 'N' dans NIRD ?", options: ["Numérique", "Nature", "Nouveau", "Normal"], answer: 0 },
  { q: "Quel système d'exploitation libre est encouragé par la démarche NIRD ?", options: ["Windows", "Linux", "macOS", "Android"], answer: 1 },
  { q: "La démarche NIRD vise un numérique :", options: ["Inclusif, Responsable et Durable", "Rapide et Cher", "Compliqué et Polluant", "Réservé aux experts"], answer: 0 },
  { q: "Quel est l'un des objectifs du reconditionnement d'ordinateurs dans la démarche NIRD ?", options: ["Lutter contre l'obsolescence programmée", "Acheter plus d'ordinateurs neufs", "Utiliser uniquement des tablettes", "Ignorer les anciens ordinateurs"], answer: 0 },
  { q: "Pourquoi la démarche NIRD encourage-t-elle l'utilisation de Linux ?", options: ["Pour réduire les coûts et l'impact environnemental", "Parce que c'est plus compliqué", "Pour obligatoirement acheter du matériel neuf", "Pour interdire l'accès à Internet"], answer: 0 },
  { q: "Quel est l'un des piliers de la démarche NIRD ?", options: ["L'inclusion", "L'exclusion", "La pollution", "Le gaspillage"], answer: 0 },
  { q: "La démarche NIRD s'adresse en premier lieu à :", options: ["Les enseignants et établissements scolaires", "Les entreprises privées", "Les gouvernements étrangers", "Les musées"], answer: 0 },
  { q: "Quel est l'un des avantages du reconditionnement d'ordinateurs ?", options: ["Réduire les déchets électroniques", "Augmenter la pollution", "Rendre les ordinateurs plus lents", "Empêcher les élèves d'apprendre"], answer: 0 }
];

function renderQuiz() {
  currentQuestionContainer.innerHTML = "";
  const q = quizQuestions[currentQuestionIndex];
  const counter = document.createElement('div'); 
  counter.textContent = `Question ${currentQuestionIndex + 1} / ${quizQuestions.length}`; 
  counter.style.marginBottom = '10px'; 
  currentQuestionContainer.appendChild(counter);

  const div = document.createElement("div"); 
  const question = document.createElement("p"); 
  question.textContent = q.q; 
  div.appendChild(question);

  q.options.forEach((opt, i) => {
    const label = document.createElement("label"); 
    label.style.display = "block"; 
    const input = document.createElement("input"); 
    input.type = "radio"; 
    input.name = "q" + currentQuestionIndex; 
    input.value = i; 
    if (userAnswers[currentQuestionIndex] === i) input.checked = true; 
    input.addEventListener('change', () => { userAnswers[currentQuestionIndex] = i; }); 
    label.appendChild(input); 
    label.appendChild(document.createTextNode(" " + opt)); 
    div.appendChild(label); 
  });
  currentQuestionContainer.appendChild(div);

  prevQuestionBtn.style.display = currentQuestionIndex === 0 ? "none" : "block";
  nextQuestionBtn.style.display = currentQuestionIndex === quizQuestions.length - 1 ? "none" : "block";
  submitQuizBtn.style.display = currentQuestionIndex === quizQuestions.length - 1 ? "block" : "none";
}

prevQuestionBtn.addEventListener("click", () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; renderQuiz(); } });
nextQuestionBtn.addEventListener("click", () => { if (currentQuestionIndex < quizQuestions.length - 1) { currentQuestionIndex++; renderQuiz(); } });
submitQuizBtn.addEventListener("click", () => {
  let score = 0; 
  quizQuestions.forEach((q, index) => { if (userAnswers[index] === q.answer) score++; });
  if (score >= 5) {
    alert(`Félicitations ! Vous avez réussi le niveau 2 avec ${score}/${quizQuestions.length} bonnes réponses ! (R)`);
    document.querySelectorAll('.level').forEach(l => { if (l.textContent === "Niveau 2") l.classList.add('completed'); });
    level2Modal.style.display = "none";
  } else { 
    alert(`Vous avez obtenu ${score}/${quizQuestions.length}.`); 
  }
});
closeLevel2Modal.addEventListener("click", () => { level2Modal.style.display = "none"; levelsContainer.style.display = "flex"; });

const imgs = document.querySelectorAll('#imagesContainer img');
const recycleZone = document.getElementById('recycleZone');
const reuseZone = document.getElementById('reuseZone');
const correctZones = { 
  'img3': 'recycleZone', 'img5': 'recycleZone', 'img9': 'recycleZone', 
  'img1': 'reuseZone', 'img2': 'reuseZone', 'img4': 'reuseZone', 'img6': 'reuseZone', 
  'img7': 'reuseZone', 'img8': 'reuseZone', 'img10': 'reuseZone' 
};
let currentImgIndex = 0;

function showCurrentImage() { 
  imgs.forEach((img, i) => { img.style.display = (i === currentImgIndex) ? 'block' : 'none'; }); 
}

imgs.forEach(img => { img.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', e.target.id); }); });
[recycleZone, reuseZone].forEach(zone => {
  zone.addEventListener('dragover', e => e.preventDefault());
  zone.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const img = document.getElementById(id);
    if (correctZones[id] === zone.id) {
      zone.appendChild(img);
      currentImgIndex++;
      if (currentImgIndex >= imgs.length) currentImgIndex = imgs.length - 1;
      showCurrentImage();
    } else { alert("Mauvaise zone ! Cette image ne peut pas être déposée ici."); }
  });
});

document.getElementById('submitLevel3Btn').addEventListener('click', () => {
  let allCorrect = true;
  for (const [imgId, zoneId] of Object.entries(correctZones)) {
    const img = document.getElementById(imgId);
    if (img.parentElement.id !== zoneId) { allCorrect = false; break; }
  }
  if (allCorrect) {
    alert("Bravo ! Vous avez réussi le niveau 3 ! (I)");
    document.getElementById('level3Modal').style.display = 'none';
    document.querySelectorAll('.level').forEach(l => { if (l.textContent === "Niveau 3") l.classList.add('completed'); });
  } else { alert("Certaines images ne sont pas correctement placées. Essayez encore !"); }
});

document.getElementById('closeLevel3Modal').addEventListener('click', () => { 
  document.getElementById('level3Modal').style.display = 'none'; 
  levelsContainer.style.display = 'flex'; 
});

const level4Modal = document.getElementById('level4Modal');
const closeLevel4Modal = document.getElementById('closeLevel4Modal');
const pedalBtn = document.getElementById('pedalBtn');
const pedalCounter = document.getElementById('pedalCounter');
const light = document.getElementById('light');
let pedalCount = 0;
const targetPedals = 30;
const energyPerPedal = 5;
let rotation = 0;

function resetPedalier() { 
  pedalCount = 0; 
  rotation = 0; 
  pedalCounter.textContent = `Tours effectués : 0 / ${targetPedals}`; 
  light.style.background = '#333'; 
  light.style.transform = 'rotate(0deg)'; 
}

pedalBtn.addEventListener('click', () => {
  pedalCount++;
  rotation += 30;
  pedalCounter.textContent = `Tours effectués : ${pedalCount} / ${targetPedals}`;
  light.style.transform = `rotate(${rotation}deg)`;
  if (pedalCount >= targetPedals) {
    light.style.background = 'yellow';
    const totalEnergy = pedalCount * energyPerPedal;
    const computerSeconds = Math.floor(totalEnergy / 0.1);
    alert(`Bravo ! Vous avez réussi le niveau 4 ! (N)\nEn ${targetPedals} tours, vous avez généré ${totalEnergy} kJ, soit l'énergie utilisée par un ordinateur classique pendant ${computerSeconds} secondes.`);
    level4Modal.style.display = 'none';
    levelsContainer.style.display = 'flex';
    document.querySelectorAll('.level').forEach(level => { if (level.textContent === "Niveau 4") level.classList.add('completed'); });
  }
});

closeLevel4Modal.addEventListener('click', () => { 
  level4Modal.style.display = 'none'; 
  levelsContainer.style.display = 'flex'; 
});
