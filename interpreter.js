
const KEYS = [
    "fun",
    "int",
    "str"
]
const CODE = `
use system::terminal

fun main()
    str name: "John"
    int age: 34

    terminal::write("Hello ")
    terminal::write(name)
    terminal::write(", of age ")
    terminal::write(age)
    terminal::writeln("!")

    terminal::flush()
end
`;

const ERRORS = {
    "syntax": [
        
    ],
    "logic": [
        "More than 1 entry point detected"
    ],
    "runtime": [
        
    ]
}

export const FUNS = {
    "core": {
        "goto": function (session, oargs, locs, pass) {

        }
    },
    "terminal": {
        "write": function (session, oargs, locs, pass) {
            
        } 
    },
    "arithmetic": {
        "integer_add": function (session, oargs, locs, pass) {
            /*
            Args:
            0: int1,
            1: int2,
            2: location,
            */
            let args = bundle_args(session, oargs, locs);
            let result = args[0] + args[1];
            console.log(oargs)
            console.log(args)
            console.log(result)
            session.gRegister[args[2]] = result;
            if (pass === true) {session.cRegister.push(result);}
        },
        "integer_multiply": function (session, oargs, locs, pass) {
            /*
            Args:
            0: int1,
            1: int2,
            2: location,
            3: pass? true or false (not working yet)
            */
            let args = bundle_args(session, oargs, locs);
            let result = args[0] * args[1];
            session.gRegister[args[2]] = result;
            console.log(args)
            if (pass === true) {session.cRegister.push(result);}
        },
    }
}



export const ARG_PASSED = 1; // arg is in the special cosumable register
export const ARG_GIVEN = 2; // arg is given directly
export const ARG_LOCATED = 3;// arg location in the global register is given


function bundle_args(session, args, locs) {
    let cargs = [];
    for(var i = 0; i < locs.length; i++) {
        if (locs[i] == ARG_PASSED) {
            cargs.push(session.cRegister[args[i]]);
            session.cRegister.splice(args[i],1);
        }
        if (locs[i] == ARG_GIVEN) {
            cargs.push(args[i]);
        }
        if (locs[i] == ARG_LOCATED) {
            cargs.push(session.gRegister[args[i]]);
        }
    }
    return cargs;
}





function sparse(code) {
    let strs = code.split("\n");
    let filtered = strs.filter(x => x != "");
    let index = 0;
    while ( index < filtered.length ) {
        filtered[index] = filtered[index].trimStart();
        index++;
    };
    return filtered;
}

function lines(code) {
    return code.split("\n");
}

function find_function(strs, name) {
    let index = 0;
    let results = [];
    while ( index < strs.length ) {
        if ( strs[index].includes("fun") && strs[index].includes(name) ) {
            let line = strs[index].replace(/ +/g, ' ');

            if ( line.startsWith("fun " + name) ) {
                results.push(index);
            }
        }
        index++;
    }
    return results;
}

function build_error(strs, line, type, code, filepath, lncount) {
    if ( type == "syntax" ) {
        
    } else if ( type == "logic" ) {
        
    } else if ( type == "runtime" ) {
        
    } else {
        
    }
    let header = "[errors::logic::" + code.toString().padStart(3, "0") + "]";
        
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

    if ( line+2 < lncount ) {
        preview += "    " + (line+2).toString().padStart(max, " ") + " | " + strs[line+1] + "\n";
    }

    
    return header + "\n" + message + "\n" + preview;
}

export class jsSession {
    constructor(code, filename) {
        this.code = code;
        this.filename = filename;
        this.gRegister = [];
        this.cRegister = [];
    }

    initialize() {
        this.parsed = sparse(this.code);
        this.lines = lines(this.code);
        this.lnCount = this.lines.length;
        let entry = find_function(this.lines, "main");
        if ( entry.length > 1 ) {
            
            for (var i = 0; i < entry.length; i++) {
                this.raise(entry[i], "logic", 1);
            }
        }
    }

    raise(line, type, code) {
        console.log(build_error(this.lines, line, type, code, this.filename, this.lnCount));
    }
    
}

let session = new jsSession(CODE, "main.azl");
session.initialize();
