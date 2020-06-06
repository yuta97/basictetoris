
//gamestart
function gp_start()
{
    //初期表示
    init();
    drawAll();
    // ボタンの表示制御
	document.getElementById('start').style.display = "none";
    intervalID = setInterval(dropTetro,Game_speed);
}

//gamestart
function re_start()
{
    // stop the interval
    clearInterval(intervalID);
    over=false;
    score = 0;
    con.lineWidth = 1;
    //テトロミノ座標
    tetro_x = Start_x;
    tetro_y = Start_y;

    field = []
    init();
    drawAll();
    intervalID = setInterval(dropTetro,Game_speed);
}
// //一時停止
// function stop(){
//     clearInterval(intervalID);
//     document.getElementById('restart_afterstop').style.display = "";
//     document.getElementById('stop').style.display = "none";
// }
// //一時停止後の再開
// function restart_afterstop(){
//     document.getElementById('restart_afterstop').style.display = "none";
//     document.getElementById('stop').style.display = "";
//     intervalID = setInterval(dropTetro,Game_speed);
// }
function finish(){
    // clearInterval(intervalID);
    over = true;
    drawAll();
}
// document.getElementById('restart_afterstop').style.display = "none";

//フィールドサイズ
const Field_col = 10;
const Field_row = 20;

//ブロック1つのサイズ
const Block_size =30;

//スクリーンサイズ
const Screen_w = Block_size * Field_col;
const Screen_h = Block_size * Field_row;

//落ちるスピード
const Game_speed = 500;

//テトロミのサイズ
const Tetro_size = 4;

let can = document.getElementById("can");
let con = can.getContext("2d");

can.width = Screen_w;
can.height = Screen_h;
can.style.border = "4px solid #555";

//socre 計算
let score = 0;

//テトロミノ本体
let tetro;
const Tetro_types = [
    [], //0.空
    [             //1.I
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
    ],
    [             //2.L
        [0,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,0,0],
    ],
    [             //3.J
        [0,0,1,0],
        [0,0,1,0],
        [0,1,1,0],
        [0,0,0,0],
    ],
    [             //4.T
        [0,1,0,0],
        [0,1,1,0],
        [0,1,0,0],
        [0,0,0,0],
    ],
    [             //5.O
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0],
    ],
    [             //6.Z
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0],
    ],
    [             //7.S
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0],
    ],
]
//テトロミノの色
const TETRO_COLORS =[
	"#000",			//0空
	"#6CF",			//1水色
	"#F92",			//2オレンジ
	"#66F",			//3青
	"#C5C",			//4紫
	"#FD2",			//5黄色
	"#F44",			//6赤
	"#5B5"			//7緑
];
//テトロミノの形
let tetro_t;

tetro_t = Math.floor(Math.random()*(Tetro_types.length-1))+1;
tetro = Tetro_types[tetro_t];
//ゲームオバーフラグ
let over=false;
//初期位置
const Start_x = Field_col/2 -Tetro_size/2;
const Start_y = 0;
//テトロミノ座標
let tetro_x = Start_x;
let tetro_y = Start_y;

//フィールドのクリア
let field = []


//field+block描写
function drawAll()
{
    con.clearRect(0,0,Screen_w,Screen_h);

    for(let y=0; y< Field_row; y++)
    {
        for(let x=0; x< Field_col; x++)
        {
            if(field[y][x])
            {
                drawBlock(x,y,field[y][x]);
            }
        } 
    }
    for(let y=0; y< Tetro_size; y++)
    {
        for(let x=0; x< Tetro_size; x++)
        {
            if(tetro[y][x])
            {
                drawBlock(tetro_x+x,tetro_y+y,tetro_t);
            }
        }  
    }
    if(over)
	{
		let s="GAME OVER";
		con.font = "40px 'ＭＳ ゴシック'";
		let w = con.measureText(s).width;
		let x = Screen_w/2 - w/2;
		let y = Screen_h/2 - 20;
		con.lineWidth = 4;
		con.strokeText(s,x,y);
		con.fillStyle="white";
        con.fillText(s,x,y);
        console.log(score);
        text = "score:"+score;
        con.strokeText(text,x,y+40)
        // console.log(linec);
        // stop the interval
        clearInterval(intervalID);
	}
}

