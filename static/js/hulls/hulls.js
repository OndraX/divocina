
/* vim: set foldmethod=marker foldmarker=homoioskedasticita,homoeroticismus:
**/
function orderConcaveClockwise(points,groupColWidth){
  if(typeof groupColWidth == 'undefined'){
    groupColWidth = 0;
  }
  // TODO: optimise (scrap use of temporary arrays and so on)
  var bottom = [];
  var topArr = [];
  var newPoints = [];
  function compareY(a,b){
    return a[1] - b[1];
  }
  function compareX(a,b){
    return a[0] - b[0];
  }
  newPoints = points.sort(compareX);
  var lastX;
  var minY,maxY;
  var arrs = [],tempArr = [];
  var topArr = [], bottom = [];
  for (i=0,n=newPoints.length;i<n;i++){
    var pt = newPoints[i];
    if (pt[0] - lastX < groupColWidth){
      function compareX(a,b){
        return a[0] - b[0];
      }
      tempArr.push(pt);
    }else{
    lastX = pt[0];
      if(tempArr.length > 1){ //discard one-point
        //arrays -- min same as max makes polygon weird
        arrs.push(tempArr);
      }
      tempArr = [pt];
    }

  }
  arrs.forEach(function(e){
    e.sort(compareY);
    topArr.push(e[0]);
    bottom.unshift(e[e.length-1]);//push backward (bottom needs to be in opposite x-order) 
  });
  return topArr.concat(bottom);
}
function convexHull(points) {
  points = points.slice(0)
  let n = points.length;
  function cmpr(a, b) {
    return a[0]-b[0];
  }
  points.sort(cmpr);

  // topArr
  let topArr = [];
  for (let i = 0; i < n; ++i) {
    //console.log(topArr);
    //console.log(i);
    if (topArr.length <= 1) topArr.push(points[i]);
    else {
      let last = topArr[topArr.length-1];
      let beflast = topArr[topArr.length-2];

      let u = [points[i][0] - beflast[0], points[i][1] - beflast[1]];
      let v = [last[0] - beflast[0], last[1] - beflast[1]];

      let d = u[0]*v[1] - u[1]*v[0];
      //console.log(u);
      //console.log(v);
      //console.log(d);
      //console.log("##");
      if (d >= 0) {
        i--;
        topArr.pop();
      } else {
        topArr.push(points[i]);
      } 
    }
  }

  // Bottom
  let bottom = [];
  for (let i = 0; i < n; ++i) {
    if (bottom.length <= 1) bottom.push(points[i]);
    else {
      let last = bottom[bottom.length-1];
      let beflast = bottom[bottom.length-2];

      let u = [points[i][0] - beflast[0], points[i][1] - beflast[1]];
      let v = [last[0] - beflast[0], last[1] - beflast[1]];

      let d = u[0]*v[1] - u[1]*v[0];

      if (d <= 0) {
        i--;
        bottom.pop();
      } else {
        bottom.push(points[i]);
      } 
    }
  }

  bottom.reverse()
  bottom.pop();
  topArr.pop();
  return topArr.concat(bottom);
}

function convexConcaveHull(points) {
  points = points.slice(0)
  let n = points.length;
  function cmpr(a, b) {
    return a[0]-b[0];
  }
  points.sort(cmpr);

  // topArr
  let topArr = [];
  for (let i = 0; i < n; ++i) {
    //console.log(topArr);
    //console.log(i);
    if (topArr.length <= 1) topArr.push(points[i]);
    else {
      let last = topArr[topArr.length-1];
      let beflast = topArr[topArr.length-2];

      let u = [points[i][0] - beflast[0], points[i][1] - beflast[1]];
      let v = [last[0] - beflast[0], last[1] - beflast[1]];

      let d = u[0]*v[1] - u[1]*v[0];
      //console.log(u);
      //console.log(v);
      //console.log(d);
      //console.log("##");
      if (d >= 0) {
        i--;
        topArr.pop();
      } else {
        topArr.push(points[i]);
      } 
    }
  }

  // Bottom
  let bottom = [];
  for (let i = 0; i < n; ++i) {
    let used = false;
    for (let j = 0; j < topArr.length; ++j) {
      if (topArr[j][0]==points[i][0] && topArr[j][1]==points[i][1]) {
        used = true;
        break;
      }
    }
    if (!used) {
      bottom.push(points[i]);
    }
  }

  bottom.reverse()
  return topArr.concat(bottom);
}

function concaveHull(points) {
  points = points.slice(0)
  let n = points.length;
  function cmpr(a, b) {
    return a[0]-b[0];
  }
  points.sort(cmpr);

  // topArr
  let topArr = [];
  for (let i = 0; i < n; ++i) {
    let used = false;
    for (let j = 0; j < topArr.length; ++j) {
      if (topArr[j][0]==points[i][0] && topArr[j][1]==points[i][1]) {
        used = true;
        break;
      }
    }
    if (!used) {
      topArr.push(points[i]);
    }
  }

  // Bottom
  let bottom = [];
  for (let i = 0; i < n; ++i) {
    let used = false;
    for (let j = 0; j < topArr.length; ++j) {
      if (topArr[j][0]==points[i][0] && topArr[j][1]==points[i][1]) {
        used = true;
        break;
      }
    }
    if (!used) {
      bottom.push(points[i]);
    }
  }

  // bottom.reverse()
  return top.concat(bottom);
}
