import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { users } from 'src/models/users.Schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(users.name)
        private userModel: Model<users>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { user_id,name, email, password,role } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userModel.create({
            user_id,
            name,
            email,
            password: hashedPassword,
            role
        })

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }

    async login(loginDto: LoginDto): Promise<{ token: string; role: string }> {
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
      
        // Generate a JWT token
        const token = this.jwtService.sign({ id: user._id, role: user.role });
      
        // Return the token and user's role
        return { token, role: user.role };
      }      
}
