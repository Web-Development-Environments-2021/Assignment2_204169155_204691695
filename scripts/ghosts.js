var blue_ghost=null,pink_ghost=null,yellow_ghost = null,red_ghost=null;
var blue_ghost_pos=null,pink_ghost_pos=null,yellow_ghost_pos = null, red_ghost_pos=null, cookie_pos=null;
const dict = {
    empty: 0,
    cookie: 1, 
    PacMan: 2,
    addTimer: 3,
    Walls: 4,
    balls: 5,
    red_g: 6,
    yellow_g: 7,
    blue_g: 8,
    pink_g: 9,
    p5: 5,
    p15: 15,
    p25: 25,
};
// load images
var ghost_img_blue = new Image();
ghost_img_blue.src = "assets/ghosts/blue_ghost.gif"
var ghost_img_red = new Image();
ghost_img_red.src = "assets/ghosts/red_ghost.gif"
var ghost_img_yellow = new Image();
ghost_img_yellow.src = "assets/ghosts/yellow_ghost.gif"
var ghost_img_pink = new Image();
ghost_img_pink.src = "assets/ghosts/pink_ghost.gif"
var cookie = new Image();
cookie.src = "assets/cookie.png"

function DrawGhost(x,y,color){
    switch (color) {
        case "red":
            context.drawImage(ghost_img_red, x - 17 , y - 20 ,0.7 * (canvasWidth / 20),0.7 * (canvasHeight / 20));
            break;
        case "blue":
            context.drawImage(ghost_img_blue,x - 17 , y - 20,0.7 * (canvasWidth / 20),0.7 * (canvasHeight / 20));
            break;
        case "yellow":
            context.drawImage(ghost_img_yellow,x - 17 , y - 20 ,0.7 * (canvasWidth / 20),0.7 * (canvasHeight / 20));
            break;
        case "pink":
            context.drawImage(ghost_img_pink,x - 17 , y - 20 ,0.7 * (canvasWidth / 20),0.7 * (canvasHeight / 20));
            break;
    }
}

function clearGhosts(){
    if(red_ghost_pos != null){
        ghostboard[red_ghost_pos.i][red_ghost_pos.j] = 0;
        red_ghost_pos = null;
    }
        
    if(blue_ghost_pos != null){
        ghostboard[blue_ghost_pos.i][blue_ghost_pos.j] = 0;
        blue_ghost_pos = null;
    }
    if(yellow_ghost_pos != null){
        ghostboard[yellow_ghost_pos.i][yellow_ghost_pos.j] = 0;
        yellow_ghost_pos = null;
    }
    if(pink_ghost_pos != null){
        ghostboard[pink_ghost_pos.i][pink_ghost_pos.j] = 0; 
        pink_ghost_pos = null;       
    }
}


function setGhostsAndCookie() {
    //init red ghost
    if(ghosts_num >= 1){
        red_ghost_pos = {};
        ghostboard[0][0] = dict.red_g;
        red_ghost_pos.i = 0;
        red_ghost_pos.j = 0;
    }
    //init blue ghost
    if(ghosts_num >= 2){
        blue_ghost_pos = {};
        ghostboard[0][BOARD_WIDTH-1] = dict.blue_g;
        blue_ghost_pos.i = 0;
        blue_ghost_pos.j = BOARD_WIDTH-1;
    }
    //init yellow ghost
    if(ghosts_num >= 3){
        yellow_ghost_pos = {}
        ghostboard[BOARD_HEIGHT-1][0] = dict.yellow_g;
        yellow_ghost_pos.i = BOARD_HEIGHT - 1;
        yellow_ghost_pos.j = 0;
    }
    //init pink ghost
    if(ghosts_num >= 4){
        pink_ghost_pos = {};
        ghostboard[BOARD_HEIGHT - 1][BOARD_WIDTH-1] = dict.pink_g;
        pink_ghost_pos.i = BOARD_HEIGHT - 1;
        pink_ghost_pos.j = BOARD_WIDTH - 1;
    }
    //init cookie
    if(cookie_pos==null){
        cookie_pos = {}
        ghostboard[10][8] = dict.cookie;
        cookie_pos.i = 10;
        cookie_pos.j = 8;
    }
}

function CollisionsChecker() {
    if (
        red_ghost_pos.i === shape.i &&
        red_ghost_pos.j === shape.j
    ) {
        return true;
    }

    if (
        blue_ghost_pos != null &&
        blue_ghost_pos.i === shape.i &&
        blue_ghost_pos.j === shape.j
    ) {
        return true;
    }

    if (
        pink_ghost_pos != null &&
        pink_ghost_pos.i === shape.i &&
        pink_ghost_pos.j === shape.j
    ) {
        return true;
    }

    if (
        yellow_ghost_pos != null &&
        yellow_ghost_pos.i === shape.i &&
        yellow_ghost_pos.j === shape.j
    ) {
        return true;
    }
}

