import CheckboxClickAction from './CheckboxClickAction'
import AddBlockAction from './AddBlockAction'
import UiActionsPipe from './UiActionsPipe'

/**
 * Factory function for UI action pipes.
 *
 * @since [*next-version*]
 *
 * @param {Container} container
 *
 * @return {Object.<string, UiActionsPipe>} All UI action pipes assembled from config.
 */
export default function (container) {
  const uiActions = container.config['uiActions']
  if (!uiActions) {
    return {}
  }
  let uiActionPipes = []
  for (const pipe of Object.keys(uiActions)) {
    const actionsConfig = uiActions[pipe]
    let actions = []
    for (const config of actionsConfig) {
      if (config.action === 'checkboxClick') {
        actions.push(new CheckboxClickAction(container.jquery, config.arguments))
      }
      else if (config.action === 'addBlock') {
        const renderBlockTemplate = container.makeTemplateRenderFunction(config.arguments.block)
        actions.push(new AddBlockAction(renderBlockTemplate, container.document, config.arguments))
      }
    }
    uiActionPipes[pipe] = new UiActionsPipe(actions)
  }
  return uiActionPipes
}