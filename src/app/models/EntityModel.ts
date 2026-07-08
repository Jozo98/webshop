export interface CollectionModel<T> {
  _embedded: {
    productList: T[];
  };
  _links: {
    self: { href: string };
  };
}