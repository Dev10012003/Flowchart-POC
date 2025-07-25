import Flowchart from "../models/Flowchart.js";

export const createFlowchart = async (req, res) => {
  try {
    const { imageUrl, flowchartData } = req.body;

    const data = new Flowchart({ imageUrl, flowchartData });
    await data.save();

    return res.status(201).json({
      success: true,
      message: "Flowchart created successfully.",
      data: data,
    });
  } catch (error) {
    console.error("Create Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while creating flowchart.",
    });
  }
};

export const getFlowchartData = async (req, res) => {
  try {
    const flowchart = await Flowchart.findOne({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, flowchart });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "get flowchart server error",
    });
  }
};

export const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const flowchart = await Flowchart.findById(id);
    if (!flowchart)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: flowchart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFlowchart = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, flowchartData } = req.body;

    const data = await Flowchart.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found." });
    }

    const updated = await Flowchart.findByIdAndUpdate(id, {
      imageUrl,
      flowchartData,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Flowchart not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Flowchart updated successfully.",
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while updating flowchart.",
    });
  }
};
