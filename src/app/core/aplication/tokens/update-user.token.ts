import { InjectionToken } from '@angular/core';
import { IUpdateUser } from '../../domain/interfaces/ICrud';

export const UP_USER_TOKEN = new InjectionToken<IUpdateUser>('UP_USER_TOKEN');
