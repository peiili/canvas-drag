const activeBox = document.getElementById("placeholder");
const customColor = document.getElementById("customColor");
const addBtn = document.getElementById("addRect");
const inputText = document.getElementById("inputText");
const renderTextBtn = document.getElementById("renderText");
const delBtn = document.getElementById("delRect");
const tags = document.querySelectorAll("tag");
const canvas = document.getElementById("canvas");
const fileEle = document.getElementById('upload')

const canvasWidth = 500;
const canvasHeight = 500;

let currentHover = -1;
let currentSelect = -1;
let touchStart = false;
let imgSrc = null;
// 点击元素时记录相对元素的位置
let touchOffsetX = 0;
let touchOffsetY = 0;

// 点击元素时记录相对页面的位置
let touchStartX = 0;
let touchStartY = 0;
let currentAction = 'active'
const canvasStory = [];
const context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const canvasLeft = canvas.getBoundingClientRect().left
const canvasTop = canvas.getBoundingClientRect().top

class DrawActive {
  constructor(element, width, height, left, top, hide) {
    this.element = element
    this.width = width
    this.height = height
    this.left = left
    this.top = top
    this.hide = hide || 'block'
  }
  render() {
    this.element.style.width = this.width + 'px'
    this.element.style.height = this.height + 'px'
    this.element.style.left = this.left + 'px'
    this.element.style.top = this.top + 'px'
    this.element.style.display = this.hide
    // this.element.style.boxShadow =this.boxShadow
  }
}
// 渲染字体
class DrawText {
  constructor(width, left, top, text, size, family, align, color) {
    this.width = width
    this.left = left
    this.top = top
    this.text = text
    this.size = size || 16
    this.color = color || 'white',
      this.family = family || 'Arial'
    this.align = align || 'center'
  }
  render() {
    context.shadowBlur = "0";
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font = `${this.size}px Arial`;
    let start = 0;
    let textWidth = 0;
    // 居中对齐
    let positionX = this.left + this.width / 2;
    let positionY = this.top + 10 + this.size;
    if (context.measureText(this.text).width < this.width) {
      context.fillText(
        this.text,
        positionX,
        positionY
      );
    } else {
      for (let i = 0; i < this.text.length; i++) {
        const shotText = this.text.substring(start, i)
        textWidth = context.measureText(shotText).width;
        if (textWidth >= this.width - 20) {
          start = i
          context.fillText(
            shotText,
            positionX,
            positionY
          );
          positionY += this.size
        }
      }
    }
  }
}

