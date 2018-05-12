import Transformer from './Transformer'

export default class BookingTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    service (model) {
      model['service'] = model['service'].id
      model['resource'] = model['service']
      return model
    },
    client (model) {
      model['client'] = model['client'].id
      return model
    },
    newStatus (model) {
      model['transition'] = model['newStatus']
      delete model['newStatus']
      delete model['status']
      return model
    },
    isTrusted (model) {
      delete model['isTrusted']
      return model
    },
    start (model, container) {
      model['start'] = container.moment.utc(model['start']).unix()
      return model
    },
    end (model, container) {
      model['end'] = container.moment.utc(model['end']).unix()
      return model
    }
  }
}