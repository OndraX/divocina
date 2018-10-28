/* vim: foldmethod=marker foldmarker=homoioskedasticita,homoeroticismus:
*: 
 * */
// do not touch global variables
const u = 1;
const MASKSUFFIX = "_maska";
const MINALPHA = 22;// alpha threshold for polygonizing alpha mask
const MAXSIZE = 127; // max(w,h) that image gets reduced to when polygonised
const COLWIDTH = 2; // inverse of polygon's sample pixel density -- increasing can improve 
// performance, but may lead to polygons overlapping ocasionally
const SPIRALSPEED = 8; // how fast to progress about spiral
const MAXSHIFTS = 16; // how many steps at most to take along spiral
const MAXTRIES = 2; // how many times at most to try randomly to re-place a given polygon
const MAXDIM = 520;
const MINDIM = 360;
const WOFFSET = 0.1;
const HOFFSET = 1/3*WOFFSET;
const CELLSIZE = (MAXDIM+MINDIM)/4; // cellsize of grid
const MAXINCELL = 1;
window.imagesGrid = [];

const UPDATEEVERY = 1;
const BATCHSIZE = 15;
const POLYGONS = 12*BATCHSIZE;
const PADDING = 160;

window.allPolygons = [];
//prerequisites
//homoioskedasticita

var loadJS = function(url, implementationCode, location){
  //url is URL of external file, implementationCode is the code
  //to be called from the file, location is the location to 
  //insert the <script> element

  var scriptTag = document.createElement('script');
  scriptTag.src = url;

  scriptTag.onload = implementationCode;
  scriptTag.onreadystatechange = implementationCode;

  location.appendChild(scriptTag);
};

loadJS('./js/lodash/core.js', function(){console.log('lodash loaded');}, document.body);
// loadJS('./js/d3plus/d3plus.js', function(){console.log('d3plus loaded');}, document.body);
loadJS('./js/polyfills/es5-shim/es5-shim.js', function(){console.log('es5 shim loaded');}, document.body);
loadJS('./js/hulls/hulls.js', function(){console.log('hulls loaded');}, document.body);
loadJS('./js/poly-collisions/greiner-hormann.min.js', function(){console.log('polygon collisions loaded');}, document.body);
loadJS('./js/poly-collisions/spatial-hash.js', function(){console.log('polygon collisions loaded');}, document.body);
loadJS('./js/poly-collisions/pointInsidePolygon.js', function(){console.log('polygon collisions loaded');}, document.body);
// loadJS('./js/quadtree/quadtree.js', function(){console.log('quadtree collisions loaded');}, document.body);
//cross browser document content size solution
function documentSize(){
  var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

  var body = document.body,
    html = document.documentElement;
  var height = Math.max( body.scrollHeight, body.offsetHeight, 
    html.clientHeight, html.scrollHeight, html.offsetHeight );

  return {w:width,h:height};
}
//remove element from DOM
function deleteElement(element){
  if (element.parentElement == null)
    return;
  element.parentElement.removeChild(element);
}
//convenience function to scale image to proper size
Image.prototype.getScaledDimensions = function(w,h){
  //homoioskedasticita

  var newWidth, newHeight;
  if(typeof h == 'undefined'){//if only one argument passed, scale so that that is maximum dimension
    if(this.width>this.height){
      newWidth = w;
      newHeight = this.height*w/this.width;
    }else{	
      newWidth = this.width*w/this.height;
      newHeight = w;
    } 
  }else{
    if(h>0){
      newHeight = h;
      newWidth = this.width*h/this.height;
    }else if(w>0){
      newWidth = w;
      newHeight = this.height*w/this.width;
    }else{
      return {w:this.width,h:this.height};
    }
  }
  return {w:newWidth,h:newHeight};
  //homoeroticismus:
*
}

