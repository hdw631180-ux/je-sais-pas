import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========== DATA ==========
const ENGINES = {
  mercedes: {
    name: 'Mercedes-AMG M15 E Performance',
    color: 0x00d2be,
    powerPeak: 1040,
    torquePeak: 820,
    report: {
      title: 'Mercedes-AMG M15 — Rapport technique',
      body: `
        <p>Le M15 est l'évolution du power unit dominant des années précédentes. Architecture V6 1.6L turbocompressé + système hybride ERS.</p>
        <ul>
          <li><strong>ICE :</strong> ~850–900 ch (estimation)</li>
          <li><strong>MGU-K :</strong> 120 kW (règlement)</li>
          <li><strong>MGU-H :</strong> récupération très efficace</li>
          <li><strong>Points forts :</strong> fiabilité exceptionnelle, cartographie fine, consommation optimisée</li>
          <li><strong>Faiblesse relative :</strong> parfois légèrement en retrait en puissance pure pure face à Ferrari</li>
        </ul>
        <p>Le packaging et la gestion thermique restent parmi les meilleurs du plateau.</p>
      `
    }
  },
  ferrari: {
    name: 'Ferrari 066/12',
    color: 0xe10600,
    powerPeak: 1030,
    torquePeak: 810,
    report: {
      title: 'Ferrari 066/12 — Rapport technique',
      body: `
        <p>Le 066/12 privilégie la puissance maximale et un son caractéristique. Très bon en qualification.</p>
        <ul>
          <li><strong>ICE :</strong> souvent le plus puissant du plateau en quali</li>
          <li><strong>MGU-K / MGU-H :</strong> déploiement agressif possible</li>
          <li><strong>Points forts :</strong> puissance brute, réponse, sonorité</li>
          <li><strong>Points d'attention :</strong> fiabilité et gestion de la chaleur sur longues distances</li>
        </ul>
        <p>Excellent en mode qualification. En course, la cartographie est plus conservatrice.</p>
      `
    }
  },
  honda: {
    name: 'Honda RBPTH002 (Red Bull)',
    color: 0x1e41ff,
    powerPeak: 1035,
    torquePeak: 815,
    report: {
      title: 'Honda RBPTH002 — Rapport technique',
      body: `
        <p>Power unit développé pour Red Bull. Excellent équilibre entre puissance, drivabilité et déploiement ERS.</p>
        <ul>
          <li><strong>Points forts :</strong> drivabilité, réponse à l'accélérateur, gestion ERS</li>
          <li><strong>MGU-H :</strong> très bien intégré au turbo</li>
          <li><strong>Fiabilité :</strong> fortement améliorée ces dernières saisons</li>
        </ul>
        <p>Considéré comme l'un des plus complets du plateau actuel.</p>
      `
    }
  },
  renault: {
    name: 'Renault E-Tech RE24',
    color: 0xffd200,
    powerPeak: 1000,
    torquePeak: 780,
    report: {
      title: 'Renault E-Tech RE24 — Rapport technique',
      body: `
        <p>Le RE24 continue la progression d'Alpine/Renault. Moins de puissance pure que les leaders, mais package en amélioration.</p>
        <ul>
          <li><strong>Puissance :</strong> légèrement en retrait</li>
          <li><strong>Points forts :</strong> packaging compact, progrès en fiabilité</li>
          <li><strong>Focus :</strong> efficacité et intégration châssis</li>
        </ul>
        <p>Les gains se font principalement sur la drivabilité et la consommation.</p>
      `
    }
  }
};

