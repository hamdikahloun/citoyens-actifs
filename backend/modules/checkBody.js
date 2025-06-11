function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    console.log(body[field]);
    if (!body[field] || body[field] === '') {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };