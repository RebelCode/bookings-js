import Transformer from './Transformer'

export default class AvailabilityTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    id (model) {
      if (model.id[0] === '_') {
        model['id'] = null
      }
      return model
    },
    start (model, container, { timezone }) {
      model['start'] = container.momentHelpers
        .createInTimezone(model['start'], timezone)
        .format()
      return model
    },
    end (model, container, { timezone }) {
      model['end'] = container.momentHelpers
        .createInTimezone(model['end'], timezone)
        .format()
      return model
    }
  }
}