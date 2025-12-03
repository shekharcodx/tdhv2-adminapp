import styles from "./Table.module.css";
import {
  useGetCategoriesQuery,
  useUpdateCategoryActiveMutation,
  useAddCategoriesMutation,
} from "@/app/api/carMasterDataApi";
import { Button, Skeleton, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import DataTableClient from "@/components/DataTableClientPagination";
import { useState } from "react";
import Create from "../CreateModals/Create";

const Categories = ({ tabValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories, isFetching } = useGetCategoriesQuery(true, {
    skip: tabValue !== "categories",
  });
  const [updateActive] = useUpdateCategoryActiveMutation();
  const [addCategories, { isLoading }] = useAddCategoriesMutation();

  const handleActiveStatusChange = (categoryId, isActive) => {
    if (
      !confirm(
        isActive
          ? "Do you want to activate the category?"
          : "Do you want to deactivate the category?"
      )
    ) {
      return;
    }
    toaster.promise(updateActive(categoryId).unwrap(), {
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
    { key: "name", label: "Category" },
    {
      key: "isActive",
      label: "Active",
      render: (category) =>
        category.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (category) => (
        <Box
          cursor="pointer"
          onClick={() =>
            handleActiveStatusChange(
              category._id,
              !category.isActive ? true : false
            )
          }
        >
          <Button
            size="xs"
            bg={!category.isActive ? "green" : "red"}
            p="2px 8px"
            borderRadius="5px"
            color="#fff"
          >
            {!category.isActive ? "Activate" : "Deactivate"}
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
        Add Categories
      </Button>
      <DataTableClient
        columns={columns}
        data={categories?.categories || []}
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
        fieldTitle="Category"
        title="ADD CATEGORIES"
        addApi={addCategories}
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

export default Categories;
