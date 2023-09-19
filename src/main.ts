import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CustomSerializationInterceptor } from './Shared/Serialization/CustomSerializationInterceptor';
import { ValidationPipe } from '@nestjs/common';
import { HTTPSerializableInterceptor } from './Shared/Exceptions/HTTPSerializableInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  if (configService.get('CREATE_SWAGGER_DOC') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Fytech backend')
      .setDescription('Fytech backend API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalInterceptors(new CustomSerializationInterceptor());
  app.useGlobalInterceptors(new HTTPSerializableInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
