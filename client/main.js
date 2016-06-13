$(document).ready(function(){
    firebase.initializeApp(window.config);

    var database = firebase.database();

    $('#submitBtn').click(function(){
        var newFileRef = database.ref("filesDb/files").push();
        var urlToSet = $('#urlInput').val();
        var fileNameToSet = $('#fileNameInput').val();
        
        newFileRef.set({
            url: urlToSet,
            fileName: fileNameToSet
        });
    });
    
});

