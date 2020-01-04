function formatInputValue (e) {
  if (e.currentTarget.value.length <=5) {
    console.log(e.currentTarget.value)
  }

  if (e.currentTarget.value.length === 2) {
    e.currentTarget.value += ":"
  }
}