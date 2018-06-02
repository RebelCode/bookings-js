import { Transformer } from '@rebelcode/std-lib'

/**
 * Transformer that applied to availability before manipulating with it in the UI.
 *
 * @class AvailabilityReadTransformer
 */
export default class AvailabilityReadTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    start: (model, { timezone }) => {
      model['start'] = this.transformDatetimeForUi(model['start'], timezone)
      return model
    },
    end: (model, { timezone }) => {
      model['end'] = this.transformDatetimeForUi(model['end'], timezone)
      return model
    },
    repeatUntilDate: (model, { timezone }) => {
      if (model['repeatUntilDate']) {
        model['repeatUntilDate'] = this.transformDatetimeForUi(model['repeatUntilDate'], timezone)
      }
      return model
    },
    excludeDates: (model, { timezone }) => {
      model['excludeDates'] = model['excludeDates'].map(excludeDate => {
        return this.transformDatetimeForUi(excludeDate, timezone)
      })
      return model
    }
  }
}