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

  constructor (deps = {}) {
    for (let key in deps) {
      this[key] = deps[key]
    }
  }

  /**
   * Transform given model according rules.
   *
   * @param {object} model Some model to transform
   * @param {object} payload Additional data to use while transformation
   *
   * @return {object} Transformed model
   */
  transform (model, payload = {}) {
    for (let sourceField of Object.keys(this.rules)) {
      const handler = this.rules[sourceField]
      if (!model.hasOwnProperty(sourceField)) {
        continue
      }
      model = Object.assign({}, model)
      model = handler(model, payload)
    }
    return model
  }
}