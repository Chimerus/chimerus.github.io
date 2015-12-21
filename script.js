"use strict";

(function () {

//define the playing field
var field = $('#playField');
var x = field.innerWidth();
var y = 900;

//tank location set dynamically
$("#turret").css({
  "bottom":0,
  "left":x/2-50+"px",
})

//sounds!
// var launch = new Audio('/Sounds/Bottle Rocket-SoundBible.com-332895117.mp3');
// var impact = new Audio('/Sounds/Grenade-SoundBible.com-1777900486.mp3');
var gameOver = new Audio('/Sounds/Bunker_Buster_Missle-Mike_Koenig-1405344373.mp3')
var theme = new Audio('/Sounds/ThemeEdit.mp3');
theme.play();
$(".sound").on('click',function(){
  if(theme.play==true){
    theme.pause();
  } else {
    theme.play();
  }
})
//these var to control game playing
//can use with clear interval.
var incoming;
var path;
var hiScore = "";

//difficulty control
var timer = 4.5;
var interval = 3500;
var howMany =1;
var gameType;

//score tracker
var score = 0;
var multiplier = 5;
var gameType;
// var hiScore;

//anti-missile location control
var left;
var top;

$("#gameOver").hide();
$(".reset").hide();
$(".score").hide();

//Modes
$(".classic").on('click', function() {
  gameType ="Classic";
  modes();
  gameOn();
})

$(".challenge").on('click', function() {
  timer = 3;
  interval = 1500;
  multiplier = 10;
  howMany = 2;
  gameType ="Challenge";
  modes();
  gameOn();
})

$(".triple").on('click', function() {
  multiplier = 10;
  interval = 3000;
  gameType = "Triple Threat";
  howMany = 3;
  modes();
  gameOn();
})

$(".random").on('click', function() {
  interval = 3000;
  multiplier = 10;
  timer = 4;
  gameType = "Random Missiles";
  modes();
  gameOn();
})

//game history:
function modes(){

switch(gameType){
  case "Classic":
    if(!localStorage.getItem('classicScores')) {
      populateStorage('classicScores');
    } else {
      setScores('classicScores');
    }
    break;
  case "Challenge":
    if(!localStorage.getItem('challengeScores')) {
      populateStorage('challengeScores');
    } else {
      setScores('challengeScores');
    }
    break;
  case "Triple Threat":
    if(!localStorage.getItem('tripleThreatScores')) {
      populateStorage('tripleThreatScores');
    } else {
      setScores('tripleThreatScores');
    }
    break;
  case "Random Missiles":
    if(!localStorage.getItem('randomScores')) {
      populateStorage('randomScores');
    } else {
      setScores('randomScores');
    }
    break;
  }
}

function populateStorage(mode){
  localStorage[mode]="";
}
function setScores(x){
  hiScore=localStorage.getItem(x);
}

//Game Start
function gameOn() {
  $("#screenCover").fadeOut(2000);
  incoming = window.setInterval(missileFactory,interval);
}

function missileFactory(){
  if(gameType==="Classic"&&interval===3000){
    howMany++;
  }

  if(gameType==="Challenge"&&interval===2000){
    howMany++;
  }

  if(gameType==="Random Missiles"){
    howMany=Math.floor((Math.random() * 4) + 1)
  }
  for(var i=0;i<howMany;i++){
    makeMissile();
  }
  //generate more, faster missiles over time
  if(interval>500){
    interval-=250;
  }

  if(interval%1000===0&&timer>0.5){
    timer -=0.5;
  }
}

//create a new missile
//location adjust size by window size
function makeMissile () {
    var missile = $('<div class="missile"></div>');
       field.append(missile);
    var missileSpawn = Math.floor(Math.random() * (x*0.85)+(x*0.1));
    var missileTarget = Math.floor(Math.random() * (x*0.85)+(x*0.1));
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
    //click event handler
    missile.one("click", missileClickHandler);
  }

//create and shoot interceptor missile
function interceptorMissile () {
  var missile2 = $('<div class="missile2"></div>');
  var launch = new Audio('/Sounds/Bottle Rocket-SoundBible.com-332895117.mp3');
    launch.play();
    missile2.css({"top":720,
               "left": x/2,
               "transition":"top "+0.5+"s, left "+0.5+"s",
               "transition-timing-function":"linear",
               //"transform":"rotate("+spin2+"deg)",
             })
  field.append(missile2);
    window.setTimeout(function(){
      missile2.css({"top":top,
               "left":left});
    },20)
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
  top = loc.getPropertyValue('top');
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
    var impact = new Audio('/Sounds/Grenade-SoundBible.com-1777900486.mp3');
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
  if(hiScore.length>10){
    hiScore.pop();
  }
  hiScore=hiScore.join(" ");

  //store new hi score list  
  switch(gameType){
    case "Classic":
      localStorage.setItem('classicScores',hiScore);
      break;
    case "Challenge":
      localStorage.setItem('challengeScores',hiScore);
      break;
    case "Triple Threat":
      localStorage.setItem('tripleThreatScores',hiScore);
      break;
    case "Random Missiles":
      localStorage.setItem('randomScores',hiScore);
      break;
  }
}

//Game over man, Game over!
$(document).on('transitionend','.missile',function(event){
  window.clearInterval(incoming);
  $(".missile").remove();
  scoring();
  $(".score").hide();
  window.setTimeout(function(){
    theme.pause();
  },1000);
  gameOver.play();
  $("#gameOver").fadeIn(2500);
  $(".reset").show();

//score display
//add Hi score list
var disp = hiScore.split(" ");
var hiScoreDisplay="";
for(var i=0;i<disp.length;i++){
  hiScoreDisplay+=disp[i]+"<br>";
}

//display your score and Hi score list
var stock = "GAME OVER!!!<br>Your Final Score is: "+score+"<br>Mode: "+gameType+"<br>Top 10 High Scores:<br>";
$("#scores").html(stock+hiScoreDisplay);
})

$(".reset").on('click',function(){location.reload();})

})();