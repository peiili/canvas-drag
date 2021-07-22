const canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')

var window_width = window.innerWidth
var window_height = window.innerHeight
canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = '#ff8'

context.fillRect(0 ,0,100,100);
context.fillStyle="red"
context.fillRect(200 ,0,100,100);

// 绘制大圆
context.beginPath()
context.strokeStyle = 'red' 
context.lineWidth = '2'
context.arc(100,200,100,0,Math.PI*2,false)
context.stroke() 
context.closePath()

// 绘制小圆
context.beginPath()
context.strokeStyle = 'blue' 
context.lineWidth = '5'
context.arc(100,200,50,0,Math.PI*2,false)
context.stroke() 
context.closePath()
