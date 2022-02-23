const socket = io("http://localhost:5500");
var radius;
var c;
let usersMouse = [];
function setup() {
  createCanvas(window.screen.width - 100, window.screen.height - 300);
  createP();
  slider = createSlider(1, 20, 10);
  eraser = createButton("clear");
  eraser.mousePressed(changeBG);
  checkbox = createCheckbox("Erase", false);
  c = color(255, 0, 0);
  background(255);
  colorMode(RGB);
  createColorPickerHandle();
  socket.on("connect", () => {
    console.log("we are connected to the server");
  });
  myUser = {
    XPos: 0,
    YPos: 0,
    PXPos: 0,
    PYPos: 0,
    Slider: 0,
    RGB: [0, 0, 0, 0],
    name: prompt("Name for your battleship?"),
  };
  usersMouse.push(myUser);
  socket.on("Clientmouse", (data) => {
    //see if ship already exists
    let bs = usersMouse.filter((d) => d.name == data.name);

    if (bs.length == 0) {
      //if a new ship, create a new one
      usersMouse.push(data);
    } else {
      //if exists, then update its data
      bs[0].XPos = data.XPos;
      bs[0].YPos = data.YPos;
      bs[0].PXPos = data.PXPos;
      bs[0].PYPos = data.PYPos;
      bs[0].Slider = data.Slider;
      bs[0].RGB = data.RGB;
    }

    console.log(data.RGB);
    noStroke();
    // fill(data.RGB);
    // rect(data.XPos, data.YPos, data.Slider, data.Slider);
    stroke(data.RGB);
    strokeWeight(data.Slider);
    line(data.XPos, data.YPos, data.PXPos, data.PYPos);
  });
}

function draw() {
  radius = slider.value();
  /*
  if (mouseIsPressed && mouseX<400) {
    for (y = 0; y < height; y++) {
      for (x = 0; x < width-50; x++) {
        var distance = dist(x, y, mouseX, mouseY);
        if (distance < radius) {
          set(x,y, c);
        }
      }
    }
  }
      updatePixels()
  */
}

function mouseClicked() {
  if (mouseX > 400) {
    c = get(mouseX, mouseY);
    checkbox.checked(false);
  } else {
    stampRectangle(c);
  }
}

function mouseDragged() {
  if (checkbox.checked()) {
    stroke(255);
  } else {
    stroke(c);
  }
  if (mouseX < window.screen.width - 300) {
    strokeWeight(slider.value());
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
  //   let data = {
  //     XPos: mouseX,
  //     YPos: mouseY,
  //     PXPos: pmouseX,
  //     PYPos: pmouseY,
  //     Slider: slider.value(),
  //     RGB: c,
  //   };
  myUser.XPos = mouseX;
  myUser.YPos = mouseY;
  myUser.PXPos = pmouseX;
  myUser.PYPos = pmouseY;
  myUser.Slider = slider.value();
  myUser.RGB = c;
  socket.emit("Clientmouse", myUser);
}

function changeBG() {
  background(255);
  createColorPickerHandle();
}

function createColorPickerHandle() {
  colorPicker = createImage(100, height);
  var myWidth = colorPicker.width / 3;
  colorPicker.loadPixels();
  from = color(0, 255, 0);
  to = color(255, 0, 0);
  console.log(hue(from));
  for (var y = 0; y < height; y++) {
    for (x = 0; x < myWidth; x++) {
      color1 = lerpColor(from, to, y / height);
      colorPicker.set(x, y, color1);
    }
  }
  from = color(0, 0, 255);
  to = color(0, 255, 0);
  console.log(hue(from));
  for (var y = 0; y < height; y++) {
    for (x = myWidth; x < myWidth * 2; x++) {
      color1 = lerpColor(from, to, y / height);
      colorPicker.set(x, y, color1);
    }
  }
  from = color(255, 0, 0);
  to = color(0, 255, 255);
  console.log(hue(from));
  for (var y = 0; y < height; y++) {
    for (x = myWidth * 2; x < myWidth * 3; x++) {
      color1 = lerpColor(from, to, y / height);
      colorPicker.set(x, y, color1);
    }
  }
  colorPicker.updatePixels();
  image(colorPicker, window.screen.width - 300, 0);
}

function stampRectangle(c) {
  fill(c);
  noStroke();
  rect(mouseX, mouseY, slider.value(), slider.value());
}

function eraserSwitch() {
  //
}
