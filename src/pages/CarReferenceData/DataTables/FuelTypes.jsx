import styles from "./Table.module.css";
import {
  useGetFuelTypesQuery,
  useUpdateFuelTypeActiveMutation,
  useAddFuelTypesMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
// import CarBrandCreation from "./modals/CarBrandCreation";
import { useState } from "react";
import Create from "../CreateModals/Create";

const FuelTypes = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: fuelTypes, isFetching } = useGetFuelTypesQuery(true, {
    skip: tabValue !== "fuel-types",
  });
  const [updateActive] = useUpdateFuelTypeActiveMutation();
  const [addFuelTypes, { isLoading }] = useAddFuelTypesMutation();

  const handleActiveStatusChange = (fuelTypeId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the fuel type?"
          : "Do you want to deactivate the fuel type?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(fuelTypeId).unwrap(), {
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
    { key: "name", label: "Fuel" },
    {
      key: "isActive",
      label: "Active",
      render: (fuel) =>
        fuel.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (fuel) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(fuel._id, !fuel.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!fuel.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!fuel.isActive ? "Activate" : "Deactivate"}
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
        Add Fuel Types
      </Button>
      <DataTableClient
        columns={columns}
        data={fuelTypes?.fuelTypes || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="fuelTypes"
        fieldName="fuelType"
        fieldTitle="Fuel Type"
        title="ADD FUEL TYPES"
        addApi={addFuelTypes}
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

export default FuelTypes;
