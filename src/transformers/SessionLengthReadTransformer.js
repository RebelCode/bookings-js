import { Transformer } from '@rebelcode/std-lib'

/**
 * Transformer that applied to session length before any state interaction in UI.
 *
 * @class SessionLengthReadTransformer
 */
export default class SessionLengthReadTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {Object.<string, TransformerRuleCallback>} rules
   */
  rules = {
    price: (model) => {
      if (!model['id']) {
        model['id'] = '_' + Math.random().toString(36).substring(7)
      }
      model['price'] = model.price.amount
      return model
    }
  }
}