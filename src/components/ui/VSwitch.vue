<template>
    <div class="switch-option_switch">
        <div class="eddbk-switcher">
            <input type="checkbox"
                   class="eddbk-switcher-checkbox"
                   :id="id"
                   v-model="source"
                   @change="modelChanged"
            >
            <label class="eddbk-switcher-label" :for="id"></label>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true
      },
      model: {
        type: Boolean
      }
    },

    data () {
      return {
        source: this.model
      }
    },

    methods: {
      modelChanged () {
        this.$emit('changed', this.source)
      }
    }
  }
</script>