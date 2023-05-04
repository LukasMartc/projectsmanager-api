import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { confirmAccount, recoverPassword } from "../emails/userEmail.js";
import generateJWT from "../helper/generateJWT.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({
      where: {
        email
      }
    });

    if(userExists) {
      return res.status(409).json({ msg: 'Email already registered' });
    };

    const newUser = await User.create({
      name,
      email,
      password
    });

    confirmAccount({
      name: newUser.name,
      email: newUser.email,
      token: newUser.token
    });

    return res.json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error creating user' });
  };
};

const confirmed = async (req, res) => {
  const { token } = req.params;

  try {
    const validToken = await User.findOne({
      where: {
        token
      }
    });
  
    if(!validToken) {
      return res.status(403).json({ msg: 'Invalid token' });
    };
    
    validToken.confirmed = true;
    validToken.token = null;

    await validToken.save();
    return res.json({ msg: 'User confirmed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error confirm user' });
  };
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userExists = await User.findOne({
      where: {
        email
      }
    });
  
    if(!userExists) {
      return res.status(404).json({ msg: 'Email does not exist' });
    } else if(!userExists.confirmed) {
      return res.status(403).json({ msg: 'The user has not been confirmed' });
    };
  
    userExists.token = uuidv4();
    await userExists.save();

    recoverPassword({
      name: userExists.name,
      email: userExists.email,
      token: userExists.token
    });

    return res.json({ msg: 'We have sent you an email with the instructions' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error forgot password' });
  };
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  try {
    const validToken = await User.findOne({
      where: {
        token
      }
    });
  
    if(validToken) {
      return res.json({ msg: 'The token is valid and the user exists' });
    } else {
      return res.status(403).json({ msg: 'Invalid token' });
    };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error check token' });
  };
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        token
      }
    });

    if(!user) {
      return res.status(403).json({ msg: 'Invalid token' });
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.token = null;

    await user.save();

    return res.json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error new password' });
  };
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email
      }
    });

    if(!user) {
      return res.status(404).json({ msg: 'Wrong username and/or password' });
    } else if(!user.confirmed) {
      return res.status(404).json({ msg: 'The user has not been confirmed' });
    }

    const isMatch = await user.checkPassword(password);

    if(isMatch) {
      const token = generateJWT(user.id);
      res.cookie('tkn', token, {
        httpOnly: true
        
      });
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token
      })
    } else {
      return res.status(403).json({ msg: 'Wrong username and/or password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error login' });
  }
};

const rememberMe = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email
      }
    });

    if(!user) {
      return res.status(404).json({ msg: 'Wrong username and/or password' });
    } else if(!user.confirmed) {
      return res.status(404).json({ msg: 'The user has not been confirmed' });
    }

    const isMatch = await user.checkPassword(password);

    if(isMatch) {
      const token = generateJWT(user.id);
      res.cookie('tkn', token, {
        httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30,
        
      });
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token
      })
    } else {
      return res.status(403).json({ msg: 'Wrong username and/or password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error login' });
  }
};

const profile = async (req, res) => {
  const { dataValues } = req.user;
  try {
    return res.json(dataValues);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'There was a server error' });
  };
};

const logout = async (req, res) => {
  try {
    res.clearCookie('tkn');
    return res.json({ msg: 'Logged out successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to logging out' });
  }
};

export {
  registerUser,
  confirmed,
  forgotPassword,
  checkToken,
  newPassword,
  login,
  rememberMe,
  profile,
  logout
};