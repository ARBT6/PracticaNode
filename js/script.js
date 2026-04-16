// Detiene todos los audios de la página menos el que se está reproduciendo
document.addEventListener("play", function (e) {
    var audios = document.querySelectorAll("audio");
    audios.forEach(function (audio) {
        if (audio !== e.target) audio.pause();
    });
}, true);

// Búsqueda con la iTunes Search API
var searchBtn = document.getElementById("search-btn");
var searchInput = document.getElementById("search-input");
var resultsSection = document.getElementById("search-results");
var searchStatus = document.getElementById("search-status");

searchBtn.addEventListener("click", buscar);
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") buscar();
});

function buscar() {
    var query = searchInput.value.trim();
    if (!query) return;

    searchStatus.textContent = "Buscando...";
    resultsSection.style.display = "none";
    resultsSection.innerHTML = "";

    var url = "/search?q=" + encodeURIComponent(query);

    fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.results.length === 0) {
                searchStatus.textContent = "No se encontraron resultados.";
                return;
            }

            searchStatus.textContent = 'Resultados para "' + query + '" (previews de 30 segundos)';
            resultsSection.style.display = "flex";

            data.results.forEach(function (track) {
                if (!track.previewUrl) return;

                var artwork = track.artworkUrl100.replace("100x100", "300x300");

                var card = document.createElement("article");
                card.className = "track-card";
                card.innerHTML =
                    '<img src="' + artwork + '" alt="Portada: ' + track.trackName + '">' +
                    '<div class="track-info">' +
                        '<p class="track-title">' + track.trackName + '</p>' +
                        '<p class="track-artist">' + track.artistName + '</p>' +
                    '</div>' +
                    '<audio controls>' +
                        '<source src="' + track.previewUrl + '" type="audio/mpeg">' +
                    '</audio>';

                resultsSection.appendChild(card);
            });
        })
        .catch(function () {
            searchStatus.textContent = "Hubo un error al buscar. Intenta de nuevo.";
        });
}
