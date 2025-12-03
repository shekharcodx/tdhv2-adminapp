import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cropper from "react-easy-crop";
import {
  useLazyGetListingQuery,
  useUpdateListingMutation,
} from "@/app/api/carListingApi";
import {
  useGetCarBrandQuery,
  useLazyGetCarModelsQuery,
  useLazyGetCarTrimsQuery,
  useGetBodyTypesQuery,
  useGetColorsQuery,
  useGetDoorsQuery,
  useGetFuelTypesQuery,
  useGetPowersQuery,
  useGetYearsQuery,
  useGetTransmissionsQuery,
  useGetSeatingCapacitiesQuery,
  useGetTechFeaturesQuery,
  useGetRegionalSpecsQuery,
  useGetOtherFeaturesQuery,
} from "@/app/api/carMasterDataApi";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Skeleton } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import styles from "./EditCar.module.css";

const OUTPUT_WIDTH = 1280;
const OUTPUT_HEIGHT = 960;

// ----------------- ZOD SCHEMA -----------------
const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  location: z.string().min(2, "Location is required"),
  isFeatured: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  rentPerDay: z.coerce.number().min(1, "Rent/Day is required"),
  rentPerWeek: z.coerce.number().optional(),
  rentPerMonth: z.coerce.number().optional(),
  dailyMileage: z.coerce.number().min(1, "Daily mileage is required"),
  weeklyMileage: z.coerce.number().min(1, "Weekly mileage is required"),
  monthlyMileage: z.coerce.number().min(1, "Monthly mileage is required"),
  airBags: z
    .string()
    .min(1, "Air Bags is required")
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "Air Bags cannot be negative",
    }),
  tankCapacity: z.coerce.number().min(1, "Tank capacity is required"),
  extraMileageRate: z.coerce
    .number()
    .min(0, "Extra mileage rate cannot be negative"),
  deliveryCharges: z
    .string()
    .min(1, "Delivery charges is required")
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "Delivery charges cannot be negative",
    }),
  tollCharges: z
    .string()
    .min(1, "Toll charges is required")
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "Toll charges cannot be negative",
    }),
  securityDeposit: z.string().min(1, "Security deposit is required"),
  minRentalDays: z.coerce.number().min(1, "Min rental days is required"),
  pickupAvailable: z.string().min(1, "Pickup Available is required"),
  depositRequired: z.string().min(1, "Deposit Required is required"),
  carBrand: z.string().min(1, "Brand required"),
  carModel: z.string().min(1, "Model required"),
  carTrim: z.string().optional(),
  modelYear: z.string().nonempty("Years is required"),
  doors: z.string().nonempty("Doors is required"),
  seatingCapacity: z.string().nonempty("Seating capacity is required"),
  horsePower: z.string().nonempty("Horsepower is required"),
  bodyType: z.string().optional(),
  fuelType: z.string().min(1, "Fuel type required"),
  interiorColor: z.string().optional(),
  exteriorColor: z.string().optional(),
  regionalSpecs: z.string().optional(),
  carInsurance: z.string().optional(),
  warranty: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.coerce.number().optional(),
  techFeatures: z.array(z.string()).optional(),
  otherFeatures: z.array(z.string()).optional(),
  coverImage: z
    .any()
    .refine(
      (file) => !file || file.length === 0 || file.length === 1,
      "Cover image is required"
    )
    .transform((files) => (files && files.length > 0 ? files[0] : undefined)),
  images: z
    .any()
    .optional()
    .refine(
      (files) => !files || files instanceof FileList,
      "Invalid images input"
    )
    .transform((files) => (files ? Array.from(files) : [])),
});

async function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

async function getCroppedImg(imageSrc, cropPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve({ blob, url });
    }, "image/png");
  });
}

