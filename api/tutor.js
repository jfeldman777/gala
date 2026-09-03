import { handleHelperRequest } from "../lib/handle-helper-request.js";

export default async function handler(req, res) {
  await handleHelperRequest(req, res, "tutor");
}
