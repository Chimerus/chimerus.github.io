"use strict";

(function () {
//define the playing field
var field = $('#playField');
var x = field.innerWidth();
var y = 900;
var fieldDimensions = [x,y];
console.log(fieldDimensions);
//this var to control game playing
//can use with clear interval.
var incoming;

var path;

//difficulty control
var timer = 10;
var interval = 5000;

//score tracker
var score = 0;

  //create a new missile
  //location subtract a little over img div size
  function makeMissile () {
    var missile = $('<div class="missile"></div>');
    field.append(missile);
  var missileSpawn = Math.ceil(Math.random() * (x-55));
  var missileTarget = Math.ceil(Math.random() * (x-55));
  var spin=90;
  //generate it to a random location on TOP of the field & rotate!
  if ((missileTarget - missileSpawn)>0) {
    spin = spin +(180*Math.atan(700/(missileTarget - missileSpawn)))/Math.PI;
  } else {
    spin = spin + 90 +(180*Math.atan(700/(missileSpawn - missileTarget)))/Math.PI;
  }
  missile.css({"top":0,
               "left":missileSpawn,
               "transition":"top "+timer+"s, left "+timer+"s",
               "transition-timing-function":"linear",
               "transform":"rotate("+spin+"deg)"});
  //move the missile to a random target location
  //HAVE TO ADJUST LOCATION WITH IMG DIV SIZE!!!

  //sets target
  path = setTimeout(function(){
    var s= missile.css({"top":y-200,
               "left":missileTarget});
  
  }, 10)

  //Generate more, faster missiles over time
  if(interval>500){
    interval-=100;
  }
  if(interval%1000===0&&timer>2){
    timer --;
  }

  }
var incoming = window.setInterval(makeMissile,interval);


//missile click up score
$(document).on('click','.missile',function(event){
    score+=5;
    $(".score").text(score);
    $(this).addClass("boom")
    return false;
  })

//explode missile
function kaBoom(){
    window.setTimeout(function(){
      $(".boom").remove();
    },1000);
}

//to run the explode missile function
$(document).on('click','.missile',kaBoom);

$(document).on('transitionend','.missile',function(event){
   window.clearInterval(incoming);
  field.html("<br>GAME OVER!!!<br><br> Your Score is:<br>"+score);
})

})();