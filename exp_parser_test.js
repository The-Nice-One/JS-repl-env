import { build_error, Range } from "./universal_error_system.js";


const exp = ["3", " ", "+", " ", "-", "2"];
const OPERATORS = ["+", "-", "*", "/"];

const NEGATIVE_SIGN = 6;
const PARENTHESIS = 5;
const OPERATOR = 4;
const INTEGER = 3;
const WHITESPACE = 0;

const SCOPE_GLOBAL = 1;

const PASSED = 1;
const FAILED = 0;

const CONFIG_IGNORE = 0;
const CONFIG_USE = 1;

class Slice {
    constructor(type, slice, config) {
        this.type = type;
        this.slice = slice;
        this.config = config
    }
}

function parse_expression(args) {

    let parsed_state = PASSED
    let slices = [];
    let expected_types = [];
    let errors = []

    let scope = SCOPE_GLOBAL;

    for (let i = 0; i < args.length; i++) {
    
        const slice = args[i];
        let temporially_slice = NaN;
        let next_types = [];

        if (!isNaN(Number(slice)) && slice !== " ") {
            
            temporially_slice = new Slice(
                INTEGER,
                Number(slice),
                CONFIG_USE
            );

            next_types.push(OPERATOR);
            next_types.push(WHITESPACE);

        } else if (OPERATORS.includes(slice)) {
            if (expected_types.includes(NEGATIVE_SIGN) && slice == "-") {
                temporially_slice = new Slice(
                    NEGATIVE_SIGN,
                    slice,
                    CONFIG_USE
                )
            } else {
                temporially_slice = new Slice(
                    OPERATOR,
                    slice,
                    CONFIG_USE
                );
            }

            next_types.push(INTEGER);
            next_types.push(WHITESPACE);
            next_types.push(NEGATIVE_SIGN)
        } else if (slice == " ") {
            temporially_slice = new Slice(
                WHITESPACE,
                slice,
                CONFIG_IGNORE
            )
            //console.log(expected_types)
        }




        
        if (
            expected_types.length<1 
            || expected_types.includes(temporially_slice.type)
            
        ) {
            if (temporially_slice.config == CONFIG_USE) {
                slices.push(temporially_slice);
                expected_types = next_types;
            }
            
        } else {
            parsed_state = FAILED;
            errors.push(
                build_error(
                    "split string",
                    "0",
                    "logic",
                    2,
                    "main.azl",
                    32,
                    new Range(12,14)
                )
            )
        }
        
        
    }

    if (parsed_state == PASSED) {
        return [parsed_state, slices];
    } else { return [parsed_state, errors]; }
    
}

let result = parse_expression(exp);

if (result[0] == FAILED) {
    for(var i = 0; i < result[1].length; i++) {
        console.log(result[1][i]);
    }
} else {
    compile_expression(result[1])
}

function compile_expression(slices) {
    console.log(slices);
    // slices
}


    /*

    -----------[error::logic::002]----------------
    ☐ Expected a "int", found an "opt"
    ☐ Found on line 1, character 5, of main.azl
        1 | 3 + - 2
                ^--- cause of error


    */
