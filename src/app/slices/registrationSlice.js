import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: "2", // default to vendor
  businessName: "",

  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    mapUrl: "",
  },

  contact: {
    mobileNum: "",
    landlineNum: "",
    whatsappNum: "",
  },

  vendorInformation: {
    fleetSize: "",
  },

  ijariCertificate: "",
  tradeLicense: "",
  noc: "",
  vatCertificate: "",
  emiratesId: "",
  poa: "",
  profilePicture: "",
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    updateRegistrationField: (state, action) => {
      const payload = action.payload;

      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === "object" && !Array.isArray(payload[key]) && state[key]) {
          state[key] = { ...state[key], ...payload[key] };
        } else {
          state[key] = payload[key];
        }
      });
    },
    resetRegistration: () => initialState,
  },
});

export const { updateRegistrationField, resetRegistration } = registrationSlice.actions;
export default registrationSlice.reducer;
