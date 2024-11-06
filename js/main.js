'use strict'
// Global variables
const canvas = document.querySelector('canvas'),
   toolBtns = document.querySelectorAll('.tool'),
   fillColor = document.querySelector('#fill-color'),
   sizeSlider = document.querySelector('#size-slider'),
   colorBtns = document.querySelectorAll('.colors .option'),
   colorPicker = document.querySelector('#color-picker'),
   clearBtn = document.querySelector('.clear-canvas'),
   saveImgBtn = document.querySelector('.save-img')

// Variables
let context = canvas.getContext("2d"),
   isDrawing = false,
   brushWidth = 5,
   selectedTool = 'brush',
   prevMouseX,
   prevMouseY,
   snapshot,
   selectedColor = '#000'

// set canvas background
const setCanvasBg = () => {
   context.fillStyle = '#fff'
   context.fillRect(0, 0, canvas.width, canvas.height)
   context.fillStyle = selectedColor
}


// set canvas width and height
window.addEventListener('load', () => {
   canvas.width = canvas.offsetWidth
   canvas.height = canvas.offsetHeight
   setCanvasBg()
})

// startDrawing
const startDraw = (e) => {
   isDrawing = true
   prevMouseX = e.offsetX
   prevMouseY = e.offsetY
   context.beginPath()
   context.lineWidth = brushWidth
   context.strokeStyle = selectedColor
   context.fillStyle = selectedColor
   snapshot = context.getImageData(0, 0, canvas.width, canvas.height)
}

// stopDrawing
const stopDraw = () => {
   isDrawing = false
}

// drawingRectangle
const drawRectangle = (e) => {
   fillColor.checked ? context.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY) : context.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

// drawingCircle
const drawCircle = (e) => {
   context.beginPath()
   const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2))
   context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
   fillColor.checked ? context.fill() : context.stroke()
}

// drawingTriangle

const drawTriangle = (e) => {
   context.beginPath()
   context.moveTo(prevMouseX, prevMouseY)
   context.lineTo(e.offsetX, e.offsetY)
   context.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
   context.closePath()
   context.stroke()
   fillColor.checked ? context.fill() : context.stroke()
}

// Drawing
const drawing = (e) => {
   if (!isDrawing) return
   context.putImageData(snapshot, 0, 0)

   if (selectedTool == 'brush' || selectedTool == 'ereaser') {
      context.strokeStyle = selectedTool == 'ereaser' ? '#fff' : selectedColor
      context.lineTo(e.offsetX, e.offsetY)
      context.stroke()

   }

   switch (selectedTool) {
      case 'circle':
         drawCircle(e)
         break;
      case 'rectangle':
         drawRectangle(e)
         break
      case 'triangle':
         drawTriangle(e)
         break
      case 'ereaser':
         const isEreaser = selectedTool == 'ereaser' ? '#fff' : selectedTool
         context.strokeStyle = isEreaser
         break
      default:
         break;
   }
}

// changing brush width
sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value)

// tools btn
toolBtns.forEach(btn => {
   btn.addEventListener('click', () => {
      document.querySelector('.options .active').classList.remove('active')
      btn.classList.add('active')
      selectedTool = btn.id
   })
})

// set color from color picker
colorPicker.addEventListener('change', () => {
   colorPicker.parentElement.style.background = colorPicker.value
   colorPicker.parentElement.click()
})


// set colors to shapes
colorBtns.forEach(btn => {
   btn.addEventListener('click', (e) => {
      document.querySelector('.options .selected').classList.remove('selected')
      btn.classList.add('selected')
      const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
      selectedColor = bgColor
   })
})


// clear canvas btn
clearBtn.addEventListener('click', () => {
   context.clearRect(0, 0, canvas.width, canvas.height)
   setCanvasBg()
})

// save img btn
saveImgBtn.addEventListener('click', () => {
   const link = document.createElement('a')
   link.download = `Shox paint ${Date.now()}.jpg`
   link.href = canvas.toDataURL()
   link.click()
})

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mouseup', stopDraw)
canvas.addEventListener('mousemove', drawing)
