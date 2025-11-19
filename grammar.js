module.exports = grammar({
  name: 'xvrlang',

  extras: $ => [
    /\s|\\\r?\n/,  // whitespace + line continuation
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.declaration,
      $.expression_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.proc_declaration,
      $.return_statement,
    ),

    type: $ => choice(
      'bool', 'int', 'float', 'string', 'opaque', 'any'
    ),

    literal: $ => choice(
      'true', 'false', 'null',
      $.integer,
      $.float,
      $.string
    ),

    integer: $ => /\d+/,
    float: $ => /\d+\.\d+([eE][+-]?\d+)?/,
    string: $ => /"([^"\\]|\\.)*"/,

    // Identifiers
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Variable declaration: `var name: type = expr;`
    declaration: $ => seq(
      'var',
      $.identifier,
      optional(seq(':', $.type)),
      optional(seq('=', $._expression)),
      ';'
    ),

    proc_declaration: $ => seq(
      'proc',
      $.identifier,
      '(',
      optional($.parameters),
      ')',
      optional(seq(':', $.type)),
      $.block
    ),
    parameters: $ => commaSep1($.parameter),
    parameter: $ => seq($.identifier, ':', $.type),
    block: $ => seq('{', repeat($._statement), '}'),
    _expression: $ => choice(
      $.literal,
      $.identifier,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.cast_expression,
      $.typeof_expression,
      $.parenthesized_expression
    ),

    binary_expression: $ => choice(
      ...['==', '!=', '<', '<=', '>', '>=', '||', '&&', '+', '-', '*', '/', '%']
        .map(op => prec.left(1, seq($._expression, op, $._expression)))
    ),

    unary_expression: $ => prec.left(2, seq(choice('!', '-', '+'), $._expression)),

    call_expression: $ => seq(
      $.identifier,
      '(',
      commaSep($._expression),
      ')'
    ),

    cast_expression: $ => seq($._expression, 'astype', $.type), 
    typeof_expression: $ => seq('typeof', '(', $._expression, ')'),
    parenthesized_expression: $ => seq('(', $._expression, ')'),
    if_statement: $ => seq(
      'if', '(', $._expression, ')', $.block,
      optional(seq('else', choice($.block, $.if_statement)))
    ),
    while_statement: $ => seq('while', '(', $._expression, ')', $.block),
    for_statement: $ => seq(
      'for', '(', 
        optional($._expression), ';', 
        optional($._expression), ';', 
        optional($._expression), 
      ')',
      $.block
    ),

    expression_statement: $ => seq($._expression, ';'),
    return_statement: $ => seq('return', optional($._expression), ';'),

    comment: $ => token(seq('//', /.*/)),
  }
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
