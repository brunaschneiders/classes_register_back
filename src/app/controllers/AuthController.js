import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class AuthController {
  async store(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'Usuário não encontrado.' });
      }

      if (!(await user.checkPassword(password))) {
        return res
          .status(400)
          .json({ success: false, message: 'Senha inválida.' });
      }

      const { uid, name, type } = user;

      return res.status(200).json({
        success: true,
        user: {
          uid,
          name,
          username,
          type,
        },
        token: jwt.sign({ uid, type }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          'Não foi possível realizar o login. Por favor, tente novamente.',
        error: error.message,
      });
    }
  }
}

export default new AuthController();
