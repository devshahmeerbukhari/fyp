import fetch from "node-fetch";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Get nearby places based on location and type using Google Places API (New)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNearbyPlaces = async (req, res) => {
  try {
    const { latitude, longitude, type, radius = 10000 } = req.body;

    if (!latitude || !longitude || !type) {
      throw new ApiError(400, "Latitude, longitude, and type are required");
    }

    // Google Places API requires an API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      throw new ApiError(500, "Google Places API key is not configured");
    }

    console.log(`Searching for ${type} near ${latitude},${longitude} with radius ${radius}m`);

    // Using the new Places API format
    const url = "https://places.googleapis.com/v1/places:searchNearby";
    
    const requestBody = {
      includedTypes: [type],
      locationRestriction: {
        circle: {
          center: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          },
          radius: parseInt(radius)
        }
      },
      rankPreference: "DISTANCE",
      maxResultCount: 20
    };

    console.log("Request body:", JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.primaryTypeDisplayName,places.id,places.photos,places.internationalPhoneNumber"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API error:", data);
      throw new ApiError(response.status, "Error fetching places from Google API", [data.error || "Unknown error"]);
    }

    console.log(`Found ${data.places?.length || 0} places`);
    
    return res.status(200).json(
      new ApiResponse(200, data.places || [], "Places fetched successfully")
    );
  } catch (error) {
    console.error("Error in getNearbyPlaces:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json(
      new ApiError(500, "Internal server error", [error.message])
    );
  }
};