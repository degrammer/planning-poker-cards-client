import { Factory } from 'config/factory';

export class startService extends Factory {

    config(httpFactory) {
        "ngInject";
        //Define your methods here
        var factory = {};

        factory.createSession = function () {
            let fac = httpFactory;
            return angular.element.ajax({
                type: "POST",
                url: httpFactory.getBaseUrl() + "/"
            });
        };

        factory.join = function (sessionId, user) {
            debugger;
            let requestUrl = "/session/" + sessionId + "/" + user;

            return angular.element.ajax({
                type: "GET",
                url: httpFactory.getBaseUrl() + requestUrl
            });

        };

        factory.getTeamMembers = function(sessionId)
        {
             let requestUrl = "/session/" + sessionId;

            return angular.element.ajax({
                type: "GET",
                url: httpFactory.getBaseUrl() + requestUrl
            });
        };


        factory.getCards = function()
        {
            return angular.element.ajax({
                type: "GET",
                url: httpFactory.getBaseUrl()
            });
        };

        factory.sendResultEmail = function(data)
        {
            let fac = httpFactory;
            return angular.element.ajax({
                type: "POST",
                url: 'https://wt-555fbae9979c26ac0171442b75e197dd-0.run.webtask.io/sendPlanningPokerResult',
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8"

            });
            
        }

        return factory;
    }
}