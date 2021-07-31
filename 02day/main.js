const canvas = document.getElementById("canvas");
const canvasWidth = 500;
const canvasHeight = 500;
let i = 0;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const context = canvas.getContext("2d");
const canvasStory = [];

context.fillStyle = "yellow";
context.fillRect(0, 0, canvasWidth, canvasHeight);

// 创建矩形
class drawRect {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

function addRect() {
  const width = 100;
  const height = 60;
  const color = 'red';
  const x = Math.random() * (canvasWidth - width);
  const y = Math.random() * (canvasHeight - height);
  const imgData = {
    x,
    y,
    width,
    height,
    color,
  };
  renderCanvas(imgData)
  canvasStory.push(imgData)
}


function deleteFirst() {
  canvasStory.shift();
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  console.log(canvasStory);
  context.fillStyle = "yellow";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  for (let i = 0; i < canvasStory.length; i++) {
    const element = canvasStory[i];
    renderCanvas(element);
  }
}
// canvas.addEventListener("click", mouseDown, false);
function renderCanvas(data) {
  const rect = new drawRect(data.x, data.y, data.width, data.height, data.color);
  rect.draw();
}

const addBtn = document.getElementById("addRect");
addBtn.addEventListener("click", addRect, false);

const delBtn = document.getElementById("delRect");
delBtn.addEventListener("click", deleteFirst, false);
