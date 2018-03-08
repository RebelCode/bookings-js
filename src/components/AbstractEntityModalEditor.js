import { FunctionalArrayCollection } from '@rebelcode/std-lib'

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

    data () {
      return {
        /**
         * Is remove confirmation visible
         *
         * @var {boolean}
         */
        removeConfirming: false,

        /**
         * Editing entity items collection. Used to remove editing
         * items from it when user confirm deletion.
         *
         * @var {FunctionalArrayCollection}
         */
        itemsCollection: new FunctionalArrayCollection(() => {
          return this.entities
        }, (newAvailabilities) => {
          this.setNewEntities(newAvailabilities)
        }, (item) => {
          return item.id
        }),
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
      }
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

      if (!this.entities) {
        throw new Error('Entities list is not provided. It should be available via this.entities')
      }

      if (!this.setNewEntities) {
        throw new Error('Method for setting new entities is not provided. It should be available via this.setNewEntities')
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
        this.model = Object.assign({}, this.$model, this.entityModel)

        /**
         * Set default confirmation state
         *
         * @type {boolean}
         */
        this.removeConfirming = false
      },

      /**
       * Close modal.
       */
      closeModal () {
        this.modalState.setState(false)
      },

      /**
       * Remove entity from store and close modal.
       *
       * This happens when user confirmed that he wants
       * to delete entity item.
       */
      deleteItem () {
        this.itemsCollection.removeItem(this.model)
        this.closeModal()
      },
    }
  })
}