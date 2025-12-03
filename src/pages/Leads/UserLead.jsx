import { useGetCustomerLeadsQuery } from "@/app/api/leadsApi";
import DataTable from "@/components/DataTable";
import { Box, Heading, Skeleton } from "@chakra-ui/react";
import styles from "./VendorLeads.module.css";
import { useState } from "react";

const UserLeads = () => {
  const [page, setPage] = useState(1);
  const { data: customerLeads, isFetching } = useGetCustomerLeadsQuery({
    page,
  });

  const leads = customerLeads?.data?.docs || [];

  const columns = [
    // 🧍‍♂️ User Details first
    {
      key: "name",
      label: "User Name",
      render: (lead) => <span>{lead.name || "—"}</span>,
    },
    {
      key: "phoneNum",
      label: "Contact",
      render: (lead) =>
        lead.phoneNum ? (
          <a
            href={`tel:${lead.phoneNum}`}
            className="text-site-accent hover:underline"
          >
            {lead.phoneNum}
          </a>
        ) : (
          "—"
        ),
    },
    {
      key: "email",
      label: "Email",
      render: (lead) =>
        lead.email ? (
          <a
            href={`mailto:${lead.email}`}
            className="text-site-accent hover:underline"
          >
            {lead.email}
          </a>
        ) : (
          "—"
        ),
    },

    // 🚗 Car & Vendor Details next
    {
      key: "car",
      label: "Car Name",
      render: (lead) => <span>{lead.car || "—"}</span>,
    },
    {
      key: "vendor",
      label: "Vendor Name",
      render: (lead) => <span>{lead.vendor || "—"}</span>,
    },
    {
      key: "vendorEmail",
      label: "Vendor Email",
      render: (lead) =>
        lead.vendorEmail ? (
          <a
            href={`mailto:${lead.vendorEmail}`}
            className="text-site-accent hover:underline"
          >
            {lead.vendorEmail}
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <>
      <Box mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          USER LEADS
        </Heading>
      </Box>

      <DataTable
        columns={columns}
        data={leads}
        pagination
        paginationData={customerLeads?.data}
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

const SkeletonRow = () => (
  <tr className={`${styles.tableRowEven} py-[10px]`}>
    <td className={styles.tableCell} colSpan={6}>
      <Skeleton height="18px" width="100%" variant="shine" />
    </td>
  </tr>
);

export default UserLeads;