//polyFills TODO:offload
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}
// addEventListener polyfill IE6+ via https://gist.github.com/jonathantneal/2869388
!window.addEventListener && (function (window, document) {
  function Event(e, element) {
    var instance = this;

    for (property in e) {
      instance[property] = e[property];
    }

    instance.currentTarget =  element;
    instance.target = e.srcElement || element;
    instance.timeStamp = +new Date;

    instance.preventDefault = function () {
      e.returnValue = false;
    };
    instance.stopPropagation = function () {
      e.cancelBubble = true;
    };
  }

  function addEventListener(type, listener) {
    var
    element = this,
      listeners = element.listeners = element.listeners || [],
      index = listeners.push([listener, function (e) {
        listener.call(element, new Event(e, element));
      }]) - 1;

    element.attachEvent('on' + type, listeners[index][1]);
  }

  function removeEventListener(type, listener) {
    for (var element = this, listeners = element.listeners || [], length = listeners.length, index = 0; index < length; ++index) {
      if (listeners[index][0] === listener) {
        element.detachEvent('on' + type, listeners[index][1]);
      }
    }
  }

  window.addEventListener = document.addEventListener = addEventListener;
  window.removeEventListener = document.removeEventListener = removeEventListener;

  if ('Element' in window) {
    Element.prototype.addEventListener    = addEventListener;
    Element.prototype.removeEventListener = removeEventListener;
  } else {
    var
    head = document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    head.insertBefore(style, head.firstChild);

    style.styleSheet.cssText = '*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}';
  }
})(window, document) && scrollBy(0, 0);
//homoeroticismus:
*
//necessary functions
//homoioskedasticita

function fileExists(url) {
  if(url){
    var req = new XMLHttpRequest();
    req.open('HEAD', url, false);
    req.send();
    return req.status==200;
  } else {
    return false;
  }
}
function distance(a,b){
  return Math.sqrt((a[0]-b[0])*(a[0]-b[0]),(a[1]-b[1])*(a[1]-b[1]));
}
//homoeroticismus:
*
// converts given image to set of points around its outline -- roughly
var asyncImageOutline = function(src,alphaThreshold,maxDim,callback){
  var maskName = src.replace(/(.*)\.png/i,"$1"+MASKSUFFIX+".png");
  //homoioskedasticita
  //converts transparent image to array of points along outline

  if(typeof wrap == 'undefined'){//if only one argument passed, scale so that that is maximum dimension
    wrap = document.body;
  } 
  var canv = document.createElement('canvas');
  var ctx	= canv.getContext('2d');
  var img	= new Image();

  var points = [];

  img.onload = function(){
    var dim = img.getScaledDimensions(maxDim);
    canv.width = dim.w;
    canv.height = dim.h;
    ctx.clearRect(0,0,dim.w,dim.h);
    ctx.drawImage(img,0,0,dim.w,dim.h);
    var arr = ctx.getImageData(0,0,dim.w,dim.h);
    var t = performance.now();
    var points = [];
    var i = 0;
    //PROBLEM AREA
    while ( i < arr.data.length){
      //homoioskedasticita
      var topMost,botMost;

      var ibegin = i;
      // var x = i % arr.width;
      var y = Math.floor(i/arr.width);
      //Go through line forwards to find first
      while(arr.data[i+3] < alphaThreshold)
        i+=4;

      // arr.data[i]= arr.data[i+1] = arr.data[i+2] = 0;
      topMost = [i/4 % arr.width,Math.floor(i/4/arr.width)];

      i = ibegin+4*arr.width;
      //Go through line backwards to find last
      while(arr.data[i+3] < alphaThreshold)
        i-=4;

      // arr.data[i]= arr.data[i+1] = arr.data[i+2] = 0;
      // if(i>0)
      botMost = [i/4 % arr.width,Math.floor(i/4/arr.width)];
      i = ibegin+4*arr.width;

      //validate (leave out outlier points)
      if(!((topMost[1]<0 || topMost[1]>=arr.height) || (botMost[1]<=0 || botMost[1]>arr.height))){
        points.push(topMost);
        points.push(botMost);
      } 
      //homoeroticismus:
*
    }
    var j = 0;
    while ( j < 4*arr.width){
      //homoioskedasticita
      var jbegin = j;
      while(arr.data[j+3] < alphaThreshold)
        j+=4*arr.width;

      // if(j/4 % arr.width < arr.height)
      leftMost = [j/4 % arr.width,Math.floor(j/4/arr.width)];

      j = jbegin + 4*arr.width*(arr.height-1);


      while(arr.data[j+3] < alphaThreshold)
        j-=4*arr.width;

      // if(i>0)
      rightMost = [j/4 % arr.width,Math.floor(j/4/arr.width)];

      j = jbegin + 4;
      if(!((leftMost[0]<0 || leftMost[0]>=arr.width) || (rightMost[0]<=0 || rightMost[0]>arr.width))){
        points.push(rightMost);
        points.push(leftMost);
      }
      //homoeroticismus:
*
    }
    callback.call(this,points,src,{w:arr.width,h:arr.height});
  }
  if(fileExists(maskName)){
    img.src = maskName;
  }else{
    img.src	= src;
  }

  //homoeroticismus:
*
}

