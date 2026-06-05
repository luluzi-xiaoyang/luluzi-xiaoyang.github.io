// ============================================================
// 娴极鏄熺┖鑳屾櫙鍔ㄧ敾
// 鍔ㄦ€佹槦绌?+ 椋樿惤鏄熷厜绮掑瓙 + 娴佸姩鏄熶簯
// ============================================================

(function() {
  'use strict';
  
  // 绛夊緟 DOM 鍔犺浇
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarfield);
  } else {
    initStarfield();
  }
  
  function initStarfield() {
    // 鍒涘缓鏄熺┖鐢诲竷
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
    let nebulaClouds = [];
    
    // 閰嶈壊鏂规 - 绮夎摑绱氮婕壊绯?    const colors = {
      pink: { r: 244, g: 164, b: 192 },
      rose: { r: 232, g: 180, b: 203 },
      purple: { r: 201, g: 177, b: 212 },
      blue: { r: 168, g: 197, b: 226 },
      lavender: { r: 212, g: 196, b: 224 },
      white: { r: 255, g: 255, b: 255 }
    };
    
    // 璋冩暣鐢诲竷澶у皬
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
      initNebula();
    }
    
    // 鍒濆鍖栨槦鏄?    function initStars() {
      stars = [];
      const starCount = Math.floor((width * height) / 3000); // 鏍规嵁灞忓箷澶у皬璋冩暣鏄熸槦鏁伴噺
      
      for (let i = 0; i < starCount; i++) {
        const colorKeys = Object.keys(colors);
        const randomColor = colors[colorKeys[Math.floor(Math.random() * (colorKeys.length - 1))]];
        
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          color: randomColor,
          driftX: (Math.random() - 0.5) * 0.2,
          driftY: (Math.random() - 0.5) * 0.2
        });
      }
    }
    
    // 鍒濆鍖栨槦浜?    function initNebula() {
      nebulaClouds = [];
      const cloudCount = 5;
      
      for (let i = 0; i < cloudCount; i++) {
        const colorKeys = ['pink', 'purple', 'blue', 'lavender'];
        const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
        
        nebulaClouds.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 300 + 200,
          color: randomColor,
          opacity: Math.random() * 0.08 + 0.02,
          driftX: (Math.random() - 0.5) * 0.3,
          driftY: (Math.random() - 0.5) * 0.3,
          pulseSpeed: Math.random() * 0.001 + 0.0005,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    }
    
    // 鍒涘缓娴佹槦
    function createShootingStar() {
      if (Math.random() > 0.995) { // 浣庢鐜囩敓鎴?        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.3;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 3 + 2;
        
        shootingStars.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: Math.random() * 80 + 40,
          opacity: 1,
          decay: 0.015,
          color: colors.white
        });
      }
    }
    
    // 缁樺埗鏄熶簯
    function drawNebula() {
      nebulaClouds.forEach(cloud => {
        // 鏇存柊浣嶇疆
        cloud.x += cloud.driftX;
        cloud.y += cloud.driftY;
        cloud.pulsePhase += cloud.pulseSpeed;
        
        // 杈圭晫妫€鏌?        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;
        
        // 鑴夊姩鏁堟灉
        const pulse = Math.sin(cloud.pulsePhase) * 0.3 + 1;
        const currentRadius = cloud.radius * pulse;
        const currentOpacity = cloud.opacity * (0.8 + Math.sin(cloud.pulsePhase) * 0.2);
        
        // 缁樺埗娓愬彉鏄熶簯
        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, currentRadius
        );
        
        const { r, g, b } = cloud.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          cloud.x - currentRadius,
          cloud.y - currentRadius,
          currentRadius * 2,
          currentRadius * 2
        );
      });
    }
    
    // 缁樺埗鏄熸槦
    function drawStars() {
      stars.forEach(star => {
        // 鏇存柊闂儊
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;
        
        // 杞诲井婕傜Щ
        star.x += star.driftX;
        star.y += star.driftY;
        
        // 杈圭晫妫€鏌?        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
        
        // 缁樺埗鏄熸槦
        const { r, g, b } = star.color;
        
        // 鍏夋檿
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 鏍稿績
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // 缁樺埗娴佹槦
    function drawShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        
        // 鏇存柊浣嶇疆
        star.x += star.vx;
        star.y += star.vy;
        star.opacity -= star.decay;
        
        // 绉婚櫎娑堝け鐨勬祦鏄?        if (star.opacity <= 0 || star.x > width + 100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }
        
        // 缁樺埗娴佹槦灏捐抗
        const { r, g, b } = star.color;
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.vx * star.length / 3,
          star.y - star.vy * star.length / 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * star.length / 3, star.y - star.vy * star.length / 3);
        ctx.stroke();
        
        // 娴佹槦澶撮儴
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 鍒涘缓椋樿惤绮掑瓙
    function createParticles() {
      const container = document.createElement('div');
      container.id = 'particles';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        overflow: hidden;
      `;
      document.body.insertBefore(container, canvas.nextSibling);
      
      const particleCount = 30;
      const particleColors = ['#f4a4c0', '#e8b4cb', '#c9b1d4', '#a8c5e2', '#ffffff'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * duration;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: -10px;
          opacity: ${Math.random
() * 0.6 + 0.2};
          box-shadow: 0 0 ${size * 2}px ${color};
          animation: particleFall ${duration}s linear ${delay}s infinite;
        `;
        
        container.appendChild(particle);
      }
      
      // 娣诲姞 CSS 鍔ㄧ敾
      const style = document.createElement('style');
      style.textContent = `
        @keyframes particleFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity, 0.5);
          }
          90% {
            opacity: var(--opacity, 0.5);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // 鍔ㄧ敾寰幆
    function animate() {
      // 娓呯┖鐢诲竷
      ctx.clearRect(0, 0, width, height);
      
      // 缁樺埗灞傦紙浠庡悗寰€鍓嶏級
      drawNebula();
      drawStars();
      createShootingStar();
      drawShootingStars();
      
      requestAnimationFrame(animate);
    }
    
    // 鍒濆鍖?    resize();
    createParticles();
    animate();
    
    // 鐩戝惉绐楀彛澶у皬鍙樺寲
    window.addEventListener('resize', resize);
    
    // 榧犳爣浜や簰 - 鏄熸槦杞诲井璺熼殢
    let mouseX = width / 2;
    let mouseY = height / 2;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }
})();
