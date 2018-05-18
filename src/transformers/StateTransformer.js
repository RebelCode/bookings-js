import Transformer from './Transformer'

/**
 * Transformer that applied to state before any state interaction in UI.
 *
 * @class StateTransformer
 */
export default class StateTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
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