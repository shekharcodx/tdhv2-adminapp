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
import { z } from "zod";
import { toaster } from "@/components/ui/toaster";

const Create = ({
  isOpen,
  setIsOpen,
  fieldName = "name",
  title,
  fieldTitle,
  payloadTitle = "names",
  addApi,
  isLoading,
  fieldType = "text",
  validationRule = z.string().min(1, `${fieldTitle} is required`),
}) => {
  const schema = z.object({
    items: z.array(
      z.object({
        [fieldName]: validationRule,
      })
    ),
  });
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ [fieldName]: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data) => {
    const payload = {
      [payloadTitle]: data.items.map((item) => item[fieldName]),
    };
    toaster.promise(addApi(payload).unwrap(), {
      loading: { title: `Adding ${fieldTitle}`, description: "Please wait..." },
      success: (res) => {
        reset();
        setIsOpen(false);
        return {
          title: res?.message || `${fieldTitle} added successfully`,
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.err?.message || `Error adding ${fieldTitle}`,
          description: "Please try again",
        };
      },
    });
  };

  const formId = `${fieldName}-form`;

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
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form
                id={formId}
                onSubmit={handleSubmit(onSubmit)}
                className="max-h-[70vh] overflow-y-auto scrollbar-thin
                         scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full
                        hover:scrollbar-thumb-gray-500 scrollbar-track-gray-100"
              >
                <Box className="border border-black border-dashed py-8 pt-0 mt-6 px-6 rounded-xl">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <Box mt="20px">
                        <label className="text-black text-[16px] font-semibold">
                          {fieldTitle}
                        </label>
                        <input
                          type={fieldType}
                          placeholder={fieldTitle}
                          {...register(`items.${index}.${fieldName}`)}
                          className="w-full border rounded-lg px-3 py-2 mt-2 outline-none border-[rgba(91, 120, 124, 1)]"
                        />
                        {errors.items?.[index]?.[fieldName] && (
                          <p className="text-red-500 text-sm">
                            {errors.items[index]?.[fieldName]?.message}
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
                onClick={() => append({ [fieldName]: "" })}
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
                  form={formId}
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

export default Create;
