/*
 * This is entry point for application.
 *
 * Require JS will be used here to load all needed
 * dependencies (Vue at least).
 */
document.addEventListener('DOMContentLoaded', function () {
    require.config({
        paths: Object.assign(RC_APP_REQUIRE_FILES, {
            bottle: 'https://cdnjs.cloudflare.com/ajax/libs/bottlejs/1.6.1/bottle.min',
            vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.4/vue',
            vuex: 'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex',
            jquery: 'https://code.jquery.com/jquery-2.2.4.min',

            uiFramework: 'https://unpkg.com/@rebelcode/ui-framework@0.1.0/dist/static/js/uiFramework',
            calendar: 'https://unpkg.com/@rebelcode/vc-calendar@0.1.0/dist/vc-calender', //fix
            repeater: 'https://unpkg.com/@rebelcode/vc-repeater@0.1.0/dist/vc-repeater',
            tabs: 'https://unpkg.com/@rebelcode/vc-tabs@0.1.0/dist/vc-tabs',

            fullCalendar: 'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.0/fullcalendar.min',
            lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
            moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min',

            cfToggleable: 'https://unpkg.com/@rebelcode/vc-toggleable@0.1.3/dist/umd/lib.min'
        })
    });

    var dependenciesList = ['app', 'cfToggleable',
        'uiFramework',
        'bottle', 'vue', 'vuex',
        'calendar',
        'tabs',
        'repeater',
        'jquery', 'fullCalendar', 'lodash', 'moment'
    ];

    require(dependenciesList, function () {
        var dependencies = {};
        for (var i = 0; i < dependenciesList.length; i++) {
            dependencies[dependenciesList[i]] = arguments[i]
        }

        var di = new dependencies.bottle();
        defineServices(di, dependencies);

        var container = new dependencies.uiFramework.Container.Container(di);
        var app = new dependencies.uiFramework.Core.App(container);
        app.init();
    });

    function defineServices (di, dependencies) {
        var serviceList = dependencies.app.services(dependencies, document);
        for(var i = 0; i < Object.keys(serviceList).length; i++) {
            var serviceName = Object.keys(serviceList)[i];
            di.factory(serviceName, serviceList[serviceName]);
        }
    }
});