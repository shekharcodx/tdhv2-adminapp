import { Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const DataPagination = ({
  totalPages = 1,
  page = 1,
  pageSize = 10,
  onPageChange,
  showTotal = false,
  totalDocs = null,
}) => {
  console.log("index:totalPages", totalPages);
  return (
    <Pagination.Root
      count={totalPages}
      pageSize={pageSize}
      defaultPage={1}
      page={page}
      onPageChange={(e) => onPageChange(e.page)}
    >
      <ButtonGroup
        gap="4"
        size="sm"
        variant="ghost"
        display="flex"
        justifyContent="end"
        my="20px"
      >
        {showTotal && totalDocs !== null && <p>{totalDocs} Results Total</p>}
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.PageText />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
};

export default DataPagination;
