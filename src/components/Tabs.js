export default function CfTabs(Vue) {
    return Vue.extend({
        props: {
            value: {},

            options: {
                type: Object,
                default () {
                    return {}
                }
            }
        },

        computed: {
            config ()
            {
                let defaultConfig = {
                    switcherClass: 'tabs',
                    switcherItemClass: 'tabs-item',
                    switcherActiveItemClass: 'active',
                    tabsClass: 'tabs-content'
                };

                return {...defaultConfig, ...this.options};
            }
        },

        methods: {
            /**
             * Get all tabs
             *
             * @return [VNode]
             */
            getTabs ()
            {
                return this.$slots.default.filter(component => {
                    return component.componentOptions && component.componentOptions.tag === 'tab'
                });
            },

            getTabId (tab, i)
            {
                return tab.componentOptions.propsData.id || i;
            },

            /**
             * Render tab switcher
             *
             * @param h
             * @return [VNode]
             */
            renderTabsSwitcher (h)
            {
                let tabs = this.getTabs();

                return h('div', {
                    class: this.config.switcherClass
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
            },

            /**
             * Render active tab
             *
             * @param h
             * @return [VNode]
             */
            renderTabs (h)
            {
                let tabs = this.getTabs();

                return h('div', {
                    class: this.config.tabsClass
                }, tabs.filter((tab, i) => {
                    return this.getTabId(tab, i) === this.value;
                }))
            }
        },

        render (h) {
            return h('div', [
                this.renderTabsSwitcher(h),
                this.renderTabs(h)
            ])
        },
    });
}