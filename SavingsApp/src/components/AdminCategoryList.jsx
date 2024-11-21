
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Heading,
  Button,
} from "@chakra-ui/react";
import api from "./api";
import "../styles/Admin.css"; 
import { Link } from "react-router-dom";
import { AdminNavigation } from "./AdminNavigation";

const ShowCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categoriesget");
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text fontSize="xl" color="red.500">
          {error}
        </Text>
      </Flex>
    );
  }

  return (
    <div className="admin-container">
      <AdminNavigation />
      <Flex py={4} alignItems={"center"} mt={4} justifyContent={"space-between"}>
      <Heading size="lg" textAlign="center">
        Categories
      </Heading>
      <span>
            <Link className="nav-link" to="/admincreatecategory">
            Create Category
            </Link>
            </span>
      </Flex>
      <table className="user-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Shape</th>
            <th>Background Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                <Flex
                  justify="center"
                  align="center"
                  boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                  width="30px"
                  height="30px"
                  borderRadius={category.shape === "circle" ? "50%" : "8px"}
                  backgroundColor={category.backgroundColor}
                  style={{
                    margin: "auto",
                  }}
                >
                  {category.iconType === "url" ? (
                    <img
                      src={category.icon}
                      alt="Category Icon"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <i
                      className={category.icon}
                      style={{
                        fontSize: "110%",
                        color: "white",
                      }}
                    />
                  )}
                </Flex>
              </td>
              <td>{category.name}</td>
              <td>{category.shape}</td>
              <td>{category.backgroundColor}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(category._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowCategory;
