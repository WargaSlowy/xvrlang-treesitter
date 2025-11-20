; Keywords
[
  "var" "proc" "if" "else" "while" "for" "return" "assert" "astype" "typeof"
] @keyword

; Types
[
  "bool" "int" "float" "string" "opaque" "any"
] @type

; Boolean & null
[
  "true" "false"
] @boolean
"null" @constant.builtin

; Literals
(integer) @number
(float) @number
(string) @string

; Operators
[
  "==" "!=" "<" "<=" ">" ">="
  "&&" "||"
  "+" "-" "*" "/" "%" "!"
  "++" "--"
] @operator

; Punctuation
[
  ";" "," ":" "=" "(" ")" "{" "}"
] @punctuation.delimiter

; Identifiers
(identifier) @variable

; Function calls
(call_expression
  function: (identifier) @function.call)

; Declarations
(proc_declaration
  name: (identifier) @function)

(declaration
  name: (identifier) @variable)

(parameter
  name: (identifier) @variable.parameter)

; Comments
(comment) @comment
