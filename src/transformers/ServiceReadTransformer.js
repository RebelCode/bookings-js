import { Transformer } from '@rebelcode/std-lib'

/**
 * Transformer that applied to the service before any interactions in the UI.
 *
 * @class SessionLengthReadTransformer
 */
export default class ServiceReadTransformer extends Transformer {
  /**
   * ServiceReadTransformer constructor.
   *
   * @param {AvailabilityReadTransformer} availabilityReadTransformer Transformer for changing availability to using in UI.
   * @param {SessionLengthReadTransformer} sessionLengthReadTransformer Transforms session length data to use it in the UI.
   */
  constructor (availabilityReadTransformer, sessionLengthReadTransformer) {
    super()
    this.availabilityReadTransformer = availabilityReadTransformer
    this.sessionLengthReadTransformer = sessionLengthReadTransformer
  }

  /**
   * Rules that will be applied in order for model.
   *
   * @property {Object.<string, TransformerRuleCallback>} rules
   */
  rules = {
    availability: (model, { timezone }) => {
      model.availability['rules'] = model.availability.rules.map(availability => {
        return this.availabilityReadTransformer.transform(availability, { timezone })
      })
      return model
    },

    sessionLengths: (model) => {
      model['sessionLengthsStored'] = model.sessionLengths
      model['sessionLengths'] = model.sessionLengths.map(sessionLength => {
        return this.sessionLengthReadTransformer.transform(sessionLength)
      })
      return model
    }
  }
}