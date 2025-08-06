import { type Request, type Response, type NextFunction } from 'express';
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
declare const catchAsync: (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => void;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map