const REPORTS = [
  {
    id: 'archi',
    tag: 'Architecture',
    title: 'V6 Turbo Hybrid — Comment ça marche',
    body: `
      <p>Depuis 2014, la Formule 1 utilise un power unit composé de :</p>
      <ul>
        <li><strong>ICE</strong> : moteur à combustion interne V6 1.6 litre, limité à 15 000 tr/min</li>
        <li><strong>Turbo</strong> : un seul turbocompresseur</li>
        <li><strong>MGU-K</strong> : récupère l'énergie au freinage (max 120 kW)</li>
        <li><strong>MGU-H</strong> : récupère l'énergie des gaz d'échappement via le turbo</li>
        <li><strong>ES</strong> : batterie (Energy Store) limitée en capacité et en débit</li>
        <li><strong>CE</strong> : électronique de contrôle</li>
      </ul>
      <p>La puissance totale dépasse largement les 1000 chevaux en mode quali.</p>
    `
  },
  {
    id: 'ers',
    tag: 'ERS',
    title: 'Système de récupération d\'énergie',
    body: `
      <p>L'ERS (Energy Recovery System) est au cœur de la performance moderne.</p>
      <ul>
        <li>4 MJ d'énergie déployable par tour via le MGU-K</li>
        <li>Le MGU-H n'a pas de limite de déploiement (mais contraintes thermiques)</li>
        <li>Modes : Qualifying, Race, Save, Overtake</li>
      </ul>
      <p>Le mode Overtake déploie le maximum disponible pour un dépassement.</p>
    `
  },
  {
    id: 'limits',
    tag: 'Règlement',
    title: 'Limites réglementaires 2024-2025',
    body: `
      <p>Principales contraintes :</p>
      <ul>
        <li>Régime max : 15 000 rpm</li>
        <li>Débit carburant max : 100 kg/h au-dessus de 10 500 rpm</li>
        <li>MGU-K : 120 kW max</li>
        <li>Nombre de power units limités par saison (pénalités si dépassement)</li>
      </ul>
      <p>À partir de 2026, le règlement change fortement (plus d'électrique, carburant durable).</p>
    `
  },
  {
    id: 'test',
    tag: 'Banc d\'essai',
    title: 'Comment on teste un power unit',
    body: `
      <p>Les constructeurs utilisent des bancs dynamométriques très sophistiqués :</p>
      <ul>
        <li>Mesure de puissance, couple, consommation, températures</li>
        <li>Cycles de endurance (plusieurs milliers de km simulés)</li>
        <li>Cartographie complète de tous les modes</li>
        <li>Validation de la fiabilité avant mise en piste</li>
      </ul>
      <p>Ce site simule une version très simplifiée de ces tests.</p>
    `
  }
];

// ========== STATE ==========
let currentEngine = 'mercedes';
let rpm = 0;
let throttle = 0;
let ersMode = 'quali';
let battery = 100;

// ========== THREE.JS ==========
let scene, camera, renderer, controls;
let engineGroup;
let pistons = [];
let crankAngle = 0;
let turboRotor;

function initThree() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('engineCanvas');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0c);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(4.2, 2.4, 5.5);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 12;
  controls.target.set(0, 0.3, 0);

  // Lights
  const amb = new THREE.AmbientLight(0x404050, 0.6);
  scene.add(amb);

  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(5, 8, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x88aaff, 0.4);
  fill.position.set(-4, 2, -3);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xff6644, 0.35);
  rim.position.set(0, 3, -6);
  scene.add(rim);

  buildEngine();
  animate();

  window.addEventListener('resize', onResize);
}

