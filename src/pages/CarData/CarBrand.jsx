import DataTable from "@/components/DataTable";
import styles from "./Table.module.css";

import {
  useGetCarBrandQuery,
  useUpdateBrandActiveMutation,
} from "@/app/api/carMasterDataApi";
import avatar from "@/assets/images/avatar.svg";
import { Button, Skeleton, SkeletonCircle, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import CarBrandCreation from "./modals/CarBrandCreation";
import { useState } from "react";

const CarBrand = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: carBrands, isFetching } = useGetCarBrandQuery(true, {
    skip: tabValue !== "brands",
  });
  const [updateActive] = useUpdateBrandActiveMutation();

  const handleActiveStatusChange = (brandId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the brand?"
          : "Do you want to deactivate the brand?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(brandId).unwrap(), {
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
    {
      key: "logo",
      label: "Logo",
      render: (brand) => (
        <img
          src={brand?.logo?.url || avatar}
          alt={brand.name}
          className={`${styles.avatar} mx-auto`}
        />
      ),
    },
    { key: "name", label: "Name" },
    {
      key: "isActive",
      label: "Active",
      render: (brand) =>
        brand.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (brand) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(brand._id, !brand.isActive ? true : false)
          }
        >
          <Button
            size="xs"
            bg={!brand.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!brand.isActive ? "Activate" : "Deactivate"}
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
        Add Brand
      </Button>
      <DataTableClient
        columns={columns}
        data={carBrands?.carBrands || []}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
      <CarBrandCreation isOpen={isOpen} setIsOpen={setIsOpen} />
    </Box>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={styles.tableRowEven}>
      <td className={`${styles.tableCell}`}>
        <SkeletonCircle
          mx="auto"
          height="2.5rem"
          width="2.5rem"
          variant="shine"
        />
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

export default CarBrand;
