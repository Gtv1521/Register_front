import { InjectionToken } from "@angular/core";
import { ICrud } from "../../domain/interfaces/ICrud";
import { AdvertenciaEntity } from "../../domain/entitys/advertencia.entity";
import { AdvertenciaRequestDto } from "../../infrastructure/dto/request/advertencia/advertencia-request.dto";

export const ADVERTENCIA_TOKEN = new InjectionToken<ICrud<AdvertenciaRequestDto, AdvertenciaEntity>>('ADVERTENCIA_TOKEN');
