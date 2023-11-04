/* eslint-disable prettier/prettier */
// import { IsNotEmpty, IsString } from "class-validator";

// export class LocalAuthDto{
//     @IsString()
//     @IsNotEmpty()
//     username?: string;

//     @IsString()
//     @IsNotEmpty()
//     email: string;

    
//     @IsString()
//     display_name: string;

//     @IsString()
//     @IsNotEmpty()
//     password_hashed: string;

//     @IsString()
//     two_factor_auth: string;

//     @IsString()
//     two_factor_secret_key: string;

//     @IsString()
//     avatar_url: string

//     @IsString()
//     rank: string
// }
import { IsNotEmpty, IsString } from "class-validator";

export class LocalAuthDto {
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    display_name?: string;

    @IsString()
    @IsNotEmpty()
    password_hashed: string;

    @IsString()
    avatar_url?: string
}
