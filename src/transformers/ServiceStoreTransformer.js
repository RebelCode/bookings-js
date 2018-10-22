import { Transformer } from '@rebelcode/std-lib'

/**
 * Transformer that applied to the service before saving it on a server.
 *
 * @class ServiceStoreTransformer
 */
export default class ServiceStoreTransformer extends Transformer {
  /**
   * ServiceStoreTransformer constructor.
   *
   * @param {AvailabilityStoreTransformer} availabilityStoreTransformer Transformer for changing availability for saving.
   */
  constructor (availabilityStoreTransformer) {
    super()
    this.availabilityStoreTransformer = availabilityStoreTransformer
  }

  /**
   * Rules that will be applied in order for model.
   *
   * @property {Object.<string, TransformerRuleCallback>} rules
   */
  rules = {
    availability: (model, { timezone }) => {
      model.availability['rules'] = model.availability.rules.map(item => {
        return this.availabilityStoreTransformer.transform(Object.assign({}, item), {timezone})
      })
      return model
    },

    sessionLengthsStored: (model) => {
      delete model['sessionLengthsStored']
      return model
    },

    imageSrc: (model) => {
      delete model['imageSrc']
      return model
    },
  }
}