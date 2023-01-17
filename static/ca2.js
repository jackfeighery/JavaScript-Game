// Creating variables
let canvas;
let context;
let request_id;
let background = [
    [55 ,32 ,33 ,32,33,32,33 ,32 ,33,32,33,32 ,33 ,32,33,32,33,32,33,32,54 ,-1,-1,-1,-1],
    [47 ,36 ,37 ,38,39,37,39 ,38 ,39,37,38,37 ,38 ,37,38,37,38,38,37,38,51 ,-1,-1,-1,-1],
    [47 ,36 ,37 ,38,39,37,39 ,38 ,39,37,38,37 ,38 ,37,38,37,38,38,37,38,51 ,-1,-1,-1,-1],
    [47 ,8  ,7  ,6 ,7 ,5 ,7  ,5  ,6 ,7 ,5 ,6  ,5  ,6 ,5 ,6 ,7 ,4 ,7 ,8 ,51 ,-1,-1,-1,-1],
    [47 ,5  ,5  ,5 ,7 ,5 ,7  ,5  ,6 ,5 ,5 ,7  ,6  ,5 ,6 ,5 ,6 ,5 ,6 ,6 ,51 ,-1,-1,-1,-1],
    [47 ,5  ,5  ,7 ,6 ,5 ,7  ,7  ,7 ,6 ,5 ,7  ,5  ,6 ,5 ,7 ,6 ,7 ,5 ,7 ,51 ,-1,-1,-1,-1],
    [47 ,7  ,7  ,7 ,5 ,6 ,7  ,7  ,7 ,6 ,5 ,6  ,7  ,7 ,7 ,6 ,7 ,6 ,5 ,6 ,51 ,-1,-1,-1,-1],
    [47 ,7  ,7  ,6 ,7 ,7 ,6  ,5  ,6 ,7 ,7 ,7  ,7  ,7 ,5 ,7 ,5 ,6 ,7 ,7 ,51 ,-1,-1,-1,-1],
    [108,34 ,111,17,17,17,110,34 ,34,34,34,34 ,111,6 ,5 ,7 ,5 ,5 ,6 ,8 ,51 ,-1,-1,-1,-1],
    [-1 ,55 ,46 ,17,17,17,50 ,32 ,32,33,32,54 ,47 ,8 ,6 ,5 ,7 ,6 ,5 ,8 ,51 ,-1,-1,-1,-1],
    [-1 ,47 ,36 ,5 ,5 ,5 ,36 ,37 ,37,37,37,51 ,47 ,8 ,7 ,6 ,5 ,5 ,5 ,6 ,51 ,-1,-1,-1,-1],
    [-1 ,47 ,36 ,5 ,5 ,5 ,36 ,37 ,37,37,37,51 ,108,34,34,34,34,34,34,34,109,-1,-1,-1,-1],
    [-1 ,47 ,7  ,5 ,5 ,5 ,7  ,5  ,5 , 5, 5,51 ,-1 ,-1,-1,-1,-1,-1,-1,-1,-1 ,-1,-1,-1,-1],
    [-1 ,47 ,6  ,5 ,5 ,7 ,5  ,5  ,5 , 5, 5,51 ,-1 ,-1,-1,-1,-1,-1,-1,-1,-1 ,-1,-1,-1,-1],
    [-1 ,108,34 ,34,34,34,34 ,34 ,34,34,34,109,-1 ,-1,-1,-1,-1,-1,-1,-1,-1 ,-1,-1,-1,-1]
];
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let score = 0;

let IMAGES = {player: "static/char.png", background: "static/dungeon.png", 
            enemy:"static/enemy.png"
                 };

let round = 1;
// let backImage = new Image();
// let playerImage = new Image();
// let enemyImage = new Image();
let BGaudio = new Audio();
let CoinEffect = new Audio();
let DeathEffect = new Audio();
let player = {
    x : 0,
    y : 0,
    width : 32,
    height : 32,
    frameX : 0,
    frameY : 0,
    size: 32,
    xChange : 4,
    yChange : 4
}

let tilesPerRow = 4;
let tileSize = 32;

let currentTile = background[~~(player.x/tileSize)][~~(player.y/tileSize)];
let tileLeft;
let tileRight;
let tileUp;
let tileBelow;

// let eTileLeft;    
// let eTileRight;
// let eTileBelow;
// let eTileUp;

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

let xhttp;

