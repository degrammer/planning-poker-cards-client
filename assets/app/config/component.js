export class Component
{

    constructor(angularApp)
    {

       
        if(angularApp && this.getComponentDefinition)
        {

            var definition = this.getComponentDefinition();
            var componentName = definition.name ? definition.name.toLowerCase() : this.constructor.name.toLowerCase();
            //Init component dependencies.
            if(this.injectDependencies)
            {
                this.injectDependencies(angularApp);
            }
            
            this.component = angularApp.component(componentName, definition);

            angular.element('html').attr('data-component',`${definition.name}`);

            return this;

        }else
        {
            throw 'Angular Module is required for Component';
        }

    }

    getTemplateUrl(templateName)
    {
        return 'dist/' + templateName;
    }
}