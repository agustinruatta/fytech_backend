import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export default class UnitTestsHelpers {
  static getRepositoriesToMock(entities: EntityClassOrSchema[]) {
    const mockedEntities = [];

    entities.forEach((entity) => {
      mockedEntities.push({
        provide: getRepositoryToken(entity),
        useClass: Repository,
      });
    });

    return mockedEntities;
  }
}
