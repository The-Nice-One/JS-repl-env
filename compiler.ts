

enum Scope {
  Global,
  VariableDeclarationName,
  VariableDeclarationValue
}

enum ExpectedType {
  Alpha,
  Numeric,
  WhiteSpace,
  NewLine
}

interface TaggedString {
  key: string;
  tags: Array<typeof ExpectedType>;
}

interface Parser {
  code: string;
  currentWord: string;
  scopes: Array<typeof Scope>;
  expectedTypes: Array<typeof ExpectedType>;
  ctMemory: CTMemory;
}

interface CTMemory {
  definedTypes: Array<string>
}


function isAlpha(chr: string) {
 let code: number = chr.charCodeAt(0);
  if (!(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  return true;
};

function isNumeric(chr: string) {
  let code: number = chr.charCodeAt(0);
  if (!(code > 47 && code < 58)) {
    return false;
  }
  return true;
};

function isWhiteSpace(chr: string) {
  return chr == ' ';
}

function isNewLine(chr: string) {
  return chr == '\n';
}

function tagChr(chr: string, expectedTypes: Array<typeof ExpectedType>) {
  let tag: TaggedString = { key: chr, tags: [] };
  
  if(isAlpha(chr)) { tag.tags.push(ExpectedType.Alpha); }
  if(isNumeric(chr)) { tag.tags.push(ExpectedType.Numeric); }
  if(isWhiteSpace(chr)) { tag.tags.push(ExpectedType.WhiteSpace); }
  if(isNewLine(chr)) { { tag.tags.push(ExpectedType.NewLine); }
  }
  return tag;
}

function generateAST(parser: Parser) {
  for(let i = 0; i < parser.code.length; i++) {
    let c = parser.code.charAt(i);
    let taggedChr: TaggedString = tagChr(c);
    let updated: bool = false;
    if(parser.scopes.includes(Scope.Global)) {
      parser.currentWord += c; updated = true;
    }
    
    if(parser.includes(Scope.VariableDeclarationStart)) {
        
    }
    
    
    
    if(updated) {
      if(parser.ctMemory.definedTypes.includes(parser.currentWord)) {
        parser.currentWord = "";
        parser.expectedTypes = [
            ExpectedType.Alpha,
            ExpectedType.Numeric,
            ExpectedType.WhiteSpace
        ];
        parser.scopes.remove(Scope.Global);
        parser.scopes.push(Scope.VariableDeclarationStart);
      }
    }
  }
  
  
  console.log(parser.currentWord)
}


let code: string = `
int lucky: 5
flt pi: 3.14
int a: 3
int b: 5
int c: a^2 +b^2
`;

let parser: Parser = { 
  code: code,
  scopes: [Scope.Global],
  currentWord: "",
  expectedTypes: [
    ExpectedType.Alpha,
    ExpectedType.Numeric,
    ExpectedType.WhiteSpace,
    ExpectedType.NewLine
  ],
  ctMemory: {
    definedTypes: ["int", "str", "flt", "bol"]
  }
};


console.time("AST Generation");
generateAST(parser);
console.timeEnd("AST Generation");
