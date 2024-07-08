document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    searchAnimeTrailers(query);
});

function searchAnimeTrailers(query) {
    fetch(`https://kitsu.io/api/edge/anime?filter[text]=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';
            data.data.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add('anime-card');
                itemCard.innerHTML = `
                    <img src="${item.attributes.posterImage.small}" alt="${item.attributes.titles.en_jp}">
                    <h3>${item.attributes.titles.en_jp}</h3>
                    <p>${item.attributes.synopsis}</p>
                    ${item.attributes.youtubeVideoId ? `<a href="https://www.youtube.com/watch?v=${item.attributes.youtubeVideoId}" target="_blank">Watch Trailer</a>` : '<p>No trailer available</p>'}
                `;
                resultsContainer.appendChild(itemCard);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
