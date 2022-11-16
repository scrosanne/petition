// C A N V A S

let canvas,
    ctx,
    flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

let x = "white",
    y = 2;

function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    var dataURL = canvas.toDataURL();

    canvas.addEventListener(
        "mousemove",
        function (e) {
            findxy("move", e);
            document.getElementById("signature").value = dataURL;
        },
        false
    );
    canvas.addEventListener(
        "mousedown",
        function (e) {
            findxy("down", e);
        },
        false
    );
    canvas.addEventListener(
        "mouseup",
        function (e) {
            findxy("up", e);
            dataURL = canvas.toDataURL();
            document.getElementById("signature").value = dataURL;
        },
        false
    );
    canvas.addEventListener(
        "mouseout",
        function (e) {
            findxy("out", e);
        },
        false
    );
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function findxy(res, e) {
    if (res == "down") {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == "up" || res == "out") {
        flag = false;
    }
    if (res == "move") {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

init();
