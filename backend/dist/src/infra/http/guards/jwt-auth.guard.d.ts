import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    userId: string;
    userRole: string;
}
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    private decodeDevelopmentToken;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
