const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let halfCanvasWidth = canvas.width / 2;
let halfCanvasHeight = canvas.height / 2;

const depth = 5;
const startPoint = {
  x: halfCanvasWidth,
  y: halfCanvasHeight,
};
const size = 200;
const zoom = 10;

const gui = new dat.GUI();

const settings = {
  size,
  depth,
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
gui.add(settings, "depth", 1, 10).step(1).onChange(draw);
gui.add(settings, "k", 0.4, 0.5).step(0.001).onChange(draw);
gui.add(settings, "reset");

function drawOptimizeSquare(x, y, size) {
  if (x + size >= 0 && y + size >= 0 && x <= innerWidth && y <= innerHeight) {
    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
  }
}

function drawFractal({
  x,
  y,
  size,
  depth,
  startDepth,
  k = 0.5,
  sides = "1111",
  offset = {
    x: 1,
    y: 1,
  },
}) {
  if (depth <= 0) return;

  let squareX = x - size * offset.x;
  let squareY = y - size * offset.y;

  drawOptimizeSquare(squareX, squareY, size);

  if (sides.startsWith("1")) {
    drawFractal({
      x: squareX,
      y: squareY,
      size: size * k,
      depth: depth - 1,
      startDepth: depth,
      k,
      sides: "1101",
    });
  }

  if (sides[1] === "1") {
    drawFractal({
      x: squareX + size,
      y: squareY,
      size: size * k,
      depth: depth - 1,
      startDepth,
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
      depth: depth - 1,
      startDepth,
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
      depth: depth - 1,
      startDepth,
      k,
      offset: {
        x: 1,
        y: 0,
      },
      sides: "1011",
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFractal({
    x: settings.startPoint.x + settings.size / 2,
    y: settings.startPoint.y + settings.size / 2,
    size: settings.size,
    depth: settings.depth,
    startDepth: settings.depth,
    k: settings.k,
  });
}

draw();

let isMouseDown = false;
let offsetForDown, offsetForMoving;

addEventListener(
  "wheel",
  _.throttle((e) => {
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
  }, 50)
);

canvas.addEventListener("mousedown", ({ x, y }) => {
  isMouseDown = true;
  offsetForDown = {
    x: settings.startPoint.x - x,
    y: settings.startPoint.y - y,
  };
});

canvas.addEventListener("mouseup", () => (isMouseDown = false));
canvas.addEventListener(
  "mousemove",
  _.throttle(({ x, y }) => {
    if (isMouseDown) {
      settings.startPoint.x = x + offsetForDown.x;
      settings.startPoint.y = y + offsetForDown.y;
      draw();
    }

    offsetForMoving = {
      x: x,
      y: y,
    };
  }, 20)
);

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  draw();
});
