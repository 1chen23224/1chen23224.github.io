window.onload = function() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    const finaleBtn = document.getElementById('finale-btn');

    // 音效元素
    const sounds = {
        launch: [document.getElementById('launch-sound')],
        explosion: [
            document.getElementById('explosion-sound-1'),
            document.getElementById('explosion-sound-2'),
            document.getElementById('explosion-sound-3'),
        ]
    };

    let fireworks = [];
    let particles = [];
    let autoLaunchInterval;

    // 設定畫布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 播放音效的輔助函式
    function playSound(soundArray) {
        const sound = soundArray[Math.floor(Math.random() * soundArray.length)];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.error("音效播放失敗:", e));
        }
    }

    // 粒子類別 (帶有軌跡)
    class Particle {
        constructor(x, y, hue, fireworkType) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            this.type = fireworkType;
            this.coords = [[x, y]];
            this.coordCount = 5; // 軌跡長度
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 8 + 2;
            this.friction = 0.96;
            this.gravity = this.type === 'willow' ? 0.08 : 0.05; // 垂柳效果的重力更強
            this.alpha = 1;
            this.decay = Math.random() * 0.03 + 0.015;
            this.lineWidth = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.coords.pop();
            this.coords.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
            return this.alpha <= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coords[this.coords.length - 1][0], this.coords[this.coords.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.type === 'willow' ? 70 : 50}%, ${this.alpha})`;
            ctx.stroke();
        }
    }

    // 煙花 (火箭) 類別
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetX = this.x;
            this.targetY = Math.random() * (canvas.height / 2);
            this.hue = Math.random() * 360;
            this.type = Math.random() > 0.4 ? 'peony' : 'willow'; // 隨機選擇煙花類型
            this.coords = [[this.x, this.y]];
            this.coordCount = 3;
            playSound(sounds.launch);
        }

        update() {
            this.coords.pop();
            this.coords.unshift([this.x, this.y]);
            const speed = 5;
            const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            this.y += Math.sin(angle) * speed;
            this.x += Math.cos(angle) * speed;
            
            if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < speed) {
                const particleCount = this.type === 'willow' ? 100 : 150;
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle(this.x, this.y, this.hue, this.type));
                }
                playSound(sounds.explosion);
                return true;
            }
            return false;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coords[this.coords.length - 1][0], this.coords[this.coords.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.stroke();
        }
    }
    
    // 主動畫循環
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'; // 降低這個值可以讓軌跡更長
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((fw, i) => fw.update() ? fireworks.splice(i, 1) : fw.draw());
        particles.forEach((p, i) => p.update() ? particles.splice(i, 1) : p.draw());

        requestAnimationFrame(animate);
    }

    // 啟動常規的煙花發射
    function startRegularShow() {
        autoLaunchInterval = setInterval(() => {
            fireworks.push(new Firework());
        }, 1200 + Math.random() * 800); // 更隨機的間隔
    }

    // 啟動壓軸大匯演
    function startFinale() {
        finaleBtn.disabled = true;
        finaleBtn.textContent = '匯演進行中...';
        clearInterval(autoLaunchInterval); // 停止常規發射

        const finaleInterval = setInterval(() => {
            fireworks.push(new Firework());
        }, 150); // 密度極高的發射

        setTimeout(() => {
            clearInterval(finaleInterval);
            finaleBtn.disabled = false;
            finaleBtn.textContent = '🚀 再次啟動壓軸大匯演';
            startRegularShow(); // 匯演結束後恢復常規模式
        }, 30000); // 壓軸匯演持續30秒
    }

    finaleBtn.addEventListener('click', startFinale);
    
    animate();
    startRegularShow();
};
