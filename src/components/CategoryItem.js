// src/components/CategoryItem.js
import React, { useState } from "react";

const CategoryItem = ({
  category,
  parent,
  handleEdit,
  handleDelete,
  handleCreate,
  setModal,
  handleExpand,
}) => {
  if(category.isExpanded || category._id !== "000000000000000000000000"){
    return (
      <div key={category._id} className="border-l-2 pl-4 mt-2">
        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
          <span className="text-gray-800 font-medium flex align-center">
            {category.name}
            <div className="flex space-x-4 ml-3">
              {!category?.isExpand && (
                <button
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-blue-500 bg-gray-200 hover:bg-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  aria-label="Right Arrow"
                  onClick={() => {
                    category.isExpand = true
                    handleExpand(category._id, true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              {category?.isExpand && (
                <button
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-green-500 bg-gray-200 hover:bg-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  aria-label="Down Arrow"
                  onClick={() => {
                    category.isExpand = false
                    handleExpand(category._id, false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 7.293a1 1 0 00-1.414 0L10 12.586 4.707 7.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </span>
          <div className="flex space-x-2">
            {category.parent_id !== "000000000000000000000000" && (
              <button
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() =>
                  setModal({ open: true, type: "edit", category, parent })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7.05 10.121a1 1 0 00-.263.465l-1.11 4.44a1 1 0 001.213 1.213l4.44-1.11a1 1 0 00.465-.263l7.536-7.535a2 2 0 000-2.828l-1.414-1.415zM4 17a1 1 0 100 2h12a1 1 0 100-2H4z" />
                </svg>
              </button>
            )}
            {category.parent_id !== "000000000000000000000000" && (
              <button
                className="flex items-center justify-center p-2 text-gray-500 hover:text-white bg-gray-200 hover:bg-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition"
                aria-label="Delete"
                onClick={() => handleDelete(category._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.5 3a1 1 0 00-1 1v1H3a1 1 0 100 2h1v10a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2.5V4a1 1 0 00-1-1h-5zM7 4h6v1H7V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <button
              className="flex items-center justify-center p-2 text-gray-500 hover:text-white bg-gray-200 hover:bg-green-500 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
              aria-label="Add"
              onClick={() =>
                setModal({ open: true, type: "create", parent: category })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {
          (!category.children?.length && category.isExpand) &&
          <h5>No category/categories under {category.name}</h5>
        }
         {category.children?.length && category?.children.map((cat) => {
          return <CategoryItem
          key={cat._id}
          category={cat}
          parent={parent}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleCreate={handleCreate}
          setModal={setModal}
          handleExpand = {handleExpand}
        />
         })}
      </div>
    );
  }
};

export default CategoryItem;
