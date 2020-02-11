# hexo-deployer-netlify

Netlify deployer plugin for [Hexo].

## Installation

``` bash
$ npm install hexo-deployer-netlify --save
```

## Options

You can configure this plugin in `_config.yml`.

``` yaml
# You can use this:
deploy:
  type: netlify
  token: <your personal access token>
  site_id: <your website id>
```

- **token**: Netlify personal access token (you can create one at https://app.netlify.com/applications). It should be a long base64 string, i.e. 'aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00aa00'
- **site_id**: Your site api ID. Should be an UID, something like '11bb11bb-11bb-11bb-11bb-11bb11bb11bb'. You can find it in "Site Info" section, at the bottom of https://app.netlify.com/sites/my-blog-name.

## License

WTFPL

[Hexo]: http://hexo.io/