// initGraphics('#gfx-container');
var ctr = 0;
var imgs = [],polys = [];
// function to get called each time new image loads in to get converted to polygon
// when all have loaded, callback gets called to work with them as a bunch
function handleImages(src,pts,dims,callback){
  ctr++;
  imgs.push({src:src,pts:pts,dims:dims});
  if(ctr == len){
    callback.call(imgs);
  }
}
// Polygon class to handle image scaling, motion and collisions
class Polygon {
  /// homoioskedasticita
  constructor(points,dims,src){ //TODO: add conversion between [] and {x:,y:} format
    this.points = points;
    this.dims = dims;
    this.origin = [0,0];
    this.dims.hypo = 2*Math.max(dims.w,dims.h);
    this.transformHistory = {rotate:0,shift:[0,0],scale:1};
    this.imageClass = ['spawned-image'];
    if (typeof src == "undefined" || src == null) { 
      this.src = null;
    }else{
      if (typeof orderConcaveClockwise !== "undefined") { 
        this.points = orderConcaveClockwise(points,COLWIDTH);
      }
      this.src = src;

      this.scaleAll(this.dims.hypo/MAXDIM);
    }
    // this.barycentre = calcBarycentre();
  }

  resetTransformHistory(){
    this.transformHistory = {rotate:0,shift:[0,0],scale:1};
  }

  setCanvas(cvs,ctx){
    this.whichCanvas = cvs;
    this.renderingContext = ctx;
  }

  draw(cvs,ctx) {

    if(cvs){
      if(!ctx)
        ctx = cvs.getContext('2d');

      var fill = ctx.fillStyle;
      ctx.fillStyle = "red";
      ctx.fillRect(this.origin[0],this.origin[1],4,4);
      ctx.fillStyle = fill;

      ctx.beginPath()
      ctx.moveTo(this.points[0][0]*u,this.points[0][1]*u);
      var bc = this.calcBarycentre();
      this.points.forEach(function(e){
        ctx.lineTo(e[0]*u,e[1]*u);
      });
      ctx.lineTo(this.points[0][0]*u,this.points[0][1]*u);
      ctx.closePath();
      ctx.fill();
    }
  }
  calcBarycentre() {
    //TODO: cache barycentre
    var avg = [0,0];
    var num = this.points.length;
    this.points.forEach(function(e){
      avg[0] += e[0]/num;
      avg[1] += e[1]/num;
    });
    return avg;
  }
  shiftAllFromInitial(vector){
    vector[0] -= this.transformHistory.shift[0];
    vector[1] -= this.transformHistory.shift[1];
    this.points.forEach(function(e){
      var dx,dy,newDx,newDy;
      e[0] += vector[0];
      e[1] += vector[1];
    });
    this.origin[0] += vector[0];
    this.origin[1] += vector[1];
    this.transformHistory.shift[0]+=vector[0];
    this.transformHistory.shift[1]+=vector[1];
  }
  shiftAll(vector){
    this.points.forEach(function(e){
      var dx,dy,newDx,newDy;
      e[0] += vector[0];
      e[1] += vector[1];
    });
    this.origin[0] += vector[0];
    this.origin[1] += vector[1];
    this.transformHistory.shift[0]+=vector[0];
    this.transformHistory.shift[1]+=vector[1];
  }
  // representativeDimension(){
  //   var bc = this.calcBarycentre();
  //   var maxdist = 0;
  //   this.points.forEach(function(e){
  //     var d = distance(e,bc);
  //     if(d>maxdist){
  //       maxdist = d;
  //     }
  //   });
  //   return maxdist;
  // }

