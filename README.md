# Square Fractal

Good morning to you. Let me introduce my simple but marvelous project. It is a fractal and as the name of projects says, it is The Fractal that consists of squares. Pretty charming I would say. You can observe the fractal just by draging it around and zooming it in or out. You are also able to increase or decrease depth of the fractal from level 1 to level 10, where 1 and 10 are minimum and maximum depth of the fractal. Why 1 and 11? Well, 0 depth level means you don't have any squares and 10 is maximum of depth of squares wich can quickly been redraw by my algorythm.

## About my work

I want to share my projects with people and also share how I did this explaning every spect of my project. So everyone can understand how it works. It will improve my skills to work with documentation as well.

So, belove you will encounter an explation of code I wrote. It can be improved (explation and code itself), so feel free to share you opnion and experiance with me [Zyabrik10@gmail.com](Zyabrik10@gmail.com).

All explanation are also presented in code.

## Demo

Have a fun. Hope you will enjoy it: [Demo link](https://zyabrik10.github.io/Sqaure-Fractal/)

## How it works?

### Global variables

Will be initialized in window on load

```js
let canvas, ctx;
```

---

canvas.width / 2, canvas.height / 2
Will be initialized in window on load

```js
let halfCanvasWidth, halfCanvasHeight;
```

---

"startPoint" is an object which contains coordinates used to draw the first parent square

"settings" is an object which contains dependencies for all app and GUI

Will be initialized in window on load

```js
let startPoint, settings;
```

---

downOffset - is used in canvas mousedown
isDown - is used in canvas mousedown, mouseup, mousemove

```js
let mouse = {
  downOffset: { x: 0, y: 0 },
  isDown: false,
};
```

---

Default values for entire app

currentDepth - defines what depth of fractal will be. For example: 5 means it will 5 squares in a row in depth.
size - defines size of root square, is used in settings and on wheel event for zoom in and out effect.
zoom - strength of zooming (+- 10px to the size of root square per wheel)

```js
const currentDepth = 5;
const size = 200;
const zoom = 10;
```

#### Code preview

```js
let canvas, ctx;

let halfCanvasWidth, halfCanvasHeight;

let startPoint, settings;

let mouse = {
  downOffset: { x: 0, y: 0 },
  isDown: false,
};

const currentDepth = 5;
const size = 200;
const zoom = 10;
```

### Functions and what they do

#### drawOptimizedSquare(x, y, size)

drawOptimizedSquare() is called in drawFractal() function

To use ctx function fillRect, we need to pass in it four parameters. x, y, width and height of rectangle we want to draw.

```js
ctx.fillRect(x, y, width, height);
```

We want to draw a square so width and height are equal and transform into parameter size.

When the square we want to draw is not in our sight (viewport), it won't be drawn and vice versa.

1. ```js
   x + size >= 0 && y + size >= 0;
   x + size; // -> right side of square
   y + size; // -> bottom side of square
   ```

   If x square coordinate (top right by default) plus size of square (x + size, wich gives us top left) is bigger than or equal to zero (x + size >= 0) and the same check applies for y coordinate.

   Basically with this check, we make sure that right and bottom sides are present in the viewport

2. ```js
   x <= innerWidth && y <= innerHeight:
   x; // -> left side of square
   y; // -> top side of square
   ```

   If x square coordinate (top right by default) plus size of square (x + size, wich gives us top left) is bigger than or equal to zero (x + size >= 0) and the same check applies for y coordinate.
   Basically with this check, we make sure that right and bottom sides are present in the viewport.

##### Function preview

```js
function drawOptimizedSquare(x, y, size) {
  if (x + size >= 0 && y + size >= 0 && x <= innerWidth && y <= innerHeight) {
    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
  }
}
```

#### drawFractal()

Main recursive function that makes calculations, where and when to allow drawing a square, before actually drawing.

Key thoughts:

- We don't need to draw infinite squares, but only as much as we want.
- currentDepth is just a counter which represents a depth (where we are right now) in each square and when we draw a new corner square in the current square.
- The new square takes a new counter currentDepth decreased by one.
- Each square has its own currentDepth.

Parameters explanation:

- "x" and "y" are coordinates that represent the top left corner of each parent square (if we are talking about the first square then we can assume that we build it according to its parent square(just pass our imaginary square params)).
- "size" is the size of the current square which has been calculated depending on the parent size when the parent square decided that this corner square will be drawn.
- Offset is an object which has two properties: x and y.

  - These two properties can have only two numbers 0 or 1.
  - They are coefficients for the child square to draw them properly in the corner.

Basically, we do simple math/dependencies.

Corner square offset will be provided by hardcoding:
1 1 - left top corner
0 1 - right top corner
0 0 - right bottom corner
1 0 - left bottom corner

This offset is used in main offset calculation size \* offset.
It determines whether we make left, right, or no offset according to parent square coordinates for the corner square to put in the right corner place.

Let's say our parent square has such coordinates -> x = 0, y = 0 and its size: 100px

To make the left top corner square we need to determine its coordinates accordingly:

```txt
 __- top left square | child square
|__|____
   |    |
   |____| - parent square
```

```js
squareX = 0 - 100 * 1 = -100
squareY = 0 - 100 * 1 = -100
```

To make the right top corner square we need to determine its coordinates accordingly -> x = 0 + 100, y = 0 (so our calculation will be according to the right top corner of the parent square):

```txt
      __
 ____|__| - top right square | child square
|    |
|____| - parent square
```

```js
squareX = 100 - 100 * 0 = 100
squareY = 0 - 100 * 1 = -100
```

To make the right bottom corner square we need to determine its coordinates accordingly -> x = 0 + 100, y = 0 + 100 (so our calculation will be according to the right bottom corner of the parent square):

```txt
 ____
|    | - parent square
|____|__
     |__| - bottom right square | child square
```

```js
squareX = 100 - 100 * 0 = 100
squareY = 100 - 100 * 0 = 100
```

To make the left bottom corner square we need to determine its coordinates accordingly -> x = 0, y = 0 + 100 (so our calculation will be according to the left bottom corner of the parent square):

```txt
    ____
   |    | - parent square
 __|____|
|__| - bottom left square | child square
```

```js
squareX = 0 - 100 * 1 = -100
squareY = 100 - 100 * 0 = 100
```

We don't want to spend time calculating square coordinates and drawing those we won't see.

```txt
 __ - top left square
|__|____
   |__| | - this square inside, we don't need it
   |____|
```

```txt
      __
 ____|__| - top right square
| |__| - this square inside, we don't need it
|____|
```

```txt
 ____
|  __| - this square inside, we don't need it
|_|__|__
     |__| - bottom right square
```

```txt
    ____
   |__  |
 __|__|_| - this square inside, we don't need it
|__| - bottom left square
```

So we need to somehow determine what sides and where we need and vice versa.

- For the top left square we don't need to draw the bottom right square
- For the top right square we don't need to draw the bottom left square
- For the bottom left square we don't need to draw the top right square
- For the bottom right square we don't need to draw the top left square

sides: "1111"

1111 - all corners have squares
1110 - without the bottom left square
1101 - without the bottom right square
1011 - without the top right square
0111 - without the top left square

1 - we calculate and draw the child square
0 - we don't calculate and draw the child square

##### Function preview

```js
function drawFractal({
  x,
  y,
  size,
  currentDepth,
  k = 0.5,
  sides = "1111",
  offset = {
    x: 1,
    y: 1,
  },
}) {
  if (currentDepth <= 0) return;

  let squareX = x - size * offset.x;
  let squareY = y - size * offset.y;

  drawOptimizedSquare(squareX, squareY, size);

  if (sides.startsWith("1")) {
    drawFractal({
      x: squareX,
      y: squareY,
      size: size * k,
      currentDepth: currentDepth - 1,
      k,
      sides: "1101",
    });
  }

  if (sides[1] === "1") {
    drawFractal({
      x: squareX + size,
      y: squareY,
      size: size * k,
      currentDepth: currentDepth - 1,
      k,
      offset: {
        x: 0,
        y: 1,
      },
      sides: "1110",
    });
  }

  if (sides[2] === "1") {
    drawFractal({
      x: squareX + size,
      y: squareY + size,
      size: size * k,
      currentDepth: currentDepth - 1,
      k,
      offset: {
        x: 0,
        y: 0,
      },
      sides: "0111",
    });
  }

  if (sides.endsWith("1")) {
    drawFractal({
      x: squareX,
      y: squareY + size,
      size: size * k,
      currentDepth: currentDepth - 1,
      k,
      offset: {
        x: 1,
        y: 0,
      },
      sides: "1011",
    });
  }
}
```

#### draw()

draw() is supposed to redraw the fractal every time the user zooms in/out or moves the fractal by clearing canvas with ctx and calling drawFractal() (drawFractal called in draw fucntion and it is the root of all squares drown).

First time is called when the window is loaded.

##### Function preview

```js
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFractal({
    x: settings.startPoint.x + settings.size / 2,
    y: settings.startPoint.y + settings.size / 2,
    size: settings.size,
    currentDepth: settings.currentDepth,
    k: settings.k,
  });
}
```

#### resizeCanvas()

Keeps the size of the canvas up, so it looks good
It is called when viewport resized

First time is called when the window is loaded.

We apply new size of viewport to canvas and then call draw function.
It will clear canvas and redraw fractals again.

##### Function preview

```js
function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  draw();
}

window.addEventListener("resize", resizeCanvas);
```

#### windowOnLoad()

windowOnLoad() is just a function wich is bieng called when window is loaded and it sets up the whole project: init canvas, GUI, call draw() function, sets up window event like: mousemove, mousedown, mouseup, mousewheel.

##### Function preview

```js
function windowOnLoad() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  halfCanvasWidth = canvas.width / 2;
  halfCanvasHeight = canvas.height / 2;

  startPoint = {
    x: halfCanvasWidth,
    y: halfCanvasHeight,
  };

  settings = {
    size,
    currentDepth,
    startPoint: {
      x: startPoint.x,
      y: startPoint.y,
    },
    k: 0.5,
    zoom,
    reset: function () {
      this.size = size;
      this.startPoint.x = startPoint.x;
      this.startPoint.y = startPoint.y;
      draw();
    },
  };

  // setting up GUI so we can modify our fractal
  const gui = new dat.GUI();

  gui.add(settings, "currentDepth", 1, 10).step(1).onChange(draw);
  gui.add(settings, "k", 0.4, 0.5).step(0.001).onChange(draw);
  gui.add(settings, "reset");

  draw();

  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("mousedown", mouseDownHandle);

  canvas.addEventListener("mouseup", mouseUpHandle);

  canvas.addEventListener("mousemove", _.throttle(mouseMoveHandle, 20));

  window.addEventListener("wheel", _.throttle(wheelHandle, 50));
}
```

#### mouseDownHandle()

We need to know exectly when our mouse is down, so we need some variables wich helps us to track mouse state.

Global object mouse is there for it. It has all properties that we need to track for our mouse.

We set mouse.isDown to true in onmousedown event and set it to false in onmouseup event.

The second thing we set is mouse down offset.

We substrcut root square position at the beginning and current mouse down position.

If we make root square position as the same as mouse position, we won't be able to drag the fractal, because we won't be able to save the previous root square position. That is why we need offset. We simply add mouse down offset to mouse position so now the fractal stays in the same position until we move mouse.

##### Function preview

```js
function mouseDownHandle({ x, y }) {
  mouse.isDown = true;
  mouse.downOffset = {
    x: settings.startPoint.x - x,
    y: settings.startPoint.y - y,
  };
}
```

#### mouseUpHandle()

In this function we say that mouse is no longer down and set mouse.isDown to false.

##### Function preview

```js
function mouseUpHandle() {
  mouse.isDown = false;
}
```

#### mouseMoveHandle()

Update root square position based on downOffset and redraw the fractal.

##### Function preview

```js
function mouseMoveHandle({ x, y }) {
  if (mouse.isDown) {
    settings.startPoint.x = x + mouse.downOffset.x;
    settings.startPoint.y = y + mouse.downOffset.y;
    draw();
  }
}
```

#### wheelHandle()

Long story short. All we do here is just increasing the size of the root square and move it with offset, to make a zoom in/out effect.

scaleFactor defines how much the default size is bigger or smaller than our current size

```js
const scaleFactor = settings.size / size;
```

zoomChange defines if we scale fractal up or down

```js
let zoomChange = settings.zoom * (deltaY > 0 ? -1 : 1);
```

New size of the fractal is bieng calculated depending on zoomChange.

```js
let newSize = settings.size + zoomChange;
```

We don't want to make our size so small, so we can't see it.
I decied by observing that size shouldn't be less than 50 pixels.

```js
if (newSize < 50) {
  newSize = 50;
}
```

Here, we calculate how much the default size is bigger or smaller than our current size

```js
const newScaleFactor = newSize / size;
```

Thanks to this offset we can make a zoom-in effect where we point.

```js
const mouseOffset = {
  x: x - settings.startPoint.x,
  y: y - settings.startPoint.y,
};
```

Now we set new coordinates based on offset and size

```js
settings.startPoint.x += mouseOffset.x * (1 - newScaleFactor / scaleFactor);
settings.startPoint.y += mouseOffset.y * (1 - newScaleFactor / scaleFactor);
```

And afetr this we just apply new size, new zoom and redraw the fractal.

##### Function preview

```js
function wheelHandle(e) {
  const { deltaY, offsetX: x, offsetY: y } = e;

  const scaleFactor = settings.size / size;

  let zoomChange = settings.zoom * (deltaY > 0 ? -1 : 1);
  let newSize = settings.size + zoomChange;

  if (newSize < 50) {
    newSize = 50;
  }

  const newScaleFactor = newSize / size;

  const mouseOffset = {
    x: x - settings.startPoint.x,
    y: y - settings.startPoint.y,
  };

  settings.startPoint.x += mouseOffset.x * (1 - newScaleFactor / scaleFactor);
  settings.startPoint.y += mouseOffset.y * (1 - newScaleFactor / scaleFactor);

  settings.size = newSize;
  settings.zoom += deltaY > 0 ? -10 : 10;
  draw();
}
```

### Drawing

For drawing each squares in different depth I use recursion. For recursion function we need to find put what will be the end of its recursion. For this function it is current depth. Then, we need to find out where we wil call this function inside inside this function to make the same calculations but with some changes.

All I do is just pathing in my recursive function:

- depth
- new size that depends on parent size
- coordinates that depend on parent coordinates
- coefficient of scaling that represents how much smaller or bigger will be children squares
- sides that are allowed to be calculated for children squeres
- offset that shows us where to put this child square

The fist square to be drawn in this queue is root square. After that we make calculations if we can call drawFractal again with updated information based on parent square and increasing depth. Then we make calculations again in child square and so on until current depth is our desired depth (max 10).

### Optimization

It is all simple. Squares that are off the sceen are not been drawn.

## Libraries

1. **Lodash.js** - a modern JavaScript utility library for handling mouse events throttling.

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
  integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
```

In order to make window event such as wheel and mouse move more efficient so they use less resources by decresing times they called, I used **`lodash.js`**.

2. **Dat-GUI** - a lightweight graphical user interface for changing variables in the code.

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.min.js"
  type="text/javascript"
></script>
```

In order to have quick and simple user interface, I used **`dat-gui`**.

## Installation

1. Clone the repository:

   ```bash/cmd
   git clone https://github.com/Zyabrik10/square-fractal.git
   ```

2. Navigate to the project directory:

   ```bash/cmd
    cd square-fractal
   ```

3. Open index.html in your favorite web browser (mine is Chrome).

## Controls

- Zoom In/Out: Use the mouse wheel to zoom in and out of the fractal.
- Drag: Click and drag to move around the fractal.

## GUI Parameters

- Current Depth: Adjust the depth of recursion (1-10).
- Scaling Factor (k): Change the scaling factor for the recursive squares (0.4-0.5).
- Reset: Reset the fractal to its initial state.

## Customization

Feel free to customize the fractal parameters and behavior by modifying the settings object and the drawFractal function in the index.js file. Experiment with different scaling factors, depths, and offsets to create unique fractal patterns.

## License

This project is open for non-commercial use. You are free to use, modify, and distribute this code as long as it remains non-commercial and you provied my nickname Zyabrik10. It is cool, isn't it?

## Author

Alexander Mazurok - GitHub | LinkedIn
