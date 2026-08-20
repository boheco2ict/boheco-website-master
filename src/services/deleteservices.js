import { supabase } from "../supabase";

export const deleteAdvisory = async (id) => {
  try {
    if (!id) {
      throw new Error("Advisory ID is required.");
    }

    const { error } = await supabase
      .from("power_rate_advisories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(
      "Error deleting power rate advisory:",
      error
    );
    return false;
  }
};

export const deleteGenerationCharge = async (id) => {
  try {
    if (!id) {
      throw new Error("ID is required.");
    }

    const { error } = await supabase
      .from("generation_charge")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(
      "Error deleting generation charge:",
      error
    );
    return false;
  }
};