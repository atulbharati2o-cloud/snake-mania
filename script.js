let score = 0;
const scoreBox = document.querySelector("#scoreBox");
const hiScoreBox = document.querySelector("#hiScoreBox");
const board = document.querySelector("#board");

const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3"); 

let inputDir = {x: 0, y: 0}; //this tracks the coordinates of snake
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
    localStorage.setItem("highScore", 0); //playing for first time
}else{
    hiScoreBox.innerText = `Hi-Score: ${highScore}`;
}

//we need not to declare or update currentTime window.requestAnimationFrame increments it by 16ms... as most screens have refresh rate of 60Hz(frames per sec/ fps) i.e. 1 frame per 16ms...the browser syncs with screen and calls the main again and again at an interval of 16ms...this is the best option rather than setInterval
function main(currentTime) {  
    //request next frame immediately to make infinite loop
    window.requestAnimationFrame(main); //we need to just pass the reference as we dont want to execute instantly

    //controlling fps... i.e. by default requestAnimationFrame calls main in interval of 16 ms but if we update the frame every 16ms it would be tooo fast... so lets not update the frame till 0.2 seconds
    const secondsSinceLastRender = (currentTime - lastPaintTime) / 1000 ;
    if(secondsSinceLastRender < 0.2 ){
        return;  //STOP🛑!! it's too early. Don't move the snake yet.
    }

    //🆗!! 0.2 seconds passed! Let's refresh and move the snake
    lastPaintTime = currentTime; //Update lastPaintTime so now new cycle for 0.2s can start
    gameEngine(); //Run the game, move snake
}
window.requestAnimationFrame(main);


//Keyboard Controls(on keyPressing therefore used keydown)
window.addEventListener('keydown', (e) => {
    musicSound.play(); //play music

    switch(e.key){
        case "ArrowUp":
            inputDir = {x: 0, y: -1};
            break;
        case "ArrowDown":
            inputDir = {x: 0, y: 1};
            break;
        case "ArrowLeft":
            inputDir = {x: -1, y: 0};
            break;
        case "ArrowRight":
            inputDir = {x: 1, y: 0};
            break;
        case "e":
        case "E":
            inputDir = {x: 0, y: -1};
            break;
        case "d":
        case "D":
            inputDir = {x: 0, y: 1};
            break;
        case "s":
        case "S":
            inputDir = {x: -1, y: 0};
            break;
        case "f":
        case "F":
            inputDir = {x: 1, y: 0};
            break;
        default:
            break;
    }
});



//Writing collision cases when Game Over
function isCollide(snake) {
    //case 1: bump into yourself
    for(let i = 1; i < snakeArr.length; i++){
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y){
            return true;
        }
    }

    //case 2: bump into wall
    if(snakeArr[0].x >= 19 || snakeArr[0].x <= 0 || snakeArr[0].y >= 19 || snakeArr[0].y <= 0){
        return true;
    }
    
    return false;
}

function gameEngine(){
    
    //Game over
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};
        alert("Game Over🚩!! Press any Arrow key to play again!");
        snakeArr = [{
            x: 12,
            y: 14
        }];
        score = 0;
        scoreBox.innerText = `Score: ${score}`;
        if(score > localStorage.getItem("highScore")){
            localStorage.setItem("highScore", score);
            hiScoreBox.innerText = `Hi-Score: ${score}`;
        }
    };


    //Check if food is eaten
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();
        score++;
        scoreBox.innerText = `Score: ${score}`;
        if(score > highScore){
            localStorage.setItem("highScore", score);
            hiScoreBox.innerText = `Hi-Score: ${score}`;
        }


        //increase the speed 
        if(score % 5 == 0){
            speed += 2;
        }

        let newBlock = {
            x: snakeArr[0].x ,
            y: snakeArr[0].y
        }

        snakeArr.unshift(newBlock); //adding new block in front

        //generate food 
        food = {
            x: Math.floor((Math.random()*18)+1),
            y: Math.floor((Math.random()*18)+1),
        }

    };


    //Moving the snake's body
    for(let i = snakeArr.length - 2; i >= 0; i--){
        snakeArr[i+1] = {...snakeArr[i]}; //this just changes the coordinates of i+1 th block ith block coordinates does not change... {...obj} creates new obj. changes in this obj does not reflect in original
    };
    //moving snake's head
    snakeArr[0] = {x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y};


    //Display the Snake
    board.innerHTML = "";
    snakeArr.forEach( (block, idx) => {
        const snakeElementBlock = document.createElement("div");
        snakeElementBlock.style.gridRowStart = block.y;
        snakeElementBlock.style.gridColumnStart = block.x;

        if(idx == 0){
            snakeElementBlock.classList.add('head');
        }else{
            snakeElementBlock.classList.add('snakeBody');
        }
        board.appendChild(snakeElementBlock);
    });


    //Display Food
    foodElementBlock = document.createElement('div');
    foodElementBlock.style.gridRowStart = food.y;
    foodElementBlock.style.gridColumnStart = food.x;
    foodElementBlock.classList.add("food");
    board.appendChild(foodElementBlock);
};