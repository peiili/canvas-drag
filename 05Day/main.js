const activeBox = document.getElementById("placeholder");
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
let touchStart = false;
const canvasStory = [];
const context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

class DrawActive {
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
class DrawText {
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
class DrawRect extends DrawText {
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
class RecordActive{
  constructor(canvasStory,mouseX,mouseY){
    this.canvasStory = canvasStory
    this.mouseX = mouseX
    this.mouseY = mouseY
  }
  record(){
    let currentHover = -1
    this.canvasStory.forEach((e, index) => {
      const targetminX = e.x;
      const targetmaxX = e.x + e.width;
      const targetminY = e.y;
      const targetmaxY = e.y + e.height;
      const atRangeX = this.mouseX > targetminX && this.mouseX < targetmaxX;
      const atRangeY = this.mouseY > targetminY && this.mouseY < targetmaxY;
      e.hover = false;
      if (atRangeY && atRangeX) {
        // 记录下最后一个hover
        currentHover = index;
      }
    });
    return currentHover;
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
  const active = new DrawActive(activeBox,0,0,0,0,'0')
  active.render();
  if (canvasStory.length === 0) {
    currentHover = -1;
    currentSelect = -1;
    // const active = new DrawActive(activeBox,0,0,0,0,'0')
    // active.render();
  }
  for (let i = 0; i < canvasStory.length; i++) {
    const e = canvasStory[i];
    if (e.hover) {
      // 更新当前被选中的索引
      currentHover = i;
      const {width,height,y,x} = e
      const active = new DrawActive(activeBox,width,height,x,y,'0 0 7px #000')
      active.render();
    }
    renderCanvas(e);
  }
}
// 渲染rect
function renderCanvas(data) {
  const rect = new DrawRect(
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
  if(touchStart){
    console.log(event)
  }
}
function mouseOut(){
  touchStart = false
}
function range(event){
  const canvasRangeMinX = canvas.offsetLeft
  const canvasRangeMaxX = canvas.offsetLeft+canvas.width
  const canvasRangeMinY = canvas.offsetTop
  const canvasRangeMaxY = canvas.offsetTop+canvas.height
  const atCanvasRangeX = event.pageX>=canvasRangeMinX&&event.pageX<=canvasRangeMaxX
  const atCanvasRangeY = event.pageY>=canvasRangeMinY&&event.pageY<=canvasRangeMaxY
  return atCanvasRangeX&&atCanvasRangeY
}
// 监听鼠标点击
function onmousedown(event){
  const arRange = range(event)
  if(arRange){
    console.log(event)
    touchStart = true
  }
}
// 监听鼠标抬起
function onmouseup(event){
  if(touchStart){
    touchStart = false
    console.log(event)
  }
}
// 鼠标点击
function mouseEnter(event) {
  const mouseX = event.pageX;
  const mouseY = event.pageY;

  // 记录下hover 的对象并初始化所有内容
  initCanvas();
  const recordActive = new RecordActive(canvasStory,mouseX,mouseY)
  currentHover = recordActive.record()
  console.log(currentHover)

  if (currentHover > -1 && canvasStory.length > 0) {
    canvasStory[currentHover].hover = true;
  }
  // if (currentSelect > -1) {
  //   canvasStory[currentSelect].hover = true;
  // }
  if (currentHover>-1&&canvasStory.length) {
    // 点击后将被点击的移动至最上层
    const current = canvasStory.splice(currentHover, 1);
    canvasStory.push(current[0]);
    currentSelect = canvasStory.length - 1;
    // const currentObj =  canvasStory[currentSelect]
    // const {width,height,y,x} = currentObj
    // const active = new DrawActive(activeBox,width,height,x,y,'0 0 7px #000')
    // active.render();
    initCanvas();
    // currentIndex.innerText = currentSelect;
  }
  canvasStory.forEach((e) => {
    if(e.hover){
      const {width,height,y,x} = e
      const active = new DrawActive(activeBox,width,height,x,y,'0 0 7px #000')
      active.render();
    }
    renderCanvas(e);
  });
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

activeBox.addEventListener('mousedown',onmousedown,false)
activeBox.addEventListener("mousemove", mouseMove, false);
activeBox.addEventListener("mouseout", mouseOut, false);
activeBox.addEventListener('mouseup',onmouseup,false)

canvas.addEventListener("click", mouseEnter, false);

renderTextBtn.addEventListener("click", renderText, false);
