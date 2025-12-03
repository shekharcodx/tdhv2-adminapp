import { useEffect, useRef } from "react";
import styles from "./AdminProfile.module.css";
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
import { useEditAdminProfileMutation } from "@/app/api/adminApi";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  whatsappNum: z.string("WhatsApp number must be a string"),
  landlineNum: z.string("Landline number must be a string"),
  mobileNum: z.string("Mobile number must be a string"),
  profilePicture: z.any().optional(),
});

const EditAdminProfile = () => {
  const navigate = useNavigate();
  const { id: adminId } = useParams();
  const [fetchAdminProfile, { data: adminProfile, isFetching: adminFetching }] =
    useLazyGetUserQuery();

  const [updateProfile, { isFetching: profileEditing }] =
    useEditAdminProfileMutation();

  const imageRef = useRef(null);

  useEffect(() => {
    console.log("AdminProfile:params", adminId);

    if (adminId) {
      fetchAdminProfile(adminId);
    }
  }, [adminId, location.search]);

  useEffect(() => {
    console.log("AdminProfile:", adminProfile);
  }, [adminProfile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: adminProfile?.data?.name || "",
      email: adminProfile?.data?.email || "",
      whatsappNum: adminProfile?.data?.contact?.whatsappNum || "",
      landlineNum: adminProfile?.data?.contact?.landlineNum || "",
      mobileNum: adminProfile?.data?.contact?.mobileNum || "",
      profilePicture: adminProfile?.data?.profilePicture || null, // ✅ only once
    },
  });

  useEffect(() => {
    if (adminProfile) {
      reset({
        name: adminProfile?.data?.name || "",
        email: adminProfile?.data?.email || "",
        whatsappNum: adminProfile?.data?.contact?.whatsappNum || "",
        landlineNum: adminProfile?.data?.contact?.landlineNum || "",
        mobileNum: adminProfile?.data?.contact?.mobileNum || "",
        profilePicture: adminProfile?.data?.profilePicture || null,
      });
    }
  }, [adminProfile, reset]);

  useEffect(() => {
    console.log("adminProfile:errors", errors);
  }, [errors]);

  const onSubmit = async (data) => {
    console.log("adminProfile:submittedData", data);
    const formData = new FormData();

    // ✅ Flatten Step 1 fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("adminId", adminId);

    if (data.mobileNum) formData.append("mobileNum", data.mobileNum);
    if (data.whatsappNum) formData.append("whatsappNum", data.whatsappNum);
    if (data.landlineNum) formData.append("landlineNum", data.landlineNum);
    if (data.profilePicture?.[0])
      formData.append("profilePicture", data.profilePicture[0]);

    toaster.promise(updateProfile(formData).unwrap(), {
      loading: { title: "Submitting", description: "Please wait..." },
      success: (res) => {
        setTimeout(() => {
          navigate(`/admin-profile/${adminId}`);
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
              onClick={() => navigate("/admins")}
            >
              Admins List
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Edit Admin Profile</Breadcrumb.CurrentLink>
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
                {adminFetching ? (
                  <SkeletonCircle height="100%" width="100%" variant="shine" />
                ) : (
                  <img
                    src={
                      adminProfile?.data?.profilePicture
                        ? `${
                            adminProfile.data.profilePicture?.url
                          }?t=${Date.now()}`
                        : profilePicPlaceholder
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
                  {...register("profilePicture")}
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
                  {...register("name")}
                  className={`${styles.inputEdit} block !w-[350px]`}
                />
                <div className="text-red-600">{errors?.name?.message}</div>
                <input
                  type="email"
                  {...register("email")}
                  className={`${styles.inputEdit} block !w-[350px]`}
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

            <Flex
              justifyContent={{ base: "center", md: "space-between" }}
              gap="20px"
              mt="20px"
            >
              <div
                className={`${styles.backBtn} cursor-pointer text-center sm:!w-full md:!w-auto`}
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

export default EditAdminProfile;
