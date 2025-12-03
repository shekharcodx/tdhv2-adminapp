import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Menu,
  Portal,
  Skeleton,
  Span,
} from "@chakra-ui/react";
import {
  useGetListingsQuery,
  useUpdateStatusMutation,
  useUpdateIsActiveMutation,
} from "@/app/api/carListingApi";
import { listingStatuses, isActiveStatus, getKeyNames } from "@/utils/helper";
import FilterSelect from "@/components/FilterSelect";
import FilterResetBtn from "@/components/FilterResetBtn";
import FilterInput from "@/components/FilterInput/input";
import styles from "./Listing.module.css";
import DataTable from "@/components/DataTable";
import { LISTING_STATUS, LISTING_STATUS_NUM } from "@/config/constants";
import placeholderImg from "@/assets/images/placeholder_image.jpg";
import { MenuIcon } from "lucide-react";
import { LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";

const Listings = () => {
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedActiveStatus, setSelectedActiveStatus] = useState([]);
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();

  const {
    data: listings,
    isFetching,
    refetch,
  } = useGetListingsQuery({
    page,
    status: selectedStatus?.[0],
    isActive: selectedActiveStatus?.[0],
    search: searchString,
  });

  const [updateStatus] = useUpdateStatusMutation();
  const [updateIsActive] = useUpdateIsActiveMutation();

  const handleSearchInput = (string) => {
    setSelectedActiveStatus([]);
    setSelectedStatus([]);
    setSearchString(string);
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [page, selectedActiveStatus, selectedStatus, refetch]);

  const handleStatusUpdate = (listingId, status) => {
    if (!confirm("Do you want to update this")) {
      return;
    }
    toaster.promise(updateStatus({ listingId, status }).unwrap(), {
      loading: { title: "Updating Status", description: "Please wait..." },
      success: (res) => {
        if (res?.code === 1722) {
          navigate("/car-listings");
        }
        return {
          title: res?.message || "Status updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error updating status",
          description: "Please try again",
        };
      },
    });
  };

  const handleIsActiveUpdate = (listingId, active) => {
    if (!confirm("Do you want to update this")) {
      return;
    }
    toaster.promise(updateIsActive({ listingId, active }).unwrap(), {
      loading: {
        title: "Updating active Status",
        description: "Please wait...",
      },
      success: (res) => {
        if (res?.code === 1722) {
          navigate("/car-listings");
        }
        return {
          title: res?.message || "Cars active updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error updating active status",
          description: "Please try again",
        };
      },
    });
  };

  const columns = [
    {
      key: "coverImage",
      label: "Image",
      render: (listing) => (
        <img
          src={
            listing?.car?.coverImage?.url
              ? `${listing.car.coverImage.url}?v=${Date.now()}`
              : placeholderImg
          }
          alt={
            listing?.car?.carBrand?.name + " " + listing?.car?.carModel?.name
          }
          className={`${styles.avatar} mx-auto`}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
    },
    { key: "vendor", label: "Vendor Name" },
    // {
    //   key: "rentPerDay",
    //   label: "Rent/Day",
    // },
    // { key: "rentPerWeek", label: "Rent/Week" },
    // { key: "rentPerMonth", label: "Rent/Month" },
    {
      key: "status",
      label: "Status",
      render: (listing) => (
        <span
          className={`${styles.status} ${
            listing.status === 2
              ? styles.statusGreen
              : listing.status === 1
              ? styles.statusYellow
              : styles.statusOrange
          }`}
        >
          {LISTING_STATUS_NUM[listing.status]}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Active",
      render: (listing) =>
        listing.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "action",
      label: "Action",
      render: (listing) => (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              mx="auto"
              display="block"
              variant="outline"
              color="#000"
              outline="none"
              border="none"
              // bgGradient="linear-gradient( 90deg, rgba(91, 120, 124, 1) 0%, rgba(137, 180, 188, 1) 35% );"
              size="sm"
            >
              <MenuIcon color="rgba(91, 120, 124, 1)" />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="view"
                  cursor="pointer"
                  onClick={() => navigate(`/car-listings/view/${listing._id}`)}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  value="edit"
                  cursor="pointer"
                  onClick={() => navigate(`/car-listings/edit/${listing._id}`)}
                >
                  Edit
                </Menu.Item>

                {!listing.isActive && (
                  <Menu.Item
                    value="activate"
                    cursor="pointer"
                    onClick={() => handleIsActiveUpdate(listing._id, "true")}
                  >
                    <Span borderRadius="12px" color="green">
                      Activate
                    </Span>
                  </Menu.Item>
                )}
                {listing.isActive && (
                  <Menu.Item
                    value="deactivate"
                    cursor="pointer"
                    onClick={() => handleIsActiveUpdate(listing._id, "false")}
                  >
                    <Span borderRadius="12px" color="red">
                      Deactivate
                    </Span>
                  </Menu.Item>
                )}

                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
                  <Menu.TriggerItem cursor="pointer">
                    Change Status <LuChevronRight />
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {listing.status !== LISTING_STATUS.APPROVED && (
                          <Menu.Item
                            value="approved"
                            cursor="pointer"
                            onClick={() =>
                              handleStatusUpdate(
                                listing._id,
                                LISTING_STATUS.APPROVED
                              )
                            }
                          >
                            Approved
                          </Menu.Item>
                        )}
                        {listing.status !== LISTING_STATUS.ON_HOLD && (
                          <Menu.Item
                            value="onHold"
                            cursor="pointer"
                            onClick={() =>
                              handleStatusUpdate(
                                listing._id,
                                LISTING_STATUS.ON_HOLD
                              )
                            }
                          >
                            On Hold
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
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
          Car Listings
        </Heading>
        <Box
          display={{ base: "block", md: "flex" }}
          justifyContent={{ base: "center", md: "start" }}
          alignItems="end"
          gap={{ md: "20px" }}
          my="20px"
        >
          <FilterSelect
            title="Listing Status"
            placeholder="Select listing status"
            collection={listingStatuses}
            value={selectedStatus}
            setValue={setSelectedStatus}
            helper={getKeyNames}
          />

          <FilterSelect
            title="Listing Active Status"
            placeholder="Select listing active status"
            collection={isActiveStatus}
            value={selectedActiveStatus}
            setValue={setSelectedActiveStatus}
          />

          <FilterInput
            label="Search Listing"
            placeholder="Search listing"
            value={searchString}
            setValue={handleSearchInput}
          />

          <FilterResetBtn
            setSelectOne={setSelectedStatus}
            setSelectTwo={setSelectedActiveStatus}
            setSearch={setSearchString}
          />
        </Box>
      </Box>

      <DataTable
        columns={columns}
        data={listings?.listings?.docs || []}
        isFetching={isFetching}
        pagination={true}
        paginationData={listings?.listings}
        page={page}
        setPage={setPage}
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
      <td className={`${styles.tableCell}`} colSpan={6}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default Listings;
