import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Flex,
  VStack,
  Heading,
  useToast
} from "@chakra-ui/react";
import api from "./api";

export const CategoryForm = () => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(""); 
    const [backgroundColor, setBackgroundColor] = useState("");
  const [shape, setShape] = useState("");
  const [iconType, setIconType] = useState("url");
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = { name, icon, backgroundColor, shape ,iconType};
      const response = await api.post("/categoriescreating", newCategory);
      console.log(response);
      toast({
        title: "category creation successful.",
        description: "Thank",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    //   onCategoryCreated(response.data); // Notify parent to refresh list
      setName("");
      setIcon("");
      setBackgroundColor("#ffffff");
      setShape("circle");
      setIconType("url");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const getShapeStyle = () => {
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
          width: "100px",
          height: "100px",
        };
      case "square":
        return {
          ...baseStyle,
          borderRadius: "8px", // Rounded corners for square
          backgroundColor,
          width: "100px",
          height: "100px",
        };
      case "hexagon":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          width: "100px",
          height: "100px",
        };
      case "den":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath: "polygon(0% 20%, 100% 20%, 100% 80%, 0% 80%)", // "Den" shape with rectangular style
          width: "120px",
          height: "80px",
        };
      case "star":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          width: "100px",
          height: "100px",
        };
      case "cave":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius: "50px 50px 0px 0px",
          width: "100px",
          height: "90px",
          margintop:"10px"
        };
        case "msg":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius:"60px 50px 50px 0px",
          width: "120px",
          height: "80px",
        };

      default:
        return {};
    }
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt={8}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      _dark={{ bg: "gray.800" }}
    >
      <Heading size="md" mb={4} textAlign="center">
        Create New Category
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </FormControl>
          <FormControl id="icon-type">
            <FormLabel>Icon Type</FormLabel>
            <Select
              value={iconType}
              onChange={(e) => setIconType(e.target.value)}
              placeholder="Select icon type"
            >
              <option value="url">URL</option>
              <option value="class">Class Name</option>
            </Select>
          </FormControl>
          {iconType === "url" ? (
            <FormControl id="icon" isRequired>
              <FormLabel>Icon URL</FormLabel>
              <Input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Paste icon URL here"
              />
            </FormControl>
          ) : (
            <FormControl id="icon-class" isRequired>
              <FormLabel>Icon Class Name</FormLabel>
              <Input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Enter icon class name (e.g., 'fa fa-home')"
              />
            </FormControl>
          )}


          <FormControl id="background-color">
            <FormLabel>Background Color</FormLabel>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Input
                type="string"
                width={"50%"}
                placeholder="Enter color code"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
              <Input
                type="color"
                width={"15%"}
                value={backgroundColor? backgroundColor:"#ffffff"}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
          </FormControl>

          <FormControl id="shape">
            <FormLabel>Shape</FormLabel>
            <Select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              placeholder="Select shape"
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="hexagon">Hexagon</option>
              <option value="cave">Cave</option>
              <option value="den">Den</option>
              <option value="star">Star</option>
              <option value="msg">MSG</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal" w="full">
            Create Category
          </Button>
        </VStack>
      </form>

      <Heading size="sm" mt={6} textAlign="center">
        Preview
      </Heading>
      <Flex
        mt={4}
        justifyContent="center"
        alignItems="center"
        direction="column"
        gap={4}
      >
        <Box
          position="relative"
          {...getShapeStyle()}
          overflow="hidden" 
        >
          {icon ? (
            iconType === "url" ? (
              <img
                src={icon}
                alt="Category Icon"
                style={{
                  width: "50%",
                  height: "50%",
                  objectFit: "contain",
                  borderRadius: shape === "circle" ? "50%" : "0", // Circle-specific styling
                }}
              />
            ) : (
              <i
                className={icon}
                style={{
                  fontSize: "300%",
                  color: "white", // Icon color (adjust as needed)
                }}
              />
            )
          ) : (
            <Text fontSize="sm" color="gray.500">
              No Icon
            </Text>
          )}
        </Box>
        {/* Category Name */}
        <Text mt={2} fontWeight="bold" fontSize="lg">
          {name || "Category Name"}
        </Text>
      </Flex>
    </Box>
  );
};


