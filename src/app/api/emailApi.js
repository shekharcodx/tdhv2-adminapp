import { baseApi } from "./baseApi";

const emailApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllTemplates: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).map(([Key, val]) => {
          if ((val !== "" && val !== null, val !== undefined)) {
            urlParams.append(Key, val);
          }
        });

        const paramsString = urlParams.toString();

        return {
          url: `/emailTempates${paramsString ? `?${paramsString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["AllTemplates"],
    }),
    getTemplate: builder.query({
      query: (templateId) => ({
        url: `/emailTemplate/${templateId}`,
        methid: "GET",
      }),
    }),
    updateTemplate: builder.mutation({
      query: ({ templateId, payload }) => ({
        url: `/emailTemplate/${templateId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AllTemplates"],
    }),
  }),
});

export const {
  useGetAllTemplatesQuery,
  useLazyGetTemplateQuery,
  useUpdateTemplateMutation,
} = emailApi;
