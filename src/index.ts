import * as functions from "firebase-functions";
import { expressReceiver } from "./slack/app";
import { google } from "googleapis";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const slack = functions.https.onRequest(expressReceiver.app);

export const getSpreadSheet = functions.https.onRequest(
  async (request, response) => {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets("v4");
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: "SPREAD_SHEET_ID",
      range: "sheet1!A1:A1000",
      auth: auth,
    });

    response.send(
      Array(
        resp.data.values?.reduce((pre, current) => {
          pre.push(...current);
          return pre;
        }, [])
      )
    );
  }
);
