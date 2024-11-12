import { Link } from "react-router-dom";
import React, { useState } from "react";
import api from "./api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

const AdminCreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [role, setRole] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        role,
        accountNumber,
        expDate,
      });
      console.log("API response:", response);

      toast({
        title: "user created successful.",
        description: "successfully Registration",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

    } catch (err) {
      console.error("Registration error:", err);

      toast({
        title: "Registration failed.",
        description:
          err.response?.data?.message ||
          err.message ||
          "Please check your credentials.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleChange = (e) => {
    setRole(e.target.value);
  };


  return (
    <Box
      maxW="sm"
      mx="auto"
      mt="10"
      p="6"
      boxShadow="md"
      borderRadius="md"
      bg="white"
    >
      <Text fontSize="2xl" align={"center"}>Create user</Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Select Role"
              size="md"
              value={role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Select>
          </FormControl>

          <FormControl id="accountnumber" isRequired>
            <FormLabel>Account Number</FormLabel>
            <Input
              type="Number"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="expiredate" mt="4" isRequired>
            <FormLabel>Expire Date</FormLabel>
            <Input
              type="date"
              placeholder="Enter ExpireDate"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" color={"blue.500"}>
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminCreateUser;
