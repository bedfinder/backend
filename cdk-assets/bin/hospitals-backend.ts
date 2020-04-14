#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HospitalsBackendStack } from '../lib/hospitals-backend-stack';
import { BedfinderStages  } from '../lib/bedfinder-props'

const environments = {
    "prod": { region: "eu-central-1", account: "643555865554"},
    "test": { region: "eu-central-1", account: "643555865554"}
}

const app = new cdk.App();
new HospitalsBackendStack(app, `${BedfinderStages.test}-HospitalsBackend-Stack`, {stage: BedfinderStages.test, context: "HospitalsBackend",env: environments.test});
new HospitalsBackendStack(app, `${BedfinderStages.prod}-HospitalsBackend-Stack`, {stage: BedfinderStages.prod, context: "HospitalsBackend",env: environments.prod});
