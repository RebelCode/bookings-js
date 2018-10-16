export default {
  /**
   * Whether the list of services is loading.
   *
   * @since [*next-version*]
   *
   * @property {boolean} isLoadingList
   */
  isLoadingList: false,

  /**
   * The list of services on the screen.
   *
   * @since [*next-version*]
   *
   * @property {object[]} list
   */
  list: [],

  /**
   * Whether the service's editor is visible.
   *
   * @since [*next-version*]
   *
   * @property {boolean} isModalVisible
   */
  isModalVisible: false,

  /**
   * The service that is being edited.
   *
   * @since [*next-version*]
   *
   * @property {object} one
   */
  one: {
    id: null,
    timezone: 'UTC+0',
    availabilities: [],
    sessionLengths: [],
    displayOptions: {
      allowCustomerChangeTimezone: false
    }
  }
}