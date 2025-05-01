let furCount = 0;
let selectedDog = null;
let furGrowthInterval;
let growthSpeed = 1000; // 초기 생성 속도 (1초)
let gameStartTime;
let isDragging = false;
let lastTouchX = 0;
let lastTouchY = 0;
let isGameOver = false;

function selectDog(dogNumber) {
    selectedDog = dogNumber;
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('game-dog').src = `dog${dogNumber}.jpg`;
    
    startGame();
}

function startGame() {
    furCount = 0;
    growthSpeed = 1000;
    gameStartTime = Date.now();
    updateScore();
    
    createFurInterval();
    setInterval(increaseSpeed, 1000);
    
    const gameArea = document.getElementById('game-area');
    
    // 데스크톱 이벤트
    if (!('ontouchstart' in window)) {
        gameArea.addEventListener('mousemove', handleGrooming);
    } else {
        // 모바일 터치 이벤트
        gameArea.addEventListener('touchstart', handleTouchStart, { passive: false });
        gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
        gameArea.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
}

// 마지막 터치/마우스 이벤트 시간을 저장
let lastEventTime = 0;
const EVENT_THROTTLE = 16; // 약 60fps

function handleTouchStart(event) {
    event.preventDefault();
    isDragging = true;
    
    const touch = event.touches[0];
    const furContainer = document.getElementById('fur-container');
    const rect = furContainer.getBoundingClientRect();
    
    lastTouchX = touch.clientX - rect.left;
    lastTouchY = touch.clientY - rect.top;
    
    // 터치 시작 지점의 털 제거
    const touchRadius = Math.min(rect.width, rect.height) * 0.1;
    removeFursAtPosition(lastTouchX, lastTouchY, touchRadius);
}

function handleTouchMove(event) {
    if (!isDragging) return;
    event.preventDefault();
    
    // 이벤트 쓰로틀링
    const now = Date.now();
    if (now - lastEventTime < EVENT_THROTTLE) {
        return;
    }
    lastEventTime = now;
    
    const touch = event.touches[0];
    const furContainer = document.getElementById('fur-container');
    const rect = furContainer.getBoundingClientRect();
    
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    // 이전 위치와 현재 위치 사이의 중간 지점들에도 털 제거 적용
    const steps = 5; // 부드러운 드래그를 위한 중간 단계 수
    const touchRadius = Math.min(rect.width, rect.height) * 0.1;
    
    for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const x = lastTouchX + (currentX - lastTouchX) * ratio;
        const y = lastTouchY + (currentY - lastTouchY) * ratio;
        removeFursAtPosition(x, y, touchRadius);
    }
    
    lastTouchX = currentX;
    lastTouchY = currentY;
}

function handleTouchEnd(event) {
    isDragging = false;
}

function handleGrooming(event) {
    // 이벤트 쓰로틀링
    const now = Date.now();
    if (now - lastEventTime < EVENT_THROTTLE) {
        return;
    }
    lastEventTime = now;
    
    const furContainer = document.getElementById('fur-container');
    const rect = furContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // 데스크톱은 더 작은 반경 사용
    const radius = Math.min(rect.width, rect.height) * 0.05;
    removeFursAtPosition(mouseX, mouseY, radius);
}

function removeFursAtPosition(x, y, radius) {
    const furElements = document.getElementsByClassName('fur');
    
    Array.from(furElements).forEach(fur => {
        const furX = parseInt(fur.style.left);
        const furY = parseInt(fur.style.top);
        
        const distance = Math.sqrt(
            Math.pow(x - furX, 2) + 
            Math.pow(y - furY, 2)
        );
        
        if (distance < radius) {
            fur.remove();
            furCount++;
            updateScore();
        }
    });
}

function createFurInterval() {
    if (furGrowthInterval) {
        clearInterval(furGrowthInterval);
    }
    furGrowthInterval = setInterval(growFur, growthSpeed);
}

function increaseSpeed() {
    // 최소 100ms까지 속도 증가
    if (growthSpeed > 100) {
        growthSpeed = Math.max(100, growthSpeed - 100);
        createFurInterval();
    }
}

function growFur() {
    if (isGameOver) return;
    
    const furContainer = document.getElementById('fur-container');
    const containerRect = furContainer.getBoundingClientRect();
    const fur = document.createElement('div');
    fur.className = 'fur';
    
    // 랜덤 위치에 털 생성
    const x = Math.random() * (containerRect.width - 10);
    const y = Math.random() * (containerRect.height - 20);
    
    fur.style.left = `${x}px`;
    fur.style.top = `${y}px`;
    fur.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    furContainer.appendChild(fur);
    
    // 털이 50개 이상이면 게임 오버
    if (furContainer.children.length >= 50) {
        showGameOver();
    }
}

function updateScore() {
    document.getElementById('fur-count').textContent = furCount;
}

function showGameOver() {
    isGameOver = true;
    clearInterval(furGrowthInterval);
    
    document.getElementById('final-score').textContent = furCount;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('game-over-popup').style.display = 'block';
}

function restartGame() {
    isGameOver = false;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('game-over-popup').style.display = 'none';
    
    // 게임 화면 숨기기
    document.getElementById('game-screen').style.display = 'none';
    // 선택 화면 보이기
    document.getElementById('selection-screen').style.display = 'flex';
    
    // 기존 털 제거
    const furContainer = document.getElementById('fur-container');
    while (furContainer.firstChild) {
        furContainer.removeChild(furContainer.firstChild);
    }
}