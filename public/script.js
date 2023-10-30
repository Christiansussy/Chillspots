document.addEventListener('DOMContentLoaded', function() {
  var map = L.map('map', { zoomControl: false });
  map.setView([50.110924, 8.682127], 6);

  var options = {
    key: '693ad8cafc2a4bc78adde85f04c77458',
    position: 'topright',
    placeholder: 'Search for a city, plz...',
    errorMessage: ''
  };

  var controlsContainer = L.DomUtil.create('div', 'control-container', document.getElementById('container'));

  var controls = L.Control.openCageGeocoding(options).addTo(map);

  controlsContainer.appendChild(controls.getContainer());

  var attribution = map.attributionControl;
  attribution.setPrefix('');

  fetch('markers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten');
      }
      return response.json();
    })
    .then(data => {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      data.forEach(markerData => {
        const marker = L.marker([markerData.lat, markerData.lng]).addTo(map);

        marker.on('click', function(e) {
          const imagesHTML = markerData.images.map(image => `
            <img src="${image}" alt="Bild" class="slideshow-image" style="display: none;">
          `).join('');

          const popupContent = `
            <div class="slideshow-container">${imagesHTML}</div>
            <h3>${markerData.title}</h3>
            <p>${markerData.description}</p>
            <p>Koordinaten: 
              <a href="https://www.google.com/maps?q=${markerData.lat},${markerData.lng}" target="_blank">
                ${markerData.lat}, ${markerData.lng}
              </a>
            </p>
          `;

          const popup = L.popup({ offset: [0, -15] })
            .setLatLng(e.latlng)
            .setContent(popupContent);
          popup.openOn(map);

          let slideIndex = 0;
          let slides = document.querySelectorAll('.slideshow-image');
          showSlides();

          function showSlides() {
            for (let i = 0; i < slides.length; i++) {
              slides[i].style.display = 'none';
            }
            slideIndex++;
            if (slideIndex > slides.length) {
              slideIndex = 1;
            }
            slides[slideIndex - 1].style.display = 'block';
            setTimeout(showSlides, 4000); // Automatische Durchlaufzeit in Millisekunden (hier: 4 Sekunden)
          }
        });
      });
    })
    .catch(error => {
      console.error('Fehler: ' + error);
    });
});
