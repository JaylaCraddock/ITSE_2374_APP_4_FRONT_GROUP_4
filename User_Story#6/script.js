// Simulated logged-in user
const currentUserId = 1;
let selectedUser = null;

// Sample users (normally loaded from backend)
const users = [
    { id: 2, name: "Sam Shaw", email: "sam@collin.com" },
    { id: 3, name: "Tristan Mathieson", email: "tristan@collin.com" },
    { id: 4, name: "Jayla Craddock", email: "jayla@collin.com" },
    { id: 5, name: "Jose Lugo", email: "jose@collin.com" },
    { id: 6, name: "Jack Hagan", email: "jack@collin.com" }
];

const tableBody = document.querySelector("#userTable tbody");
const contextMenu = document.getElementById("contextMenu");
const addFavoriteBtn = document.getElementById("addFavorite");

// -------------------------------
// Load Users into Table
// -------------------------------
users.forEach(user => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
    `;

    // Right-click event
    row.addEventListener("contextmenu", function(e) {
        e.preventDefault();

        selectedUser = user;

        contextMenu.style.display = "block";
        contextMenu.style.left = e.pageX + "px";
        contextMenu.style.top = e.pageY + "px";
    });

    tableBody.appendChild(row);
});

// Hide menu when clicking anywhere else
document.addEventListener("click", function() {
    contextMenu.style.display = "none";
});

// -------------------------------
// Add to Favorites (POST Call)
// -------------------------------
addFavoriteBtn.addEventListener("click", async function() {

    if (!selectedUser) return;

    try {
        // Using professor's test API for now
        const response = await fetch("https://db-conn-email.onrender.com/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedUser.name,
                email: selectedUser.email,
                password: "test123"
            })
        });

        const data = await response.json();

        alert("User added to favorites successfully!\nReturned ID: " + data.id);

    } catch (error) {
        console.error(error);
        alert("Error connecting to server.");
    }

    contextMenu.style.display = "none";
});