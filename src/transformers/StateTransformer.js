import { Transformer } from '@rebelcode/std-lib'

/**
 * Transformer that applied to state before any state interaction in UI.
 *
 * @class StateTransformer
 */
export default class StateTransformer extends Transformer {
  /**
   * StateTransformer constructor.
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
    availabilities: (model, { timezone }) => {
      model.availabilities['rules'] = model.availabilities.rules.map(availability => {
        return this.availabilityReadTransformer.transform(availability, { timezone })
      })
      return model
    },
    sessionLengths: (model) => {
      model['sessionLengths'] = model.sessionLengths.map(sessionLength => {
        return this.sessionLengthReadTransformer.transform(sessionLength)
      })
      return model
    }
  }
}