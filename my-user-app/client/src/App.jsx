import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", name: "", role: "student" });
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!form.email || !form.name) return alert("Fill in all fields");

    if (editId) {
      await fetch(`/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ email: "", name: "", role: "student" });
    setEditId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <div>
      <h1 className="header">MY USER APP</h1>
      <h2 className="subheader">List of Users</h2>
      <table>
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>User Email</th>
            <th>User Name</th>
            <th>User Role</th>
            <th>Action</th>
          </tr>
          <tr>
            <td>#</td>
            <td>
              <input name="email" value={form.email} onChange={handleChange} />
            </td>
            <td>
              <input name="name" value={form.name} onChange={handleChange} />
            </td>
            <td>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <button onClick={handleAddOrUpdate}>
                {editId ? "Update" : "Add User"}
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user._id}>
              <td>{i + 1}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
