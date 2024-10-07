const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ekran boyutları
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

// Canvas boyutunu ayarla
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// Top özellikleri
let topRadius = Math.random() * 10 + 10;
let x = Math.random() * (SCREEN_WIDTH - 2 * topRadius) + topRadius;
let y = Math.random() * (SCREEN_HEIGHT - 2 * topRadius) + topRadius;
let speed = 300;
let angle = Math.random() * 2 * Math.PI;

// Renk ve iz özellikleri
let hue = Math.random();
let trail = [];

// Yön değiştirme ve yeniden belirme zamanı
let changeTime = 0;
let changeInterval = Math.random() * 1.5 + 0.5;

function repositionBall() {
  x = Math.random() * (SCREEN_WIDTH - 2 * topRadius) + topRadius;
  y = Math.random() * (SCREEN_HEIGHT - 2 * topRadius) + topRadius;
  angle = Math.random() * 2 * Math.PI;
  topRadius = Math.random() * 10 + 10;
  hue = Math.random();
}

function changeDirection() {
  angle = Math.random() * 2 * Math.PI;
}

function createGradient() {
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
  gradient.addColorStop(0, 'rgb(50, 50, 100)');
  gradient.addColorStop(1, 'rgb(20, 20, 50)');
  return gradient;
}

function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

let lastTime = performance.now();
function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Rastgele yön değiştirme ve yeniden belirme
  changeTime += deltaTime;
  if (changeTime >= changeInterval) {
    if (Math.random() < 0.3) {
      repositionBall();
    } else {
      changeDirection();
    }
    changeTime = 0;
    changeInterval = Math.random() * 1.5 + 0.5;
  }

  // Topun pozisyonunu güncelle
  x += Math.cos(angle) * speed * deltaTime;
  y += Math.sin(angle) * speed * deltaTime;

  // Ekran sınırlarını kontrol et
  if (x <= topRadius || x >= SCREEN_WIDTH - topRadius || y <= topRadius || y >= SCREEN_HEIGHT - topRadius) {
    changeDirection();
  }

  // Topu ekranda tut
  x = Math.max(topRadius, Math.min(x, SCREEN_WIDTH - topRadius));
  y = Math.max(topRadius, Math.min(y, SCREEN_HEIGHT - topRadius));

  // Rengi güncelle
  hue = (hue + 0.001) % 1;
  const color = hsvToRgb(hue, 1, 1);

  // İzi güncelle
  trail.push({ x: x, y: y, radius: topRadius, color: color });
  if (trail.length > 20) {
    trail.shift();
  }

  // Ekranı temizle ve arka planı çiz
  ctx.fillStyle = createGradient();
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // İzi çiz
  trail.forEach((t, i) => {
    ctx.globalAlpha = i / trail.length;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, 2 * Math.PI);
    ctx.fillStyle = t.color;
    ctx.fill();
  });

  // Topu çiz
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(x, y, topRadius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  requestAnimationFrame(gameLoop);
}

// Pencere boyutu değiştiğinde canvas'ı yeniden boyutlandır
window.addEventListener('resize', () => {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
});

// Animasyonu başlat
requestAnimationFrame(gameLoop);
