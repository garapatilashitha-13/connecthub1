/* =====================================================
   CONNECTHUB - SOCIAL MEDIA PLATFORM
   JavaScript + Local Storage
   ===================================================== */


/* =====================================================
   SIGNUP
   ===================================================== */

function signup() {

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    if (name === "" || email === "" || password === "") {

        alert("Please fill all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check whether email already exists
    let existingUser = users.find(function(user) {
        return user.email === email;
    });

    if (existingUser) {

        alert("An account with this email already exists.");
        return;
    }

    let newUser = {

        name: name,
        email: email,
        password: password

    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Now login.");

    window.location.href = "login.html";
}


/* =====================================================
   LOGIN
   ===================================================== */

function login() {

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {

        alert("Please enter email and password.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(function(user) {

        return user.email === email &&
               user.password === password;

    });

    if (user) {

        // Store currently logged-in user
        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        alert("Login successful!");

        window.location.href = "home.html";

    } else {

        alert("Invalid email or password.");

    }
}


/* =====================================================
   CHECK USER LOGIN
   ===================================================== */

function checkUserLogin() {

    let currentUser =
        localStorage.getItem("currentUser");

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";
    }
}


/* =====================================================
   DISPLAY WELCOME MESSAGE
   ===================================================== */

function displayWelcome() {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    let welcome =
        document.getElementById("welcomeMessage");

    if (currentUser && welcome) {

        welcome.textContent =
            "Welcome, " + currentUser.name + "! 👋";
    }
}


/* =====================================================
   CREATE POST
   ===================================================== */

function createPost() {

    let postText =
        document.getElementById("postText").value.trim();

    if (postText === "") {

        alert("Please write something before posting.");
        return;
    }

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];


    let newPost = {

        id: Date.now(),

        text: postText,

        author: currentUser.name,

        email: currentUser.email,

        likes: 0,

        likedBy: []

    };


    posts.unshift(newPost);

    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );


    document.getElementById("postText").value = "";

    alert("Post published successfully! 🎉");

    displayPosts();
}


/* =====================================================
   DISPLAY POSTS
   ===================================================== */