  scaleAll(factor){
    var origin = this.origin;
    this.points.forEach(function(e){
      var dx,dy,newDx,newDy;
      e[0] = origin[0] + factor*(e[0]-origin[0]);
      e[1] = origin[1] + factor*(e[1]-origin[1]);
    });
    this.transformHistory.scale*=factor;
    this.dims.hypo*=factor;

  }
  scaleAllNormalised(factor){
    this.scaleAll(factor/this.dims.hypo);
    this.dims.hypo=factor;
  }
  rotateAll(angle){
    var origin = this.origin;
    var s = Math.sin(angle),
      c = Math.cos(angle);
    this.points.forEach(function(e){
      var dx,dy,newDx,newDy;
      dx = (e[0]-origin[0]);
      dy = (e[1]-origin[1]);
      newDx = c*dx-s*dy;
      newDy = s*dx+c*dy;
      e[0] = origin[0] + newDx;
      e[1] = origin[1] + newDy;
    });
    this.transformHistory.rotate+=angle;
  }

  spawnImageToCanvas(canv,ctx){
    if(this.src == null){
      return null;
    }
    if(typeof ctx == 'undefined'){
      ctx = canv.getContext('2d');
    }
    if(this.imageElement == null || typeof this.imageElement == 'undefined'){
      this.imageElement = document.createElement('img');
    }
    var transform = this.transformHistory;
    this.imageElement.onload = function(){
      ctx.save();
      var scale = transform.scale/4;
      var scaleInv = 1/scale;
      // scaleInv = 1;
      ctx.scale(scale,scale);
      // ctx.rotate(transform.rotate);
      // calculating fucking ass shitting inverse of rotation and 
      // scale to draw image properly after transform
      // WHY WOULD THIS BE NECESSARY IN ANY SYSTEM MADE
      // BY A PERSON WITH A NONNEGATIVE AMOUNT OF BRAINCELLS?
      ctx.rotate(transform.rotate);
      var dx,dy,newDx,newDy;
      dx = transform.shift[0];
      dy = transform.shift[1];
      newDx = Math.cos(-transform.rotate)*dx-Math.sin(-transform.rotate)*dy;
      newDy = Math.sin(-transform.rotate)*dx+Math.cos(-transform.rotate)*dy;
      newDx *= scaleInv;
      newDy *= scaleInv;
      ctx.translate(newDx,newDy);
      ctx.drawImage(this,0,0);
      ctx.restore();
      ctx.resetTransform();
    }
    // ctx.strokeRect(0,0,20,200);
    this.imageElement.src = this.src;
    return this.imageElement;
  }
  spawnImageToDOM(paren){
    if(this.src == null){
      return null;
    }
    if(this.imageElement == null){
      this.imageWrap = document.createElement("div");
      this.imageElement = document.createElement("img");
      this.imageWrap.appendChild(this.imageElement);
      this.imageElement.src = this.src;
      paren.appendChild(this.imageWrap);
    }
    var transformString = 'scale('+this.transformHistory.scale/4+') rotate('+this.transformHistory.rotate+'rad)';
    var leftString = this.transformHistory.shift[0]+"px";
    var topString = this.transformHistory.shift[1]+"px";
    this.imageWrap.style.transform = transformString;
    this.imageWrap.style.position = "absolute";
    this.imageWrap.style.display = "absolute";
    this.imageWrap.style.top = topString;
    this.imageWrap.style.left = leftString;
    this.imageWrap.style.transformOrigin = "0 0";
    this.imageWrap.classList.add('spawned-image--wrap');
    if(typeof this.imageClass !== 'undefined'){
      this.imageWrap.setAttribute('class',this.imageClass.join(' '));
    }
    this.imageElement.style.transformOrigin = "center center";
    return this.imageElement;
  }
  translateAll(shiftVec) {
    this.points.forEach(function(e){
      e[0]+=shiftVec[0];
      e[1]+=shiftVec[1];
    });

    return this;
  }
  calcMinBoundingBox() {
    var maxX = 0,minX = window.innerWidth,maxY = 0,minY = window.innerHeight;

    this.points.forEach(function(e){
      if(e[0]<minX) minX=e[0];
      if(e[0]>maxX) maxX=e[0];
      if(e[1]<minY) minY=e[1];
      if(e[1]>maxY) maxY=e[1];
    });
    // return {maxX:maxX,minX:minX,maxY:maxY,minY:minY};
    return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
    // return {x:origin[0],y:origin[1],width:this.dims.w,height:this.dims.h};
  }
  //homoeroticismus:
*
}

