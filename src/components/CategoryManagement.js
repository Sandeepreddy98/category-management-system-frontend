import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CategoryTree from './CategoryTree';
import { BACKEND_URL } from '../utils/constants';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({ open: false, type: "", category: null, parent: null });
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    const fetchRootCategory = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/categories/init`);
          const category = await fetchCategories(response.data.data.parent_id);
          setCategories(category)
        } catch (err) {
          console.error(err);
        }
      };
      fetchRootCategory();
  }, []);

  const fetchCategories = async (parentId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/categories/${parentId}`);
      if(response.data.data){
        response.data.data.map(cat => cat.isExpand = false)
      }else{
        response.data.data = []
      }
      return response.data.data;
    } catch (err) {
      console.error(err);
    }
  };

  // Delete category via API
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/categories/${id}`);
      const updatedCategories = deleteCategory(categories, id);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const deleteCategory = (categories, id) => {
    return categories
      .map((cat) => {
        if (cat._id === id) return null;
        if (cat.children) cat.children = deleteCategory(cat.children, id);
        return cat;
      })
      .filter(Boolean);
  };

  // Edit category via API
  const handleEdit = async (id, newName) => {
    try {
      const response = await axios.patch(`${BACKEND_URL}/categories/${id}`, { name: newName });
      const updatedCategories = updateCategory(categories, id, newName);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const updateCategory = (categories, id, newName) => {
    return categories.map((cat) => {
      if (cat._id === id) {
        cat.name = newName;
      }
      if (cat.children) cat.children = updateCategory(cat.children, id, newName);
      return cat;
    });
  };

  // Create category via API
  const handleCreate = async (newCategoryName, parentId) => {
    const newCategory = {
      name: newCategoryName,
      parent_id: parentId,
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/categories/create`, newCategory);
      const updatedCategories = addCategory(categories, parentId, response.data.category);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const addCategory = (categories, parentId, newCategory) => {
    return categories.map((cat) => {
      if (cat._id === parentId) {
        cat.children = [...cat.children, newCategory];
      }
      if (cat.children) cat.children = addCategory(cat.children, parentId, newCategory);
      return cat;
    });
  };

  const handleExpand = async (parentId, status) => {
    if (status) {
      const latest_category = await addChildren(categories, parentId);
      setCategories(latest_category);
    } else {
      const collapsedCategories = collapseNode(categories, parentId);
      setCategories(collapsedCategories);
    }
  };

  const addChildren = async (categories, parentId) => {
    // First, locate the target node
    const targetNode = findNode(categories, parentId);

    if (targetNode && !targetNode.children) {
      // If the node is found and it doesn't already have children, fetch the data
      const category = await fetchCategories(parentId);
      targetNode.children = category; // Add fetched children to the target node
    }

    // Return the updated categories
    return [...categories];
  };

  const findNode = (categories, parentId) => {
    // Recursively search for the node with the given parentId
    for (const cat of categories) {
      if (cat._id === parentId) {
        return cat; // Return the node if found
      }
      if (cat.children && cat.children.length > 0) {
        const foundNode = findNode(cat.children, parentId);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null; // Return null if the node is not found
  };

  const collapseNode = (categories, parentId) => {
    // Recursively traverse the tree to find and remove the `children` property for the matching node
    return categories.map((cat) => {
      if (cat._id === parentId) {
        // If parentId matches, remove the `children` property
        const { children, ...rest } = cat; // Destructure to remove `children`
        return rest;
      } else if (cat.children && cat.children.length > 0) {
        // If the node has children, recursively handle them
        return {
          ...cat,
          children: collapseNode(cat.children, parentId),
        };
      }
      return cat; // Return the node as is if no match
    });
  };
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <CategoryTree
        categories={categories}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleCreate={handleCreate}
        setModal={setModal}
        handleExpand = {handleExpand}
      />
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            {modal.type === "edit" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
                <input
                  type="text"
                  defaultValue={modal.category.name}
                  className="w-full p-2 border rounded mb-4"
                  onChange={(e) => (modal.category.name = e.target.value)}
                />
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    handleEdit(modal.category._id, modal.category.name);
                    setModal({ open: false });
                  }}
                >
                  Save
                </button>
              </div>
            )}
            {modal.type === "create" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Create Category</h2>
                <input
                  type="text"
                  placeholder="Enter category name"
                  className="w-full p-2 border rounded mb-4"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  onClick={() => {
                    handleCreate(newCategoryName, modal.parent?._id);
                    setNewCategoryName(""); // Clear input
                    setModal({ open: false });
                  }}
                >
                  Create
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement