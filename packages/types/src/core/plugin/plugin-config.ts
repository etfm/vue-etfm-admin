export interface IPublicTypePluginConfig {
  name: string;
  init(): void;
  destroy?(): void;
  exports?(): any;
}