document.onkeydown = function(e)
{
    if(over)return;
    switch(e.keyCode)
    {
        case 37: //left
            if( checkMove(-1,0))tetro_x --;
            break;
        case 38: //up
            if( checkMove(0,-1))tetro_y --;
            break;
        case 39: //right
            if( checkMove(1,0))tetro_x ++;
            break;
        case 40: //down
            if( checkMove(0,1))tetro_y ++;
            break;
        case 32: //rotation,space_key
            let ntetro = rotate();
            if(checkMove(0,0,ntetro))tetro=ntetro;
            break;
    }
    drawAll();
}
//block１つ描画
function drawBlock(x,y,c)
{
    let px = x * Block_size;
    let py = y * Block_size;
    con.fillStyle=TETRO_COLORS[c];
    con.fillRect(px,py,Block_size,Block_size);
    con.strokeStyle="black";
    con.strokeRect(px,py,Block_size,Block_size);
            
}

//初期化
function init()
{
    //フィールドのクリア
    for(let y=0; y<Field_row; y++)
    {
        field[y] = [];
        for(let x=0; x<Field_col; x++)
        {
            field[y][x] = 0;
        }
    }
    //test
    // field[5][8]  = 1;
    // field[5][9] = 1;
    // field[19][0] = 1;
}
//blockの衝突判定
function checkMove(mx,my,ntetro)
{
    if(ntetro==undefined) ntetro=tetro;
    for(let y=0; y<Tetro_size; y++)
    {
        for(let x=0; x<Tetro_size; x++)
        {
            if(ntetro[y][x])
            {
                let nx =tetro_x+mx+x;
                let ny =tetro_y+my+y;

                if(ny<0 ||
                   nx<0 ||
                   ny>=Field_row ||
                   nx>=Field_col ||
                   field[ny][nx])
                    {
                        return false;
                    }
            }
        }
    }
    return true;
}
function rotate()
{
    let ntetro = [];
    for(let y=0; y<Tetro_size; y++)
    {
        ntetro[y] = [];
        for(let x=0; x<Tetro_size; x++)
        {        
            ntetro[y][x] = tetro[x][Tetro_size-1-y];
        }
    }
    return ntetro;
}
//block落とす処理
function dropTetro()
{
    if(over)return;
    if( checkMove(0,1))tetro_y ++;
    else{
        fixTetro();
        checkLine();
        tetro_t = Math.floor(Math.random()*(Tetro_types.length-1))+1;
        tetro = Tetro_types[tetro_t];
        tetro_x = Start_x;
        tetro_y = Start_y;

        if(!checkMove(0,0))
        {
            over=true;
        }
    }
    drawAll();
}
function fixTetro()
{
    for(let y=0; y<Tetro_size; y++)
    {
        for(let x=0; x<Tetro_size; x++)
        {        
            if(tetro[y][x])
            {
                field[tetro_y+y][tetro_x+x]=tetro_t;
            }
        }

    }
}
//ラインが揃ったかチェックして消す
function checkLine()
{
    // let linec=0;
    for(let y=0; y<Field_row; y++)
    {
        let flag=true;
        for(let x=0; x<Field_col; x++)
        {
            if(!field[y][x])
            {
                flag=false;
                break;
            }
        }
        if(flag)
        {
            // linec++;
            score++;
            for(let ny = y;ny>0;ny--)
            {
                for(let nx=0;nx<Field_row;nx++)
                {
                    field[ny][nx] = field[ny-1][nx];
                }
            }
        }
        // score += linec;
    }
}