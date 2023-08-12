export class ClientError extends Error {}

export class AggregateClientError extends AggregateError {}

export class InputValidationError extends ClientError {}

export class AggregateInputValidationError extends AggregateClientError {}

export class IdNotFoundError extends ClientError {}

export class RevMismatchError extends ClientError {}

export class ClientFilterError extends ClientError {
  constructor(
    readonly property: string,
    readonly operator: string,
    readonly type: string
  ) {
    super(
      `Operator '${operator}' not supported for property '${property}' of type '${type}'`
    );
  }
}

export class FilterError extends Error {
  constructor(
    readonly property: string,
    readonly operator: string,
    readonly type: string
  ) {
    super(
      `Operator '${operator}' not supported for property '${property}' of type '${type}'`
    );
  }
}
