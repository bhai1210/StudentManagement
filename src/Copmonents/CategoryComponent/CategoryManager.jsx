import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../Services/api";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add category
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await api.post("/categories", {
        name: newCategory,
      });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category", err);
    }
  };

  // ✅ Update category
  const updateCategory = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/categories/${id}`, {
        name: editName,
      });
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      console.error("Error updating category", err);
    }
  };

  // ✅ Delete category
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Category Manager</h2>

      {/* ➕ Add Category */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{
            padding: "8px",
            width: "70%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={addCategory}
          style={{
            padding: "8px 12px",
            marginLeft: "8px",
            background: "#407BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* 📋 Category List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "5px",
            }}
          >
            {editId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ padding: "6px", flex: 1 }}
                />
                <button
                  onClick={() => updateCategory(cat.id)}
                  style={{
                    marginLeft: "8px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "6px 10px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  style={{
                    marginLeft: "8px",
                    background: "gray",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "6px 10px",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div>
                  <button
                    onClick={() => {
                      setEditId(cat.id);
                      setEditName(cat.name);
                    }}
                    style={{
                      marginRight: "8px",
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "6px 10px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "6px 10px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
