import { useGetVendorLeadsQuery } from "@/app/api/leadsApi";
import DataTable from "@/components/DataTable";
import { Box, Flex, Heading, Skeleton } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import styles from "./VendorLeads.module.css";
import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const VendorLeads = () => {
  const [page, setPage] = useState(1);
  const { data: vendorLeads, isFetching } = useGetVendorLeadsQuery({ page });

  console.log("VendorLeads:vendorLeads", vendorLeads);

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    { key: "email", label: "Email" },
    { key: "phoneNum", label: "Phone Number" },
    { key: "businessName", label: "Business Name" },
    { key: "fleetSize", label: "Fleet Size" },
    {
      key: "additionalInfo",
      label: "Additional Info",
      render: (lead) => (
        <Flex align="center" justifyContent="center" gap="5px">
          <Tooltip
            showArrow
            contentProps={{ css: { "--tooltip-bg": "#5b787c" } }}
            content={lead.additionalInfo || "No additional info provided"}
          >
            <FaQuestionCircle size={20} cursor="pointer" color="#5b787c" />
          </Tooltip>
        </Flex>
      ),
    },
    {
      key: "date",
      label: "Date / Time",
      render: (lead) => (
        <span>{new Date(lead.createdAt).toLocaleString("en-GB")}</span>
      ),
    },
  ];
  return (
    <>
      <Box mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          VENDOR'S LEADS
        </Heading>
      </Box>

      <DataTable
        columns={columns}
        data={vendorLeads?.data?.docs || []}
        pagination={true}
        paginationData={vendorLeads?.data}
        page={page}
        setPage={setPage}
        isFetching={isFetching}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
    </>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={`${styles.tableRowEven} py-[10px]`}>
      <td className={`${styles.tableCell}`} colSpan={7}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default VendorLeads;
