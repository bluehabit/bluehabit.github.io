//future ideas for improvments
//-add timer
//-prompt user and ask if they would like to provide custom url
//to image
//-somesort of API integration that takes a random instagram
//image or something

var canvas = document.getElementById('myCanvas');
var stage = canvas.getContext('2d');
var gameInProgress;
//move gameInProgress to Init? 
var startGameButton = document.getElementById('startButton');

var mouse;
var mouseDown;

var userPieceSameAsHover;

//This logs which index we are currently at
var hoverIndex;
var currentIndex; 

var puzzle = {
    width: null,
    height: null,
    difficulty: 4,

    pieceWidth: null,
    pieceHeight: null,

    pieces: [],
    totalPieces: null,

    currentPiece: null,
    hoverCoordinates: null
}

var puzzleImage = document.createElement('img');

initPuzzleState();

function initPuzzleState() {
    mouse = { x: 0, y: 0 };
    userPieceSameAsHover = false;
    gameInProgress = false;
    puzzle.currentPiece = null;

    puzzleImage.src = 'toejam.jpg';
    puzzleImage.addEventListener('load', initCanvas);

    startGameButton.innerHTML = 'Start';

    if(!gameInProgress){
    	startGameButton.addEventListener('click', startNewGame);
    } else {
 		initPuzzleState();
    }
}

function initCanvas() {
    setCanvasDimensions();
    pieceDimensions();
    buildCanvas();
}

function setCanvasDimensions() {
    puzzle.width = puzzleImage.width;
    puzzle.height = puzzleImage.height;

    canvas.width = puzzle.width;
    canvas.height = puzzle.height;
}

function pieceDimensions() {
    puzzle.pieceWidth = Math.floor(puzzle.width / puzzle.difficulty);
    puzzle.pieceHeight = Math.floor(puzzle.height / puzzle.difficulty);

    puzzle.totalPieces = puzzle.difficulty * puzzle.difficulty;
}

function buildCanvas() {
    // stage.drawImage(puzzleImage, 0, 0)
    stage.drawImage(puzzleImage, 0, 0, puzzle.width, puzzle.height, 0, 0, puzzle.width, puzzle.height);
    canvas.style.border = '1px solid #2a2a2a';
}


function startNewGame() {
    puzzle.pieces = [];

    buildPieces();
    assemblePuzzle();

	startGameButton.innerHTML = 're-shuffle?';
    gameInProgress = true;

    // if(!puzzle.currentPiece){
    // 	 canvas.addEventListener('click', pieceGrabbed);
    // }
    // canvas.addEventListener('click', swapPieces)
    // canvas.addEventListener('click', pieceGrabbed);
    // canvas.addEventListener('mousemove', updatePuzzle);
    // canvas.addEventListener('mouseup', pieceDropped);
}

function drawPuzzle(){

}

//generate pieces inside puzzle.pieces 
function buildPieces() {

    //sx and sy only (source image)
    var piece;

    var sxPos = 0;
    var syPos = 0;

    for (var i = 0; i < puzzle.totalPieces; i++) {
        piece = {};
        piece.sx = sxPos;
        piece.sy = syPos;
        piece.name = i;

        sxPos += puzzle.pieceWidth;

       if (sxPos >= puzzle.width) {
            sxPos = 0;
            syPos += puzzle.pieceHeight;
        }
        puzzle.pieces.push(piece);
    }
}

