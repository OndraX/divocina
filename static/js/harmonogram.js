const daysEnum = ['Čtvrtek','Pátek','Sobota'];
const daysSansLocale = ['ctvrtek','patek','sobota'];
const classesEnum = ['Aula','USV','Sborovna','P2.3','P2.2','P2.1'];
const timesByDayEnum = [['18:45','19:30',
  '20:15','21:00'],['10:00','12:00','13:00',
'15:00','17:00','20:00'],['10:00','12:00','13:00',
  '15:00','17:00','20:00']];
function createDOM(obj,text,properties,parent){

  var o= document.createElement(obj);

  for (var name in properties){
    //TODO: traverse tree if object(css)
    if(properties.hasOwnProperty(name)){
      o.setAttribute(name,properties[name]);
    }   
  }

  o.innerHTML = text;

  parent.appendChild(o);
  return o;
}

var clipStringToLength = function(str, length,spaceBuffer){
  if(typeof spaceBuffer == 'undefined'){
    spaceBuffer = 8; //how many characters to allow for finding whitespace in cut
  }
  if(length+spaceBuffer >= str.length){
    return str;
  }

  if(str.indexOf(' ') == -1){
    return str.substring(0,Math.min(length,str.length))+'…';
  }

  var firstSpaceAfter = length + str.substring(length,str.length).indexOf(' ');
    if ( firstSpaceAfter - length < spaceBuffer && firstSpaceAfter <= str.length-4){
      // return "SHIT";
      return str.substring(0,firstSpaceAfter) + ' …';
    }
  var firstSpaceBefore = str.substring(0,length).lastIndexOf(' ');
    // if (firstSpaceBefore > length - spaceBuffer && firstSpaceBefore > 4){
  //   // return "HITS";
    // return str.substring(0,firstSpaceBefore) + ' …';
  // }
  // return str.substring(0,firstSpaceBefore)+"0"+str.substring(firstSpaceBefore,firstSpaceAfter)+"0"+str.substring(firstSpaceAfter,str.length);
  return str;
  
}
String.prototype.toBactrianCamelCase = function(str){//capitalise even the beginning -- convert name to ref
  return this.split(' ').map(function(word,index){
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}
String.prototype.titlify = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function build(data,parent){
}

var dataToHarm = function(data){
// var hiddenElement = document.createElement('a');
// hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(data));
// hiddenElement.target = '_blank';
// hiddenElement.download = 'harm.json';
// hiddenElement.click();

  arrsByDay = [],finalArr = [];
  daysSansLocale.forEach(function(day,ind){
    if (typeof arrsByDay[ind] == 'undefined'){
      arrsByDay[ind] = [];
    }
    arrsByDay[ind] = data[day].rows;
  });
  arrsByDay.forEach(function(row,dayNum){
    row.forEach(function(cell){
      var dayInd = timesByDayEnum[dayNum].indexOf(cell.cas);
      if (typeof finalArr[dayNum] == 'undefined' || finalArr[dayNum].length < 1){
        finalArr[dayNum] = {ind:dayNum,list:{}};
      }
      if (typeof finalArr[dayNum].list[dayInd]== 'undefined'){
        finalArr[dayNum].list[dayInd] = [];
      }
      finalArr[dayNum].list[dayInd].push(cell);
    });
  });
  var initPolys = function(srcs,drawCallback){
    window.len = srcs.length;//TODO: check cross-browser globality
    srcs.forEach(function(e){
      var img = asyncImageOutline(e,MINALPHA,MAXSIZE,function(promisedPoints,passedSrc,dims){handleImages(passedSrc,promisedPoints,
        dims,actOnList.bind(this,imgs,drawCallback));});
    });
  }
  return finalArr;
}

var makeHarmRequest = function(url,element){
  const Http = new XMLHttpRequest();
  Http.open("GET", url);
  Http.setRequestHeader('Content-Type','application/json');
  Http.onreadystatechange=function(e){
    if (Http.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
      if (Http.status == 200) {
        var rawData = JSON.parse(Http.responseText);

        initHarm(dataToHarm(rawData),element);
      }
      else if (Http.Http == 400) {
        alert('There was an error 400');
      }
      else {
        alert('something else other than 200 was returned');
      }
    }
  }	
  Http.send();
}


  function initHarm(data,harmonogram){
    // remove all children so as not to get multiple tables
        for(var i = harmonogram.childNodes.length - 1; i >= 0; --i) {
                harmonogram.removeChild(harmonogram.childNodes[i]);
              }
    //BEGIN
    var tableCount = 0;
    daysEnum.forEach(function(day,dayNum){
      createDOM('h4',day,{class:'table-harm table-harm__subheading',},harmonogram);
      var table = createDOM('table','',{'class':'table-harm u-full-width u-max-full-width standard','id':('table_' + String(tableCount++))},harmonogram);
      var th = createDOM('tr','',{'class':'thClass'},createDOM('thead','',{'class':'theadClass','id':'tableHeadId'},table));

      createDOM('td','',{'class':'tableHeaderDataClass first-row first-coll'},th);
      classesEnum.forEach(function(classroom){
        createDOM('td',classroom,{'class':'tableHeaderDataClass first-row'},th);
      });

      timesByDayEnum[dayNum].forEach(function(hourRow,hourNum){


        var row = createDOM('tr','',{'class':'trClass','id':'trId'},table);
        createDOM('span',hourRow,{},createDOM('td','',{'class':'tdClass first-coll'},row));
        if(typeof data[dayNum] !== 'undefined'){
          var listByHour = data[dayNum].list[hourNum];
          if(typeof listByHour !== 'undefined'){
            listByHour.sort(function(a,b){
              return (classesEnum.indexOf(a.trida) - classesEnum.indexOf(b.trida));
            });
            var prev = null;
            for(hour in listByHour){
              var cellObject = listByHour[hour];
              var params = {'class':'tdClass','colspan':0};
              if(cellObject.prednasejici == '0'){
                if(prev !== null){
                  prev.setAttribute('colspan',Math.min(listByHour.length,parseInt(prev.getAttribute('colspan'))+1 | 1));
                }else{
                  prev = createDOM('td','',{'class':'textClass default'},row); 
                  }
                continue;
              }
              var text = clipStringToLength(cellObject.prednasejici, 120, 20);
              if(cellObject.jmeno != 'O'){
                if(cellObject.jmeno.length > 4){
                text+=': '+ clipStringToLength(cellObject.jmeno,34,6);
                }
              }
              // var text = cellObject.prednasejici + ':<br>' + cellObject.jmeno;
              var item = createDOM('td','',params,row);
              prev = item;
              // Create prednaska link
              const doLinks = true;

              if(doLinks){
                var link = createDOM('span',text,{'class':'cursor-default default'},item);
                // item.classList.add('pointable');
                var pred = function(cellObject){
                  return;

                  // alert("PREDNASKA FUNC CALLED");

                  var popup = vex.open({
                    content: '',
                    buttons: null,

                  });
                  var nazev;
                  if(cellObject.hasOwnProperty('jmeno-dlouhe')){ //TODO: check if that not 0
                    nazev = cellObject['jmeno-dlouhe'].titlify()}else{
                      if(typeof cellObject['jmeno'] == 'string')
                        nazev = cellObject['jmeno'].titlify();
                      else
                        nazev = "";
                    }
                  createDOM('h2',nazev,{class:'popupHeading'},popup.contentEl);  
                  if(cellObject['anotace'].length > 0)
                    createDOM('p',cellObject['anotace'],{},popup.contentEl);
                  var displayJmeno = cellObject['prednasejici'];
                  if(cellObject.hasOwnProperty('prednasejici-tituly')) //  TODO: check if that not 0
                  {
                    if(cellObject['prednasejici-tituly'].length > cellObject['prednasejici'].length){
                      displayJmeno = cellObject['prednasejici-tituly'];
                    }
                  }						   createDOM('h2',displayJmeno,{class:'popupHeading'},popup.contentEl);
                  createDOM('p',cellObject['medailon'],{},popup.contentEl);
                  if(cellObject.hasOwnProperty("lide")){

                    cellObject["lide"].forEach(function(e){ //TODO: check if not 0

                      if(typeof e['anotace'] !== 'undefined'){createDOM('p',e['anotace'],{},popup.contentEl);
                      }
                      createDOM('h2',(typeof e['prednasejici-tituly'] !== 'undefined')?e['prednasejici-tituly']:e['prednasejici'],{class:'popupHeading'},popup.contentEl);
                      if(typeof e['medailon'] !== 'undefined'){createDOM('p',e['medailon'],{},popup.contentEl);
                      }

                    })

                  }

                  // if(history.pushState) {
                  // 	history.pushState(null, null, '#'+ cellObject['ref']);
                  // }
                  // else {
                  // 	location.hash = '#' + cellObject['ref'];
                  // }

                };

                link.addEventListener('click',function(e){e.preventDefault(); pred(cellObject)},false);



              }else{
                createDOM('span',text,{'class':'textClass default'},item); 
              }
              // END create prednaska link
            }
          }
        }
      });
    });
    data.forEach(function(day,dayNum){

    });
    //END
    // build(content,harmonogram);

  }


