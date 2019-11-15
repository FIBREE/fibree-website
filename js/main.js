
// //dummy data for testing
// var list = [
//     {
//         "id": "1",
//         "category": "6",
//         "campus_location": "F2",
//         "title": "Alpha Tau Omega Fraternity",
//         "description": "<p>Alpha Tau Omega house</p>",
//         "longitude": "-87.321133",
//         "latitude": "39.484092",
//         "status": "ongoing",
//         "address": "Belgrade, Serbia"
//       }, {
//         "id": "2",
//         "category": "6",
//         "campus_location": "B2",
//         "title": "Apartment Commons",
//         "description": "<p>The commons area of the apartment-style residential complex</p>",
//         "longitude": "20.329282",
//         "latitude": "39.483599",
//         "status": "ongoing",
//         "address": "Paris, France"
//       }, {
//         "id": "3",
//         "category": "6",
//         "campus_location": "B2",
//         "title": "Apartment East",
//         "description": "<p>Apartment East</p>",
//         "longitude": "30.328809",
//         "latitude": "20.483748",
//         "status": "confirmed",
//         "address": "Berlin, Germany"
//       }, {
//         "id": "4",
//         "category": "6",
//         "campus_location": "B2",
//         "title": "Apartment West",
//         "description": "<p>Apartment West</p>",
//         "longitude": "-40.329732",
//         "latitude": "39.483429",
//         "status": "confirmed",
//         "address": "Oslo, Norway"
//       }, {
//         "id": "5",
//         "category": "6",
//         "campus_location": "C2",
//         "title": "Baur-Sames-Bogart (BSB) Hall",
//         "description": "<p>Baur-Sames-Bogart Hall</p>",
//         "longitude": "-60.325714",
//         "latitude": "39.482382",
//         "status": "ongoing",
//         "address": "Moscow, Russia"
// }];


let sheetsData;
let list = [];
let dataPromise = new Promise( function(resolve, reject){
    let gotData = false;
    const sheetId = '1tLuovMCa6C0jQLlTDP3ju3AOtbUSLxD8TBU2n_G5ye4';
    let sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/?key=AIzaSyBTCXWdYTqfIF7OJ8GfyT85saKrV7u0Gm0&includeGridData=true`;
    fetch(`${sheetsUrl}`).then( response => {
        return response.json();
    }).then( data => { 
        sheetsData = data.sheets[1].data[0].rowData;

        for(let i = 1, j=0 ; i<sheetsData.length; i++,j++){
            list[j] = {
                "name":sheetsData[i].values[1].formattedValue,
                "status":sheetsData[i].values[2].formattedValue,
                "address": sheetsData[i].values[4].formattedValue +","+sheetsData[i].values[5].formattedValue,
                "link": sheetsData[i].values[6].formattedValue
            }
        }
        gotData = true;
    
        if(gotData){
            resolve(console.log("works"));
        } else {
            reject();
        }
    });
});

//Creates a google maps api script
(function mapScript(){
    let gmap = document.createElement('script');
    const API_KEY = "AIzaSyBTCXWdYTqfIF7OJ8GfyT85saKrV7u0Gm0";

    gmap.type = 'text/javascript';
    gmap.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&key=${API_KEY}&language=en`;
    document.body.appendChild(gmap);
})();

function initMap(){
    let defMapCenter = {
        center: { lat: 50, lng: 25 },
        zoom: 3
    }

    let geocoder = new google.maps.Geocoder();
    let map = new google.maps.Map(document.getElementById('map'), defMapCenter);

    //STYLE CENTER AND FONT
    let infoWindow = new google.maps.InfoWindow({
        minWidth: 300,
        maxWidth: 500,
        infoBoxClearance: new google.maps.Size(1, 1),
        disableAutoPan: false
    });
    
    dataPromise.then( ()=>{
        let interval = setInterval( ()=>{
            for (let i = 0; i < list.length; i++) {
                let marker = new google.maps.Marker();
    
                let geoPromise = new Promise( function(resolve, reject){
                    geocoder.geocode({ 'address': list[i].address }, function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            let icon = '';
                            
                            if(list[i].status == 'confirmed'){
                                icon = {
                                    url: './images/logo.png',
                                    scaledSize: new google.maps.Size(30, 30)
                                }
                            }else{
                                icon = {
                                    url: './images/glogo.png',
                                    scaledSize: new google.maps.Size(30, 30)
                                }
                            }
    
                            console.log("set address called"); //DELETE
                            marker = new google.maps.Marker({
                                position: results[0].geometry.location,
                                map: map,
                                icon: icon,
                            });
                            resolve();
                        } else {
                            reject(status);
                        }
                    });
                });
    
                geoPromise.then(() => {
                    google.maps.event.addListener(marker, 'click', ( function(marker, i) {
                        return () => {
                            console.log("marker clicked");//DELETE
    
                            //add image
                            infoWindow.setContent(` <h3>${list[i].name}</h3><br>
                                                    <h3>${list[i].address}</h3><br>
                                                    <h3>${list[i].link}</h3>`);
                                                    
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));
                }).catch( (fromReject) => {
                    console.log("Geocoder failed, status:" + fromReject);
                });
            }
        }, 1000);
        setTimeout(clearInterval(interval),2000);
    });
}





// https://sheets.googleapis.com/v4/spreadsheets/1tLuovMCa6C0jQLlTDP3ju3AOtbUSLxD8TBU2n_G5ye4/?key=AIzaSyBTCXWdYTqfIF7OJ8GfyT85saKrV7u0Gm0&includeGridData=true

