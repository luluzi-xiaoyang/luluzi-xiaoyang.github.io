/* ============================================================
   💫 浪漫情侣博客 - 明亮闪耀 BlingBling 背景动画 v4
   明亮梦幻星河 + Bokeh光斑 + 飘落爱心星星 + 呼吸动效
   ============================================================ */

(function() {
  'use strict';
  
  // 等待 DOM 加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlingBling);
  } else {
    initBlingBling();
  }
  
  function initBlingBling() {
    // ========== 1. 创建 Canvas 星空背景 ==========
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -3;
      pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let shootingStars = [];
    let bokehCircles = [];
    
    // 明亮配色方案
    const colors = {
      pink: { r: 255, g: 126, b: 179 },
      rose: { r: 244, g: 114, b: 182 },
      coral: { r: 255, g: 143, b: 163 },
      sky: { r: 116, g: 192, b: 252 },
      lavender: { r: 177, g: 151, b: 252 },
      mint: { r: 105, g: 219, b: 124 },
      gold: { r: 252, g: 196, b: 25 },
      white: { r: 255, g: 255, b: 255 }
    };
    
    // 调整画布大小
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
      initBokeh();
    }
    
    // 初始化星星（明亮、闪烁）
    function initStars() {
      stars = [];
      const starCount = Math.floor((width * height) / 4000);
      
      for (let i = 0; i < starCount; i++) {
        const colorKeys = ['pink', 'rose', 'coral', 'sky', 'lavender', 'gold', 'white'];
        const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
        
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 0.8,
          opacity: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          color: randomColor,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.15
        });
      }
    }
    
    // 初始化 Bokeh 光斑
    function initBokeh() {
      bokehCircles = [];
      const bokehCount = 15;
      
      for (let i = 0; i < bokehCount; i++) {
        const colorKeys = ['pink', 'lavender', 'sky', 'coral'];
        const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
        
        bokehCircles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 80 + 40,
          color: randomColor,
          opacity: Math.random() * 0.15 + 0.05,
          pulseSpeed: Math.random() * 0.002 + 0.001,
          pulsePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.2,
          driftY: (Math.random() - 0.5) * 0.2
        });
      }
    }
    
    // 创建流星
    function createShootingStar() {
      if (Math.random() > 0.992) {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.4;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 4 + 3;
        
        shootingStars.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: Math.random() * 100 + 50,
          opacity: 1,
          decay: 0.02,
          color: colors.white
        });
      }
    }
    
    // 绘制 Bokeh 光斑
    function drawBokeh() {
      bokehCircles.forEach(circle => {
        // 更新位置
        circle.x += circle.driftX;
        circle.y += circle.driftY;
        circle.pulsePhase += circle.pulseSpeed;
        
        // 边界检查
        if (circle.x < -circle.radius) circle.x = width + circle.radius;
        if (circle.x > width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = height + circle.radius;
        if (circle.y > height + circle.radius) circle.y = -circle.radius;
        
        // 呼吸效果
        const pulse = Math.sin(circle.pulsePhase) * 0.2 + 1;
        const currentRadius = circle.radius * pulse;
        const currentOpacity = circle.opacity * (0.7 + Math.sin(circle.pulsePhase) * 0.3);
        
        // 绘制柔和光斑
        const gradient = ctx.createRadialGradient(
          circle.x, circle.y, 0,
          circle.x, circle.y, currentRadius
        );
        
        const { r, g, b } = circle.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          circle.x - currentRadius,
          circle.y - currentRadius,
          currentRadius * 2,
          currentRadius * 2
        );
      });
    }
    
    // 绘制星星
    function drawStars() {
      stars.forEach(star => {
        // 更新闪烁
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
        const currentOpacity = star.opacity * twinkle;
        
        // 轻微漂移
        star.x += star.driftX;
        star.y += star.driftY;
        
        // 边界检查
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
        
        // 绘制星星光晕
        const { r, g, b } = star.color;
        
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 核心亮点
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // 绘制流星
    function drawShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        
        // 更新位置
        star.x += star.vx;
        star.y += star.vy;
        star.opacity -= star.decay;
        
        // 移除消失的流星
        if (star.opacity <= 0 || star.x > width + 100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }
        
        // 绘制流星尾迹
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.vx * star.length / 4,
          star.y - star.vy * star.length / 4
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 126, 179, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 126, 179, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * star.length / 4, star.y - star.vy * star.length / 4);
        ctx.stroke();
        
        // 流星头部
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 动画循环
    function animate() {
      // 清空画布
      ctx.clearRect(0, 0, width, height);
      
      // 绘制层（从后往前）
      drawBokeh();
      drawStars();
      createShootingStar();
      drawShootingStars();
      
      requestAnimationFrame(animate);
    }
    
    // 初始化
    resize();
    animate();
    
    // 监听窗口大小变化
    window.addEventListener('resize', resize);
    
    // ========== 2. 创建 BlingBling 浮动元素 ==========
    createFloatingElements();
    
    // ========== 3. 创建粒子飘落效果 ==========
    createFallingParticles();
  }
  
  // 创建浮动爱心/星星元素
  function createFloatingElements() {
    const container = document.createElement('div');
    container.id = 'bling-container';
    document.body.insertBefore(container, document.body.firstChild);
    
    const items = ['💕', '✨', '🌸', '💗', '⭐', '💫', '💖', '🌟'];
    const colors = ['#ff7eb3', '#f472b6', '#b197fc', '#74c0fc', '#ff8fa3', '#fcc419'];
    
    function spawnFloatingItem() {
      const item = document.createElement('div');
      const isEmoji = Math.random() > 0.3;
      
      if (isEmoji) {
        item.className = 'floating-item';
        item.textContent = items[Math.floor(Math.random() * items.length)];
        item.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
      } else {
        item.className = 'floating-item floating-bokeh';
        const color = colors[Math.floor(Math.random() * colors.length)];
        item.style.background = `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${color}40 50%, transparent 70%)`;
        item.style.boxShadow = `0 0 ${Math.random() * 15 + 8}px ${color}40`;
        item.style.width = `${Math.random() * 8 + 4}px`;
        item.style.height = item.style.width;
      }
      
      const duration = Math.random() * 15 + 12;
      const delay = 0;
      const startX = Math.random() * 100;
      
      item.style.left = `${startX}%`;
      item.style.animationDuration = `${duration}s`;
      item.style.animationDelay = `${delay}s`;
      item.style.opacity = Math.random() * 0.4 + 0.2;
      
      container.appendChild(item);
      
      // 动画结束后移除
      setTimeout(() => {
        if (item.parentNode) item.parentNode.removeChild(item);
      }, duration * 1000);
    }
    
    // 初始生成一批
    for (let i = 0; i < 8; i++) {
      setTimeout(spawnFloatingItem, i * 800);
    }
    
    // 持续生成
    setInterval(spawnFloatingItem, 2500);
  }
  
  // 创建飘落粒子效果
  function createFallingParticles() {
    const container = document.createElement('div');
    container.id = 'particles';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      pointer-events: none;
      overflow: hidden;
    `;
    document.body.appendChild(container);
    
    const particleCount = 40;
    const colors = ['#ff7eb3', '#f472b6', '#b197fc', '#74c0fc', '#ff8fa3', '#ffffff'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * duration;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: ${Math.random() * 0.5 + 0.2};
        box-shadow: 0 0 ${size * 3}px ${color}80;
        animation: particleFall ${duration}s linear ${delay}s infinite;
        filter: blur(${Math.random() * 1}px);
      `;
      
      container.appendChild(particle);
    }
    
    // 添加 CSS 动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFall {
        0% {
          transform: translateY(-10px) rotate(0deg) scale(0.8);
          opacity: 0;
        }
        10% {
          opacity: var(--opacity, 0.4);
        }
        90% {
          opacity: var(--opacity, 0.4);
        }
        100% {
          transform: translateY(100vh) rotate(720deg) scale(1.2);
          opacity: 0;
        }
      }
      
      @keyframes floatUp {
        0% {
          transform: translateY(110vh) rotate(0deg) scale(0.5);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 0.8;
        }
        100% {
          transform: translateY(-10vh) rotate(360deg) scale(1.2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
