import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    Get,
    Req,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { SignUpDto } from 'src/dto/signup.dto';
  import { LoginDto } from 'src/dto/login.dto';
  import * as speakeasy from 'speakeasy';
  import { AuditLog } from 'src/models/audit-log.schema';
  import { FailedLoginAttempt } from 'src/models/failed-login.schema';
  import { Request } from 'express';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
      return this.authService.signUp(signUpDto);
    }
  
    @Post('/login')
async login(
  @Body() loginDto: LoginDto,
  @Req() req: Request,
): Promise<{ token: string; role: string } | { mfaEnabled: boolean }> {
  const ipAddress =
    Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.ip || 'Unknown IP';
  try {
    return await this.authService.login(loginDto);
  } catch (error) {
    if (
      error instanceof UnauthorizedException &&
      loginDto.email
    ) {
      await this.authService.logFailedLogin(loginDto.email, ipAddress);
    }
    throw error;
  }
}

@Get('/mfa-statuses')
  async getMfaStatuses(): Promise<{ email: string; mfaEnabled: boolean }[]> {
    return this.authService.getMfaStatuses(); // Delegate to AuthService
  }
  
    @Get('/audit-logs')
    getAuditLogs(): Promise<AuditLog[]> {
      return this.authService.getAuditLogs();
    }
  
    @Get('/failed-logins')
    getFailedLogins(): Promise<FailedLoginAttempt[]> {
      return this.authService.getFailedLogins();
    }
  
    @Post('/enable-mfa')
    async enableMFA(@Body() { email }: { email: string }): Promise<{ qrCode: string }> {
      const user = await this.authService.findOne({ email });
      if (!user) throw new UnauthorizedException('User not found');
  
      const secret = speakeasy.generateSecret({ name: `AppName (${email})` });
      user.mfaSecret = secret.base32;
      await user.save();
  
      const qrCode = `otpauth://totp/AppName:${email}?secret=${secret.base32}&issuer=AppName`;
  
      return { qrCode };
    }
  
    @Post('/verify-otp')
    async verifyOTP(@Body() { email, otp }: { email: string; otp: string }): Promise<{ success: boolean }> {
      const user = await this.authService.findOne({ email });
      if (!user || !user.mfaSecret) throw new UnauthorizedException('MFA not enabled');
  
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: otp,
      });
  
      if (!verified) throw new UnauthorizedException('Invalid OTP');
  
      return { success: true };
    }
  }  