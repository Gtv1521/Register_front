export interface SessionEntity {
  idUser: string;
  idSession: string;
  accessToken: string;
  refreshToken: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  token: string;
}
