import { IGlobalRouter, IPublicApiRouter, Router } from '@etfma/types';
import { globalRouterSymbol } from './symbols';

export class GlobalRouter implements IPublicApiRouter {
  private readonly [globalRouterSymbol]: IGlobalRouter;

  constructor(router: IGlobalRouter) {
    this[globalRouterSymbol] = router;
  }

  get router(): Router {
    return this[globalRouterSymbol].router;
  }
}
