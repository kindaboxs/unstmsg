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

const getAccessToken = async () => {
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

  const data = await response.json();
  return data as SpotifyTokenResponse;
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

spotifySearchTrack("Istilah Kata")
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
