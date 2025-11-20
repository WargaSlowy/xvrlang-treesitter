module.exports = grammar({
  name: 'xvrlang',

  extras: $ => [/\s|\r?\n/, $.comment],

  // conflicts: $ => [
  //   [$.unary_expression, $.binary_expression],
  //   [$.call_expression, $.primary_expression],
  // ],

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

    type: $ => choice('bool', 'int', 'float', 'string', 'opaque', 'any', 'type'),

    integer: $ => /\d+/,
    float: $ => /\d+\.\d+([eE][+-]?\d+)?/,
    string: $ => /"([^"\\]|\\.)*"/,
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    declaration: $ => seq(
      'var',
      field('name', $.identifier),
      optional(seq(':', field('type', $.type))),
      optional(seq('=', field('value', $._expression))),
      ';'
    ),

    proc_declaration: $ => seq(
      'proc',
      field('name', $.identifier),
      '(',
      optional($.parameters),
      ')',
      optional(seq(':', field('return_type', $.type))),
      field('body', $.block)
    ),

    parameters: $ => commaSep1($.parameter),
    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type)
    ),

    block: $ => seq('{', repeat($._statement), '}'),

    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.postfix_expression
    ),

    primary_expression: $ => choice(
      $.integer,
      $.float,
      $.string,
      'true', 'false', 'null',
      $.identifier,
      $.parenthesized_expression,
      $.call_expression,
      $.cast_expression,
      $.typeof_expression
    ),

    postfix_expression: $ => prec.right(5,
      choice(
        $.primary_expression,
        seq($.postfix_expression, '++'),
        seq($.postfix_expression, '--')
      )
    ),

    unary_expression: $ => prec(4,
      seq(
        field('operator', choice('!', '-', '+')),
        field('argument', $.postfix_expression)
      )
    ),

    binary_expression: $ => choice(
      ...[
        ['||', -1],
        ['&&', 0],
        ['==', 1], ['!=', 1],
        ['<', 1], ['<=', 1], ['>', 1], ['>=', 1],
        ['+', 2], ['-', 2],
        ['*', 3], ['/', 3], ['%', 3],
      ].map(([op, precedence]) =>
        prec.left(precedence, seq(
          field('left', $._expression),
          field('operator', op),
          field('right', $._expression)
        ))
      )
    ),

    call_expression: $ => prec(6,
      seq(
        field('function', $.identifier),
        '(',
        commaSep(field('arguments', $._expression)),
        ')'
      )
    ),

    cast_expression: $ => prec(5,
      seq(
        field('value', $._expression),
        'astype',
        field('type', $.type)
      )
    ),

    typeof_expression: $ => prec(5,
      seq('typeof', '(', field('value', $._expression), ')')
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    if_statement: $ => seq('if', '(', field('condition', $._expression), ')', $.block,
      optional(seq('else', choice($.block, $.if_statement)))
    ),

    while_statement: $ => seq('while', '(', field('condition', $._expression), ')', $.block),

    for_statement: $ => seq(
      'for', '(',
      field('initializer', optional(choice($._expression, $.declaration))),
      ';',
      field('condition', optional($._expression)),
      ';',
      field('update', optional($._expression)),
      ')',
      $.block
    ),

    expression_statement: $ => seq($._expression, ';'),
    return_statement: $ => seq('return', optional($._expression), ';'),
    comment: $ => token(seq('//', /.*/)),
  }
});

function commaSep1(rule) { return seq(rule, repeat(seq(',', rule))); }
function commaSep(rule) { return optional(commaSep1(rule)); }
