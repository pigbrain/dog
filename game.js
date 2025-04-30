let furCount = 0;
let selectedDog = null;
let furGrowthInterval;
let growthSpeed = 1000; // 초기 생성 속도 (1초)
let gameStartTime;

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
    }
    
    // 터치 이벤트
    gameArea.addEventListener('touchmove', handleTouchGrooming, { passive: false });
    gameArea.addEventListener('touchstart', handleTouchGrooming, { passive: false });
}

// 마지막 터치/마우스 이벤트 시간을 저장
let lastEventTime = 0;
const EVENT_THROTTLE = 16; // 약 60fps

function handleTouchGrooming(event) {
    event.preventDefault();
    
    // 이벤트 쓰로틀링
    const now = Date.now();
    if (now - lastEventTime < EVENT_THROTTLE) {
        return;
    }
    lastEventTime = now;
    
    const furContainer = document.getElementById('fur-container');
    const rect = furContainer.getBoundingClientRect();
    
    // 모든 터치 포인트에 대해 처리
    for (let touch of event.touches) {
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // 화면 크기에 맞게 터치 영역 조정
        const touchRadius = Math.min(rect.width, rect.height) * 0.1;
        removeFursAtPosition(touchX, touchY, touchRadius);
    }
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
    const furContainer = document.getElementById('fur-container');
    const containerRect = furContainer.getBoundingClientRect();
    const fur = document.createElement('div');
    fur.className = 'fur';
    
    // 랜덤 위치에 털 생성 (컨테이너 크기 기준)
    const x = Math.random() * (containerRect.width - 10);  // 털의 너비를 고려
    const y = Math.random() * (containerRect.height - 20); // 털의 높이를 고려
    
    fur.style.left = `${x}px`;
    fur.style.top = `${y}px`;
    fur.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    furContainer.appendChild(fur);
}

function updateScore() {
    document.getElementById('fur-count').textContent = furCount;
}