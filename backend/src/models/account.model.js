import mongoose,{Schema} from "mongoose";
const accountSchema = new Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accountNumber: {
    type: String,
    unique: true,
    required: true
  },
  accountType: {
    type: String,
    enum: ["SAVINGS", "CURRENT"],
    default: "SAVINGS"
  },
  balance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"],
    default: "PENDING",
  },
},{
    timestamps: true
});

export const Account = mongoose.model('Account', accountSchema);