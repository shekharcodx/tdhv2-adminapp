// src/pages/admin/blogs/AdminBlogs.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "@/app/api/blogApi";
import { Button, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { MenuIcon } from "lucide-react";
import DataTable from "@/components/DataTable";
import styles from "./Blogs.module.css";

const AdminBlogs = () => {
  const [page, setPage] = useState(1);
  // === RTK Query hooks ===
  const {
    data: blogs,
    isFetching,
    isError,
    refetch,
  } = useGetBlogsQuery({ page, limit: 4 });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  // === Form + editor state ===
  const { register, handleSubmit, reset, setValue } = useForm();
  const [content, setContent] = useState("");
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [thumbnailPreview, setThumnailPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // Reset form for create
  const switchToCreate = () => {
    setMode("create");
    setEditingId(null);
    reset({ title: "" });
    setContent("");
    setThumnailPreview(null);
    setThumbnail(null);
  };

  // When clicking "Edit" from the list
  const handleEditClick = (blog) => {
    console.log("index:blog", blog);
    setMode("edit");
    setEditingId(blog._id);
    setValue("title", blog.title);
    setContent(blog.content || "");
    setThumnailPreview(blog.thumbnail?.url || null);
  };

  const onSubmit = async (data) => {
    if (!content.trim()) {
      alert("Please write some blog content.");
      return;
    }
    const formData = new FormData();
    thumbnail && formData.append("thumbnail", thumbnail);
    formData.append("title", data.title);
    formData.append("content", content);

    try {
      if (mode === "create") {
        if (!thumbnail) return alert("Thumbnail is required");
        await createBlog(formData).unwrap();
        alert("Blog created successfully!");
      } else if (mode === "edit" && editingId) {
        await updateBlog({
          id: editingId,
          data: formData,
        }).unwrap();
        alert("Blog updated successfully!");
      }

      // 🔥 Refresh the list to show new/updated blog
      await refetch();

      // After success, go back to create mode with empty form
      switchToCreate();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Something went wrong.");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumnailPreview(URL.createObjectURL(file));
      setThumbnail(file);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (blog) => (
        <span>{new Date(blog.createdAt).toLocaleString()}</span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (blog) => (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              mx="auto"
              display="block"
              variant="outline"
              color="#000"
              outline="none"
              border="none"
              size="sm"
            >
              <MenuIcon color="rgba(91, 120, 124, 1)" />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="view"
                  cursor="pointer"
                  onClick={() => handleEditClick(blog)}
                >
                  Edit
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto" data-color-mode="light">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Blogs</h1>

        {mode === "edit" && (
          <button
            type="button"
            onClick={switchToCreate}
            className="px-3 py-1.5 rounded-md border text-sm"
          >
            + New Blog
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: Blogs list */}
        <div className="">
          {/* <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">All Blogs</h2>
          </div> */}
          <>
            {/* <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="py-2 text-left">Title</th>
                    <th className="py-2 text-left">Created</th>
                    <th className="py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="border-b last:border-0">
                      <td className="py-2 pr-2 align-top">{blog.title}</td>
                      <td className="py-2 pr-2 align-top text-xs text-gray-500">
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-2 text-center align-top">
                        <button
                          type="button"
                          onClick={() => handleEditClick(blog)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            <DataTable
              columns={columns}
              data={blogs?.data?.docs || []}
              isFetching={isFetching}
              pagination={true}
              paginationData={blogs?.data}
              page={page}
              setPage={setPage}
              skeleton={<SkeletonRow />}
              skeletonRows={5}
              getRowClass={(_, i) =>
                i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              }
            />
          </>
        </div>

        {/* RIGHT: Create / Edit form */}
        <div className="bg-white border rounded-[1rem] p-4">
          <h2 className="text-lg font-semibold mb-3">
            {mode === "create" ? "Create Blog" : "Edit Blog"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Thumbnail
              </label>
              <div>
                <input
                  onChange={(e) => handleThumbnailChange(e)}
                  type="file"
                  className="w-1/2 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt={"thumbnail"}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "12px",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
            </div>
            {/* Title */}
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <input
                {...register("title", { required: true })}
                type="text"
                placeholder="Enter blog title"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Markdown editor */}
            <div>
              <label className="block mb-1 text-sm font-medium">Content</label>
              <div className="border rounded-md overflow-hidden">
                <MDEditor
                  value={content}
                  onChange={(v) => setContent(v || "")}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Supports Markdown – headings, bold, lists, links, etc.
              </p>
            </div>

            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60 cursor-pointer"
              style={{ background: "var(--gradient-background)" }}
            >
              {mode === "create"
                ? isCreating
                  ? "Publishing..."
                  : "Publish Blog"
                : isUpdating
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={`${styles.tableRowEven} py-[10px]`}>
      <td className={`${styles.tableCell}`} colSpan={9}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default AdminBlogs;
