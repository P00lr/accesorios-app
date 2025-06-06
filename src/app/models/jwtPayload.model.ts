export interface JwtPayload {
    sub: string;
    authorities: string;
    userId: number;
    iat: number;
    exp: number;
}