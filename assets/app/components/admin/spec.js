import { JasmineSpec } from 'specs/jasmineSpec';
import {adminController} from 'componentSpec/admin/controller';

export class Spec extends JasmineSpec {

    constructor() {

        describe("admin Suite Definition", function() {

            let componentController;

            beforeEach(function() {

                componentController = new adminController();

            });

            it("Should implement adminController class", function() {
                expect(componentController).toBeDefined();
            });

            
            it("Should be load executeJasmine", function() {
                expect(executeJasmine != null && executeJasmine != undefined).toBe(true);
            });


            it("Should call super function after Jasmine Suites", function() {
                expect(this.jasmineExecuted).not.toBeDefined();
            });
            

        });

        super();
    }
}