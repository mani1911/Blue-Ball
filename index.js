const canvas = document.querySelector('canvas');
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const p1 = document.querySelector('img');
const player = {
    w : 50,
    h : 70,
    x : 20,
    y : 200,
    speed : 5,
    dx : 0,
    dy : 0
}

const moveRight = (e)=>{
    player.dx = player.speed;
    
}
const moveLeft = (e)=>{
    player.dx = -player.speed;
    
}
const moveUp = (e)=>{
    player.dy = -player.speed;
}
const moveDown = (e)=>{
    player.dy = player.speed;
}

const movePlayer = (e)=>{
    if(e.key === 'ArrowRight'){
        moveRight();
    }
    if(e.key === 'ArrowLeft'){
        moveLeft();
    }
    if(e.key === 'ArrowUp'){
        moveUp();
    }
    if(e.key === 'ArrowDown'){
        moveDown();
    }
}

const stopPlayer = (e)=>{
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        player.dy = 0;
    }
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        player.dx = 0;
    }
}

const newPos = ()=>{
    player.x += player.dx;
    player.y += player.dy;
}
const drawPlayer = ()=>{
    ctx.drawImage(p1,player.x, player.y,player.w, player.h);
}

const clear = ()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height)
}

const detectWalls = ()=>{
    if(player.x <= 0){
        player.x = 0;
    }
    if(player.x + player.w >= canvas.width){
        player.x = canvas.width - player.w;
    }
    if(player.y <=0){
        player.y = 0;
    }
    if(player.y + player.h >= canvas.height){
        player.y = canvas.height - player.h;
    }
}

const update = ()=>{
    clear();
    drawPlayer();
    newPos();
    detectWalls();
    requestAnimationFrame(update);
}

update();
document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer)


