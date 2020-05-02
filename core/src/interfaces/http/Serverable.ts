import express from 'express';

export interface Serverable {
  app: express.Application;
}
