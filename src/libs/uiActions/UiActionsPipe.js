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
      action.act()
    }
  }

  /**
   * Revert every action of this pipe.
   *
   * @since [*next-version*]
   */
  revert () {
    for (const action of this.actions) {
      action.revert()
    }
  }
}
