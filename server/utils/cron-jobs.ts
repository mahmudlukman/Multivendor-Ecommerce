import Event from "../models/Event";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";
import cron from "node-cron";

// Run every hour (adjust schedule as needed, e.g., "0 */1 * * *" for every hour)
export const deleteExpiredEvents = () => {
    cron.schedule(
  "0 */1 * * *", async () => {
    try {
      const now = new Date();
      // Find events where Finish_Date is in the past
      const expiredEvents = await Event.find({
        Finish_Date: { $lt: now },
      });

      if (expiredEvents.length === 0) {
        console.log("No expired events to delete");
        return;
      }

      // Delete each expired event
      for (const event of expiredEvents) {
        try {
          // Delete associated Cloudinary images
          for (const image of event.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
          }

          // Delete the event
          await Event.findByIdAndDelete(event._id);
          console.log(`Deleted expired event: ${event._id} - ${event.name}`);
        } catch (error: any) {
          console.error(`Failed to delete event ${event._id}:`, error.message);
        }
      }

      console.log(`Deleted ${expiredEvents.length} expired events`);
    } catch (error: any) {
      console.error("Error in deleteExpiredEvents cron job:", error.message);
      throw new ErrorHandler(error.message, 500);
    }
  })
}