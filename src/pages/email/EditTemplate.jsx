import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  Portal,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./Email.module.css";
import { Editor } from "@tinymce/tinymce-react";
import {
  useLazyGetTemplateQuery,
  useUpdateTemplateMutation,
} from "@/app/api/emailApi";
import { toaster } from "@/components/ui/toaster";

const EditTemplate = ({ isOpen, templateId, setIsOpen, setTemplateId }) => {
  const [loading, setLoading] = useState(true);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [getTemplate, { data: emailTemplate, isFetching }] =
    useLazyGetTemplateQuery();

  const [updateTemplate, { isLoading }] = useUpdateTemplateMutation();

  useEffect(() => {
    if (templateId) {
      getTemplate(templateId);
    }
  }, [getTemplate, isOpen, templateId]);

  useEffect(() => {
    if (emailTemplate?.success) {
      reset({
        name: emailTemplate.data?.name,
        subject: emailTemplate.data?.subject,
        body: emailTemplate.data?.body,
      });
    }
  }, [emailTemplate, reset, loading]);

  const editorConfig = {
    height: 350,
    width: "70%",
    menubar: false,
    branding: false,
    plugins: ["lists", "link", "autolink", "code"],
    toolbar:
      "undo redo | bold italic underline | bullist numlist | link | code",
    content_style: `
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
        `,
    forced_root_block: "div",
    cleanup: true,
    valid_elements: "*[*]",
    setup: (editor) => {
      editor.on("init", () => {
        setLoading(false);
      });
    },
  };

  const onSubmit = (data) => {
    toaster.promise(
      updateTemplate({
        templateId,
        payload: {
          ...data,
          description: emailTemplate.data.description,
          isActive: emailTemplate.data.isActive,
        },
      }).unwrap(),
      {
        loading: { title: "Updating template...", description: "Please wait" },
        success: (res) => {
          closeDialog();
          return {
            title: res.message || "Template updated successfully",
            description: "",
          };
        },
        error: (err) => {
          return {
            title: err.data.error || "Failed updating template",
            description: "Please try again",
          };
        },
      }
    );
  };

  const closeDialog = () => {
    setIsOpen(false);
    setTemplateId(false);
    setLoading(true);
    reset({
      name: "",
      subject: "",
      body: "",
    });
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={(e) => {
        setIsOpen(e.open);
        setTemplateId("");
      }}
      size="cover"
      placement="center"
      motionPreset="slide-in-bottom"
      closeOnInteractOutside={false}
    >
      <Portal>
        <Dialog.Backdrop zIndex={999999} />
        <Dialog.Positioner zIndex={9999991}>
          <Dialog.Content maxH="100vh" overflowY="auto">
            <Dialog.Header>
              <Dialog.Title>Email Template</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body py="20px" px="50px">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`${styles.formGroup} mt-[20px]`}>
                  <label htmlFor="tempName" className={styles.label}>
                    Template Name
                  </label>
                  {isFetching ? (
                    <Skeleton height="40px" mt="2" borderRadius="8px" />
                  ) : (
                    <input
                      type="text"
                      id="tempName"
                      {...register("name")}
                      className={`${styles.inputField} !bg-slate-200 focus:!border-[#cecccd] !shadow-none`}
                      readOnly
                    />
                  )}
                  {errors.name && (
                    <span className={styles.errorMsg}>
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className={`${styles.formGroup} mt-[20px]`}>
                  <label htmlFor="subject" className={styles.label}>
                    Email Subject
                  </label>
                  {isFetching ? (
                    <Skeleton height="40px" mt="2" borderRadius="8px" />
                  ) : (
                    <input
                      type="text"
                      id="subject"
                      {...register("subject")}
                      className={styles.inputField}
                      placeholder="Please enter subject"
                    />
                  )}
                  {errors.subject && (
                    <span className={styles.errorMsg}>
                      {errors.subject.message}
                    </span>
                  )}
                </div>

                <div className={`${styles.formGroup} mt-[20px]`}>
                  <label htmlFor="body" className={styles.label}>
                    Email Body
                  </label>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                    gap="10px"
                  >
                    {isFetching && loading ? (
                      <Skeleton height="350px" flex="1" borderRadius="8px" />
                    ) : (
                      <Controller
                        id="body"
                        control={control}
                        name="body"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                          <Editor
                            apiKey="hr4d98hft4vgilhryg30rqvi4fatzzzesziciokd2u7fu5gj"
                            value={value}
                            onEditorChange={(content) => onChange(content)}
                            init={editorConfig}
                          />
                        )}
                      />
                    )}
                    {errors.body && (
                      <span className={styles.errorMsg}>
                        {errors.body.message}
                      </span>
                    )}
                    <Box w="28%">
                      <Heading
                        fontSize="16px"
                        borderBottom="1px solid #c7c7c7ff"
                      >
                        Available Placeholders
                      </Heading>
                      {isFetching ? (
                        <SkeletonText mt="2" noOfLines={5} spacing="4" />
                      ) : (
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left mt-2">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Placeholder
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {emailTemplate?.success ? (
                              Object.entries(
                                emailTemplate.data.placeholders
                              ).map(([key, val], index) => (
                                <tr
                                  key={key}
                                  className={
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-50 hover:bg-gray-100 transition-colors"
                                  }
                                >
                                  <td className="px-4 py-2 text-gray-800">
                                    {key}
                                  </td>
                                  <td className="px-4 py-2 text-gray-800">
                                    {val}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={2}
                                  className="px-4 py-2 text-gray-500 text-center"
                                >
                                  No placeholder available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </Box>
                  </Box>
                </div>
                <Flex
                  justifyContent="end"
                  mt="20px"
                  alignItems="center"
                  gap="20px"
                >
                  <Button
                    type="button"
                    borderRadius="8px"
                    variant="outline"
                    marginTop="1rem"
                    onClick={closeDialog}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={`${styles.submitBtn}`}
                    disabled={isFetching || isLoading}
                  >
                    Update Template
                  </Button>
                </Flex>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditTemplate;
