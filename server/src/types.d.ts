import { Request, Response } from "express";

export interface HttpContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
}