const ListingEdit = () => {
  const navigate = useNavigate();
  const { id: listingId } = useParams();

  const [selectedImages, setSelectedImages] = useState([]); 
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);

  const [fetchListing, { data: listing, isFetching }] =
    useLazyGetListingQuery();

  const { data: carBrands } = useGetCarBrandQuery();
  const [fetchModels, { data: carModels }] = useLazyGetCarModelsQuery();
  const [fetchTrims, { data: carTrims }] = useLazyGetCarTrimsQuery();
  const { data: years } = useGetYearsQuery();
  const { data: transmissions } = useGetTransmissionsQuery();
  const { data: seatings } = useGetSeatingCapacitiesQuery();
  const { data: colors } = useGetColorsQuery();
  const { data: doors } = useGetDoorsQuery();
  const { data: regionalSpecs } = useGetRegionalSpecsQuery();
  const { data: bodyTypes } = useGetBodyTypesQuery();
  const { data: fuelTypes } = useGetFuelTypesQuery();
  const { data: powers } = useGetPowersQuery();
  const { data: techFeatures } = useGetTechFeaturesQuery();
  const { data: otherFeatures } = useGetOtherFeaturesQuery();

  const [updateListing, { isLoading: listingIsUpdating }] =
    useUpdateListingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(listingSchema),
  });

  const coverFileRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropTarget, setCropTarget] = useState(null);
 
  useEffect(() => {
    if (listingId) {
      fetchListing(listingId);
    }
  }, [listingId, fetchListing]);

  useEffect(() => {
    if (!listing) return;

    const brandId = carBrands?.carBrands?.find(
      (b) => b.name === listing?.listing?.car?.carBrand?.name
    )?._id;
    const modelYearId = years?.years?.find(
      (y) =>
        y.year ==
        listing?.listing?.car?.carBrand?.carModel?.details?.modelYear
    )?._id;
    const regionalSpecId = regionalSpecs?.specs?.find(
      (s) => s.name === listing?.listing?.car.regionalSpecs
    )?._id;
    const horsePowerId = powers?.horsePowers?.find(
      (hp) =>
        hp.power ===
        listing?.listing?.car.carBrand?.carModel?.details?.horsePower
    )?._id;

    const seatingId = seatings?.seatingCapacities?.find(
      (s) =>
        s.seats ===
        listing?.listing?.car.carBrand?.carModel?.details?.seatingCapacity
    )?._id;

    const interiorColorId = colors?.colors?.find(
      (c) =>
        c.name ===
        listing?.listing?.car.carBrand?.carModel?.details?.interiorColor
    )?._id;

    const exteriorColorId = colors?.colors?.find(
      (c) =>
        c.name ===
        listing?.listing?.car.carBrand?.carModel?.details?.exteriorColor
    )?._id;

    const doorsId = doors?.doors?.find(
      (d) =>
        d.doors === listing?.listing?.car.carBrand?.carModel?.details?.doors
    )?._id;

    const transmissionId = transmissions?.transmissions?.find(
      (t) =>
        t.transmission ===
        listing?.listing?.car.carBrand?.carModel?.details?.transmission
    )?._id;

    const bodyTypeId = bodyTypes?.bodyTypes?.find(
      (b) =>
        b.name === listing?.listing?.car.carBrand?.carModel?.details?.bodyType
    )?._id;

    const fuelTypeId = fuelTypes?.fuelTypes?.find(
      (f) =>
        f.name ===
        listing?.listing?.car.carBrand?.carModel?.details?.fuelType
    )?._id;

    const techFeatureIds =
      listing?.listing?.car?.carBrand?.carModel?.details?.techFeatures?.map(
        (tf) => techFeatures?.features?.find((f) => f.name === tf.name)?._id
      ) || [];

    const otherFeatureIds =
      listing?.listing?.car?.carBrand?.carModel?.details?.otherFeatures?.map(
        (tf) => otherFeatures?.features?.find((f) => f.name === tf.name)?._id
      ) || [];

    reset({
      title: listing?.listing?.title,
      description: listing?.listing?.description,
      location: listing?.listing?.location,
      isFeatured: listing?.listing?.isFeatured,
      isPremium: listing?.listing?.isPremium,
      rentPerDay: listing?.listing?.rentPerDay,
      rentPerWeek: listing?.listing?.rentPerWeek,
      rentPerMonth: listing?.listing?.rentPerMonth,
      carBrand: brandId || "",
      modelYear: modelYearId || "",
      doors: doorsId || "",
      seatingCapacity: seatingId || "",
      horsePower: horsePowerId || "",
      bodyType: bodyTypeId || "",
      fuelType: fuelTypeId || "",
      transmission: transmissionId || "",
      interiorColor: interiorColorId || "",
      exteriorColor: exteriorColorId || "",
      techFeatures: techFeatureIds,
      otherFeatures: otherFeatureIds,
      regionalSpecs: regionalSpecId,
      carInsurance: listing?.listing?.car?.carInsurance?.toLowerCase() || "",
      warranty: listing?.listing?.car?.warranty?.toLowerCase() || "",
      mileage: listing?.listing?.car?.mileage,
      extraMileageRate: listing?.listing?.extraMileageRate.toString(),
      deliveryCharges: listing?.listing?.deliveryCharges.toString(),
      tollCharges: listing?.listing?.tollCharges.toString(),
      securityDeposit: listing?.listing?.securityDeposit.toString(),
      dailyMileage: listing?.listing?.car?.dailyMileage.toString(),
      weeklyMileage: listing?.listing?.car?.weeklyMileage.toString(),
      monthlyMileage: listing?.listing?.car?.monthlyMileage.toString(),
      airBags: listing?.listing?.car?.airBags.toString(),
      tankCapacity: listing?.listing?.car?.tankCapacity.toString(),
      minRentalDays: listing?.listing?.minRentalDays.toString(),
      pickupAvailable: listing?.listing?.pickupAvailable.toString(),
      depositRequired: listing?.listing?.depositRequired.toString(),
    });

    const coverUrl = listing?.listing?.car?.coverImage?.url;
    if (coverUrl) {
      setSelectedCoverImage({
        file: null,
        url: coverUrl,
        name: "server-cover",
      });

      setValue("coverImage", new DataTransfer().files);
    }
  }, [
    reset,
    listing,
    carBrands,
    transmissions,
    colors,
    bodyTypes,
    doors,
    seatings,
    years,
    powers,
    regionalSpecs,
    fuelTypes,
    techFeatures,
    otherFeatures,
    setValue,
  ]);

  const carBrandWatch = watch("carBrand");

  useEffect(() => {
    if (!carBrandWatch || !listing) return;

    fetchModels(carBrandWatch).then((res) => {
      const carModalId = res?.data?.carModels?.find(
        (m) => m.name == listing.listing.car?.carBrand?.carModel?.name
      )?._id;
      reset({
        ...getValues(),
        carModel: carModalId || "",
      });
    });
  }, [carBrandWatch, fetchModels, reset, getValues, listing]);

  const carModelWatch = watch("carModel");

  useEffect(() => {
    if (!carModelWatch || !listing) return;

    fetchTrims(carModelWatch).then((res) => {
      const carTrimId = res?.data?.carTrims?.find(
        (t) =>
          t.name ==
          listing.listing.car?.carBrand?.carModel?.details?.carTrim
      )?._id;
      reset({
        ...getValues(),
        carTrim: carTrimId || "",
      });
    });
  }, [carModelWatch, fetchTrims, reset, getValues, listing]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages(newImages);
    setValue("images", e.target.files, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const first = newImages[0];
    setImageSrc(first.url);
    setShowCropper(true);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setCropTarget({ type: "gallery", index: 0 });
  };

  const onSelectCoverFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const url = URL.createObjectURL(f);
    setImageSrc(url);
    setShowCropper(true);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setCropTarget({ type: "cover" });
  };

  const onCropComplete = useCallback((area, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const onEditGalleryImage = (idx) => {
    const img = selectedImages[idx];
    if (!img) return;

    setImageSrc(img.url);
    setShowCropper(true);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setCropTarget({ type: "gallery", index: idx });
  };

  const applyCrop = useCallback(
    async (mode) => {
      if (!imageSrc || !croppedAreaPixels || !cropTarget) {
        alert("Please adjust crop area before applying.");
        return;
      }

      try {
        const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
        const file = new File([blob], `image-${Date.now()}.png`, {
          type: "image/png",
        });

        const applyToCover =
          mode === "cover" || mode === "gallery+cover";
        const applyToGallery =
          mode === "gallery" || mode === "gallery+cover";

        if (applyToCover) {
          setSelectedCoverImage({ file, url, name: file.name });

          const dtCover = new DataTransfer();
          dtCover.items.add(file);
          setValue("coverImage", dtCover.files, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        if (applyToGallery && cropTarget.type === "gallery") {
          setSelectedImages((prev) => {
            const updated = [...prev];
            updated[cropTarget.index] = {
              file,
              url,
              name: file.name,
            };
            return updated;
          });

          const currentFiles = getValues("images");
          const dt = new DataTransfer();

          if (currentFiles && currentFiles.length) {
            for (let i = 0; i < currentFiles.length; i++) {
              if (i === cropTarget.index) {
                dt.items.add(file);
              } else {
                dt.items.add(currentFiles[i]);
              }
            }
          } else {
            dt.items.add(file);
          }

          setValue("images", dt.files, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        setShowCropper(false);
        URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
        setCroppedAreaPixels(null);
        setCropTarget(null);
      } catch (err) {
        console.error("Crop failed:", err);
        alert("Crop failed. Check console.");
        setShowCropper(false);
        if (imageSrc) URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
        setCroppedAreaPixels(null);
        setCropTarget(null);
      }
    },
    [imageSrc, croppedAreaPixels, cropTarget, getValues, setValue]
  );

  const cancelCrop = () => {
    setShowCropper(false);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setCropTarget(null);
  };
  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("id", listingId);

    Object.entries(values).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => formData.append("images", img));
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value);
      }
    });

    toaster.promise(updateListing({ listingId, values: formData }).unwrap(), {
      loading: { title: "Updating listing", description: "Please wait..." },
      success: (res) => {
        if (res?.code === 2001) {
          navigate(`/car-listings/view/${listingId}`);
        }
        return {
          title: res?.message || "Listings updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.err || "Error updating listing",
          description: "Please try again",
        };
      },
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Car Listing</h1>
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
                  disabled={listingIsUpdating}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  bg={"var(--gradient-background)"}
                  px="16px"
                  py="8px"
                  disabled={listingIsUpdating}
                >
                  Update
                </Button>
              </>
            )}
          </div>
        </div>

        <section className="rounded-xl border bg-white shadow-sm p-6 space-y-4">
          <div className={styles.imageUploadSection}>
            <div className={styles.sectionHeader}>Add Cover Image</div>
            <input
              ref={coverFileRef}
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={onSelectCoverFile}
              style={{ display: "none" }}
            />
            <div>
              <label
                onClick={() => coverFileRef.current?.click()}
                className={styles.uploadLabel}
                style={{ cursor: "pointer" }}
              >
                Choose Cover Image
              </label>

              {selectedCoverImage ? (
                <div className={styles.imagePreviewGrid}>
                  <img
                    src={selectedCoverImage.url}
                    alt={selectedCoverImage.name}
                    className={styles.imagePreview}
                  />
                </div>
              ) : listing?.listing?.car?.coverImage?.url ? (
                <div className={styles.imagePreviewGrid}>
                  <img
                    src={listing?.listing?.car?.coverImage?.url}
                    alt={listing?.listing?.car?.coverImage?.key}
                    className={styles.imagePreview}
                  />
                </div>
              ) : null}
            </div>

            {errors.coverImage && (
              <p className="text-red-500 text-sm">
                {errors.coverImage.message}
              </p>
            )}
          </div>

         <div className={styles.imageUploadSection}>
          <div className={styles.sectionHeader}>Add Images</div>

          <input
            id="file-upload"
            type="file"
            hidden
            multiple
            {...register("images", {
              onChange: (e) => handleImageChange(e),
            })}
          />

          <label htmlFor="file-upload" className={styles.uploadLabel}>
            Choose Files
          </label>

          {errors?.images && (
            <p className="text-red-500 text-sm">{errors.images?.message}</p>
          )}

          {selectedImages.length > 0 ? (
            <div className={styles.imagePreviewGrid}>
              {selectedImages.map((img, idx) => (
                <div key={idx} className={styles.imageWrapper}>
                  <img
                    src={img.url}
                    alt={img.name}
                    className={styles.imagePreview}
                    onClick={() => onEditGalleryImage(idx)}   
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.imagePreviewGrid}>
              {listing?.listing?.car?.images?.map((img, idx) => (
                <div key={idx} className={styles.imageWrapper}>
                  <img
                    src={img.url}
                    alt={img.name}
                    className={styles.imagePreview}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

          <h2 className="font-semibold text-lg">General Information</h2>
          <div>
            <label className="block font-medium">Title</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="text"
                {...register("title")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            {isFetching ? (
              <Skeleton height="80px" borderRadius="md" mt={2} />
            ) : (
              <textarea
                {...register("description")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium">Location</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("location")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Emirate</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Dubai">Dubai</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                <option value="Fujairah">Fujairah</option>
              </select>
            )}
            {errors.location && (
              <p className="text-red-500 text-sm">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Featured / Premium */}
          <div className="flex items-center gap-6">
            {isFetching ? (
              <>
                <Skeleton height="20px" width="100px" borderRadius="md" />
                <Skeleton height="20px" width="100px" borderRadius="md" />
              </>
            ) : (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="outline-none border-[rgba(91, 120, 124, 1)]"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isPremium")}
                    className="outline-none border-[rgba(91, 120, 124, 1)]"
                  />
                  Premium
                </label>
              </>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-xl border bg-white shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Rent / Day</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("rentPerDay")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.rentPerDay && (
              <p className="text-red-500 text-sm">
                {errors.rentPerDay.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Rent / Week</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("rentPerWeek")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.rentPerWeek && (
              <p className="text-red-500 text-sm">
                {errors.rentPerWeek.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Rent / Month</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("rentPerMonth")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.rentPerMonth && (
              <p className="text-red-500 text-sm">
                {errors.rentPerMonth.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">Extra Mileage Rate</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="text"
                {...register("extraMileageRate")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.extraMileageRate && (
              <p className="text-red-500 text-sm">
                {errors.extraMileageRate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">Delivery Charges</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="text"
                {...register("deliveryCharges")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.deliveryCharges && (
              <p className="text-red-500 text-sm">
                {errors.deliveryCharges.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">Toll Charges</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="text"
                {...register("tollCharges")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.tollCharges && (
              <p className="text-red-500 text-sm">
                {errors.tollCharges.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">Security Deposit</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="text"
                {...register("securityDeposit")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.securityDeposit && (
              <p className="text-red-500 text-sm">
                {errors.securityDeposit.message}
              </p>
            )}
          </div>
        </section>

        {/* Car Details */}
        <section className="rounded-xl border bg-white shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Brand</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("carBrand")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select a brand</option>
                {carBrands?.carBrands?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            )}
            {errors.carBrand && (
              <p className="text-red-500 text-sm">
                {errors.carBrand.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Model</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("carModel")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select a model</option>
                {carModels?.carModels?.map((model, i) => (
                  <option key={i} value={model._id}>
                    {model.name}
                  </option>
                ))}
              </select>
            )}
            {errors.carModel && (
              <p className="text-red-500 text-sm">
                {errors.carModel.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Trim</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("carTrim")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select a trim</option>
                {carTrims?.carTrims?.map((trim, i) => (
                  <option key={i} value={trim._id}>
                    {trim.name}
                  </option>
                ))}
              </select>
            )}
            {errors.carTrim && (
              <p className="text-red-500 text-sm">
                {errors.carTrim.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Year</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("modelYear")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select a year</option>
                {years?.years?.map((year, i) => (
                  <option key={i} value={year._id}>
                    {year.year}
                  </option>
                ))}
              </select>
            )}
            {errors.modelYear && (
              <p className="text-red-500 text-sm">
                {errors.modelYear.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Doors</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("doors")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select doors</option>
                {doors?.doors?.map((door, i) => (
                  <option key={i} value={door._id}>
                    {door.doors}
                  </option>
                ))}
              </select>
            )}
            {errors.doors && (
              <p className="text-red-500 text-sm">{errors.doors.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Seating Capacity</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("seatingCapacity")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Capacity</option>
                {seatings?.seatingCapacities?.map((cap, i) => (
                  <option key={i} value={cap._id}>
                    {cap.seats}
                  </option>
                ))}
              </select>
            )}
            {errors.seatingCapacity && (
              <p className="text-red-500 text-sm">
                {errors.seatingCapacity.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Horsepower</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("horsePower")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Horse Power</option>
                {powers?.horsePowers?.map((power, i) => (
                  <option key={i} value={power._id}>
                    {power.power}
                  </option>
                ))}
              </select>
            )}
            {errors.horsePower && (
              <p className="text-red-500 text-sm">
                {errors.horsePower.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Body Type</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("bodyType")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Body Type</option>
                {bodyTypes?.bodyTypes?.map((type, i) => (
                  <option key={i} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            )}
            {errors.bodyType && (
              <p className="text-red-500 text-sm">
                {errors.bodyType.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Fuel Type</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("fuelType")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes?.fuelTypes?.map((type, i) => (
                  <option key={i} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            )}
            {errors.fuelType && (
              <p className="text-red-500 text-sm">
                {errors.fuelType.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Transmission</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("transmission")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Transmission</option>
                {transmissions?.transmissions?.map((type, i) => (
                  <option key={i} value={type._id}>
                    {type.transmission}
                  </option>
                ))}
              </select>
            )}
            {errors.transmission && (
              <p className="text-red-500 text-sm">
                {errors.transmission.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Interior Color</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("interiorColor")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Interior Color</option>
                {colors?.colors?.map((color, i) => (
                  <option key={i} value={color._id}>
                    {color.name}
                  </option>
                ))}
              </select>
            )}
            {errors.interiorColor && (
              <p className="text-red-500 text-sm">
                {errors.interiorColor.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Exterior Color</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("exteriorColor")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Exterior Color</option>
                {colors?.colors?.map((color, i) => (
                  <option key={i} value={color._id}>
                    {color.name}
                  </option>
                ))}
              </select>
            )}
            {errors.exteriorColor && (
              <p className="text-red-500 text-sm">
                {errors.exteriorColor.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Air Bags</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("airBags")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.airBags && (
              <p className="text-red-500 text-sm">{errors.airBags.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Fuel Tank Capacity</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("tankCapacity")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.tankCapacity && (
              <p className="text-red-500 text-sm">
                {errors.tankCapacity.message}
              </p>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="rounded-xl border bg-white shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Technical Features</label>
            <div className="flex justify-start gap-2 flex-row flex-wrap mt-2">
              {isFetching ? (
                <>
                  <Skeleton height="20px" width="100px" borderRadius="md" />
                  <Skeleton height="20px" width="100px" borderRadius="md" />
                </>
              ) : (
                techFeatures?.features?.map((feature, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-1 ml-2 outline-none border-[rgba(91, 120, 124, 1)]"
                  >
                    <input
                      type="checkbox"
                      value={feature._id}
                      {...register("techFeatures")}
                    />
                    {feature.name}
                  </label>
                ))
              )}
            </div>
          </div>
          <div>
            <label className="block font-medium">Other Features</label>
            <div className="flex justify-start gap-2 flex-row flex-wrap mt-2">
              {isFetching ? (
                <>
                  <Skeleton height="20px" width="100px" borderRadius="md" />
                  <Skeleton height="20px" width="100px" borderRadius="md" />
                </>
              ) : (
                otherFeatures?.features?.map((feature, i) => (
                  <label key={i} className="flex items-center gap-1 ml-2">
                    <input
                      type="checkbox"
                      value={feature._id}
                      className="accent-[rgba(91, 120, 124, 1)]"
                      {...register("otherFeatures")}
                    />
                    {feature.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="rounded-xl border bg-white shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Regional Specs</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("regionalSpecs")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Regional Specs</option>
                {regionalSpecs?.specs?.map((spec, i) => (
                  <option key={i} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            )}
            {errors.regionalSpecs && (
              <p className="text-red-500 text-sm">
                {errors.regionalSpecs.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Insurance</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("carInsurance")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Car Insurance</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
            {errors.carInsurance && (
              <p className="text-red-500 text-sm">
                {errors.carInsurance.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Warranty</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("warranty")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Car Warranty</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
            {errors.warranty && (
              <p className="text-red-500 text-sm">
                {errors.warranty.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Pickup Available</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("pickupAvailable")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Pickup Available</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
            {errors.pickupAvailable && (
              <p className="text-red-500 text-sm">
                {errors.pickupAvailable.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Deposit Required</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <select
                {...register("depositRequired")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              >
                <option value="">Select Deposit Required</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
            {errors.depositRequired && (
              <p className="text-red-500 text-sm">
                {errors.depositRequired.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Minimum Rental Days</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("minRentalDays")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.minRentalDays && (
              <p className="text-red-500 text-sm">
                {errors.minRentalDays.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Mileage</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("mileage")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.mileage && (
              <p className="text-red-500 text-sm">
                {errors.mileage.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Daily Mileage</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("dailyMileage")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.dailyMileage && (
              <p className="text-red-500 text-sm">
                {errors.dailyMileage.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Weekly Mileage</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("weeklyMileage")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.weeklyMileage && (
              <p className="text-red-500 text-sm">
                {errors.weeklyMileage.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Monthly Mileage</label>
            {isFetching ? (
              <Skeleton height="40px" borderRadius="md" mt={2} />
            ) : (
              <input
                type="number"
                {...register("monthlyMileage")}
                className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
              />
            )}
            {errors.monthlyMileage && (
              <p className="text-red-500 text-sm">
                {errors.monthlyMileage.message}
              </p>
            )}
          </div>
        </section>
      </form>

      {/* Cropper Modal */}
      {showCropper && imageSrc && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1000,
              background: "#fff",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 560,
                background: "#333",
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={OUTPUT_WIDTH / OUTPUT_HEIGHT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <label style={{ flex: 1 }}>
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </label>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={cancelCrop} style={{ padding: "8px 12px" }}>
                  Cancel
                </button>

                {cropTarget?.type === "gallery" && (
                  <>
                    <button
                      onClick={() => applyCrop("gallery")}
                      style={{
                        padding: "8px 12px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => applyCrop("gallery+cover")}
                      style={{
                        padding: "8px 12px",
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Apply & Set as Cover
                    </button>
                  </>
                )}

                {cropTarget?.type === "cover" && (
                  <button
                    onClick={() => applyCrop("cover")}
                    style={{
                      padding: "8px 12px",
                      background: "#2b8a3e",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingEdit;
