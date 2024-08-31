import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the Conversation document
export interface IConversation extends Document {
  groupTitle?: string;
  members: string[];
  lastMessage?: string;
  lastMessageId?: string;
}

// Create the schema with types
const ConversationSchema: Schema<IConversation> = new Schema(
  {
    groupTitle: {
      type: String,
    },
    members: {
      type: [String],
      required: true,
    },
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
  'Conversation',
  ConversationSchema
);
export default Conversation;
