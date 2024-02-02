const ERRORS = {
    "syntax": [
        
    ],
    "logic": [
        "More than 1 entry point detected",
        "Following the '+' operator, expected a value of type 'int', 'flt', or 'bol'",
        "Following the '-' operator, expected a value of type 'int', 'flt', or 'bol'",
        "Following the '/' operator, expected a value of type 'int', 'flt', or 'bol'",
        "Following the '*' operator, expected a value of type 'int', 'flt', or 'bol'",
    ],
    "runtime": [
        
    ]
}

const SUPPORT = {
    "syntax": [

    ],
    "logic": [
        "The function 'main' is a special function, that cannot be defined multiple times.\n  Consider removing one of your main functions, or possibly merging them?",
        "The '+' operator can only be used to add number based values, if you are looking to join two values of 'str', consider the 'join()' function",
        "The '/' operator can only be used to divide two number based values",
        "The '*' operator can only be used to multiply two number based values",
    ],
    "runtime": [

    ]
}

export class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

export function build_error(strs, line, type, code, filepath, lncount, range) {
    let header = "[errors::" + type + "::" + code.toString().padStart(3, "0") + "]";
        
    let pad = Math.round((36 - header.length) / 2);
    header = header.padStart(header.length + pad, "-");
    header = header.padEnd(header.length + pad, "-");

    let message = "▪︎ " + ERRORS[type][code - 1] + "\n▪︎ Found on line '" + (line + 1) + "' of '" + filepath + "'";
    
    let preview = "";
    var max = (line + 2).toString().length;
    if ( line+1 > 0 ) {
        preview += "    " + (line).toString().padStart(max, " ") + " | " + strs[line-1] + "\n";
    }

    preview += "    " + (line+1).toString().padStart(max, " ") + " | " + strs[line] + "\n";

    preview += "".padStart(6+((line+1).toString().length)+range.start, " ") + "^" + "".padStart(range.end-range.start-1, "-") + "".padStart((range.end-range.start)>0, "^") + "-| cause of error\n";
    
    if ( line+2 < lncount ) {
        preview += "    " + (line+2).toString().padStart(max, " ") + " | " + strs[line+1] + "\n";
    }

    preview += "★ " + SUPPORT[type][code - 1];
    
    return header + "\n" + message + "\n" + preview;
}
