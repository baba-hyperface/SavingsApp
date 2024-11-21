// // import React, { useEffect, useState } from "react";
// // import {
// //   Box,
// //   Flex,
// //   Text,
// //   VStack,
// //   Spinner,
// //   Heading,
// //   Button,
// // } from "@chakra-ui/react";
// // import api from "./api";

// // const ShowCategory = () => {
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchCategories = async () => {
// //     try {
// //       const response = await api.get("/categoriesget");
// //       setCategories(response.data);
// //       setLoading(false);
// //     } catch (err) {
// //       console.error("Error fetching categories:", err);
// //       setError("Failed to load categories.");
// //       setLoading(false);
// //     }
// //   };
// //   const handleDelete = async (id) => {
// //     try {
// //       await api.delete(`/categories/${id}`);
// //       setCategories(categories.filter((category) => category._id !== id));
// //     } catch (error) {
// //       console.error("Error deleting category:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCategories();
// //   }, []);

// //   const getShapeStyle = (shape, backgroundColor) => {
// //     const baseStyle = {
// //       display: "flex",
// //       justifyContent: "center",
// //       alignItems: "center",
// //       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
// //       width: "100px",
// //       height: "100px",
// //     };

// //     switch (shape) {
// //       case "circle":
// //         return { ...baseStyle, borderRadius: "50%", backgroundColor };
// //       case "square":
// //         return { ...baseStyle, borderRadius: "8px", backgroundColor };
// //       case "hexagon":
// //         return {
// //           ...baseStyle,
// //           backgroundColor,
// //           clipPath:
// //             "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
// //         };
// //       case "cave":
// //         return {
// //           ...baseStyle,
// //           backgroundColor,
// //           borderRadius: "50px 50px 0 0",
// //         };
// //       case "star":
// //         return {
// //           ...baseStyle,
// //           backgroundColor,
// //           clipPath:
// //             "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
// //         };
// //       default:
// //         return baseStyle;
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Flex justify="center" align="center" h="100vh">
// //         <Spinner size="xl" />
// //       </Flex>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Flex justify="center" align="center" h="100vh">
// //         <Text fontSize="xl" color="red.500">
// //           {error}
// //         </Text>
// //       </Flex>
// //     );
// //   }

// //   return (
// //     <Box maxW="800px" mx="auto" mt={8} p={6}>
// //       <Heading size="lg" mb={6} textAlign="center">
// //         Categories
// //       </Heading>
// //       <VStack spacing={6}>
// //         {categories.map((category) => (
// //           <Flex
// //             key={category.id}
// //             align="center"
// //             p={4}
// //             borderWidth="1px"
// //             borderRadius="lg"
// //             w="full"
// //             bg="white"
// //             _dark={{ bg: "gray.800" }}
// //             shadow="md"
// //             justify="space-between"
// //           >
// //             <Flex align="center">
// //               <Box
// //                 {...getShapeStyle(category.shape, category.backgroundColor)}
// //                 mr={4}
// //               >
// //                 {category.iconType === "url" ? (
// //                   <img
// //                     src={category.icon}
// //                     alt="Category Icon"
// //                     style={{
// //                       width: "100%",
// //                       height: "100%",
// //                       objectFit: "contain",
// //                       borderRadius: category.shape === "circle" ? "50%" : "0", // Circle-specific styling
// //                     }}
// //                   />
// //                 ) : (
// //                   <i
// //                     className={category.icon}
// //                     style={{
// //                       fontSize: "200%",
// //                       color: "white",
// //                     }}
// //                   />
// //                 )}
// //               </Box>
// //               <Text fontWeight="bold" fontSize="lg">
// //                 {category.name}
// //               </Text>
// //             </Flex>

// //             <Button
// //               colorScheme="red"
// //               _hover={{ backgroundColor: "grey" }}
// //               onClick={() => handleDelete(category._id)}
// //             >
// //               Delete
// //             </Button>
// //           </Flex>
// //         ))}
// //       </VStack>
// //     </Box>
// //   );
// // };

// // export default ShowCategory;
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Spinner,
//   Heading,
//   Button,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
// } from "@chakra-ui/react";
// import api from "./api";

// const ShowCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get("/categoriesget");
//       setCategories(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError("Failed to load categories.");
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/categories/${id}`);
//       setCategories(categories.filter((category) => category._id !== id));
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   if (loading) {
//     return (
//       <Flex justify="center" align="center" h="100vh">
//         <Spinner size="xl" />
//       </Flex>
//     );
//   }

//   if (error) {
//     return (
//       <Flex justify="center" align="center" h="100vh">
//         <Text fontSize="xl" color="red.500">
//           {error}
//         </Text>
//       </Flex>
//     );
//   }

//   return (
//     <Box maxW="800px" mx="auto" mt={8} p={6}>
//       <Heading size="lg" mb={6} textAlign="center">
//         Categories
//       </Heading>
//       <TableContainer>
//         <Table variant="striped" colorScheme="gray">
//           <Thead>
//              <Tr fontWeight="bold" color="black" fontSize="lg" >
//               <Th fontWeight="bold" fontSize="lg">Icon</Th>
//               <Th fontWeight="bold" fontSize="lg">Name</Th>
//               <Th fontWeight="bold" fontSize="lg">Shape</Th>
//               <Th fontWeight="bold" fontSize="lg">Background Color</Th>
//               <Th fontWeight="bold" fontSize="lg">Actions</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {categories.map((category) => (
//               <Tr key={category._id}>
//                 <Td>
//                   <Flex
//                     {...{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                       width: "30px",
//                       height: "30px",
//                       borderRadius:
//                         category.shape === "circle" ? "50%" : "8px",
//                       backgroundColor: category.backgroundColor,
//                     }}
//                   >
//                     {category.iconType === "url" ? (
//                       <img
//                         src={category.icon}
//                         alt="Category Icon"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "contain",
//                         }}
//                       />
//                     ) : (
//                       <i
//                         className={category.icon}
//                         style={{
//                           fontSize: "110%",
//                           color: "white",
//                         }}
//                       />
//                     )}
//                   </Flex>
//                 </Td>
//                 <Td>{category.name}</Td>
//                 <Td>{category.shape}</Td>
//                 <Td>{category.backgroundColor}</Td>
//                 <Td>
//                   <Button
//                     colorScheme="red"
//                     onClick={() => handleDelete(category._id)}
//                   >
//                     Delete
//                   </Button>
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default ShowCategory;
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
import "../styles/Admin.css"; // Reuse Admin.css styles
import { Link } from "react-router-dom";

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
