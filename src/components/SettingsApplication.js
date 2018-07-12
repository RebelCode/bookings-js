export function CfSettingsApplication (store, { mapActions }, mapStore, settingsKeys) {
  /**
   * Key of settings fields in store.
   *
   * @since [*next-version*]
   *
   * @type {string}
   */
  const STORE_SETTINGS_KEY = 'settings'

  return {
    store,

    inject: {
      /**
       * @since [*next-version*]
       *
       * @property {object} settingsValues Map of setting name to value.
       */
      settingsValues: 'settingsValues',

      /**
       * @since [*next-version*]
       *
       * @property {UpdateCapable} settingsApi Update capable API for settings.
       */
      settingsApi: 'settingsApi',

      /**
       * @since [*next-version*]
       *
       * @property {{settings: object}} config Configuration of application.
       */
      config: 'config',

      /**
       * @since [*next-version*]
       *
       * @property {TranslateFunction} _ Function for i18n strings.
       */
      '_': {
        from: 'translate'
      }
    },

    data () {
      return {
        /**
         * @since [*next-version*]
         *
         * @property {boolean} isSaving Are settings is storing at the moment.
         */
        isSaving: false,

        /**
         * @since [*next-version*]
         *
         * @property {object} initialSettingsValues Initial value of settings.
         */
        initialSettingsValues: {}
      }
    },

    /**
     * Set initial values and update store structure when component is created.
     *
     * @since [*next-version*]
     */
    created () {
      this.initialSettingsValues = Object.assign({}, this.settingsValues)
      this._hydrateStore(settingsKeys, this.settingsValues)
    },

    computed: {
      /**
       * Settings fields in store.
       *
       * @since [*next-version*]
       */
      ...mapStore(STORE_SETTINGS_KEY, settingsKeys),

      /**
       * @since [*next-version*]
       *
       * @property {object} settingsState All settings in store.
       */
      settingsState () {
        return this.$store.state[STORE_SETTINGS_KEY]
      },

      /**
       * @since [*next-version*]
       *
       * @property {object} settingsConfig Configuration of settings UI.
       */
      settingsConfig () {
        return this.config.settings
      }
    },

    methods: {
      /**
       * Store action for updating settings.
       *
       * @since [*next-version*]
       *
       * @method {Function} updateSettings
       */
      ...mapActions([
        'updateSettings'
      ]),

      /**
       * Submit state and update settings.
       *
       * @since [*next-version*]
       *
       * @return {Promise<any>} Settings updating promise.
       */
      submit () {
        this.isSaving = true
        return this.updateSettings(this.settingsApi, this.settingsState)
          .then(() => {
            this.isSaving = false
          })
      },

      /**
       * Revert changes applied to settings.
       *
       * @since [*next-version*]
       */
      revertChanges () {
        for (let fieldName in this.initialSettingsValues) {
          this[fieldName] = this.initialSettingsValues[fieldName]
        }
      },

      /**
       * Set structure of store for settings.
       *
       * @since [*next-version*]
       *
       * @param {object} fields Map of settings fields to its aliases in component.
       * @param {object} values Settings fields values.
       */
      _hydrateStore (fields, values) {
        this.$store.replaceState(Object.assign({}, this.$store.state, {
          [STORE_SETTINGS_KEY]: Object.keys(fields).reduce((obj, key) => {
            obj[key] = values[key] || null;
            return obj;
          }, {})
        }))
      }
    }
  }
}
