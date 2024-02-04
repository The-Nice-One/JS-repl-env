let exp = "int favorite_number:32 + - : 43";


function variable_declaration_test(exp) {
    if (exp.includes(":")) {
        
        let contents = exp.split(/(\:)/);
        if (contents[1] == ":") {
            let head = contents[0].split(" ");
            if (head.length == 2) {
                contents.shift();
                contents.shift();
                let expression = contents.join("");

                // then use the expression parser
            } else {
                // body format error
            }
        } else {
            // format error
        }
    }
}
variable_declaration_test(exp)

function parse_variable_expression() {
    
}