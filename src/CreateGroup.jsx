import React, { useState } from "react";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ LOGIN FUNCTION
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
        console.log("Login response:", data);

        if (data.success) {
          setIsLoggedIn(true); // ✅ mark user as logged in
          alert("Login successful");
        } else {
          alert(data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed");
      });
  };

  // ✅ CREATE GROUP FUNCTION
  const createGroup = () => {
    // 🚫 BLOCK if not logged in
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    // 🚫 BLOCK empty or spaces-only input
    if (!groupName || groupName.trim().length === 0) {
      alert("Group name is required");
      return;
    }

    fetch("https://itse-2374-app-4-back-s4gw.onrender.com/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        group_name: groupName.trim(), // ✅ clean input
      }),
    })
      .then((res) => {
        console.log("Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Response:", data);

        if (data.success) {
          alert("Group created successfully");
          setGroupName(""); // optional reset
        } else {
          // ✅ handle backend validation errors properly
          if (data.errors && data.errors.length > 0) {
            alert(data.errors[0]);
          } else {
            alert(data.message || "Error occurred");
          }
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error");
      });
  };

  return (
    <div>
      <h2>Create Group</h2>

      {/* ✅ LOGIN BUTTON */}
      <button onClick={login}>Login First</button>

      <br /><br />

      {/* ✅ INPUT FIELD */}
      <input
        type="text"
        placeholder="Enter Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <br /><br />

      {/* ✅ CREATE BUTTON */}
      <button onClick={createGroup}>Create Group</button>
    </div>
  );
}

export default CreateGroup;