const styles = `
    .flake{
        background: white;
        position: absolute;
        z-index: 999999;
    }
`;
const body = document.body, html = document.documentElement;
const minFps = 20;
const flakeSize = 4.0;
const speed = 0.6;
const density = 2;

let flakes = [];
let oldTimeStamp;
let height;

const appendStyleSheet = (id, content) => {
    if (!document.querySelector("#" + id)) {
        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(createStyleElement(id, content));
    }
}

const createStyleElement = (id, content) => {
    var style = document.createElement("style");
    style.id = id;

    if (style.styleSheet) {
        style.styleSheet.cssText = content;
    } else {
        style.appendChild(document.createTextNode(content));
    }
    return style;
}

const updateHeight = () => Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);

const seedFlake = (top) => {
    const newFlake = document.createElement("div");
    newFlake.classList.add("flake");
    newFlake.style.top = top + "px";
    newFlake.style.left = (Math.random() * 97.0) + "%";
    newFlake.style.rotate = Math.round(Math.random() * 360.0) + "deg";
    newFlake.style.opacity = Math.random() + 0.2;
    newFlake.style.width = flakeSize + "px";
    newFlake.style.height = flakeSize + "px";
    body.appendChild(newFlake);
}

const remove = (sel) => document.querySelectorAll(sel).forEach(el => el.remove());

const update = () => {
    flakes.map((flake) => {
        const eTop = parseFloat(flake.style.top || 0)
        if (eTop > height - (flakeSize * 2.0)) {
            flake.style.top = (-1 * flakeSize) + "px";
        }
        else {
            flake.style.top = (eTop + speed + Math.random()) + "px";
        }
        flake.style.left = (parseFloat(flake.style.left || 0.0) + ((Math.random() - 0.5) / 3.8)) + "%";
    });
}

const loop = (timeStamp) => {
    const secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    const fps = Math.round(1 / secondsPassed);
    if (fps > minFps) {
        update();
    }
    window.requestAnimationFrame(loop);
}

const init = () => {
    height = updateHeight();
    remove(".flake");

    Array(density).fill(null).map(
        _ => Array(height).fill(null).map((_ , h) => seedFlake(h))
    );

    flakes = [...body.getElementsByClassName("flake")];
}

appendStyleSheet("snowflakes", styles);
init();
window.requestAnimationFrame(loop);
window.onresize = init;