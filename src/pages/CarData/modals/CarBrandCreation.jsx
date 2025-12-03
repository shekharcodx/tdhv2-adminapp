import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Input,
  Portal,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddCarBrandMutation } from "@/app/api/carMasterDataApi";
import { z } from "zod";
import { toaster } from "@/components/ui/toaster";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Logo is required",
    })
    .optional(),
});

const CarBrandCreation = ({ isOpen, setIsOpen }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [addBrand, { isLoading }] = useAddCarBrandMutation();

  const onSubmit = (data) => {
    console.log("CarBrandCreation:", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo[0]);

    toaster.promise(addBrand(formData).unwrap(), {
      loading: { title: "Adding brand", description: "Please wait..." },
      success: (res) => {
        reset();
        setIsOpen(false);
        return {
          title: res?.message || "Brand added successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error adding brand",
          description: "Please try again",
        };
      },
    });
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      key="md"
      size="md"
      placement="center"
      closeOnInteractOutside={false}
    >
      <Portal>
        <Dialog.Backdrop zIndex="9999" />
        <Dialog.Positioner zIndex="9999">
          <Dialog.Content px="24px" pb="20px">
            <Dialog.Header>
              <Dialog.Title>ADD CAR BRAND</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="0px">
              <form
                id="brand-form"
                onSubmit={handleSubmit(onSubmit)}
                className=""
              >
                <Box className="py-8 pt-6 rounded-xl">
                  <Box mb="20px">
                    <label className="text-black text-[16px] font-semibold">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Name"
                      {...register("name")}
                      className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
                    />
                    {errors?.name && (
                      <p className="text-red-500 text-sm">
                        {errors?.name?.message}
                      </p>
                    )}
                  </Box>

                  <Box>
                    <label className="text-black text-[16px] font-semibold">
                      Logo
                    </label>
                    <Input
                      type="file"
                      {...register("logo")}
                      className="w-full border rounded-lg px-3 py-3 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
                    />
                    {errors?.logo && (
                      <p className="text-red-500 text-sm">
                        {errors?.logo?.message}
                      </p>
                    )}
                  </Box>
                </Box>
              </form>
            </Dialog.Body>
            <Dialog.Footer justifyContent="space-between">
              <Dialog.ActionTrigger asChild>
                <Button
                  disabled={isLoading}
                  size="md"
                  variant="outline"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="brand-form"
                bg="var(--gradient-background)"
                size="md"
                disabled={isLoading}
              >
                Submit
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={() => reset()} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CarBrandCreation;
