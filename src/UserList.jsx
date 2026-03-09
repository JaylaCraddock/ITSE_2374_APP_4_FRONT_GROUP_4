import React, { useState } from "react";

function UserList() {
  const users = ["User 1", "User 2"];
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (user) => {
    if (favorites.includes(user)) {
      alert(user + " is already in favorites");
      return;
    }
  
    setFavorites([...favorites, user]);
    alert(user + " added to favorites");
  };
  
  const handleRightClick = (event, user) => {
    event.preventDefault(); // prevents browser default menu

    const confirmAdd = window.confirm(
      "Add " + user + " to Favorites?"
    );

    if (confirmAdd) {
      addToFavorites(user);
    }
  };

  return (
    <div>
      <h2>Users</h2>

      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            onContextMenu={(event) =>
              handleRightClick(event, user)
            }
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
    </div>
  );
}

export default UserList;