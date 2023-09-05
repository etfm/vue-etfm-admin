import type { IPublicApiRouter, Router } from '@etfm/types';
import { GlobalRouter as InnerRouter } from '../router/router';
import { editorSymbol, routerSymbol } from './symbols';
import { Editor } from '../editor';

export class Route implements IPublicApiRouter {
  private readonly [routerSymbol]: InnerRouter;

  constructor(editor: Editor, router: InnerRouter) {
    this[routerSymbol] = router;
    this[editorSymbol] = editor;
  }
  get router(): Router {
    return this[routerSymbol].router;
  }
}
