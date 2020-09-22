import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { isArray } from "util";
import { Group } from "../entity/Group";

class GroupController {
  public static listAll = async (req: Request, res: Response) => {
      const groupRepository = getRepository(Group);
      const groups = await groupRepository.find();
      res.send(groups);
  }
    
  public static getGroup = async (req: Request, res: Response) => {
    const groupRepository = getRepository(Group);
    const groups = await groupRepository.findOne(req.params.id);
    res.send(groups);
}

  public static editGroup = async (req: Request, res: Response) => {
      const groupRepository = getRepository(Group);
      const { name } = req.body;
      if (name == undefined) {
          res.status(400).send(i18n.__("errors.notAllFieldsProvided"));
          return;
      }
      try {
          const group = await groupRepository.findOne({ where: { guid: req.params.guid } });
          group.name = name;
          groupRepository.save(group);
      } catch (err) {
          res.status(500).send({ message: err });
          return;
      }
      res.send({ status: true });
  }

  public static newGroup = async (req: Request, res: Response) => {
      const groupRepository = getRepository(Group);
      let { groups } = req.body;
      if (!(groups && isArray(groups) && groups.length > 0)) {
          res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
          return;
      }
      groups = groups.map((t) => ({
          activated: false,
          guid: t.guid,
          name: t.name,
      }));

      try {
          await groupRepository.save(groups);
      } catch (e) {
          res.status(500).send({ message: `${i18n.__("errors.error")} ${e.toString()}` });
          return;
      }

      res.status(200).send({ status: true });
  }

  public static deleteGroup = async (req: Request, res: Response) => {
      const { id } = req.params;
      const groupRepository = getRepository(Group);
      try {
          groupRepository.delete(id);
      } catch (error) {
          res.status(404).send({ message: i18n.__("errors.groupNotFound") });
          return;
      }
      res.status(200).send({ status: true });
  }
}

export default GroupController;
