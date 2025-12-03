import { Box, Heading, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import CarBodyTypes from "./DataTables/CarBodyType";
import RegionalSpecs from "./DataTables/RegionalSpecs";
import HorsePower from "./DataTables/HorsePower";
import SeatingCapacity from "./DataTables/SeatingCapacity";
import Colors from "./DataTables/Colors";
import TechFeatures from "./DataTables/TechFeatures";
import OtherFeatures from "./DataTables/OtherFeatures";
import Doors from "./DataTables/Doors";
import Years from "./DataTables/Years";
import FuelTypes from "./DataTables/FuelTypes";
import Transmission from "./DataTables/Transmission";
import Categories from "./DataTables/Categories";

const CarReferenceData = () => {
  const [value, setValue] = useState("years");

  return (
    <>
      <Box mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          Car Reference Data
        </Heading>
        <Tabs.Root
          colorPalette="teal"
          size="md"
          orientation="vertical"
          variant="enclosed"
          fitted
          // defaultValue={"body-types"}
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >
          <Tabs.List>
            <Tabs.Trigger className="whitespace-nowrap" value="years">
              Years
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="colors">
              Colors
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="doors">
              Doors
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="fuel-types">
              Fuel Types
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="categories">
              Categories
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="body-types">
              Body Types
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="transmission">
              Transmissions
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="powers">
              Horse Powers
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="reg-specs">
              Regional Specs
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="seating">
              Seating Capacity
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="tech-feature">
              Technical Features
            </Tabs.Trigger>
            <Tabs.Trigger className="whitespace-nowrap" value="other-features">
              Other Features
            </Tabs.Trigger>
            {/* <Tabs.Trigger value="models">Car Models</Tabs.Trigger> */}
          </Tabs.List>
          <Tabs.Content w="100%" value="years">
            <Years tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="colors">
            <Colors tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="doors">
            <Doors tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="transmission">
            <Transmission tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="fuel-types">
            <FuelTypes tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="categories">
            <Categories tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="body-types">
            <CarBodyTypes tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="powers">
            <HorsePower tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="reg-specs">
            <RegionalSpecs tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="seating">
            <SeatingCapacity tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="tech-feature">
            <TechFeatures tabValue={value} />
          </Tabs.Content>
          <Tabs.Content w="100%" value="other-features">
            <OtherFeatures tabValue={value} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </>
  );
};

export default CarReferenceData;
