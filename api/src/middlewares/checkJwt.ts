import { NextFunction, Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";

export const checkJwt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get the jwt token from the head
    let token = req.headers.authorization as string;
    if (!token) {
        token = req.query.authorization as string;
    }
    if (!token) {
        res.status(401).send({ message: i18n.__("errors.unauthorized") });
        return;
    }
    token = token.replace("Bearer ", "");
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = (jwt.verify(token, res.app.locals.config.JWT_SECRET) as any);
        res.locals.jwtPayload = jwtPayload;
        res.locals.jwtPayload.userId = parseInt(res.locals.jwtPayload.userId, undefined);
        i18n.setLocale(res.app.locals.config.DEFAULT_LANGUAGE || "de");
    } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({ message: i18n.__("errors.sessionExpired"), logout: true });
        return;
    }

    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, res.app.locals.config.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.setHeader("Authorization", newToken);

    // Call the next middleware or controller
    next();
};
