import { Box, Button, Heading, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import DataTable from "@/components/DataTable";
import { useGetAllTemplatesQuery } from "@/app/api/emailApi";
import styles from "./Email.module.css";
import { MenuIcon } from "lucide-react";
import EditTemplate from "./EditTemplate";

const EmailTemplates = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [templateId, setTemplateId] = useState("");

  const { data: emailTemplates, isFetching } = useGetAllTemplatesQuery({
    page,
  });

  const columns = [
    {
      key: "name",
      label: "Template Name",
    },
    {
      key: "subject",
      label: "Subject",
    },
    { key: "description", label: "Template Description" },
    {
      key: "isActive",
      label: "Active",
      render: (template) => {
        return template.isActive ? (
          <span className="bg-green-500 text-white rounded-full py-[4px] px-[10px] text-sm font-medium">
            Active
          </span>
        ) : (
          <span className="bg-red-500 text-white rounded-full py-[4px] px-[10px] text-sm font-medium">
            Inactive
          </span>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (template) => (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              mx="auto"
              display="block"
              variant="outline"
              color="#000"
              outline="none"
              border="none"
              size="sm"
            >
              <MenuIcon color="rgba(91, 120, 124, 1)" />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="edit"
                  cursor="pointer"
                  onClick={() => {
                    setTemplateId(template._id);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ),
    },
  ];
  return (
    <>
      <Box mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          Email Templates
        </Heading>

        <DataTable
          columns={columns}
          data={emailTemplates?.data?.docs || []}
          isFetching={isFetching}
          pagination={true}
          paginationData={emailTemplates?.data}
          page={page}
          setPage={setPage}
          skeleton={<SkeletonRow />}
          skeletonRows={10}
          getRowClass={(_, i) =>
            i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
          }
        />
      </Box>
      <EditTemplate
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        templateId={templateId}
        setTemplateId={setTemplateId}
      />
    </>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={`${styles.tableRowEven} py-[10px]`}>
      <td className={`${styles.tableCell}`} colSpan={9}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default EmailTemplates;