function updateCookieLocation(){
    if(!cookie_eaten){
        var cookie_new = Explore(cookie_pos.i,cookie_pos.j);
        ghostboard[cookie_pos.i][cookie_pos.j] = 0;
        ghostboard[cookie_new.x][cookie_new.y] = dict.cookie;
        cookie_pos.i = cookie_new.x;
        cookie_pos.j = cookie_new.y;
    } else ghostboard[cookie_pos.i][cookie_pos.j] = 0;
}
function UpdateGhostsLocation(){
    var red,blue,yellow,pink,alpha;
    alpha = Math.random();
    red = (alpha <= 0.25 ) ? Explore(red_ghost_pos.i,red_ghost_pos.j) : PathToPac(red_ghost_pos.i,red_ghost_pos.j);
    //delete old location
    ghostboard[red_ghost_pos.i][red_ghost_pos.j] = 0;
    //update new location
    ghostboard[red.x][red.y] = dict.red_g;
    //update ghost params
    red_ghost_pos.i = red.x;
    red_ghost_pos.j = red.y;

    if(blue_ghost_pos!= null){
        alphe = Math.random();
        blue = (alpha <= 0.25 ) ? Explore(blue_ghost_pos.i,blue_ghost_pos.j) : PathToPac(blue_ghost_pos.i,blue_ghost_pos.j);
        ghostboard[blue_ghost_pos.i][blue_ghost_pos.j] = 0;
        ghostboard[blue.x][blue.y] = dict.blue_g;
        blue_ghost_pos.i = blue.x;
        blue_ghost_pos.j = blue.y;
    }
    if(yellow_ghost_pos!= null){
        alphe = Math.random();
        yellow = (alpha <= 0.25 ) ? Explore(yellow_ghost_pos.i,yellow_ghost_pos.j) : PathToPac(yellow_ghost_pos.i,yellow_ghost_pos.j);
        ghostboard[yellow_ghost_pos.i][yellow_ghost_pos.j] = 0;
        ghostboard[yellow.x][yellow.y] = dict.yellow_g;
        yellow_ghost_pos.i = yellow.x;
        yellow_ghost_pos.j = yellow.y;
    }
    if(pink_ghost_pos!= null){
        alphe = Math.random();
        pink = (alpha <= 0.25 ) ? Explore(pink_ghost_pos.i,pink_ghost_pos.j) : PathToPac(pink_ghost_pos.i,pink_ghost_pos.j);
        ghostboard[pink_ghost_pos.i][pink_ghost_pos.j] = 0;
        ghostboard[pink.x][pink.y] = dict.pink_g;
        pink_ghost_pos.i = pink.x;
        pink_ghost_pos.j = pink.y;
    }
};

function PathToPac(x, y) {
    var moves = getPossibleMoves(x, y);
    var tmpchoice = moves[0];
    var testDist = manhattanDist(shape.i,shape.j, tmpchoice.x, tmpchoice.y);
    for (var i = 1; i < moves.length; i++) {
        if (manhattanDist(shape.i, shape.j, moves[i].x, moves[i].y) < testDist) {
            tmpchoice = moves[i];
            minManhattanDist = manhattanDist(shape.i, shape.j, moves[i].x, moves[i].y );
        }
    }
    return tmpchoice;
}

function getPossibleMoves(x, y) {
    var moves = [];
    if (x - 1 >= 0 && isClearCell(x - 1, y)) moves.push({x: x - 1, y: y}); //left
    if (x + 1 <= BOARD_WIDTH - 1 && isClearCell(x + 1, y)) moves.push({x: x + 1, y: y}); //right
    if (y - 1 >= 0 && isClearCell(x, y - 1)) moves.push({x: x, y: y - 1}); //up
    if (y + 1 <= BOARD_HEIGHT - 1 && isClearCell(x, y + 1)) moves.push({x: x, y: y + 1}); //down
    return moves;
}

function isClearCell(x, y) {
    return board[x][y] !== dict.Walls &&
    ghostboard[x][y] !== dict.red_g &&
    ghostboard[x][y] !== dict.yellow_g &&
    ghostboard[x][y] !== dict.pink_g &&
    ghostboard[x][y] !== dict.blue_g &&
    ghostboard[x][y] !== dict.cookie;
}

function Explore(x, y) {
    var moves = getPossibleMoves(x, y);
    return moves[Math.floor(Math.random() * moves.length)];
}

function manhattanDist(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
