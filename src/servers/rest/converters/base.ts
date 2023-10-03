import type * as jsBase from '#/models/base';
import type * as restBase from '../models/base';

export function idToRest(id: jsBase.WithId<unknown>): restBase.WithId<unknown> {
  return {
    id: id.id,
    rev: id.rev,
    updatedAt: dateToRest(id.updatedAt),
    createdAt: dateToRest(id.createdAt),
  };
}

export function dateFromRest(date: number): Date {
  return new Date(date);
}

export function bufferFromRest(buffer: string): Buffer {
  return Buffer.from(buffer, 'base64');
}

export function dateToRest(date: Date): number {
  return date.getTime();
}

export function bufferToRest(buffer: Buffer): string {
  return buffer.toString('base64');
}
