import { Portal, Select, Stack } from "@chakra-ui/react";

const FilterSelect = ({
  collection,
  value,
  setValue,
  title,
  placeholder,
  helper,
}) => {
  return (
    <Stack gap="5" minW="220px" mt={{ base: "20px", md: "0px" }}>
      <Select.Root
        variant="outline"
        size="md"
        collection={collection}
        value={value}
        onValueChange={(e) => setValue(e.value)}
        colorPalette="rgba(91, 120, 124, 1)"
      >
        <Select.HiddenSelect />
        <Select.Label>{title}</Select.Label>
        <Select.Control borderRadius="8px">
          <Select.Trigger
            border="1px solid rgba(91, 120, 124, 1)"
            borderRadius="8px"
          >
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content
              border="1px solid rgba(91, 120, 124, 1)"
              borderRadius="14px"
              zIndex="9"
            >
              {collection.items.map((item) => (
                <Select.Item
                  value={item.value}
                  cursor="pointer"
                  key={item.value}
                  item={item}
                >
                  {helper ? helper(item.label) : item.label}
                  <Select.ItemIndicator color="rgba(91, 120, 124, 1)" />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Stack>
  );
};

export default FilterSelect;
