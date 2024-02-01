exp = ["3", " ", "+", " ", "-", "2"];
const OPERATORS = ["+", "-", "*", "/"];


const PARENTHESIS = 5;
const OPERATOR = 4;
const INTEGER = 3;

const SCOPE_GLOBAL = 1;

class Slice {
    constructor(type, slice) {
        this.type = type;
        this.slice = slice;
    }
}

function parse_expression(args) {

    let slices = [];
    let expected_types = [];

    let scope = SCOPE_GLOBAL;

    for (let i = 0; i < args.length; i++) {
    
        const slice = args[i];
        let temporially_slice = NaN;
        let next_types = [];

        if (!isNaN(Number(slice)) && slice !== " ") {
            
            temporially_slice = new Slice(
                INTEGER,
                Number(slice)
            );

            next_types.push(OPERATOR);

        } else if (OPERATORS.includes(slice)) {

            
            temporially_slice = new Slice(
                OPERATOR,
                slice
            );

            next_types.push(INTEGER);
        }




        
        if (
            expected_types.length<1 
            || expected_types.includes(temporially_slice.type)
            
        ) {
            slices.push(temporially_slice);
            expected_types = next_types;
        } else {
           
        }
        console.log(slices)
        
    }

    
}

parse_expression(exp)

function compile_expression(slices) {

    // slices
}


function build_parse_expression_error() {
    /*

    -----------[error::logic::002]----------------
    ☐ Expected a "int", found an "opt"
    ☐ Found on line 1, character 5, of main.azl
        1 | 3 + - 2
                ^--- cause of error


    */



    let message = ""





}


// testing git