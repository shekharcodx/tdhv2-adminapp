import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetOfferListingsQuery,
  useUpdateCategoryMutation,
} from "@/app/api/carListingApi";
import placeholderImg from "@/assets/images/placeholder_image.jpg";
import { HiCheck, HiX } from "react-icons/hi";
import { MenuIcon } from "lucide-react";
import styles from "./Listing.module.css";
import FilterInput from "@/components/FilterInput/input";
import FilterResetBtn from "@/components/FilterResetBtn";
import DataTable from "@/components/DataTable";
import {
  Box,
  Button,
  Heading,
  Menu,
  Portal,
  Skeleton,
  Switch,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

const OfferListings = () => {
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();

  const {
    data: offerListings,
    isFetching,
    refetch,
  } = useGetOfferListingsQuery({
    page,
    searchTerm: searchString,
  });

  const [updateCategory] = useUpdateCategoryMutation();

  const handleSearchInput = (string) => {
    setSearchString(string);
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

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
            listing?.coverImage?.url
              ? `${listing.coverImage.url}?v=${Date.now()}`
              : placeholderImg
          }
          alt={listing?.title}
          className={`${styles.avatar} mx-auto`}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
    },
    { key: "vendor", label: "Vendor Name" },
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
      key: "isBest",
      label: "Best",
      render: (listing) => (
        <Switch.Root
          checked={listing?.isBest}
          onCheckedChange={(val) =>
            handleUpdateCategory(listing._id, {
              isBest: val.checked ?? val,
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
      key: "isPopular",
      label: "Popular",
      render: (listing) => (
        <Switch.Root
          checked={listing?.isPopular}
          onCheckedChange={(val) =>
            handleUpdateCategory(listing._id, {
              isPopular: val.checked ?? val,
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
      key: "isTopChoice",
      label: "Top Choice",
      render: (listing) => (
        <Switch.Root
          checked={listing?.isTopChoice}
          onCheckedChange={(val) =>
            handleUpdateCategory(listing._id, {
              isTopChoice: val.checked ?? val,
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
          Offers{" "}
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            (Only active and approved listings will apprear here)
          </span>
        </Heading>
        <Box
          display={{ base: "block", md: "flex" }}
          justifyContent={{ base: "center", md: "start" }}
          alignItems="end"
          gap={{ md: "20px" }}
          my="20px"
        >
          <FilterInput
            label="Search Listing"
            placeholder="Search listing"
            value={searchString}
            setValue={handleSearchInput}
          />

          <FilterResetBtn setSearch={setSearchString} />
        </Box>
      </Box>

      <DataTable
        columns={columns}
        data={offerListings?.data?.docs || []}
        isFetching={isFetching}
        pagination={true}
        paginationData={offerListings?.data}
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
      <td className={`${styles.tableCell}`} colSpan={9}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default OfferListings;
