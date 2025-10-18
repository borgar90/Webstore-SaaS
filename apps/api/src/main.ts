import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((error) => {
  // Surface bootstrap failures during early scaffolding
  console.error('Failed to bootstrap NestJS API', error);
  process.exit(1);
});
