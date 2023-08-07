export class ClientError extends Error {}

export class AggregateClientError extends AggregateError {}

export class InputValidationError extends ClientError {}

export class AggregateInputValidationError extends AggregateClientError {}

export class IdNotFoundError extends ClientError {}

export class RevMismatchError extends ClientError {}
