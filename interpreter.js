
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

const FUNS = {
    "terminal": {
        "write": function (session, arg) {
            
        } 
    }
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

class jsSession {
    constructor(code, filename) {
        this.code = code;
        this.filename = filename;
        this.gRegister = [];
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
