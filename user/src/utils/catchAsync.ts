import { Request, Response, NextFunction } from 'express';

interface AsyncRequestHandler {
    (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const catchAsync = (fn: AsyncRequestHandler): (req: Request, res: Response, next: NextFunction) => void => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;