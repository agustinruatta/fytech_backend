import { NestInterceptor } from '@nestjs/common';
import { CustomSerializationInterceptor } from '../Serialization/CustomSerializationInterceptor';
import { HTTPSerializableInterceptor } from '../Exceptions/HTTPSerializableInterceptor';

export const globalInterceptors: NestInterceptor[] = [
  new CustomSerializationInterceptor(),
  new HTTPSerializableInterceptor(),
];