let xCord;
let yCord;

let enemy = {
    x : randint(4, 16),
    y : randint(3,7),
    width : 32,
    height : 32,
    frameX : 0,
    size: 32,
    frameY : 0,
    xChange : 0.4,
    yChange : 0.4
};
let coins = [];
let enemies = [];
let NoEnemies = 2;
let NOCoins = 5;
let CoinIncrease = 0;
let EnemyIncrease = 0;
let scoreIncrease = 10;
let InvincibleSpeed = false;
//

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    // playerImage.src = "/static/images/char.png";
    // backImage.src = "/static/images/dungeon.png";
    // enemyImage.src = "/static/images/enemy.png";
    BGaudio.src = "static/bg.mp3";
    CoinEffect.src = "static/coinsound.wav";
    DeathEffect.src = "static/death.mp3";

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px"; 
    player.x = 130;
    player.y = 400;
    currentTile = background[~~(player.y/tileSize)][~~(player.x/tileSize)];

    for(let i=0;i<NOCoins;i+=1) {
        let coin = {
            x : randint(4, 16),
            y : randint(3,7)
        };
        coins.push(coin)
    } 
    for(let i=0;i<NoEnemies;i+=1) {
        let enemy = {
            x : randint(2, 16),
            y : randint(3,7),
            width : 32,
            height : 32,
            frameX : 0,
            frameY : 0,
            xChange : 0.4,
            yChange : 0.4
        };
        enemies.push(enemy);
    } 
    
    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    resizeCanvas();
    load_images(draw);
}

