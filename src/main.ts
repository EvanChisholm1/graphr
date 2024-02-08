import { f, run } from "./parser";
import "./style.css";

const equationInput = document.querySelector(".equationIn") as HTMLInputElement;
const equationOutput = document.querySelector(
    ".equationOutput"
) as HTMLParagraphElement;

let equation = "";

equationInput.addEventListener("input", () => {
    equation = equationInput.value;
    if (!equation.includes("x") && equation.trim() !== "")
        equationOutput.textContent = run(equation).toString();
    else equationOutput.textContent = "";
});

const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let scale = 10;

const screenToCartesianX = (x: number, offset: number, scale: number) =>
    (1 / scale) * (x - offset);

const cartesionToScreenY = (y: number, offset: number, scale: number) =>
    scale * -y + offset;

const renderDot = (x: number, y: number) => {
    var radius = 5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};

const renderEquation = () => {
    if (equation === "") return;
    if (equation.includes("x")) {
        ctx.strokeStyle = "red";

        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            let y =
                scale * -f(equation, screenToCartesianX(x, offsetX, scale)) +
                offsetY;
            if (y < 0) y = 0;
            if (y > canvas.height) y = canvas.height;
            console.log(x, y);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();

        const y = screenToCartesianX(mouseX, offsetX, scale);
        const screenY = cartesionToScreenY(y, offsetY, scale);
        renderDot(mouseX, screenY);
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

let mouseX = 0;

window.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        offsetX += e.movementX;
        offsetY += e.movementY;
    }

    mouseX = e.clientX;
    if (equation.includes("x")) {
        const y = screenToCartesianX(e.clientX, offsetX, scale);
        const screenY = cartesionToScreenY(y, offsetY, scale);
        renderDot(mouseX, screenY);
    }
});

window.addEventListener("wheel", (e) => {
    // console.log(e.deltaY);
    // scale -= e.deltaY / 100;
    const direction = e.deltaY > 0 ? -1 : 1;
    scale += 0.01 * direction;
    // if (scale < 0.000001) scale = 0.000001;
});
