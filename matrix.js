/*  matrix.js
    @Author Vincent J. Valentin
    @email vincentj*valentin->gmail
    @Date 2/13/21
    @Version 1.3.2.1.5.x.superserial.0914y2k experimental nightly build
    @License I don't care v4.1 - I don't care what you do with this code. Use it, steal it, 
    sell it, change it, make fun of it, print it out and use it for arts and crafts projects, 
    use it to make yourself feel better. Just don't sue me if it becomes sentient and takes 
    over your home automation system and your house tries to kill you. You've been warned!

    This is a utility program for developing your own pictures and fonts for an 8x8 LED Matrix. 
    It will print out the values in binary and hex, in a format that should allow you to just 
    copy and paste it into your sketch. It's ugly, and the code is messy, but it works, and it's free, 
    so I guess everything cancels out and this was a complete waste of time. */

let txaBin = document.getElementById("txaBin");     // Binary textarea
let txaHex = document.getElementById("txaHex");     // Hex textarea
let cvs = document.getElementById("cvsMatrix");
let ctx = cvs.getContext("2d");

let RED = "#BB0000";
let WHITE = "#DDDDDD";      
let bitWidth = 30.25;       // Width & Height of each square
let bitHeight = 30.25;

let matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]];

function writeBinString() {
    /* Write the string of binary digits for each row to the txaBin textarea.
       Add a comma to the end of each row except the last one. */
    let binString = "";
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            binString += matrix[i][j];
        }
        if (i < 7) binString += ",\n"
    }

    txaBin.innerHTML = binString;
}

function writeHexString() {
    /* Write the hexadecimal string to the txaHex textarea.
       Include the 0x prefix, and if it's a single digit, 
       (i.e. 0x1), pad it with a leading 0 (0x01) for neater 
       output. Also, comma separate the list. */
    let hexString = "";
    let hexByte = "";
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            hexByte += matrix[i][j];
        }
        hexVal = parseInt(hexByte, 2).toString(16).toUpperCase();
        if (hexVal.length == 1) hexVal = "0" + hexVal; // Force feed that 0 padding
        hexString += "0x" + hexVal;
        if (i < 7) hexString += ", ";
        hexByte = "";
    }

    txaHex.innerHTML = hexString;
}

function drawCircle(x, y, color) {
    /* Draw a circle... pretty obvious. Some magic numbers but meh. */
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function clearMatrix(fill=false) {
    /* Clear or fill the matrix. I didn't want to call it clearOrFillMatrix, 
       so I just repurposed the clearMatrix function with a sneaky little 
       flag that can be ignored if it's going to be used for it's original 
       purpose, or set to true to fill the matrix. */
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            matrix[i][j] = fill ? 1 : 0;
        }
    }

    /* More magic numbers. It works, I don't care. */
    for (let i = 16; i <= 226; i += 30) {
        for (let j = 16; j <= 226; j += 30) {
            drawCircle(i, j, fill ? RED : WHITE);
        }
    }
    writeHexString();
    writeBinString();
}

function invertMatrix() {
    /* If it's 1, make it 0, and vice versa */
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            toggleBit(j, i);
        }
    }
    writeHexString();
    writeBinString();
}

function toggleBit(x, y) {
    /* Toggle a single bit... really these function names are self-documenting! */
    let bit = (matrix[y][x] == 0 ? 1 : 0);
    matrix[y][x] = bit;
    drawCircle((x*30) + 16, (y*30) + 16, (bit == 0 ? WHITE : RED));
    writeBinString();
    writeHexString();
}

function clickBit(canvas, evt) {
    /* Clicking a bit toggles it, so find the x,y coords of the bit you click and call toggleBit(x, y) */
    let rect = canvas.getBoundingClientRect();
    /* the squares are about 32x32. As long as you're within the square you can toggle the bit */
    let x = Math.floor((evt.clientX - rect.left) / 32);
    let y = Math.floor((evt.clientY - rect.top) / 32);
    toggleBit(x, y);
}

/* Event handlers. I really don't understand this but it works so whatever. */
document.getElementById("btnClear").addEventListener("click", function() {clearMatrix()}, false);
document.getElementById("btnFill").addEventListener("click", function() {clearMatrix(true)}, false);
document.getElementById("btnInvert").addEventListener("click", function() {invertMatrix()}, false);
cvs.addEventListener("click", function(evt) {clickBit(cvs, evt)}, false);

/* Start with a blank matrix, ready for your 64-bit masterpiece */
clearMatrix();
writeBinString();
writeHexString();





