import { InjectionToken } from "@angular/core";
import { ISession } from "../../domain/interfaces/Isession";
import { LoginRequestDto } from "../../infrastructure/dto/request/login-request.dto";
import { SigInRequestDto } from "../../infrastructure/dto/request/sig-in-request.dto";
import { SessionEntity } from "../../domain/entitys/session.entity";

export const SESSION_TOKEN = new InjectionToken<ISession<LoginRequestDto, SigInRequestDto, SessionEntity>>('SESSION_TOKEN');