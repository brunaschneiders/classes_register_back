import ClassGrowdever from '../models/ClassGrowdever';
import GrowdevClass from '../models/GrowdevClass';
import Cache from '../../lib/Cache';

class ClassGrowdeverController {
  async store(req, res) {
    const t = await ClassGrowdever.sequelize.transaction();

    try {
      const { userType } = req;

      if (userType === 'Admin' || userType === 'Growdever') {
        const { class_uid } = req.body;

        const classData = await GrowdevClass.findByPk(class_uid);

        const classAvailableVacancies =
          classData?.dataValues?.available_vacancies;
        if (classAvailableVacancies > 0) {
          const classGrowdever = await ClassGrowdever.create(req.body, {
            transaction: t,
          });

          await GrowdevClass.update(
            {
              available_vacancies: classAvailableVacancies - 1,
            },
            {
              where: { uid: class_uid },
            },
            { transaction: t }
          );

          await t.commit();

          await Cache.delete('classesAndScheduledGrowdevers');

          return res.status(200).json({
            response: {
              success: true,
              message: 'Agendamento realizado com sucesso!',
              classGrowdever,
            },
          });
        }

        return res.status(400).json({
          response: {
            success: false,
            message: 'Não há mais vagas disponíveis para esta aula.',
          },
        });
      }

      return res
        .status(403)
        .json({ response: { success: false, message: 'Acesso Negado.' } });
    } catch (error) {
      await t.rollback();

      return res.status(400).json({
        response: {
          success: false,
          message:
            'Não foi possível realizar este cadastro. Por favor, revise os dados e tente novamente.',
          error: error.message,
        },
      });
    }
  }

  async delete(req, res) {
    try {
      const { userType } = req;

      if (userType === 'Admin' || userType === 'Growdever') {
        const { uid } = req.params;

        const deleted = await ClassGrowdever.destroy({ where: { uid } });
        if (!deleted) {
          return res.status(400).json({
            response: {
              success: false,
              message: 'Este agendamento não foi encontrado.',
            },
          });
        }

        await Cache.delete('classesAndScheduledGrowdevers');

        return res.status(200).json({
          response: {
            success: true,
            message: 'Agendamento cancelado com sucesso!',
          },
        });
      }

      return res
        .status(403)
        .json({ response: { success: false, message: 'Acesso Negado.' } });
    } catch (error) {
      return res.status(400).json({
        response: {
          success: false,
          message:
            'Não foi possível cancelar este agendamento. Por favor, tente novamente.',
          error: error.message,
        },
      });
    }
  }
}

export default new ClassGrowdeverController();
