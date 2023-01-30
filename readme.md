# AWS eventBridge schedule cron expression parser

### Validate aws cron expression

```js
    const { awsCronExpressionValidator } = require('aws-cron-expression-validator')
    const valid = awsCronExpressionValidator('0 12 ? * MON-FRI *')
    /** if it's valid it will return object 
    *return {
    *  minute,
    *  hour,
    *  dayOfMonth,
    *  month,
    *  dayOfWeek,
    *  year,
    *  expression
    * }
    **/
    // if it's invalid it will throw exception.
```
