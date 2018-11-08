export { default as store } from './store'

/**
 * Component for the staff members page.
 *
 * @since [*next-version*]
 *
 * @return {object} Services page component.
 */
export function page (makeItemsListManageCapableMixin, store, { mapActions, mapMutations }, mapStore) {
  return {
    mixins: [
      makeItemsListManageCapableMixin(store, { mapActions, mapMutations }, mapStore, 'staffMembers')
    ],
    inject: {
      /**
       * @var {StaffMembersApi} api The staff members API client.
       *
       * @since [*next-version]
       */
      'api': {
        from: 'servicesApi'
      },

      /**
       * @var {FunctionalToggleable} modalState Modal state injected from elsewhere.
       *
       * @since [*next-version]
       */
      // modalState: {
      //   from: 'serviceEditorState'
      // },

      /**
       * @var {Component} staff-member-editor The staff member editor component.
       *
       * @since [*next-version]
       */
      // 'staff-member-editor': 'staff-member-editor',

      /**
       * @var {Component} staff-members The staff members list component (display the list of staff members).
       *
       * @since [*next-version]
       */
      'staff-members': 'staff-members',
    },

    methods: {
      /**
       * Map the service editor visibility mutation from the store.
       *
       * @since [*next-version*]
       */
      ...mapMutations('services', [
        'setServiceEditorState'
      ]),

      /**
       * Open staff member's modal.
       *
       * @since [*next-version*]
       *
       * @param {service} staffMember The staff member that is being edited.
       */
      openEditor (staffMember = {}) {
        // this.modalState.setState(true)
        // this.setServiceEditorState(service)
      },
    },

    /**
     * Components definitions.
     *
     * @see `inject` property in this component for each component's description.
     */
    components: {
      'staff-members': 'staff-members',
      // 'staff-member-editor': 'staff-member-editor',
    },
  }
}
