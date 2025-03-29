const Joi = require("joi");

const authSchema = Joi.object({
 name: Joi.string().min(3).required(),
 email: Joi.string().email().lowercase().required(),
 password: Joi.string().required().min(8),
 confirmPassword: Joi.string()
   .valid(Joi.ref("password"))
   .required()
   .strict()
   .messages({ "any.only": "{{#label}} does not match" })
   .label("confirm password"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required().min(8),
 });

module.exports = {
 authSchema, loginSchema
};
