import Transformer from './Transformer'

/**
 * Transformer that applied to session length before any state interaction in UI.
 *
 * @class SessionLengthReadTransformer
 */
export default class SessionLengthReadTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    price: (model) => {
      model['price'] = model.price.amount
      return model
    }
  }
}