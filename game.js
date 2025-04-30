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
    
    // 털 생성 간격 설정
    createFurInterval();
    
    // 속도 증가 타이머 설정 (1초마다 속도 증가)
    setInterval(increaseSpeed, 1000);
    
    // 마우스 이벤트 리스너 추가
    const gameArea = document.getElementById('game-area');
    gameArea.addEventListener('mousemove', handleGrooming);
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

function handleGrooming(event) {
    const furElements = document.getElementsByClassName('fur');
    const furContainer = document.getElementById('fur-container');
    const rect = furContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    Array.from(furElements).forEach(fur => {
        const furX = parseInt(fur.style.left);
        const furY = parseInt(fur.style.top);
        
        const distance = Math.sqrt(
            Math.pow(mouseX - furX, 2) + 
            Math.pow(mouseY - furY, 2)
        );
        
        if (distance < 20) {
            fur.remove();
            furCount++;
            updateScore();
        }
    });
}

function updateScore() {
    document.getElementById('fur-count').textContent = furCount;
}