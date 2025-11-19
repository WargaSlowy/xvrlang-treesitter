# xvrlang-treesitter
tressiter xvrlang for neovim

## Install it using tree-sitter

```lua
    config = function (_, opts)
      local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
      parser_config.xvrlang = {
        install_info = {
          url = "https://github.com/wargaslowy/xvrlang-treesitter",
          files = {"src/parser.c"},
          generate_requires_npm = false,
          requires_generate_from_grammar = false,
        },
        filetype = "xvr",
        vim.filetype.add({
          extension = {
            xvr = "xvr",
          }
        })
      }

      require("nvim-treesitter.configs").setup(opts)
    end
```

install on neovim
```
:TSInstall xvrlang
```
