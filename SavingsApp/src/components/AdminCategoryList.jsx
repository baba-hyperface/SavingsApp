
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
      console.log(response.data);
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
  const getShapeStyle = (shape,backgroundColor) => {
    const baseStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth animation
      cursor: "pointer", // Pointer effect for interactivity
      _hover: {
        transform: "scale(1.1)", // Zoom effect on hover
        boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
      },
    };

    switch (shape) {
      case "circle":
        return {
          ...baseStyle,
          borderRadius: "50%",
          backgroundColor,
          width: "50px",
          height: "50px",
        };
      case "square":
        return {
          ...baseStyle,
          borderRadius: "8px", // Rounded corners for square
          backgroundColor,
          width: "50px",
          height: "50px",
        };
      case "hexagon":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          width: "50px",
          height: "50px",
        };
      case "den":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath: "polygon(0% 20%, 100% 20%, 100% 80%, 0% 80%)", // "Den" shape with rectangular style
          width: "50px",
          height: "50px",
        };
        case "msg":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius:"60px 50px 50px 0px",
          width: "50px",
          height: "50px",
        };
      case "star":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          width: "50px",
          height: "50px",
        };
      case "cave":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius: "50px 50px 0px 0px",
          width: "50px",
          height: "50px",
          margintop:"10px"
        };
        

      default:
        return {};
    }
  };

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
                  style={{
                    margin: "auto",
                  }}
                  width="50Px"
                  height="50px"
                  {...getShapeStyle(category.shape,category.backgroundColor)}
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
                        fontSize: "150%",
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
