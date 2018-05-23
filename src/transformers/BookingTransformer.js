import Transformer from './Transformer'

/**
 * Prepare data for booking saving endpoins.
 */
export default class BookingTransformer extends Transformer {
  /**
   * Rules that will be applied in order for model.
   *
   * @property {object} rules
   */
  rules = {
    /**
     * Remove service information and left only service's id for sending to API.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    service: (model) => {
      model['service'] = model['service'].id
      model['resource'] = model['service']
      return model
    },
    /**
     * Remove client information and set only client's id.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    client: (model) => {
      model['client'] = model['client'].id
      return model
    },
    /**
     * Remove transition field if not set to not send empty value
     * to API.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    transition: (model) => {
      if (!model['transition']) {
        delete model['transition']
      }
      return model
    },
    /**
     * Remove `isTrusted` property from object before sending on API.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    isTrusted: (model) => {
      delete model['isTrusted']
      return model
    },
    /**
     * Transform booking start date to ISO8601 before sending on API.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    start: (model) => {
      model['start'] = this.moment(model['start']).format()
      return model
    },
    /**
     * Transform booking end date to ISO8601 before sending on API.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    end: (model) => {
      model['end'] = this.moment(model['end']).format()
      return model
    },
    /**
     * Remove `clientTzName` field and send `clientTz` to API instead.
     *
     * @param {object} model Model to transform
     *
     * @return {object} Transformed model
     */
    clientTzName: (model) => {
      model['clientTz'] = model['clientTzName']
      delete model['clientTzName']
      return model
    },
  }
}