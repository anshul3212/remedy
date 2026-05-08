import { appConfig } from "@/config/app";
import { s3Client } from "@/config/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generateReadUrl = async (key: string): Promise<string> => {
    try {
        const command = new GetObjectCommand({
            Bucket: appConfig.aws.bucket,
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60 * 24 * 5
        });
        return url;
    } catch (error) {
        console.error('Error generating read URL:', error);
        throw new Error('Failed to generateReadUrl');
    }
};