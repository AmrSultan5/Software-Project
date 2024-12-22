import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { users } from 'src/models/users.Schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuditLog } from 'src/models/audit-log.schema';
import { FailedLoginAttempt } from 'src/models/failed-login.schema';
import * as speakeasy from 'speakeasy';

// Define the LoginResponse type
export type LoginResponse =
  | { token: string; role: string } // Non-MFA response
  | { mfaEnabled: true };          // MFA response

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(users.name)
    private userModel: Model<users>,
    private jwtService: JwtService,
    @InjectModel('AuditLog') private auditLogModel: Model<AuditLog>, // Mongoose model for Audit Logs
    @InjectModel('FailedLogin') private failedLoginModel: Model<FailedLoginAttempt>
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { user_id, name, email, password, role } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      user_id,
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
  
    // Find the user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password!');
    }
  
    // Validate the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password!');
    }
  
    // Generate a JWT token for the user
    const token = this.jwtService.sign({ id: user._id, role: user.role });
  
    // Check if MFA is enabled
    if (user.mfaSecret) {
      return { mfaEnabled: true, token }; // Include the token even if MFA is enabled
    }
  
    // If MFA is not enabled, return the token and role
    return { token, role: user.role };
  }  

  async findOne(filter: Record<string, any>) {
    return this.userModel.findOne(filter);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogModel.find().sort({ timestamp: -1 }).exec(); // Fetch logs, sorted by timestamp
  }

  async getFailedLogins(): Promise<FailedLoginAttempt[]> {
    return this.failedLoginModel.find().sort({ timestamp: -1 }).exec(); // Fetch failed login attempts
  }

  async logAuditActivity(userEmail: string, activity: string): Promise<void> {
    const log = new this.auditLogModel({ userEmail, activity, timestamp: new Date() });
    await log.save();
  }

  async logFailedLogin(email: string, ipAddress: string): Promise<void> {
    const failedLogin = new this.failedLoginModel({
      email,
      ipAddress,
      timestamp: new Date(),
    });
    await failedLogin.save();
  }

  async verifyOTP(email: string, otp: string): Promise<{ token: string; role: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user || !user.mfaSecret) {
      throw new UnauthorizedException('MFA not enabled or user not found!');
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: otp,
    });

    if (!verified) {
      throw new UnauthorizedException('Invalid OTP!');
    }

    // Generate a JWT token after successful OTP verification
    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return { token, role: user.role };
  }

  async getMfaStatuses(): Promise<{ email: string; mfaEnabled: boolean }[]> {
    const users = await this.userModel.find({}, { email: 1, mfaSecret: 1 });
    return users.map((user) => ({
      email: user.email,
      mfaEnabled: !!user.mfaSecret, // Convert to boolean
    }));
  }
}