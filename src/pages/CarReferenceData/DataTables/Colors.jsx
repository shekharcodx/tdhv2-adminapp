import styles from "./Table.module.css";
import {
  useGetColorsQuery,
  useUpdateColorActiveMutation,
  useAddColorsMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";

const Colors = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: colors, isFetching } = useGetColorsQuery(true, {
    skip: tabValue !== "colors",
  });
  const [updateActive] = useUpdateColorActiveMutation();
  const [addColors, { isLoading }] = useAddColorsMutation();

  const handleActiveStatusChange = (colorId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the color?"
          : "Do you want to deactivate the color?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(colorId).unwrap(), {
      loading: { title: "Updating", description: "Please wait..." },
      success: (res) => {
        return {
          title: res?.message || "IsActive status updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error updating isActive status",
          description: "Please try again",
        };
      },
    });
  };

  const columns = [
    { key: "name", label: "Color" },
    {
      key: "isActive",
      label: "Active",
      render: (color) =>
        color.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (color) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(color._id, !color.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!color.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!color.isActive ? "Activate" : "Deactivate"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box mt="20px" borderBottom="1px solid #fff5">
      <Button
        bg="var(--gradient-background)"
        mb="20px"
        ml="auto"
        display="block"
        onClick={() => setIsOpen(true)}
      >
        Add Colors
      </Button>
      <DataTableClient
        columns={columns}
        data={colors?.colors || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="colors"
        fieldName="color"
        fieldTitle="Color"
        title="ADD COLORS"
        addApi={addColors}
        isLoading={isLoading}
      />
    </Box>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={styles.tableRowEven}>
      <td className={`${styles.tableCell}`}>
        <Skeleton height="25px" width="100%" variant="shine" />
      </td>
      <td className={`${styles.tableCell}`}>
        <Skeleton height="25px" width="100%" variant="shine" />
      </td>
      <td className={`${styles.tableCell}`}>
        <Skeleton height="25px" width="36px" variant="shine" mx="auto" />
      </td>
    </tr>
  );
};

export default Colors;
