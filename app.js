(function () {
    const config = {
        apiKey: "AIzaSyCk3BJ_e2twPTuw-ChARKGlv13XqCotce0",
            authDomain: "assembly-8d1be.firebaseapp.com",
            databaseURL: "https://assembly-8d1be.firebaseio.com",
            projectId: "assembly-8d1be",
            storageBucket: "assembly-8d1be.appspot.com",
            messagingSenderId: "377358000231",
            appId: "1:377358000231:web:a7e87650f49dc40b9bf4c2",
            measurementId: "G-J0T1DCV1CS"
    };
    firebase.initializeApp(config);

    //Get elements
    const preObject = document.getElementById('Data');

    //Create reference
    const dbRefObject = firebase.database().ref().child('Data');

    //Syc object changes
    dbRefObject.on('value', snap => {
        preObject.innerText = JSON.stringify(snap.val(),null,3);
    });

}());

