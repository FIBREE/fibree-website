var gmarkers = [];

class Point{
    constructor(lat, lng){
        this.lat = lat;
        this.lng = lng;
        // this.name = name;
        // this.country = country;
        // this.city = city;
        // this.linkedIn = linkedIn;
        
        let marker = new google.maps.Marker({
            position:{lat: this.lat ,lng: this.lng},
            map: map,
            icon: ''
        });

        gmarkers.push(marker);

        let infoWindow = new google.maps.InfoWindow({
            content: `<h1>${this.lat}</h1><br><h3>${this.lat}</h3><br><h5>${this.lat}</h5>`,
            disableAutoPan: false
        });


        marker.addListener('click', ()=>{
            // for( let i = 0; i < gmarkers.length; i++){
            //     gmarkers[i].setMap(null);
            // }

            infoWindow.open(map, marker);
            console.log("marker created");
        });

    
    }

    getValues(){
        console.log(this.lat);
        console.log(this.lng);
    }

}

//Creates a google maps api script
function mapScript(){
    let gmap = document.createElement('script');
    const API_KEY = "AIzaSyCbi55z8XJ33DfKeJvxI3ccEru05EhofEw";

    gmap.type = 'text/javascript';
    gmap.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&key=${API_KEY}&language=en`;
    document.body.appendChild(gmap);
}

function initMap(){
    let defMapCenter = {
        center: { lat: 25, lng: 0 },
        zoom: 3
    }
    map = new google.maps.Map(document.getElementById('map'), defMapCenter);


    //let point = new Point(52 , 13);

    for(let i = 0; i<50; i+=5){
        let point = new Point(i , i+10);
    }
}


fetch("http://cors.io/spreadsheets.google.com/feeds/list/0AtMEoZDi5-pedElCS1lrVnp0Yk1vbFdPaUlOc3F3a2c/od6/public/values?alt=json").then( response => {
        return response.json();
    }).then( data => { 
        console.log(data);
    });

    









// function codeAddress(address) {
//     geocoder.geocode({ 'address': address }, function(results, status) {
//         if (status === google.maps.GeocoderStatus.OK) {
//         map.setCenter(results[0].geometry.location);
//         var marker = new google.maps.Marker({
//             map: map,
//             position: results[0].geometry.location
//         });
//         } else {
//         alert("Geocode unsuccessful");
//         }
//     });
// }