function next_round() {
    player.x = 130;
    player.y = 400;
    let NoCoins = 5
    for(let i=0;i< NoCoins + CoinIncrease;i+=1) {
        let coin = {
            x : randint(4, 16),
            y : randint(3,7)
        };
        coins.push(coin)
    } 
    for(let i=0;i<EnemyIncrease;i+=1) {
        let enemy = {
            x : randint(2, 16),
            y : randint(3,7),
            width : 32,
            height : 32,
            frameX : 0,
            frameY : 0,
            xChange : 0.4,
            yChange : 0.4
        };
        enemies.push(enemy);
    } 

    // So its not exponential
    EnemyIncrease = 1;

    draw();
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then  = now - (elapsed % fpsInterval);

    BGaudio.play();
    // Drawing background
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#070d30"; // background color 
    context.fillRect(0,0,canvas.width,canvas.height)
    for (let r = 0; r < 15; r += 1) {
        for (let c = 0; c < 25; c += 1) {
            // ? is optionality, background was overwriting character
            let tile = background?.[r]?.[c]; 
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow); 
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(IMAGES.background,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r* tileSize, tileSize, tileSize);
            }
            //Tile Sorting 
            xCord = ~~(player.x/tileSize);
            yCord = ~~(player.y/tileSize);
            tileLeft = background[yCord][~~((player.x - 1)/tileSize)];
            tileRight = background[yCord][~~((player.x + 32)/tileSize)];
            tileUp = background[~~((player.y + 16)/tileSize)][xCord];
            tileBelow = background[~~((player.y +32)/tileSize)][xCord];  
            currentTile = background[yCord][xCord];
        }
    }
    
    // Coins    
    for (let i = 0, len = coins.length; i < len; i += 1) {
        context.fillStyle = "yellow";
        // Change appearance of coins and their value as rounds increase
        if (round < 3) {
            context.drawImage(IMAGES.background,
                            3 * tileSize ,19*tileSize, tileSize, tileSize,
                            coins[i].x * tileSize, coins[i].y * tileSize, tileSize,tileSize )
        } else if (round < 4){
            scoreIncrease = 25;
            context.drawImage(IMAGES.background,
                1 * tileSize ,20*tileSize, tileSize, tileSize,
                coins[i].x * tileSize, coins[i].y * tileSize, tileSize,tileSize )
        } else {
            scoreIncrease = 50;
            context.drawImage(IMAGES.background,
                0 * tileSize ,21*tileSize, tileSize, tileSize,
                coins[i].x * tileSize, coins[i].y * tileSize, tileSize,tileSize )
        }
        // coin collision - increase score
        if (~~(player.x/tileSize) === coins[i].x && ~~(player.y/tileSize)+1 === coins[i].y) {
            CoinEffect.play();
            coins.splice(i,1);
            score+=scoreIncrease;
        }
    }
    
    // InvincibleSpeed PowerUp
    if (round > 1) {
        context.drawImage(IMAGES.background,
                            1*tileSize,26*tileSize,tileSize,tileSize,
                            10*tileSize,12*tileSize,tileSize,tileSize)
        if (~~(player.x/tileSize) === 10 && ~~(player.y/tileSize)+1 === 12) {
            player.xChange = 7;
            player.yChange = 7;
            InvincibleSpeed = true; 
        }
    }
    // Decoration
    drawObstacles()

    // Draw enemies 
    for (let enemy of enemies){
        context.fillStyle = "grey"
        context.drawImage(IMAGES.enemy,
                        enemy.frameX * enemy.width, enemy.frameY * enemy.height, enemy.width, enemy.height,
                            enemy.x * tileSize, enemy.y * tileSize, enemy.width, enemy.height )
        // randomize movements 
        let direction = randint(1,250);
        if (direction===1) {
            if (enemy.x > 2) {
                enemy.x = enemy.x - enemy.xChange;
                enemy.frameY =1;
            }else{
                enemy.x = enemy.x
            }
        } else if (direction===2) {
            if (enemy.x < 18) {
                enemy.x = enemy.x + enemy.xChange;
                enemy.frameY = 2;
            }else {
                enemy.x = enemy.x
            }
        } else if (direction===3) {
            if (enemy.y > 3) {
                enemy.y = enemy.y - enemy.yChange;
                enemy.frameY=3
            } else{
                enemy.y = enemy.y;
            }
        } else if (direction===4) {
            if (enemy.y < 7) {
                enemy.y = enemy.y + enemy.yChange;
                enemy.frameY=0
            } else {
                enemy.y = enemy.y 
            }
        }
        // Enemy animation
        if (direction===1 || direction===2 || direction===3 || direction===4) {
        enemy.frameX = (enemy.frameX + 1) % 3;
        }
        if (player_collides(enemy)) {
            score= score
            stop();
        }
    }

    // Key presses
    if (moveLeft) {
        if (tileLeft === 5 || tileLeft === 6 || tileLeft === 7 || tileLeft ===4 || tileLeft ===17) {
            player.x = player.x - player.xChange;
            player.frameY =1;
        }else{
            player.x = player.x
        }
    }
    if (moveRight) {
        if (tileRight === 5 || tileRight === 6 || tileRight === 7 || tileRight ===4 || tileRight ===17) {
            player.x = player.x + player.xChange;
            player.frameY = 2;
        }else {
            player.x = player.x
        }  
    }
    if (moveUp) {
        if (tileUp ===5 || tileUp ===6 || tileUp===7 || tileUp===4 || tileUp===17) {
            player.y = player.y - player.yChange;
            player.frameY=3
        } else{
            player.y = player.y;
        }
    }
    if (moveDown) {
        if (tileBelow ===5 || tileBelow ===6 || tileBelow ===7 || tileBelow ===4 || tileBelow ===17) {
            player.y = player.y + player.yChange;
            player.frameY=0
        } else {
            player.y = player.y 
        }
    }

    // Drawing player
    context.fillStyle = "red"
    context.drawImage(IMAGES.player,
                player.frameX * player.width, player.frameY * player.height, player.width, player.height,
                player.x, player.y, player.width, player.height);
    // Player animation
    if (moveLeft || moveRight || moveUp || moveDown) {
        player.frameX = (player.frameX + 1) % 3;
    }

    // Text
    context.font = "20px Pixel";
    context.fillText("Score: " + score, 600, 400);
    context.fillText("Round: " + round, 600, 440);

    // Next round
    if (currentTile === 4 ) {
        round +=1 ;
        CoinIncrease +=1;
        EnemyIncrease +=1;
        next_round();
    }
}

// Randint
function randint(min, max) {
    return Math.round(Math.random() * (max- min)) + min;
}

// Key presses
function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft"){
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
}
function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false; 
    } else if (key === "ArrowDown") {
        moveDown= false;
    }
}

// Check Collision
function player_collides(enemy) {
    if (!InvincibleSpeed) {
        if (xCord === ~~(enemy.x) && yCord === ~~(enemy.y)) {
                return true;
            } else {
                return false;
            }
        }
}

