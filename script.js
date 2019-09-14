var canvas = document.getElementById("myCanvas");
p = document.getElementById("bread");
p2 = document.getElementById("bae");

var ctx = canvas.getContext("2d");
var elastic = true;
var fps = 120;
var boxes = [];
var selected = 0;
var keyDown = -1;
var exp = document.getElementById("explode");
var imgX = 0;
var imgY = 0;
var imgW = 140;
var imgH = 100;
var imgC = fps / 2;
document.body.addEventListener("keydown", press);
document.body.addEventListener("keyup", unpress);

function press(event) {
  if (keyDown == event.keyCode) { //only trigger once
    return;
  }
  var x = event.which || event.keyCode; //depending on browser support

  if (x === 32) {
    selected = (selected + 1) % (boxes.length);
  }
  if (x == 65) {
    boxes[selected].ax = -70 / boxes[selected].m;
  }
  if (x == 68) {
    boxes[selected].ax = 70 / boxes[selected].m;
  }
  if (x == 87 && boxes[selected].grounded) {
    boxes[selected].vy = -500 / boxes[selected].m;
  }
  keyDown = event.keyCode;
}

function unpress(event) {
  if (event.keyCode != keyDown) {
    return;
  }
  keyDown = -1;
  var x = event.which || event.keyCode; //depending on browser support
  boxes[selected].ax = 0;
}
var b = setInterval(tick, 1000 / fps);

