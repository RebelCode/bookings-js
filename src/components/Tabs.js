export default function (TabsParent) {
  return TabsParent.extend({
    props: {
      isTabsNavigationDisabled: {
        default: false
      }
    },
    methods: {
      renderTabsSwitcher (h) {
        let tabs = this.getTabs()

        return h('div', {
          class: [
            this.isTabsNavigationDisabled ? 'disabled' : '',
            this.config.switcherClass
          ]
        }, tabs.map((tab, i) => {
          return h('div', {
            class: [
              this.config.switcherItemClass,
              this.value === this.getTabId(tab, i) ? this.config.switcherActiveItemClass : ''
            ],
            on: {
              click: () => {
                this.$emit('input', this.getTabId(tab, i));
              }
            }
          }, tab.componentOptions.propsData.title)
        }))
      }
    }
  })
}
