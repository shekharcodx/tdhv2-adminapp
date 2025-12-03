import React, { useEffect } from "react";
import styles from "./SignupForm.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRegistrationField } from "@/app/slices/registrationSlice";

import indiaFlag from "../../assets/india-flag.png";
import uaeFlag from "../../assets/uae-flag.png";
import usaFlag from "../../assets/usa-flag.png";
import {
  useGetCountriesQuery,
  useLazyGetStatesQuery,
  useLazyGetcitiesQuery,
} from "@/app/api/locationApi";

// const countries = [
//   { name: "India", code: "+91", flag: indiaFlag },
//   { name: "United Arab Emirates", code: "+971", flag: uaeFlag },
//   { name: "USA", code: "+1", flag: usaFlag },
// ];

// ✅ Zod schema
const schema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  businessName: z.string().min(1, "Business name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  landlineNum: z.string().min(6, "Landline must be at least 6 digits"),
  mobileNum: z.string().min(6, "Mobile number must be at least 6 digits"),
  whatsappNum: z.string().min(6, "WhatsApp number must be at least 6 digits"),
  mapUrl: z.string().url("Enter a valid map URL"),
  country: z.string().min(1, "Country is required"),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: countries } = useGetCountriesQuery();
  const [fetchStates, { data: states, isFetching: isStatesFetching }] =
    useLazyGetStatesQuery();
  const [fetchCities, { data: cities, isFetching: isCitiesFetching }] =
    useLazyGetcitiesQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);

  const handleCountryChange = async (e) => {
    try {
      await fetchStates(e.target.value);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    dispatch(updateRegistrationField(data));
    navigate("/details"); // ✅ Only navigates when validation passes
  };

  return (
    <div className={styles.container}>
      {/* Steps Header */}
      <div className={styles.stepsHeader}>
        <div className={`${styles.step} ${styles.active}`}>
          <span>1</span>
          <p>Basic Info</p>
        </div>
        <div className={styles.line}></div>
        <div className={styles.step}>
          <span>2</span>
          <p>Details</p>
        </div>
      </div>

      <h2 className={styles.heading}>Basic Info</h2>

      {/* ✅ Form wrapper */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.grid}>
        {/* Full Name */}
        <div>
          <label className={styles.label}>Full Name</label>
          <input
            {...register("name")}
            placeholder="Full Name"
            className={styles.input}
          />
          {errors.fullName && (
            <p className={styles.error}>{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={styles.label}>Email</label>
          <input
            {...register("email")}
            placeholder="Email"
            className={styles.input}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        {/* Business Name */}
        <div className={styles.inputFull}>
          <label className={styles.label}>Legal Business Name</label>
          <input
            {...register("businessName")}
            placeholder="Legal Business Name"
            className={styles.inputFull}
          />
          {errors.businessName && (
            <p className={styles.error}>{errors.businessName.message}</p>
          )}
        </div>

        {/* Street */}
        <div className={styles.inputFull}>
          <label className={styles.label}>Street</label>
          <input
            {...register("street")}
            placeholder="Street"
            className={styles.inputFull}
          />
          {errors.street && (
            <p className={styles.error}>{errors.street.message}</p>
          )}
        </div>

        {/* Country */}
        <div className={styles.inputFull}>
          <label className={styles.label}>Country</label>
          <div className={styles.countrySelect}>
            {/* <img
              src={selectedCountry.flag}
              alt="flag"
              className={styles.flag}
            /> */}
            <select
              {...register("country")}
              className={styles.select}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries?.countries?.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {errors.country && (
            <p className={styles.error}>{errors.country.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className={styles.label}>City</label>
          <input
            {...register("city")}
            placeholder="City"
            className={styles.input}
          />
          {errors.city && <p className={styles.error}>{errors.city.message}</p>}
        </div>

        {/* State */}
        <div>
          <label className={styles.label}>State</label>
          <input
            {...register("state")}
            placeholder="State"
            className={styles.input}
          />
          {errors.state && (
            <p className={styles.error}>{errors.state.message}</p>
          )}
        </div>

        {/* Phone Fields */}
        {["landlineNum", "mobileNum", "whatsappNum"].map((field) => (
          <div key={field} className={styles.inputFull}>
            <label className={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)} Number
            </label>
            <div className={styles.phoneField}>
              <div className={styles.phonePrefix}>
                {/* <img
                  src={selectedCountry.flag}
                  alt="flag"
                  className={styles.flag}
                /> */}
                {/* <span>{selectedCountry.code}</span> */}
              </div>
              <input
                type="tel"
                {...register(field)}
                placeholder={`${
                  field.charAt(0).toUpperCase() + field.slice(1)
                } Number`}
                className={styles.phoneInput}
              />
            </div>
            {errors[field] && (
              <p className={styles.error}>{errors[field].message}</p>
            )}
          </div>
        ))}

        {/* Map URL */}
        <div className={styles.inputFull}>
          <label className={styles.label}>Map URL</label>
          <input
            {...register("mapUrl")}
            placeholder="Map URL"
            className={styles.inputFull}
          />
          {errors.mapUrl && (
            <p className={styles.error}>{errors.mapUrl.message}</p>
          )}
        </div>

        {/* ✅ Next button disabled until form is valid */}
        <button type="submit" className={styles.nextButton}>
          Next
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account?{" "}
        <a href="#" className={styles.loginLink}>
          Login
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
