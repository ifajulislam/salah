import * as Location from "expo-location";
import type {
  Coordinates,
  LocationSource,
} from "@/features/prayer/types/prayer";

export class LocationPermissionDeniedError extends Error {
  constructor() {
    super("Location permission was denied");
    this.name = "LocationPermissionDeniedError";
  }
}

/**
 * Requests GPS location. This is always OPTIONAL from the caller's
 * perspective — every call site must have a manual-city fallback path and
 * must never block the app's usefulness on this succeeding.
 */
export async function requestGpsLocation(): Promise<LocationSource> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new LocationPermissionDeniedError();
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const coordinates: Coordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  const [place] = await Location.reverseGeocodeAsync(coordinates).catch(
    () => [],
  );

  return {
    type: "gps",
    city: place?.city ?? place?.subregion ?? "Current location",
    country: place?.country ?? undefined,
    coordinates,
    timezone: undefined, // resolved on demand via Intl at render time
  };
}

export interface CitySearchResult {
  name: string;
  country: string;
  admin1?: string;
  coordinates: Coordinates;
}

/**
 * Manual city search via Open-Meteo's free geocoding API. No API key
 * required, generous rate limits — a good default for an offline-friendly
 * prayer app that shouldn't require the user to sign up for anything.
 */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (query.trim().length < 2) return [];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query.trim());
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`City search failed with status ${response.status}`);
  }

  const json: {
    results?: Array<{
      name: string;
      country: string;
      admin1?: string;
      latitude: number;
      longitude: number;
    }>;
  } = await response.json();

  return (json.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    coordinates: { latitude: r.latitude, longitude: r.longitude },
  }));
}

export function toLocationSource(result: CitySearchResult): LocationSource {
  return {
    type: "manual",
    city: result.name,
    country: result.country,
    coordinates: result.coordinates,
  };
}
