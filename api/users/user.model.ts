import mongoose from 'mongoose';
import bcrypt from "bcryptjs";


interface IUser extends mongoose.Document {
  email: string;
  password: string

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  }
}, { timestamps: true });


userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(String(candidatePassword), this.password);
  } catch (error) {
    throw new Error(`Validation data error ${error}`, );
  }
};



export const User = mongoose.model<IUser>('User', userSchema);
