import { Transformer } from '@rebelcode/std-lib'

/**
 * Transformer that applied to session length before saving.
 *
 * @class SessionLengthStoreTransformer
 */
export default class SessionLengthStoreTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {Object.<string, TransformerRuleCallback>} rules
   */
  rules = {
    id: (model) => {
      if (model['id'][0] === '_') {
        delete model['id']
      }
      return model
    }
  }
}