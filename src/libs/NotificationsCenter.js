/**
 * Library agnostic wrapper for notifications.
 *
 * @since [*next-version*]
 */
export default {
  /**
   * Install plugin.
   *
   * @since [*next-version*]
   *
   * @param {Vue} Vue VueJS instance.
   *
   * @param {Function} show Function implementation for displaying messages.
   * @param {Function} error Function implementation for displaying errors.
   */
  install (Vue, { show, error }) {
    Vue.prototype.$notificationsCenter = {
      /**
       * Display informational message.
       *
       * @since [*next-version*]
       *
       * @param {string} msg Message for displaying
       * @param {object} options Options for notification.
       */
      show (msg, options = {}) {
        show(msg, options)
      },

      /**
       * Display error message.
       *
       * @since [*next-version*]
       *
       * @param {string} msg Message for displaying
       * @param {object} options Options for notification.
       */
      error (msg, options = {}) {
        error(msg, options)
      }
    }
  }
}