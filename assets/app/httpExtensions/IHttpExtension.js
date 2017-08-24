export class IHttpExtension {

    request() { }

    requestError() { }

    responseSuccess() { }

    responseError() { }

    anyResponse(){}



    constructor() {

        let events = {};

        events.request = this.request;
        events.requestError = this.requestError;
        events.responseSuccess = this.responseSuccess;
        events.responseError = this.responseError;
        events.anyResponse = this.anyResponse;
        

        return events;
    }


}