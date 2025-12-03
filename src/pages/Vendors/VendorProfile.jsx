import { useEffect, useState } from "react";
import styles from "./VendorProfile.module.css";
import DocumentCard from "./DocumentCard";
import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  Heading,
  Menu,
  Portal,
  Span,
  Switch,
} from "@chakra-ui/react";
import profilePicPlaceholder from "@/assets/images/avatar.svg";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";
import DocumentCardSkeleton from "./DocumentCardSkeleton ";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyGetUserQuery } from "@/app/api/userApi";
import {
  useGetVendorListingsQuery,
  useUpdateCategoryMutation,
  useUpdateIsActiveMutation,
  useUpdateStatusMutation,
} from "@/app/api/carListingApi";
import placeholderImg from "@/assets/images/placeholder_image.jpg";
import { toaster } from "@/components/ui/toaster";
import { HiCheck, HiX } from "react-icons/hi";
import { MenuIcon } from "lucide-react";
import { LuChevronRight } from "react-icons/lu";
import { LISTING_STATUS, LISTING_STATUS_NUM } from "@/config/constants";
import DataTable from "@/components/DataTable";

const VendorProfile = () => {
  const navigate = useNavigate();
  const { id: vendorId } = useParams();
  const [page, setPage] = useState(1);
  const [
    fetchVendorProfile,
    { data: vendorProfile, isFetching: vendorFetching },
  ] = useLazyGetUserQuery();
  const { data: vendorCars, isFetching: vendorCarsFetching } =
    useGetVendorListingsQuery({ vendor: vendorId, page });

  const [updateStatus] = useUpdateStatusMutation();
  const [updateIsActive] = useUpdateIsActiveMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (vendorId) {
      fetchVendorProfile(vendorId);
    }
  }, [vendorId, fetchVendorProfile]);

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

  const handleUpdateCategory = (listingId, data) => {
    toaster.promise(updateCategory({ listingId, data }).unwrap(), {
      loading: { title: "Updating", description: "Please wait..." },
      success: (res) => {
        return {
          title: res?.message || "Updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error updating category",
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
    {
      key: "rentPerDay",
      label: "Rent/Day",
    },
    { key: "rentPerWeek", label: "Rent/Week" },
    { key: "rentPerMonth", label: "Rent/Month" },
    {
      key: "isFeatured",
      label: "Featured",
      render: (listing) => (
        <Switch.Root
          checked={listing?.isFeatured}
          onCheckedChange={(val) =>
            handleUpdateCategory(listing._id, {
              isFeatured: val.checked ?? val,
            })
          }
          colorPalette="teal"
          size="md"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb>
              <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                <HiCheck />
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Root>
      ),
    },
    {
      key: "isPremium",
      label: "Premium",
      render: (listing) => (
        <Switch.Root
          checked={listing?.isPremium}
          onCheckedChange={(val) =>
            handleUpdateCategory(listing._id, {
              isPremium: val.checked ?? val,
            })
          }
          colorPalette="teal"
          size="md"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb>
              <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                <HiCheck />
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Root>
      ),
    },
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
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link
              cursor="pointer"
              onClick={() => navigate("/vendors")}
            >
              Vendors
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Vendor Profile</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div className={`${styles.page} mt-[30px]`}>
        <div
          className={`${styles.card} ${styles.viewMode} max-w-full md:min-w-[750px]`}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={`relative group overflow-hidden ${styles.avatar}`}>
              {vendorFetching ? (
                <SkeletonCircle height="100%" width="100%" variant="shine" />
              ) : (
                <img
                  src={
                    vendorProfile?.data?.profilePicture
                      ? `${
                          vendorProfile.data.profilePicture?.url
                        }?t=${Date.now()}`
                      : profilePicPlaceholder
                  }
                  alt="Profile"
                  className={`h-full w-full ${styles.avatarPhoto}`}
                />
              )}
            </div>

            <div className={`styles.headerText`}>
              <>
                {vendorFetching ? (
                  <Skeleton variant="shine" width="200px" height="15px" />
                ) : (
                  <h2 className={styles.name}>
                    {vendorProfile?.data?.businessName}
                  </h2>
                )}
                {vendorFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  <p className={styles.infoItem}>
                    {vendorProfile?.data?.email}
                  </p>
                )}
              </>
            </div>
          </div>

          {/* Basic Information */}
          <div className={styles.section}>
            <h3>Basic Information</h3>
            <Box
              display={{ base: "block", md: "flex" }}
              className={`${styles.infoRow}`}
            >
              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>Vendor Admin Name</strong>
                {vendorFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  vendorProfile?.data?.name
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>Fleet Size</strong>
                {vendorFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  vendorProfile?.data?.vendorInformation?.fleetSize
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>Mobile Number</strong>
                {vendorFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  vendorProfile?.data?.contact?.mobileNum
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>WhatsApp</strong>
                {vendorFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  vendorProfile?.data?.contact?.whatsappNum
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>Landline</strong>
                {vendorFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  vendorProfile?.data?.contact?.landlineNum
                )}
              </Box>
            </Box>
          </div>

          {/* Address */}
          <div className={styles.section}>
            <h3>Address</h3>
            <Box
              display={{ base: "block", md: "flex" }}
              className={styles.infoRow}
            >
              {Object.entries(vendorProfile?.data?.address ?? {}).map(
                ([field, value]) => {
                  if (["mapUrl", "street"].includes(field)) {
                    return (
                      <Box
                        marginBottom={{ base: "20px" }}
                        className={styles.infoItem}
                        key={field}
                      >
                        <strong>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </strong>
                        {field === "mapUrl" ? (
                          <a
                            href={`https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Map
                          </a>
                        ) : vendorFetching ? (
                          <Skeleton
                            variant="shine"
                            width="200px"
                            height="15px"
                            mt="10px"
                          />
                        ) : (
                          value
                        )}
                      </Box>
                    );
                  }
                  return null;
                }
              )}
            </Box>
          </div>

          {/* Documents */}
          <div className={styles.section}>
            <h3>Vendor Documents</h3>
            <Flex
              className={`${styles.infoRow}`}
              justify={{ base: "center", md: "space-between" }}
              flexWrap="wrap"
              gap="20px"
              mt="30px"
            >
              {vendorFetching
                ? Array.from({ length: 6 }).map((_, i) => (
                    <DocumentCardSkeleton key={i} />
                  ))
                : Object.entries(
                    vendorProfile?.data?.vendorInformation?.documents ?? {}
                  ).map(([key, value], index) => {
                    if (Object.keys(value).length > 0) {
                      return <DocumentCard key={index} doc={{ key, value }} />;
                    }
                  })}
            </Flex>
          </div>

          <Flex
            justifyContent={{ base: "center", md: "space-between" }}
            gap="20px"
            mt="20px"
          >
            <div
              className={`${styles.backBtn} !border !border-[#5b787c] !text-[#5b787c] cursor-pointer text-center sm:!w-full md:!w-auto`}
              onClick={() => navigate(-1)}
            >
              Back
            </div>
            <div
              className={`${styles.editBtn} ${styles.editModeBtn} cursor-pointer text-center sm:!w-full md:!w-auto`}
              onClick={() => navigate(`/vendors/edit/${vendorId}`)}
            >
              Edit Profile
            </div>
          </Flex>
        </div>
      </div>

      <Box mt="50px" mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          Vendor Cars
        </Heading>
      </Box>

      <DataTable
        columns={columns}
        data={vendorCars?.listings?.docs || []}
        isFetching={vendorCarsFetching}
        pagination={true}
        paginationData={vendorCars?.listings}
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

export default VendorProfile;

const SkeletonRow = () => {
  return (
    <tr className={`${styles.tableRowEven} py-[10px]`}>
      <td className={`${styles.tableCell}`} colSpan={10}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};
