// 等待網頁載入完成
window.onload = function() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');

    // 設定畫布大小為全螢幕
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = []; // 儲存煙花（火箭）
    let particles = []; // 儲存爆炸後的粒子

    // 當視窗大小改變時，重設畫布大小
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 煙花（火箭）的類別
    class Firework {
        constructor() {
            // 從底部中央發射
            this.x = canvas.width / 2;
            this.y = canvas.height;
            // 隨機的目標位置
            this.targetX = Math.random() * canvas.width;
            this.targetY = Math.random() * (canvas.height / 2);
            // 隨機顏色
            this.hue = Math.random() * 360;
            this.alpha = 1;
            this.speed = 3;
            this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.01; // 軌跡慢慢消失

            // 如果到達目標或軌跡消失，就爆炸
            if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 3 || this.alpha <= 0) {
                // 創建爆炸粒子
                for (let i = 0; i < 50; i++) {
                    particles.push(new Particle(this.x, this.y, this.hue));
                }
                // 從陣列中移除這個煙花
                return true; 
            }
            return false;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    // 爆炸後的粒子類別
    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue + (Math.random() * 60 - 30); // 顏色帶有一點變化
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 3 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.friction = 0.97; // 摩擦力，讓粒子變慢
            this.gravity = 0.05; // 重力
            this.alpha = 1;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.02; // 粒子慢慢消失

            return this.alpha <= 0;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    // 主動畫循環
    function animate() {
        // 使用一個半透明的黑色背景來製造拖尾效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 更新並繪製所有煙花
        fireworks.forEach((firework, index) => {
            if (firework.update()) {
                fireworks.splice(index, 1);
            } else {
                firework.draw();
            }
        });

        // 更新並繪製所有粒子
        particles.forEach((particle, index) => {
            if (particle.update()) {
                particles.splice(index, 1);
            } else {
                particle.draw();
            }
        });

        requestAnimationFrame(animate); // 請求下一幀動畫
    }

    // 每隔一段時間自動發射一個煙花
    setInterval(() => {
        fireworks.push(new Firework());
    }, 1000);

    // 啟動動畫
    animate();
};