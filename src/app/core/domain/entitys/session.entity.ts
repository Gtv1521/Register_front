import { NavDataEntity } from "./nav-data.entity";

export interface SessionEntity {
  idUser: string;
  idSession: string;
  idCompany: string;
  theme: string;
  accessToken: string;
  refreshToken: string;
}

export interface SessionInfo extends NavDataEntity {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  token: string;
}
