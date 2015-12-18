"use strict";

(function () {

//define the playing field
var field = $('#playField');
var x = field.innerWidth();
var y = 900;
var fieldDimensions = [x,y];

//sounds!
var launch = new Audio('/Sounds/Bottle Rocket-SoundBible.com-332895117.mp3');
var impact = new Audio('/Sounds/Grenade-SoundBible.com-1777900486.mp3');
var gameOver = new Audio('/Sounds/Bunker_Buster_Missle-Mike_Koenig-1405344373.mp3')
var theme = new Audio('/Sounds/ThemeEdit.mp3');
theme.play();

//these var to control game playing
//can use with clear interval.
var incoming;
var path;

//difficulty control
var timer = 7 ;
var interval = 3500;

//Modes
$(".classic").on('click', function() {
  gameType="Classic";
  gameOn();
})

$(".challenge").on('click', function() {
  timer = 4;
  interval = 2000;
  multiplier = 10;
  gameType="Challenge";
  gameOn();
})

$(".double").on('click', function() {
  multiplier = 10;
  gameType="Double Trouble";
  gameDouble();
})

//game history:
var hiScore="0";

switch(gameType){
  case "Classic":
    if(!localStorage.getItem('classicScores')) {
      populateStorage();
    } else {
      setScores('classicScores');
    }
    break;
  case "Challenge":
    if(!localStorage.getItem('challengeScores')) {
      populateStorage();
    } else {
      setScores('challengeScores');
    }
    break;
  case "Double Trouble":
    if(!localStorage.getItem('doubleTroubleScores')) {
      populateStorage();
    } else {
      setScores('doubleTroubleScores');
    }
    break;
}

function populateStorage(){
  hiScore="0";
}
function setScores(x){
  hiScore=localStorage.getItem(x);
}
//score tracker
var score = 0;
var multiplier = 5;
var gameType;
// var hiScore;

//anti-missile location control
var left;
var top;

$("#gameOver").hide();

//Game Start
function gameOn() {
  $("#screenCover").hide();
  incoming = window.setInterval(makeMissile,interval);
}

function gameDouble() {
  $("#screenCover").hide();
  incoming = window.setInterval(makeTwoMissile,interval);
}

function makeTwoMissile() {
    makeMissile();
    makeMissile();
}
//create a new missile
//location subtract a little over img div size
function makeMissile () {
  var missile = $('<div class="missile"></div>');
     field.append(missile);
  var missileSpawn = Math.ceil(Math.random() * (x-55));
  var missileTarget = Math.ceil(Math.random() * (x-55));
  var spin=90;

  //rotate!
  if ((missileTarget - missileSpawn)>0) {
    spin = spin +(180*Math.atan(700/(missileTarget - missileSpawn)))/Math.PI;
  } else {
    spin = spin + 90 +(180*Math.atan((missileSpawn - missileTarget)/700))/Math.PI;
  }

  //spawn missile at location, rotated
  missile.css({"top":0,
               "left":missileSpawn,
               "transition":"top "+timer+"s, left "+timer+"s",
               "transition-timing-function":"linear",
               "transform":"rotate("+spin+"deg)"});

  //sets random target
  path = setTimeout(function(){
    var s= missile.css({"top":y-200,
               "left":missileTarget});
  }, 10)

  //generate more, faster missiles over time
  if(interval>500){
    interval-=250;
  }
  if(interval%1000===0&&timer>1){
    timer --;
  }
  //end of generator
  missile.one("click", missileClickHandler );
  }

//create and shoot interceptor missile
function interceptorMissile () {
  //not rotating... 
  // var spin2=180;
  // //rotate!
  // if ((left - x/2)<0) {
  //   spin2 = spin2 +(180*Math.atan((700-top)/(left-x/2)))/Math.PI;
  // } else {
  //   spin2 = spin2 + 90 +(180*Math.atan((x/2-left)/700))/Math.PI;
  // }

  var missile2 = $('<div class="missile2"></div>');
    launch.play();
    missile2.css({"top":800,
               "left": x/2,
               "transition":"top "+0.5+"s, left "+0.5+"s",
               "transition-timing-function":"linear",
               //"transform":"rotate("+spin2+"deg)",
             })
  field.append(missile2);
    window.setTimeout(function(){
      var q= missile2.css({"top":top,
               "left":left});
    },10)
}

//remove interceptor missile when its job is done
$(document).on('transitionend','.missile2',function(event){
   $(this).remove();
})

//missile click up score
//also trigger stop missile and interceptor missile
var hit;
var missileClickHandler = function(event){
  score += multiplier;
  $(".score").text("Score: "+score);
  hit = $(this);
  var loc = window.getComputedStyle(this, null);
  left = loc.getPropertyValue('left');
  top = loc.getPropertyValue('top')
  $(this).css({
                "top": top,
               "left": left,
              });
  hitMissile();
  interceptorMissile();
}

//interceptor missile add tag to target missile for destruction
function hitMissile(){
  window.setTimeout(function(){
    hit.addClass("boom");
    impact.play();
  },500);
 }
  
//explode missile
function kaBoom(){
  window.setTimeout(function(){
    $(".boom").remove();
  },1000);
}

//to run the explode missile function
$(document).on('click','.missile',kaBoom);

function scoring(){
  var temp=score.toString();
  hiScore=hiScore+" "+temp;
  hiScore=hiScore.split(" ").sort(function(a, b) {
    return b - a;
  });
  if(hiScore.length>9){
    hiScore = hiScore.pop();
  }
  hiScore=hiScore.join(" ");
}
//Game over man, Game over!
$(document).on('transitionend','.missile',function(event){
  window.clearInterval(incoming);
  $(".missile").remove();
  scoring();
  window.setTimeout(function(){
    theme.pause();
  },1000);
  gameOver.play();
  $("#gameOver").show();

//store new hi score list  
switch(gameType){
  case "Classic":
    localStorage.setItem('classicScores',hiScore);
    break;
  case "Challenge":
    localStorage.setItem('challengeScores',hiScore);
    break;
  case "Double Trouble":
    localStorage.setItem('doubleTroubleScores',hiScore);
    break;
}

//score display
//add Hi score list
var disp = hiScore.split(" ");
var hiScoreDisplay="";
for(var i=0;i<disp.length;i++){
  hiScoreDisplay+=disp[i]+"<br>";
}

//display your score and Hi score list
var stock = "<br>GAME OVER!!!<br><br> Your Score is:<br>"+score+"<br><br> HIGH SCORE LIST:<br>";
$("#gameOver").html(stock+hiScoreDisplay);
})

})();