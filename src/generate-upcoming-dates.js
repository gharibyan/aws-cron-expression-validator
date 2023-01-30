const {
  addDays,
  isSameMinute,
  isSameHour,
  isSameDay,
  isSameMonth,
  isSameWeekday,
  format
} = require('date-fns')
const { awsCronExpressionValidator } = require('./aws-cron-expression-validator.js')

function generateUpcomingDates (expression, numberOfDats = 10) {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = awsCronExpressionValidator(expression)

  const dates = []
  const now = new Date()

  for (let i = 0; i < numberOfDats; i++) {
    const next = addDays(now, i)
    if (minute === '*' || isSameMinute(next, now)) {
      if (hour === '*' || isSameHour(next, now)) {
        if (dayOfMonth === '*' || isSameDay(next, now)) {
          if (month === '*' || isSameMonth(next, now)) {
            if (dayOfWeek === '*' || isSameWeekday(next, now)) {
              dates.push(format(next, 'yyyy-MM-dd HH:mm:ss'))
            }
          }
        }
      }
    }
  }

  return dates
}

module.exports = {
  generateUpcomingDates
}
