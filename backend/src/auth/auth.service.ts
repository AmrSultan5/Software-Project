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
        const { name, email, password,role } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email })
        if(!user){
            throw new UnauthorizedException('Invalid email or password!')
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(!isPasswordMatched){
            throw new UnauthorizedException('Invalid email or password!')
        }

        const token = this.jwtService.sign({ id: user._id })
        return { token }
    }
}
