let currentUser = localStorage.getItem('currentUser');

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    if (localStorage.getItem(username)) {
        alert('Nome de usuário já existe');
        return;
    }

    const user = {
        username: username,
        password: password,
        library: []
    };
    
    localStorage.setItem(username, JSON.stringify(user));
    alert('Usuário registrado com sucesso');
    window.location.href = 'LoginOtk.html'; // Redirecionar para a página de login após o registro
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = JSON.parse(localStorage.getItem(username));
    
    if (!user || user.password !== password) {
        alert('Credenciais inválidas');
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    alert('Login bem-sucedido');
    window.location.href = 'ANIME-LISTS.html'; // Redirecionar para a página inicial após o login
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!currentUser) {
        alert('Você deve estar logado para buscar.');
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
                    <p><strong>Data de Início:</strong> ${item.attributes.startDate}</p>
                    <p><strong>Episódios:</strong> ${item.attributes.episodeCount}</p>
                    <p><strong>Avaliação Média:</strong> ${item.attributes.averageRating}</p>
                    <button onclick="addToFavorites('${item.id}', '${type}')">Adicionar aos Favoritos</button>
                `;
                resultsContainer.appendChild(itemCard);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}


document.getElementById('clear-button').addEventListener('click', function() {
    clearSearch();
});

function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('results-container').innerHTML = '';
}

function addToFavorites(id, type) {
    if (!currentUser) {
        alert('Você deve estar logado para adicionar aos favoritos.');
        return;
    }
    
    fetch(`https://kitsu.io/api/edge/${type}/${id}`)
        .then(response => response.json())
        .then(data => {
            const user = JSON.parse(localStorage.getItem(currentUser));
            if (!user.library.some(item => item.id === data.data.id)) {
                user.library.push(data.data);
                localStorage.setItem(currentUser, JSON.stringify(user));
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} adicionado aos favoritos!`);
                console.log('Biblioteca após adicionar:', user.library); // Log a biblioteca após adicionar
            } else {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} já está nos seus favoritos!`);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function clearLibrary() {
    if (!currentUser) {
        alert('Você deve estar logado para limpar a biblioteca.');
        return;
    }

    const user = JSON.parse(localStorage.getItem(currentUser));
    user.library = [];
    localStorage.setItem(currentUser, JSON.stringify(user));
    displayFavorites();
    alert('Biblioteca limpa!');
    console.log('Biblioteca após limpar:', user.library); // Log a biblioteca após limpar
}
