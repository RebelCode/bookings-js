import Transformer from './Transformer'

/**
 * Prepare data for booking saving endpoins.
 */
export default class BookingTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    service: (model) => {
      model['service'] = model['service'].id
      model['resource'] = model['service']
      return model
    },
    client: (model) => {
      model['client'] = model['client'].id
      return model
    },
    transition: (model) => {
      if (!model['transition']) {
        delete model['transition']
      }
      return model
    },
    isTrusted: (model) => {
      delete model['isTrusted']
      return model
    },
    start: (model) => {
      model['start'] = this.moment(model['start']).format()
      return model
    },
    end: (model) => {
      model['end'] = this.moment(model['end']).format()
      return model
    },
    clientTzName: (model) => {
      model['clientTz'] = model['clientTzName']
      delete model['clientTzName']
      return model
    },
  }
}