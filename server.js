var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/logs_db", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connect;
var logs;
var logsSchema;
var json = [];
var key = [];
var result = [];
var inputs;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));


app.set("views", __dirname + "/Views");
app.set("view engine", "ejs");

app.get("/", function (req, res) {

    const fs = require('fs');
    var text = fs.readFileSync('u_ex190823-2.log', 'utf8'); // step 1: read from orgnal file text
    var array = text.split("\n");

    keyArr = array[3].split(' ');

    keyArr.splice(0, 1);

    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == '#') {
            // console.log(array[i])
            array.splice(i, 1)
            i -= 1
        }
    };




    var obj = {}
    for (var i = 0; i < keyArr.length; i++) {
        obj[keyArr[i]] = { type: String }
    }
    logsSchema = new mongoose.Schema(obj);
    // mongoose.model('Logs', logsSchema);
    logs = mongoose.model('Logs', logsSchema);


    function LogsToJson(array, keyArr) {
        array.splice(0, 4)
        var dataArray = [];
        // console.log(array)

        // step 3: 2d array
        for (var i = 0; i < array.length; i++) {
            if (array[i] == '') { continue }          //2d array
            let tempArray = [];
            tempArray = array[i].split()
            dataArray.push(tempArray)

        };
        var rsu = []
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i][0].includes('00:00:00') && dataArray[i][0].includes('POST') && dataArray[i][0].includes('=hh.lov.da')) {
                rsu.push(dataArray[i])
            }
        }
        // console.log(rsu)

        var newArr = [];
        for (var i = 0; i < dataArray.length; i++) {
            newArr.push(dataArray[i][0].split(' '))
        }
        //   console.log(newArr.length)

        // step 5: convert to json

        for (var i = 0; i < newArr.length; i++) {
            var d = newArr[i],
                object = {};
            for (var j = 0; j < keyArr.length; j++) {
                object[keyArr[j]] = d[j];
            }
            json.push(object);
        }

        console.log(json.length)

        // #######################################


        /* for (var i = 0; i < keyArr.length; i++) {
            obj[keyArr[i]] = { type: String }
        } */

        /* var logsSchema = new mongoose.Schema(obj);

        mongoose.model('Logs', logsSchema);
        var logs = mongoose.model('Logs'); */

        logs.collection.insertMany(json, function (err, log) {
            if (err) {
                return console.error(err);
            } else {
                console.log("Successful");
            }
        });

        // console.log(json)
        // matching(json)
    }
    LogsToJson(array, keyArr)
    res.render("index", { key: keyArr });
})

app.post("/search", function (req, res) {
    inputs = req.body;
    key = Object.keys(req.body)
    // console.log('++++++' ,inputs)
    // console.log('========' ,key)

    // matching(json, req.body)
    res.render('search', { keys: key })
    // res.redirect('/')
});

app.post("/results", function (req, res) {
    // console.log('++++++' ,inputs)
    // console.log('======' ,json)

    var result = matching(json, inputs)
    // console.log(Object.keys(req.body))
    // res.render('search', {keys: key})
    //console.log(result)
    res.render('results', { results: result, search: Object.keys(req.body) })
    // res.redirect('/')
})






function matching(data, search) {
    // console.log('++++++' ,data.length,'=============')
    // console.log('======' ,search)
    // console.log('-------', key)
    // key = Object.keys(search)
    var objSearch = {}
    var x = mongoose.model('logs', logsSchema);

    for (let [key, value] of Object.entries(search)) {
        if (value != "") {
            objSearch[key] = value;
        }
        // console.log(`${key}: ${value}`);
    }

    x.collection.find({}, function (err, log) {
        if (err) {
            return console.error(err);
        } else {
            console.log(log);
        }
    });
    /* for (var i = 0; i < data.length; i++) {
        var x = 0; y = 0
        for (var j = 0; j < key.length; j++) {
            //   console.log(search1[key[j]])
            if (search[key[j]] != "") {
                x += 1;
                //   let value = `/${search[key[j]]}/g`;
                //   console.log(value)
                let Reg = new RegExp(search[key[j]], 'gi')
                if (data[i][key[j]].match(Reg)) {
                    y += 1;
                }
            }
        }
        // console.log(`x = ${x},  y = ${y}`)

        if (x == y) {
            result.push(data[i])
        }
    } */
    console.log(result)
    return result
}

app.listen(8000, function () {
    console.log("Listening on port: 8000");
})
