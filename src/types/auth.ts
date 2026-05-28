export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}
