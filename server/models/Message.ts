import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the Messages document
export interface IMessage extends Document {
  conversationId?: string;
  text?: string;
  sender?: string;
  images?: {
    public_id?: string;
    url?: string;
  };
}

// Create the schema with types
const MessageSchema: Schema<IMessage> = new Schema(
  {
    conversationId: {
      type: String,
    },
    text: {
      type: String,
    },
    sender: {
      type: String,
    },
    images: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model('Message', MessageSchema);
export default Message;
