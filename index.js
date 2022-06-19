
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const p1 = document.querySelector('img');

    canvas.width = 600;
    canvas.height = 550;
    
    let floors = [];
    let holes = [];
    let left;
    let right;
    
    class Tile{
        constructor(x,y,width, height, color){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.vel = 1;
        }        
        draw(){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    
        update(){
            this.y-=this.vel;
            this.draw();
        }
    };

    

    var startFloor = new Tile(215,150, 120, 10, "green");
    startFloor.draw();
    floors.push(startFloor);

    const setRandom = (min,max)=>{
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const clear = ()=>{
        ctx.clearRect(0,0,canvas.width, canvas.height);
    }
    const moveBlock = ()=>{
        requestAnimationFrame(moveBlock);
        clear();
        
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

    const generateRandomTiles = setInterval(()=>{
        let width = setRandom(80,120);
        let y = setRandom(580, 600);
        let x = setRandom(10, canvas.width - width);

        let newTile = new Tile(x,y,width, 10, "green");
        floors.push(newTile);
    }, 1500);

    
    class Ball{
        constructor(x,y,radius,color){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.vel = 2;
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

    let player = new Ball(280,75,10,"blue");
    moveBlock();










