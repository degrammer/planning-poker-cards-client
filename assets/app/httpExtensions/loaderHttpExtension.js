import { IHttpExtension } from 'httpExtensions/IHttpExtension';

export class LoaderHttpExtension extends IHttpExtension {

    constructor(PubSub) {
        super();
    }

    request() {
        //Show Loader
        let loaderComponent = document.getElementById("loaderComponent");

        if (!loaderComponent) {
            let body = document.getElementsByTagName('body')[0];
            loaderComponent = document.createElement("div");
            loaderComponent.setAttribute("id", "loaderComponent");
            let shadow = document.createElement("div");
            shadow.setAttribute("id", "shadow");
            shadow.appendChild(loaderComponent);
            body.appendChild(shadow);

        } else {
            angular.element("#shadow").show();
        }
    }

    anyResponse() {
        // Hide loader
        let loaderComponent = angular.element("#shadow");
        if (loaderComponent) {
           
           loaderComponent.hide();
        }
    }

    responseSuccess(response) {

        if (response && response.config && response.config.method != 'GET') {
            //Show error message
            let messageContainer = angular.element("#message_container");
            let messageTextContainer = angular.element("#message");

            if (messageContainer && response && response.data && response.data.Messages) {
                messageTextContainer.text(response.data.Messages);
                messageContainer.show();
                messageContainer.addClass('success');
                messageContainer.removeClass('error');
             
                setTimeout(()=>{
                    
                    messageContainer.hide();

                }, 5000);
            }

        }
    }


    responseError(response) {

        if (response.status == 401) {
            window.location = window.location.origin + '/#!/accessDenied';
        }
        //Show error message
        let messageContainer = angular.element("#message_container");
        let messageTextContainer = angular.element("#message");

        if (messageContainer && response && response.data && (response.data.Message || response.data.Messages)) {
            let message = '';

            if (response.data.Message) {
                message = response.data.Message;

            } else if (response.data.Messages) {
                message = '<ul>';
                angular.forEach(response.data.Messages, function (messageItem) {
                    message += '<li>' + messageItem + '</li>';
                });

                message += '</ul>';
            }

            messageTextContainer.html(message);
            messageContainer.show();
            messageContainer.addClass('error');
            messageContainer.removeClass('success');

             setTimeout(()=>{
                    
                    messageContainer.hide();

                }, 10000);
        }

    }

}