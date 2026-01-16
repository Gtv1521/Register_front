export interface IMapper<TDto, TEntity> {
  fromDto(dto: TDto): TEntity;
  toDto(entity: TEntity): TDto;
}