import Transformer from './Transformer'

export default class AvailabilityTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    id: (model) => {
      if (model.id[0] === '_') {
        model['id'] = null
      }
      return model
    },
    start: (model, { timezone }) => {
      model['start'] = this.transformDatetime(model['start'], timezone)
      return model
    },
    end: (model, { timezone }) => {
      model['end'] = this.transformDatetime(model['end'], timezone)
      return model
    },
    repeatUntilDate: (model, { timezone }) => {
      if (model['repeatUntilDate']) {
        model['repeatUntilDate'] = this.transformDatetime(model['repeatUntilDate'], timezone)
      }
      return model
    },
    excludeDates: (model, { timezone }) => {
      model['excludeDates'] = model['excludeDates'].map(excludeDate => {
        return this.transformDatetime(excludeDate, timezone)
      })
      return model
    }
  }
}