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
  useGetAllCarModelsQuery,
  useAddCarTrimsMutation,
} from "@/app/api/carMasterDataApi";
import { z } from "zod";
import { toaster } from "@/components/ui/toaster";

const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
    })
  ),
  modelId: z.string().min(1, "Model is required"),
});

const CarTrimCreation = ({ isOpen, setIsOpen }) => {
  const { data: carModel } = useGetAllCarModelsQuery(undefined, {
    skip: !isOpen,
  });
  const [addTrims, { isLoading }] = useAddCarTrimsMutation();
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ name: "", modelId: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data) => {
    const payload = {
      names: data.items.map((item) => item.name),
      modelId: data.modelId,
    };
    console.log("CarTrimCreation:", { payload });
    toaster.promise(addTrims(payload).unwrap(), {
      loading: { title: "Adding trim(s)", description: "Please wait..." },
      success: (res) => {
        reset();
        setIsOpen(false);
        return {
          title: res?.message || "Trim(s) added successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.err?.message || "Error adding trim(s)",
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
              <Dialog.Title>ADD CAR TRIMS</Dialog.Title>
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
                    Select Model
                  </label>
                  <select
                    {...register(`modelId`)}
                    className="w-full border rounded-lg px-3 py-3 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
                  >
                    <option value="">Select Model</option>
                    {carModel?.models?.map((model, i) => (
                      <option key={i} value={model._id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  {errors?.modelId && (
                    <p className="text-red-500 text-sm">
                      {errors?.modelId?.message}
                    </p>
                  )}
                </Box>
                <Box className="border border-black border-dashed py-8 pt-0 mt-6 px-6 rounded-xl">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <Box mt="20px">
                        <label className="text-black text-[16px] font-semibold">
                          Trim
                        </label>
                        <input
                          type="text"
                          placeholder="Trim"
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

export default CarTrimCreation;
