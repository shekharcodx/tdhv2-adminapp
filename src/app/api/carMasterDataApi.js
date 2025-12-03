import { baseApi } from "@/app/api/baseApi";

const carMasterDataApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    //car brands
    getCarBrand: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("allBrands", param);
        }
        return { url: `/carBrands?${urlParams}`, method: "GET" };
      },
      providesTags: ["CarBrands"],
    }),
    updateBrandActive: builder.mutation({
      query: (brandId) => ({
        url: `/carBrand/${brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CarBrands"],
    }),
    addCarBrand: builder.mutation({
      query: (data) => ({
        url: "/carBrand",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CarBrands"],
    }),

    //car models
    getAllCarModels: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("allModels", param);
        }
        return { url: `/carModels?${urlParams}`, method: "GET" };
      },
      providesTags: ["AllModels"],
    }),
    getCarModels: builder.query({
      query: (brandId) => ({
        url: `/carModels/${brandId}`,
        method: "GET",
      }),
      providesTags: ["CarModels"],
    }),
    updateModelActive: builder.mutation({
      query: (modelId) => ({
        url: `/carModel/${modelId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllModels"],
    }),
    addCarModels: builder.mutation({
      query: (data) => ({
        url: "/carModels",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllModels", "CarModels"],
    }),

    //car trims
    getAllCarTrims: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("allTrims", param);
        }
        return { url: `/carTrims?${urlParams}`, method: "GET" };
      },
      providesTags: ["AllTrims"],
    }),
    getCarTrims: builder.query({
      query: (modelId) => ({
        url: `/carTrims/${modelId}`,
        method: "GET",
      }),
      providesTags: ["CarTrims"],
    }),
    updateTrimActive: builder.mutation({
      query: (trimId) => ({
        url: `/carTrim/${trimId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllTrims"],
    }),
    addCarTrims: builder.mutation({
      query: (data) => ({
        url: "/carTrims",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllTrims", "CarTrims"],
    }),

    //reference data

    //years
    getYears: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/years?${urlParams}`, method: "GET" };
      },
      providesTags: ["CarYears"],
    }),
    updateYearActive: builder.mutation({
      query: (yearId) => ({
        url: `/year/${yearId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CarYears"],
    }),
    addYears: builder.mutation({
      query: (data) => ({
        url: "/years",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CarYears"],
    }),

    //colors
    getColors: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carColors?${urlParams}`, method: "GET" };
      },
      providesTags: ["Colors"],
    }),
    updateColorActive: builder.mutation({
      query: (colorId) => ({
        url: `/carColor/${colorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colors"],
    }),
    addColors: builder.mutation({
      query: (data) => ({
        url: "/carColors",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Colors"],
    }),

    //doors
    getDoors: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `carDoors?${urlParams}`, method: "GET" };
      },
      providesTags: ["Doors"],
    }),
    updateDoorActive: builder.mutation({
      query: (doorId) => ({
        url: `/carDoors/${doorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doors"],
    }),
    addDoors: builder.mutation({
      query: (data) => ({
        url: "/carDoors",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Doors"],
    }),

    //fuelTypes
    getFuelTypes: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carFuelTypes?${urlParams}`, method: "GET" };
      },
      providesTags: ["FuelTypes"],
    }),
    updateFuelTypeActive: builder.mutation({
      query: (fuelTypeId) => ({
        url: `/carFuelType/${fuelTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FuelTypes"],
    }),
    addFuelTypes: builder.mutation({
      query: (data) => ({
        url: "/carFuelTypes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FuelTypes"],
    }),

    //categories
    getCategories: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carCategories?${urlParams}`, method: "GET" };
      },
      providesTags: ["Categories"],
    }),
    updateCategoryActive: builder.mutation({
      query: (categoryId) => ({
        url: `/carCategory/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    addCategories: builder.mutation({
      query: (data) => ({
        url: "/carCategories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    //bodytype
    getBodyTypes: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/bodyTypes?${urlParams}`, method: "GET" };
      },
      providesTags: ["BodyTypes"],
    }),
    updateBodyTypeUpdate: builder.mutation({
      query: (bodyTypeId) => ({
        url: `/bodyType/${bodyTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BodyTypes"],
    }),
    addBodyTypes: builder.mutation({
      query: (data) => ({
        url: "/carBodyTypes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BodyTypes"],
    }),

    //transmission
    getTransmissions: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carTransmissions?${urlParams}`, method: "GET" };
      },
      providesTags: ["Transmissions"],
    }),
    updateTransmissionUpdate: builder.mutation({
      query: (transmissionId) => ({
        url: `/carTransmission/${transmissionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transmissions"],
    }),
    addTransmissions: builder.mutation({
      query: (data) => ({
        url: "/carTransmissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transmissions"],
    }),

    //powers
    getPowers: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carHorsePowers?${urlParams}`, method: "GET" };
      },
      providesTags: ["HorsePowers"],
    }),
    updatePowerActive: builder.mutation({
      query: (powerId) => ({
        url: `/carHorsePower/${powerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HorsePowers"],
    }),
    addPowers: builder.mutation({
      query: (data) => ({
        url: "/carHorsePowers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HorsePowers"],
    }),

    //regionalSpecs
    getRegionalSpecs: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carRegionalSpecs?${urlParams}`, method: "GET" };
      },
      providesTags: ["RegionalSpecs"],
    }),
    updateRegionalSpecsActive: builder.mutation({
      query: (specId) => ({
        url: `/carRegionalSpecs/${specId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RegionalSpecs"],
    }),
    addRegionalSpecs: builder.mutation({
      query: (data) => ({
        url: "/carRegionalSpecs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RegionalSpecs"],
    }),

    //seating
    getSeatingCapacities: builder.query({
      query: (param) => {
        let urlParams = new URLSearchParams();
        if (param !== undefined && param !== null) {
          urlParams.append("all", param);
        }
        return { url: `/carSeatingCapacities?${urlParams}`, method: "GET" };
      },
      providesTags: ["SeatingCapacities"],
    }),
    updateSeatingCapacitiesActive: builder.mutation({
      query: (seatId) => ({
        url: `/carSeating/${seatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SeatingCapacities"],
    }),
    addSeatingCapacities: builder.mutation({
      query: (data) => ({
        url: "/carSeatingCapacities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SeatingCapacities"],
    }),

    //techFeatures
    getTechFeatures: builder.query({
      query: () => ({
        url: "/carTechFeatures",
        methos: "GET",
      }),
      providesTags: ["TechFeatures"],
    }),
    updateTeachFeatureActive: builder.mutation({
      query: (featureId) => ({
        url: `/carTechFeature/${featureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TechFeatures"],
    }),
    addTechFeatures: builder.mutation({
      query: (data) => ({
        url: "/carTechFeatures",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TechFeatures"],
    }),

    //otherFeatures
    getOtherFeatures: builder.query({
      query: () => ({
        url: "/carOtherFeatures",
        method: "GET",
      }),
      providesTags: ["OtherFeatures"],
    }),
    updateOtherFeatureActive: builder.mutation({
      query: (featureId) => ({
        url: `/carOtherFeature/${featureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OtherFeatures"],
    }),
    addOtherFeatures: builder.mutation({
      query: (data) => ({
        url: "/carOtherFeatures",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OtherFeatures"],
    }),
  }),
});

export const {
  useGetCarBrandQuery,
  useUpdateBrandActiveMutation,
  useAddCarBrandMutation,

  useGetAllCarModelsQuery,
  useLazyGetCarModelsQuery,
  useUpdateModelActiveMutation,
  useAddCarModelsMutation,

  useGetAllCarTrimsQuery,
  useLazyGetCarTrimsQuery,
  useUpdateTrimActiveMutation,
  useAddCarTrimsMutation,

  useGetYearsQuery,
  useUpdateYearActiveMutation,
  useAddYearsMutation,

  useGetDoorsQuery,
  useUpdateDoorActiveMutation,
  useAddDoorsMutation,

  useGetColorsQuery,
  useUpdateColorActiveMutation,
  useAddColorsMutation,

  useGetFuelTypesQuery,
  useUpdateFuelTypeActiveMutation,
  useAddFuelTypesMutation,

  useGetCategoriesQuery,
  useUpdateCategoryActiveMutation,
  useAddCategoriesMutation,

  useGetBodyTypesQuery,
  useUpdateBodyTypeUpdateMutation,
  useAddBodyTypesMutation,

  useGetTransmissionsQuery,
  useUpdateTransmissionUpdateMutation,
  useAddTransmissionsMutation,

  useGetPowersQuery,
  useUpdatePowerActiveMutation,
  useAddPowersMutation,

  useGetRegionalSpecsQuery,
  useUpdateRegionalSpecsActiveMutation,
  useAddRegionalSpecsMutation,

  useGetSeatingCapacitiesQuery,
  useUpdateSeatingCapacitiesActiveMutation,
  useAddSeatingCapacitiesMutation,

  useGetTechFeaturesQuery,
  useUpdateTeachFeatureActiveMutation,
  useAddTechFeaturesMutation,

  useGetOtherFeaturesQuery,
  useUpdateOtherFeatureActiveMutation,
  useAddOtherFeaturesMutation,
} = carMasterDataApi;
