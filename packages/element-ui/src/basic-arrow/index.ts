import { withInstall } from '@etfm/vea-shared'
import basicArrow from './src/basic-arrow.vue'

export const BasicArrow = withInstall(basicArrow)

export interface IBasicArrow {
  expand: boolean
  up: boolean
  down: boolean
  inset: boolean
}
