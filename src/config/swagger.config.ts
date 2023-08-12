import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as swaggerConstants from '../constants/swagger.constants';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(swaggerConstants.SWAGGER_TITLE)
    .setDescription(swaggerConstants.SWAGGER_DESCRIPTION)
    .setVersion(swaggerConstants.SWAGGER_VERSION)
    .addTag(swaggerConstants.SWAGGER_TAG)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
