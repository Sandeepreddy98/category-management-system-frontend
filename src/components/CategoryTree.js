// src/components/CategoryTree.js
import React from "react";
import CategoryItem from "./CategoryItem";

const CategoryTree = ({ categories, parent, handleDelete, handleEdit, handleCreate, setModal, handleExpand}) => {
  return categories.length && categories.map((category) => (
    <CategoryItem
      key={category._id}
      category={category}
      parent={parent}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      handleCreate={handleCreate}
      setModal={setModal}
      handleExpand = {handleExpand}
    />
  ));
};

export default CategoryTree;
