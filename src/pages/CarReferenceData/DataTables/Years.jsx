import styles from "./Table.module.css";
import {
  useGetYearsQuery,
  useUpdateYearActiveMutation,
  useAddYearsMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";

const Years = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: years, isFetching } = useGetYearsQuery(true, {
    skip: tabValue !== "years",
  });
  const [updateActive] = useUpdateYearActiveMutation();
  const [addYears, { isLoading }] = useAddYearsMutation();

  const handleActiveStatusChange = (yearId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate year?"
          : "Do you want to deactivate year?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(yearId).unwrap(), {
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
    { key: "year", label: "Year" },
    {
      key: "isActive",
      label: "Active",
      render: (year) =>
        year.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (year) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(year._id, !year.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!year.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!year.isActive ? "Activate" : "Deactivate"}
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
        Add Years
      </Button>
      <DataTableClient
        columns={columns}
        data={years?.years || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="years"
        fieldName="year"
        fieldTitle="Year"
        title="ADD YEARS"
        addApi={addYears}
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

export default Years;
