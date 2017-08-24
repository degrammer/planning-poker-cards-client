import {LoaderHttpExtension} from 'httpExtensions/loaderHttpExtension';

export class HttpInterceptorExtensions {

    constructor(PubSub) {
       
        return [new LoaderHttpExtension(PubSub)];
    }


}