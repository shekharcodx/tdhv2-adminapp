import { Box, Heading, Tabs } from "@chakra-ui/react";
import CarBrand from "./CarBrand";
import CarModel from "./CarModel";
import CarTrim from "./CarTrim";
import { useState } from "react";

const CarData = () => {
  const [value, setValue] = useState("brands");

  return (
    <>
      <Box mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          Car Data
        </Heading>
        <Tabs.Root
          colorPalette="teal"
          variant="enclosed"
          fitted
          defaultValue={"brands"}
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >
          <Tabs.List>
            <Tabs.Trigger value="brands">Car Brands</Tabs.Trigger>
            <Tabs.Trigger value="models">Car Models</Tabs.Trigger>
            <Tabs.Trigger value="trims">Car Trims</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="brands">
            <CarBrand tabValue={value} />
          </Tabs.Content>
          <Tabs.Content value="models">
            <CarModel tabValue={value} />
          </Tabs.Content>
          <Tabs.Content value="trims">
            <CarTrim tabValue={value} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </>
  );
};

export default CarData;
