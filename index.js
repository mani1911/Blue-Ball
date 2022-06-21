window.addEventListener('load',()=>{
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const p1 = document.querySelector('img');
    const toggleBtn = document.querySelector('.toggle');
    const score = document.querySelector('.score');
    const lives = document.querySelector('.lives');
    const highScore = document.querySelector('.highscore');
    
    highScore.innerHTML = localStorage.highscore?localStorage.highscore:0;
    let bg = new Image();
    bg.src = "assets/bluemoon.png";

    let img = new Image();
    img.src = "assets/cloud.png";
    let points = 0;
    const incrementScore = setInterval(()=>{
        if(health >=0){
            points++;
            score.innerHTML = points;
        }
    },1000);
    canvas.width = 700;
    canvas.height = 600;

    

    let floors = [];
    let left;
    let right;
    let flag = false;
    let health = 2;
    let vel = 1;
    let ballVel = 2;

    const increaseVel = setInterval(()=>{
        if(vel <=4){
            vel+=0.5;
        }
        if(ballVel <= 3){
            ballVel+=0.2;
        }

    },10000);

    const updateLeaderBoard = (score)=>{
        let prev = parseInt(localStorage.highscore);
        if(score> prev){
            localStorage.highscore = score;
            highScore.innerHTML = score;
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
            if(health>0){
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
                gameOver();
                return;
            }

        }
        
        floors.forEach(floor=>{
            if(player.y + player.radius >=floor.y && player.y < floor.y + floor.height){
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
        let width = setRandom(80,120);
        let y = setRandom(580, 600);
        let x = setRandom(10, canvas.width - width);

        let newTile = new Tile(x,y,width, 15, "black");
        floors.push(newTile);
    }, 500);


    
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
    moveBlock();

    toggleBtn.addEventListener('click',()=>{
        cancelAnimationFrame(animation);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        moveBlock();
    
    })
});






