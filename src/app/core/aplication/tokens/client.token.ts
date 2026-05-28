import { InjectionToken } from "@angular/core";
import { IClient } from "../../domain/interfaces/ICrud";
import { ClientRequestDto } from "../../infrastructure/dto/request/client/client-request.dto";
import { ClientEntity } from "../../domain/entitys/client.entity";

export const CLIENT_TOKEN = new InjectionToken<IClient<ClientRequestDto, ClientEntity>>('CLIENT_TOKEN');