// 创建矩形
class DrawRect extends DrawText {
  constructor(x, y, width, height, color, hover, text) {
    super(width, x, y, text, 16, '', 'center', 'white');
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
class RecordActiveIndex {
  constructor(canvasStory, mouseX, mouseY) {
    this.canvasStory = canvasStory
    this.mouseX = mouseX
    this.mouseY = mouseY
  }
  record() {
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
  // context.drawImage(imgSrc, 0, 0, canvasWidth, canvasHeight);

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
  const active = new DrawActive(activeBox, 0, 0, 0, 0, 'none')
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
      const {
        width,
        height,
        y,
        x
      } = e
      const active = new DrawActive(activeBox, width, height, x, y)
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
  if (touchStart) {
    initCanvas();
    canvasStory.forEach((e) => {
      if (e.hover) {
        let offsetX = event.pageX - touchOffsetX - canvasLeft
        let offsetY = event.pageY - touchOffsetY - canvasTop
        const canvasRangeMinX = canvas.offsetLeft
        const canvasRangeMaxX = canvas.offsetLeft + canvas.width - e.width
        const canvasRangeMinY = canvas.offsetTop
        const canvasRangeMaxY = canvas.offsetTop + canvas.height - e.height
        if (offsetX < canvasRangeMinX) {
          offsetX = canvasRangeMinX
        } else if (offsetX > canvasRangeMaxX) {
          offsetX = canvasRangeMaxX
        }
        if (offsetY < canvasRangeMinY) {
          offsetY = canvasRangeMinY
        } else if (offsetY > canvasRangeMaxY) {
          offsetY = canvasRangeMaxY
        }
        e.x = offsetX
        e.y = offsetY
        const {
          width,
          height,
          y,
          x
        } = e
        const active = new DrawActive(activeBox, width, height, x, y)
        active.render();
      }

      renderCanvas(e);
    });
  }
  if (currentAction !== 'active') {
    if(!range(event)){
      return
    } 
    initCanvas();
    let item = canvasStory[currentSelect]
    switch (currentAction) {
      case 'leftTop':
        item.width = item.width + (item.x + canvasLeft - event.pageX) >= 10 ? item.width + (item.x + canvasLeft - event.pageX) : 10;
        item.x = event.pageX - canvasLeft
        item.height = item.height + (item.y + canvasTop - event.pageY) >= 10 ? item.height + (item.y + canvasTop - event.pageY) : 10;
        item.y = event.pageY - canvasTop
        break;
      case 'top':
        item.height = item.height + (item.y + canvasTop - event.pageY) >= 10 ? item.height + (item.y + canvasTop - event.pageY) : 10;
        item.y = event.pageY - canvasTop
        break;
      case 'rightTop':
        item.width = event.pageX - item.x - canvasLeft < 10 ? 10 : event.pageX - item.x - canvasLeft
        item.height = item.height + (item.y + canvasTop - event.pageY) >= 10 ? item.height + (item.y + canvasTop - event.pageY) : 10;
        item.y = event.pageY - canvasTop
        break;
      case 'left':
        item.width = item.width + (item.x + canvasLeft - event.pageX) >= 10 ? item.width + (item.x + canvasLeft - event.pageX) : 10;
        item.x = event.pageX - canvasLeft
        break;
      case 'right':
        item.width = event.pageX - item.x - canvasLeft < 10 ? 10 : event.pageX - item.x - canvasLeft
        break;
      case 'leftBottom':
        item.width = item.width + (item.x + canvasLeft - event.pageX) >= 10 ? item.width + (item.x + canvasLeft - event.pageX) : 10;
        item.x = event.pageX - canvasLeft
        item.height = event.pageY - item.y - canvasTop < 10 ? 10 : event.pageY - item.y - canvasTop
        break;
      case 'bottom':
        // item.height= item.y+item.height>=canvasHeight?canvasHeight-item.y: event.pageY - item.y - canvasTop < 10 ? 10 : event.pageY - item.y - canvasTop
        item.height=  event.pageY - item.y - canvasTop < 10 ? 10 : event.pageY - item.y - canvasTop
        break;
      case 'rightBottom':
        item.width = event.pageX - item.x - canvasLeft < 10 ? 10 : event.pageX - item.x - canvasLeft
        item.height = event.pageY - item.y - canvasTop < 10 ? 10 : event.pageY - item.y - canvasTop
        break;
    }
    canvasStory.forEach((e) => {
      if (e.hover) {
        const {
          width,
          height,
          y,
          x
        } = e
        const active = new DrawActive(activeBox, width, height, x, y)
        active.render();
      }
      renderCanvas(e);
    });
  }
}

function mouseOut() {
  touchStart = false
}

function range(event) {
  const canvasRangeMinX = canvasLeft
  const canvasRangeMaxX = canvasLeft + canvas.width
  const canvasRangeMinY = canvasTop
  const canvasRangeMaxY = canvasTop + canvas.height
  const atCanvasRangeX = event.pageX >= canvasRangeMinX && event.pageX <= canvasRangeMaxX
  const atCanvasRangeY = event.pageY >= canvasRangeMinY && event.pageY <= canvasRangeMaxY
  return atCanvasRangeX && atCanvasRangeY
}
// 监听鼠标点击
function onmousedown(event) {
  const tag = event.target.dataset.tag
  const arRange = range(event);
  touchStartX = event.pageX
  touchStartY = event.pageY
  // 记录当前的行为
  currentAction = tag
  if (arRange && event.target.dataset.tag === 'active') {
    touchStart = true

    // 记录鼠标点击时距离点击元素的边距
    touchOffsetX = event.offsetX
    touchOffsetY = event.offsetY
  }
}
// 监听鼠标抬起
function onmouseup() {
  if (touchStart) {
    touchStart = false
  }
  currentAction = 'active'
}
// 鼠标点击
function mouseClick(event) {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  // 记录下hover 的对象并初始化所有内容
  initCanvas();
  const activeIndex = new RecordActiveIndex(canvasStory, mouseX, mouseY)
  currentHover = activeIndex.record()
  if (currentHover > -1 && canvasStory.length > 0) {
    canvasStory[currentHover].hover = true;
  }
  // if (currentSelect > -1) {
  //   canvasStory[currentSelect].hover = true;
  // }
  if (currentHover > -1 && canvasStory.length) {
    // 点击后将被点击的移动至最上层
    const current = canvasStory.splice(currentHover, 1);
    canvasStory.push(current[0]);
    currentSelect = canvasStory.length - 1;
    initCanvas();
  } else {
    const active = new DrawActive(activeBox, 0, 0, 0, 0, 'none')
    active.render();
  }
  canvasStory.forEach((e) => {
    if (e.hover) {
      const {
        width,
        height,
        y,
        x
      } = e
      const active = new DrawActive(activeBox, width, height, x, y)
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

function upload(e){
  const file = e.target.files[0]
  if(typeof FileReader==='function'){
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = (event)=>{
      var base64File = event.target.result
      const img = new Image()
      img.src = base64File
      img.onload = ()=>{
         imgSrc = img
        // initCanvas(img)
      }
    }
  }

}

addBtn.addEventListener("click", addRect, false);

delBtn.addEventListener("click", deleteFirst, false);

activeBox.addEventListener('mousedown', onmousedown, false)

document.addEventListener("mousemove", mouseMove, false);
document.addEventListener("mouseup", onmouseup, false);
activeBox.addEventListener('mouseup', onmouseup, false)

canvas.addEventListener("click", mouseClick, false);

renderTextBtn.addEventListener("click", renderText, false);

fileEle.addEventListener('change',upload,false)