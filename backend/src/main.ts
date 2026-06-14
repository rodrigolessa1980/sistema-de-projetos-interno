import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './infra/http/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.setGlobalPrefix('api');
  const configuredOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const allowedOrigins = new Set([
    'http://localhost:8022',
    'http://127.0.0.1:8022',
    'http://143.198.155.216:8022',
    ...configuredOrigins,
  ]);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const normalizedOrigin = origin?.replace(/\/$/, '');
      if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  });

  const express = require('express');
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  const port = Number(process.env.PORT ?? 4011);
  await app.listen(port, '0.0.0.0');
  console.log(`DevFlow API rodando em http://0.0.0.0:${port}/api`);
}
bootstrap().catch((error) => {
  console.error('Falha ao iniciar a API:', error);
  process.exit(1);
});
