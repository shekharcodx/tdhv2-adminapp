import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  useGetCarBrandQuery,
  useAddCarModelsMutation,
} from "@/app/api/carMasterDataApi";
import { z } from "zod";
import { toaster } from "@/components/ui/toaster";

const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
    })
  ),
  brandId: z.string().min(1, "Brand is required"),
});

const CarModelCreation = ({ isOpen, setIsOpen }) => {
  const { data: carBrands } = useGetCarBrandQuery(undefined, {
    skip: !isOpen,
  });
  const [addModels, { isLoading }] = useAddCarModelsMutation();
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ name: "", brandId: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data) => {
    const payload = {
      names: data.items.map((item) => item.name),
      brandId: data.brandId,
    };
    toaster.promise(addModels(payload).unwrap(), {
      loading: { title: "Adding model(s)", description: "Please wait..." },
      success: (res) => {
        reset();
        setIsOpen(false);
        return {
          title: res?.message || "Model(s) added successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.err?.message || "Error adding model(s)",
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
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>ADD CAR MODELS</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form
                id="brand-form"
                onSubmit={handleSubmit(onSubmit)}
                className="max-h-[70vh] overflow-y-auto scrollbar-thin
                         scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full
                        hover:scrollbar-thumb-gray-500 scrollbar-track-gray-100"
              >
                <Box>
                  <label className="text-black text-[16px] font-semibold">
                    Select Brand
                  </label>
                  <select
                    {...register(`brandId`)}
                    className="w-full border rounded-lg px-3 py-3 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
                  >
                    <option value="">Select Brand</option>
                    {carBrands?.carBrands?.map((brand, i) => (
                      <option key={i} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors?.brandId && (
                    <p className="text-red-500 text-sm">
                      {errors?.brandId?.message}
                    </p>
                  )}
                </Box>
                <Box className="border border-black border-dashed py-8 pt-0 mt-6 px-6 rounded-xl">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <Box mt="20px">
                        <label className="text-black text-[16px] font-semibold">
                          Model Name
                        </label>
                        <input
                          type="text"
                          placeholder="Name"
                          {...register(`items.${index}.name`)}
                          className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
                        />
                        {errors.items?.[index]?.name && (
                          <p className="text-red-500 text-sm">
                            {errors.items[index].name?.message}
                          </p>
                        )}
                      </Box>
                      <Flex justifyContent="end">
                        <Button
                          type="button"
                          mt="15px"
                          size="xs"
                          bg="red"
                          display={index === 0 ? "none" : "block"}
                          onClick={() => remove(index)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </div>
                  ))}
                </Box>
              </form>
            </Dialog.Body>
            <Dialog.Footer justifyContent="space-between">
              <Button
                type="button"
                size="sm"
                variant="surface"
                onClick={() => append({ name: "", logo: undefined })}
                disabled={isLoading}
              >
                Add More
              </Button>
              <Flex gap="10px">
                <Dialog.ActionTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  type="submit"
                  form="brand-form"
                  bg="var(--gradient-background)"
                  size="sm"
                  disabled={isLoading}
                >
                  Submit
                </Button>
              </Flex>
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

export default CarModelCreation;
