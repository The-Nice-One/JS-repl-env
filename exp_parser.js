import { build_error, Range } from "./universal_error_system.js";
import { FUNS, jsSession, ARG_GIVEN, ARG_PASSED, ARG_LOCATED } from "./interpreter.js";


const exp = ["12", " ", "+", " ", " ", "2", "-", "2", "-", "5", "+", "33", "*", "2", "/", "3"];
const OPERATORS = ["+", "-", "*", "/"];
const COMPILED_EXPRESSION = 12;
const NEGATIVE_SIGN = 10;
const TRANSLATE_OPERATOR = 9;
const SCALE_OPERATOR = 8;
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

            next_types.push(TRANSLATE_OPERATOR);
            next_types.push(SCALE_OPERATOR);
            next_types.push(WHITESPACE);

        } else if (OPERATORS.includes(slice)) {
            if (expected_types.includes(NEGATIVE_SIGN) && slice == "-") {
                temporially_slice = new Slice(
                    NEGATIVE_SIGN,
                    slice,
                    CONFIG_USE
                )
            } else {
                if(slice=="+"||slice=="-") {
                    temporially_slice = new Slice(
                        TRANSLATE_OPERATOR,
                        slice,
                        CONFIG_USE
                    );
                }
                if(slice=="*"||slice=="/") {
                    temporially_slice = new Slice(
                        SCALE_OPERATOR,
                        slice,
                        CONFIG_USE
                    );
                }
                next_types.push(NEGATIVE_SIGN);
            }

            next_types.push(INTEGER);
            next_types.push(WHITESPACE);
            
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
            );
        }
        
        
    }

    if (parsed_state == PASSED) {
        return [parsed_state, slices];
    } else { return [parsed_state, errors]; }
    
}

let result = parse_expression(exp);
console.log(result);
var session = new jsSession("", "main.azl");

if (result[0] == FAILED) {
    for(var i = 0; i < result[1].length; i++) {
        console.log(result[1][i]);
    }
} else {
    var rtcells = compile_expression(result[1]);
}

for(var r=0; r<rtcells.length;r++) {
    rtcells[r]();
}

console.log(session);
console.log(rtcells);

function compile_expression(slices) {
    let cells = [];
    let current_cres_pos = 0;

    for(var i = 0; i < slices.length; i++) {
        let slice = slices[i];
        if (slice.type == NEGATIVE_SIGN) {
            if (slices[i+1].type == INTEGER) {
                cells.push(FUNS["arithmetic"]["integer_multiply"].bind(this, session, [-1, Number(slices[i+1].slice), NaN], [ARG_GIVEN, ARG_GIVEN, ARG_GIVEN], true));
                slices[i] = new Slice(COMPILED_EXPRESSION, current_cres_pos, CONFIG_IGNORE);
                slices.splice(i+1,1);
                i--;
                //current_cres_pos++;
            } else {
                // throw error: expected int found x
            }
        }
    }


    for(var k = 0; k < slices.length; k++) {
        let slice = slices[k];
        if (slice.type == SCALE_OPERATOR) {
            console.log("ye")
            let func_name = NaN;
            if(slice.slice=="*") { func_name = "integer_multiply"; }
            if(slice.slice=="/") { func_name = "integer_divide"; }


            let val1 = {"locs":NaN, "slice":NaN};
            if(slices[k-1].type == COMPILED_EXPRESSION) {
                val1.locs = ARG_PASSED;
                val1.slice = slices[k-1].slice;
            } else if(slices[k-1].type == INTEGER) {
                val1.locs = ARG_GIVEN;
                val1.slice = slices[k-1].slice;
            }
            
            let val2 = {"locs":NaN, "slice":NaN};
            if(slices[k+1].type == COMPILED_EXPRESSION) {
                val2.locs = ARG_PASSED;
                val2.slice = slices[k+1].slice;
            } else if(slices[k+1].type == INTEGER) {
                val2.locs = ARG_GIVEN;
                val2.slice = slices[k+1].slice;
            }

            cells.push(
                FUNS["arithmetic"][func_name].bind(
                    this,
                    session,
                    [val1.slice, val2.slice, NaN],
                    [val1.locs, val2.locs, ARG_GIVEN],
                    true
                )
            )
            slices[k+1] = new Slice(COMPILED_EXPRESSION, current_cres_pos, CONFIG_IGNORE);
            slices.splice(k-1,2);
            k--;
            k--;
            console.log(k)
        }
    }
    for(var j = 0; j < slices.length; j++) {
        let slice = slices[j];
        if (slice.type == TRANSLATE_OPERATOR) {

            let func_name = NaN;
            if(slice.slice=="+") { func_name = "integer_add"; }
            if(slice.slice=="-") { func_name = "integer_subtract"; }


            let val1 = {"locs":NaN, "slice":NaN};
            if(slices[j-1].type == COMPILED_EXPRESSION) {
                val1.locs = ARG_PASSED;
                val1.slice = slices[j-1].slice;
            } else if(slices[j-1].type == INTEGER) {
                
                val1.locs = ARG_GIVEN;
                val1.slice = slices[j-1].slice;
            }
            
            let val2 = {"locs":NaN, "slice":NaN};
            if(slices[j+1].type == COMPILED_EXPRESSION) {
                val2.locs = ARG_PASSED;
                val2.slice = slices[j+1].slice;
            } else if(slices[j+1].type == INTEGER) {
                
                val2.locs = ARG_GIVEN;
                val2.slice = slices[j+1].slice;
            }

            cells.push(
                FUNS["arithmetic"][func_name].bind(
                    this,
                    session,
                    [val1.slice, val2.slice, NaN],
                    [val1.locs, val2.locs, ARG_GIVEN],
                    true
                )
            )
            slices[j+1] = new Slice(COMPILED_EXPRESSION, current_cres_pos, CONFIG_IGNORE);
            slices.splice(j-1,2);
            j--;
            j--;
        }
    }

    return cells;
}


    /*

    -----------[error::logic::002]----------------
    ☐ Expected a "int", found an "opt"
    ☐ Found on line 1, character 5, of main.azl
        1 | 3 + - 2
                ^--- cause of error


    */