function buildEngine() {
  if (engineGroup) scene.remove(engineGroup);
  engineGroup = new THREE.Group();
  pistons = [];

  const color = ENGINES[currentEngine].color;
  const metal = new THREE.MeshStandardMaterial({
    color: 0x2a2a32,
    metalness: 0.85,
    roughness: 0.35
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.3,
    emissive: color,
    emissiveIntensity: 0.15
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x15151a,
    metalness: 0.9,
    roughness: 0.25
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xccccdd,
    metalness: 1,
    roughness: 0.15
  });

  // === BLOCK (V6) ===
  const block = new THREE.Group();

  // Main block
  const blockGeo = new THREE.BoxGeometry(2.4, 1.1, 1.4);
  const blockMesh = new THREE.Mesh(blockGeo, metal);
  blockMesh.position.y = 0.15;
  block.add(blockMesh);

  // Cylinder banks (simplified V shape)
  const bankGeo = new THREE.BoxGeometry(2.2, 0.7, 0.55);
  const leftBank = new THREE.Mesh(bankGeo, darkMetal);
  leftBank.position.set(0, 0.85, 0.38);
  leftBank.rotation.x = -0.35;
  block.add(leftBank);

  const rightBank = new THREE.Mesh(bankGeo, darkMetal);
  rightBank.position.set(0, 0.85, -0.38);
  rightBank.rotation.x = 0.35;
  block.add(rightBank);

  // Cylinder heads
  const headGeo = new THREE.BoxGeometry(2.15, 0.28, 0.5);
  const leftHead = new THREE.Mesh(headGeo, accentMat);
  leftHead.position.set(0, 1.25, 0.52);
  leftHead.rotation.x = -0.35;
  block.add(leftHead);

  const rightHead = new THREE.Mesh(headGeo, accentMat);
  rightHead.position.set(0, 1.25, -0.52);
  rightHead.rotation.x = 0.35;
  block.add(rightHead);

  // Intake trumpets (simplified)
  for (let i = 0; i < 3; i++) {
    const x = -0.7 + i * 0.7;
    const trumpet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12),
      chrome
    );
    trumpet.position.set(x, 1.55, 0.65);
    trumpet.rotation.x = -0.5;
    block.add(trumpet);

    const trumpet2 = trumpet.clone();
    trumpet2.position.set(x, 1.55, -0.65);
    trumpet2.rotation.x = 0.5;
    block.add(trumpet2);
  }

  engineGroup.add(block);

  // === CRANK / BOTTOM ===
  const sump = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.4, 1.2),
    darkMetal
  );
  sump.position.y = -0.45;
  engineGroup.add(sump);

  // === TURBO (right side) ===
  const turboGroup = new THREE.Group();
  turboGroup.position.set(1.6, 0.4, 0);

  const turboHousing = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 20, 16),
    metal
  );
  turboGroup.add(turboHousing);

  // Rotor
  turboRotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8),
    chrome
  );
  turboRotor.rotation.z = Math.PI / 2;
  turboGroup.add(turboRotor);

  // Exhaust pipe
  const exhaust = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.9, 12),
    darkMetal
  );
  exhaust.position.set(0.5, -0.1, 0);
  exhaust.rotation.z = Math.PI / 2;
  turboGroup.add(exhaust);

  engineGroup.add(turboGroup);

  // === MGU-H (on turbo) ===
  const mguh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.35, 16),
    accentMat
  );
  mguh.position.set(1.6, 0.4, 0.55);
  mguh.rotation.x = Math.PI / 2;
  engineGroup.add(mguh);

  // === MGU-K (front) ===
  const mguk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.5, 16),
    accentMat
  );
  mguk.position.set(-1.55, 0.1, 0);
  mguk.rotation.z = Math.PI / 2;
  engineGroup.add(mguk);

  // Label plate
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.25, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x111114, metalness: 0.5, roughness: 0.4 })
  );
  plate.position.set(0, 0.15, 0.72);
  engineGroup.add(plate);

  // Battery box (simplified)
  const batteryBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.35, 0.5),
    darkMetal
  );
  batteryBox.position.set(-0.8, -0.7, 0.9);
  engineGroup.add(batteryBox);

  // Floor / base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.8, 2.8, 0.06, 48),
    new THREE.MeshStandardMaterial({ color: 0x121216, metalness: 0.3, roughness: 0.7 })
  );
  base.position.y = -1.05;
  engineGroup.add(base);

  // Soft glow ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.02, 8, 64),
    new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.35 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.0;
  engineGroup.add(ring);

  scene.add(engineGroup);
}

function onResize() {
  const container = document.getElementById('canvas-container');
  if (!container || !camera || !renderer) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate turbo according to RPM
  if (turboRotor) {
    const speed = (rpm / 15000) * 0.8;
    turboRotor.rotation.x += speed;
  }

  // Gentle idle rotation of whole engine when RPM > 0
  if (engineGroup && rpm > 500) {
    engineGroup.rotation.y += 0.0015 * (rpm / 15000);
  }

  controls.update();
  renderer.render(scene, camera);
}

