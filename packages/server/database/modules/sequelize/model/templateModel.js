const { defaultAsArray } = require('../../../../utils/default-values-generator')

module.exports = (sequelize, DataTypes, modelName, modelStructure) => {
  var { PK, attributes, relations } = modelStructure

  const createDataType = () => {
    return { type: DataTypes.STRING }
  }

  const createForeignKey = (name) => {
    return { foreignKey: name }
  }

  const createModelDefinition = () => {
    var modelDefinition = {}
    if (PK) {
      modelDefinition[PK] = { ...createDataType(), primaryKey: true }
    }

    if (attributes) {
      attributes = defaultAsArray(attributes)
      attributes.forEach((el) => {
        modelDefinition[el] = createDataType()
      })
    }

    return modelDefinition
  }

  const createModelAssociations = (models) => {
    if (relations) {
      relations = defaultAsArray(relations)
      relations.forEach((el) => {
        if (el.type === 'hasMany') {
          templateModel.hasMany(models[el.target], createForeignKey(PK))
        } else if (el.type === 'belongsTo') {
          templateModel.belongsTo(models[el.target], createForeignKey(el.FK))
        } else {
          templateModel.belongsToMany(models[el.target], { through: models[el.through], ...createForeignKey(el.FK) })
        }
      })
    }
  }

  const templateModel = sequelize.define(modelName,
    createModelDefinition(), {
      name: {
        singular: modelName,
        plural: modelName
      },
      freezeTableName: true,
      timestamps: false,
      modelName: modelName
    })

  templateModel.associate = (models) => {
    createModelAssociations(models)
    templateModel.models = models
  }

  return templateModel
}
