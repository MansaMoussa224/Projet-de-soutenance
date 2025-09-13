import mongoose from 'mongoose';

const privilegeSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ex: 'can_edit_user'
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('Privilege', privilegeSchema);
