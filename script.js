const GRID_SIZE = 18;
let score = 0;
const scoreBox = document.querySelector("#scoreBox");
const hiScoreBox = document.querySelector("#hiScoreBox");
const board = document.querySelector("#board");

const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const musicSound = new Audio("music/music.mp3"); 
musicSound.loop = true; 

let upArrowBtn = document.querySelector("#upArrow");
let downArrowBtn = document.querySelector("#downArrow");
let leftArrowBtn = document.querySelector("#leftArrow");
let rightArrowBtn = document.querySelector("#rightArrow");
let pauseplayBtn = document.querySelector("#pauseplay");
let togglePause = document.querySelector("#pauseplay img");


let inputDir = {x: 0, y: 0}; //this shows movement direction initially at rest
let speed = 5; //How fast the game updates(frames/sec)
let lastPaintTime = 0; //keeps track of the last time the screen refreshed

//snakeArr keeps co-ordinates of each block of snake body
let snakeArr = [  
    {x: 12, y: 14} //index:0 Head of snake
];

let food = {x: 3, y: 9}; //food co-ordinates


//Saving high score in local Storage
let highScore = localStorage.getItem("highScore");
if(highScore === null) {
    highScore = 0;
    hiScoreBox.innerText = `Hi-Score: ${highScore}`;
    localStorage.setItem("highScore", JSON.stringify(highScore)); //playing for first time
}else{
    highScore = JSON.parse(highScore);
    hiScoreBox.innerText = `Hi-Score: ${highScore}`;
}

//we need not to declare or update currentTime window.requestAnimationFrame increments it by 16ms... as most screens have refresh rate of 60Hz(frames per sec/ fps) i.e. 1 frame per 16ms...the browser syncs with screen and calls the main again and again at an interval of 16ms...this is the best option rather than setInterval

let directionChanged = false;
function main(currentTime) {  
    //request next frame immediately to make infinite loop
    window.requestAnimationFrame(main); //we need to just pass the reference as we dont want to execute instantly

    //controlling fps... i.e. by default requestAnimationFrame calls main in interval of 16 ms but if we update the frame every 16ms it would be tooo fast... so lets not update the frame till 0.2 seconds
    const secondsSinceLastRender = (currentTime - lastPaintTime) / 1000 ;
    if(secondsSinceLastRender < 1/speed ){
        return;  //STOP🛑!! it's too early. Don't move the snake yet.
    }

    //🆗!! 0.2 seconds passed! Let's refresh and move the snake
    lastPaintTime = currentTime; //Update lastPaintTime so now new cycle for 0.2s can start
    gameEngine(); //Run the game, move snake

    directionChanged = false;
}
window.requestAnimationFrame(main);


//Keyboard Controls(on keyPressing therefore used keydown)
let isPaused = true; //game is paused at start
window.addEventListener('keydown', (e) => {
    //prevent default scrolling 
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Escape"].includes(e.key)){
        e.preventDefault();
    }


    //Pause toggle on space or esc keydown
    if(e.key === " " || e.key === "Escape"){
        isPaused = !isPaused;
        if(isPaused){
            musicSound.pause();
            togglePause.src = "images/play.svg";
        }else{
            if(inputDir.x !== 0 || inputDir.y !== 0){ //dont play music on space at start
                musicSound.play();
            }
            togglePause.src = "images/pause.svg";
        }
        return; //exit immediately
    }
 
    if(directionChanged) return; //if key is pressed and direction is changed before reload of the frame don't listen to the keypress

    switch(e.key){
        case "ArrowUp":
        case "w":
        case "W":
            if(inputDir.y !== 1) { //if not moving down
                inputDir = {x: 0, y: -1}; 
                directionChanged = true;
            }
            break;

        case "ArrowDown":
        case "s":
        case "S":
            if(inputDir.y !== -1) {//if not moving up
                inputDir = {x: 0, y: 1}; 
                directionChanged = true;
            }
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            if(inputDir.x !== 1) { //if not moving right
                inputDir = {x: -1, y: 0};
                directionChanged = true;
            }
            break;

        case "ArrowRight":
        case "d":
        case "D":
            if(inputDir.x !== -1) {//if not moving left
                inputDir = {x: 1, y: 0};
                directionChanged = true;
            } 
            break;

        default:
            break;
    }

    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D"].includes(e.key) && isPaused){
        isPaused = false;
        togglePause.src = "images/pause.svg";
    }
    

    //play music when not paused
    let moving = inputDir.x !== 0 || inputDir.y !== 0; //movement in any one direction either 1 or -1
    if(!isPaused && musicSound.paused && moving){
        musicSound.play();
    }
});


