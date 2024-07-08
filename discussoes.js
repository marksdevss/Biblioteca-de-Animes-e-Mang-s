document.addEventListener('DOMContentLoaded', function() {
    loadPosts();

    document.getElementById('post-form').addEventListener('submit', function(event) {
        event.preventDefault();
        addPost();
    });
});

function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    posts.forEach((post, index) => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Category:</strong> ${post.category}</p>
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
            <div class="post-actions">
                <button class="like-button" onclick="likePost(${index})">Like (${post.likes || 0})</button>
                <button class="save-button" onclick="savePost(${index})">Save</button>
            </div>
            <div class="response-section" id="responses-${index}">
                <h4>Responses</h4>
                <div class="responses-container">
                    ${(post.responses || []).map(response => `
                        <div class="response-card">
                            <p>${response}</p>
                        </div>
                    `).join('')}
                </div>
                <form class="response-form" data-post-index="${index}">
                    <textarea placeholder="Write a response..." required></textarea>
                    <button type="submit">Respond</button>
                </form>
            </div>
        `;
        postsContainer.appendChild(postCard);

        postCard.querySelector('.response-form').addEventListener('submit', function(event) {
            event.preventDefault();
            addResponse(index, event.target.querySelector('textarea').value);
            event.target.reset();
        });
    });
}

function addPost() {
    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const content = document.getElementById('post-content').value;
    const imageInput = document.getElementById('post-image');
    
    const newPost = {
        title,
        category,
        content,
        image: '',
        responses: [],
        likes: 0
    };

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
            saveNewPost(newPost);
        }
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveNewPost(newPost);
    }
}

function saveNewPost(post) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();

    document.getElementById('post-form').reset();
}

function addResponse(postIndex, responseContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (posts[postIndex]) {
        posts[postIndex].responses = posts[postIndex].responses || [];
        posts[postIndex].responses.push(responseContent);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

function likePost(postIndex) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (posts[postIndex]) {
        posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

function savePost(postIndex) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
    if (posts[postIndex] && !savedPosts.includes(postIndex)) {
        savedPosts.push(postIndex);
        localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
        alert('Post saved!');
    } else {
        alert('Post already saved!');
    }
}
