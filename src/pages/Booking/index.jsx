import { useEffect, useState } from "react";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/app/api/bookingApi.js";
import { Box, Button, Heading, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { MenuIcon } from "lucide-react";
import DataTable from "@/components/DataTable";
import styles from "./Booking.module.css";
import FilterInput from "@/components/FilterInput/input";
import FilterResetBtn from "@/components/FilterResetBtn";
import { toaster } from "@/components/ui/toaster";

const Bookings = () => {
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const {
    data: bookings,
    isFetching,
    refetch,
  } = useGetAllBookingsQuery({
    page,
    bookingId: searchString,
  });

  const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();

  const handleSearchInput = (string) => {
    setSearchString(string);
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handleStatusChange = (bookingId, bookingStatus) => {
    if (!confirm("Do you want to change status")) return;
    toaster.promise(updateStatus({ bookingId, bookingStatus }).unwrap(), {
      loading: { title: "Updating status...", description: "Please wait" },
      success: (res) => {
        return {
          title: res.message || "Status updated successfully",
          description: "",
        };
      },
      error: (err) => ({
        title: err?.data?.message || "Error updating status",
        description: "Please try again",
      }),
    });
  };

  const columns = [
    {
      key: "bookingId",
      label: "Booking ID",
    },
    {
      key: "car",
      label: "Car",
    },
    {
      key: "pickupDate",
      label: "Pickup Date/Time",
      render: (booking) => new Date(booking.pickupDate).toLocaleString(),
    },
    {
      key: "dropoffDate",
      label: "Dropoff Date/Time",
      render: (booking) => new Date(booking.dropoffDate).toLocaleString(),
    },
    {
      key: "totalWithoutSecurity",
      label: "Rental Amount",
    },
    {
      key: "securityDeposit",
      label: "Security Deposit",
    },
    {
      key: "totalAmount",
      label: "Total Amount",
    },
    {
      key: "rentalPaid",
      label: "Rent",
      render: (booking) => {
        return booking.rentalPaid ? (
          <span className="bg-green-500 text-white rounded-full py-[4px] px-[10px] text-sm font-medium">
            Paid
          </span>
        ) : (
          <span className="bg-red-500 text-white rounded-full py-[4px] px-[10px] text-sm font-medium">
            Unpaid
          </span>
        );
      },
    },
    {
      key: "securityPaid",
      label: "Security",
      render: (booking) => {
        return booking.securityDeposit > 0 ? (
          booking.rentalPaid ? (
            <span className="bg-green-500 text-white rounded-full py-1 px-2.5 text-sm font-medium">
              Paid
            </span>
          ) : (
            <span className="bg-red-500 text-white rounded-full py-1 px-2.5 text-sm font-medium">
              Unpaid
            </span>
          )
        ) : (
          <span className="bg-green-500 text-white rounded-full py-1 px-2.5 text-sm font-medium whitespace-nowrap">
            Not Applicable
          </span>
        );
      },
    },
    {
      key: "customerName",
      label: "Customer",
      render: (booking) => (
        <>
          <p>{booking.customerName}</p>
          <p>{booking.customerEmail}</p>
        </>
      ),
    },
    {
      key: "vendorName",
      label: "Vendor",
      render: (booking) => (
        <>
          <p>{booking.vendorName}</p>
          <p>{booking.vendorEmail}</p>
        </>
      ),
    },
    {
      key: "status",
      label: "Booking Status",
      render: (booking) => {
        return booking.status === 1 ? (
          <span className="bg-orange-500 text-white rounded-full py-1 px-2.5 text-sm font-medium">
            Pending
          </span>
        ) : booking.status === 2 ? (
          <span className="bg-green-500 text-white rounded-full py-1 px-2.5 text-sm font-medium">
            Confirmed
          </span>
        ) : (
          <span className="bg-red-500 text-white rounded-full py-1 px-2.5 text-sm font-medium">
            Cancelled
          </span>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (booking) => (
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
                {booking.status === 1 && (
                  <Menu.Item
                    value="approve"
                    cursor="pointer"
                    bg="green.600"
                    borderRadius="8px"
                    color="#fff"
                    onClick={() => {
                      handleStatusChange(booking._id, 2);
                    }}
                  >
                    Approve
                  </Menu.Item>
                )}
                {(booking.status === 1 || booking.status === 2) &&
                  booking.payment !== 2 && (
                    <Menu.Item
                      value="cancel"
                      cursor="pointer"
                      bg="red.600"
                      borderRadius="8px"
                      mt="5px"
                      color="#fff"
                      onClick={() => {
                        handleStatusChange(booking._id, 3);
                      }}
                    >
                      Cancel
                    </Menu.Item>
                  )}
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
          Bookings
        </Heading>

        <Box
          display={{ base: "block", md: "flex" }}
          justifyContent={{ base: "center", md: "start" }}
          alignItems="end"
          gap={{ md: "20px" }}
          my="20px"
        >
          <FilterInput
            label="Search Booking"
            placeholder="Search by bookingID"
            value={searchString}
            setValue={handleSearchInput}
          />

          <FilterResetBtn setSearch={setSearchString} />
        </Box>
      </Box>
      <DataTable
        columns={columns}
        data={bookings?.data?.docs || []}
        isFetching={isFetching}
        pagination={true}
        paginationData={bookings?.data}
        page={page}
        setPage={setPage}
        skeleton={<SkeletonRow />}
        skeletonRows={10}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
    </>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={`${styles.tableRowEven} py-2.5`}>
      <td className={`${styles.tableCell}`} colSpan={13}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default Bookings;
