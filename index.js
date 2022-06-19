
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const p1 = document.querySelector('img');

    canvas.width = 600;
    canvas.height = 550;
    
    let floors = [];
    let holes = [];
    
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
        clear(){
            ctx.clearRect(this.x,this.y,this.width, this.height);
        }
        update(){
            this.y-=this.vel;
            this.draw();
        }
    };

    

    var test = new Tile(50,400, 120, 10, "green");

    const setRandom = (min,max)=>{
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const moveBlock = ()=>{
        requestAnimationFrame(moveBlock);
        floors.forEach(floor=>{
            floor.clear();
            floor.update();
        })
        
    }

    const generateRandomTiles = setInterval(()=>{
        let width = setRandom(80,120);
        let y = setRandom(580, 600);
        let x = setRandom(10, canvas.width - width);

        let newTile = new Tile(x,y,width, 10, "green");
        floors.push(newTile);
    }, 2000);

    
    class Ball{
        constructor(x,y,radius,color){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
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
        }
    }

    let player = new Ball(280,75,10,"blue");
    player.update();

    








