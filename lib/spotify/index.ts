import { createFetch } from "@better-fetch/fetch";

import { env } from "@/env";
import type {
  SpotifyErrorResponse,
  SpotifyGetTrackResponse,
  SpotifySearchResponse,
} from "@/lib/spotify/types";

const client_id = env.SPOTIFY_CLIENT_ID;
const client_secret = env.SPOTIFY_CLIENT_SECRET;
const buffer = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Token cache with expiration
interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

// Safety buffer: refresh token 5 minutes before expiry
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

const getFreshAccessToken = async () => {
  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${buffer}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      let errorBody: string;
      try {
        errorBody = await response.text();
      } catch {
        errorBody = "Unable to read error response";
      }

      throw new Error(
        `Spotify token request failed: ${response.status} ${response.statusText}. Response: ${errorBody}`
      );
    }

    const data = await response.json();

    // Cache the token with expiration time
    const expiresAt =
      Date.now() + data.expires_in * 1000 - TOKEN_REFRESH_BUFFER;
    tokenCache = {
      token: data.access_token,
      expiresAt,
    };

    return data as SpotifyTokenResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Network error while fetching Spotify access token: ${String(error)}`
    );
  }
};

// Check if cached token is still valid
const isTokenValid = (cache: TokenCache | null): cache is TokenCache => {
  return cache !== null && Date.now() < cache.expiresAt;
};

// Get a valid access token (from cache or fresh)
const getAccessToken = async (): Promise<{ access_token: string }> => {
  // Return cached token if still valid
  if (isTokenValid(tokenCache)) {
    return { access_token: tokenCache.token };
  }

  // Fetch fresh token and cache it
  const tokenData = await getFreshAccessToken();
  return { access_token: tokenData.access_token };
};

const spotifyApi = createFetch({
  baseURL: SPOTIFY_BASE_URL,
  auth: {
    type: "Bearer",
    token: async () => {
      const token = await getAccessToken();
      return token.access_token;
    },
  },
  retry: {
    type: "linear",
    attempts: 3,
    delay: 1000,
  },
});

export const spotifyGetTrack = async (trackId: string) => {
  const { data, error } = await spotifyApi<
    SpotifyGetTrackResponse,
    SpotifyErrorResponse
  >("/tracks/:id", {
    params: {
      id: trackId,
    },
  });

  return { data, error };
};

export const spotifySearchTrack = async (query: string) => {
  const { data, error } = await spotifyApi<
    SpotifySearchResponse,
    SpotifyErrorResponse
  >("/search", {
    query: {
      q: query,
      type: "track",
      limit: 20,
      offset: 0,
    },
  });

  return { data, error };
};
