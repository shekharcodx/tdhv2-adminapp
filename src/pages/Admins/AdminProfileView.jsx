import { useEffect } from "react";
import styles from "./AdminProfile.module.css";
import { Box, Breadcrumb, Flex } from "@chakra-ui/react";
import profilePicPlaceholder from "@/assets/images/avatar.svg";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyGetUserQuery } from "@/app/api/userApi";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { id: adminId } = useParams();
  const [fetchAdminProfile, { data: adminProfile, isFetching: adminFetching }] =
    useLazyGetUserQuery();

  useEffect(() => {
    console.log("AdminProfile:params", adminId);

    if (adminId) {
      fetchAdminProfile(adminId);
    }
  }, [adminId, location.search]);

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
            <Breadcrumb.CurrentLink>Admin Profile</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div className={`${styles.page} mt-[30px]`}>
        <div
          className={`${styles.card} ${styles.viewMode} max-w-[750px] md:min-w-[750px]`}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={`relative group overflow-hidden ${styles.avatar}`}>
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
            </div>

            <div className={`styles.headerText`}>
              <>
                {adminFetching ? (
                  <Skeleton variant="shine" width="200px" height="15px" />
                ) : (
                  <h2 className={styles.name}>{adminProfile?.data?.name}</h2>
                )}
                {adminFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  <p className={styles.infoItem}>{adminProfile?.data?.email}</p>
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
                <strong>Mobile Number</strong>
                {adminFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  adminProfile?.data?.contact?.mobileNum || "NA"
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>WhatsApp</strong>
                {adminFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  adminProfile?.data?.contact?.whatsappNum || "NA"
                )}
              </Box>

              <Box marginBottom={{ base: "20px" }} className={styles.infoItem}>
                <strong>Landline</strong>
                {adminFetching ? (
                  <Skeleton
                    variant="shine"
                    width="200px"
                    height="15px"
                    mt="10px"
                  />
                ) : (
                  adminProfile?.data?.contact?.landlineNum || "NA"
                )}
              </Box>
            </Box>
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
              onClick={() => navigate(`/admins/edit/${adminId}`)}
            >
              Edit Profile
            </div>
          </Flex>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
