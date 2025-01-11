import * as Entity from "../entities/index.js";
import { AppDataSource } from "../server.js";

export const getTemplateById = async (templateId: string) => {
  return await AppDataSource.getRepository(Entity.Templates).findOneBy({
    templateId
  });
};
