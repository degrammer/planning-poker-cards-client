import { HttpFactory } from 'config/httpFactory';
import { Factory } from 'config/factory';
import { ComponentLoader } from 'config/componentLoader';
import { HttpInterceptor } from 'config/httpInterceptor';
import { Routes } from 'config/routes';

export class AppInit {


    configureApplication($stateProvider, $httpProvider, $provide, appData, appConfig, $urlRouterProvider, $mdThemingProvider) {
        "ngInject";
        debugger;
        if (!appConfig) {
            throw 'missing appConfig constant';
        }

        //Register routes
        if (appData && appData.routes) {
            
            angular.forEach(appData.routes, function (route) {
                var componentState = ComponentLoader.getComponentState(angular.module(appConfig.APP_NAME), route);
                var stateName = route.state ? route.state : route.name;
                $stateProvider.state(stateName, componentState);

            });
            $urlRouterProvider.otherwise('/admin/start');
        }

        //Register http interceptors
        $provide.factory('defaultHttpInterceptor', ['$q','PubSub', function ($q, PubSub) {
            return new HttpInterceptor($q,PubSub);
        }]);

        $httpProvider.interceptors.push('defaultHttpInterceptor');

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('blue');
    }

    beforeBootstrap(afterBootstrapCallback) {
        // Do any async request before initialize angular.
        var routes = new Routes().getRoutes()
            .then(function (data) {

                afterBootstrapCallback(data);
            });
    }

    afterBootstrap(data, config) {
        debugger;
        //1) Configure Angular
        let appScope = document.getElementsByTagName(config.APP_SCOPE)[0];

        if (appScope && appScope.attributes["ng-app"]) {
            let ngAppName = appScope.attributes["ng-app"].value;

            if (ngAppName) {
                config.APP_NAME = ngAppName;
            }
        }

        console.log("App is ready:" + config.APP_NAME);

        if (!angular) {
            throw 'Angular is required for this App';
        }

        const appModule = angular.module(config.APP_NAME, config.ANGULAR_MODULES ? config.ANGULAR_MODULES : []);
        // Inject constants and appConfig
        config.authToken = this.getCookie("authToken");
        config.userName = this.getCookie("userName");
        appModule.constant("appConfig", config);
        appModule.constant("app", appModule);
        appModule.constant('appData', { routes: data });

        //2) Configure Application Routes
        appModule.config(this.configureApplication);
        //3) Bootstrap Angular
        angular.bootstrap(document, [config.APP_NAME]);
        //4) Configure default factories.
        let factory = new Factory();
        factory.create(angular.module(config.APP_NAME), HttpFactory);
        factory.create(angular.module(config.APP_NAME), ComponentLoader);

    }

    getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



    constructor(config) {
        let context = this;
        this.beforeBootstrap(function (data) {
            context.afterBootstrap(data, config);
        });

    }
}
