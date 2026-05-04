import React, { useState } from "react";

function ListGroups() {
  const [groups, setGroups] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ LOGIN (Simulated if backend fails)
  const login = () => {
    fetch("https://itse-2374-app-4-back-s4gw.onrender.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: "cheguaro@gmail.com",
        password: "Password1",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful");
          setIsLoggedIn(true);
        } else {
          alert(data.message);
        }
      })
      .catch(() => {
        // ✅ Fallback (CORS / backend issue)
        alert("Login simulated (backend not reachable)");
        setIsLoggedIn(true);
      });
  };

  // ✅ FETCH GROUPS
  const fetchGroups = () => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    fetch("https://itse-2374-app-4-back-s4gw.onrender.com/api/groups", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.groups.length > 0) {
          setGroups(data.groups);
        } else {
          alert("No groups found");
          setGroups([]);
        }
      })
      .catch(() => {
        // ✅ Fallback if backend fails
        alert("Backend not reachable - showing sample data");
        setGroups([
          { id: 1, group_name: "Test Group 1" },
          { id: 2, group_name: "Test Group 2" },
        ]);
      });
  };

  return (
    <div>
      <h2>List Groups</h2>

      {/* LOGIN */}
      <button onClick={login}>Login First</button>

      <br /><br />

      {/* LIST BUTTON */}
      <button onClick={fetchGroups}>List Groups</button>

      <br /><br />

      {/* DISPLAY */}
      {groups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>{group.group_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListGroups;