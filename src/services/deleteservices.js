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

export const deleteLeaveApproverDepartment = async (id) => {
  const { error } = await supabase
    .from("can_approve_leave")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting leave approver department:", error);
    throw error;
  }

  return true;
};

export const deleteEmployee = async (id) => {
  console.log("delete id",id);
}