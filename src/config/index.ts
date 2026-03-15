export interface Config {
  apiSecret: string;
  yazioAuthToken: string;
  useMockYazio: boolean;
}

export function getConfig(): Config {
  return {
    apiSecret: process.env.API_SECRET || "",
    yazioAuthToken: process.env.YAZIO_AUTH_TOKEN || "",
    useMockYazio: process.env.USE_MOCK_YAZIO === "true",
  };
}
