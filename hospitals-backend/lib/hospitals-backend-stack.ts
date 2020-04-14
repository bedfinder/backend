import * as cdk from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { UserPool  } from '@aws-cdk/aws-cognito';
import { HospitalsBackendStackProbs } from '../lib/bedfinder-props'
import { Construct, Tag } from '@aws-cdk/core';
import { CfnDBCluster,CfnDBInstance } from '@aws-cdk/aws-docdb'


export class HospitalsBackendStack extends cdk.Stack {
  
  props?:HospitalsBackendStackProbs
  
  constructor(scope: cdk.Construct, id: string, props?: HospitalsBackendStackProbs) {
    super(scope, id, props);


    this.props = props;
    this.createCognitoUserPool()
    this.createDocumentDB()


    const hospitalsbackendFunktion = new Function(this, `${props?.stage}-${props?.context}-handlerfunction`, {
      runtime: Runtime.NODEJS_12_X,    
      code: Code.fromAsset('functions'),  
      handler: 'lambda.handler'                
    });
    this.addDefaultTags(hospitalsbackendFunktion)
  
    const api = new LambdaRestApi(this, `${props?.stage}-${props?.context}-api-gateway`, {
      handler: hospitalsbackendFunktion,
      restApiName: "BackendProxy",
    });

    this.addDefaultTags(api)

  }

  createCognitoUserPool():UserPool{

    const userPool =  new UserPool(this, `${this.props?.stage}-${this.props?.context}`, {
      
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true
      },
    });
    this.addDefaultTags(userPool)
    return userPool
  }
  
  createDocumentDB(){
    const dbCluster = new CfnDBCluster(this, `${this.props?.stage}-${this.props?.context}-docdb`, {
      storageEncrypted: true,
      //availabilityZones: vpc.availabilityZones.splice(3),
      dbClusterIdentifier: `${this.props?.stage}-${this.props?.context}-docdb`,
      masterUsername: "dbuser",
      masterUserPassword: process.env.MASTER_USER_PASSWORD as string,
      //vpcSecurityGroupIds: [sg.securityGroupName],
      //dbSubnetGroupName: subnetGroup.dbSubnetGroupName,
    });

    const dbInstance = new CfnDBInstance(this, `${this.props?.stage}-${this.props?.context}-docdb-instance`, {
      dbClusterIdentifier: dbCluster.ref,
      autoMinorVersionUpgrade: true,
      dbInstanceClass: "db.r5.large",
      dbInstanceIdentifier: `${this.props?.stage}-${this.props?.context}-docdb-instance`
    });
    dbInstance.addDependsOn(dbCluster);

  }

  addDefaultTags(construct:Construct){
    const stage = this.props?.stage? this.props?.stage:"";
    const context = this.props?.context? this.props?.context:""; 
    Tag.add(construct,"Stage", stage )
    Tag.add(construct,"Context ", context )
  }

}

