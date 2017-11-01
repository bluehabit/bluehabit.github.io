var startPuzzle = document.querySelector('.startPuzzle'),
puzzleSolved = document.querySelector('.puzzleSolved'),
puzzleUnsolved = document.querySelector('.puzzleUnsolved'),
difficultyContainer = document.querySelector('.difficultyContainer'),
heartParent = document.querySelector('.temp'),
nightmareMode;

var puzzlePieces = document.querySelectorAll('.temp > img');
var divContainers = document.querySelectorAll('div.match');
var gameStart;
var myTime;
var originalTime; 

var gameOver = document.querySelector('.modal');
var gameOverText = document.querySelector('.modal > p');
var gameComplete;

var progressBar = document.querySelector('.progress');
var parentProgress = document.querySelector('.parentProgress');
var timeResult = document.querySelector('.time');
var retryButton = document.querySelector('.retry');

var pistol = new Audio('sounds/dspistol.wav'),
vault = new Audio('sounds/vault.mp3'),
btoad = new Audio('sounds/btoad.mp3'),
endSound = new Audio('sounds/continue.mp3');
hoof = new Audio('sounds/dshoof.wav'),
pickup = new Audio('sounds/dsitemup.wav');
hoof.volume = .65;

var uv = document.querySelector('.uv'),
nightmare = document.querySelector('.nightmare');

var hintButton = document.querySelector('.hint'),
resetButton = document.querySelector('.reset');

var totalHints; 

resetButton.addEventListener('click', function(){
	puzzlePieces.forEach(function(piece){
		piece.classList.add('transitionAll')
	})
	initGame();
})

retryButton.addEventListener('click', function(){
	puzzlePieces.forEach(function(piece){
		piece.clicked = false;
	})
	initGame();
})

hintButton.addEventListener('mouseenter', function(){
	if(!nightmareMode){
		puzzleSolved.classList.toggle('hidden');
		puzzleUnsolved.classList.toggle('hidden'); 
	} 

	if(nightmareMode && totalHints != 0){
		totalHints--;
		puzzleSolved.classList.toggle('hidden');
		puzzleUnsolved.classList.toggle('hidden'); 
	} else {
		return;
	}

});

hintButton.addEventListener('mouseout', function(){
	if(!nightmareMode){
		puzzleSolved.classList.toggle('hidden');
		puzzleUnsolved.classList.toggle('hidden'); 
	}  

	if(nightmareMode && totalHints === 0){
		// hintButton.style.border = '2px solid red';
		hintButton.classList.add('noMoreHints')
	}

	if(nightmareMode && totalHints != 0){
		puzzleSolved.classList.toggle('hidden');
		puzzleUnsolved.classList.toggle('hidden'); 
	} else {
		puzzleSolved.classList.add('hidden');
		puzzleUnsolved.classList.remove('hidden'); 
		return;
	}
});

var difficultyButtons = document.querySelectorAll('.difficultyContainer > button')

startPuzzle.addEventListener('click', function(){
	pistol.currentTime = 0;
	pistol.play();
	puzzleSolved.classList.add('hidden');
	puzzleUnsolved.classList.remove('hidden');
	heartParent.classList.remove('hidden');
	generatePieces()
	puzzleSolved.classList.add('fade')
	puzzleUnsolved.classList.add('fadeOut')
	this.classList.add('hidden');
	hintButton.classList.remove('hidden');
	resetButton.classList.remove('hidden');
	parentProgress.classList.remove('hidden');
	timeResult.classList.remove('hidden');

	puzzlePieces.forEach(function(piece){
		piece.classList.add('transitionAll')
	})

	progressBar.style.width = '100%'
	startTimer();

	if(nightmareMode){
		myTime = 210000;
		originalTime = myTime;
	} else {
		myTime = 420000;
		originalTime = myTime;
	}

	gameStart = true;
});

