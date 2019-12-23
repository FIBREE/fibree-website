const API_KEY = 'AIzaSyBTCXWdYTqfIF7OJ8GfyT85saKrV7u0Gm0';

(function importStyle() {
    let head = document.getElementsByTagName('HEAD')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './css/map.css';
    head.appendChild(link);
})();

(function mapScript() {
    let gmap = document.createElement('script');

    gmap.type = 'text/javascript';
    gmap.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&key=${API_KEY}&language=en`;
    document.body.appendChild(gmap);
})();

let list = [];

let gotData = false;
let sheetsCsvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOb3RR1ZisBeRYH_0g3NR7zq1nUUvmTVKuerT3fKwif-SqbR2OfSY7IXNZaNL0SvbOoKrPFrEuZL-i/pub?gid=2025752931&single=true&output=csv';

let dataPromise = new Promise(function (resolve, reject) {
    Papa.parse(sheetsCsvUrl, {
        download: true,
        step: function (row) {
            list.push({
                name: row.data[1],
                meetupUrl: row.data[7],
                address: row.data[3] + ', ' + row.data[4],
                link: row.data[5],
                lat: row.data[8].split(', ')[0],
                lng: row.data[8].split(', ')[1]
            });
        },
        complete: function () {
            resolve();
            //console.log(list);
        }
    });
});

function initMap() {
    let defMapCenter = {
        center: { lat: 50, lng: 25 },
        zoom: 3
    };

    let map = new google.maps.Map(document.getElementById('map'), defMapCenter);

    let infoWindow = new google.maps.InfoWindow({
        minWidth: 300,
        maxWidth: 500,
        infoBoxClearance: new google.maps.Size(1, 1),
        disableAutoPan: false
    });

    let marker = new google.maps.Marker();

    dataPromise.then(() => {
        for (let i = 1; i < list.length; i++) {
            let icon = '';
            if (list[i].meetupUrl !== "") {
                icon = {
                    url: './images/logo_nomeetup.png',
                    scaledSize: new google.maps.Size(30, 30)
                };
            } else {
                icon = {
                    url: './images/glogo.png',
                    scaledSize: new google.maps.Size(30, 30)
                };
            }

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(list[i].lat, list[i].lng),
                map: map,
                icon: icon
            });

            google.maps.event.addListener(
                marker,
                'click',
                (function (marker, i) {
                    let linkedIn;
                    let meetup;
                    let targetLink;
                    let targetMeet;

                    if (list[i].link === "") {
                        linkedIn = "#";
                        targetLink = "_self";
                    } else {
                        linkedIn = list[i].link;
                        targetLink = "_blank";
                    }

                    if (list[i].meetupUrl === "") {
                        meetup = "#";
                        targetMeet = "_self";
                    } else {
                        meetup = list[i].meetupUrl;
                        targetMeet = "_blank";
                    }

                    return () => {
                    	let content=`<h3>${list[i].name}</h3>
                            		<h3>${list[i].address}</h3>` ;
                    	if (linkedIn != "#") {
                    		content+=`<a href=${linkedIn} class="href" target="${targetLink}"><h3>LinkedIn</h3></a>`;
                    	}
                    	if (meetup != "#") {
                    		content+=`<a href=${meetup} class="href" target="${targetMeet}"><h3>Meetup</h3></a>`;
                    	}
                            				
                        
                        infoWindow.setContent(content);

                        if (infoWindow.getMap()) {
                            infoWindow.close();
                        } else {
                            infoWindow.open(map, marker);
                        }
                    };
                })(marker, i)
            );
        }
    });
}
