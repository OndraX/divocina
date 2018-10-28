
/* vim: set foldmethod=marker foldmarker=homoioskedasticita,homoeroticismus:
**/
// Helper function to get an element's exact position
function getPosition(el) {
  var xPos = 0,
      yPos = 0,
      w = el.offsetWidth,
      h = el.offsetHeight;
 
  while (el) {
  var style = window.getComputedStyle(el, null);
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    left: xPos,
    top: yPos,
    width: w,
    height: h,
  };
}

function bboxCollide(a, b) {
      return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );
}
