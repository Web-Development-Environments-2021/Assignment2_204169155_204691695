var context;
var shape = new Object();
var board,ghostboard;
var score = 0;
var pac_color;
var start_time, gametime;
var time_elapsed;
var interval, intervalGhosts, intervalCookie;
var cookie_eaten = false;

var ghosts_num ,balls_num, balls_eaten=0;
var point5C,point15C,point25C;
var pos=0.15;
var maxScore;
var ghosts_speed
var canvasWidth, canvasHeight, dynamicSize;
var BOARD_HEIGHT = 20;
var BOARD_WIDTH = 19;
var pacman_remain = 5;
var optional_speed = [450,350,300,250]

// load sounds
var die = new Audio('./assets/sounds/die.mp3');
var eat = new Audio('./assets/sounds/eat-pill.mp3');
var pacmusic = new Audio('./assets/sounds/pacmusic.mp3');
pacmusic.loop = true;

// load images
var wall_image = new Image(60, 45);
wall_image.src = "./assets/wall.png";
var addTimerIcon = new Image();
addTimerIcon.src = "./assets/gameIcons/timerAdd.png";

$(document).ready(function() {
	context = canvas.getContext("2d");
});

// Start a new game from strach
function Start() {
	board = [];
	ghostboard = [];
	pac_color = "#FFFF00";
	pacmusic.volume = 1; 
	die.volume = 1;
  	eat.volume = 1;
	var cnt = 100;
	var food_remain = balls_num? balls_num : 50 ;
	var food5 = Math.floor(food_remain*0.6);
	var food15 = Math.floor(food_remain*0.3);
	var food25 = Math.floor(food_remain*0.1);
	cookie_eaten = false;
	maxScore = food5 * 5 + food15 * 15 + food25 * 25
	pacman_remain = 5;
	canvasWidth = document.getElementById("canvas").width;
    canvasHeight = document.getElementById("canvas").height;
	start_time = new Date();
	
	for (var i = 0; i < BOARD_HEIGHT; i++) {
        board[i] = [];
        ghostboard[i] = [];
    }
	setBoards();	
	setGhostsAndCookie();
	putPacMan();
	setFood(food5,food15,food25);
	setBonusTimer();

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.code] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.code] = false;
		},
		false
	);
	Draw();
	pacmusic.play();
	intervalGhosts = setInterval(UpdateGhostsLocation, optional_speed[ghosts_speed-1]);
	intervalCookie = setInterval(updateCookieLocation,400)
	interval = setInterval(UpdatePosition, 250);
}

// Draw a current position
function Draw() {
	canvas.width = canvas.width; //clean board
	$("#lblScore").html(score);
	$("#lblTime").html(gametime - Math.floor(time_elapsed));
	$("#lblBallsLeft").html(balls_num - balls_eaten);
	for(var i = 0; i< 5; i++){
		if(i<pacman_remain){
			$("#heart" + i).attr("src", "./assets/gameIcons/heart.png");
		}

		else{
			$("#heart" + i).attr("src", "./assets/gameIcons/emptyHeart.png");
		}
	}
	for (var i = 0; i < BOARD_HEIGHT; i++) {
		for (var j = 0; j < BOARD_WIDTH; j++) {
			var center = new Object();
			center.x = i * 55 + 30;
			center.y = j * 55 + 30;
			
			// Pacman
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, pos * Math.PI, (pos + 1.7) * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if (pos===1.65 || pos === 0.65)
					context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
				else 
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();

			// Walls
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 25, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
				context.drawImage(wall_image, center.x - 23, center.y -25, 55, 55);
				
			// Balls
			} else if (board[i][j] == 5) {
				putBalls(center.x, center.y, 5);	

			} else if (board[i][j] == 15) {
				putBalls(center.x, center.y, 15);

			} else if (board[i][j] == 25) {
				putBalls(center.x, center.y, 25);
			}
		
			// Timer Bonus
			else if(board[i][j] == 3 && (gametime-time_elapsed) < 30){
			 	context.drawImage(addTimerIcon, center.x - 17 , center.y - 20 ,0.7 * (canvasWidth / 20),0.7 * (canvasHeight / 20));
			}

			// Ghosts
			if (ghostboard[i][j] === dict.red_g)
				DrawGhost(center.x, center.y, "red");
            else if (ghostboard[i][j] === dict.yellow_g)
				DrawGhost(center.x, center.y, "yellow");
            else if (ghostboard[i][j] === dict.blue_g)
				DrawGhost(center.x, center.y, "blue");
            else if (ghostboard[i][j] === dict.pink_g)
				DrawGhost(center.x, center.y, "pink");
			// Cookie
			if (ghostboard[i][j] === dict.cookie)
				context.drawImage(cookie, center.x-17, center.y -20,0.7 * (canvasWidth / 20),0.7 * (canvasHeight / 20));
		}
	}
}

// update the ghosts positions
function UpdateGhostsPosition(){
	if(CollisionsChecker()){
		collission();
	}

	if (pacman_remain==0){
		finish("fault");
	}
	
	if (time_elapsed>gametime){
		finish("time");
	}
	else {
		Draw();
	}
}

