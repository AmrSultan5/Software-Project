import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { users } from "src/models/users.Schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(users.name)
    private userModel: Model<users>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { user_id } = payload; // Ensure this matches the payload structure
  
    const user = await this.userModel.findOne({ user_id }); // Query using `user_id`
  
    if (!user) {
      throw new UnauthorizedException('Login first to access this!');
    }
  
    console.log("Validated user:", { user_id, role: user.role });
    return { user_id: user.user_id, role: user.role }; // Return the validated user data
  }  
}