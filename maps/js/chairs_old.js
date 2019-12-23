//Creates a google maps api script
const API_KEY = "AIzaSyBTCXWdYTqfIF7OJ8GfyT85saKrV7u0Gm0";
const SHEET_ID = '1tLuovMCa6C0jQLlTDP3ju3AOtbUSLxD8TBU2n_G5ye4';
// https://docs.google.com/spreadsheets/d/1tLuovMCa6C0jQLlTDP3ju3AOtbUSLxD8TBU2n_G5ye4/edit#gid=0
// new sheet key: fibree.org gmail

(function importStyle(){
    let head = document.getElementsByTagName('HEAD')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './css/map.css'
    head.appendChild(link);
})();

(function mapScript(){
    let gmap = document.createElement('script');

    gmap.type = 'text/javascript';
    gmap.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&key=${API_KEY}&language=en`;
    document.body.appendChild(gmap);
})();

let sheetsData;
let list = [];

let gotData = false;
let sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/?key=${API_KEY}&includeGridData=true`;

let dataPromise = new Promise( function(resolve, reject){
    fetch(`${sheetsUrl}`).then( response => {
        return response.json();
    }).then( data => { 
        sheetsData = data.sheets[1].data[0].rowData;
        for(let i = 1, j=0 ; i<sheetsData.length; i++,j++){
            list[j] = {
                "name":sheetsData[i].values[1].formattedValue,
                "status":sheetsData[i].values[2].formattedValue,
                "address": sheetsData[i].values[4].formattedValue +","+sheetsData[i].values[5].formattedValue,
                "link": sheetsData[i].values[6].formattedValue,
                "lat": sheetsData[i].values[18].formattedValue,
                "lng": sheetsData[i].values[19].formattedValue
            }
        }
        gotData = true;
    
        if(gotData){
            resolve();
        } else {
            reject();
        }
    });
});


function initMap(){
    let defMapCenter = {
        center: { lat: 50, lng: 25 },
        zoom: 3
    }

    let map = new google.maps.Map(document.getElementById('map'), defMapCenter);

    let infoWindow = new google.maps.InfoWindow({
        minWidth: 300,
        maxWidth: 500,
        infoBoxClearance: new google.maps.Size(1, 1),
        disableAutoPan: false
    });
        
    let marker = new google.maps.Marker();

    dataPromise.then( ()=>{
        for (let i = 0; i < list.length; i++) {

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

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(list[i].lat , list[i].lng),
                map: map,
                icon: icon,
            });

            google.maps.event.addListener(marker, 'click', ( function(marker, i) {
                return () => { 
                    infoWindow.setContent(` <h3>${list[i].name}</h3><br>
                                            <h3>${list[i].address}</h3><br>
                                            <a href=${list[i].link} class="infoBox" target="_blank"><h3>LinkedIn</h3></a> `);
                                            
                    infoWindow.open(map, marker);
                }
            })(marker, i));
        }
    });
}