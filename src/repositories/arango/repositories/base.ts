import { ListResult, SearchOptions, TypeFilter } from '#/models/base';
import { Database } from 'arangojs';
import * as aql from 'arangojs/aql';
import { DocumentCollection } from 'arangojs/collection';
import { ArrayCursor } from 'arangojs/cursor';
import { QueryOptions } from 'arangojs/database';
import { ArangoError } from 'arangojs/error';
import { WithKey } from '../models/base';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | {
      [key: string]: Serializable;
    };

export abstract class ArangoRepository<
  Base extends Record<string, Serializable>,
> {
  protected abstract readonly collectionName: string;

  private _collectionNameLiteral: DocumentCollection | undefined;
  protected get collectionNameLiteral(): DocumentCollection {
    if (this._collectionNameLiteral === undefined) {
      this._collectionNameLiteral = this.db.collection(this.collectionName);
    }

    return this._collectionNameLiteral;
  }

  constructor(private readonly db: Database) {}

  async search(
    query: SearchOptions<WithKey<Base>>
  ): Promise<ListResult<WithKey<Base>>> {
    const res = await this.query<WithKey<Base>>(
      aql.aql`
        FOR doc IN ${this.collectionNameLiteral}
          ${searchToArangoQuery(query)}
          RETURN UNSET(doc, "_id")
      `,
      { fullCount: true }
    );
    // Unscrew syntax highlighting ``);

    return paginateCursor(res);
  }

  async get(ids: readonly string[]): Promise<(WithKey<Base> | null)[]> {
    const res = await this.query<WithKey<Base> | null>(
      aql.aql`
        FOR id IN ${ids}
          LET doc = DOCUMENT(${this.collectionNameLiteral}, id)
          RETURN doc == null ? null : UNSET(doc, "_id")
      `
    );
    // Unscrew syntax highlighting ``);

    return res.all();
  }

  async create(post: Base): Promise<WithKey<Base>> {
    const res = await this.query<WithKey<Base>>(
      aql.aql`
        INSERT MERGE(
          ${post},
          {
            updatedAt: DATE_NOW(),
            createdAt: DATE_NOW()
          }
        ) INTO ${this.collectionNameLiteral}

        RETURN UNSET(NEW, "_id")
      `
    );
    // Unscrew syntax highlighting ``);

    return (await res.next())!;
  }

  async update(
    id: string,
    patch: Partial<Base>,
    ifRev?: string
  ): Promise<WithKey<Base>> {
    const res = await this.query<WithKey<Base>>(
      aql.aql`
        UPDATE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } WITH MERGE(
            ${patch},
            {
              updatedAt: DATE_NOW()
            }
          ) IN ${this.collectionNameLiteral} OPTIONS { ignoreRevs: ${
            ifRev === undefined
          } }

        RETURN UNSET(NEW, "_id")
      `
    );
    // Unscrew syntax highlighting ``);

    return (await res.next())!;
  }

  async updateWhere(
    filter: TypeFilter<WithKey<Base>>,
    patch: Partial<Base>
  ): Promise<number> {
    const res = await this.query<number>(
      aql.aql`
        FOR doc IN ${this.collectionNameLiteral}
          ${
            // Not sure what's up
            filterToArangoQuery(filter as TypeFilter<object>)
          }

          UPDATE {
            _key: doc._key,
            } WITH MERGE(
              ${patch},
              {
                updatedAt: DATE_NOW()
              }
            ) IN ${this.collectionNameLiteral}

          RETURN UNSET(NEW, "_id")
      `
    );
    // Unscrew syntax highlighting ``);

    return res.all();
  }

  async delete(id: string, ifRev?: string): Promise<WithKey<Base>> {
    const res = await this.query<WithKey<Base>>(
      aql.aql`
        REMOVE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } IN ${this.collectionNameLiteral} OPTIONS { ignoreRevs: ${
            ifRev === undefined
          } }
        RETURN UNSET(OLD, "_id")
      `
    );
    // Unscrew syntax highlighting ``);

    return (await res.next())!;
  }

  async deleteWhere(filter: TypeFilter<WithKey<Base>>): Promise<number> {
    const res = await this.query<number>(
      aql.aql`
        FOR doc IN ${this.collectionNameLiteral}
          ${
            // Not sure what's up
            filterToArangoQuery(filter as TypeFilter<object>)
          }

          REMOVE doc IN ${this.collectionNameLiteral}

          RETURN UNSET(OLD, "_id")
      `
    );
    // Unscrew syntax highlighting ``);

    return res.all();
  }

  async query<T>(
    query: aql.GeneratedAqlQuery,
    options?: QueryOptions
  ): Promise<ArrayCursor<T>> {
    try {
      return await this.db.query(query, options);
    } catch (error) {
      // TODO: Handle error handling (attach to error) better
      console.log(query);
      this.handleError(error);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof ArangoError) {
      if (error.errorNum === ERROR_ARANGO_CONFLICT) {
        throw new RevMismatchError();
      }
      if (error.errorNum === ERROR_ARANGO_DOCUMENT_NOT_FOUND) {
        throw new IdNotFoundError();
      }
    }

    if (typeof error === 'object' && error !== null) {
      // It spams the console

      if ('request' in error) {
        delete error.request;
      }

      if ('response' in error) {
        delete error.response;
      }
    }

    throw error;
  }
}