function tick() {
	if(document.getElementById("elCheck").checked == true){
  	elastic = true;
  }
  else {
  	elastic = false;
  }
  
  imgC++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (imgC < fps / 2) {
    ctx.drawImage(exp, imgX, imgY, imgW, imgH);
  }
  for (i = 0; i < boxes.length; i++) {
    var c = boxes[i];
	  
    c.bouncetime ++;
    c.walltime ++;
    c.gtoptime ++;
    
    if (c.x + c.width >= canvas.width || c.x <= 0) {
      c.vx = -c.vx;
      if (Math.abs(c.vx) >= 1600) {
        imgW = 280 * c.m;
        imgH = 200 * c.m;
        if (c.x > 250) {
          imgX = canvas.width - imgW / 2;
          imgY = c.y + c.height - imgH / 1.7;
        } else {
          imgX = -imgW / 2;
          imgY = c.y + c.height - imgH / 1.7;
        }
        imgC = 0;

        boxes.splice(i, 1);
      }
      if(c.walltime < 0.2*fps){
      	c.walled = true;
      	c.ax = 0;
      	c.vx = 0;
      	if(c.x < canvas.width/2){
        	c.x = 0;
        }
        else{
        	c.x = canvas.width - c.width;
        }
      }
      if (c.walltime > fps/2){
      c.walltime = 0;
      }
    }
    if (c.vx != 0){
    	c.walled = false;
    }
    
    if (c.y + c.height >= canvas.height || c.y <= 0) {
    	if (Math.abs(c.vy) >= 1600) {
        imgW = 280 * c.m;
        imgH = 200 * c.m;
        if (c.y > 250) {
          imgX = c.x + c.width - imgW / 1.7;
          imgY = canvas.height - imgH / 2;
        } else {
          imgX = c.x + c.width / 1.7;
          imgY = -imgH / 2;
        }
        imgC = 0;

        boxes.splice(i, 1);
      }
    }
    if (c.y + c.height > canvas.height) {
      c.y = canvas.height - c.height;
      c.vy = -(c.vy - 50);
      if(c.bouncetime < 0.1*fps){
      	c.grounded = true;
      	c.ay = 0;
      	c.vy = 0;
      	
      }
      
      else{
      	
      	c.grounded = false;
      }
      
      c.bouncetime = 0;
    }
    if (c.vy != 0){
      	c.grounded = false;
      }
    if (c.grounded){
    	c.ay = 0;
    	c.vy = 0;
    }
    if (Math.abs(c.vy) <= 50){
    	c.bouncetime = 0;
    }
    if (c.y <= 0) {
    	c.bouncetime = 1000;
      c.y = 0;
      c.vy = -(c.vy + 50);
      }
    //if in wall
    if (c.x < 0){
    	c.x = 0;
    }
    if (c.x+c.width > canvas.width){
    	c.x = canvas.width-c.width;
    }
    if (c.gtoptime > 2 && c.y + c.height < canvas.height - 1) {
    	c.grounded = false;
    }
    //collision
    for (j = 0; j < boxes.length; j++) {
      if (j == i) {

      } else {
        var f = boxes[j];
				
        if (c.x + c.width >= f.x && c.x <= f.x + f.width && c.x + c.width - f.x >= 5 && f.x + f.width - c.x >= 5) { //its within the x's box, but not too close 
					
          if (c.y <= f.y + f.height && c.y >= f.y) { //top of c hits bottom of f
					if (elastic){	
            if (Math.abs(f.vy) <= 50 && c.grounded){
              	f.grounded = true;
                f.gtoptime = 0;
              }
            if (!c.grounded && !f.grounded){
              
              var tc = c.vy;
              c.vy = c.vy*(c.m - f.m)/(c.m + f.m) + f.vy*2*f.m/(c.m+f.m);
              f.vy = f.vy*(f.m - c.m)/(c.m + f.m) + tc*2*c.m/(c.m+f.m);
              c.y = f.y + f.height;
              f.y = c.y - f.height;
            }
            else {
            	if (c.grounded && !f.grounded) {
            	f.vy = -(f.vy - 50);
              c.vy = 0;
              }
              else if(c.grounded && f.grounded){
              	f.vy = 0;
                c.vy = 0;
              }
              f.y = c.y - f.height;
              if (Math.abs(f.vy) <= 50){
              	f.grounded = true;
              }
            }
          }
          else {
          	if (!c.grounded && !f.grounded){
            	c.vy = (f.vy*f.m + c.vy*c.m)/(f.m + c.m);
            f.vy = c.vy;
            }
          	else if (c.grounded && !f.grounded){
            	f.vy = 0;
              f.y = c.y - f.height;
              f.grounded = true;
            }
            else if (c.grounded && f.grounded){
            	f.vy = 0;
              c.vy = 0;
              f.y = c.y - f.height;
            }
          }
    		}
        }

        if (c.y + c.height >= f.y && c.y <= f.y + f.height && c.y + c.height - f.y >= 10 && f.y + f.height - c.y >= 10) { //within y's box, not too close
        	
          if (c.x <= f.x + f.width && c.x >= f.x) { //left of c hits right of f
          if (elastic){	
            var ratM = c.m / f.m;
            var momentum = f.vx*f.m + c.vx*c.m;
            if (!c.walled && !f.walled){
            	
              var tc = c.vx;
              c.vx = c.vx*(c.m - f.m)/(c.m + f.m) + f.vx*2*f.m/(c.m+f.m);
              f.vx = f.vx*(f.m - c.m)/(c.m + f.m) + tc*2*c.m/(c.m+f.m);
            }
            else if(c.walled && !f.walled){
            	f.vx = -f.vx;
            }
            else if(!c.walled && f.walled){
            	c.vx = -c.vx;
            }
            f.x = c.x - f.width;
            c.x = f.x + f.width;
            
          }
          else {
          	f.x = c.x - f.width;
            c.x = f.x + f.width;
            if (f.x <= 0){
            	f.grounded = true;
            }
            if (c.x + c.width >= canvas.width){
            	c.grounded = true;
            }
          	if (!c.walled && !f.walled){
            	c.vx = (f.vx*f.m + c.vx*c.m)/(f.m + c.m);
            	f.vx = c.vx;
            }
            if (c.walled && !f.walled){
            	f.vx = 0;
              f.walled = true;
            }
            if (!c.walled && f.walled){
            	c.vx = 0;
              c.walled = true;
            }
            if (c.walled && f.walled){
            	f.vx = 0;
              c.vx = 0;
            }
          }
          }
          
        }
        
      }
    }
		
    c.vx += c.ax / fps;
    if (c.grounded){
    	c.vy += (c.ay) / fps;
    }
    else {
   		c.vy += (c.ay + 980) / fps;
    }
    c.x += c.vx / fps;
    c.y += c.vy / fps;

    ctx.fillStyle = "#885566";
    if (boxes[selected] === c) {
      ctx.fillStyle = "#CC1170";
    }
    ctx.fillRect(c.x, c.y, c.width, c.height);
  }
  if (boxes.length == 0 && imgC > fps * 3) {
    ctx.font = "100px Arial";
    ctx.fillText("You win..?", 10, 250);
  }
  r = document.getElementById("display");
  r.innerHTML = "Selected Box X Velocity = " + Math.trunc(boxes[selected].vx) + "<br /> Selected Box Y Velocity = " + Math.trunc(boxes[selected].vy);

}

function box(mass, xStart, yStart, width, height, xVel, yVel) {
  if (mass != 0) {
    this.m = mass;
  } else {
    this.m = width * height / 2500;
  }
  this.x = xStart;
  this.y = yStart;
  this.width = width;
  this.height = height;
  this.vx = xVel;
  this.vy = yVel;
  this.ax = 0;
  this.ay = 0;
  this.grounded = false;
  this.walled = false;
  this.bouncetime = 0;
  this.walltime = 0;
  this.gtoptime = 0;
  boxes.push(this);
}
//create a box
//var *boxname* = new box(mass(if 0 then calculated by area), x, y, width, height, x velocity, y velocity);
var first = new box(0, 20, 20, 30, 50, 80, 0);
var second = new box(0, 20, 250, 65, 20, 100, -500);
//var third = new box(0, 250, 400, 40, 30, -60, -900);
var fourth = new box(2, 350, 250, 75, 75, 20, 100);
//var five = new box(0, 220, 10, 100, 100, 0, 0);
//var six = new box(0, 400, 420, 30, 40, 0, 0);
var seven = new box(0, 250, 250, 32, 32, 10, 0);
//var lucas = new box(0, 10, 250, 200, 200, 0, 0);