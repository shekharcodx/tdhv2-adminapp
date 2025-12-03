import styles from "./Table.module.css";
import {
  useGetTransmissionsQuery,
  useUpdateTransmissionUpdateMutation,
  useAddTransmissionsMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";

const Transmission = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: transmissions, isFetching } = useGetTransmissionsQuery(true, {
    skip: tabValue !== "transmission",
  });
  const [updateActive] = useUpdateTransmissionUpdateMutation();
  const [addTransmission, { isLoading }] = useAddTransmissionsMutation();

  const handleActiveStatusChange = (transmissionId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the transmission?"
          : "Do you want to deactivate the transmission?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(transmissionId).unwrap(), {
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
    { key: "transmission", label: "Transmission" },
    {
      key: "isActive",
      label: "Active",
      render: (transmission) =>
        transmission.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (transmission) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(
              transmission._id,
              !transmission.isActive ? true : false
            )
          }
        >
          <Button
            size="xs"
            bg={!transmission.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!transmission.isActive ? "Activate" : "Deactivate"}
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
        Add Transmission
      </Button>
      <DataTableClient
        columns={columns}
        data={transmissions?.transmissions || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="transmissions"
        fieldName="transmission"
        fieldTitle="Transmission"
        title="ADD TRANSMISSIONS"
        addApi={addTransmission}
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

export default Transmission;
