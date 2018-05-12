export default class Transformer {
  /**
   * Instance of application container.
   */
  container

  /**
   * List of rules to transform.
   * 
   * @type {{}}
   */
  rules = {}

  constructor (container) {
    this.container = container
  }

  /**
   * Transform given model according rules.
   *
   * @param {object} model Some model to transform
   * @return {object} Transformed model
   */
  transform (model) {
    for (let sourceField of Object.keys(this.rules)) {
      const handler = this.rules[sourceField]
      if (!model.hasOwnProperty(sourceField)) {
        continue
      }
      model = Object.assign({}, model)
      model = handler(model, this.container)
    }
    return model
  }
}