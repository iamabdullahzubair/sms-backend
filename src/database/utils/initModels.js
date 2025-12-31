const path = require("path");
const fs = require("fs");


// this function loads the models to the sequelize
const initModels = (sequelizeInstance, directory) => {
    const models = {};
    // const absolutePath = path.join(__dirname, directory);
  
    console.log(`Loading models from: ${directory}`);
  
    fs.readdirSync(directory)
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const model = require(path.join(directory, file));
        if (typeof model === "function") {
          const initializedModel = model(sequelizeInstance);
          models[initializedModel.name] = initializedModel;
        }
      });
  
    return models;
  };
  
module.exports = {
    initModels
}