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
    const ulList = document.getElementById('list')
    //Create reference
    const dbRefObject = firebase.database().ref().child('Data');
    const dbRefList = dbRefObject.child('dist');
    const dbRefListTemp = dbRefObject.child('temp');


    dbRefList.on('value', snap => {
        const li = document.createElement('li');
        li.innerText = "Distance = " + snap.val();
        ulList.appendChild(li);

        var chartObj = new FusionCharts({
            type: 'cylinder',
            dataFormat: 'json',
            renderAt: 'chart-container',
            width: '200',
            height: '350',
            dataSource: {
                "chart": {
                    "theme": "fusion",
                    "caption": "Water in the tank",
                    "subcaption": "Assembly Project",
                    "lowerLimit": "0",
                    "upperLimit": "3000",
                    "lowerLimitDisplay": "Empty",
                    "upperLimitDisplay": "Full",
                    "numberSuffix": " ltrs",
                    "showValue": "1",
                    "chartBottomMargin": "45",
                    "showValue": "0",
                    "cylFillColor": "#1aaf5d"
                },
                "value": "110",
                "annotations": {
                    "origw": "400",
                    "origh": "190",
                    "autoscale": "1",
                    "groups": [{
                        "id": "range",
                        "items": [{
                            "id": "rangeBg",
                            "type": "rectangle",
                            "x": "$canvasCenterX-45",
                            "y": "$chartEndY-30",
                            "tox": "$canvasCenterX +45",
                            "toy": "$chartEndY-75",
                            "fillcolor": "#6caa03"
                        }, {
                            "id": "rangeText",
                            "type": "Text",
                            "fontSize": "11",
                            "fillcolor": "#333333",
                            "text": "0 ltrs",
                            "x": "$chartCenterX-45",
                            "y": "$chartEndY-50"
                        }]
                    }]
                }
        
            },
            "events": {
                "rendered": function(evtObj, argObj) {
                    var fuelVolume = 110;
                    evtObj.sender.chartInterval = setInterval(function() {
                        (fuelVolume < 10) ? (fuelVolume = 80) : "";
                        var consVolume = (parseInt(snap.val()));
                        evtObj.sender.feedData && evtObj.sender.feedData("&value=" + consVolume);
                        fuelVolume = consVolume;
                    }, 1000);
                },
                //Using real time update event to update the annotation
                //showing available volume of Diesel
                "realTimeUpdateComplete": function(evt, arg) {
                    var annotations = evt.sender.annotations,
                        dataVal = evt.sender.getData(),
                        colorVal = (dataVal >= 70) ? "#6caa03" : ((dataVal <= 35) ? "#e44b02" : "#f8bd1b");
                    //Updating value
                    annotations && annotations.update('rangeText', {
                        "text": dataVal + " ltrs"
                    });
                    //Changing background color as per value
                    annotations && annotations.update('rangeBg', {
                        "fillcolor": colorVal
                    });
        
                },
                "disposed": function(evt, arg) {
                    clearInterval(evt.sender.chartInterval);
                }
            }
        }
        );
                    chartObj.render();
                
    });

    dbRefListTemp.on('value', snap => {
        const li = document.createElement('li');
        li.innerText = "Teperature = " + snap.val();
        ulList.appendChild(li);
    });
    

}());