// ========== UI LOGIC ==========
function updateTelemetry() {
  const eng = ENGINES[currentEngine];
  const rpmRatio = rpm / 15000;
  const thr = throttle / 100;

  // Power estimate
  let powerMult = 1;
  if (ersMode === 'quali') powerMult = 1.05;
  if (ersMode === 'overtake') powerMult = 1.08;
  if (ersMode === 'save') powerMult = 0.88;
  if (ersMode === 'race') powerMult = 0.97;

  const power = Math.round(eng.powerPeak * rpmRatio * thr * powerMult);
  const torque = Math.round(eng.torquePeak * Math.sin(rpmRatio * Math.PI) * thr * powerMult);

  document.getElementById('rpmValue').textContent = rpm.toLocaleString('fr-FR');
  document.getElementById('throttleValue').textContent = throttle + '%';
  document.getElementById('powerValue').textContent = power + ' ch';
  document.getElementById('torqueValue').textContent = torque + ' Nm';

  // Temp
  const temp = 85 + (rpmRatio * thr * 45) + (ersMode === 'overtake' ? 8 : 0);
  document.getElementById('tempValue').textContent = Math.round(temp) + '°C';
  document.getElementById('tempFill').style.width = Math.min(100, ((temp - 80) / 60) * 100) + '%';

  // Telemetry cards
  const ice = Math.round(power * 0.82);
  const mguk = Math.round(120 * thr * (ersMode === 'save' ? 0.4 : 1));
  const mguh = Math.round(80 * rpmRatio * thr);
  const boost = (rpmRatio * thr * 2.8).toFixed(1);
  const fuel = (rpmRatio * thr * 95).toFixed(1);

  // Battery drain simulation
  if (ersMode === 'overtake' || ersMode === 'quali') {
    battery = Math.max(0, battery - 0.04 * thr);
  } else if (ersMode === 'save' && thr < 0.4) {
    battery = Math.min(100, battery + 0.02);
  }

  document.getElementById('icePower').textContent = ice + ' kW';
  document.getElementById('mgukPower').textContent = mguk + ' kW';
  document.getElementById('mguhPower').textContent = mguh + ' kW';
  document.getElementById('battery').textContent = Math.round(battery) + '%';
  document.getElementById('boost').textContent = boost + ' bar';
  document.getElementById('fuel').textContent = fuel + ' kg/h';
}

function setEngine(id) {
  currentEngine = id;
  buildEngine();
  updateTelemetry();
}

function initUI() {
  // RPM & Throttle
  const rpmInput = document.getElementById('rpm');
  const throttleInput = document.getElementById('throttle');

  rpmInput.addEventListener('input', (e) => {
    rpm = parseInt(e.target.value, 10);
    updateTelemetry();
  });

  throttleInput.addEventListener('input', (e) => {
    throttle = parseInt(e.target.value, 10);
    updateTelemetry();
  });

  // Engine select
  document.getElementById('engineSelect').addEventListener('change', (e) => {
    setEngine(e.target.value);
  });

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ersMode = btn.dataset.mode;
      const labels = { quali: 'Qualifying', race: 'Race', save: 'Save', overtake: 'Overtake' };
      document.getElementById('ersModeLabel').textContent = labels[ersMode];
      updateTelemetry();
    });
  });

  // Reports
  const grid = document.getElementById('reportsGrid');
  REPORTS.forEach(r => {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.innerHTML = `
      <span class="tag">${r.tag}</span>
      <h3>${r.title}</h3>
      <p>${r.body.replace(/<[^>]+>/g, ' ').slice(0, 90)}…</p>
    `;
    card.addEventListener('click', () => openModal(r.title, r.body));
    grid.appendChild(card);
  });

  // Also add engine-specific reports
  Object.values(ENGINES).forEach(eng => {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.innerHTML = `
      <span class="tag">Constructeur</span>
      <h3>${eng.name}</h3>
      <p>Fiche technique et analyse du power unit.</p>
    `;
    card.addEventListener('click', () => openModal(eng.report.title, eng.report.body));
    grid.appendChild(card);
  });

  // Modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  updateTelemetry();
}

function openModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('reportModal').hidden = false;
}

function closeModal() {
  document.getElementById('reportModal').hidden = true;
}

// ========== START ==========
initThree();
initUI();
