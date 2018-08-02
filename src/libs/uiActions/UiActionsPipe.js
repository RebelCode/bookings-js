/**
 * Set of UI actions that can be ran and reverted.
 *
 * @since [*next-version*]
 */
export default class UiActionsPipe {
  /**
   * UiActionsPipe constructor.
   *
   * @param {UiAction[]} actions List of UI actions.
   */
  constructor (actions) {
    this.actions = actions
  }

  /**
   * Run every action of this pipe.
   *
   * @since [*next-version*]
   */
  act () {
    for (const action of this.actions) {
      try {
        action.act()
      }
      catch (e) {
        console.error('Error occurred during acting pipe\'s action', action, e)
      }
    }
  }

  /**
   * Revert every action of this pipe.
   *
   * @since [*next-version*]
   */
  revert () {
    for (const action of this.actions) {
      try {
        action.revert()
      }
      catch (e) {
        console.error('Error occurred during reverting pipe\'s action', action, e)
      }
    }
  }
}
