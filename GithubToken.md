# Creating a token for thlorenz-com

[instructions](https://help.github.com/articles/creating-an-oauth-token-for-command-line-use)

    curl -u thlorenz-com -d '{"scopes":["repo"]}'  https://api.github.com/authorizations

[example](https://github.com/dscape/ghcopy/blob/68981f04be58d0412e75e6bff83a7c993b6281e7/bin/ghcopy#L138-L145)
