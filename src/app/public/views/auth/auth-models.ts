export interface RegistrationResponse{
    password: string  
    email: string  
  
}
export interface AuthRequest{
    data: UserRequest | LoginRequest
    success: boolean
    message: string
}
export interface UserRequest{
    id: string
    is_active: number
    email: string
    role: string
}
export interface LoginRequest{
    user: UserRequest
    message: string
    isError: boolean
    token: string
}
export interface LoginResponse{
    email: string
    password: string
}
export enum Role{
    ADMIN = "ADMIN",
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    EMPLOYEE = "EMPLOYEE"

}