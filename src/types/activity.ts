// src/types/activity.ts

/**
 * Represents a single category of activity.
 */
export interface Category {
  digital: string; // e.g., "0:21:3"
  hours: number;
  minutes: number;
  name: string; // e.g., "unknown"
  percent: number;
  seconds: number;
  text: string; // e.g., "0 hrs 21 mins"
  total_seconds: number;
}

/**
 * Represents a single language activity.
 */
export interface Language {
  digital: string; // e.g., "0:17:54"
  hours: number;
  minutes: number;
  name: string; // e.g., "Svelte"
  percent: number;
  seconds: number;
  text: string; // e.g., "0 hrs 18 mins"
  total_seconds: number;
}

/**
 * Represents the main data structure containing various activity metrics.
 */
export interface ActivityData {
  categories: Category[];
  daily_average: number;
  days_including_holidays: number;
  editors: any[]; // Based on the sample, this is an empty array.
  end: string; // ISO 8601 date string
  human_readable_daily_average: string;
  human_readable_range: string;
  human_readable_total: string;
  is_coding_activity_visible: boolean;
  is_other_usage_visible: boolean;
  languages: Language[];
  machines: any[];
  operating_systems: any[];
  projects: any[];
  range: string;
  start: string; // ISO 8601 date string
  status: string; // e.g., "ok"
  total_seconds: number;
  user_id: string;
  username: string;
}

/**
 * The top-level interface for the entire JSON response.
 */
export interface ActivityResponse {
  data: ActivityData;
}