// Mocha: Test running framework
// Function 1: it; Run a test and make an assert
// Function 2: describe; Groups together 'it' functions
// Function 3: beforeEach; Execute some general setup code.
const assert = require("assert");
class Car{
    park(){
        return "stopped";
    }

    drive(){
        return "vroom";
    }
}
// Describe arg1: For organisation purposes, 

let car; // Pre-define the variable

beforeEach(() => {
    // Common initialisation code before each "it" statement
    car = new Car();
})

describe("Car", () => {
    it("can park", () => {
        assert.equal(car.park(), "stopped");
    });

    it("can drive", () => {
        assert.equal(car.drive(), "vroom")
    })
});