// rs-demo03/src/api/admin/custom/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getVariantAvailability } from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/medusa";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // The query parameters you expect from the API call.
    // In an admin route, you might want to require these.
    const { variant_ids, sales_channel_id } = req.query;

    // --- Input Validation (Important) ---
    // Check if the required parameters are present.
    if (!variant_ids || !sales_channel_id) {
      res.status(400).json({
        message: "Missing 'variant_ids' or 'sales_channel_id' in the query parameters."
      });
      return;
    }

    // Ensure variant_ids is an array of strings.
    const ids = Array.isArray(variant_ids)
      ? (variant_ids as string[])
      : [(variant_ids as string)];

    // --- Access the Medusa Container ---
    // The container is available on the request object.
    const container: MedusaContainer = req.scope;

    // Resolve the 'query' instance from the container.
    const query = container.resolve("query");

    // --- Call the utility function ---
    const availability = await getVariantAvailability(query, {
      variant_ids: ids,
      sales_channel_id: sales_channel_id as string,
    });

    // --- Respond with the result ---
    // The utility function returns a dictionary.
    // Example: { "variant_123": { "availability": 10, ... } }
    res.status(200).json({ availability });

  } catch (error) {
    // --- Error Handling ---
    console.error("Error fetching variant availability:", error);

    // Send a meaningful error response.
    res.status(500).json({
      message: "An internal server error occurred while fetching availability.",
      error: error.message
    });
  }
}