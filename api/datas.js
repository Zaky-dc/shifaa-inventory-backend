import mongoose from "mongoose";
import Contagem from "../models/Contagem.js";

mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  try {
    const registros = await Contagem.aggregate([
      { $group: { _id: { data: "$data", armazem: "$armazem" } } },
      { $project: { _id: 0, data: "$_id.data", armazem: "$_id.armazem" } },
      { $sort: { data: -1 } }
    ]);
    res.status(200).json(registros);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar datas." });
  }
}