function assemblePuzzle(){

    // if(gameInProgress === false){
        puzzle.pieces = shuffleArray(puzzle.pieces);
        //drawing the pieces to the canvass, dx and dy only
        var dxPos = 0;
        var dyPos = 0;

        for(var i = 0; i < puzzle.pieces.length; i++){      

            puzzle.pieces[i].dx = dxPos;
            puzzle.pieces[i].dy = dyPos;

            puzzle.pieces[i].cellX =  Math.floor(puzzle.pieces[i].dx / puzzle.pieceWidth) + 1;
            puzzle.pieces[i].cellY =  Math.floor(puzzle.pieces[i].dy / puzzle.pieceHeight) + 1;

            stage.drawImage(puzzleImage, puzzle.pieces[i].sx, puzzle.pieces[i].sy, puzzle.pieceWidth, puzzle.pieceHeight, dxPos, dyPos, puzzle.pieceWidth, puzzle.pieceHeight);
            stage.strokeRect(dxPos, dyPos, puzzle.pieceWidth, puzzle.pieceHeight);
            
            dxPos += puzzle.pieceWidth;

            if(dxPos >= puzzle.width){
                dxPos = 0;
                dyPos += puzzle.pieceHeight; 
            }

        }
        gameInProgress = true;
    
  	canvas.addEventListener('click', toggleState);
  	canvas.addEventListener('click', pieceGrabbed);
}

function toggleState(){
	if(!puzzle.currentPiece){
    	canvas.addEventListener('click', pieceGrabbed);  
    } else {
    	canvas.removeEventListener('click',pieceGrabbed);
    }
}

function pieceGrabbed(e) {
	//in the if condition below, the userPieceSameAsHover is a flag 
	//variable this is important to check becuase if you click where
	//the hover is, the hover and click become the same piece
	//that is why the selected piece should only change
	//on a specific condition

	if(!userPieceSameAsHover){
	// if(puzzle.currentPiece === null){
		var selectedPiece;

	    mouse.x = e.clientX;
	    mouse.y = e.clientY;

	    puzzle.currentPiece = getCoordinates(mouse.x, mouse.y);

	    //this part of the loop is only logging onc
	    for (var i = 0; i < puzzle.pieces.length; i++) {
	        if (puzzle.currentPiece[0] === puzzle.pieces[i].cellX && puzzle.currentPiece[1] === puzzle.pieces[i].cellY) {
	            selectedPiece = puzzle.pieces[i];
	            currentIndex = i;
	            console.log(currentIndex)
	        }
	    }

	    puzzle.currentPiece = selectedPiece;
	    console.log(puzzle.currentPiece);
	    console.log(' ^ puzzle.currentPiece');

	    if(puzzle.currentPiece){
	     canvas.addEventListener('mousemove', updatePuzzle);
	     canvas.addEventListener('click', swapPieces);
	    } else {
	    	return
	    }
	// }
	}		
}

