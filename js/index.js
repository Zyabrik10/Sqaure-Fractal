// SQUARE-FRACTAL

/*
    This project is made by @Zyabrik10
    github: https://github.com/Zyabrik10/
    linkedin: https://www.linkedin.com/in/alexander-mazurok-jfd/
*/

// P.S.: You can do whatever you want with this project as long as it remains non-commercial

let canvas, ctx; // will be initialized in window on load

// canvas.width / 2, canvas.height / 2
let halfCanvasWidth, halfCanvasHeight; // will be initialized in window on load

/*
  - "startPoint" is an object which contains coordinates used to draw the first parent square

  - "settings" is an object which contains dependencies for all app and GUI
*/
let startPoint, settings; // will be initialized in window on load

let mouse = {
  downOffset: { x: 0, y: 0 }, // is used in canvas mousedown
  isDown: false, // is used in canvas mousedown, mouseup, mousemove
};

// default values for entire app
const currentDepth = 5;
const size = 200; // defined size of root square, is used in settings and on wheel event for zoom in and out effect
const zoom = 10; // strength of zooming (+- 10px to the size of root square per wheel)

// When the square we want to draw is not in our sight (viewport), it won't be drawn
function drawOptimizedSquare(x, y, size) {
  /*
    x + size >= 0 && y + size >= 0:
    x + size -> right side of square
    y + size -> bottom side of square

    If x square coordinate (top right by default) plus size of square (x + size, wich gives us top left) is bigger than or equal to zero (x + size >= 0) and the same check applies for y coordinate.
    Basically with this check, we make sure that right and bottom sides are present in the viewport.

    x <= innerWidth && y <= innerHeight:
    x -> left side of square
    y -> top side of square

    The same check applies for left and top sides, where we check if main x and y square coordinates are less than or equal to the width and height of the viewport (if top and left sides of square are present in the viewport)
  */
  if (x + size >= 0 && y + size >= 0 && x <= innerWidth && y <= innerHeight) {
    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
  }
}

// Main recursive function that makes calculations, where and when to allow drawing a square, before actually drawing
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
  /*
    - We don't need to draw infinite squares, but only as much as we want.

    - currentDepth is just a counter which represents a depth (where we are right now) in each square and when we draw a new corner square in the current square.

    - The new square takes a new counter currentDepth decreased by one.

    - Each square has its own currentDepth.
  */
  if (currentDepth <= 0) return;

  /*
    - "x" and "y" are coordinates that represent the top left corner of each parent square (if we are talking about the first square then we can assume that we build it according to its parent square(just pass our imaginary square params)).

    - "size" is the size of the current square which has been calculated depending on the parent size when the parent square decided that this corner square will be drawn.
  */

  /*
    - Offset is an object which has two properties: x and y.

    - These two properties can have only two numbers 0 or 1.

    - They are coefficients for the child square to draw them properly in the corner.
  */

  /*
    Basically, we do simple math/dependencies.

    Corner square offset will be provided by hardcoding:
    1 1 - left top corner
    0 1 - right top corner
    0 0 - right bottom corner
    1 0 - left bottom corner

    This offset is used in main offset calculation size * offset.
    It determines whether we make left, right, or no offset according to parent square coordinates for the corner square to put in the right corner place.

    Let's say our parent square has such coordinates -> x = 0, y = 0 and its size: 100px

    To make the left top corner square we need to determine its coordinates accordingly:

    __- top left square | child square
   |__|____
      |    |
      |____| - parent square

    squareX = 0 - 100 * 1 = -100
    squareY = 0 - 100 * 1 = -100

    To make the right top corner square we need to determine its coordinates accordingly -> x = 0 + 100, y = 0 (so our calculation will be according to the right top corner of the parent square):
          __
     ____|__| - top right square | child square
    |    |
    |____| - parent square

    squareX = 100 - 100 * 0 = 100
    squareY = 0 - 100 * 1 = -100

    To make the right bottom corner square we need to determine its coordinates accordingly -> x = 0 + 100, y = 0 + 100 (so our calculation will be according to the right bottom corner of the parent square):
     ____
    |    | - parent square
    |____|__
         |__| - bottom right square | child square

    squareX = 100 - 100 * 0 = 100
    squareY = 100 - 100 * 0 = 100

    To make the left bottom corner square we need to determine its coordinates accordingly -> x = 0, y = 0 + 100 (so our calculation will be according to the left bottom corner of the parent square):
       ____
      |    | - parent square
    __|____|
   |__| - bottom left square | child square

    squareX = 0 - 100 * 1 = -100
    squareY = 100 - 100 * 0 = 100
  */
  let squareX = x - size * offset.x;
  let squareY = y - size * offset.y;

  drawOptimizedSquare(squareX, squareY, size);

  /*
    We don't want to spend time calculating square coordinates and drawing those we won't see.

    __ - top left square
   |__|____
      |__| | - this square inside, we don't need it
      |____|

          __
     ____|__| - top right square
    | |__| - this square inside, we don't need it
    |____|

     ____
    |  __| - this square inside, we don't need it
    |_|__|__
         |__| - bottom right square

       ____
      |__  |
    __|__|_| - this square inside, we don't need it
   |__| - bottom left square

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
  */

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

// This function is supposed to redraw the fractal every time the user zooms in/out or moves the fractal
// First time is called when the window is loaded
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

// Keeps the size of the canvas up, so it looks good
// It is called when viewport resized
function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  draw();
}

function mouseDownHandle({ x, y }) {
  mouse.isDown = true;
  mouse.downOffset = {
    x: settings.startPoint.x - x,
    y: settings.startPoint.y - y,
  };
}

function mouseUpHandle() {
  mouse.isDown = false;
}

function mouseMoveHandle({ x, y }) {
  if (mouse.isDown) {
    settings.startPoint.x = x + mouse.downOffset.x;
    settings.startPoint.y = y + mouse.downOffset.y;
    draw();
  }
}

// Long story short. All we do here is just increasing the size of the root square and move it with offset, to make a zoom in/out effect
function wheelHandle(e) {
  const { deltaY, offsetX: x, offsetY: y } = e;

  const scaleFactor = settings.size / size; // define how much the default size is bigger or smaller than our current size

  let zoomChange = settings.zoom * (deltaY > 0 ? -1 : 1); // define if we scale fractal up or down
  let newSize = settings.size + zoomChange; // calculate new size of fractals depending on zoomChange

  if (newSize < 50) {
    // We don't want to make our size so small, so we can't see it
    newSize = 50;
  }

  const newScaleFactor = newSize / size; // now we calculate how much the default size is bigger or smaller than our current size

  const mouseOffset = {
    // thanks to this offset we can make a zoom-in effect where we point
    x: x - settings.startPoint.x,
    y: y - settings.startPoint.y,
  };

  // now we set new coordinates based on offset and size
  settings.startPoint.x += mouseOffset.x * (1 - newScaleFactor / scaleFactor);
  settings.startPoint.y += mouseOffset.y * (1 - newScaleFactor / scaleFactor);

  settings.size = newSize;
  settings.zoom += deltaY > 0 ? -10 : 10;
  draw();
}

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

  canvas.addEventListener("mousedown", mouseDownHandle);

  canvas.addEventListener("mouseup", mouseUpHandle);

  canvas.addEventListener("mousemove", _.throttle(mouseMoveHandle, 20));

  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("wheel", _.throttle(wheelHandle, 50));
}

window.addEventListener("load", windowOnLoad);
