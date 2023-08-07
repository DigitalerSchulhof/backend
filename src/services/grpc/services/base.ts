export abstract class GrpcService<Service> {
  constructor(private service: Service) {}
}
