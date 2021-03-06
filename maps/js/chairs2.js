//const sheetsCsvUrl =
  //"https://docs.google.com/spreadsheets/d/e/2PACX-1vTOb3RR1ZisBeRYH_0g3NR7zq1nUUvmTVKuerT3fKwif-SqbR2OfSY7IXNZaNL0SvbOoKrPFrEuZL-i/pub?gid=2025752931&single=true&callback=googleDocCallback&output=csv&sheet=publicData";

const sheetsCsvUrl= "https://docs.google.com/spreadsheets/d/1W2ZLeJljdhdmhl4FF_xZol1xGhws3bmn1ShNs1arTNU/gviz/tq?tqx=out:csv&sheet=publicData";

const API_KEY = "AIzaSyBTCXWdYTqfIF7OJ8GfyT85saKrV7u0Gm0";
const SIZE = 35;

let list = [];

window.googleDocCallback = function () { return true; };


(function importStyle() {
  let head = document.getElementsByTagName("HEAD")[0];
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "./css/map.css";
  head.appendChild(link);
})();

(function mapScript() {
  let gmap = document.createElement("script");
  gmap.type = "text/javascript";
  gmap.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&key=${API_KEY}&language=en`;
  document.body.appendChild(gmap);
})();

let dataPromise = new Promise((resolve, reject) => {
  Papa.parse(sheetsCsvUrl, {

    download: true,
    step: row => {
      list.push({
        name: row.data[1],
        meetupUrl: row.data[7],
        address: row.data[3] + ", " + row.data[4],
        link: row.data[5],
        lat: row.data[8].split(", ")[0],
        lng: row.data[8].split(", ")[1]
      });
    },
    error: () => {
      reject();
    },
    complete: () => {
      resolve();
      console.log(list);
    }
  });
});

function initMap() {
  let marker = new google.maps.Marker();
  let count = 0;
  let linkedIn;
  let meetup;
  let targetLink;
  let targetMeet;
  let icon = "";

  let defMapCenter = {
    center: { lat: 50, lng: 25 },
    zoom: 3
  };

  let map = new google.maps.Map(document.getElementById("map"), defMapCenter);

  let infoWindow = new google.maps.InfoWindow({
    minWidth: 300,
    maxWidth: 500,
    infoBoxClearance: new google.maps.Size(1, 1),
    disableAutoPan: false
  });

  dataPromise
    .then(() => {
      for (let i = 0; i < list.length - 1; i++) {
        if (list[i].address === list[i + 1].address) {
          let content = `<h2>${list[i].address}</h2>`;
          let j = i;

          console.log(list[i].address + " = " + list[j].address);
          console.log(j);

          while (list[i].address === list[j].address) {
            console.log(count);
            content += `<h3>${list[j].name}</h3>`;

            if (list[j].link === "") {
              linkedIn = "#";
              targetLink = "_self";
            } else {
              linkedIn = list[j].link;
              targetLink = "_blank";
            }

            if (list[j].meetupUrl === "") {
              meetup = "#";
              targetMeet = "_self";
            } else {
              meetup = list[j].meetupUrl;
              targetMeet = "_blank";
            }

            if (linkedIn != "#") {
              content += `<a href=${linkedIn} class="href" target="${targetLink}"><img width="80" height="80" src="images/li.png"/></a>`;
            }

            if (meetup != "#") {
              content += `<a href=${meetup} class="href" target="${targetMeet}"><img width="80" height="80" src="images/meetup.png"/></a>`;
            }
            content += `<hr>`;

            if (
              (list[i].meetupUrl !== "" && list[i].link !== "") ||
              (list[j].meetupUrl !== "" && list[j].link !== "")
            ) {
              icon = {
                url: "./images/logo_li_meetup.png",
                scaledSize: new google.maps.Size(SIZE, SIZE)
              };
            } else if (list[i].meetupUrl !== "" && list[i].link == "") {
              icon = {
                url: "./images/logo_meetup.png",
                scaledSize: new google.maps.Size(SIZE, SIZE)
              };
            } else if (list[i].meetupUrl == "" && list[i].link !== "") {
              icon = {
                url: "./images/logo_li.png",
                scaledSize: new google.maps.Size(SIZE, SIZE)
              };
            } else {
              icon = {
                url: "./images/logo_nomeetup.png",
                scaledSize: new google.maps.Size(SIZE, SIZE)
              };
            }

            j++;
            count++;
            if (list[j] === undefined) {
              count--;
              break;
            }
          }

          marker = new google.maps.Marker({
            position: new google.maps.LatLng(list[i].lat, list[i].lng),
            map: map,
            icon: icon
          });

          google.maps.event.addListener(
            marker,
            "click",
            (marker => {
              return () => {
                infoWindow.setContent(content);

                if (infoWindow.getMap()) {
                  infoWindow.close();
                } else {
                  infoWindow.open(map, marker);
                }
              };
            })(marker)
          );
          i += count;
          count = 0;
        } else {
          if (list[i].meetupUrl !== "" && list[i].link !== "") {
            icon = {
              url: "./images/logo_li_meetup.png",
              scaledSize: new google.maps.Size(SIZE, SIZE)
            };
          } else if (list[i].meetupUrl !== "" && list[i].link == "") {
            icon = {
              url: "./images/logo_meetup.png",
              scaledSize: new google.maps.Size(SIZE, SIZE)
            };
          } else if (list[i].meetupUrl == "" && list[i].link !== "") {
            icon = {
              url: "./images/logo_li.png",
              scaledSize: new google.maps.Size(SIZE, SIZE)
            };
          } else {
            icon = {
              url: "./images/logo_nomeetup.png",
              scaledSize: new google.maps.Size(SIZE, SIZE)
            };
          }

          marker = new google.maps.Marker({
            position: new google.maps.LatLng(list[i].lat, list[i].lng),
            map: map,
            icon: icon
          });

          google.maps.event.addListener(
            marker,
            "click",
            ((marker, i) => {
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

              let content = `<h3>${list[i].address}</h3><h3>${list[i].name}</h3>`;

              if (linkedIn != "#") {
                content += `<a href=${linkedIn} class="href" target="${targetLink}"><img width="80" height="80" src="images/li.png"/></a>`;
              }

              if (meetup != "#") {
                content += `<a href=${meetup} class="href" target="${targetMeet}"><img width="80" height="80" src="images/meetup.png"/></a>`;
              }

              return () => {
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
      }
    })
    .catch(error => console.log(error));
}
