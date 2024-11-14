const validate = (schema, request) => {
  const result = schema.validate(request);

  if (result.error) {
    throw result.error;
  } else {
    return result.value;
  }
};

module.exports = {
  validate: validate,
};

// const validate = (module.exports = {
//   validate: (schema, request) => {
//     const result = schema.validate(request);

//     if (result.error) {
//       throw result.error;
//     } else {
//       return result.value;
//     }
//   },
// });
