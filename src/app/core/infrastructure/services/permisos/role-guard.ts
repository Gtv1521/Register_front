import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(UserGetUseCase);
  const router = inject(Router);

  const user = await lastValueFrom(authService.execute());
  const allowedRoles = route.data['roles'] as string[];
  
  // Si el Signal aún no tiene datos, podrías retornar un Observable que espere la respuesta
  if (user && allowedRoles.includes(user.rol)) {
    return true;
  }
  return router.parseUrl('/no-access');
};
