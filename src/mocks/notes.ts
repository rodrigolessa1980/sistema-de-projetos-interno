import type { TaskNote, TaskAttachment } from "@/types";

export const mockTaskNotes: TaskNote[] = [
  {
    id: "note-1",
    taskId: "task-1",
    userId: "user-2",
    content:
      "## Referências técnicas\n\n- [RFC 6238 — TOTP](https://datatracker.ietf.org/doc/html/rfc6238)\n- Biblioteca recomendada: `otpauth` (TypeScript nativa)\n- QR Code: usar `qrcode.react`\n\n**Observação:** confirmar com Rafael se backup codes devem expirar após uso único ou ter reuso.",
    isPinned: true,
    createdAt: "2024-04-15T10:00:00.000Z",
    updatedAt: "2024-04-16T09:30:00.000Z",
  },
  {
    id: "note-2",
    taskId: "task-1",
    userId: "user-2",
    content:
      "Testado com Google Authenticator e Authy — ambos funcionando. Microsoft Authenticator apresentou delay de ~2s, investigar.",
    isPinned: false,
    createdAt: "2024-04-17T14:00:00.000Z",
    updatedAt: "2024-04-17T14:00:00.000Z",
  },
  {
    id: "note-3",
    taskId: "task-6",
    userId: "user-6",
    content:
      "## Webhook Stripe\n\nEndpoints configurados:\n- `/api/webhooks/stripe` — recebe eventos\n- Eventos monitorados: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`\n\nAtenção: usar `stripe.webhooks.constructEvent` para validar assinatura!",
    isPinned: true,
    createdAt: "2024-04-18T11:00:00.000Z",
    updatedAt: "2024-04-20T16:00:00.000Z",
  },
  {
    id: "note-4",
    taskId: "task-7",
    userId: "user-4",
    content:
      "Taxa de acerto OCR por documento:\n- CNH: **96%**\n- CPF (frente): **98%**\n- CPF (verso): **91%** ← investigar melhoria\n\nPróximo passo: testar com documentos mais antigos (pré-2010).",
    isPinned: false,
    createdAt: "2024-04-14T15:00:00.000Z",
    updatedAt: "2024-04-14T15:00:00.000Z",
  },
];

export const mockTaskAttachments: TaskAttachment[] = [];
