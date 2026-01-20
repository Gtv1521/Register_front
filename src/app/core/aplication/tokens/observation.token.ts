import { InjectionToken } from "@angular/core";
import { IObservation } from "../../domain/interfaces/ICrud";
import { ObservationRequestDto } from "../../infrastructure/dto/request/observation/observation-request.dto";
import { ObservationEntity } from "../../domain/entitys/observation.entity";

export const OBSERVATION_TOKEN = new InjectionToken<IObservation<ObservationRequestDto, ObservationEntity>>('OBSERVATION_TOKEN');
