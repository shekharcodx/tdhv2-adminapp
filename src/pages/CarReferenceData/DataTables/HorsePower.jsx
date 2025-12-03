import styles from "./Table.module.css";
import {
  useGetPowersQuery,
  useUpdatePowerActiveMutation,
  useAddPowersMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";
import { z } from "zod";

const HorsePower = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: powers, isFetching } = useGetPowersQuery(true, {
    skip: tabValue !== "powers",
  });
  const [updateActive] = useUpdatePowerActiveMutation();
  const [addPowers, { isLoading }] = useAddPowersMutation();

  const handleActiveStatusChange = (powerId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the horse power?"
          : "Do you want to deactivate the horse power?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(powerId).unwrap(), {
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
    { key: "power", label: "Power" },
    {
      key: "isActive",
      label: "Active",
      render: (power) =>
        power.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (power) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(power._id, !power.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!power.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!power.isActive ? "Activate" : "Deactivate"}
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
        Add Horse Powers
      </Button>
      <DataTableClient
        columns={columns}
        data={powers?.horsePowers || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="horsePowers"
        fieldName="horsePower"
        fieldTitle="Horse Power"
        title="ADD HORSE POWERS"
        addApi={addPowers}
        isLoading={isLoading}
        fieldType="number"
        validationRule={z.coerce
          .number()
          .min(10, "Horse power must be equal to or greater than 10")
          .max(2000, "Horse power must be equal to or lower than 2000")}
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

export default HorsePower;
