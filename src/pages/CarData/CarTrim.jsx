import styles from "./Table.module.css";
import {
  useGetAllCarTrimsQuery,
  useUpdateTrimActiveMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import CarTrimCreation from "./modals/CarTrimCreation";

const CarTrim = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: carTrims, isFetching } = useGetAllCarTrimsQuery(true, {
    skip: tabValue !== "trims",
  });
  const [updateActive] = useUpdateTrimActiveMutation();

  const handleActiveStatusChange = (trimId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the trim?"
          : "Do you want to deactivate the trim?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(trimId).unwrap(), {
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
    { key: "name", label: "Name" },
    {
      key: "model",
      label: "Model Name",
      render: (trim) => <span>{trim.carModel?.name || "NA"}</span>,
    },
    {
      key: "isActive",
      label: "Active",
      render: (trim) =>
        trim.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (trim) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(trim._id, !trim.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!trim.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!trim.isActive ? "Activate" : "Deactivate"}
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
        Add Trims
      </Button>
      <DataTableClient
        columns={columns}
        data={carTrims?.carTrims || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <CarTrimCreation isOpen={isOpen} setIsOpen={setIsOpen} />
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
        <Skeleton height="25px" width="100%" variant="shine" />
      </td>
      <td className={`${styles.tableCell}`}>
        <Skeleton height="25px" width="36px" variant="shine" mx="auto" />
      </td>
    </tr>
  );
};

export default CarTrim;