//Mobile Button Controls
pauseplayBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if(isPaused){
        musicSound.pause();
        togglePause.src = "images/play.svg";
    }else{
        if(inputDir.x !== 0 || inputDir.y !== 0){
            musicSound.play();
        }
        togglePause.src = "images/pause.svg";
    }
});


upArrowBtn.addEventListener('click', () => {
    if(inputDir.y !== 1) { //if not moving down
        inputDir = {x: 0, y: -1};
        directionChanged = true;

        if(isPaused){
            isPaused = false;
            togglePause.src = "images/pause.svg";
        }

        if(musicSound.paused){
            musicSound.play();
        }
    }
});
downArrowBtn.addEventListener('click', () => {
    if(inputDir.y !== -1) { //if not moving up
        inputDir = {x: 0, y: 1};
        directionChanged = true;

        if(isPaused){
            isPaused = false;
            togglePause.src = "images/pause.svg";
        }

        if(musicSound.paused){
            musicSound.play();
        }
    }
});
leftArrowBtn.addEventListener('click', () => {
    if(inputDir.x !== 1) { //if not moving right
        inputDir = {x: -1, y: 0};
        directionChanged = true;

        if(isPaused){
            isPaused = false;
            togglePause.src = "images/pause.svg";
        }

        if(musicSound.paused){
            musicSound.play();
        }
    }
});
rightArrowBtn.addEventListener('click', () => {
    if(inputDir.x !== -1) { //if not moving left
        inputDir = {x: 1, y: 0};
        directionChanged = true;

        if(isPaused){
            isPaused = false;
            togglePause.src = "images/pause.svg";
        }

        if(musicSound.paused){
            musicSound.play();
        }
    }
});


//Writing collision cases when Game Over
function isCollide() {
    //case 1: bump into yourself
    for(let i = 1; i < snakeArr.length; i++){
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y){
            return true;
        }
    }

    
    //case 2: bump into wall //we need to check collision condition first before moving snake
    if((snakeArr[0].x === GRID_SIZE && inputDir.x === 1) || (snakeArr[0].x === 1 && inputDir.x === -1) || (snakeArr[0].y === GRID_SIZE && inputDir.y === 1) || (snakeArr[0].y === 1 && inputDir.y === -1)){
        return true;
    }
    return false;
}

function display(){
    board.innerHTML = "";

    //Display the Snake
    snakeArr.forEach( (block, idx) => {
        const snakeElementBlock = document.createElement("div");
        snakeElementBlock.style.gridRowStart = block.y;
        snakeElementBlock.style.gridColumnStart = block.x;

        if(idx === 0){
            snakeElementBlock.classList.add('head');
        }else{
            snakeElementBlock.classList.add('snakeBody');
        }
        board.appendChild(snakeElementBlock);
    });


    //Display Food
    const foodElementBlock = document.createElement('div');
    foodElementBlock.style.gridRowStart = food.y;
    foodElementBlock.style.gridColumnStart = food.x;
    foodElementBlock.classList.add("food");
    board.appendChild(foodElementBlock);
}
display();

function gameEngine(){
       
    if(isPaused) return;
    
    //Game over on collision
    if(isCollide()){
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over🚩!! Press any Arrow key to play again!");
        
        //Reset game
        snakeArr = [{x: 12, y: 14}];
        inputDir = {x: 0, y: 0};
        food = {x: 3, y:9};
        musicSound.currentTime = 0; //rewind music
        score = 0; 
        speed = 5; 
        scoreBox.innerText = `Score: ${score}`;
        togglePause.src = "images/play.svg";
        isPaused = true;    
        display();   
        return;
    };

    //Check if food is eaten
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();
        score++;
        scoreBox.innerText = `Score: ${score}`;
        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            hiScoreBox.innerText = `Hi-Score: ${highScore}`;
        }


        //increase the speed 
        if(score > 0 && score % 5 === 0){
            speed += 1;
        }

        let newBlock = {
            x: snakeArr[0].x ,
            y: snakeArr[0].y
        }

        snakeArr.unshift(newBlock); //adding new block in front

        //generate food 
        let newFood;
        let onSnake;
        do{
            onSnake = false;
            newFood = {
                x: Math.floor((Math.random()*GRID_SIZE)+1),
                y: Math.floor((Math.random()*GRID_SIZE)+1),
            };
            for(const block of snakeArr){
                if(block.x === newFood.x && block.y === newFood.y){
                    onSnake = true;
                    break;
                }
            }
        }while(onSnake);
        food = newFood;
    };


    //Moving the snake's body
    for(let i = snakeArr.length - 2; i >= 0; i--){
        snakeArr[i+1] = {...snakeArr[i]}; //this just changes the coordinates of i+1 th block ith block coordinates does not change... {...obj} creates new obj. changes in this obj does not reflect in original
    };
    //moving snake's head
    snakeArr[0] = {x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y};

    display();
};