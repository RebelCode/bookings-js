/**
 * Abstraction for entities modal editor. This is needed because all
 * entities modal editors have common things under the hood:
 *
 * - can remove entity from it's store after confirmation
 * - edit or create model based on data from store
 * - @todo: asking for confirmation when closing modal with model's data *changed*
 *
 * @param Vue
 * @return {*}
 * @constructor
 */
export default function CfAbstractEntityModalEditor (Vue) {
  return Vue.extend({
    /**
     * Empty model that will be seeded with fields
     * on component's mount.
     *
     * @var {{}}
     */
    $model: {},

    inject: [
      'equal'
    ],

    data () {
      return {
        /**
         * Lock for model watching when we seed model
         */
        seedLock: false,

        /**
         * Is remove confirmation visible
         *
         * @var {boolean}
         */
        removeConfirming: false,

        /**
         * Is close confirmation visible
         *
         * @var {boolean}
         */
        closeConfirming: false,

        /**
         * Model state that was opened for creating OR for editing.
         *
         * @var {{}}
         */
        mountedModel: {}
      }
    },

    computed: {
      /**
       * Is modal with fields visible.
       *
       * @var {boolean}
       */
      modalIsVisible () {
        return this.modalState.isOn()
      },

      /**
       * Are we in the double confirmation mode
       *
       * @var {boolean}
       */
      isDoubleConfirming () {
        return this.removeConfirming
          || this.closeConfirming;
      },

      /**
       * Check model is changed.
       *
       * @return {boolean}
       */
      isModelChanged () {
        return !this.equal(this.model, this.mountedModel)
      },
    },

    watch: {
      /**
       * Watch for modal opening and if modal is opened, seed
       * model fields with data that already in the store.
       */
      modalIsVisible () {
        this.seedModelFields()
      }
    },

    /**
     * Do initialization stuff on component mount. It will check that everything
     * is passed correctly and child component will work without any problems.
     *
     * Also here we copying initial model to the this.$model field, so we will be able to:
     *
     * - restore initial empty state when we need it
     * - create entities with seeded fields
     */
    mounted () {
      if (!this.model) {
        throw new Error('Model empty state is not provided. It should be available via this.model and describe entity')
      }

      if (!this.modalState) {
        throw new Error('Modal state toggle is not provided. It should be available via this.modalState')
      }

      if (!this.entityModel) {
        throw new Error('Entity model is not provided. It should be available via this.entityModel')
      }

      if (!this.itemsCollection) {
        throw new Error('Entities collection is not provided. It should be available via this.itemsCollection ' +
          'and has type of FunctionalCollection')
      }

      /*
       * Store initial empty model
       */
      this.$model = Object.assign({}, this.model)
    },

    methods: {
      /**
       * Prepare model for editing. It can be new model or model for editing.
       * Model fields seeded by values from Vuex store.
       */
      seedModelFields () {
        this.seedLock = true

        let model = Object.assign({}, this.$model, this.entityModel)

        Object.keys(model).map((key) => {
          Vue.set(this.model, key, JSON.parse(JSON.stringify(model[key])))
          Vue.set(this.mountedModel, key, JSON.parse(JSON.stringify(model[key])))
        })

        /**
         * Set default confirmation state
         *
         * @type {boolean}
         */
        this.removeConfirming = false
        this.closeConfirming = false

        this.seedLock = false
      },

      /**
       * Show close modal confirmation if editing model
       * was changed.
       */
      closeModal () {
        if (this.isModelChanged) {
          this.closeConfirming = true
          return
        }

        this.forceCloseModal()
      },

      /**
       * Close modal without data saving
       */
      forceCloseModal () {
        this.modalState.setState(false)
      },

      /**
       * Continue editing and don't close the modal
       */
      continueEditing () {
        this.closeConfirming = false
      },

      /**
       * Save editing item. If items is new it will update
       * all items in store by adding new item.
       *
       * If item is editing it will remove and add new item to the store.
       *
       * @todo: review
       */
      saveItem () {
        let model = Object.assign({}, this.model)

        if (!model.id) {
          let id = Math.random().toString(36).substring(7)
          this.itemsCollection.addItem(Object.assign({}, model, { id }))

          this.forceCloseModal()
          return
        }

        /**
         * Update model
         */
        if (this.itemsCollection.hasItem(model)) {
          this.itemsCollection.removeItem(model)
          this.itemsCollection.addItem(model)
        }

        this.forceCloseModal()
      },

      /**
       * Remove entity from store and close modal.
       *
       * This happens when user confirmed that he wants
       * to delete entity item.
       */
      deleteItem () {
        this.itemsCollection.removeItem(this.model)
        this.forceCloseModal()
      },
    }
  })
}