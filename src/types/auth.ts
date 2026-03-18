export interface AuthUser {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    terms?: boolean;
  }
  
  export type AuthTab = 'login' | 'register';