difficultyButtons.forEach(function(button){
	button.addEventListener('mouseenter', function(){
		vault.currentTime = 0; //rewind audio element to the start
		vault.play();
	});

	button.addEventListener('click', function(){
		pistol.currentTime = 0;
		vault.pause();
		pistol.play();
		startPuzzle.classList.remove('hidden');
		difficultyContainer.classList.add('hidden');
	});
});

nightmare.addEventListener('click', function(){
	nightmareMode = true;
	console.log('nightmare mode:', nightmareMode)
});

//if(!nightmare) 

function startTimer(){
	var countDown = setInterval(function(){ 
		myTime = myTime - 1000;
		var displayTime = convertTime(myTime)
		displayTime.seconds = displayTime.seconds.toString();

		if(displayTime.seconds < 10){
			displayTime.seconds = `0${displayTime.seconds}`;
		}

		progressBar.style.width = `${(myTime/originalTime)*100}%`
		timeResult.textContent = `${displayTime.minutes}:${displayTime.seconds}`

		if(!gameStart){
			console.log('Countdown complete')
			timeResult.textContent = '';
			clearInterval(countDown)
		}

		if(gameComplete){
			clearInterval(countDown);
			timeResult.textContent = '';
		}

		if(myTime === 0 ){
			console.log('Game Over')
			timeResult.textContent = '';
			gameOver.classList.remove('hidden');
			gameOverText.textContent = 'Game Over';
			endSound.muted = false;
			endSound.play();
			clearInterval(countDown)
		}


	}, 1000);
}

function convertTime(milliseconds){
	var time = {
		milliseconds: (milliseconds.toFixed(0)%1000),
		seconds: Math.floor((milliseconds/1000)%60),
		minutes: Math.floor((milliseconds/(1000 * 60))),
	};

	return time; 
}


function initGame(){
	puzzleSolved.classList.add('hidden');
	puzzleUnsolved.classList.remove('hidden');
	startPuzzle.classList.add('hidden');
	difficultyContainer.classList.remove('hidden');
	hintButton.classList.add('hidden');
	resetButton.classList.add('hidden');
	hintButton.classList.remove('noMoreHints')
	parentProgress.classList.add('hidden');
	timeResult.classList.add('hidden');
	gameOver.classList.add('hidden');
	endSound.muted = true;
	gameOverText.textContent = ''
	gameComplete = false;

	/*intro animation for puzzle piece shine*/
	puzzlePieces.forEach(function(piece){
		piece.classList.add('transitionAll')
		piece.style.animationFillMode = '';
		piece.style.animation = '';
	})

	myTime = 0;
    originalTime = 0;

	nightmareMode = false;
	totalHints = 3;
	gameStart = false;
	placeBoard();
	console.log('init game')
};


puzzlePieces.forEach(function(piece){
	piece.clicked = false;
	piece.addEventListener('click', selectPiece)
});



function selectPiece(e){
	if(gameStart && !gameComplete){
		var piece = this;
		this.classList.remove('transitionAll')
		this.clicked = !this.clicked
		piece.classList.remove('noShadow');

		puzzlePieces.forEach(function(piece){
			piece.classList.remove('appearOnTop');	
		})

		piece.classList.add('appearOnTop');

		if(this.clicked){
			pickup.play();	
			this.classList.toggle('highZindexValue');
		} else {
			this.classList.toggle('highZindexValue');
		}

		divContainers.forEach(function(container){
			if(checkBoundary(piece, container)){
				lockPiece(piece, container);
				checkWin();
			} 
		});

		resetDivContainers()
		boardState()
	}
}

window.addEventListener('mousemove', function(evt){
	puzzlePieces.forEach(function(piece){
		if(piece.clicked){
			var pieceParent = piece.offsetParent.getBoundingClientRect();
			piece.style.left = evt.clientX - pieceParent.x - 55 + 'px';
			piece.style.top = evt.clientY - pieceParent.y - 55 + 'px';
		} else {
			return;
		}
	})
})