function sizeDecrement(t){
  return 0.04*(t - (t % BATCHSIZE))/BATCHSIZE;
}
function spiral(t){ // todo: make difference instead of full spiral (added at each step)
  var alpha = t * 2 * Math.PI / 180; //angle seems an appropriate unit of rotation
  var dr = t/5;

  return [dr*Math.cos(alpha),-dr*Math.sin(alpha)];
}
function diffSpiral(t){ // todo: make difference instead of full spiral (added at each step)
  var alphaPrev = (t-1) * 2 * Math.PI / 180; //angle seems an appropriate unit of rotation
  var drPrev = (t-1)/5;
  var alpha = t * 2 * Math.PI / 180; //angle seems an appropriate unit of rotation
  var dr = t/5;
  // TODO: return spiral(t) - spiral(t-1);

  return [dr*Math.cos(alpha)-drPrev*Math.cos(alphaPrev),-(dr*Math.sin(alpha)-drPrev*Math.sin(alphaPrev))];
}

function doListsCollide(a,b){
  var is = greinerHormann.intersection(a,b);
  if(is){
    return true;
  }else
    return false;

  // var num = b.length;
  // for(var k = 0; k < num; k++){
  //   if( pointInsidePolygon(b[k],a) ){
  //     return true;
  //   }
  // }
  //   return false;
}


function collideWithObstacles(collideCallback){
  //homoioskedasticita 
  var obstacles = document.querySelectorAll('[data-collides], .collides');

  // var obstaclePolys = [];
  obstacles.forEach(function(elem){
    if(typeof window.obstaclesHash == 'undefined'){
      window.obstaclesHash = new SpatialHash(11);
    }
    var x = elem.offsetLeft;
    var y = elem.offsetTop;
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;
    var fauxPoints = [
      [x,y],[x,y+h],
      [x+w,y+h],[x+w,y]
    ];
    var bbox = {x:x,y:y,w:w,h:h};
    var potentialCollisions = window.obstaclesHash.retrieve(bbox);
    potentialCollisions.forEach(function(data){
      var poly = window.allPolygons[data.polyRef];
      // console.log(poly.points,fauxPoints);
      if(doListsCollide(poly.points,fauxPoints)){
        collideCallback.call(this,poly,data.polyRef);
      }
    });
    /*homoeroticismus:
**/
  });

  // return obstaclePolys;
  //homoeroticismus:
*
}

// handle window resize
window.addEventListener('resize',function(){
  window.allHeight = documentSize().h;
  window.allPolygons.forEach(function(poly){
    if (poly == null)
      return;
    if(poly.imageElement !== null){
      poly.imageElement.classList.remove('hidden');
    }
  });
  collideWithObstacles(function(collidingPoly,indexOfPoly){
    if(collidingPoly.imageElement !== null){
      deleteElement(collidingPoly.imageElement);
      // collidingPoly.imageElement.classList.add('hidden');
      // window.allPolygons[indexOfPoly] = null;
      collidingPoly.shiftAll([-10000,-10000]);//temporary solution: shift out of collision boundary
    }
  });
});
// document.addEventListener('DOMContentLoaded',getObstacleData);

