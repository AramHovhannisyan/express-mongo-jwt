import { Request, Response, NextFunction } from 'express';
import { getAll, createOne, getOne, loginOne, logoutOne, refreshOne } from '../services/userService';
import problem from "../errorHandling/problem";
import bcrypt from 'bcrypt';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return next(problem(1006, req));
    }

    const userData = await createOne(email, password);
    
    if(!userData) {
      return next(problem(1006, req));
    }

    res.cookie('refreshToken', userData.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); // secure: true

    return res.status(200).json({
      status: 'success',
      data: {
        userData
      }
    });
  } catch (error) {
    console.log(error);
    problem(1001, req);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    if(!email || !password) {
      return next(problem(1006, req));
    }

    const user = await getOne(email);

    if(!user) {
      return next(problem(1004, req));
    }

    const { password: passFromDB } = user;

    const isPassValid = bcrypt.compareSync(password, passFromDB);

    if(!isPassValid) {
      return next(problem(1004, req));
    }
    const payload = {
      id: user._id,
      email: user.email
    };

    const userData = await loginOne(payload);

    res.cookie('refreshToken', userData.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); // secure: true
    res.locals.user = payload;

    return res.status(200).json({
      status: 'success',
      data: {
        userData
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if(!refreshToken) {
      return res.status(204).json({
        status: 'fail',
        message: 'No one To Log Out',
      });
    }

    const logout = logoutOne(refreshToken);
    res.clearCookie('refreshToken');

    return res.status(204).json({
      status: 'success',
      logout
    });
  } catch (error) {
    console.log(error);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if(!refreshToken) {
      return next(problem(1004, req));
    }
    
    const userData = await refreshOne(refreshToken);
    if(!userData) {
      return next(problem(1004, req));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        userData
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAll();

    return res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
  } catch (error) {
    console.log(error);
  }
};


export { register, login, logout, refresh, getAllUsers };