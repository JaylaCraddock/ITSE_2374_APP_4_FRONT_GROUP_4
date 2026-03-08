import React, { useState } from "react";

function UserList() {
  const users = ["User 1", "User 2", "User 3"];

  const [favorites, setFavorites] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const addToFavorites = (user) => {
    if (favorites.includes(user)) {
      alert(user + " already in favorites");
      return;
    }

    setFavorites([...favorites, user]);
  };

  const blockUser = (user) => {
    if (blocked.includes(user)) {
      alert(user + " already blocked");
      return;
    }

    setBlocked([...blocked, user]);
  };

  const handleRightClick = (event, user) => {
    event.preventDefault();

    const action = window.prompt(
      "Type 1 for Add to Favorites\nType 2 for Block User"
    );

    if (action === "1") {
      addToFavorites(user);
    }

    if (action === "2") {
      blockUser(user);
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
            style={{ cursor: "pointer", margin: "5px" }}
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