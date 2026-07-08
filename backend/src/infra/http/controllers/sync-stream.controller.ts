import { Controller, MessageEvent, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable, filter, interval, map, merge } from 'rxjs';
import { SseAuthGuard } from '../guards/sse-auth.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { syncEvents } from '../../sync/sync-events';

/**
 * INC-14: stream SSE por tenant. Emite um "sinal" quando algo muda no grupo do usuário;
 * o cliente então busca o delta (`/sync/changes?since=`). Um heartbeat periódico mantém
 * a conexão viva atrás de proxies. Guardado por SseAuthGuard (token via query).
 *
 * Controller próprio (SEM os guards de classe do resto) porque o EventSource não manda
 * header Authorization. O polling do INC-12 permanece como fallback se o SSE cair.
 */
@Controller()
export class SyncStreamController {
  @Sse('sync/stream')
  @UseGuards(SseAuthGuard)
  stream(@Req() req: AuthenticatedRequest): Observable<MessageEvent> {
    const tenantId = req.tenantId;

    const changes = syncEvents.asObservable().pipe(
      filter((event) => event.tenantId === tenantId),
      map(() => ({ data: { type: 'changed' } }) as MessageEvent),
    );

    // Heartbeat (comentário SSE) a cada 30s p/ não deixar a conexão ociosa cair.
    const heartbeat = interval(30_000).pipe(map(() => ({ data: { type: 'ping' } }) as MessageEvent));

    return merge(changes, heartbeat);
  }
}
