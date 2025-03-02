const firstValues = (form, fields, exceptions = []) => {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => {
      if (exceptions.includes(key)) {
        return [key, value];
      }
      return [key, Array.isArray(value) ? value[0] : value];
    }),
  );
};

module.exports = { firstValues };
