const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      sparse: true
    },

    registrationNumber: {
      type: String,
      unique: true,
      sparse: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    photo: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);