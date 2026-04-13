document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Game Dashboard
    const gameStats = document.createElement('div');
    gameStats.id = 'game-stats';
    gameStats.innerHTML = `
        <div class="stat-box">
            <span class="stat-label">Time Left</span>
            <span id="game-timer" class="stat-value">60s</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">My Pops</span>
            <span id="game-score" class="stat-value">0</span>
        </div>
        <button id="start-game" class="btn-game">START CHALLENGE</button>
    `;

    // Game State
    let score = 0;
    let timeLeft = 60;
    let gameActive = false;
    let timerInterval = null;

    // Display game stats ONLY if bubbles are present in hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.appendChild(gameStats); // Move dashboard INTO hero
        gameStats.style.display = 'flex';
        for (let i = 0; i < 15; i++) {
            createBubble(heroSection);
        }
    }

    const scoreDisplay = document.getElementById('game-score');
    const timerDisplay = document.getElementById('game-timer');
    const startBtn = document.getElementById('start-game');

    // 2. Play Game Logic
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't pop a bubble if clicking button
            if (gameActive) return;
            startGame();
        });
    }

    function startGame() {
        score = 0;
        timeLeft = 60;
        gameActive = true;
        scoreDisplay.textContent = '0';
        timerDisplay.textContent = '60s';
        startBtn.textContent = 'GAME ON!';
        startBtn.style.opacity = '0.5';

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        startBtn.textContent = 'RESTART';
        startBtn.style.opacity = '1';
        alert(`Time's Up! You popped ${score} bubbles! ✨`);
    }

    // Modify createBubble to support scoring
    function createBubble(container) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.cursor = 'pointer';

        bubble.addEventListener('click', (e) => {
            if (bubble.classList.contains('pop')) return;
            
            bubble.classList.add('pop');
            
            if (gameActive) {
                score++;
                if (scoreDisplay) scoreDisplay.textContent = score;
                // Visual feedback for score
                if (scoreDisplay) {
                    scoreDisplay.style.transform = 'scale(1.3)';
                    setTimeout(() => scoreDisplay.style.transform = 'scale(1)', 200);
                }
            }

            setTimeout(() => {
                bubble.remove();
                createBubble(container);
            }, 300);
        });

        container.appendChild(bubble);

        bubble.addEventListener('animationend', () => {
            bubble.remove();
            createBubble(container);
        });
    }

    // Scroll Animation Observer (Fade Up)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    // Reading Progress Bar
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }
});

