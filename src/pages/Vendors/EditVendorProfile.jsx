import { useEffect, useRef, useState } from "react";
import styles from "./VendorProfile.module.css";
import { Box, Breadcrumb, Flex } from "@chakra-ui/react";
import profilePicPlaceholder from "@/assets/images/avatar.svg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PenBox } from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { SkeletonCircle } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyGetUserQuery } from "@/app/api/userApi";
import { useEditVendorProfileMutation } from "@/app/api/vendorApi";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  businessName: z.string("businessName must be a string"),
  street: z.string("Street must be a string"),
  mapUrl: z.string("MapUrl must be a string"),
  whatsappNum: z.string("WhatsApp number must be a string"),
  landlineNum: z.string("Landline number must be a string"),
  mobileNum: z.string("Mobile number must be a string"),
  fleetSize: z.coerce.number({
    required_error: "FleetSize is required",
    invalid_type_error: "FleetSize must be a number",
  }),
  ijariCertificate: z.any().optional(),
  tradeLicense: z.any().optional(),
  vatCertificate: z.any().optional(),
  noc: z.any().optional(),
  emiratesId: z.any().optional(),
  poa: z.any().optional(),
  profilePicture: z.any().optional(),
});

const EditVendorProfile = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { id: vendorId } = useParams();
  const [
    fetchVendorProfile,
    { data: vendorProfile, isFetching: vendorFetching },
  ] = useLazyGetUserQuery();

  const [updateProfile, { isFetching: profileEditing }] =
    useEditVendorProfileMutation();

  const imageRef = useRef(null);

  useEffect(() => {
    console.log("VendorProfile:params", vendorId);

    if (vendorId) {
      fetchVendorProfile(vendorId);
    }
  }, [vendorId, location.search]);

  useEffect(() => {
    console.log("VendorProfile:", vendorProfile);
  }, [vendorProfile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: vendorProfile?.data?.name || "",
      email: vendorProfile?.data?.email || "",
      businessName: vendorProfile?.data?.businessName || "",
      street: vendorProfile?.data?.address?.street || "",
      mapUrl: vendorProfile?.data?.address?.mapUrl || "",
      whatsappNum: vendorProfile?.data?.contact?.whatsappNum || "",
      landlineNum: vendorProfile?.data?.contact?.landlineNum || "",
      mobileNum: vendorProfile?.data?.contact?.mobileNum || "",
      fleetSize: vendorProfile?.data?.vendorInformation?.fleetSize || "",
      profilePicture: vendorProfile?.data?.profilePicture || null, // ✅ only once
      ijariCertificate: null,
      tradeLicense: null,
      vatCertificate: null,
      noc: null,
      emiratesId: null,
      poa: null,
    },
  });

  useEffect(() => {
    if (vendorProfile) {
      reset({
        name: vendorProfile?.data?.name || "",
        email: vendorProfile?.data?.email || "",
        businessName: vendorProfile?.data?.businessName || "",
        street: vendorProfile?.data?.address?.street || "",
        mapUrl: vendorProfile?.data?.address?.mapUrl || "",
        whatsappNum: vendorProfile?.data?.contact?.whatsappNum || "",
        landlineNum: vendorProfile?.data?.contact?.landlineNum || "",
        mobileNum: vendorProfile?.data?.contact?.mobileNum || "",
        fleetSize: vendorProfile?.data?.vendorInformation?.fleetSize || "",
        profilePicture: vendorProfile?.data?.profilePicture || null, // ✅ only once
        ijariCertificate: null,
        tradeLicense: null,
        vatCertificate: null,
        noc: null,
        emiratesId: null,
        poa: null,
      });
    }
  }, [vendorProfile, reset]);

  const handleProfilePicSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl); // store preview URL
    }
  };

  const onSubmit = async (data) => {
    console.log("VendorProfile:submittedData", data);
    const formData = new FormData();

    // ✅ Flatten Step 1 fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("vendorId", vendorId);
    if (data.businessName) formData.append("businessName", data.businessName);

    if (data.street) formData.append("street", data.street);
    if (data.mapUrl) formData.append("mapUrl", data.mapUrl);

    if (data.mobileNum) formData.append("mobileNum", data.mobileNum);
    if (data.whatsappNum) formData.append("whatsappNum", data.whatsappNum);
    if (data.landlineNum) formData.append("landlineNum", data.landlineNum);

    // ✅ Step 2 fields
    if (data.fleetSize) formData.append("fleetSize", data.fleetSize);
    if (data.ijariCertificate?.[0])
      formData.append("ijariCertificate", data.ijariCertificate[0]);
    if (data.tradeLicense?.[0])
      formData.append("tradeLicense", data.tradeLicense[0]);
    if (data.vatCertificate?.[0])
      formData.append("vatCertificate", data.vatCertificate[0]);
    if (data.noc?.[0]) formData.append("noc", data.noc[0]);
    if (data.emiratesId?.[0]) formData.append("emiratesId", data.emiratesId[0]);
    if (data.poa?.[0]) formData.append("poa", data.poa[0]);
    if (data.profilePicture?.[0])
      formData.append("profilePicture", data.profilePicture[0]);

    toaster.promise(updateProfile(formData).unwrap(), {
      loading: { title: "Submitting", description: "Please wait..." },
      success: (res) => {
        setTimeout(() => {
          navigate(`/vendors/view/${vendorId}`);
        }, 1000);

        return {
          title: res?.message || "Profile updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error updating profile",
          description: "",
        };
      },
    });
  };

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
            <Breadcrumb.CurrentLink>Edit Vendor Profile</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div className={`${styles.page} mt-[30px]`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`${styles.card} ${styles.editMode} max-w-[750px] md:min-w-[750px]`}
          >
            {/* Header */}
            <div className={styles.header}>
              <div
                className={`relative group overflow-hidden ${styles.avatar}`}
              >
                {vendorFetching ? (
                  <SkeletonCircle height="100%" width="100%" variant="shine" />
                ) : (
                  <img
                    src={
                      preview ??
                      (vendorProfile?.data?.profilePicture
                        ? `${
                            vendorProfile.data.profilePicture?.url
                          }?t=${Date.now()}`
                        : profilePicPlaceholder)
                    }
                    alt="Profile"
                    className={`h-full w-full ${styles.avatarPhoto}`}
                  />
                )}
                <Box
                  justify="center"
                  alignItems="center"
                  className="opacity-0 group-hover:opacity-100 transition cursor-pointer flex justify-center items-center h-[30%] w-full bg-[#202020c4] absolute bottom-[0px]"
                  onClick={() => imageRef.current?.click()}
                >
                  <PenBox color="#fff" size="15px" />
                </Box>
                <input
                  type="file"
                  {...register("profilePicture", {
                    onChange: (e) => handleProfilePicSelect(e),
                  })}
                  ref={(e) => {
                    register("profilePicture").ref(e);
                    imageRef.current = e;
                  }}
                  className="hidden"
                />
              </div>

              <div className={`styles.headerText`}>
                <input
                  type="text"
                  {...register("businessName")}
                  className={styles.inputEdit}
                />
                <div className="text-red-600">
                  {errors?.businessName?.message}
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`${styles.inputEdit} block w-full !md:w-[350px]`}
                />
                <div className="text-red-600">{errors?.email?.message}</div>
              </div>
            </div>

            {/* Basic Information */}
            <div className={styles.section}>
              <h3>Basic Information</h3>
              <Box
                display={{ base: "block", md: "flex" }}
                className={`${styles.infoRow}`}
              >
                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Vendor Admin Name</strong>
                  <input
                    type="text"
                    {...register("name")}
                    className={`${styles.inputEdit} block w-full !md:w-[350px]`}
                  />
                  <div className="text-red-600">{errors?.name?.message}</div>
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Fleet Size</strong>
                  <input
                    type="text"
                    {...register("fleetSize")}
                    className={styles.inputEdit}
                  />
                  <div className="text-red-600">
                    {errors?.fleetSize?.message}
                  </div>
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Mobile Number</strong>
                  <input
                    type="text"
                    {...register("mobileNum")}
                    className={styles.inputEdit}
                  />
                  <div className="text-red-600">
                    {errors?.mobileNum?.message}
                  </div>
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>WhatsApp</strong>
                  <input
                    type="text"
                    {...register("whatsappNum")}
                    className={styles.inputEdit}
                  />
                  <div className="text-red-600">
                    {errors?.whatsappNum?.message}
                  </div>
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Landline</strong>
                  <input
                    type="text"
                    {...register("landlineNum")}
                    className={styles.inputEdit}
                  />
                  <div className="text-red-600">
                    {errors?.landlineNum?.message}
                  </div>
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
                          <input
                            type="text"
                            {...register(field)}
                            className={`${styles.inputEdit} ${
                              !["mapUrl", "street"].includes(field)
                                ? "bg-[#00000023]"
                                : "bg-[transparent]"
                            }`}
                            readOnly={!["mapUrl", "street"].includes(field)}
                          />
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
                flexDirection={{ base: "column", md: "row" }}
                flexWrap="wrap"
                gap="20px"
                mt="30px"
              >
                <div className={styles.infoItem}>
                  <strong>Ijari Certificate</strong>
                  <input
                    type="file"
                    {...register("ijariCertificate")}
                    className={styles.inputEdit}
                  />
                </div>

                <div className={styles.infoItem}>
                  <strong>Trade License</strong>
                  <input
                    type="file"
                    {...register("tradeLicense")}
                    className={styles.inputEdit}
                  />
                </div>

                <div className={styles.infoItem}>
                  <strong>Vat Certificate</strong>
                  <input
                    type="file"
                    {...register("vatCertificate")}
                    className={styles.inputEdit}
                  />
                </div>

                <div className={styles.infoItem}>
                  <strong>NOC</strong>
                  <input
                    type="file"
                    {...register("noc")}
                    className={styles.inputEdit}
                  />
                </div>

                <div className={styles.infoItem}>
                  <strong>Emirates ID</strong>
                  <input
                    type="file"
                    {...register("emiratesId")}
                    className={styles.inputEdit}
                  />
                </div>

                <div className={styles.infoItem}>
                  <strong>POA</strong>
                  <input
                    type="file"
                    {...register("poa")}
                    className={styles.inputEdit}
                  />
                </div>
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
              <button
                type="submit"
                className={`${styles.editBtn} ${styles.saveBtn} sm:!w-full md:!w-auto`}
              >
                Save
              </button>
            </Flex>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditVendorProfile;