// End game
function stop() { 
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);

    BGaudio.pause();
    BGaudio.currentTime = 0;

    context.globalAlpha = 0.9;
    context.fillStyle = "black";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.globalAlpha = 1.0;
    
    context.font = "80px Pixel";
    context.fillStyle = "red";
    context.fillText("Game Over!", 200, 280);
    
    DeathEffect.play();
    window.cancelAnimationFrame(request_id);

    let data = new FormData();
    data.append("score", score);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/store_score", true)
    xhttp.send(data);
}

// Decoration
function drawObstacles() {
    context.drawImage(IMAGES.background, 
        3 * tileSize ,21*tileSize, tileSize, tileSize,
        4 * tileSize, 1 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        3 * tileSize ,21*tileSize, tileSize, tileSize,
        8 * tileSize, 1 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        3 * tileSize ,21*tileSize, tileSize, tileSize,
        12 * tileSize, 1 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        3 * tileSize ,21*tileSize, tileSize, tileSize,
        16 * tileSize, 1 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        3 * tileSize ,21*tileSize, tileSize, tileSize,
        2 * tileSize, 10 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        3 * tileSize ,21*tileSize, tileSize, tileSize,
        6 * tileSize, 10 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        0 * tileSize ,17*tileSize, tileSize, tileSize,
        17 * tileSize, 2 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        1 * tileSize ,17*tileSize, tileSize, tileSize,
        18 * tileSize, 2 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        0 * tileSize ,16*tileSize, tileSize, tileSize,
        17 * tileSize, 1 * tileSize, tileSize,tileSize);
    context.drawImage(IMAGES.background, 
        1 * tileSize ,16*tileSize, tileSize, tileSize,
        18 * tileSize, 1 * tileSize, tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        1*tileSize, 23*tileSize,tileSize,tileSize,
        19*tileSize,3*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        0*tileSize, 24*tileSize,tileSize,tileSize,
        1*tileSize,3*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        1*tileSize, 24*tileSize,tileSize,tileSize,
        2*tileSize,3*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        2*tileSize, 24*tileSize,tileSize,tileSize,
        6*tileSize,1*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        2*tileSize, 25*tileSize,tileSize,tileSize,
        6*tileSize,2*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 24*tileSize,tileSize,tileSize,
        10*tileSize,1*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 25*tileSize,tileSize,tileSize,
        10*tileSize,2*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 6*tileSize,tileSize,tileSize,
        2*tileSize,1*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 7*tileSize,tileSize,tileSize,
        2*tileSize,2*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 6*tileSize,tileSize,tileSize,
        19*tileSize,1*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 7*tileSize,tileSize,tileSize,
        19*tileSize,2*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        2*tileSize, 24*tileSize,tileSize,tileSize,
        14*tileSize,1*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        2*tileSize, 25*tileSize,tileSize,tileSize,
        14*tileSize,2*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        0*tileSize, 25*tileSize,tileSize,tileSize,
        13*tileSize,9*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        0*tileSize, 26*tileSize,tileSize,tileSize,
        13*tileSize,10*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 22*tileSize,tileSize,tileSize,
        19*tileSize,8*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 23*tileSize,tileSize,tileSize,
        19*tileSize,9*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        3*tileSize, 21*tileSize,tileSize,tileSize,
        10*tileSize,10*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        2*tileSize, 24*tileSize,tileSize,tileSize,
        8*tileSize,10*tileSize,tileSize,tileSize)
    context.drawImage(IMAGES.background, 
        2*tileSize, 25*tileSize,tileSize,tileSize,
        8*tileSize,11*tileSize,tileSize,tileSize)
};


function handle_response() {
    // Check that the response has fully arrived
    if ( xhttp.readyState === 4 ) {
        // Check the request was successful
        if ( xhttp.status === 200 ) {
            if ( xhttp.responseText === "success") {
                // score was successfully stores in database 
            } else {
                // score was not successfully stores in database 
            }
        }
    }
}

function load_images (callback) {
    let num_images = Object.keys (IMAGES).length;
    let loaded = function() {
        num_images = num_images - 1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys (IMAGES)) {
        let img = new Image ();
        img.addEventListener ("load", loaded, false);
        img.src = IMAGES [name];
        IMAGES [name] = img;
    }
}

function resizeCanvas() {
    canvas.style.width = window.innerWidth + "px";
    setTimeout(function() {
      canvas.style.height = window.innerHeight + "px";
    }, 0);
};

// Resize Canvas code idea from --> https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window