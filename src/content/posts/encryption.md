---
title: Secret projects
published: 2016-01-25
description: 'A list of projects coming up, text the owner to get access'
encrypted: true
pinned: false
password: "676767"
tags: [Encryption]
category: Secrets
---


# Password Protected Post

A password is required for this post


## Frontmatter Example

```yaml
---
title: Secret projects
published: 2016-01-25
encrypted: true
password: "676767"
...
---
```

- `encrypted` - Whether encryption is enabled for the post.
- `password` - The password required to unlock the content.


## Note

:::warning
Do not use this for extremely sensitive information like bank passwords or private keys. The encryption happens on the client side, and the password itself is stored in the post's metadata (though usually not displayed directly).
:::