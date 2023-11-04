/* eslint-disable prettier/prettier */
import express from 'express';

interface User {
  id: string;
}

export interface Request extends express.Request {
  user: User;
}