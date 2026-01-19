import { InjectionToken } from "@angular/core";
import { RegisterEntity } from "../../domain/entitys/register.entity";
import { IFiter } from "../../domain/interfaces/ICrud";
import { RegisterRequestDto } from "../../infrastructure/dto/request/register/register-request.dto";

export const REGISTER_TOKEN = new InjectionToken<IFiter<RegisterRequestDto, RegisterEntity>>('REGISTER_TOKEN');
