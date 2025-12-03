import { Button } from "@chakra-ui/react";

const FilterResetBtn = ({ setSelectOne, setSelectTwo, setSearch }) => {
  return (
    <Button
      size="md"
      borderRadius="8px"
      border="none"
      display="block"
      mt={{ base: "20px", md: "0px" }}
      bgGradient="linear-gradient( 90deg, rgba(91, 120, 124, 1) 0%, rgba(137, 180, 188, 1) 35% );"
      onClick={() => {
        setSelectOne?.([]);
        setSelectTwo?.([]);
        setSearch?.("");
      }}
    >
      Reset Filters
    </Button>
  );
};

export default FilterResetBtn;
