// src/lib/api/blogApi.js
import { baseApi } from "./baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /blogs
    getBlogs: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([Key, val]) => {
          if ((val !== undefined, val !== null && val !== "")) {
            urlParams.append(Key, val);
          }
        });
        const searchParams = urlParams.toString();
        return {
          url: `/blogs${searchParams ? `?${searchParams}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result = []) =>
        result.length
          ? [
              ...result.map((b) => ({ type: "Blogs", id: b._id })),
              { type: "Blogs", id: "LIST" },
            ]
          : [{ type: "Blogs", id: "LIST" }],
    }),

    // GET /blog/:id
    getBlogById: builder.query({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // e.g. { success: true, data: { ...blog } }
        if (response && response.data) return response.data;
        return response;
      },
      providesTags: (result, error, id) => [{ type: "Blogs", id }],
    }),

    // POST /blog
    createBlog: builder.mutation({
      query: (body) => ({
        url: "/blog",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Blogs", id: "LIST" }],
    }),

    // PUT /blog/:id
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blogs", id },
        { type: "Blogs", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
} = blogApi;
