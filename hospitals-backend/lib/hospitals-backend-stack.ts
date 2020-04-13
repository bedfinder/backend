import * as cdk from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaRestApi, AuthorizationType,LambdaIntegration, CfnAuthorizer } from '@aws-cdk/aws-apigateway';
import { UserPool  } from '@aws-cdk/aws-cognito';

export class HospitalsBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createCognitoUserPool()

    const hello = new Function(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_12_X,    
      code: Code.fromAsset('functions'),  
      handler: 'lambda.handler'                
    });
  
    const api = new LambdaRestApi(this, 'Endpoint', {
      handler: hello,
      restApiName: "Hello-World",
    });

  }

  createCognitoUserPool():UserPool{

    return new UserPool(this, 'Bedfinder-Hospitals', {
      
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true
      },
    });

  }
  

}