// update the pacman position
function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	//PacMan Moves
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < BOARD_WIDTH - 1 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < BOARD_HEIGHT - 1 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	//Balls eating
	if(board[shape.i][shape.j] == 5){
		score += 5;
		balls_eaten++;
		pacmusic.volume = 0.1;
		eat.play();
		setTimeout(function(){ 
			pacmusic.volume = 1; 
			}, 500)
	}
	if(board[shape.i][shape.j] == 15){
		score += 15;
		balls_eaten++;
		pacmusic.volume = 0.1;
		eat.play();
		setTimeout(function(){ 
			pacmusic.volume = 1; 
			}, 500)
	}
	if(board[shape.i][shape.j] == 25){
		score += 25;
		balls_eaten++;
		pacmusic.volume = 0.3;
		eat.play();
		setTimeout(function(){ 
			pacmusic.volume = 1; 
			}, 500)
	}

	// Time base position (time bunos)
	if(board[shape.i][shape.j] == 3 && (gametime-time_elapsed)<30){
		gametime = +gametime + 30;
	}

	// fixed the pacman position
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	
	if (score >= 100 && time_elapsed <= 10) {
		pac_color = "green";
	}

	if (score == maxScore) {
		finish("time");
	}
	// cookie 
	if (cookie_pos.i == shape.i && cookie_pos.j == shape.j && !cookie_eaten){
		score+=50;
		pacmusic.volume = 0.3;
		//cookie_music.play();
		setTimeout(function(){ 
			pacmusic.volume = 1; 
			}, 500)
		cookie_eaten = true;
	}

	if(CollisionsChecker())
		collission();

  	if (pacman_remain==0){
		finish("fault");
	}
	if(time_elapsed>gametime){
		finish("time");
	}
	else {
		Draw();
	}
}

// game is over (msg - reason)
function finish(msg){
	window.clearInterval(interval);
	window.clearInterval(intervalGhosts);
	var alertMsg;
	switch(msg){
		case "fault": alertMsg = score + ", Loser!"; break;
		case "time": alertMsg = score < 100? "You are better than "+score+" points!" : score + ", Winner!!!"; break;
		case "win": alertMsg = score + ", Winner!!!"; break;
	}
	alert(alertMsg);
	StopBackMusic();
}

// finding an empty cell randomly
function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * (BOARD_HEIGHT-1)+1);
	var j = Math.floor(Math.random() * (BOARD_WIDTH-1)+1);
	while (board[i][j] != 0) { // add ghostboard[i][j] != 0 when finish
		i = Math.floor(Math.random() * (BOARD_HEIGHT-1)+1);
		j = Math.floor(Math.random() * (BOARD_WIDTH-1)+1);
	}
	return [i, j];
}

// get the key pressed and fixing pacman's eating position
function GetKeyPressed() {
	if (keysDown[key_up]) {
		pos=1.65
		return 1;
	}
	if (keysDown[key_down]) {
		pos = 0.65;
		return 2;
	}
	if (keysDown[key_left]) {
		pos=1.15
		return 3;
	}
	if (keysDown[key_right]) {
		pos = 0.15;
		return 4;
	}
}

// put a ball in a given position
function putBalls(x_center, y_center, value){
	context.beginPath();
	if (value == 5) context.fillStyle = point5C;
	if (value == 15) context.fillStyle = point15C;
	if (value == 25) context.fillStyle = point25C;
	context.strokeStyle = "black";
	context.font = "30px";
	context.lineWidth = 10;
	context.arc(x_center, y_center, 15, 0, 2 * Math.PI); // circle
	context.fill();
	context.beginPath();
	context.fillStyle = "black";
	if (value == 5) context.fillText("5", x_center - 5 , y_center + 3);
	if (value == 15) context.fillText("15", x_center - 5 , y_center + 3);
	if (value == 25) context.fillText("25", x_center - 5 , y_center + 3);
	context.fill();
};

// locationg the timer bonus on the board
function setBonusTimer(){
	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = dict.addTimer;
}

// locationg the food (balls) on the board
function setFood(food5,food15,food25){
	while (food5 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = dict.p5;
		food5--;
	}

	while (food15 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = dict.p15;
		food15--;
	}

	while (food25 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = dict.p25;
		food25--;
	} 
}

// locating the pacman on the board
function putPacMan() {
    var emptyCell;
    var redDist = 0, blueDist = 0, pinkDist = 0, yellowDist = 0;

	if(shape.i != null){
		board[shape.i][shape.j] = 0 ;
	}

    while (redDist < 4 || blueDist < 4 || pinkDist < 4 || yellowDist < 4) {
        emptyCell = findRandomEmptyCell(board);
        redDist = manhattanDist(0, 0, emptyCell[0], emptyCell[1] );
		blueDist = (ghosts_num > 1) ? manhattanDist(0, BOARD_WIDTH-1 , emptyCell[0], emptyCell[1] ) : 5 ;
        yellowDist = (ghosts_num > 2) ? manhattanDist( BOARD_HEIGHT - 1, 0 , emptyCell[0], emptyCell[1] ) : 5 ;
        pinkDist = (ghosts_num > 3) ? manhattanDist( BOARD_HEIGHT - 1, BOARD_WIDTH-1 , emptyCell[0], emptyCell[1] ) : 5 ;
    }

    board[emptyCell[0]][emptyCell[1]] = dict.PacMan;
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
}

 // handle with collision between the pacman and the ghosts
 function collission(){
  pacmusic.volume = 0.1;
	die.play();
	setTimeout(function(){ 
		pacmusic.volume = 1; 
	}, 1000)
	pacman_remain--;
	score -= 10;
	clearGhosts();
	setGhostsAndCookie();
	putPacMan();
	Draw();
}