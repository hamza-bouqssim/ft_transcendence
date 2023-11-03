import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { AuthService } from "../auth.service"
import { LocalAuthDto } from "../dto/local.auth.dto";
import { Strategy , ExtractJwt} from "passport-jwt";

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(private readonly authService: AuthService)
    {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: true, // in prodcution change it to true, you must asign FALSE not true , maaaaa tnsaaach !!!!
                secretOrKey: 'my-secret',
            }
        );
    }

    async validate(payload: any){
        return payload;
    }
}