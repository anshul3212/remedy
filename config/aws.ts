import { S3Client } from "@aws-sdk/client-s3";
import { appConfig } from "./app";


if (
  !appConfig.aws.region ||
  !appConfig.aws.accessKey ||
  !appConfig.aws.secretKey
) {
  throw new Error("AWS env variables are missing");
}
 
export const s3Client = new S3Client({
    region: appConfig.aws.region,
    credentials: {
        accessKeyId: appConfig.aws.accessKey,
        secretAccessKey: appConfig.aws.secretKey,
    },
});