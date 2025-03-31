import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ses = new SESClient({ region: "us-east-1" });
const dynamo = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const body = event;
    const { message, source } = body;
    
    if (!message) {
      return { statusCode: 400, body: "Message is required" };
    }

    const feedbackId = crypto.randomUUID(); // Node 18+ only
    const timestamp = Date.now();

    // Save to DynamoDB
    await dynamo.send(new PutItemCommand({
      TableName: "TABLE_NAME",
      Item: {
        feedbackId: { S: feedbackId },
        message: { S: message },
        timestamp: { N: timestamp.toString() },
        ...(source ? { source: { S: source } } : {})
      }
    }));

    // Send email
    const emailParams = {
      Destination: {
        ToAddresses: ["TO_EMAIL_ADDRESS@MAIL.COM"],
      },
      Message: {
        Body: {
          Text: {
            Data: `New feedback:\n\nMessage: ${message}\Source: ${source || "Not provided"}\nTime: ${new Date(timestamp).toISOString()}`
          }
        },
        Subject: { Data: "New App Feedback" }
      },
      Source: "SOURCE_EMAIL_ADDRESS@MAIL.COM",
    };

    await ses.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback submitted successfully" }),
    };
  } catch (err) {
    console.error("Error submitting feedback:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
};
