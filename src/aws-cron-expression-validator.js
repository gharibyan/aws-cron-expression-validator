/**
 *
 Validates AWS EventBridge cron schedule expressions.
 https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions

 | Field        | Values          | Wildcards     |
 | :----------: | :-------------: | :-----------: |
 | Minute       | 0-59            | , - * /       |
 | Hour         | 0-23            | , - * /       |
 | Day-of-month | 1-31            | , - * ? / L W |
 | Month        | 1-12 or JAN-DEC | , - * /       |
 | Day-of-week  |  1-7 or SUN-SAT | , - * ? L #   |
 | Year         | 1970-2199       | , - * /       |
 *
 **/

const minuteValues = '(0?[0-9]|[1-5][0-9])' // [0]0-59
const hourValues = '(0?[0-9]|1[0-9]|2[0-3])' // [0]0-23
const monthOfDayValues = '(0?[1-9]|[1-2][0-9]|3[0-1])' // [0]1-31
const monthValues = '(0?[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)' // [0]1-12 or JAN-DEC
const dayOfWeekValues = '([1-7]|SUN|MON|TUE|WED|THU|FRI|SAT)' // 1-7 or SUN-SAT
const dayOfWeekHash = `(${dayOfWeekValues}#[1-5])` // Day of the week in the Nth week of the month
const yearValues = '((19[7-9][0-9])|(2[0-1][0-9][0-9]))' // 1970-2199

const rangeRegex = values => `(${values}|(\\*-${values})|(${values}-${values})|(${values}-\\*))`

const listRegex = values => {
  const range = rangeRegex(values)
  return `(${range}(,${range})*)`
}

const slashRegex = values => `((\\*|${values})\\/[0-9]*[1-9][0-9]*)`

const commonRegex = values => `(${listRegex(values)}|\\*|${slashRegex(values)})`

const minuteRegex = () => new RegExp(`^(${commonRegex(minuteValues)})$`)

const hourRegex = () => new RegExp(`^(${commonRegex(hourValues)})$`)

const dayOfMonthRegex = () => new RegExp(`^(${commonRegex(monthOfDayValues)}|\\?|L|${monthOfDayValues}W)$`)

const monthRegex = () => new RegExp(`^(${commonRegex(monthValues)})$`)

const dayOfWeekRegex = () => new RegExp(`^(${listRegex(dayOfWeekValues)}|\\*|\\?|L|${dayOfWeekHash})$`)

const yearRegex = () => new RegExp(`^(${commonRegex(yearValues)}|\\?|L)$`)

const awsCronExpressionValidator = expression => {
  const valueCount = expression.split(' ').length
  if (valueCount !== 6) {
    throw new Error(
      `Incorrect number of values in '${expression}'. 6 required, ${valueCount} provided.`
    )
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek, year] = expression.split(' ')

  if (!((dayOfMonth === '?' && dayOfWeek !== '?') || (dayOfMonth !== '?' && dayOfWeek === '?'))) {
    throw new Error(
      `Invalid combination of day-of-month '${dayOfMonth}' and day-of-week '${dayOfWeek}'. One must be a question mark (?)`
    )
  }
  if (!new RegExp(minuteRegex()).test(minute)) {
    throw new Error(`Invalid minute value '${minute}'.`)
  }
  if (!new RegExp(hourRegex()).test(hour)) {
    throw new Error(`Invalid hour value '${hour}'.`)
  }
  if (!new RegExp(dayOfMonthRegex()).test(dayOfMonth)) {
    throw new Error(`Invalid day-of-month value '${dayOfMonth}'.`)
  }
  if (!new RegExp(monthRegex()).test(month)) {
    throw new Error(`Invalid month value '${month}'.`)
  }
  if (!new RegExp(dayOfWeekRegex()).test(dayOfWeek)) {
    throw new Error(`Invalid day-of-week value '${dayOfWeek}'.`)
  }
  if (!new RegExp(yearRegex()).test(year)) {
    throw new Error(`Invalid year value '${year}'.`)
  }

  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    year,
    expression
  }
}

module.exports = {
  awsCronExpressionValidator
}
