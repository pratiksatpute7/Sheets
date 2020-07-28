class Entry {
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }
}
let offX = 0;
let offY = 0;
let cellWidth = 100;
let cellHeight = 25;

// let noCols = parseInt(prompt("Enter number of cols"));
let noCols = 50;
let width = noCols * cellWidth;

// let noRows = parseInt(prompt("Enter number of rows"));
let noRows = 50;
let height = noRows * cellHeight;

let c = document.getElementById("myCanvas");
c.width = width.toString();
c.height = height.toString();
let ctx = c.getContext("2d");
ctx.font = "15px Arial";

//Create rows for row number and add number
function renderRowName() {
  start = 2 * cellHeight;
  ctx.font = "15px Arial";
  for (let i = 0; i < noRows; i++) {
    ctx.fillText(i, cellWidth * 0.45, start - cellHeight / 3);
    start += cellHeight;
  }
}

//Create cols for col names and add names
function renderColName() {
  start = 2 * cellWidth;
  ctx.font = "15px Arial";
  let startName = "";
  for (let i = 0; i < noRows; i++) {
    startName = nextString(startName);
    ctx.fillText(startName, start - cellWidth * 0.55, cellHeight / 1.5);
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

//Clear cell
function clearCell(x, y) {
  ctx.clearRect(
    x * cellWidth + cellWidth,
    y * cellHeight + cellHeight,
    cellWidth,
    cellHeight
  );
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
  let posX = Math.floor((event.offsetX - cellWidth) / cellWidth);
  let posY = Math.floor((event.offsetY - cellHeight) / cellHeight);
  let x = Math.floor((event.pageX - offX) / cellWidth) * cellWidth;
  let y = Math.floor((event.pageY - offY) / cellHeight) * cellHeight;
  let id = posY.toString() + "-" + posX.toString();

  return [posX, posY, x, y, id];
}

document.getElementById("myCanvas").addEventListener("dblclick", (event) => {
  let [posX, posY, x, y, id] = calcPos(event);
  console.log(x, y);
  if (posX >= 0 && posY >= 0) {
    let markup = `<textarea
      id="${id}"
      style="
        display: block;
        position: absolute;
        left: ${x + offX}px;
        top: ${y + offY}px;
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
      document
        .getElementById("text-box")
        .insertAdjacentHTML("beforeend", markup);
      state.currentCell = id;
      document.getElementById(state.currentCell).value = text;
    } else {
      //ctx.fillText("Hello World", x + 75, y + 25);
      document
        .getElementById("text-box")
        .insertAdjacentHTML("beforeend", markup);
      state.currentCell = id;
      //console.log(state.currentCell);
    }
  }
});

document.getElementById("myCanvas").addEventListener("click", (event) => {
  removeTextBox();
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

//Calculate scroll offset

document.getElementById("over").onscroll = function (e) {
  removeTextBox();
  offX = cellWidth - e.target.scrollLeft;
  offY = cellHeight - e.target.scrollTop;
};

//IF text box
function removeTextBox() {
  if (state.currentCell) {
    let text = document.getElementById(state.currentCell).value;

    let [y, x] = state.currentCell.split("-");
    if (text) {
      data[state.currentCell] = new Entry(state.currentCell, text);
      clearCell(x, y);
      createGrid();
      if (text.length > 10) {
        ctx.fillText(
          `${text.slice(0, 11)}...`,
          x * cellWidth + cellWidth + 5,
          y * cellHeight + cellHeight + cellHeight / 1.5
        );
      } else {
        ctx.fillText(
          text,
          x * cellWidth + cellWidth + 5,
          y * cellHeight + cellHeight + cellHeight / 1.5
        );
      }
    } else {
      clearCell(x, y);
      createGrid();
      delete data[state.currentCell];
    }
    state.currentCell = "";
    console.log(data);
    document.getElementById("text-box").innerHTML = "";
  }
}
