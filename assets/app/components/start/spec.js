import { JasmineSpec } from 'specs/jasmineSpec';
import {startController} from 'componentSpec/start/controller';

export class Spec extends JasmineSpec {

    constructor() {

        describe("start Suite Definition", function() {

            let componentController;

            beforeEach(function() {

                componentController = new startController();

            });

            it("Should implement startController class", function() {
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