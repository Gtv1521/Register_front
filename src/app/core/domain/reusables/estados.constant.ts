import { types } from '../entitys/observation.entity';
import { EstadoRegistro } from '../entitys/register.entity';

export const LISTA_ESTADOS = [
  { value: EstadoRegistro.Pendiente, label: 'Pendiente' },
  { value: EstadoRegistro.EnProgreso, label: 'En Progreso' },
  { value: EstadoRegistro.Completado, label: 'Completado' },
  { value: EstadoRegistro.Entregado, label: 'Entregado' },
  { value: EstadoRegistro.Cancelado, label: 'Cancelado' },
];

export const LIST_TYPE = [
  { value: types.Informacion, label: 'Informacion' },
  { value: types.Pendiente, label: 'Pendiente' },
  { value: types.Solucion, label: 'Solucion' },
  { value: types.Entregado, label: 'Entregado' },
  { value: types.Cancelado, label: 'Cancelado' },
];
