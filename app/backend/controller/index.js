const hoja = require('../models');

const create = async (req, res, next) => {
  const { body = {} } = req;
  const document = new hoja(body);

  try {
    const doc = await document.save();
    res.status(201);
    res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    next(new Error(err));
  }
};

const read = async (req, res, next) => {
 
  try {
    const fechas = await hoja.find({},{'Fecha':1,'_id':0});
    
    res.status(201);
    res.json({
      success: true,
      data: fechas,
    });
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = { create, read };
