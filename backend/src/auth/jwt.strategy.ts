import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy,ExtractJwt } from "passport-jwt";
import { users } from "src/models/users.Schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(users.name)
        private userModel: Model<users>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }


    async validate(payload){
        const {id,role } = payload;

        const user = await this.userModel.findById(id);

        if(!user){
            throw new UnauthorizedException('Login first to access this!')
        }

        if (role !== 'admin') {
            throw new ForbiddenException('You do not have permission to access this resource');
          }

        return user;
    }
}