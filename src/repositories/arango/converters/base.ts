import type * as jsBase from '#/models/base';
import type * as arangoBase from '../models/base';

export function idFromArango(
  id: arangoBase.WithKey<unknown>
): jsBase.WithId<unknown> {
  return {
    id: id._key,
    rev: id._rev,
    updatedAt: new Date(id.updatedAt),
    createdAt: new Date(id.createdAt),
  };
}

export function dateFromArango(date: number): Date {
  return new Date(date);
}

export function bufferFromArango(buffer: string): Buffer {
  return Buffer.from(buffer, 'base64');
}

export function dateToArango(date: Date): number {
  return date.getTime();
}

export function bufferToArango(buffer: Buffer): string {
  return buffer.toString('base64');
}
