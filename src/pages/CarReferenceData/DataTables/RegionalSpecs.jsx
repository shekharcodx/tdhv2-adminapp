import styles from "./Table.module.css";
import {
  useGetRegionalSpecsQuery,
  useUpdateRegionalSpecsActiveMutation,
  useAddRegionalSpecsMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";

const RegionalSpecs = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: regionalSpecs, isFetching } = useGetRegionalSpecsQuery(true, {
    skip: tabValue !== "reg-specs",
  });
  const [updateActive] = useUpdateRegionalSpecsActiveMutation();
  const [addSpecs, { isLoading }] = useAddRegionalSpecsMutation();

  const handleActiveStatusChange = (specId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the specs?"
          : "Do you want to deactivate the specs?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(specId).unwrap(), {
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
    { key: "name", label: "Spec" },
    {
      key: "isActive",
      label: "Active",
      render: (spec) =>
        spec.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (spec) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(spec._id, !spec.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!spec.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!spec.isActive ? "Activate" : "Deactivate"}
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
        Add Regional Specs
      </Button>
      <DataTableClient
        columns={columns}
        data={regionalSpecs?.specs || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <Create
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        payloadTitle="specs"
        fieldName="spec"
        fieldTitle="Regional Specs"
        title="ADD REGIONAL SPECS"
        addApi={addSpecs}
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

export default RegionalSpecs;
