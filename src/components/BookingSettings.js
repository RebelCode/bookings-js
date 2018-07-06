export default function () {
  return {
    inject: {
      fields: {
        from: 'settingsFields'
      }
    },
    created () {
      this._hydrateStore(this.fields)
    },
    methods: {
      _hydrateStore (fields) {
        //
      }
    }
  }
}