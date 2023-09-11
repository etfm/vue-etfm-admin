import type { IPublicApiRouter, Router } from '@etfm/types';
import { GlobalRouter as InnerRouter } from '../router/router';
import { routerSymbol } from './symbols';

export class Route implements IPublicApiRouter {
  private readonly [routerSymbol]: InnerRouter;

  constructor(router: InnerRouter) {
    this[routerSymbol] = router;
  }
  get router(): Router {
    return this[routerSymbol].router;
  }
}
