import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
// import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Github Repository

    // CodePipeline

    // S3 Bucket
    const bucket = new s3.Bucket(this, "FruitTreesFrontendBucket", {
      bucketName: "fruit-trees-frontend",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // S3 Bucket Deployment
    new s3Deploy.BucketDeployment(this, "FruitTreesFrontendBucketDeployment", {
      sources: [
        s3Deploy.Source.asset(path.join(__dirname, "../../frontend/dist")),
      ],
      destinationBucket: bucket,
    });

    // Cloudfront Distribution
    const distribution = new cloudfront.Distribution(
      this,
      "FruitTreesFrontendDistribution",
      {
        defaultBehavior: {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          compress: true,
          origin: new cloudfrontOrigins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: "/error.html",
            ttl: cdk.Duration.minutes(30),
          },
        ],
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      }
    );

    // Route 53

    // What about SSL credentials with certificate manager?
  }
}
