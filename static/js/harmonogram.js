const daysEnum = ['Čtvrtek','Pátek','Sobota'];
const daysSansLocale = ['ctvrtek','patek','sobota'];
const classesByDayEnum = [['Aula','Prostor před ředitelnou'],['Aula','USV','Sborovna','P2.3','P2.2','P2.1','P1.2'],['Aula','USV','Sborovna','P2.3','P2.2','P2.1','P1.2']];
const timesByDayEnum = [['18:45','19:00','19:30','20:15','21:00'],
  ['10:00','12:00','13:00','15:00','17:00','20:00'],
  ['10:00','12:00','13:00','15:00','17:00']];
vex.defaultOptions.className = 'vex-theme-wireframe';
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

    if (firstSpaceBefore > length - spaceBuffer && firstSpaceBefore > 4){
    // return "HITS";
    return str.substring(0,firstSpaceBefore) + ' …';
  }
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


var makeHarmRequest = function(urlArr,element){
  var result = null;
  if(urlArr == null || urlArr == [])
    return -1;

    url = urlArr.shift();
  var Http = new XMLHttpRequest();
  Http.open("GET", url);
  Http.setRequestHeader('Content-Type','application/json');
  Http.onreadystatechange=function(e){
    if (Http.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
      if (Http.status == 200) {
        try{
          var rawData = JSON.parse(Http.responseText);
        } catch(e){
          console.log(e);
            makeHarmRequest(urlArr,element);
        }
        result == true;
        initHarm(dataToHarm(rawData),element);
      }
      else if (Http.Http == 400) {
        if(ind<urlArr.length)
          makeHarmRequest(urlArr,element);
        result = false
      }
      else {
          makeHarmRequest(urlArr,element);
        result = false;
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
      var tableContainer = createDOM('div','',{'class':'make-page'},harmonogram);
      createDOM('h4',day,{class:'table-harm table-harm__subheading',},tableContainer);
      var table = createDOM('table','',{'class':'table-harm u-full-width u-max-full-width standard','id':('table_' + String(tableCount++))},tableContainer);
      var th = createDOM('tr','',{'class':'thClass'},createDOM('thead','',{'class':'theadClass','id':'tableHeadId'},table));

      createDOM('td','',{'class':'tableHeaderDataClass first-row first-coll'},th);
      classesByDayEnum[dayNum].forEach(function(classroom){
        createDOM('td',classroom,{'class':'tableHeaderDataClass first-row'},th);
      });

      timesByDayEnum[dayNum].forEach(function(hourRow,hourNum){

        var row = createDOM('tr','',{'class':'trClass','id':'trId'},table);
        createDOM('span',hourRow,{},createDOM('td','',{'class':'tdClass first-coll'},row));
        if(typeof data[dayNum] !== 'undefined'){
          var tempList = data[dayNum].list[hourNum],
              listByClassroom = [];
          // listByClassroom = data[dayNum].list[hourNum];
          tempList.forEach(function(objInList){
            listByClassroom[objInList.trida] = objInList;
          });
          if(typeof listByClassroom !== 'undefined'){
            
            // listByClassroom.sort(function(a,b){
            //   return (classesByDayEnum[dayNum].indexOf(a.trida) - classesByDayEnum[dayNum].indexOf(b.trida));
            // });
            var prev = null;
            for(var i = 0,l=classesByDayEnum[dayNum].length; i<l; i++){
              var ind = classesByDayEnum[dayNum][i];
              var cellObject = listByClassroom[ind];
              if(typeof cellObject == 'undefined'){
                break;
              }
              var params = {'class':'tdClass','colspan':cellObject.colspan | 1};
              var same = false;
              if(prev !== null){
                if(typeof cellObject == 'undefined'){
                  same = true;
                }else{
                if(cellObject.prednasejici == prev.prednasejici)
                  same = true;
                }
              }
              if(typeof cellObject == 'undefined'){
                 createDOM('td','',{'class':'empty-cell pad-cell'},row); 
              }
              //     if(prev !== null){
              //       prev.setAttribute('colspan',Math.min(listByClassroom.length,parseInt(prev.getAttribute('colspan'))+1 | 1));
              //     }else{
              //       prev = createDOM('td','',{'class':'textClass default'},row); 
              //     }
              //     continue;
              // }else{
              //
              //   if(cellObject.prednasejici == '0' || same){
              //     if(prev !== null){
              //       prev.setAttribute('colspan',Math.min(listByClassroom.length,parseInt(prev.getAttribute('colspan'))+1 | 1));
              //     }else{
              //       prev = createDOM('td','',{'class':'textClass default'},row); 
              //     }
              //     continue;
              //   }
              // }
              if(cellObject.prednasejici == '0'){
                break;
              }
                console.log("CO:",cellObject);
              var text = '<strong>'+clipStringToLength(cellObject.prednasejici, 130, 28).replace(/^\s+|\s+$/g,'');
                if(cellObject.jmeno.length > 4){
                text+='</strong>'; //+ clipStringToLength(cellObject.jmeno,51,13).replace(/^\s+|\s+$/g,'');
                }
              else{
                text+='</strong>';
              }
              // var text = cellObject.prednasejici + ':<br>' + cellObject.jmeno;
              var item = createDOM('td','',params,row);
              prev = item;
              // Create prednaska link
              const doLinks = true;

              if(doLinks){

                var link = createDOM('span',text,{'class':'default'},item);
                // item.classList.add('pointable');
                var pred = function(cellObject){

                  // alert("PREDNASKA FUNC CALLED");

                  var nazev;
                  if(cellObject.hasOwnProperty('jmeno-dlouhe')){ //TODO: check if that not 0
                    nazev = cellObject['jmeno-dlouhe'].titlify()}else{
                      if(typeof cellObject['jmeno'] == 'string')
                        nazev = cellObject['jmeno'].titlify();
                      else
                        nazev = "";
                    }
                    if((cellObject['anotace'].length < 10 || cellObject['anotace'] == '0') && (cellObject['medailon'] == '0' || cellObject['medailon'].length < 10))
                      return;
                    var popup = vex.open({
                      content: '',
                      buttons: null,

                    });
                  var displayJmeno = cellObject['prednasejici'];
                  if(cellObject.hasOwnProperty('prednasejici-tituly')) //  TODO: check if that not 0
                  {
                    if(cellObject['prednasejici-tituly'].length > cellObject['prednasejici'].length){
                      displayJmeno = cellObject['prednasejici-tituly'];
                    }
                  }
                  if(displayJmeno.length>4)
                    createDOM('h2',displayJmeno,{class:'popupHeading'},popup.contentEl);
                  if(nazev.length>4)
                    createDOM('h2',nazev,{class:'popupHeading'},popup.contentEl);  
                  if(cellObject['anotace'].length>4)
                    createDOM('p',cellObject['anotace'],{},popup.contentEl);
                    if(cellObject['medailon'].length>4)
                  createDOM('em',cellObject['medailon'],{},createDOM('p','',{},popup.contentEl));
                  if(cellObject.hasOwnProperty("lide")){

                    cellObject["lide"].forEach(function(e){ //TODO: check if not 0

                      if(typeof e['anotace'] !== 'undefined'){createDOM('p',e['anotace'],{},popup.contentEl);
                      }
                      createDOM('h2',(typeof e['prednasejici-tituly'] !== 'undefined')?e['prednasejici-tituly']:e['prednasejici'],{class:'popupHeading'},popup.contentEl);
                      if(typeof e['medailon'] !== 'undefined'){createDOM('p',e['medailon'],{},popup.contentEl);
                      }
                    });

                  }

                };

                item.addEventListener('click',function(e){ e.preventDefault(); pred(this)}.bind(cellObject),false);
                item.classList.add('clickable');



              }else{
                createDOM('span',text,{'class':'textClass default'},item); 
              }
                              if(text.length < 45)
                                  item.classList.add('table-content-short');
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


