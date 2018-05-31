import Transformer from './Transformer'

/**
 * Transformer that applied to sessions before any interaction in UI.
 *
 * @class SessionReadTransformer
 */
export default class SessionReadTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    start: (model) => {
      model['duration'] = this.moment(model.end).unix() - this.moment(model.start).unix()
      model['monthKey'] = this.moment(model.start).format(this.dateFormats.monthKey)
      return model
    }
  }
}