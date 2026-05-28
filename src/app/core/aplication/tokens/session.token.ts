import { InjectionToken } from "@angular/core";
import { ISession, ISessionInfo } from "../../domain/interfaces/Isession";
import { LoginRequestDto } from "../../infrastructure/dto/request/login-request.dto";
import { SigInRequestDto } from "../../infrastructure/dto/request/sig-in-request.dto";
import { SessionEntity, SessionInfo } from "../../domain/entitys/session.entity";

export const SESSION_TOKEN = new InjectionToken<ISession<LoginRequestDto, SigInRequestDto, SessionEntity>>('SESSION_TOKEN');
export const SESSIONES_TOKEN = new InjectionToken<ISessionInfo<SessionInfo>>('SESSIONES_TOKEN');