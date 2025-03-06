const canvas = document.getElementById('particle');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80; // 调整粒子数量
const mouse = { x: -1000, y: -1000, radius: 150 }; // 添加鼠标影响范围

class Particle {
  constructor() {
    this.reset();
    this.baseSize = Math.random() * 2 + 1; // 基础粒子大小
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = this.baseSize;
    // 改为灰白色系配色
    this.color = `hsla(${Math.random() * 360}, 20%, 50%, 0.8)`;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // 边界反弹
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // 鼠标互动效果
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 鼠标斥力效果
    if (distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      this.x -= dx * force * 0.1;
      this.y -= dy * force * 0.1;
      this.radius = this.baseSize + force * 3; // 靠近鼠标时变大
    } else {
      this.radius = this.baseSize;
    }

    this.x += this.vx;
    this.y += this.vy;

    // 绘制粒子间连线
    particles.forEach(p => {
      if (p === this) return;
      const pdx = this.x - p.x;
      const pdy = this.y - p.y;
      const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

      if (pDist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(0, 0%, 50%, ${1 - pDist/100})`;
        ctx.lineWidth = 0.3;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });

    // 绘制鼠标连线
    if (distance < mouse.radius) {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(0, 0%, 50%, ${1 - distance/mouse.radius})`;
      ctx.lineWidth = 0.5;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }
}

// 初始化粒子
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// 鼠标追踪
canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// 窗口大小调整
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles.forEach(p => p.reset());
});