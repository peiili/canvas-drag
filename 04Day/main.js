const canvas = document.getElementById("canvas");
const canvasWidth = 500;
const canvasHeight = 500;
const currentIndex = document.getElementById("current");

const context = canvas.getContext("2d");
const canvasStory = [];
const inputText = document.getElementById("inputText");
const renderTextBtn = document.getElementById("renderText");
let currentHover = -1;
let currentSelect = -1;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

initCanvas();

function initCanvas() {
  currentHover = -1;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "yellow";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}
// 渲染字体
class drawText {
  constructor(text,size,color){

  }
  render(){

  }
}

// 创建矩形

class drawRect {
  constructor(x, y, width, height, color, hover, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.hover = hover;
    this.text = text;
  }
  draw() {
    if (this.hover) {
      context.shadowColor = "black";
      context.shadowBlur = "10";
    } else {
      context.shadowColor = "";
      context.shadowBlur = "0";
    }
    // context.font()
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    if (Boolean(this.text)) {
      context.shadowColor = "";
      context.shadowBlur = "0";
      context.fillStyle = "white";
      context.textAlign = "center";
      // context.font="40px Arial";
      let start = 0;
      let textWidth = 0;
      // 居中对齐
      let positionX = this.x+this.width/2;
      let positionY =this.y+10;
      if(context.measureText(this.text).width<this.width){
            context.fillText(
              this.text,
              positionX,
              positionY
            );
      }else{
        for (let i = 0; i < this.text.length; i++) {
          const shotText = this.text.substring(start, i)
          textWidth = context.measureText(shotText).width;
          if (textWidth >= this.width-20) {
                start = i
                positionY +=10
                context.fillText(
                  shotText,
                  positionX,
                  positionY
                );
          }
        }
      }
    }
  }
}

function addRect() {
  const width = 100;
  const height = 60;
  const color = "red";
  const x = Math.random() * (canvasWidth - width);
  const y = Math.random() * (canvasHeight - height);
  const imgData = {
    index: canvasStory.length,
    x,
    y,
    width,
    height,
    color,
    hover: false,
  };
  renderCanvas(imgData);
  canvasStory.push(imgData);
}

function deleteFirst() {
  canvasStory.shift();
  initCanvas();
  if (canvasStory.length === 0) {
    currentHover = -1;
    currentSelect = -1;
  }
  for (let i = 0; i < canvasStory.length; i++) {
    const element = canvasStory[i];
    if (element.hover) {
      // 更新当前被选中的索引
      currentHover = i;
    }
    renderCanvas(element);
  }
}
// 渲染rect
function renderCanvas(data) {
  const rect = new drawRect(
    data.x,
    data.y,
    data.width,
    data.height,
    data.color,
    data.hover,
    data.text
  );
  rect.draw();
}
// 鼠标悬浮
function mouseMove(event) {
  const mouseX = event.pageX;
  const mouseY = event.pageY;

  initCanvas();
  // 记录下hover 的对象并初始化所有内容
  // currentHover = -1
  canvasStory.forEach((e, index) => {
    const targetminX = e.x;
    const targetmaxX = e.x + e.width;
    const targetminY = e.y;
    const targetmaxY = e.y + e.height;
    const atRangeX = mouseX > targetminX && mouseX < targetmaxX;
    const atRangeY = mouseY > targetminY && mouseY < targetmaxY;
    e.hover = false;
    if (atRangeY && atRangeX) {
      // 记录下最后一个hover
      currentHover = index;
    }
  });
  if (currentHover > -1 && canvasStory.length > 0) {
    canvasStory[currentHover].hover = true;
  }
  if (currentSelect > -1) {
    canvasStory[currentSelect].hover = true;
  }

  // 将处理后的数据再次渲染到画布
  canvasStory.forEach((e) => {
    renderCanvas(e);
  });
}
// 鼠标点击
function mouseEnter() {
  console.log(currentHover);
  if (canvasStory.length) {
    // 点击后将被点击的移动至最上层
    const current = canvasStory.splice(currentHover, 1);
    canvasStory.push(current[0]);
    // currentHover = canvasStory.length-1
    currentSelect = canvasStory.length - 1;
    initCanvas();

    canvasStory.forEach((e) => {
      renderCanvas(e);
    });
    currentIndex.innerText = currentSelect;
  }
}

// 渲染文字
function renderText() {
  let text = inputText.value;
  if (currentSelect > -1 && text) {
    let item = canvasStory[currentSelect];
    item.text = text;
    // const text = 'hello word'
    // context.fillText('下面文字长度'+context.measureText(text).width,10 ,10)
    // context.fillText(text,10 ,20)
    initCanvas();
    canvasStory.forEach((e) => {
      renderCanvas(e);
    });
  }
}

const addBtn = document.getElementById("addRect");
addBtn.addEventListener("click", addRect, false);

const delBtn = document.getElementById("delRect");
delBtn.addEventListener("click", deleteFirst, false);

canvas.addEventListener("mousemove", mouseMove, false);

canvas.addEventListener("click", mouseEnter, false);
renderTextBtn.addEventListener("click", renderText, false);
