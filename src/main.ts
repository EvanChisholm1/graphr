import { f, run } from "./parser";
import "./style.css";

const equationInput = document.querySelector(".equationIn") as HTMLInputElement;
console.log(equationInput);

let equation = "";

equationInput.addEventListener("input", () => {
    equation = equationInput.value;
});

const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let scale = 10;

const renderEquation = () => {
    if (equation === "") return;
    if (equation.includes("x")) {
        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(0, -f(equation, -offsetX) + offsetY);

        for (let x = 0; x < canvas.width; x++) {
            // the max and min functions prevent the line from going off the screen
            const y = Math.min(
                Math.max(
                    scale * -f(equation, (1 / scale) * (x - offsetX)) + offsetY,
                    0
                ),
                canvas.height
            );
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();
    } else {
        console.log(run(equation));
    }
};

const renderVerticalAxis = () => {
    ctx.beginPath();
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
    ctx.stroke();
    ctx.closePath();
};

const renderHorizontalAxis = () => {
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
    ctx.stroke();
    ctx.closePath();
};

const renderLoop = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderVerticalAxis();
    renderHorizontalAxis();

    try {
        renderEquation();
    } catch (e) {
        console.error(e);
    }

    requestAnimationFrame(renderLoop);
};

renderLoop();

let isMouseDown = false;

window.addEventListener("mousedown", (e) => {
    if (e.target === canvas) {
        e.preventDefault();
        isMouseDown = true;
    }
});

window.addEventListener("mouseup", () => {
    isMouseDown = false;
});

window.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        offsetX += e.movementX;
        offsetY += e.movementY;
    }
});

window.addEventListener("wheel", (e) => {
    // console.log(e.deltaY);
    // scale -= e.deltaY / 100;
    const direction = e.deltaY > 0 ? -1 : 1;
    scale += 0.01 * direction;
    // if (scale < 0.000001) scale = 0.000001;
});
