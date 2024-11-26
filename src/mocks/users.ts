import { IUserResource } from "../types/User";

export const mockUsers: { [key: string]: IUserResource } = {
  "user1@example.com": { id: 1, name: "User One", reports: [101] },
};
