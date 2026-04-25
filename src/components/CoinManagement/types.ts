/** Token package: one-off (Purchase) or subscription (Subscribe). See ADMIN_PACKAGES_SUBSCRIPTIONS.md */
export interface TokenPackage {
  _id: string;
  package_id: string;
  name: string;
  type: "one_time" | "subscription";
  token_count: number | null;
  price: number;
  currency?: string;
  sort_order?: number;
  is_active?: boolean;
  duration_days?: number | null;
  billing_interval?: string | null;
  unlimited_tokens?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PackageType = "one_time" | "subscription";
