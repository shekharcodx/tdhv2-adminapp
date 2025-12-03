import { useEffect, useState } from "react";
import { useLazyGetListingQuery } from "@/app/api/carListingApi";
import { useParams, useNavigate } from "react-router-dom";
import { LISTING_STATUS_NUM } from "@/config/constants";
import {
  Badge,
  Button,
  Heading,
  Skeleton,
  SkeletonText, 
  Text,
} from "@chakra-ui/react";

const ListingView = () => {
  const navigate = useNavigate();
  const { id: listingId } = useParams();
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState([]);
  const [fetchListing, { data: listing, isFetching }] =
    useLazyGetListingQuery();

  useEffect(() => {
    if (listingId) {
      fetchListing(listingId);
    }
  }, [fetchListing, listingId]);

  useEffect(() => {
    if (listing?.listing?.car?.coverImage) {
      setSelectedImage(listing?.listing?.car?.coverImage);
    }
    if (
      listing?.listing?.car?.images?.length > 0 &&
      listing?.listing?.car?.coverImage
    ) {
      const imgs = [
        listing?.listing?.car?.coverImage,
        ...(listing?.listing?.car?.images || []),
      ];
      setImages(imgs);
    }
  }, [listing]);

  return (
    <>
      {/* <Heading fontSize="24px" fontWeight="700" mb="30px">
        Car Listing
      </Heading> */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {isFetching ? (
            <Skeleton height="28px" width="200px" rounded="md" />
          ) : (
            <h1 className="text-2xl font-bold">{listing?.listing?.title}</h1>
          )}
          <div className="flex gap-2">
            {isFetching ? (
              <>
                <Skeleton height="36px" width="80px" rounded="lg" />
                <Skeleton height="36px" width="80px" rounded="lg" />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  border="1px solid #5b787c"
                  px="16px"
                  py="8px"
                  color="#5b787c"
                  // className="px-4 py-2 border border-[#5b787c] rounded-lg text-[#5b787c] cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  bg={"var(--gradient-background)"}
                  px="16px"
                  py="8px"
                  // className="px-4 py-2 bg-[image:var(--gradient-background)] rounded-lg text-white cursor-pointer"
                  onClick={() =>
                    navigate(`/car-listings/edit/${listing?.listing?._id}`)
                  }
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {isFetching ? (
          <Skeleton height="288px" rounded="2xl" />
        ) : (
          <div className="rounded-2xl shadow-md overflow-hidden">
            <img
              src={`${selectedImage?.url}?v=${Date.now()}`}
              alt={listing?.listing?.title}
              className="w-full h-72 object-contain"
            />
          </div>
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto">
          {isFetching
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height="64px" width="96px" rounded="lg" />
              ))
            : images?.map((img, idx) => (
                <img
                  key={idx}
                  src={`${img.url}?v=${Date.now()}`}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-16 object-contain rounded-lg cursor-pointer border-2 ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                />
              ))}
        </div>

        {/* General Info */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">General Information</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isFetching ? (
              <SkeletonText noOfLines={6} spacing="4" />
            ) : (
              <>
                <div>
                  <strong>Description:</strong>
                  <p className="text-gray-700">
                    {listing?.listing?.description}
                  </p>
                </div>
                <div>
                  <strong>Location:</strong>
                  <p>{listing?.listing?.location}</p>
                </div>
                <div>
                  <strong>Featured:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      listing?.listing?.isFeatured
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {listing?.listing?.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <strong>Premium:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      listing?.listing?.isPremium
                        ? "bg-purple-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {listing?.listing?.isPremium ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className="px-2 py-1 rounded bg-green-500 text-white text-sm">
                    {LISTING_STATUS_NUM[Number(listing?.listing?.status)]}
                  </span>
                </div>
                <div>
                  <strong>Active:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      listing?.listing?.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {listing?.listing?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Pricing</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {isFetching ? (
              <SkeletonText noOfLines={7} spacing="4" />
            ) : (
              <>
                <div>
                  <strong>Rent/Day:</strong> {listing?.listing?.rentPerDay} AED
                </div>
                <div>
                  <strong>Rent/Week:</strong> {listing?.listing?.rentPerWeek}{" "}
                  AED
                </div>
                <div>
                  <strong>Rent/Month:</strong> {listing?.listing?.rentPerMonth}{" "}
                  AED
                </div>
                <div>
                  <strong>Extra Mileage Rate:</strong>{" "}
                  {listing?.listing?.extraMileageRate} AED
                </div>
                <div>
                  <strong>Delivery Charges:</strong>{" "}
                  {listing?.listing?.deliveryCharges} AED
                </div>
                <div>
                  <strong>Toll Charges:</strong> {listing?.listing?.tollCharges}{" "}
                  AED
                </div>
                <div>
                  <strong>Security Deposit:</strong>{" "}
                  {listing?.listing?.securityDeposit} AED
                </div>
              </>
            )}
          </div>
        </div>

        {/* Car Details */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Car Details</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isFetching ? (
              <SkeletonText noOfLines={8} spacing="4" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={listing?.listing?.car?.carBrand?.logo?.url}
                    alt=""
                    className="w-6 h-6 rounded"
                  />
                  <span>{listing?.listing?.car?.carBrand?.name}</span>
                </div>
                <div>
                  <strong>Model:</strong>{" "}
                  {listing?.listing?.car?.carBrand?.carModel?.name}
                </div>
                <div>
                  <strong>Trim:</strong>{" "}
                  {listing?.listing?.car?.carBrand?.carModel?.details?.carTrim}
                </div>
                <div>
                  <strong>Year:</strong>{" "}
                  {
                    listing?.listing?.car?.carBrand?.carModel?.details
                      ?.modelYear
                  }
                </div>
                <div>
                  <strong>Mileage:</strong> {listing?.listing?.car?.mileage}
                </div>
                <div>
                  <strong>Daily Mileage:</strong>{" "}
                  {listing?.listing?.car?.dailyMileage}
                </div>
                <div>
                  <strong>Weekly Mileage:</strong>{" "}
                  {listing?.listing?.car?.weeklyMileage}
                </div>
                <div>
                  <strong>Monthly Mileage:</strong>{" "}
                  {listing?.listing?.car?.monthlyMileage}
                </div>
                <div>
                  <strong>Air Bags:</strong> {listing?.listing?.car?.airBags}
                </div>
                <div>
                  <strong>Fuel Tank Capacity:</strong>{" "}
                  {listing?.listing?.car?.tankCapacity}
                </div>
                <div>
                  <strong>Doors:</strong>{" "}
                  {listing?.listing?.car?.carBrand?.carModel?.details?.doors}
                </div>
                <div>
                  <strong>Seating Capacity:</strong>{" "}
                  {
                    listing?.listing?.car?.carBrand?.carModel?.details
                      ?.seatingCapacity
                  }
                </div>
                <div>
                  <strong>Horsepower:</strong>{" "}
                  {
                    listing?.listing?.car?.carBrand?.carModel?.details
                      ?.horsePower
                  }{" "}
                  HP
                </div>
                <div>
                  <strong>Body Type:</strong>{" "}
                  {listing?.listing?.car?.carBrand?.carModel?.details?.bodyType}
                </div>
                <div>
                  <strong>Fuel Type:</strong>{" "}
                  {listing?.listing?.car?.carBrand?.carModel?.details?.fuelType}
                </div>
                <div>
                  <strong>Interior Color:</strong>{" "}
                  {
                    listing?.listing?.car?.carBrand?.carModel?.details
                      ?.interiorColor
                  }
                </div>
                <div>
                  <strong>Exterior Color:</strong>{" "}
                  {
                    listing?.listing?.car?.carBrand?.carModel?.details
                      ?.exteriorColor
                  }
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Features</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isFetching ? (
              <SkeletonText noOfLines={6} spacing="4" />
            ) : (
              <>
                <div>
                  <strong>Technical Features:</strong>
                  <ul className="list-disc list-inside text-gray-700">
                    {listing?.listing?.car?.carBrand?.carModel?.details?.techFeatures.map(
                      (f, i) => (
                        <li key={i}>{f.name}</li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <strong>Other Features:</strong>
                  <ul className="list-disc list-inside text-gray-700">
                    {listing?.listing?.car?.carBrand?.carModel?.details?.otherFeatures.map(
                      (f, i) => (
                        <li key={i}>{f.name}</li>
                      )
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Additional Information</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {isFetching ? (
              <SkeletonText noOfLines={6} spacing="4" />
            ) : (
              <>
                <div>
                  <strong>Regional Specs:</strong>{" "}
                  {listing?.listing?.car?.regionalSpecs}
                </div>
                <div>
                  <strong>Insurance:</strong>{" "}
                  <Badge
                    colorPalette={
                      listing?.listing?.car?.carInsurance == "yes"
                        ? "green"
                        : "red"
                    }
                  >
                    {listing?.listing?.car?.carInsurance}
                  </Badge>
                </div>
                <div>
                  <strong>Warranty:</strong>{" "}
                  <Badge
                    colorPalette={
                      listing?.listing?.car?.warranty == "yes" ? "green" : "red"
                    }
                  >
                    {listing?.listing?.car?.warranty}
                  </Badge>
                </div>
                <div>
                  <strong>Warranty:</strong>{" "}
                  <Badge
                    colorPalette={
                      listing?.listing?.car?.warranty == "yes" ? "green" : "red"
                    }
                  >
                    {listing?.listing?.car?.warranty}
                  </Badge>
                </div>
                <div>
                  <strong>Pickup Available:</strong>{" "}
                  <Badge
                    colorPalette={
                      listing?.listing?.pickupAvailable ? "green" : "red"
                    }
                  >
                    {listing?.listing?.pickupAvailable ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <strong>Deposit Required:</strong>{" "}
                  <Badge
                    colorPalette={
                      listing?.listing?.depositRequired ? "green" : "red"
                    }
                  >
                    {listing?.listing?.depositRequired ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <strong>Mileage:</strong> {listing?.listing?.car?.mileage} KM
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingView;
