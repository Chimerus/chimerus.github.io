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

//these var to control game playing
//can use with clear interval.
var incoming;
var path;

//difficulty control
var timer = 7 ;
var interval = 3500;

//score tracker
var score = 0;

//anti-missile location control
var left;
var top;

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
  if(interval%1000===0&&timer>2){
    timer --;
  }
  //end of generator
  missile.one("click", missileClickHandler );

  }
//create and shoot interceptor missile
function interceptorMissile () {
  var missile2 = $('<div class="missile2"></div>');
    launch.play();
    missile2.css({"top":800,
               "left": x/2,
               "transition":"top "+0.5+"s, left "+0.5+"s",
               "transition-timing-function":"linear",
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
//activate the missile generator at times
var incoming = window.setInterval(makeMissile,interval);

//missile click up score
//also trigger stop missile and interceptor missile
var hit;
var missileClickHandler = function(event){
  score += 5;
  $(".score").text("Score: "score);
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
  // return false;
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

//Game over man, Game over!
$(document).on('transitionend','.missile',function(event){
   window.clearInterval(incoming);
   gameOver.play();
  field.html("<br>GAME OVER!!!<br><br> Your Score is:<br>"+score);
})

})();