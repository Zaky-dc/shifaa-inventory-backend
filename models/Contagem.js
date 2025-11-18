import mongoose from "mongoose";

const ContagemSchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  sistema: Number,
  real: Number,
  diferenca: Number,
  data: String,
  armazem: { type: String, required: true },
  status: { type: String, default: "finalizado" },
});

export default mongoose.models.Contagem || mongoose.model("Contagem", ContagemSchema);
