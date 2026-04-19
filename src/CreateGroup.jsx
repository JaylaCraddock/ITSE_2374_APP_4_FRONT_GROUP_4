import React, { useState } from "react";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");

  // ✅ LOGIN (required for session)
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
      .then(async (res) => {
        console.log("Login status:", res.status);
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }
  
        return data;
      })
      .then(() => {
        alert("Login successful");
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  // ✅ CREATE GROUP
  const createGroup = () => {
    if (!groupName.trim()) {
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
        group_name: groupName,
      }),
    })
      .then(async (res) => {
        console.log("Create status:", res.status);
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || "Request failed");
        }
  
        return data;
      })
      .then((data) => {
        console.log("Create response:", data);
        alert("Group created successfully");
        setGroupName("");
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  return (
    <div>
      <h2>Create Group</h2>

      {/* 🔹 LOGIN BUTTON */}
      <button onClick={login}>Login First</button>

      <br /><br />

      {/* 🔹 INPUT */}
      <input
        type="text"
        placeholder="Enter Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <br /><br />

      {/* 🔹 CREATE BUTTON */}
      <button onClick={createGroup}>Create Group</button>
    </div>
  );
}

export default CreateGroup;