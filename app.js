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
     
        var chartObj = new FusionCharts({
            type: 'thermometer',
            renderAt: 'chart-container2',
            width: '240',
            height: '310',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "Temperature Monitor",
                    "subcaption": " Central cold store",
                    "lowerLimit": "-10",
                    "upperLimit": "40",
        
                    "decimals": "1",
                    "numberSuffix": "°C",
                    "showhovereffect": "1",
                    "thmFillColor": "#008ee4",
                    "showGaugeBorder": "1",
                    "gaugeBorderColor": "#008ee4",
                    "gaugeBorderThickness": "2",
                    "gaugeBorderAlpha": "30",
                    "thmOriginX": "100",
                    "chartBottomMargin": "20",
                    "valueFontColor": "#000000",
                    "theme": "fusion",
                    "showValue": "1"
                },
                "value": "0",
                //All annotations are grouped under this element
                "annotations": {
                    "showbelow": "0",
                    "groups": [{
                        //Each group needs a unique ID
                        "id": "indicator",
                        "items": [
                            //Showing Annotation
                            {
                                "id": "background",
                                //Rectangle item
                                "type": "rectangle",
                                "alpha": "50",
                                "fillColor": "#AABBCC",
                                "x": "$gaugeEndX-40",
                                "tox": "$gaugeEndX",
                                "y": "$gaugeEndY+54",
                                "toy": "$gaugeEndY+72"
                            }
                        ]
                    }]
        
                },
            },
            "events": {
                "rendered": function(evt, arg) {
                    evt.sender.dataUpdate = setInterval(function() {
                        var value,
                            prevTemp = evt.sender.getData(),
                            mainTemp = (Math.random() * 10) * (-1),
                            diff = Math.abs(prevTemp - mainTemp);
        
                        diff = diff > 1 ? (Math.random() * 1) : diff;
                        if (mainTemp > prevTemp) {
                            value = prevTemp + diff;
                        } else {
                            value = prevTemp - diff;
                        }
        
                        evt.sender.feedData("&value=" + snap.val());
        
                    }, 3000);
                    evt.sender.updateAnnotation = function(evtObj, argObj) {
                        var code,
                            chartObj = evtObj.sender,
                            val = chartObj.getData(),
                            annotations = chartObj.annotations;
        
                        if (val >= -4.5) {
                            code = "#00FF00";
                        } else if (val < -4.5 && val > -6) {
                            code = "#ff9900";
                        } else {
                            code = "#ff0000";
                        }
                        annotations.update("background", {
                            "fillColor": code
                        });
                    };
                },
                'renderComplete': function(evt, arg) {
                    evt.sender.updateAnnotation(evt, arg);
                },
                'realtimeUpdateComplete': function(evt, arg) {
                    evt.sender.updateAnnotation(evt, arg);
                },
                'disposed': function(evt, arg) {
                    clearInterval(evt.sender.dataUpdate);
                }
            }
        }
        );
                    chartObj.render();
    });
    

}());

