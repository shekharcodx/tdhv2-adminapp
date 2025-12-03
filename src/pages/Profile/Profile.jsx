import { useEffect, useRef, useState } from "react";
import styles from "./VendorProfile.module.css";
import { Box, Flex } from "@chakra-ui/react";
import {
  useGetProfileQuery,
  useUpdateCurrentProfileMutation,
} from "@/app/api/profileApi";
import profilePicPlaceholder from "@/assets/images/avatar.svg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PenBox } from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  whatsappNum: z.string("WhatsApp number must be a string"),
  landlineNum: z.string("Landline number must be a string"),
  mobileNum: z.string("Mobile number must be a string"),
  profilePicture: z.any().optional(),
});

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const { data: profileData, isFetching } = useGetProfileQuery({
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  const [updateProfile] = useUpdateCurrentProfileMutation();
  const imageRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profileData?.data?.name || "",
      email: profileData?.data?.email || "",
      whatsappNum: profileData?.data?.contact?.whatsappNum || "",
      landlineNum: profileData?.data?.contact?.landlineNum || "",
      mobileNum: profileData?.data?.contact?.mobileNum || "",
      profilePicture: profileData?.data?.profilePicture || null,
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData?.data?.name || "",
        email: profileData?.data?.email || "",
        whatsappNum: profileData?.data?.contact?.whatsappNum || "",
        landlineNum: profileData?.data?.contact?.landlineNum || "",
        mobileNum: profileData?.data?.contact?.mobileNum || "",
        profilePicture: profileData?.data?.profilePicture || null, // ✅ only once
      });
    }
  }, [profileData, reset]);

  useEffect(() => {
    console.log("VendorProfile:errors", errors);
  }, [errors]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

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

    if (data.mobileNum) formData.append("mobileNum", data.mobileNum);
    if (data.whatsappNum) formData.append("whatsappNum", data.whatsappNum);
    if (data.landlineNum) formData.append("landlineNum", data.landlineNum);
    if (data.profilePicture?.[0])
      formData.append("profilePicture", data.profilePicture[0]);

    toaster.promise(updateProfile(formData).unwrap(), {
      loading: { title: "Submitting", description: "Please wait..." },
      success: (res) => {
        toggleEdit();
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
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`${styles.card} ${
            isEditing ? styles.editMode : styles.viewMode
          } max-w-[750px] md:min-w-[750px]`}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={`relative group overflow-hidden ${styles.avatar}`}>
              {isFetching ? (
                <SkeletonCircle height="100%" width="100%" variant="shine" />
              ) : (
                <img
                  src={
                    preview ??
                    (profileData?.data?.profilePicture
                      ? `${profileData.data.profilePicture}?t=${Date.now()}`
                      : profilePicPlaceholder)
                  }
                  alt="Profile"
                  className={`h-full w-full ${styles.avatarPhoto}`}
                />
              )}
              {isEditing && (
                <Box
                  justify="center"
                  alignItems="center"
                  className="opacity-0 group-hover:opacity-100 transition cursor-pointer flex justify-center items-center h-[30%] w-full bg-[#202020c4] absolute bottom-[0px]"
                  onClick={() => imageRef.current?.click()}
                >
                  <PenBox color="#fff" size="15px" />
                </Box>
              )}
              <input
                type="file"
                {...register("profilePicture", {
                  onChange: (e) => handleProfilePicSelect(e),
                })}
                ref={(e) => {
                  register("profilePicture").ref(e); // connect to react-hook-form
                  imageRef.current = e; // keep your own ref
                }}
                className="hidden"
              />
            </div>

            <div className={`styles.headerText`}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    {...register("name")}
                    className={`${styles.inputEdit} block w-full !md:w-[350px]`}
                  />
                  <div className="text-red-600">{errors?.name?.message}</div>
                  <input
                    type="email"
                    {...register("email")}
                    readOnly={true}
                    className={`${styles.inputEdit} block w-full !md:w-[350px] bg-[#e0dfdf]`}
                  />
                  <div className="text-red-600">{errors?.email?.message}</div>
                </>
              ) : (
                <>
                  {isFetching ? (
                    <Skeleton variant="shine" width="200px" height="15px" />
                  ) : (
                    <h2 className={styles.name}>{profileData?.data?.name}</h2>
                  )}
                  {isFetching ? (
                    <Skeleton
                      variant="shine"
                      width="200px"
                      height="15px"
                      mt="10px"
                    />
                  ) : (
                    <p className={styles.infoItem}>
                      {profileData?.data?.email}
                    </p>
                  )}
                </>
              )}
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
                <strong>Mobile Number</strong>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("mobileNum")}
                      className={styles.inputEdit}
                    />
                    <div className="text-red-600">
                      {errors?.mobileNum?.message}
                    </div>
                  </>
                ) : isFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  profileData?.data?.contact?.mobileNum || "N/A"
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>WhatsApp</strong>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("whatsappNum")}
                      className={styles.inputEdit}
                    />
                    <div className="text-red-600">
                      {errors?.whatsappNum?.message}
                    </div>
                  </>
                ) : isFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  profileData?.data?.contact?.whatsappNum || "N/A"
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>Landline</strong>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("landlineNum")}
                      className={styles.inputEdit}
                    />
                    <div className="text-red-600">
                      {errors?.landlineNum?.message}
                    </div>
                  </>
                ) : isFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  profileData?.data?.contact?.landlineNum || "N/A"
                )}
              </Box>
            </Box>
          </div>

          {/* Address */}
          {/* <div className={styles.section}>
            <h3>Address</h3>
            <Box
              display={{ base: "block", md: "flex" }}
              className={styles.infoRow}
            >
              {Object.entries(profileData?.data?.address ?? {}).map(
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
                        {isEditing ? (
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
                        ) : field === "mapUrl" ? (
                          <a
                            href={`https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Map
                          </a>
                        ) : isFetching ? (
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
          </div> */}

          {/* Documents */}
          {/* <div className={styles.section}>
            <h3>Vendor Documents</h3>
            <Flex
              className={`${styles.infoRow}`}
              justify={{ base: "center", md: "space-between" }}
              flexWrap="wrap"
              gap="20px"
              mt="30px"
            >
              {!isEditing ? (
                isFetching ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <DocumentCardSkeleton key={i} />
                  ))
                ) : (
                  Object.entries(
                    profileData?.data?.vendorInformation?.documents ?? {}
                  ).map(([key, value], index) => (
                    <DocumentCard key={index} doc={{ key, value }} />
                  ))
                )
              ) : (
                <>
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
                </>
              )}
            </Flex>
          </div> */}

          <Flex
            justify={{ base: "center", md: "space-between" }}
            gap={{ base: "20px", md: "0px" }}
            mt="20px"
          >
            <div
              className={`${styles.editBtn} !border !border-[#5b787c] !text-[#5b787c] cursor-pointer text-center sm:!w-full md:!w-auto`}
              onClick={() => (isEditing ? toggleEdit() : navigate(-1))}
            >
              Back
            </div>
            {!isEditing ? (
              <div
                className={`${styles.editBtn} ${styles.editModeBtn} cursor-pointer text-center sm:!w-full md:!w-auto`}
                onClick={toggleEdit}
              >
                Edit
              </div>
            ) : (
              <button
                type="submit"
                className={`${styles.editBtn} ${styles.saveBtn} sm:!w-full md:!w-auto`}
              >
                Save
              </button>
            )}
          </Flex>
        </div>
      </form>
    </div>
  );
};

export default Profile;
