
/* vim: set foldmethod=marker foldmarker=homoioskedasticita,homoeroticismus:
**/
var src	= '../assets/particles/houba_orez.png';
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
loadJS('./js/poly-collisions/greiner-hormann.min.js', function(){console.log('polygon collisions loaded');}, document.body);
loadJS('./js/quadtree/quadtree.js', function(){console.log('quadtree collisions loaded');}, document.body);


//homoeroticismus:
*
//
var asyncImageOutline = function(src,alphaThreshold,maxDim,callback,wrap){ //converts transparent image to array of points along outline

if(typeof wrap == 'undefined'){
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

    var top = [], right = [], bottom = [], left = [];
    var i = 0;
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
        top.push(topMost);
        bottom.push(botMost);
      } 
      //homoeroticismus:
*
    }
    i = 0;
    while ( i < 4*arr.width){
      //homoioskedasticita
      var ibegin = i;
      while(arr.data[i+3] < alphaThreshold)
        i+=4*arr.width;

      // if(i/4 % arr.width < arr.height)
        leftMost = [i/4 % arr.width,Math.floor(i/4/arr.width)];

      i = ibegin + 4*arr.width*(arr.height-1);

      while(arr.data[i+3] < alphaThreshold)
        i-=4*arr.width;

      // if(i>0)
        rightMost = [i/4 % arr.width,Math.floor(i/4/arr.width)];

      i = ibegin + 4;
      if(!((leftMost[0]<0 || leftMost[0]>=arr.width) || (rightMost[0]<=0 || rightMost[0]>arr.width))){
        left.push(leftMost);
        right.push(rightMost);
      } 

      //homoeroticismus:
*
    }

    points = top.concat(left).concat(right).concat(bottom);
    ctx.clearRect(0,0,dim.w,dim.h);
    // ctx.putImageData(arr,0,0);
    points.forEach(function(p){
      ctx.fillRect(p[0],p[1],2,2);
    });
    callback.call(this,points);
  }
  img.src	= src;
}
