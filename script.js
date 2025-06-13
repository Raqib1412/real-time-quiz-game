const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomCreation = document.getElementById('roomCreation');
const roomJoin = document.getElementById('roomJoin');

const generateRoomBtn = document.getElementById('generateRoomBtn');
const joinRoomNowBtn = document.getElementById('joinRoomNowBtn');

let roomCode = '';

singlePlayerBtn.addEventListener('click', () => {
    window.location.href = `game.html?mode=single&player=Guest`;
});

createRoomBtn.addEventListener('click', () => {
    roomCreation.style.display = 'block';
    roomJoin.style.display = 'none';
});

joinRoomBtn.addEventListener('click', () => {
    roomJoin.style.display = 'block';
    roomCreation.style.display = 'none';
});

generateRoomBtn.addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (playerName === '') {
        alert('Please enter your name!');
        return;
    }

    roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    alert(`Your Room Code: ${roomCode}`);

    window.location.href = `game.html?mode=multi&player=${playerName}&room=${roomCode}&host=true`;
});

joinRoomNowBtn.addEventListener('click', () => {
    const playerName = document.getElementById('playerNameJoin').value.trim();
    const enteredRoomCode = document.getElementById('roomCodeInput').value.trim();

    if (playerName === '' || enteredRoomCode === '') {
        alert('Please enter your name and room code!');
        return;
    }

    window.location.href = `game.html?mode=multi&player=${playerName}&room=${enteredRoomCode}&host=false`;
});
