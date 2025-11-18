import mongoose from "mongoose";

const ArmazemSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
});

export default mongoose.models.Armazem || mongoose.model("Armazem", ArmazemSchema);
