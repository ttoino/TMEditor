import { readDBInfoByID } from '@app/parsers/config-parser'
import path from 'path'
import { ModelStatic, Sequelize } from 'sequelize'
import { SequelizeAuto } from 'sequelize-auto'
import type { DBConfigSQL, ModelStructureSQL } from '@types'

const modelsBaseDir = path.resolve(__dirname, './models')

export const generateModels = async (sequelize: Sequelize, id: string) => {
  const { structure = [] } = <DBConfigSQL>readDBInfoByID(id)

  const auto = new SequelizeAuto(sequelize, null, null, {
    closeConnectionAutomatically: false,
    directory: `${modelsBaseDir}/${id}`,
    noAlias: true,
    additional: {
      timestamps: false
    }
  })
  await auto.run()

  const db = await importModels(sequelize, id)
  // Manually create associations
  Object.keys(structure).forEach((modelName: string) => {
    const model = (<ModelStructureSQL>structure)[modelName]

    model.relations?.forEach((relation) => {
      const m = db[modelName]
      const target = db[relation.target]

      if (relation.type === 'hasMany') {
        m.hasMany(target, { foreignKey: relation.FK })
      } else if (relation.type === 'belongsTo') {
        m.belongsTo(target, { foreignKey: relation.FK })
      } else if (relation.type === 'belongsToMany' && relation.through) {
        m.belongsToMany(target, { through: db[relation.through], foreignKey: relation.FK })
      }
    })
  })

  return db
}

export const getModelPrimaryKeys = (model: ModelStatic<any>): Promise<string> => {
  return model.describe().then(function (schema: any) {
    return Object.keys(schema).filter(function (field) {
      return schema[field].primaryKey
    })[0]
  })
}

export const containsAttribute = (model: ModelStatic<any>, attr: string): Promise<boolean> => {
  return model.describe().then(function (schema: any) {
    return Object.keys(schema).includes(attr)
  })
}

const importModels = async (sequelize: Sequelize, id: string): Promise<any> => {
  const initModels = await import(/* webpackIgnore: true */ `${modelsBaseDir}/${id}/init-models`)

  return initModels.default(sequelize)
}
