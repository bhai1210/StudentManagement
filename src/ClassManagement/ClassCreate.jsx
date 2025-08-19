import axios from "axios";
import React, { useEffect, useState } from "react";
import Payment from "../Copmonents/Payment/Payment";

function ClassCreate() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // track which class is being edited
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    teacher: "",
    student: "",
  });

  // handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // fetch all classes
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/class");
      if (Array.isArray(response.data?.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // create or update class
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editId) {
        // update existing class
        const response = await axios.put(
          `http://localhost:5000/class/${editId}`,
          {
            name: formData.name,
            subject: formData.subject,
            teacher: formData.teacher,
            students: [formData.student],
          }
        );

        console.log("Updated:", response.data);
        setEditId(null); // reset edit mode
      } else {
        // create new class
        const response = await axios.post("http://localhost:5000/class", {
          name: formData.name,
          subject: formData.subject,
          teacher: formData.teacher,
          students: [formData.student],
        });

        console.log("Created:", response.data);
      }

      // refresh list
      fetchUsers();

      // reset form
      setFormData({ name: "", subject: "", teacher: "", student: "" });
    } catch (err) {
      console.error("Error saving class:", err.message);
    }
  };

  // edit handler (just pre-fill form)
  const onedit = (user) => {
    setEditId(user._id);
    setFormData({
      name: user.name || "",
      subject: user.subject || "",
      teacher: user.teacher || "",
      student: user.students?.[0] || "",
    });
  };

  // delete class
  const deleteuser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/class/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting class:", err.message);
    }
  };

  return (
    <div className="App">
      <h1>{editId ? "Edit Class" : "Create Class"}</h1>
      <Payment />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Class Name"
          required
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />
        <input
          type="text"
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          placeholder="Teacher"
          required
        />
        <input
          type="text"
          name="student"
          value={formData.student}
          onChange={handleChange}
          placeholder="Student"
          required
        />
        <button type="submit">{editId ? "Update" : "Submit"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ name: "", subject: "", teacher: "", student: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Class List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Class List</h2>
          {users.length > 0 ? (
            <table border={1}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Students</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u && u._id)
                  .map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || "N/A"}</td>
                      <td>{user.subject || "N/A"}</td>
                      <td>{user.teacher || "N/A"}</td>
                      <td>{(user.students || []).join(", ")}</td>
                      <td>
                        <button onClick={() => onedit(user)}>Edit</button>
                      </td>
                      <td>
                        <button onClick={() => deleteuser(user._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No classes found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default ClassCreate;
