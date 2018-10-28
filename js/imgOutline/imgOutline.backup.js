
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

// helper function to prepare batch of images -- they have to be worked with as a whole
var prepareImageOutlines = function(imgs,alphaThreshold,maxDim,allCallback){
  var len = imgs.length;
  var ctr = 0;
  polygonsList = [];
  imgs.forEach(function(e){ //converts transparent image to array of points along outline

  if(typeof wrap == 'undefined'){//if only one argument passed, scale so that that is maximum dimension
    wrap = document.body;
  } 
    var canv = document.createElement('canvas');
    var ctx	= canv.getContext('2d');
    var img	= new Image();

    // var points = [];

    img.onload = function(){
      var dim = img.getScaledDimensions(maxDim);
      canv.width = dim.w;
      canv.height = dim.h;
      ctx.clearRect(0,0,dim.w,dim.h);
      ctx.drawImage(img,0,0,dim.w,dim.h);
      var arr = ctx.getImageData(0,0,dim.w,dim.h);
      // console.log("awal",arr.width,arr.height);
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
        // console.log("first non-transparent pixel in line ",y," has coordinate ",i/4 % arr.width);
        topMost = [i/4 % arr.width,Math.floor(i/4/arr.width)];
        // console.log(topMost, isNaN(topMost[0]),isNaN(topMost[1]));

        i = ibegin+4*arr.width;
        //Go through line backwards to find last
        while(arr.data[i+3] < alphaThreshold)
          i-=4;

        // arr.data[i]= arr.data[i+1] = arr.data[i+2] = 0;
        // if(i>0)
        botMost = [i/4 % arr.width,Math.floor(i/4/arr.width)];
        // console.log(botMost, isNaN(botMost[0]),isNaN(botMost[1]));
        // console.log("last non-transparent pixel in line ",y," has coordinate ",i/4 % arr.width);
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
        // console.log(leftMost, isNaN(leftMost[0]),isNaN(leftMost[1]));

        j = jbegin + 4*arr.width*(arr.height-1);

        console.log("left",leftMost,leftMost[0],leftMost[1],j);

        while(arr.data[j+3] < alphaThreshold)
          j-=4*arr.width;

        // if(i>0)
          rightMost = [j/4 % arr.width,Math.floor(j/4/arr.width)];
          // console.log(rightMost, isNaN(rightMost[0]),isNaN(rightMost[1]));
          console.log("right",rightMost,rightMost[0],rightMost[1],j);

        j = jbegin + 4;
        if(!((leftMost[0]<0 || leftMost[0]>=arr.width) || (rightMost[0]<=0 || rightMost[0]>arr.width))){
          points.push(rightMost);
          points.push(leftMost);
          // console.log(right[right.length-1],"right");
        }
        //homoeroticismus:
*
      }

      // points = top.concat(left).concat(right).concat(bottom); //TODO: refrain from using four unnecessary sub-Arrays
      // console.log(top,left,bottom,right);
      // console.log(performance.now()-t,'ms passed before script finished');
      // ctx.clearRect(0,0,dim.w,dim.h);
      // ctx.putImageData(arr,0,0);
      // points.forEach(function(p){
        // ctx.fillRect(p[0],p[1],2,2);
      // });
      console.log("POINTS ARRAY SUDDENLY CONTAINS [NaN,NaN]",points);
      polygonsList.push({image:e,outlinePoints:points});
      ctr++;
      if(ctr >= len){
        //if this is the final image from the list, call callback for all images
        console.log("FINAL POLY LIST", polygonsList);
        allCallback.call(this,polygonsList);
        return polygonsList;
      }
    }
    img.src	= e;
  });
  }

