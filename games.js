document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    searchGames(query);
});

function searchGames(query) {
    fetch(`https://api.rawg.io/api/games?key=9fa7ef1b92634c39ad1f407e41de0ca3&search=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';
            data.results.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add('game-card');
                itemCard.innerHTML = `
                    <img src="${item.background_image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Rating: ${item.rating}</p>
                    <p>Released: ${item.released}</p>
                `;
                resultsContainer.appendChild(itemCard);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
