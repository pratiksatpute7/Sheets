class Entry {
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }
}

let cellWidth = 100;
let cellHeight = 25;

let noCols = parseInt(prompt("Enter number of cols"));
//let noCols = 100;

let width = noCols * cellWidth;
let noRows = parseInt(prompt("Enter number of rows"));
//let noRows = 100;
let height = noRows * cellHeight;

let c2 = document.getElementById("cols");
c2.width = width.toString();
c2.height = 25;
let ctx2 = c2.getContext("2d");

let c1 = document.getElementById("rows");
c1.width = cellWidth.toString();
c1.height = height.toString();
let ctx1 = c1.getContext("2d");

let c = document.getElementById("myCanvas");
c.width = width.toString();
c.height = height.toString();
let ctx = c.getContext("2d");
ctx.font = "15px Arial";

//Create rows for row number and add number
function renderRowName() {
  let start = cellHeight;
  for (let i = 0; i < noRows; i++) {
    ctx1.moveTo(0, start);
    ctx1.lineTo(width, start);
    ctx1.stroke();
    start += cellHeight;
  }
  start = cellHeight;
  ctx1.font = "15px Arial";
  for (let i = 0; i < noRows; i++) {
    ctx1.fillText(i, cellWidth * 0.45, start - cellHeight / 3);
    start += cellHeight;
  }
}

//Create cols for col names and add names
function renderColName() {
  start = cellWidth;
  for (let i = 0; i < noCols; i++) {
    ctx2.moveTo(start, 0);
    ctx2.lineTo(start, height);
    ctx2.stroke();
    start += cellWidth;
  }

  start = cellWidth;
  ctx2.font = "15px Arial";
  let startName = "";
  for (let i = 0; i < noRows; i++) {
    startName = nextString(startName);
    ctx2.fillText(startName, start - cellWidth * 0.55, cellHeight / 1.5);
    start += cellWidth;
  }
}

//Create initial grid
function createGrid() {
  let start = cellHeight;
  for (let i = 0; i < noRows; i++) {
    ctx.moveTo(0, start);
    ctx.lineTo(width, start);
    ctx.stroke();
    start += cellHeight;
  }
  start = cellWidth;
  for (let i = 0; i < noCols; i++) {
    ctx.moveTo(start, 0);
    ctx.lineTo(start, height);
    ctx.stroke();
    start += cellWidth;
  }
}
createGrid();
renderColName();
renderRowName();

// Stores current elemete id
let state = {};

//Stores data of cells
let data = {};

//function to calculate postion textarea

function calcPos(event) {
  let posX = Math.floor((event.pageX - 100) / cellWidth);
  let posY = Math.floor((event.pageY - 25) / cellHeight);
  let x = Math.floor((event.pageX - 100) / cellWidth) * cellWidth;
  let y = Math.floor((event.pageY - 25) / cellHeight) * cellHeight;
  let id = posY.toString() + "-" + posX.toString();
  console.log(posX, posY, x, y, id);
  return [posX, posY, x, y, id];
}

document.getElementById("myCanvas").addEventListener("dblclick", (event) => {
  let [posX, posY, x, y, id] = calcPos(event);
  let markup = `<textarea
      id="${id}"
      style="
        display: block;
        position: absolute;
        left: ${x + 100}px;
        top: ${y + 25}px;
        width: ${cellWidth}px;
        height: ${cellHeight}px;
        border: 1px dashed rgb(85, 85, 85);
        outline: gray;
      "
      cols="40"
      rows="5"
    ></textarea>`;
  if (data[id]) {
    // let [x, y] = data[id].id.split("-");
    let text = data[id].value;
    document.getElementById("text-box").insertAdjacentHTML("beforeend", markup);
    state.currentCell = id;
    document.getElementById(state.currentCell).value = text;
  } else {
    //ctx.fillText("Hello World", x + 75, y + 25);
    document.getElementById("text-box").insertAdjacentHTML("beforeend", markup);
    state.currentCell = id;
    //console.log(state.currentCell);
  }
});

document.getElementById("myCanvas").addEventListener("click", (event) => {
  if (state.currentCell) {
    let text = document.getElementById(state.currentCell).value;

    let [y, x] = state.currentCell.split("-");
    if (text) {
      data[state.currentCell] = new Entry(state.currentCell, text);
    }
    // data[state.currentCell] = { id: state.currentCell, value: text };
    ctx.clearRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    createGrid();
    if (text.length > 10) {
      ctx.fillText(
        `${text.slice(0, 11)}...`,
        x * cellWidth + 5,
        y * cellHeight + cellHeight / 1.5
      );
    } else {
      ctx.fillText(text, x * cellWidth + 5, y * cellHeight + cellHeight / 1.5);
    }

    state.currentCell = "";
    console.log(data);
    document.getElementById("text-box").innerHTML = "";
  }
});

// Column name generator
function nextString(str) {
  if (!str) return "A"; // return 'A' if str is empty or null

  let tail = "";
  let i = str.length - 1;
  let char = str[i];
  // find the index of the first character from the right that is not a 'Z'
  while (char === "Z" && i > 0) {
    i--;
    char = str[i];
    tail = "A" + tail; // tail contains a string of 'A'
  }
  if (char === "Z")
    // the string was made only of 'Z'
    return "AA" + tail;
  // increment the character that was not a 'Z'
  return str.slice(0, i) + String.fromCharCode(char.charCodeAt(0) + 1) + tail;
}
