let currentUser = localStorage.getItem('currentUser');

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    if (localStorage.getItem(username)) {
        alert('Username already exists');
        return;
    }

    const user = {
        username: username,
        password: password,
        library: []
    };
    
    localStorage.setItem(username, JSON.stringify(user));
    alert('User registered successfully');
    window.location.href = 'login.html'; // Redirect to login page after registration
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = JSON.parse(localStorage.getItem(username));
    
    if (!user || user.password !== password) {
        alert('Invalid credentials');
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    alert('Login successful');
    window.location.href = 'ANIME-LISTS.html'; // Redirect to home page after login
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!currentUser) {
        alert('You must be logged in to search.');
        return;
    }
    const query = document.getElementById('search-input').value;
    const type = document.getElementById('search-type').value;
    searchMedia(query, type);
});

function searchMedia(query, type) {
    fetch(`https://kitsu.io/api/edge/${type}?filter[text]=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';
            data.data.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add(type === 'anime' ? 'anime-card' : 'manga-card');
                itemCard.innerHTML = `
                    <img src="${item.attributes.posterImage.small}" alt="${item.attributes.titles.en_jp}">
                    <h3>${item.attributes.titles.en_jp}</h3>
                    <p>${item.attributes.synopsis}</p>
                    <button onclick="addToFavorites('${item.id}', '${type}')">Add to Favorites</button>
                `;
                resultsContainer.appendChild(itemCard);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function addToFavorites(id, type) {
    if (!currentUser) {
        alert('You must be logged in to add favorites.');
        return;
    }
    
    fetch(`https://kitsu.io/api/edge/${type}/${id}`)
        .then(response => response.json())
        .then(data => {
            const user = JSON.parse(localStorage.getItem(currentUser));
            user.library.push(data.data);
            localStorage.setItem(currentUser, JSON.stringify(user));
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} added to favorites!`);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        document.getElementById('user-info').textContent = `Logged in as: ${currentUser}`;
    }
});
