var gmarkers = [];
//dummy data for testing
var list = [
    {
        "id": "1",
        "category": "6",
        "campus_location": "F2",
        "title": "Alpha Tau Omega Fraternity",
        "description": "<p>Alpha Tau Omega house</p>",
        "longitude": "-87.321133",
        "latitude": "39.484092",
        "status": "ongoing",
        "address": "Belgrade, Serbia"
      }, {
        "id": "2",
        "category": "6",
        "campus_location": "B2",
        "title": "Apartment Commons",
        "description": "<p>The commons area of the apartment-style residential complex</p>",
        "longitude": "20.329282",
        "latitude": "39.483599",
        "status": "ongoing",
        "address": "Paris, France"
      }, {
        "id": "3",
        "category": "6",
        "campus_location": "B2",
        "title": "Apartment East",
        "description": "<p>Apartment East</p>",
        "longitude": "30.328809",
        "latitude": "20.483748",
        "status": "confirmed",
        "address": "Berlin, Germany"
      }, {
        "id": "4",
        "category": "6",
        "campus_location": "B2",
        "title": "Apartment West",
        "description": "<p>Apartment West</p>",
        "longitude": "-40.329732",
        "latitude": "39.483429",
        "status": "confirmed",
        "address": "Oslo, Norway"
      }, {
        "id": "5",
        "category": "6",
        "campus_location": "C2",
        "title": "Baur-Sames-Bogart (BSB) Hall",
        "description": "<p>Baur-Sames-Bogart Hall</p>",
        "longitude": "-60.325714",
        "latitude": "39.482382",
        "status": "ongoing",
        "address": "Moscow, Russia"
      }];

//Creates a google maps api script
function mapScript(){
    let gmap = document.createElement('script');
    const API_KEY = "AIzaSyAIXx8S4YwRiV7Q4bLbzbR8J4-exix-gNY";

    gmap.type = 'text/javascript';
    gmap.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&key=${API_KEY}&language=en`;
    document.body.appendChild(gmap);
}

function initMap(){
    let defMapCenter = {
        center: { lat: 25, lng: 0 },
        zoom: 3
    }
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), defMapCenter);

    // let infoWindow = new google.maps.InfoWindow({
    //     content: `  <h3>${this.lat}</h3><br>
    //                 <h3>${this.lat}</h3><br>
    //                 <h3>${this.lat}</h3><br>
    //                 <h3>${this.lat}</h3>`            
    // });

    function codeAddress(address) {
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert("Geocode unsuccessful");
                }
        });
    }

    
    //CREATE MARKERS from list
    for (let i = 0; i < list.length; i++) {

        var marker = new google.maps.Marker({
            //position: new google.maps.LatLng(list[i].latitude, list[i].longitude),
            position: codeAddress(list[i].address),
            title: list[i].title,
            map: map
        });


        gmarkers.push(marker);
        google.maps.event.addListener(marker, 'click', ( function(marker, i) {
            return () => {
                if (list[i].title !== "") {
                    infoWindow.setContent(` <h3>${list[i].title}</h3><br>
                                            <h3>${list[i].address}</h3><br>
                                            <h3>${list[i].status}</h3><br>
                                            <h3>${list[i].description}</h3>`),

                    infoWindow.open(map, marker);
                }
            }
        })(marker, i));
    }
}

let sheetsUrl = 'https://spreadsheets.google.com/feeds/cells/1tLuovMCa6C0jQLlTDP3ju3AOtbUSLxD8TBU2n_G5ye4/1/public/full?alt=json'
fetch(`${sheetsUrl}`).then( response => {
    return response.json();
}).then( data => { 
    console.log(data);
});


// fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`).then( response => {
//         return response.json();
//     }).then( data => { 
//         console.log(data);
//     });
// https://spreadsheets.google.com/feeds/cells/1tLuovMCa6C0jQLlTDP3ju3AOtbUSLxD8TBU2n_G5ye4/1/public/full?alt=json 

//geo
// https://gist.github.com/brittanystoroz/5573406
