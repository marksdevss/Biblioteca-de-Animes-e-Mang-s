let currentUser = localStorage.getItem('currentUser');

document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.textContent = `Logged in as: ${currentUser}`;
        }
        displayFavorites();
    }
});

function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const filterType = document.getElementById('filter-type').value;
    favoritesContainer.innerHTML = '';
    const user = JSON.parse(localStorage.getItem(currentUser));
    if (user && user.library) {
        user.library.forEach(item => {
            if (filterType === 'all' || filterType === item.type) {
                const itemCard = document.createElement('div');
                itemCard.classList.add(item.type === 'anime' ? 'anime-card' : 'manga-card');
                itemCard.innerHTML = `
                    <img src="${item.attributes.posterImage.small}" alt="${item.attributes.titles.en_jp}">
                    <h3>${item.attributes.titles.en_jp}</h3>
                    <p>${item.attributes.synopsis}</p>
                    <p><strong>Start Date:</strong> ${item.attributes.startDate}</p>
                    <p><strong>Episodes:</strong> ${item.attributes.episodeCount}</p>
                    <p><strong>Average Rating:</strong> ${item.attributes.averageRating}</p>
                `;
                favoritesContainer.appendChild(itemCard);
            }
        });
    }
}
