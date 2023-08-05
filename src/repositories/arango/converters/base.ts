import * as dbBase from '#/repositories/arango/services/base';
import * as jsBase from '#/repositories/interfaces/base';

export interface ArangoConverter<Db extends object, Js extends object> {
  /**
   * Convert the object that comes from Arango into its JS form.
   *
   * This most often means deserializing `Buffer`s and `Date`s
   *
   * @see fromJs
   */
  toJs(db: dbBase.WithKey<Db>): jsBase.WithId<Js>;
  toJs(db: dbBase.WithKey<Db> | null): jsBase.WithId<Js> | null;

  /**
   * Converts an object in JS form to what is stored in Arango.
   *
   * This most often means serializing `Buffer`s and `Date`s
   *
   * @see toJs
   */
  fromJs(js: Js): Db;
  fromJs(js: Partial<Js>): Partial<Db>;

  /**
   * Convert a filter with JS Types into one for Arango
   *
   * This most often means serializing `Buffer`s and `Date`s
   */
  filterFromJs(
    filter: jsBase.TypeFilter<Js> | undefined
  ): dbBase.TypeFilter<Db> | undefined;
}
