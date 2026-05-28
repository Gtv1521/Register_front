import { NavDataEntity } from "src/app/core/domain/entitys/nav-data.entity";

export interface LoginRequestDto extends NavDataEntity {
    email: string,
    password: string
}
