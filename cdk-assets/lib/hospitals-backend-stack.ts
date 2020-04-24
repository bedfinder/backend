import * as cdk from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { UserPool  } from '@aws-cdk/aws-cognito';
import { HospitalsBackendStackProbs } from '../lib/bedfinder-props'
import { Construct, Tag } from '@aws-cdk/core';
import { CfnDBCluster,CfnDBInstance, CfnDBSubnetGroup } from '@aws-cdk/aws-docdb'
import { Vpc,IVpc,SubnetType, BastionHostLinux, SecurityGroup, Port} from '@aws-cdk/aws-ec2'

//todo read from other stack
const bedfinderVpcIds = {
  "Test": "vpc-079c41f4f50f61440",
  "Prod": ""
}

export class HospitalsBackendStack extends cdk.Stack {
  
  props:HospitalsBackendStackProbs
  bedfinderVpc:IVpc


  constructor(scope: cdk.Construct, id: string, props: HospitalsBackendStackProbs) {
    super(scope, id, props);

    const docDbPort = 27017
    this.props = props;
    this.bedfinderVpc = this.getBedfinderVPC()
    this.createCognitoUserPool()
    
    const docDBsecurityGroup = new SecurityGroup(this, `${this.props.stage}-DocDbSecurityGroup`, {
      vpc: this.bedfinderVpc,
      securityGroupName: `${this.props.stage}-DocDbSecurityGroup`
    });
    
    const lambdasecurityGroup = new SecurityGroup(this, `${this.props.stage}-LambdaSecurityGroup`, {
      vpc: this.bedfinderVpc,
      securityGroupName: `${this.props.stage}-LambdaSecurityGroup`
    });

    const bastionSecurityGroup = new SecurityGroup(this, `${this.props.stage}-BastionSecurityGroup`, {
      vpc: this.bedfinderVpc,
      securityGroupName: `${this.props.stage}-BastionSecurityGroup`
    });

    const documentDb = this.createDocumentDB(docDbPort,docDBsecurityGroup)

    const bastionHost = new BastionHostLinux(this, `${props.stage}-BastionHost`, {
      vpc: this.bedfinderVpc,
      subnetSelection: { subnetType: SubnetType.PRIVATE },
      securityGroup: bastionSecurityGroup
    });

    const hospitalsbackendFunktion = new Function(this, `${props?.stage}-${props?.context}-handlerfunction`, {
      runtime: Runtime.NODEJS_12_X,    
      code: Code.fromAsset('functions'),  
      handler: 'lambda.handler',
      vpc: this.bedfinderVpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE },
      securityGroup: lambdasecurityGroup,
      environment: {  
        "MONGODB_URI": documentDb.attrEndpoint,
        "MONGODB_PORT" : documentDb.attrPort 
      }              
    });

    this.addDefaultTags(hospitalsbackendFunktion)
    
    docDBsecurityGroup.addIngressRule(lambdasecurityGroup,Port.tcp(docDbPort),"Allow Backend Lambda")
    docDBsecurityGroup.addIngressRule(bastionSecurityGroup,Port.tcp(docDbPort),"Allow Bastion Host")

    
    const api = new LambdaRestApi(this, `${props?.stage}-${props?.context}-api-gateway`, {
      handler: hospitalsbackendFunktion,
      restApiName: "BackendProxy",
    });

    this.addDefaultTags(api)

  }

  getBedfinderVPC():IVpc{
    const VpcName = `${this.props.stage}-BedfinderNetwork-Stack/${this.props.stage}-BedfinderNetwork-VPC` 
    const stackName = `${this.props.stage}-BedfinderNetwork-Stack`
    
    const externalVpc = Vpc.fromLookup(this, `${this.props.stage}-BedfinderVPC`, {
      vpcName: VpcName,
      tags: {"aws:cloudformation:stack-name":stackName}
    });
    return externalVpc
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
  
  createDocumentDB(docDbPort:number, securityGroup:SecurityGroup):CfnDBCluster{
        
    let subnetIds: string[] = [];
    
    for(var subnet of this.bedfinderVpc.privateSubnets){
      subnetIds.push(subnet.subnetId)
    }  

    const subnetGroup = new CfnDBSubnetGroup(this,`${this.props.stage}-DocDbSubnetgroup`,{
      subnetIds: subnetIds,
      dbSubnetGroupDescription: "Private Bedfinder Subnet",
      dbSubnetGroupName: `${this.props.stage}-DocDbSubnetgroup`
      
    })

    const dbCluster = new CfnDBCluster(this, `${this.props?.stage}-${this.props?.context}-docdb`, {
      storageEncrypted: true,
      availabilityZones: this.bedfinderVpc.availabilityZones.splice(2),
      
      dbClusterIdentifier: `${this.props?.stage}-${this.props?.context}-docdb`,
      masterUsername: "dbuser",
      masterUserPassword: process.env.MASTER_USER_PASSWORD as string,
      vpcSecurityGroupIds: [securityGroup.securityGroupName],
      dbSubnetGroupName: subnetGroup.dbSubnetGroupName?.toLowerCase(),
      port: docDbPort
      
    });

    dbCluster.addDependsOn(subnetGroup)

    const dbInstance = new CfnDBInstance(this, `${this.props?.stage}-${this.props?.context}-docdb-instance`, {
      dbClusterIdentifier: dbCluster.ref,
      autoMinorVersionUpgrade: true,
      dbInstanceClass: "db.r5.large",
      dbInstanceIdentifier: `${this.props?.stage}-${this.props?.context}-docdb-instance`
    });
    dbInstance.addDependsOn(dbCluster);

    return dbCluster;

  }

  addDefaultTags(construct:Construct){
    const stage = this.props?.stage? this.props?.stage:"";
    const context = this.props?.context? this.props?.context:""; 
    Tag.add(construct,"Stage", stage )
    Tag.add(construct,"Context ", context )
  }

}

