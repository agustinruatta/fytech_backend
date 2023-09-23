import { ValidationPipe } from '@nestjs/common';

export const globalPipes = [new ValidationPipe()];
