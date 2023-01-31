# AWS eventBridge schedule cron expression parser

### Validate aws cron expression

Demo url: (https://gharibyan.github.io/aws-cron-events-show/)

```js
    const { awsCronExpressionValidator } = require('aws-cron-expression-validator')
    const valid = awsCronExpressionValidator('0 12 ? * MON-FRI *')
```
