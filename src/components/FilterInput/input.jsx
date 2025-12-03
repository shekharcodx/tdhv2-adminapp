import { Field, Input } from "@chakra-ui/react";

const FilterInput = ({ label, placeholder, value, setValue }) => {
  return (
    <Field.Root mt={{ base: "20px", md: "0px" }}>
      <Field.Label>{label}</Field.Label>
      <Input
        size="md"
        border="1px solid rgba(91, 120, 124, 1)"
        borderRadius="8px"
        outline="none"
        minW="220px"
        placeholder={placeholder}
        variant="outline"
        value={value}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
    </Field.Root>
  );
};

export default FilterInput;