function actOnList(list,drawCallback){
  if(typeof window.obstaclesHash == 'undefined'){
    window.obstaclesHash = new SpatialHash(11);
  }
  if(typeof window.collisionHash == 'undefined'){
    window.collisionHash = new SpatialHash(5);
  }
  len = list.length;
  window.tempPolyList = [];
  var then = performance.now();
  window.allHeight = documentSize().h;
  // for(var i = 0; i < POLYGONS; i++){
  function makePoly(i,tries){
  var failed = false;
    if(i>POLYGONS){
      window.clearInterval(window.drawLoop);
      console.log("more polygons than is healthy");
    }

    var dataCopy = JSON.parse(JSON.stringify(list[i % len]));
    var poly = new Polygon(dataCopy.pts,dataCopy.dims,dataCopy.src);
    var dim = (MINDIM + Math.random()*(MAXDIM-MINDIM))*(1-sizeDecrement(tries));

    var angle = Math.random()*2*Math.PI;
    var scrollTop = pageYOffset || (document.documentElement.clientHeight ? document.documentElement.scrollTop : document.body.scrollTop) || 0;
    var randomPos = [
      window.innerWidth*((WOFFSET)+Math.random()*(1-2*WOFFSET)),
      window.allHeight*((HOFFSET)+Math.random()*(1-2*HOFFSET))
    ];

    var gridX = Math.floor(randomPos[0] / CELLSIZE);
    var gridY = Math.floor(randomPos[1] / CELLSIZE);


    if (typeof window.imagesGrid[gridX] == 'undefined')
      window.imagesGrid[gridX] = [];
    if (typeof window.imagesGrid[gridX][gridY] == 'undefined')
      window.imagesGrid[gridX][gridY] = [];
    if (window.imagesGrid[gridX][gridY] > MAXINCELL){
      failed = true;
      return false;
    }
    poly.gridRef = [gridX,gridY,window.imagesGrid[gridX][gridY].length];
    var shit = document.createElement("div");
    shit.style.position = "absolute";
    shit.style.width = CELLSIZE+"px";
    shit.style.height = CELLSIZE+"px";
    shit.style.left = gridX*CELLSIZE+"px";
    shit.style.top = gridY*CELLSIZE+"px";
    shit.style.border = "1px solid white";
    shit.style.background = "black";
    shit.innerText = window.imagesGrid[gridX][gridY].length;
    document.body.appendChild(shit);
    poly.shiftAll(randomPos);
    poly.scaleAllNormalised(dim);
    poly.rotateAll(angle);
    var para = 1;
    var collide = true;
    var obstacles = document.querySelectorAll('[data-collides], .collides');
    var obstacleList = [];
    obstacles.forEach(function(elem){
      var x = elem.offsetLeft;
      var y = elem.offsetTop;
      var w = elem.offsetWidth;
      var h = elem.offsetHeight;
      var fauxPoints = [
        [x,y],[x,y+h],
        [x+w,y+h],[x+w,y]
      ]; //TODO: get rid of temp variables
      obstacleList.push(fauxPoints);
    });
    var tempHash = null;
    var cnt = 0;
    // while(collide){
    //   collide = false;
    //   var a, potentialCollisions;
    //   function onlyUnique(value, index, self) { 
    //     return self.indexOf(value) === index;
    //   }
    //   a = collisionHash.retrieve(poly.calcMinBoundingBox());
    //   potentialCollisions = a.filter( onlyUnique ); // returns ['a', 1, 2, '1'] // TODO: polyfill filter
    //
    //   //TODO: fix hash so that it doesn't return duplicate elements
    //   console.log("PCLAPL:",potentialCollisions.length,window.allPolygons.length)
    //
    //   obstacleList.some(function(e){ //TODO: check if collision is even possible
    //     collide = doListsCollide(poly.points,e);
    //     return collide;
    //   });
    //   if(collide){
    //     para++;
    //     poly.shiftAll(diffSpiral(SPIRALSPEED*(para)));
    //     poly.rotateAll(SPIRALSPEED);
    //     var gridX = Math.floor(poly.origin[0] / CELLSIZE);
    //     var gridY = Math.floor(poly.origin[1] / CELLSIZE);
    //
    //     var shit = document.createElement("div");
    //     shit.style.position = "absolute";
    //     shit.style.width = CELLSIZE+"px";
    //     shit.style.height = CELLSIZE+"px";
    //     shit.style.left = gridX*CELLSIZE+"px";
    //     shit.style.top = gridY*CELLSIZE+"px";
    //     shit.style.border = "1px solid white";
    //     shit.style.background = "black";
    //     shit.innerText = window.imagesGrid[gridX][gridY].length;
    //     document.body.appendChild(shit);
    //     poly.gridRef = [gridX,gridY,window.imagesGrid[gridX][gridY].length];
    //     if(para > MAXSHIFTS){
    //       failed = true;
    //       break;
    //     }
    //   }
    //   else{
      obstacleList.some(function(e){ //TODO: check if collision is even possible
        collide = doListsCollide(poly.points,e);
        return collide;
      });
      if(collide){
        failed = true;
      }
        var docSize = documentSize();
        if(poly.origin[1] > docSize.height || poly.origin[1] > document.querySelector('footer').offsetTop)
          failed = true;
        if(poly.origin[0] < -PADDING || poly.origin[0] > docSize.width + PADDING)
          failed = true;
        if(poly.origin[1] > docSize.height || poly.origin[1] > document.querySelector('footer').offsetTop)
          failed = true;
        if (!failed){
          window.allPolygons.push(poly);
          window.imagesGrid[gridX][gridY].push(poly);
          var bb = poly.calcMinBoundingBox();
          bb.polyRef = window.allPolygons.length-1;
          collisionHash.insert(bb);
          obstaclesHash.insert(bb);
          return poly;
        }
      // }
    // }

    return !failed;
  }

  var i = 0;
  window.drawLoop = window.setInterval(function(){
    var many = 1 + Math.floor(Math.random()*2);
    var newPolys = [];
    while(many-->=0){
      var tries = 0;

      var madePoly = makePoly(i,tries);
      while ((madePoly == false) && (tries < MAXTRIES)){ //try to place one at most 10 times
        tries++;
        madePoly = makePoly(i,tries);
      }
      if(madePoly){
        newPolys.push(madePoly);
        i++;
      }

    }
    drawCallback.call(this,newPolys);
  },Math.floor(UPDATEEVERY*1000));
  // })gcc;
}

