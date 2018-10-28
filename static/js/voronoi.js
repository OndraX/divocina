
/* vim: set foldmethod=marker foldmarker=homoioskedasticita,homoeroticismus:
**/
const IMG = {
	'siska':'../assets/particles/siska_orez.png',
	'houba':'../assets/particles/houba.png'
};
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
loadJS('./js/voronoi/rhill-voronoi-core.js', function(){console.log('voronoi loaded');}, document.body);
loadJS('./js/lodash/core.js', function(){console.log('lodash loaded');}, document.body);
// loadJS('./js/d3plus/d3plus.js', function(){console.log('d3plus loaded');}, document.body);
loadJS('./js/polyfills/es5-shim/es5-shim.js', function(){console.log('es5 shim loaded');}, document.body);
loadJS('./js/poly-collisions/greiner-hormann.min.js', function(){console.log('polygon collisions loaded');}, document.body);
loadJS('./js/quadtree/quadtree.js', function(){console.log('quadtree collisions loaded');}, document.body);
var initCanvas = function(rootElem, extra = {}){
	//TODO: set canvas to inited after first init, turning this to getter
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	rootElem.appendChild(canvas);
	if(_.has(extra,'fillWindow')){ //TODO: implement robustly
		if(extra.fillWindow !== false && extra.fillWindow !== 'false'){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight
		}
	}
	if(_.has(extra,'autoResize')){ //TODO: implement robustly
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
			if(_.has(extra,'resizeHook')){ //TODO: implement robustly
				if(extra.autoResize !== false && extra.autoResize !== 'false'){
					resizeHook = extra.resizeHook.bind(this,canvas,context);
				}
			}
			var actions = function(canvasElem,widthMultiplier,heightMultiplier,hook){
				window.wscale = window.innerWidth/W;
				window.hscale = window.innerHeight/H;
				// console.log(canvasElem,widthMultiplier,heightMultiplier)
				canvasElem.width =  widthMultiplier/100*window.innerWidth;
				canvasElem.height = heightMultiplier/100*window.innerHeight
				resizeHook.call();
			}
			window.addEventListener('resize',actions.bind(this,canvas,w,h,resizeHook));
			document.addEventListener('DOMContentLoaded',actions.bind(this,canvas,w,h,resizeHook));
		}
	}
	// if(_.has(extra,'resizeHook')){ //TODO: implement robustly
	// 	if(extra.autoResize !== false && extra.autoResize !== 'false'){
	// 		window.addEventListener('resize',extra.resizeHook.bind(this,canvas,context),false);
	// 	}
	// }
	return {canvas: canvas, context: context};
}
// config constants [TODO: make cross-browser]
const POINTS = 100;
const W = 150;
const H = 100
var tesselate = function(element){
	// config constants [TODO: make cross-browser]
	const POINTS = 50;
	const W = 150;
	const H = 100

	//Get set of random points

 window.points = [];
	window.wscale = window.innerWidth/W;
	window.hscale = window.innerHeight/H;
	for(var i = 0; i < POINTS; i++){
		points.push([Math.floor(Math.random()*W),Math.floor(Math.random()*H)]);
	}

	function makeTesselation(canvas,points){
		var voronoi = new Voronoi();
		var bbox = {xl: 0, yt: 0, xr: canvas.width, yb: canvas.height};
		var diagram = voronoi.compute(points, bbox);
		console.log("time:",diagram.execTime);
		return diagram;
	}

	function scaleToFull(set,baseWidth,baseHeight){
		set.forEach(function(e){
			var eRep= [e[0]*window.wscale,e[1]*window.hscale];
			e = eRep;
		});
		return set;
	}

	function arraySetToObjectSet(set){
		var setNew = [];
		set.forEach(function(e){
			setNew.push({x:e[0],y:e[1]});
		});

		return setNew;

	}

	function drawImageScaled(cvs,ctx,src,ltCoords,rbCoords){

	};

	//Draw tesselated polygons
	function draw(cvs,ctx){

		const LIST = ['siska','houba'];

		console.log("draw", cvs,ctx);
		var tesselation = makeTesselation(cvs,arraySetToObjectSet(scaleToFull(points,W,H)));
		var vorEdges = tesselation.edges;
		var vorCells = tesselation.cells;

    tesselation.cells.slice(7,11).forEach(function(cell){
    // var site = cell.site;
      var site = [cell.site.x*wscale,cell.site.y*hscale];
      ctx.strokeRect(site[0],site[1],2,2);
      var vertices = [];
    ctx.beginPath();
      cell.halfedges.forEach(function(halfedge){
        vertices.push([halfedge.edge.va.x,halfedge.edge.va.y]);
        var edge = halfedge.edge;
      	if(edge.lSite !== null && edge.rSite !== null){
      	ctx.moveTo(edge.vb.x*wscale,edge.vb.y*hscale);
      	ctx.lineTo(edge.va.x*wscale,edge.va.y*hscale);
      	}
      });
      console.log(vertices,polylabel(vertices,2,true));
      ctx.closePath();
      ctx.stroke();
    });
    console.log(tesselation.cells,"CELLOS HELLO");

		// points.forEach(function(p){
		// 	ctx.strokeRect(p[0],p[1],2,2);
		// });
		ctx.beginPath();
		// vorEdges.forEach(function(e){
		// 	if(e.lSite !== null && e.rSite !== null){
		// 	ctx.moveTo(e.vb.x*wscale,e.vb.y*hscale);
		// 	ctx.lineTo(e.va.x*wscale,e.va.y*hscale);
		// 	}
		// });
			ctx.stroke();

	}
	var canv = initCanvas(element,{
		autoResize: true,
		resizeHook: function(canvas,context){
			context.strokeRect(10,10,canvas.width-20,canvas.height-20);
			draw(canvas,context);
		}});
	var canvElem = canv.elem;
	var ctx = canv.context;

}
// }