function displayPosts() {

    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];

    let container =
        document.getElementById("posts");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (posts.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Be the first person to share something!</p>
            </div>
        `;

        return;
    }


    posts.forEach(function(post) {

        let postElement =
            document.createElement("div");

        postElement.className = "post-card";


        postElement.innerHTML = `

            <div class="post-header">

                <div class="avatar">
                    ${post.author.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3>${escapeHTML(post.author)}</h3>
                    <small>ConnectHub User</small>
                </div>

            </div>


            <p class="post-text">
                ${escapeHTML(post.text)}
            </p>


            <div class="post-actions">

                <button
                    class="like-btn"
                    onclick="likePost(${post.id})">

                    ❤️ ${post.likes} Likes

                </button>

            </div>

        `;


        container.appendChild(postElement);

    });
}


/* =====================================================
   LIKE POST
   ===================================================== */

function likePost(postId) {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please login first.");
        return;
    }


    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];


    let post =
        posts.find(function(post) {

            return post.id === postId;

        });


    if (!post) {
        return;
    }


    // Prevent same user from liking multiple times

    if (!post.likedBy) {

        post.likedBy = [];

    }


    if (post.likedBy.includes(currentUser.email)) {

        alert("You already liked this post.");

        return;

    }


    post.likes++;

    post.likedBy.push(currentUser.email);


    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );


    displayPosts();
}


/* =====================================================
   PROFILE
   ===================================================== */

function displayProfile() {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        return;
    }


    let nameElement =
        document.getElementById("profileName");

    let emailElement =
        document.getElementById("profileEmail");

    let countElement =
        document.getElementById("postCount");

    let postsElement =
        document.getElementById("myPosts");


    if (nameElement) {

        nameElement.textContent =
            currentUser.name;
    }


    if (emailElement) {

        emailElement.textContent =
            currentUser.email;
    }


    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];


    let myPosts =
        posts.filter(function(post) {

            return post.email === currentUser.email;

        });


    if (countElement) {

        countElement.textContent =
            myPosts.length;
    }


    if (!postsElement) {
        return;
    }


    postsElement.innerHTML = "";


    if (myPosts.length === 0) {

        postsElement.innerHTML = `
            <div class="empty-message">
                <h3>No posts yet</h3>
                <p>Go to Home and create your first post.</p>
            </div>
        `;

        return;
    }


    myPosts.forEach(function(post) {

        postsElement.innerHTML += `

            <div class="my-post">

                <p>${escapeHTML(post.text)}</p>

                <span>
                    ❤️ ${post.likes} Likes
                </span>

            </div>

        `;

    });
}


/* =====================================================
   USER LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem("currentUser");

    alert("You have been logged out.");

    window.location.href = "index.html";
}


/* =====================================================
   ADMIN LOGIN
   ===================================================== */

function adminLogin() {

    let username =
        document.getElementById("adminUsername").value.trim();

    let password =
        document.getElementById("adminPassword").value;


    if (username === "jaya" &&
        password === "jaya@123") {


        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        alert("Admin login successful!");

        window.location.href =
            "admin-dashboard.html";


    } else {

        alert("Invalid admin username or password.");

    }
}


/* =====================================================
   CHECK ADMIN LOGIN
   ===================================================== */

function checkAdminLogin() {

    let adminLoggedIn =
        localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {

        alert("Please login as admin first.");

        window.location.href =
            "admin-login.html";
    }
}


/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

function adminLogout() {

    localStorage.removeItem("adminLoggedIn");

    alert("Admin logged out.");

    window.location.href = "index.html";
}


/* =====================================================
   ADMIN - VIEW USERS
   ===================================================== */

function showUsers() {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let container =
        document.getElementById("users");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (users.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                <h3>No registered users</h3>
            </div>
        `;

        return;
    }


    users.forEach(function(user, index) {

        container.innerHTML += `

            <div class="user-row">

                <div class="user-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <div class="user-info">

                    <strong>
                        ${escapeHTML(user.name)}
                    </strong>

                    <span>
                        ${escapeHTML(user.email)}
                    </span>

                </div>

                <div class="user-number">
                    #${index + 1}
                </div>

            </div>

        `;

    });
}


/* =====================================================
   ADMIN - VIEW POSTS
   ===================================================== */

function showAdminPosts() {

    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];

    let container =
        document.getElementById("adminPosts");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (posts.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                <h3>No posts available</h3>
            </div>
        `;

        return;
    }


    posts.forEach(function(post) {

        container.innerHTML += `

            <div class="admin-post-row">

                <div>

                    <strong>
                        ${escapeHTML(post.author)}
                    </strong>

                    <p>
                        ${escapeHTML(post.text)}
                    </p>

                    <small>
                        ❤️ ${post.likes} Likes
                    </small>

                </div>


                <button
                    class="delete-btn"
                    onclick="deletePost(${post.id})">

                    🗑️ Delete

                </button>

            </div>

        `;

    });
}


/* =====================================================
   ADMIN - DELETE POST
   ===================================================== */

function deletePost(postId) {

    let confirmDelete =
        confirm("Are you sure you want to delete this post?");


    if (!confirmDelete) {
        return;
    }


    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];


    posts =
        posts.filter(function(post) {

            return post.id !== postId;

        });


    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );


    alert("Post deleted successfully.");

    showAdminPosts();

    updateAdminStats();
}


/* =====================================================
   ADMIN STATISTICS
   ===================================================== */

function updateAdminStats() {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let posts =
        JSON.parse(localStorage.getItem("posts")) || [];


    let userElement =
        document.getElementById("totalUsers");

    let postElement =
        document.getElementById("totalPosts");


    if (userElement) {

        userElement.textContent =
            users.length;
    }


    if (postElement) {

        postElement.textContent =
            posts.length;
    }
}


/* =====================================================
   SECURITY / DISPLAY HELPER
   ===================================================== */

function escapeHTML(text) {

    let div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}