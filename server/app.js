var isUrl = require('is-url');
var fileExists = require('file-exists');
var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "./server/serviceAccountCredentials.json",
  databaseURL: "https://downloader-661e3.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("filesDb/files");

resetDb(ref);

function resetDb(ref) {
    ref.set(['1']);
}

function addFileToDownloaded(ref, url, name) {
    var downloadedRef = db.ref('donwloaded');
    var newDownloadRef = downloadedRef.push();
    newDownloadRef.set({
        url,
        fileName: name
    });
}

ref.on("child_added", function(snapshot) {
    var url = snapshot.val().url;
    var filename = snapshot.val().fileName;
    if (isUrl(url) && !fileExists('./downloadedFiles/' + filename)) {
        downloadFile(url, filename);
        resetDb(ref);
    }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



function downloadFile(fileUrl, name) {
    console.log('donwloading', fileUrl);
    var fs = require('fs'),
    request = require('request');

    request
    .get(fileUrl)
    .on('error', function(err) {
        // handle error
    })
    .pipe(fs.createWriteStream('./downloadedFiles/' + name))
    .on('finish', function () {
        console.log('downloaded', name);
        addFileToDownloaded(ref, fileUrl, name);
    })
    .on('end', function () {
        console.log(arguments)
    });
}

