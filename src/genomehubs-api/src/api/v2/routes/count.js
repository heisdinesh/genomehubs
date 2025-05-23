import { formatJson } from "../functions/formatJson.js";
import { getResultCount } from "../functions/getResultCount.js";
import { logError } from "../functions/logger.js";

export const getSearchResultCount = async (req, res) => {
  try {
    let response = {};
    response = await getResultCount(req.query);
    return res.status(200).send(formatJson(response, req.query.indent));
  } catch (message) {
    logError({ req, message });
    return res.status(400).send({ status: "error" });
  }
};
