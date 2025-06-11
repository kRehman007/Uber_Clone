import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createRideParams,
  createRideResponse,
  GetSuggestionsQueryParams,
  suggestions,
} from "../../Utils/interfaces";
import { getToken } from "../../Utils/Axios";

export type SuggestionsResponse = suggestions[];

export const GoogleMapAPI = createApi({
  reducerPath: "GoogleMapAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${getToken()}`);
    },
  }),
  endpoints: (builder) => ({
    getSuggestions: builder.query<
      SuggestionsResponse,
      GetSuggestionsQueryParams
    >({
      query: ({ address }) => ({
        url: "/maps/get-suggestions",
        method: "GET",
        params: { query: address },
      }),
    }),
    createRide: builder.query<createRideResponse, createRideParams>({
      query: ({ pickup, destination, vehicleType }) => ({
        url: "/rides/create",
        method: "POST",
        body: { pickup, destination, vehicleType },
      }),
    }),
  }),
});

export const { useGetSuggestionsQuery, useCreateRideQuery } = GoogleMapAPI;
