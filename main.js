/* OGD Wien Beispiel */


let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
  };
  
  let startLayer = L.tileLayer.provider("BasemapAT.grau");
  
  let map = L.map("map", {
      center: [ stephansdom.lat, stephansdom.lng ],
      zoom: 16,
      layers: [
          startLayer
      ],
  });
  
  let layerControl = L.control.layers({
      "BasemapAT Grau": startLayer,
      "Basemap Standard": L.tileLayer.provider("BasemapAT.basemap"),
      "Basemap High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
      "Basemap Gelände": L.tileLayer.provider("BasemapAT.terrain"),
      "Basemap Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
      "Basemap Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
      "Basemap Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
      "Basemap mit Orthofoto und Beschriftung": L.layerGroup([
          L.tileLayer.provider("BasemapAT.orthofoto"),
          L.tileLayer.provider("BasemapAT.overlay"),
      ])
  }).addTo(map);
  
  layerControl.expand();
  /*
  let sightLayer = L.featureGroup();
  layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");
  
  let mrk = L.marker([ stephansdom.lat, stephansdom.lng]).addTo(sightLayer);
  
  sightLayer.addTo(map);
  */
  
  // Maßstab hinzufügen
  L.control.scale({
      imperial: false,
  }).addTo(map);
  
  L.control.fullscreen().addTo(map);
  
  let miniMap = new L.Control.MiniMap(
      L.tileLayer.provider("BasemapAT"), {toggleDisplay: true}
  ).addTo(map);

  //Sehenswürdigkeiten
  async function loadSites (url){
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);  

    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Sehenswürdigkeiten");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        pointToLayer: function(geoJsonPoint, latlng){
            //L.marker(latlng).addTo(map)
            console.log(geoJsonPoint.properties.NAME);
            let popup = 
            `<img src="${geoJsonPoint.properties.THUMBNAIL}"
            alt=""><br<
            <strong>${geoJsonPoint.properties.NAME}<strong>
            <hr>
            Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
            <a href ="${geoJsonPoint.properties.WEITERE_INF}" >Weblink</a>
            `;
           
            return L.marker (latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37], 
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
    }
    }).addTo(overlay);

  }

     //Sightseeing Stops
     async function loadStops (url){
        let response = await fetch(url);
        let geojson = await response.json();
        //console.log(geojson);  
    
        let overlay = L.featureGroup();
        layerControl.addOverlay(overlay, "Vienna Sightseeing Stops");
        overlay.addTo(map);
    
        L.geoJSON(geojson, {
            pointToLayer: function(geoJsonPoint, latlng){
                //L.marker(latlng).addTo(map)
                //console.log(geoJsonPoint.properties.NAME);
                let popup = 
                `<strong>${geoJsonPoint.properties.LINE_NAME}</strong><br>
                Station ${geoJsonPoint.properties.STAT_NAME}
                `;
               
                return L.marker (latlng, {
                    icon: L.icon({
                        iconUrl: `icons/bus_${geoJsonPoint.properties.LINE_ID}.png`,
                        iconAnchor: [16, 37], 
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
        }
        }).addTo(overlay);

        }

    //Sightseeing Lines
    async function loadLines (url){
        let response = await fetch(url);
        let geojson = await response.json();
        //console.log(geojson);  
    
        let overlay = L.featureGroup();
        layerControl.addOverlay(overlay, "Liniennetz Vienna Sightseeing");
        overlay.addTo(map);
    
        L.geoJSON(geojson).addTo(overlay);
        }

        //Fussgängerzone
    async function LoadZones (url){
        let response = await fetch(url);
        let geojson = await response.json();
        //console.log(geojson);  
    
        let overlay = L.featureGroup();
        layerControl.addOverlay(overlay, "Fussgängerzonen");
        overlay.addTo(map);
    
        L.geoJSON(geojson).addTo(overlay);
        }

          //Hotels
    async function LoadHotels (url){
        let response = await fetch(url);
        let geojson = await response.json();
        
    
        let overlay = L.featureGroup();
        layerControl.addOverlay(overlay, "Hotels und Unterkünfte");
        overlay.addTo(map);
    
        L.geoJSON(geojson, {
            pointToLayer: function(geoJsonPoint, latlng){
                //L.marker(latlng).addTo(map)
                console.log(geoJsonPoint.properties.NAME);
                let popup = 
                `<img src="${geoJsonPoint.properties.THUMBNAIL}"
                alt=""><br<
                <strong>${geoJsonPoint.properties.BETRIEB}<strong>
                <hr>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                Betriebsart: ${geoJsonPoint.properties.BETRIEBSART_TXT}<br>
                Kategorie: ${geoJsonPoint.properties.KATEGORIE_TXT}<br>
                E-Mail: ${geoJsonPoint.properties.KONTAKT_EMAIL}<br>
                Website: ${geoJsonPoint.properties.WEBLINK1}<br>
                <a href ="${geoJsonPoint.properties.WEITERE_INF}" >Weblink</a>
                Telefonnummer: ${geoJsonPoint.properties.KONTAKT_TEL}<br>
                `;

                let icon;
                if (geoJsonPoint.properties.BETRIEBSART == "H") {
                    icon = "hotel_0star";
                } else if (geoJsonPoint.properties.BETRIEBSART == "P") {
                    icon = "lodging_0star";
                } else {
                    icon = "apartment-2";
                }
               
                return L.marker (latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel.png",
                        iconAnchor: [16, 37], 
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);

                

        
        }
        }).addTo(overlay);
        }

       


  loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

  loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

  loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

  LoadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

  LoadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");