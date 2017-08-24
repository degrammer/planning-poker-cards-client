import { HttpInterceptorExtensions } from 'config/HttpInterceptorExtensions';

export class HttpInterceptor {


    handleInterceptorExtensions(httpInterceptorExtensions, eventName, response) {
        if (!angular) {
            throw 'Angular is required in order to work';
        }

        if (!angular.isArray(httpInterceptorExtensions)) {
            throw 'Array expected: httpInterceptorExtensions';
        }

        angular.forEach(httpInterceptorExtensions, function (extension) {

            if (extension[eventName] && typeof (extension[eventName]) == 'function') {
                extension[eventName](response);
            }
        });
    }

    constructor($q, PubSub) {
        "ngInject";
        let context = this;
        //Load interceptor extensions.
        let httpInterceptorExtensions = new HttpInterceptorExtensions(PubSub);

        if (!$q) {
            throw 'HttpInterceptor: $q is required in order to work';
        }


        return {
            // optional method
            'request': function (config) {
                // do something on success
                console.log('Request success');
                context.handleInterceptorExtensions(httpInterceptorExtensions, 'request');
                return config;
            },

            // optional method
            'requestError': function (rejection) {
                // do something on error
                console.log('Request Error');
                context.handleInterceptorExtensions(httpInterceptorExtensions, 'requestError');
                return $q.reject(rejection);
            },



            // optional method
            'response': function (response) {
                // do something on success
                console.log('Response success');
                PubSub.publish('response-success', response);
                context.handleInterceptorExtensions(httpInterceptorExtensions, 'anyResponse', response);
                context.handleInterceptorExtensions(httpInterceptorExtensions, 'responseSuccess', response);
                return response;
            },

            // optional method
            'responseError': function (rejection) {
                // do something on error
                console.log('Response error');

                if (rejection && rejection.data && rejection.data.Message) {

                    console.log(rejection.data.Message);
                }
                context.handleInterceptorExtensions(httpInterceptorExtensions, 'anyResponse', rejection);
                context.handleInterceptorExtensions(httpInterceptorExtensions, 'responseError', rejection);
                return $q.reject(rejection);
            }
        };

    }


}