
const { awsCronExpressionValidator } = require('./aws-cron-expression-validator')

function generateUpcomingDates (expression, count = 10) {
  const {minute: minutes, hour: hours, dayOfMonth, month, dayOfWeek, year} = awsCronExpressionValidator(expression)
  const dates = []
  const now = new Date()
  let dateToCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
  let iterator = 0
  while (dates.length < count) {
    if (checkCronExpression(dateToCheck, minutes, hours, dayOfMonth, month, dayOfWeek, year)) {
      dates.push(new Date(dateToCheck))
    }
    dateToCheck.setMinutes(dateToCheck.getMinutes() + 1)
    if (iterator > count) {
      throw new Error('Max iteration exceeded')
    }
  }

  return dates
}

function checkCronExpression (date, minutes, hours, dayOfMonth, month, dayOfWeek, year) {
  if (!checkMinutes(date.getMinutes(), minutes)) {
    return false
  }
  if (!checkHours(date.getHours(), hours)) {
    return false
  }
  if (!checkMonth(date.getMonth(), month)) {
    return false
  }
  if (dayOfMonth !== '?' && !checkDayOfMonth(date.getDate(), dayOfMonth)) {
    return false
  }
  if (dayOfWeek !== '?' && !checkDayOfWeek(date.getDay(), dayOfWeek)) {
    return false
  }
  return checkYear(date.getFullYear(), year)
}

function checkMinutes (dateMinutes, expression) {
  if (expression === '*') {
    return true
  }
  const minutes = expression.split(',')
  return minutes.includes(`${dateMinutes}`)
}

function checkHours (dateHours, expression) {
  if (expression === '*') {
    return true
  }
  const hours = expression.split(',')
  return hours.includes(`${dateHours}`)
}

function checkDayOfMonth (dateDayOfMonth, expression) {
  if (expression === '*') {
    return true
  }
  const dayOfMonths = expression.split(',')
  return dayOfMonths.includes(`${dateDayOfMonth}`)
}

function checkMonth (dateMonth, expression) {
  if (expression === '*') {
    return true
  }
  const months = expression.split(',')
  return months.includes(`${dateMonth + 1}`)
}

function checkDayOfWeek (dateDayOfWeek, expression) {
  if (expression === '*') {
    return true
  }
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const values = expression.split(',').map(val => {
    if (val.includes('-')) {
      const [start, end] = val.split('-')
      return daysOfWeek.slice(daysOfWeek.indexOf(start), daysOfWeek.indexOf(end) + 1)
    }
    return val
  })
  const flatValues = [].concat(...values)
  return flatValues.includes(daysOfWeek[dateDayOfWeek])
}

function checkYear (dateYear, expression) {
  if (expression === '*') {
    return true
  }
  const years = expression.split(',')
  return years.includes(`${dateYear}`)
}

module.exports = {
  generateUpcomingDates
}
