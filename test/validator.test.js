const { awsCronExpressionValidator } = require('../src')

test('validate aws expression should be valid', () => {
  const expr = '0 12 ? * MON-FRI *'
  const { minute, hour, expression } = awsCronExpressionValidator(expr)
  expect(minute).toBe('0')
  expect(hour).toBe('12')
  expect(expression).toBe(expr)
})

test('validate aws expression should be invalid', () => {
  const expr = '0 * * * MON-FRI *'
  try {
    awsCronExpressionValidator(expr)
  } catch (error) {
    expect(error.message).toBe('Invalid combination of day-of-month \'*\' and day-of-week \'MON-FRI\'. One must be a question mark (?)')
  }
})

test('validate aws expression should be invalid', () => {
  const expr = '0 * ? * MON-FRI 1969'
  try {
    awsCronExpressionValidator(expr)
  } catch (error) {
    expect(error.message).toBe(`Invalid year value '1969'.`)
  }
})
