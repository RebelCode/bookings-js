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
    /**
     * Add helping time related fields to model.
     *
     * @param {object} model Model to transform.
     *
     * @return {*}
     */
    start: (model) => {
      model['startUnix'] = this.moment(model.start).unix()
      model['endUnix'] = this.moment(model.end).unix()
      model['duration'] = model.endUnix - model.startUnix
      return model
    },
    /**
     * Transform service to Number.
     *
     * @param {object} model Model to transform.
     *
     * @return {*}
     */
    service: (model) => {
      model['service'] = parseInt(model['service'])
      return model
    },
    /**
     * Transform resource to Number.
     *
     * @param {object} model Model to transform.
     *
     * @return {*}
     */
    resource: (model) => {
      model['resource'] = parseInt(model['resource'])
      return model
    }
  }
}