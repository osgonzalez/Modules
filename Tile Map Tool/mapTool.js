
var canvasWidth = 300;
var canvasHeight = 300;
var canvas, ctx, flag = false;
var currX = 0;
var currY = 0;
dot_flag = false;


var matrix = [];
var matrixHeight = 12;
var matrixWidth = 8;

var mapImage = null;

$(function () {
    initMapTool();

    $('input[type=range]').on('input', function () {
        initMapTool();
    });
 })


 function initMapTool(){
    var container = $("#canvasContainer");

    mapImage = new Image();   // Create new img element
    mapImage.src ="./map.png" // Set source path

    // canvasWidth = Math.round(window.innerWidth * 0.95 ) ;
    // canvasHeight = Math.round(window.innerHeight* 0.9 );

    canvasWidth = mapImage.width ;
    canvasHeight = mapImage.height;

    container.empty();
    container.append(' <canvas id="canvas" width="'+ canvasWidth+'" height="'+ canvasHeight+'" style="border-style: dotted"></canvas>')

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    



    // canvas.addEventListener("mousemove", function (e) {
    //     findxy('move', e)
    // }, false);
    // canvas.addEventListener("mousedown", function (e) {
    //     findxy('down', e)
    // }, false);
    // canvas.addEventListener("mouseup", function (e) {
    //     findxy('up', e)
    // }, false);
    // canvas.addEventListener("mouseout", function (e) {
    //     findxy('out', e)
    // }, false);


    canvas.addEventListener("mousedown", function (e) {
       deleteSelectedSquare(e);
        redrawSquares();
    }, false);

    // canvas.addEventListener("mousemove", function (e) {
    //     deleteSelectedSquare(e);
    //     redrawSquares();
    // }, false);


    //Init Matrix
    matrixHeight = $("#matrixHeight").val();
    matrixWidth = $("#matrixWidth").val();

    for(i=0;i<matrixWidth;i++){
        matrix[i] = [];
        for(j=0;j<matrixHeight;j++){
            matrix[i][j] = true;
        }
    }

    redrawSquares();

}




function redrawSquares(){
    var squareWidth = canvasWidth / matrixWidth ;
    var squareHeight = canvasHeight / matrixHeight ;
    var font = squareWidth < squareHeight? Math.round(squareWidth/2.5) : Math.round(squareHeight/2.5)

    ctx.drawImage(mapImage, 0, 0);

    
    for(i=0;i<matrixWidth;i++){
        for(j=0;j<matrixHeight;j++){
            if(matrix[i][j]){
                ctx.fillStyle = 'rgb(155,155,155)';
                ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.font = i<9? font+ 'px serif':Math.round(font*0.5) + 'px serif' ;
                ctx.fillText(letters[(j%52)] + (i+1), i * squareWidth +(squareWidth/2) - font/2, j * squareHeight + (squareHeight/2) + font/2);
            }
        }
    }

}

function deleteSelectedSquare(e){
    var squareWidth = canvasWidth / matrixWidth ;
    var squareHeight = canvasHeight / matrixHeight ;

    // currX = e.clientX - canvas.offsetLeft;
    // currY = e.clientY - canvas.offsetTop;

    currX = e.pageX - canvas.offsetLeft;
    currY = e.pageY - canvas.offsetTop;

    var posX = Math.floor(currX/squareWidth);
    var posY = Math.floor(currY/squareHeight);


    matrix[posX][posY] = !matrix[posX][posY];
    // matrix[posX][posY] = false;
}



// function findxy(res, e) {
//     if (res == 'down') {
//         currX = e.clientX - canvas.offsetLeft;
//         currY = e.clientY - canvas.offsetTop;

//         flag = true;
//         draw();

//     }
//     if (res == 'up' || res == "out") {
//         flag = false;
//     }
//     if (res == 'move') {
//         if (flag) {
//             currX = e.clientX - canvas.offsetLeft;
//             currY = e.clientY - canvas.offsetTop;
//             draw();
//         }
//     }
// }


var letters =  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
                "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
                "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", 
                "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", 
                "s", "t", "u", "v", "w", "x", "y", "z"];