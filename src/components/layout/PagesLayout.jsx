import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const PagesLayout = () => {
  return (
    <Box p="1rem">
      <Outlet />
    </Box>
  );
};

export default PagesLayout;
