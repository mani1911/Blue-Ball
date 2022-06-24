window.addEventListener('load',()=>{
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const p1 = document.querySelector('img');
    const toggleBtn = document.querySelector('.toggle');
    const score = document.querySelector('.score');
    const lives = document.querySelector('.lives');
    const highScore = document.querySelector('.highscore');
    const lifeBar = document.querySelector('.lifeBar');
    const scoreBar = document.querySelector('.scorebar');
    
    let healthSound = new Audio("sounds/health.mp3");
    let teleport = new Audio("sounds/teleport-14639.mp3");
    let slowsound = new Audio("sounds/cartoon-jump-6462.mp3");
    let gameover = new Audio("sounds/gameover.wav");
    let start = new Audio("sounds/start.mp3");
     


    if(localStorage.highscore){
        highScore.innerHTML = localStorage.highscore;
    }
    else{
        highScore.innerHTML = 0;
    }
    
    let bg = new Image();
    bg.src = "assets/bluemoon.png";

    let heart = new Image();
    heart.src = "assets/heart.png"

    let arrowdown = new Image();
    arrowdown.src = "assets/arrowdown.png"

    let img = new Image();
    img.src = "assets/cloud.png";
    let points = 0;
    canvas.width = 700;
    canvas.height = 600;

    let healthSpawn = [];
    let slow = [];
    let floors = [];
    let left;
    let right;
    let flag = false;
    let health = 2;
    let vel = 1;
    let ballVel = 2;

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

    const incrementScore = setInterval(()=>{
        if(health >=0){
            if((points+1) % 10 == 0){
                scoreBar.style.color = 'green';
                setTimeout(()=>{
                    scoreBar.style.color = 'white';
                },1000);
            }
            points++;
            score.innerHTML = points;
        }
        
    },1000);

    const toggleLifeBar = ()=>{
        lifeBar.style.color = 'red';
        setTimeout(()=>{
            lifeBar.style.color = 'white';
        },1000);
    }

    const increaseVel = setInterval(()=>{
        if(vel <=5){
            vel+=0.15;
        }
        if(ballVel <= 3.5){
            ballVel+=0.1;
        }

    },5000);

    const updateLeaderBoard = (score)=>{
        let prev = 0;
        if(localStorage.highscore != undefined){
            prev = localStorage.highscore;
        }
        if(score> parseInt(prev)){
            localStorage.highscore = score;
            highScore.innerHTML = score;
        }
    }

    class Slowdown{
        constructor(x,y){
            this.x = x;
            this.y = y;
            this.vel = vel;
        }

        draw(){
            ctx.drawImage(arrowdown,this.x,this.y,25,25);
        }

        update(){
            this.y-=this.vel;
            this.draw();
        }
    }

    class Health{
        constructor(x,y){
            this.x = x;
            this.y = y;
            this.vel = vel;
        }

        draw(){
            ctx.drawImage(heart,this.x,this.y,25,25);
        }

        update(){
            this.y-=this.vel;
            this.draw();
        }
        
    }
    
    class Tile{
        constructor(x,y,width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.vel = vel;
        }        
        draw(){
            ctx.drawImage(img,this.x,this.y,this.width, this.height);
        }
    
        update(){
            this.y-=this.vel;
            this.draw();
        }
    };

    const gameOver = ()=>{
        gameover.play();
        ctx.font = "50px Georgia";
        ctx.fillStyle = "white";
        ctx.fillText("Game Over", 240, 250);
        ctx.font = "25px Georgia";
        ctx.fillText(`Score : ${points}`, 300, 300);
        updateLeaderBoard(points);
    }

    var startFloor = new Tile(275,250, 120, 15);
    startFloor.draw();
    floors.push(startFloor);

    const setRandom = (min,max)=>{
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const clear = ()=>{
        ctx.clearRect(0,0,canvas.width, canvas.height);
    }
    const moveBlock = ()=>{
        
        animation = requestAnimationFrame(moveBlock);
        clear();
        ctx.drawImage(bg,0,0,canvas.width, canvas.height);
        if(flag){
            toggleLifeBar();
            if(health>0){
                teleport.play();
                flag = false;
                player.x = 335;
                player.y = 75;
                health--;
                lives.innerHTML = health+1;

            }
            else{
                health--;
                lives.innerHTML = health+1;
                clearInterval(incrementScore);
                clearInterval(increaseVel);
                clearInterval(generateHealth);
                gameOver();
                return;
            }
        }
        healthSpawn.forEach(h=>{
            h.vel = vel;
            if(player.x+player.radius >= h.x && player.x - player.radius <= h.x+25){
                if(player.y+player.radius <= h.y+25 && player.y - player.radius >= h.y - 25){
                    if(health<2){
                        healthSpawn = healthSpawn.filter(hlth => hlth!=h);
                        healthSound.play();
                        health++;
                        lives.innerHTML = health+1;
                        lifeBar.style.color = 'green';
                        setTimeout(()=>{
                            lifeBar.style.color = 'white';
                        },1000);
                    }
 
                    
                }
            }
            h.update();
        });

        slow.forEach(s=>{
            s.vel = vel;
            if(player.x+player.radius >= s.x && player.x - player.radius <= s.x+25){
                if(player.y+player.radius <= s.y+25 && player.y - player.radius >= s.y - 25){
                    slowsound.play();
                    let dec=  vel/2;
                    vel-= dec;
                    setTimeout(()=>{
                        vel+= dec;
                    },3000);
                    slow = slow.filter(sl => sl!=s);
                    
                }
            }
            s.update();
        })
        
        floors.forEach(floor=>{
            floors = floors.filter(floor=> floor.y>-30);
            floor.vel = vel;
            if(player.y + player.radius >=floor.y && player.y < floor.y){
                if(player.x > floor.x && player.x <= floor.x + floor.width){
                    player.fall = -floor.vel;
                }
                else{
                    player.fall = 3.5;
                }
            }
            floor.update();
        })
        player.update();
    }

    const checkGameOver = setInterval(()=>{
        if(health <= -1){
            cancelAnimationFrame(animation);
        }
    
    },1);

    const generateRandomTiles = setInterval(()=>{
        width = setRandom(80,120);
        y = setRandom(580, 600);
        x = setRandom(10, canvas.width - width);
        let newTile = new Tile(x,y,width, 15, "black");
        floors.push(newTile);
    }, 500);

    const generateHealth = setInterval(()=>{
        const rand = randomIntFromInterval(0,1);
        if(rand ===1){
            let newHealth = new Health(x + (width/2)-10,y-20);
            healthSpawn.push(newHealth);
        }
        else if(rand ===0){
            let newSlow = new Slowdown(x + (width/2)-10,y-20);
            slow.push(newSlow);
        }

    },5000);
    
    class Ball{
        constructor(x,y,radius,color){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.vel = ballVel;
            this.fall = 2;
        }

        draw(){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update(){
            if(this.y - this.radius <= 0 || this.radius + this.y >= canvas.height){
                flag = true;
                this.fall = 3.5;
            }
            this.draw();
            if(left){
                this.x-= this.vel;
            }
            if(right){
                this.x+= this.vel;
            }
            if(this.x - this.radius < 0){
                this.x = this.radius;
            }
            if(this.x + this.radius > canvas.width){
                this.x = canvas.width - this.radius;
            }
            this.y += this.fall;
        }
    }

    document.addEventListener('keydown',(e)=>{
        if(e.key === 'ArrowLeft'){
            left = true;
        }
        if(e.key === 'ArrowRight'){
            right = true;
        }
    })

    document.addEventListener('keyup', (e)=>{
        if(e.key === 'ArrowLeft'){
            left = false;
        }
        if(e.key === 'ArrowRight'){
            right = false;
        }
    })

    let player = new Ball(335,75,10,"blue");
    startGame = ()=>{
        start.play();
        moveBlock();
    }
    startGame();
});






