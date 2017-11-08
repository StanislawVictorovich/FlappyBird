var TIMER = 50;
var BIRD_JUMP = 4;
var intervalGameStart = 0;
var score = 0;
var bestScore = 0;
var scoreFlag = false;

var birdPosition;
var bird;
var pillarUp;
var pillarDown;

var run = function () {
    var rnd = Math.floor(Math.random()*30);
    bird.pushUpBird();
    pillarUp.movePillar(-60-rnd);
    pillarDown.movePillar(strToIntCssAttribute('.pillar','height')-rnd); 
    !checkCoordinates(bird.x,bird.y,pillarDown.x,pillarDown.y) ? bird.gameOver() : bird.fly(); 
    shiftYOfObject("#bird",1);
};

$(document).ready(function(){
    bird = new FlappyBird('#bird');
    pillarUp = new Pillar("#pillar_up");
    pillarDown = new Pillar("#pillar_down");
    roadDown = new Road('#road');
});

function FlappyBird(selector){
    var b = this; 
    var cycleCounter = 0;
    this.pushUpBird = function(){    
        shiftYOfObject('#bird',birdPosition--);
    };
    this.fly = function(){
        !cycleCounter++%3 ?
            $(selector).toggleClass('bird_fly_1') :
            $(selector).toggleClass('bird_fly_2');
        b.x = getXOfObject(selector);
        b.y = getYOfObject(selector);
        $('#road').css('left',-cycleCounter%12+'px');
    };
    this.gameOver = function(){
        $('#medal').removeClass();
        if(score>bestScore){
            bestScore=score;
            $('#medal').addClass('medal_gold').fadeIn('slow');
        } else {
            $('#medal').addClass('medal_silver').fadeIn('slow');
        }
        clearInterval(intervalGameStart);
        $(selector).toggleClass('bird_crashed');
        $('#game_over').fadeToggle('slow');
        $('#table_result').slideToggle('slow');
        $('#score_result_x').addClass('score_result_'+score%10).fadeIn('slow');
        if (score>=10){
            $('#score_result_xx').addClass('score_result_'+Math.floor(score/10)%10).fadeIn('slow');
        }
        $('#score_best_result_x').addClass('score_result_'+bestScore%10).fadeIn('slow');
        if (bestScore>=10){
            $('#score_best_result_xx').addClass('score_result_'+Math.floor(bestScore/10)%10).fadeIn('slow');
        }
        $('#background').toggleClass('background_night'); 
        $('#game_new').fadeToggle('slow');
    };
};

function Pillar(selector){
    var p = this; 
    p.x = 0;
    p.y = 0;
    this.movePillar = function (newTopPosition){
        $(selector).offset(function(index,position){
            var newCoord = {};
            p.x = $(selector).position().left;
            p.y = $(selector).position().top;
            newCoord.left = position.left-3;
            if(position.left<-26){
                newCoord.left=144;
                $(selector).css('top',newTopPosition +'px');
                if (scoreFlag==false){
                    scoreFlag=true; 
                } else { 
                    $('#score_x').removeClass('score_'+score++%10);
                    $('#score_x').addClass('score_'+score%10);
                        if(score>=10){
                            $('#score_xx').toggleClass('score_'+Math.floor(score/10)%10);
                        }
                    scoreFlag=false; 
                };
            } 
            return newCoord;
        });
    }; 
};

var checkCoordinates = function(bx,by,px,py) {
    if(bx+18>px){
        if(bx<px+strToIntCssAttribute('#bird','left')){
            if(by<py-57||by>py-strToIntCssAttribute('#bird','width')){
                return false;
            };
        }; 
    };
    if(by>strToIntCssAttribute('#background','height')-40){
        return false; 
    };
    return true;
};

var getXOfObject = function(selector){
    var positionX;
    $(selector).offset(function(index,position){
        var newCoord = {};
        positionX = $(selector).position().left;
        return newCoord;
    });
    return positionX;
}

var getYOfObject = function(selector){
    var positionY;
    $(selector).offset(function(index,position){
        var newCoord = {};
        positionY = $(selector).position().top;
        return newCoord;
    });
    return positionY;
}

var shiftXOfObject = function(selector,shiftindex){
    $(selector).offset(function(index,position){
        var newCoord = {};
        newCoord.left = position.left-shiftindex;
        return newCoord;
    });
}

var shiftYOfObject = function(selector,shiftindex){
    $(selector).offset(function(index,position){
        var newCoord = {};
        newCoord.top = position.top-shiftindex;
        return newCoord;
    });
}

var strToIntCssAttribute = function (selector,attribute){ //remove 'px' from css attribute
    return (($(selector).css(attribute)).split('p')[0]);
};