var initPolys = function(srcs,drawCallback){
  window.len = srcs.length;//TODO: check cross-browser globality
  srcs.forEach(function(e){
    var img = asyncImageOutline(e,MINALPHA,MAXSIZE,function(promisedPoints,passedSrc,dims){handleImages(passedSrc,promisedPoints,
      dims,actOnList.bind(this,imgs,drawCallback));});
  });
}
// random enough string via https://stackoverflow.com/a/105074
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
// canvas methods

var initCanvas = function(rootElem, extra = {}){
  var canvas,context;
  if(extra.hasOwnProperty('id')){
    if(window.canvases){
      if(typeof window.canvases[extra.id] !== 'undefined')
        canvas = window.canvases[extra.id];
    } else {
      window.canvases = {};
    }
  }else{
    extra.id = guid();
  }
  //TODO: set canvas to inited after first init, turning this to getter
  if(typeof canvas == 'undefined'){
    canvas = document.createElement('canvas');
    window.canvases[extra.id] = canvas;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
  }
  context = canvas.getContext('2d');
  rootElem.appendChild(canvas);
  if(extra.hasOwnProperty('depth')){ //TODO: implement robustly
    canvas.setAttribute('data-depth',extra.depth);
  }
  if(extra.hasOwnProperty('fillWindow')){ //TODO: implement robustly
    if(extra.fillWindow !== false && extra.fillWindow !== 'false'){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight
    }
  }
  if(extra.hasOwnProperty('autoResize')){ //TODO: implement robustly
    if(extra.autoResize !== false && extra.autoResize !== 'false'){
      var w =100,h=100;
      if( extra.autoResize.constructor == Array){
        w = extra.autoResize[0];
        h = extra.autoResize[1];
      }
      else if(extra.autoResize !== null && typeof extra.autoResize === 'object'){
        w = extra.autoResize.w;
        h = extra.autoResize.h;
      }
      var resizeHook = null;
      if(extra.hasOwnProperty('resizeHook')){ //TODO: implement robustly
        if(extra.autoResize !== false && extra.autoResize !== 'false'){
          resizeHook = extra.resizeHook.bind(this,canvas,context);
        }
      }
      var actions = function(canvasElem,widthMultiplier,heightMultiplier,hook){
        window.wscale = window.innerWidth/w;//maybe fuqqup
        window.hscale = window.innerHeight/h;
        canvasElem.width =  widthMultiplier/100*window.innerWidth;
        canvasElem.height = heightMultiplier/100*documentSize().h;
        console.log(documentSize());
        if(typeof hook !== 'undefined' && hook !== null)
          hook.call();
      }
      window.addEventListener('resize',actions.bind(this,canvas,w,h,resizeHook));
      document.addEventListener('DOMContentLoaded',actions.bind(this,canvas,w,h,resizeHook));
      actions.call(this,canvas,w,h,resizeHook);
    }
  }
  // if(extra.hasOwnProperty('resizeHook')){ //TODO: implement robustly
  // 	if(extra.autoResize !== false && extra.autoResize !== 'false'){
  // 		window.addEventListener('resize',extra.resizeHook.bind(this,canvas,context),false);
  // 	}
  // }
  return {canvas: canvas, context: context};
}
//homoioskedasticita
//
//asdasdasdasd
//
//asdasdasdasd
//homoeroticismus:
*
