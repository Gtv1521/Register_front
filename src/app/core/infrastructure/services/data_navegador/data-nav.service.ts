import { Injectable } from '@angular/core';
import { NavDataEntity } from 'src/app/core/domain/entitys/nav-data.entity';

@Injectable({providedIn: 'root'})
export class DataNavService {
  // 1. Cambia el tipo de retorno a Promise
  async GoData(): Promise<NavDataEntity> {
    const uaData: any = (navigator as any).userAgentData;

    // Valor por defecto si la API no existe (Firefox/Safari viejos)
    const fallback: NavDataEntity = {
      navegador: 'Desconocido',
      versionNavegador: '0',
      sistemaOperativo: 'Desconocido',
    };

    if (!uaData) return fallback;

    try {
      // 1. Obtener Navegador
      const mainBrand =
        uaData.brands.find(
          (b: any) => b.brand !== 'Chromium' && !b.brand.includes('Not'),
        ) || uaData.brands[0];

      // 2. Esperar los valores de alta entropía (SO)
      const ua: any = await uaData.getHighEntropyValues([
        'platform',
        'platformVersion',
      ]);

      return {
        navegador: mainBrand.brand,
        versionNavegador: mainBrand.version,
        sistemaOperativo: ua.platform,
      };
    } catch (error) {
      console.error('Error obteniendo datos de navegación', error);
      return fallback;
    }
  }
}
