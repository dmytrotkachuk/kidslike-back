const { ChildrenModel } = require('./children.model');
const UserModel = require('../users/users.model');
const Joi = require('joi');

class Controllers {
  addChild = async (req, res, next) => {
    try {
      // const isExisted = await ChildrenModel.findOne({ name: req.body.name });
      // if (isExisted) {
      //   return res.status(409).send(`Child with this name exists`);
      // }

      // req.user = { _id: '5fb313842e5c6c182c9b214f' }; //Заглушка, ожидает обьект req.user с полем _id Родителя

      req.body.idUser = req.user._id;
      const child = await ChildrenModel.create(req.body);
      let user = await UserModel.findById(req.body.idUser);
      if (!user) {
        res.status(400).send('No user');
      }
      user.childrens.push(child.id);
      user.save();

      return res
        .status(201)
        .send({ id: child._id, name: child.name, gender: child.gender });
    } catch (err) {
      next(err.message);
    }
  };

  validChild = (req, res, next) => {
    const validator = Joi.object({
      name: Joi.string().empty().max(30).required(),
      gender: Joi.string().empty().required(),
    });
    const { error } = validator.validate(req.body);
    return error
      ? res.status(400).send({ message: error.details[0].message })
      : next();
  };
}

module.exports = new Controllers();
