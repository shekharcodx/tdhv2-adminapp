import styles from "./Table.module.css";
import {
  useGetBodyTypesQuery,
  useUpdateBodyTypeUpdateMutation,
  useAddBodyTypesMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";

const CarBodyTypes = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: bodyTypes, isFetching } = useGetBodyTypesQuery(true, {
    skip: tabValue !== "body-types",
  });
  const [updateActive] = useUpdateBodyTypeUpdateMutation();
  const [addBodyTypes, { isLoading }] = useAddBodyTypesMutation();

  const handleActiveStatusChange = (typeId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the body type?"
          : "Do you want to deactivate the body type?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(typeId).unwrap(), {
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
    { key: "name", label: "Type" },
    {
      key: "isActive",
      label: "Active",
      render: (type) =>
        type.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (type) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(type._id, !type.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!type.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!type.isActive ? "Activate" : "Deactivate"}
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
        Add Body Types
      </Button>
      <DataTableClient
        columns={columns}
        data={bodyTypes?.bodyTypes || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="names"
        fieldName="name"
        fieldTitle="Body Type"
        title="ADD BODY TYPES"
        addApi={addBodyTypes}
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

export default CarBodyTypes;