function updatePuzzle(e){

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    //replace later with function call 
    var dxPos = 0;
    var dyPos = 0;

        for(var i = 0; i < puzzle.pieces.length; i++){      
            puzzle.pieces[i].dx = dxPos;
            puzzle.pieces[i].dy = dyPos;

            puzzle.pieces[i].cellX =  Math.floor(puzzle.pieces[i].dx / puzzle.pieceWidth) + 1;
            puzzle.pieces[i].cellY =  Math.floor(puzzle.pieces[i].dy / puzzle.pieceHeight) + 1;

            stage.drawImage(puzzleImage, puzzle.pieces[i].sx, puzzle.pieces[i].sy, puzzle.pieceWidth, puzzle.pieceHeight, dxPos, dyPos, puzzle.pieceWidth, puzzle.pieceHeight);
            stage.strokeRect(dxPos, dyPos, puzzle.pieceWidth, puzzle.pieceHeight);
            
            dxPos += puzzle.pieceWidth;

            if(dxPos >= puzzle.width){
                dxPos = 0;
                dyPos += puzzle.pieceHeight; 
            }
        }
    //    

    ///////
    //draw piece at users mouse

    ///user selected puzzle piece

    if(puzzle.currentPiece){
	   	stage.globalAlpha = .75;

		stage.drawImage(puzzleImage, puzzle.currentPiece.sx, puzzle.currentPiece.sy, puzzle.pieceWidth, puzzle.pieceHeight, mouse.x - (puzzle.pieceWidth / 2), mouse.y - (puzzle.pieceHeight / 2), puzzle.pieceWidth,  puzzle.pieceHeight);
		stage.strokeRect( mouse.x - (puzzle.pieceWidth / 2), mouse.y - (puzzle.pieceHeight / 2), puzzle.pieceWidth, puzzle.pieceHeight);

		puzzle.hoverCoordinates = getCoordinates(mouse.x, mouse.y);
		  

		highlightPiece()
    } else {
    	return
    }
 }

 function highlightPiece(){

	 var hoverPiece = {};
	 hoverPiece.cellX = puzzle.hoverCoordinates[0];
	 hoverPiece.cellY = puzzle.hoverCoordinates[1]; 

 	for(var i = 0; i < puzzle.pieces.length; i++){
 		if(hoverPiece.cellX === puzzle.pieces[i].cellX && hoverPiece.cellY === puzzle.pieces[i].cellY){
 			stage.fillStyle = 'blue';
        	stage.globalAlpha = .4;
        	stage.fillRect(puzzle.pieces[i].dx, puzzle.pieces[i].dy, puzzle.pieceWidth, puzzle.pieceHeight);
 			
 			hoverIndex = i;
 		}
 	}
 }

 function swapPieces(e){

 	//very important piece below
 	//checks to make sure that the user has the current piece
 	//before redrawing the board, this lead to quite a large
 	//headache I had to fix 

 	if(puzzle.currentPiece){

 	var x = currentIndex;
 	//0
 	var y = hoverIndex;
 	//1
 	
 	// console.log(currentIndex + ' ' + hoverIndex)

 	var xObject = puzzle.pieces[x];
 	//Object {sx: 160, sy: 84, name: 6, dx: 0, dy: 0…}

 	var yObject = puzzle.pieces[y];
 	// Object {sx: 320, sy: 252, name: 15, dx: 160, dy: 0…}

 	//for this swap function to work the index of the array
 	//and the object at the array index must be saved to
 	//their own variables

 	puzzle.pieces[x] = yObject;
 	puzzle.pieces[y] = xObject;

 	var dxPos = 0;
    var dyPos = 0;

        for(var i = 0; i < puzzle.pieces.length; i++){      

            puzzle.pieces[i].dx = dxPos;
            puzzle.pieces[i].dy = dyPos;

            puzzle.pieces[i].cellX =  Math.floor(puzzle.pieces[i].dx / puzzle.pieceWidth) + 1;
            puzzle.pieces[i].cellY =  Math.floor(puzzle.pieces[i].dy / puzzle.pieceHeight) + 1;

            stage.drawImage(puzzleImage, puzzle.pieces[i].sx, puzzle.pieces[i].sy, puzzle.pieceWidth, puzzle.pieceHeight, dxPos, dyPos, puzzle.pieceWidth, puzzle.pieceHeight);
            stage.strokeRect(dxPos, dyPos, puzzle.pieceWidth, puzzle.pieceHeight);
            
            dxPos += puzzle.pieceWidth;

            if(dxPos >= puzzle.width){
                dxPos = 0;
                dyPos += puzzle.pieceHeight; 
            }

        }

    // puzzle.currentPiece = null;
    checkWin();

 	}
 }	

function checkWin(){
	var win = true;

	for(var i = 0; i < puzzle.pieces.length; i++){
		if(puzzle.pieces[i].name !== i){
			win = false;
		}
	}
	
	if(win){
		alert('you win');
		startGameButton.innerHTML = 'Start new Game?';
	}

	puzzle.currentPiece = null;
    toggleState();

} 

function shuffleArray(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getCoordinates(xCor, yCor) {
    var newCoord = [];

    var newX = Math.floor(xCor / puzzle.pieceWidth) + 1; //160
    newCoord.push(newX)

    var newY = Math.floor(yCor / puzzle.pieceHeight) + 1; //84
    newCoord.push(newY)

    return newCoord;
}




