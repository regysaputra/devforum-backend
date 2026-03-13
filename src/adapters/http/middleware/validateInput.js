const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const formattedErrors = {};

      error.details.forEach((err) => {
        const field = err.path[0];

        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }

        formattedErrors[field].push(err.message.replace(/"/g, ''));
      });

      return res.status(400).json({
        status: "fail",
        data: formattedErrors
      });
    }

    next();
  }
}

export default validateInput;