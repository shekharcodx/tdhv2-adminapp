import styles from "./Table.module.css";
import {
  useGetSeatingCapacitiesQuery,
  useUpdateSeatingCapacitiesActiveMutation,
  useAddSeatingCapacitiesMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";
import { z } from "zod";

const SeatingCapacity = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: seats, isFetching } = useGetSeatingCapacitiesQuery(true, {
    skip: tabValue !== "seating",
  });
  const [updateActive] = useUpdateSeatingCapacitiesActiveMutation();
  const [addSeats, { isLoading }] = useAddSeatingCapacitiesMutation();

  const handleActiveStatusChange = (seatId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the seats?"
          : "Do you want to deactivate the seats?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(seatId).unwrap(), {
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
    { key: "seats", label: "Seats" },
    {
      key: "isActive",
      label: "Active",
      render: (seat) =>
        seat.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (seat) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(seat._id, !seat.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!seat.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!seat.isActive ? "Activate" : "Deactivate"}
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
        Add Seats
      </Button>
      <DataTableClient
        columns={columns}
        data={seats?.seatingCapacities || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="seatingCapacities"
        fieldName="seatingCapacity"
        fieldTitle="Seating Capacity"
        title="ADD SEATING CAPACITIES"
        addApi={addSeats}
        isLoading={isLoading}
        fieldType="number"
        validationRule={z.coerce
          .number()
          .min(2, "Seats must be equal to or greater than 2")
          .max(11, "Seats must be equal to or lower than 11")}
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

export default SeatingCapacity;
