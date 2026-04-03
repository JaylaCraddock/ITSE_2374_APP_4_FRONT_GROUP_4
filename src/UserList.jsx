import React, { useState } from "react";

function UserList() {
  const users = ["User 1", "User 2"];

  const [favorites, setFavorites] = useState([]);
  const [blocked, setBlocked] = useState([]);

  // Add to Favorites
  const addToFavorites = (user) => {
  if (favorites.includes(user)) {
    alert(user + " is already in favorites");
    return;
  }

  fetch("https://db-conn-email.onrender.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: 1,
      favorite_id: user === "User 1" ? 1 : 2,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setFavorites([...favorites, user]);
      alert(user + " added to favorites");
    })
    .catch((err) => {
      console.error(err);
      alert("Backend not running error occurred.");
    });
};

  // Block User
  const blockUser = (user) => {
    if (blocked.includes(user)) {
      alert(user + " is already blocked");
      return;
    }

    // 🔹 Simulating backend API using professor API
    fetch("https://db-conn-email.onrender.com/users_sam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user,
        email: user.toLowerCase().replace(" ", "") + "@test.com",
        password: "Test123"
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBlocked([...blocked, user]);
        alert(user + " blocked successfully");
      })
      .catch((err) => {
        console.error(err);
        alert("Server error");
      });
  };

  // Right-click handler
  const handleRightClick = (event, user) => {
    event.preventDefault();

    const action = window.prompt(
      "Type 1 for Add to Favorites\nType 2 for Block User"
    );

    if (action === "1") {
      const confirmAdd = window.confirm("Add " + user + " to Favorites?");
      if (confirmAdd) {
        addToFavorites(user);
      }
    }

    if (action === "2") {
      const confirmBlock = window.confirm("Block " + user + "?");
      if (confirmBlock) {
        blockUser(user);
      }
    }
  };

  return (
    <div>
      <h2>Users</h2>

      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            onContextMenu={(event) => handleRightClick(event, user)}
            style={{ cursor: "pointer" }}
          >
            {user}
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((fav, index) => (
          <li key={index}>{fav}</li>
        ))}
      </ul>

      <h2>Blocked Users</h2>
      <ul>
        {blocked.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
