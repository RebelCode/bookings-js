import Transformer from './Transformer'

/**
 * Transform datetime to format required by server.
 *
 * @param {any} value
 * @param {string} timezone
 * @param {object} container
 *
 * @returns {string}
 */
const transformDatetime = (value, timezone, container) => {
  return container.momentHelpers
    .createInTimezone(value, timezone)
    .format(container.config.formats.datetime.store)
}

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
      model['start'] = transformDatetime(model['start'], timezone, container)
      return model
    },
    end (model, container, { timezone }) {
      model['end'] = transformDatetime(model['end'], timezone, container)
      return model
    },
    repeatUntilDate (model, container, { timezone }) {
      if (model['repeatUntilDate']) {
        model['repeatUntilDate'] = transformDatetime(model['repeatUntilDate'], timezone, container)
      }
      return model
    },
    excludeDates (model, container, { timezone }) {
      model['excludeDates'] = model['excludeDates'].map(excludeDate => {
        return transformDatetime(excludeDate, timezone, container)
      })
      return model
    }
  }
}