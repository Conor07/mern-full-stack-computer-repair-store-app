import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3500",
  }),
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
