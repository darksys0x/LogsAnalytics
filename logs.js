const fs = require('fs');
var text = fs.readFileSync('u_ex190825-1.log','utf8'); // step 1: read from orgnal file text
var array = text.split("\n");// step 2:  split to `array

keyArr = array[3].split(' ')

keyArr.splice(0,1)

for(var i = 0; i < array.length; i++){
  if(array[i][0] == '#'){
    // console.log(array[i])
    array.splice(i, 1)
    i -= 1
  }
}

function LogsToJson(array, keyArr){
  array.splice(0,4)
  var dataArray = [];
  // console.log(array)

  // step 3: 2d array
  for(var i=0; i<array.length; i++){
    if(array[i] == ''){continue}          //2d array
    let tempArray = [];
    tempArray = array[i].split()
    dataArray.push(tempArray)

  };


  var newArr = [];
  for(var i = 0; i < dataArray.length; i++){
    newArr.push(dataArray[i][0].split(' '))
  }
//   console.log(newArr)

  // step 5: convert to json
  var json = [];
  for (var i = 0; i < newArr.length; i++) {
    var d = newArr[i],
    object = {};
    for (var j=0; j<keyArr.length; j++){
      object[keyArr[j]] = d[j];
    //   console.log(object['date'])
      json.push(object);
    }
  }

  matching(json)
  // console.log(json)
}

LogsToJson(array, keyArr);

function matching(data){
  var count = 0, result = []
    for (var i = 0; i < data.length; i++) {
        if(data[i]['cs-uri-query'].includes('cmd')){
          if(result.indexOf(data[i]['c-ip']) <= -1){
            result.push(data[i]['c-ip'],data[i]['time'])
            count++
          }
        }
    }
    console.log(result)
}