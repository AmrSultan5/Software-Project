import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { users } from 'src/models/users.Schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from 'src/dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(users.name)
        private userModel: Model<users>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }
}
