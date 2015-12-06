var board = new Array();
var score = 0;

var hasConflicted= new Array();



$(document).ready(function(){
   newgame();
});

function newgame(){
	init();//初始化棋盘格
	generateOneNumber();
	generateOneNumber();//生成随机数字
}

function init(){
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop(i,j));
			gridCell.css('left', getPosLeft(i,j));

		}
		for(var i=0;i<4;i++){
			board[i]=new Array();
			hasConflicted[i]=new Array();
			for(var j=0;j<4;j++){
				board[i][j]=0;
				hasConflicted[i][j] = false;
			}
		}
		updateBoardView();
		score=0;
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var thisNumberCell=$('#number-cell-'+i+'-'+j);

            if(board [i][j]==0){
            	thisNumberCell.css('width','0px');
            	thisNumberCell.css('height','0px');
            	thisNumberCell.css('top',getPosTop(i,j)+50);
            	thisNumberCell.css('left',getPosLeft(i,j)+50);
            }
            else{
            	thisNumberCell.css('width','100px');
            	thisNumberCell.css('height','100px');
            	thisNumberCell.css('top',getPosTop(i,j));
            	thisNumberCell.css('left',getPosLeft(i,j));
            	thisNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
            	thisNumberCell.css('color',getNumberColor(board[i][j]));
            	thisNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
		}
}


function generateOneNumber(){
	if(nospace(board))
		return false;

	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));

    var times=0;
    while(times<50){
    	if(board[randx][randy]==0)
    		break;

    	randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));
        
        times++;
    }
    if(times==50){
    	for(var i=0;i<4;i++)
    		for(var j=0;j<4;j++){
    			if(board[i][j]==0){
    				randx=i;
    				randy=j;
    			}
    		}
    }

    var randNumber=Math.random()<0.5?2:4;

    board[randx][randy]=randNumber;
    showNumberAnimation(randx,randy,randNumber);

	return true;
}
/*var count=0;
var temporary=new Array();
 for(var i=0;i<4;i++)
 for(var j=0;j<4;j++)
 {
	 if(board[i][j]==0)
	 {
		 temporary[count]=i*4+j;
		 count++;
	 }
 }
 var pos= parseInt( Math.floor( Math.random()  * count ) );
 
 randx=Math.floor(temporary[pos]/4);
 randy=Math.floor(temporary[pos]%4);
 

 
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}*/


$(document).keydown(function(event){
    switch(event.keyCode){
    	case 37://left
    	    if(moveLeft()){
    	    	setTimeout("generateOneNumber()",210);
    	    	setTimeout("isgameover();",300);
    	    }
    	    break;
    	case 38://up
    	    if(moveUp()){
    	    	setTimeout("generateOneNumber()",210);
    	    	setTimeout("isgameover();",300);
    	    }
    	    break;
    	case 39://right
    	    if(moveRight()){
    	    	setTimeout("generateOneNumber()",210);
    	    	setTimeout("isgameover();",300);
    	    }
    	    break;
    	case 40://down
    	    if(moveDown()){
    	    	setTimeout("generateOneNumber()",210);
    	    	setTimeout("isgameover();",300);
    	    }
    	    break
    	default:
    	    break;
    }
});


function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}

}

function gameover(){
	alert('gameover');
}

function moveLeft(){

	if(!canMoveLeft(board))
		return false;
    
    for(var i=0;i<4;i++)
    	for(var j=1;j<4;j++)
    		if(board[i][j]!=0){
    			for(var k=0;k<j;k++){
    				if(board[i][k]==0&&noBlockcol(i,k,j,board)){
    					
    					showMoveAnimation(i,j,i,k);
    					board[i][k]=board[i][j];
    					board[i][j]=0;
    					continue;
    				}
    				else if(board[i][k]==board[i][j]&&noBlockcol(i,k,j,board)&& !hasConflicted[i][k] ){
                        showMoveAnimation(i,j,i,k);

                        board[i][k]+=board[i][j];
                        board[i][j]=0;

                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
    				}
    			}
    		}
    setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){

	if(!canMoveTop(board))
		return false;


	for(var i=1;i<4;i++)
		for(var j=0;j<4;j++)
			if(board[i][j]!=0){
				for(var k=0;k<i;k++){
					if(board[k][j]==0&&noBlockrow(k,i,j,board)){

						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockrow(k,i,j,board)&& !hasConflicted[i][k] ){
						showMoveAnimation(i,j,k,j);


                        board[k][j]+=board[i][j];
                        board[i][j]=0;

                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
					}
				}
			}
			setTimeout("updateBoardView()",200);
			return true;
}

function moveRight(){
	if(!canMoveRight(board))
		return false;

	for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--)
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0&&noBlockrow(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]==board[i][j];
						board[i][j]=0;
						continue;
					}
				else if(board[i][k]==board[i][j]&&noBlockrow(i,j,k,board)&& !hasConflicted[i][k] ){
					showMoveAnimation(i,j,i,k);
					board[i][k]+=board[i][j];
					board[i][j]=0;

					score+=board[i][k];
                    updateScore(score);

                    hasConflicted[i][k] = true;
					continue;
				}
			}
		}
			setTimeout("updateBoardView()",200);
			return true;
}

function moveDown(){
	if(!canMoveTop(board))
		return false;


	for(var i=2;i>=0;i--)
		for(var j=0;j<4;j++)
			if(board[i][j]!=0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0&&noBlockrow(j,i,k,board)){

						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockrow(j,i,k,board)&& !hasConflicted[i][k] ){
						showMoveAnimation(i,j,k,j);


                        board[k][j]+=board[i][j];
                        board[i][j]=0;

                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
					}
				}
			}
			setTimeout("updateBoardView()",200);
			return true;
}