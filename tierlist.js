const tierCategories = ['S', 'A', 'B', 'C', 'D'];
const tierListContainer = document.getElementById('tier-list-container');

function loadTierList() {
    const savedTierList = JSON.parse(localStorage.getItem('tierList')) || {};

    tierCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('tier-category');
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = `${category} Tier`;
        categoryDiv.appendChild(categoryTitle);
        
        const tierItems = document.createElement('div');
        tierItems.classList.add('tier-items');
        tierItems.setAttribute('data-category', category);

        (savedTierList[category] || []).forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('tier-item');
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
            `;
            tierItems.appendChild(itemDiv);
        });

        categoryDiv.appendChild(tierItems);
        tierListContainer.appendChild(categoryDiv);
    });
}

function saveTierList() {
    const tierList = {};

    document.querySelectorAll('.tier-items').forEach(tierItems => {
        const category = tierItems.getAttribute('data-category');
        const items = [];
        tierItems.querySelectorAll('.tier-item').forEach(item => {
            const name = item.querySelector('p').textContent;
            const image = item.querySelector('img').src;
            items.push({ name, image });
        });
        tierList[category] = items;
    });

    localStorage.setItem('tierList', JSON.stringify(tierList));
    alert('Tier List saved!');
}

function addItemToTierList(event) {
    event.preventDefault();
    
    const itemName = document.getElementById('item-name').value;
    const itemCategory = document.getElementById('item-category').value;

    fetch(`https://kitsu.io/api/edge/anime?filter[text]=${itemName}`)
        .then(response => response.json())
        .then(data => {
            const anime = data.data[0];
            const imageUrl = anime.attributes.posterImage.small;
            const tierItems = document.querySelector(`.tier-items[data-category="${itemCategory}"]`);
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('tier-item');
            itemDiv.innerHTML = `
                <img src="${imageUrl}" alt="${itemName}">
                <p>${itemName}</p>
                <button class="edit">Edit</button>
                <button class="remove">Remove</button>
            `;
            tierItems.appendChild(itemDiv);

            itemDiv.querySelector('.edit').addEventListener('click', function() {
                document.getElementById('item-name').value = itemName;
                document.getElementById('item-category').value = itemCategory;
                itemDiv.remove();
            });

            itemDiv.querySelector('.remove').addEventListener('click', function() {
                itemDiv.remove();
            });

            document.getElementById('item-name').value = '';
        })
        .catch(error => console.error('Error fetching data:', error));
}


document.getElementById('save-tier-list').addEventListener('click', saveTierList);
document.getElementById('add-item-form').addEventListener('submit', addItemToTierList);
document.addEventListener('DOMContentLoaded', loadTierList);



document.getElementById('item-name').addEventListener('input', function() {
    const query = this.value;
    if (query.length > 2) {
        fetch(`https://kitsu.io/api/edge/anime?filter[text]=${query}`)
            .then(response => response.json())
            .then(data => {
                const suggestions = document.getElementById('suggestions');
                suggestions.innerHTML = '';
                data.data.forEach(item => {
                    const suggestion = document.createElement('li');
                    suggestion.textContent = item.attributes.titles.en_jp;
                    suggestion.addEventListener('click', function() {
                        document.getElementById('item-name').value = this.textContent;
                        suggestions.innerHTML = '';
                    });
                    suggestions.appendChild(suggestion);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    tierCategories.forEach(category => {
        const tierItems = document.querySelector(`.tier-items[data-category="${category}"]`);
        new Sortable(tierItems, {
            animation: 150,
            ghostClass: 'sortable-ghost'
        });
    });
});


function shareTierList() {
    const tierListContainer = document.getElementById('tier-list-container');
    html2canvas(tierListContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'tier-list.png';
        link.click();
    });
}

document.getElementById('share-tier-list').addEventListener('click', shareTierList);
