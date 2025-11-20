[
  "var" "proc" "if" "else" "while" "for" "return"
] @keyword

[
  "bool" "int" "float" "string" "opaque" "any"
] @type

[
  "true" "false"
] @boolean

"null" @constant.builtin

(integer) @number
(float) @number
(string) @string

[
  "==" "!=" "<" "<=" ">" ">="
  "&&" "||"
  "+" "-" "*" "/" "%" "!"
  "astype"
  "typeof"
] @operator

[
  ";" "," ":" "=" "(" ")" "{" "}"
] @punctuation.delimiter
(identifier) @variable
(proc_declaration (identifier) @function)
(declaration (identifier) @variable)

(call_expression
  function: (identifier) @function.builtin
  (#eq? @function.builtin "print"))

(comment) @comment
