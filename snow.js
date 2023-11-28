const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.height = height;
canvas.width = width;

const count = 2000;
const drag = 0.25;
const gravity = 0.98;
let snowflakes = [];
let angle = 0;
let landCount = 0;
let wave1 = 20;
let wave2 = 30;
let phase1 = 100;
let phase2 = 300;
let width1 = 100;
let width2 = 200;

const seedFlake = (top) => {
    snowflakes.push({
        x: Math.floor(width / 2 + Math.sin((-1* (width/2))+ Math.random() * 360) * (width*2)),
        y: top?0:Math.floor(Math.random() * height),
        radius: Math.random() * 5 + 1,
        opacity: Math.floor(Math.random() * 10)/10 ,
        angle: Math.random(),
        down: false
    })
}

const init = () => {
    wave1 = Math.random()*20+10;
    wave2 = Math.random()*30+10;
    phase1 = Math.random()*4000;
    phase2 = Math.random()*2000;
    width1 = Math.random()*50+100;
    width2 = Math.random()*150+100;
    snowflakes = [];
    landCount = 0;
    Array(count).fill(null).map(_ => seedFlake(false))
}
const draw = () => {
    snowflakes.map(f => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255," + f.opacity + ")";
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);
        ctx.fill();
    });
};

const move = () => {
    angle += 0.005;
    snowflakes.map(f => {
        if (!f.down) {
            f.x += Math.sin(drag * angle + f.angle) * f.radius;
            f.y += f.radius / 2 * gravity;
            const sinCurve1 = ((wave1-angle)*(Math.sin((f.x-phase1)/width1)));
            const sinCurve2 = ((wave2+angle)*(Math.sin((f.x-phase2)/width2)));
            const snowDepth = Math.floor(landCount/(width/8)) + sinCurve1 + sinCurve2 + 10;

            if(snowDepth > canvas.height){
                landCount = 0;
                init();             
            }

            if (f.y > canvas.height - snowDepth) {
                landCount++;
                if(f.x < -5 || f.x > canvas.width){
                    f.x = Math.floor(width / 2 + Math.sin(Math.random() * 360) * width);
                    f.y =Math.floor(Math.random() * height);
                }
                else{
                    f.down = true;
                    seedFlake(true);
                }    
            }
        }
    });
};

const update = () => {
    ctx.clearRect(0, 0, width, height);
    move();
    draw();
    window.requestAnimationFrame(update);
};

const resize = () => {
    init();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};

init();
update();
window.onresize = resize;
