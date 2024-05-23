/** @format */

import OpenIDError = require('../errors/open_id_error');
import {NextFunction, Request, Response} from 'express';
import openIDService = require('./encryption/open_id');
import openIDEncryptionService = require('./encryption/open_id_encryption');
import options = require('./options');

function isOpenIDEnabled() {
    if (process.env.ENABLE_OAUTH?.toLocaleLowerCase() === 'true') return true;
    return false;
}

function checkOpenIDRequirements() {
    if (!isOpenIDEnabled()) return false;
    if (process.env.BASE_URL === undefined) throw new OpenIDError('BASE_URL is undefined in .env!');
    if (process.env.CLIENT_ID === undefined) throw new OpenIDError('CLIENT_ID is undefined in .env!');
    if (process.env.ISSUER_BASE_URL === undefined) throw new OpenIDError('ISSUER_BASE_URL is undefined in .env!');
    if (process.env.SECRET === undefined) throw new OpenIDError('SECRET is undefined in .env!');

    return true;
}

async function verifySubId(req: Request, res: Response, next: NextFunction) {
    req.oidc.fetchUserInfo().then((result) => {
        return {success: true, result: openIDEncryptionService.verifyOpenIDSubjectIdentifier(result.sub)};
    });
}

function login(req: Request, res: Response, next: NextFunction) {
    if (openIDService.isSubjectIdentifierSaved()) return {success: false, message: 'User ID already saved!'};
    if (!req.oidc.user) return {success: false, message: 'User not logged in!'};

    req.oidc.fetchUserInfo().then((result) => {
        openIDService.saveSubjectIdentifier(result.sub);
    });
    return {success: true, message: 'User ' + req.oidc.user.sub + ' saved!'};
}

export = {
    isOpenIDEnabled,
    checkOpenIDRequirements,
    verifySubId,
    login,
};