const borderBox = document.getElementById("placeholder");
const customColor = document.getElementById("customColor");
const addBtn = document.getElementById("addRect");
const currentIndex = document.getElementById("current");
const inputText = document.getElementById("inputText");
const renderTextBtn = document.getElementById("renderText");
const delBtn = document.getElementById("delRect");
const canvas = document.getElementById("canvas");

const canvasWidth = 500;
const canvasHeight = 500;

let currentHover = -1;
let currentSelect = -1;

const canvasStory = [];
const context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;


class drawActive {
  constructor(element,width,height,left,top,shadow){
    this.element = element
    this.width = width
    this.height = height
    this.left = left
    this.top = top
    this.boxShadow = shadow||''
  }
  render(){
    this.element.style.width =this.width+'px'
    this.element.style.height =this.height+'px'
    this.element.style.left =this.left+'px'
    this.element.style.top =this.top+'px'
    // this.element.style.boxShadow =this.boxShadow
  }
}
// 渲染字体
class drawText {
  constructor(width,left,top,text,size,family,align,color){
    this.width = width
    this.left = left
    this.top = top
    this.text = text
    this.size = size||16
    this.color = color||'white',
    this.family = family||'Arial'
    this.align = align||'center' 
  }
  render(){
    context.shadowBlur = "0";
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font=`${this.size}px Arial`;
    let start = 0;
    let textWidth = 0;
    // 居中对齐
    let positionX = this.left+this.width/2;
    let positionY =this.top+10+this.size;
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
              context.fillText(
                shotText,
                positionX,
                positionY
              );
              positionY +=this.size
        }
      }
    }
  }
}

// 创建矩形

class drawRect extends drawText {
  constructor(x, y, width, height, color, hover, text) {
    super(width,x, y,text,16,'','center','white');
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.hover = hover;
    this.text = text;
  }
  draw() {
    // if (this.hover) {
    //   context.shadowColor = "black";
    //   context.shadowBlur = "10";
    // } else {
    //   context.shadowColor = "";
    //   context.shadowBlur = "0";
    // }
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    if (Boolean(this.text)) {
      super.render()
    }
  }
}
initCanvas();

function initCanvas() {
  currentHover = -1;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "yellow";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}
function addRect() {
  const width = 100;
  const height = 60;
  const color = customColor.value;
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
    const active = new drawActive(borderBox,0,0,0,0,'0')
    active.render();
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
    const currentObj =  canvasStory[currentSelect]
    const {width,height,y,x} = currentObj
    const active = new drawActive(borderBox,width,height,x,y,'0 0 7px #000')
    active.render();
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


addBtn.addEventListener("click", addRect, false);

delBtn.addEventListener("click", deleteFirst, false);

canvas.addEventListener("mousemove", mouseMove, false);

canvas.addEventListener("click", mouseEnter, false);

renderTextBtn.addEventListener("click", renderText, false);
