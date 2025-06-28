import mongoose, { Document, Schema, Model, Types } from "mongoose";

// Define an interface for the Conversation document
export interface IConversation extends Document {
  groupTitle?: string;
  members: Types.ObjectId[];
  lastMessage?: string;
  lastMessageId?: string;
}

// Create the schema with types
const ConversationSchema: Schema<IConversation> = new Schema(
  {
    groupTitle: {
      type: String,
    },
    members: [
      {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    ], // Optional: Reference to a User model if you plan to populate
    lastMessage: {
      type: String,
    },
    lastMessageId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.model(
  "Conversation",
  ConversationSchema
);
export default Conversation;
