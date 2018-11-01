import template from './template.html'

export default function (AbstractEntityModalEditor, { mapState }) {
  return AbstractEntityModalEditor.extend({
    ...template,
    inject: {
      _: {
        from: 'translate'
      },

      'inline-editor': 'inline-editor',

      modalState: {
        from: 'sessionEditorState'
      },

      'config': 'config'
    },
    data () {
      return {
        /**
         * Default session model. Used as form data
         * for the new session form.
         */
        model: {
          sessionLength: null,
          price: null
        },

        timeUnits: [{
          title: this._('mins'),
          seconds: 60,
        },{
          title: this._('hours'),
          seconds: 60 * 60,
        }, {
          title: this._('days'),
          seconds: 60 * 60 * 24
        }, {
          title: this._('weeks'),
          seconds: 60 * 60 * 24 * 7
        }],

        sessionTimeUnit: 60,
      }
    },
    props: {
      /**
       * Collection of availabilities.
       *
       * @since [next-version]
       *
       * @var {FunctionalCollection} entitiesCollection
       */
      entitiesCollection: {}
    },
    computed: {
      ...mapState('services', {
        entityModel: 'oneSession'
      }),
    },
    methods: {
      /**
       * Normalize session length information by transforming session duration
       * in selected time units to duration in seconds.
       *
       * @param {SessionLength} sessionLength Session length to normalize.
       *
       * @return {SessionLength} Normalized session length.
       */
      normalizeSessionLength (sessionLength) {
        const sessionDuration = this.sessionTimeUnit * sessionLength.sessionLength
        return {
          sessionLength: sessionDuration,
          price: sessionLength.price
        }
      },

      /**
       * Validate current session and if everything is fine, save it.
       */
      saveSession () {
        this.saveItem()
        // this.$validator.validateAll().then((result) => {
        //   if (!result) {
        //     return
        //   }
        // })
      }
    },
    components: {
      'inline-editor': 'inline-editor'
    }
  })
}