import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";

// Static breadcrumb map
const breadcrumbMap = {
  "/admin": "Users",
  "/admin/users": "Users",
  "/Category": "Category",
  "/Category/CreateCategory": "Create Category",
  "/Allsavingplan":'All Saving Plans'
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Function to handle dynamic paths
  const getBreadcrumbName = (path) => {
    // Handle dynamic segments like "/admin/:userid"
    if (path.match(/^\/admin\/[a-fA-F0-9]{24}$/)) {
      return "User Posts"; // Placeholder for user-specific paths
    }
    return breadcrumbMap[path] || path; // Fallback to static or raw path
  };

  return (
    <Breadcrumb separator=">">
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/admin">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <BreadcrumbItem key={to} isCurrentPage={index === pathnames.length - 1}>
            {breadcrumbMap[to] || getBreadcrumbName(to) ? (
              <BreadcrumbLink as={Link} to={to}>
                {getBreadcrumbName(to)}
              </BreadcrumbLink>
            ) : (
              <span>{value}</span>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};
