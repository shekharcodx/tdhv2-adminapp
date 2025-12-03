import { Box, Button, Heading, Input } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useUpdateVendorSubscriptionMutation,
  useGetAllVendorsQuery,
} from "@/app/api/vendorApi";
import { toaster } from "@/components/ui/toaster";

const Subscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetAllVendorsQuery({ page: 1, search: "" });
  const [updateVendorSubscription, { isLoading }] =
    useUpdateVendorSubscriptionMutation();

  const [subscriptionCharges, setSubscriptionCharges] = useState("");

  useEffect(() => {
    if (!data?.vendors?.docs) return;

    const vendor = data.vendors.docs.find((v) => v._id === id);
    if (vendor) {
      setSubscriptionCharges(vendor.subscriptionCharges || "");
    }
  }, [data, id]);

  const handleUpdate = async () => {
    if (!subscriptionCharges) {
      return toaster.error({ title: "Please enter subscription amount" });
    }

    toaster.promise(
      updateVendorSubscription({
        id,
        subscriptionCharges: Number(subscriptionCharges),
      }).unwrap(),
      {
        loading: { title: "Updating subscription..." },
        success: { title: "Subscription updated successfully!" },
        error: { title: "Failed to update subscription" },
      }
    );
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt="40px"
      p="30px"
      borderRadius="14px"
      bg="linear-gradient(135deg, #fafafa, #f0f0f0)"
      border="1px solid #cecccd"
      boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    >
      <Heading fontSize="24px" mb="20px" color="#27343a" fontWeight="700">
        Subscription
      </Heading>

      <label
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#5b787c",
        }}
      >
        Subscription Charges (AED)
      </label>

      <Input
        mt="8px"
        type="number"
        value={subscriptionCharges}
        onChange={(e) => setSubscriptionCharges(e.target.value)}
        placeholder="Enter amount"
        borderColor="#cecccd"
        focusBorderColor="#89b4bc"
        _placeholder={{ color: "#7d8c90" }}
      />

      <Button
        mt="20px"
        width="100%"
        bg="#5b787c"
        color="#ffffff"
        _hover={{ bg: "#89b4bc" }}
        _active={{ bg: "#46818a" }}
        isLoading={isLoading}
        onClick={handleUpdate}
        borderRadius="10px"
      >
        Update
      </Button>

      <Button
        mt="10px"
        width="100%"
        variant="ghost"
        color="#27343a"
        _hover={{ bg: "#efeeea" }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  );
};

export default Subscription;
