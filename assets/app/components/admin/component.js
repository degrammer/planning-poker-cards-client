import { Component } from 'config/component';
import { adminController } from 'components/admin/controller';
import { adminService } from 'components/admin/service';
import 'components/admin/style.css';

export class admin extends Component {
    adminController($scope, appConfig, app, componentLoader, PubSub, adminService, $mdSidenav, $state, $mdMedia, $location) {
        "ngInject";
        //admin  controller logic. (Controller logic should be outside of angular controller).
        let componentController = new adminController();

        /*  Load this component inside another component view:
            import {admin} from 'components/admin/component'; (This line should be on the top of the component file)
            componentLoader.initialize(admin,$scope); This will initialize the imported component
            Inside your view in order to load the async component you have to do the following:
         
            <div oc-lazy-load="adminLazyLoad"> <admin></admin></div>

            To view the component controller test results go to /specs/admin/specRunner.html
        */
        $scope.component = {
            name: 'admin',
            state: 'admin'
        };

        $scope.$watch(function () { return $mdMedia('gt-md'); }, function (big) {
            $scope.bigScreen = big;
        });



        PubSub.publish('component_admin_Loaded');

        function apply(expression) {
            $scope.$apply(() => typeof expression == 'function' ? expression() : null);
        }

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.goto = function ($event, state) {
            $event.preventDefault();
            $scope.toggleLeft();
            $state.go(state,{}, { reload: state });
           

        };

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }



    }



    lazyLoad() {
        return [
            super.getTemplateUrl("components/admin/view.html")
        ];
    }

    getComponentDefinition() {

        return {
            templateUrl: super.getTemplateUrl("components/admin/view.html"),
            controller: this.adminController,
            name: 'admin'
        };

    }

    injectDependencies(angularApp) {
        new adminService(angularApp);
    }

}