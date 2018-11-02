import template from './template.html'
import { guessUnit } from '../../libs/sessionHelpers'

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
          id: null,
          sessionLength: null,
          price: null
        },

        duration: null,

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
    mounted () {
      this.$on('seed', () => {
        const guessedUnit = guessUnit(this.model.sessionLength) || 0
        this.sessionTimeUnit = this.timeUnits[guessedUnit].seconds
        this.duration = Number(this.model.sessionLength) / this.sessionTimeUnit || null
      })
    },
    methods: {
      /**
       * Validate current session and if everything is fine, save it.
       */
      saveSession () {
        this.model.sessionLength = this.duration * this.sessionTimeUnit
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