function boardState(){
	divContainers.forEach(function(divContainer){
		puzzlePieces.forEach(function(puzzlePiece){
			if (checkBoundary(puzzlePiece, divContainer)) {
        	divContainer.dataset.occupied = "true";
      		}
		})
	})
}

function resetDivContainers(){
	divContainers.forEach(function(divContainer){
		divContainer.dataset.occupied = "false";
	})
}

function placeBoard(){
	var divBoundary;
	var divParent;

	divContainers.forEach(function(container){
		puzzlePieces.forEach(function(puzzlePiece){
			if(puzzlePiece.dataset.match === container.dataset.match){
				divBoundary = container.getBoundingClientRect();
				divParent = container.offsetParent.getBoundingClientRect(); 

				puzzlePiece.classList.add('noShadow');
				puzzlePiece.style.top = divBoundary.top - divParent.y + 'px';
				puzzlePiece.style.left = divBoundary.left - divParent.x + 'px';
			}
		})
	})
}

function checkBoundary(puzzlePiece, currentDiv){
	var currentDiv = currentDiv;
	var divBoundary = currentDiv.getBoundingClientRect();

	if(between(puzzlePiece.getBoundingClientRect().x, divBoundary.left - 15, divBoundary.right - 55) 
		&& between(puzzlePiece.getBoundingClientRect().y, divBoundary.top - 15, divBoundary.bottom - 85) 
		&& !puzzlePiece.clicked) {	
				return true;
	} else {
		return false;
	}
}

function lockPiece(puzzlePiece, divContainer){
	if(divContainer.dataset.occupied === 'false'){
		var divBoundary = divContainer.getBoundingClientRect();
		var divParent = divContainer.offsetParent.getBoundingClientRect();
		
		puzzlePiece.classList.add('noShadow');
		puzzlePiece.style.top = divBoundary.top - divParent.y + 'px';
		puzzlePiece.style.left = divBoundary.left - divParent.x + 'px';

		hoof.play();
	} else {
		return
	}
}

function between(input, min, max) {
  return input >= min && input <= max;
}

function checkWin(){
	var total = 0;
	divContainers.forEach(function(container){
		puzzlePieces.forEach(function(puzzlePiece){
			if(checkBoundary(puzzlePiece, container) && puzzlePiece.dataset.match === container.dataset.match){
				total++;
			}
		})
	})
	
	if(total === divContainers.length){
		victory();
		timeResult.textContent = '';
		hintButton.classList.add('hidden');
		resetButton.classList.add('hidden');
		gameComplete = true;

		setTimeout(function(){ 
			gameOver.classList.remove('hidden');
			gameOverText.textContent = 'Victory!';
			console.log('you win')
		}, 3400);
	}
}

function victory(){
	btoad.play();
	puzzlePieces.forEach(function(piece){
		piece.style.animation = `slide-out-blurred-top ${makeRandomDecimal(4,15)}s ease`;
		piece.style.animationFillMode = 'forwards';
	})
}

function generatePieces(){
	var babyContainer = document.querySelector('.babyContainer')
	var babyCoordinates = babyContainer.getBoundingClientRect();
	var divParent = babyContainer.offsetParent.getBoundingClientRect();

	puzzlePieces.forEach(function(piece){
		piece.coordinates = makeRandomCoords(babyCoordinates.left - 65, babyCoordinates.right, babyCoordinates.bottom, 
			babyCoordinates.top + 35)

		piece.style.left = piece.coordinates.x - divParent.x + 'px';
		piece.style.top = piece.coordinates.y - divParent.y + 15 + 'px';
	})
}

function makeRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function makeRandomDecimal(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}


function makeRandomCoords(xMin, xMax, yMin, yMax) {
  var coordinates = {}
  coordinates.x = Math.floor(Math.random() * (xMax - xMin) + xMin);
  coordinates.y = Math.floor(Math.random() * (yMax - yMin) + yMin);
  return coordinates; 
}

initGame();
