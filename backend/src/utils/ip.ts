import axios from "axios";
import { RegExp } from "./reg-ex.js";

interface GeoJsResponse {
  ip: string;
  city: string;
  country_code: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
}

/**
 * Get geolocation details for a given IP address using GeoJS API.
 * @param {string | string[] | undefined} ip - The IP address to lookup.
 * @returns {Promise<GeoJsResponse>} - The geolocation data for the provided IP address.
 * @throws {Error} - If the IP address is invalid or if the API call fails.
 */
export async function getIpDetail(
  ip: string | string[] | undefined
): Promise<GeoJsResponse> {
  // Ensure the IP is a valid string
  let ipString = Array.isArray(ip)
    ? ip[0]
    : ip?.startsWith("::ffff:")
    ? ip.replace("::ffff:", "")
    : ip;

  if (!ipString || typeof ipString !== "string" || !RegExp.ip.test(ipString)) {
    throw new Error("Invalid IP address format.");
  }

  try {
    // Fetch geolocation details from GeoJS API
    const response = await axios.get(
      `https://get.geojs.io/v1/ip/geo/${ipString}.json`
    );

    // If the response is successful, return the geolocation data
    return response.data;
  } catch (error: any) {
    // Handle API errors gracefully
    console.error(
      "Error fetching IP details:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to fetch IP details. Please try again later.");
  }
}
