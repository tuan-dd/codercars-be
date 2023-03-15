const validate = (schema) => async (req, res, next) => {
   const body = req.body;
   const query = req.query;
   try {
      if (Object.keys(body).length) await schema.validate(body);

      if (Object.keys(query).length) await schema.validate(query);

      next();
   } catch (error) {
      next(error);
   }
};

module.exports = validate;