export async function paginateCursor<T>(
  cursor: ArrayCursor<T>
): Promise<ListResult<T>> {
  if (cursor.extra.stats?.fullCount === undefined) {
    throw new Error("Cursor is not paginated. Use '{ fullCount: true }'");
  }

  return {
    items: await cursor.all(),
    total: cursor.extra.stats.fullCount,
  };
}

export const ERROR_ARANGO_CONFLICT = 1200;
export const ERROR_ARANGO_DOCUMENT_NOT_FOUND = 1202;

export class RevMismatchError extends Error {
  constructor() {
    super('Revision mismatch');
  }
}

export class IdNotFoundError extends Error {
  constructor() {
    super('Id not found');
  }
}

const DEFAULT_LIMIT = 25;

function searchToArangoQuery(
  search: SearchOptions<object>
): aql.GeneratedAqlQuery {
  const { filter, order, limit = DEFAULT_LIMIT, offset = 0 } = search;

  const filterQuery =
    filter === undefined ? undefined : filterToArangoQuery(filter);
  const sortQuery = order === undefined ? undefined : orderToArangoQuery(order);

  return aql.aql`
    ${filterQuery}
    ${sortQuery}
    LIMIT ${offset}, ${limit}
  `;
  // Unscrew syntax highlighting ``;
}

function filterToArangoQuery(
  filter: TypeFilter<object>
): aql.GeneratedAqlQuery {
  const res = filterToArangoQueryWorker(filter);

  return aql.aql`
    FILTER ${res}
  `;
  // Unscrew syntax highlighting ``;
}

function filterToArangoQueryWorker(
  filter: TypeFilter<object>
): aql.GeneratedAqlQuery {
  if (filter === null) return aql.aql`TRUE`;

  if ('or' in filter) {
    return aql.aql`
      ${aql.join(filter.or.map(filterToArangoQueryWorker), ' OR ')}
    `;
    // Unscrew syntax highlighting ``;
  }

  if ('and' in filter) {
    return aql.aql`
      ${aql.join(filter.and.map(filterToArangoQueryWorker), ' AND ')}
    `;
    // Unscrew syntax highlighting ``;
  }

  const { property, operator, value } = filter;

  return aql.aql`
    doc.${property} ${operator} ${value}
  `;
  // Unscrew syntax highlighting ``;
}

function orderToArangoQuery(order: string): aql.GeneratedAqlQuery {
  const parts = order.split(',').map((part) => part.trim());

  return aql.aql`
    SORT ${aql.join(
      parts.map((part) => {
        const [property, direction] = part.split(' ');

        return aql.aql`
          doc.${property} ${direction}
        `;
        // Unscrew syntax highlighting ``;
      }),
      ', '
    )}
  `;
  // Unscrew syntax highlighting ``;
}
