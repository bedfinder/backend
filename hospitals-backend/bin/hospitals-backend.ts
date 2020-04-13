#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HospitalsBackendStack } from '../lib/hospitals-backend-stack';


const environments = {
    "prod": { region: "eu-central-1", account: "643555865554"},
    "test": { region: "eu-central-1", account: "643555865554"}
  }

const app = new cdk.App();
new HospitalsBackendStack(app, 'HospitalsBackendStack', {env: environments.test});
