const validate = (schema) => (req, res, next) => {
  try {
    console.log(req.body);
    req.body = schema.parse(req.body);
    
    next();
  } catch (error) {
    return res.status(422).json(error.errors);
  }
};

export default validate;
